import { connectDB } from "@/lib/db";
import { Pixel } from "@/models/Pixel";
import { ViewBucket } from "@/models/ViewBucket";
import { hourKey } from "@/lib/buckets";

type PendingPixel = { count: number; lastAt: Date };
type PendingBucket = { pixelId: string; hour: string; count: number; at: Date };

type ViewBuffer = {
  pixels: Map<string, PendingPixel>;
  buckets: Map<string, PendingBucket>;
  lastFlushAt: number;
  flushing: boolean;
};

const DEFAULT_FLUSH_INTERVAL_MS = 60_000;
const MIN_FLUSH_INTERVAL_MS = 5_000;
const MAX_PENDING = 5_000;

function resolveFlushIntervalMs(): number {
  const raw = Number(process.env.VIEW_FLUSH_INTERVAL_MS);
  if (!Number.isFinite(raw) || raw <= 0) return DEFAULT_FLUSH_INTERVAL_MS;
  return Math.max(MIN_FLUSH_INTERVAL_MS, Math.floor(raw));
}

const FLUSH_INTERVAL_MS = resolveFlushIntervalMs();

declare global {
  var __viewBuffer: ViewBuffer | undefined;
  var __viewFlushHooksBound: boolean | undefined;
}

const buffer: ViewBuffer = globalThis.__viewBuffer ?? {
  pixels: new Map(),
  buckets: new Map(),
  lastFlushAt: Date.now(),
  flushing: false,
};
globalThis.__viewBuffer = buffer;

export function bufferView(pixelId: string, now: Date): void {
  const pixel = buffer.pixels.get(pixelId);
  if (pixel) {
    pixel.count += 1;
    pixel.lastAt = now;
  } else {
    buffer.pixels.set(pixelId, { count: 1, lastAt: now });
  }

  const hour = hourKey(now);
  const key = `${pixelId}:${hour}`;
  const bucket = buffer.buckets.get(key);
  if (bucket) {
    bucket.count += 1;
    bucket.at = now;
  } else {
    buffer.buckets.set(key, { pixelId, hour, count: 1, at: now });
  }
}

export function pendingCount(): number {
  return buffer.pixels.size + buffer.buckets.size;
}

export async function flushViews(): Promise<void> {
  if (buffer.flushing) return;
  if (buffer.pixels.size === 0 && buffer.buckets.size === 0) {
    buffer.lastFlushAt = Date.now();
    return;
  }

  buffer.flushing = true;
  const pixels = [...buffer.pixels.entries()];
  const buckets = [...buffer.buckets.values()];
  buffer.pixels.clear();
  buffer.buckets.clear();
  buffer.lastFlushAt = Date.now();

  try {
    await connectDB({ timeoutMS: 5000 });
    if (pixels.length > 0) {
      await Pixel.bulkWrite(
        pixels.map(([pixelId, value]) => ({
          updateOne: {
            filter: { pixelId },
            update: {
              $inc: { opens: value.count },
              $set: { lastOpenedAt: value.lastAt },
              $setOnInsert: { purpose: "" },
            },
            upsert: true,
          },
        })),
        { ordered: false }
      );
    }
    if (buckets.length > 0) {
      await ViewBucket.bulkWrite(
        buckets.map((bucket) => ({
          updateOne: {
            filter: { pixelId: bucket.pixelId, hour: bucket.hour },
            update: { $inc: { count: bucket.count }, $set: { at: bucket.at } },
            upsert: true,
          },
        })),
        { ordered: false }
      );
    }
  } catch {
    // Merge the batch back so it is retried on the next flush.
    for (const [pixelId, value] of pixels) {
      const current = buffer.pixels.get(pixelId);
      if (current) {
        current.count += value.count;
        if (value.lastAt > current.lastAt) current.lastAt = value.lastAt;
      } else {
        buffer.pixels.set(pixelId, value);
      }
    }
    for (const bucket of buckets) {
      const key = `${bucket.pixelId}:${bucket.hour}`;
      const current = buffer.buckets.get(key);
      if (current) {
        current.count += bucket.count;
        if (bucket.at > current.at) current.at = bucket.at;
      } else {
        buffer.buckets.set(key, bucket);
      }
    }
  } finally {
    buffer.flushing = false;
  }
}

export function maybeFlush(): Promise<void> {
  const stale = Date.now() - buffer.lastFlushAt >= FLUSH_INTERVAL_MS;
  if (stale || pendingCount() >= MAX_PENDING) return flushViews();
  return Promise.resolve();
}

let timer: ReturnType<typeof setInterval> | null = null;

function bindProcessHooks(): void {
  if (globalThis.__viewFlushHooksBound) return;
  globalThis.__viewFlushHooksBound = true;
  const flush = () => {
    flushViews().catch(() => {});
  };
  process.once("SIGTERM", flush);
  process.once("SIGINT", flush);
  process.on("beforeExit", flush);
}

export function startFlushTimer(): void {
  bindProcessHooks();
  if (timer) return;
  timer = setInterval(() => {
    flushViews().catch(() => {});
  }, FLUSH_INTERVAL_MS);
  if (typeof timer.unref === "function") timer.unref();
}
