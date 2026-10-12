import { createHash } from "node:crypto";

export const VIEW_WINDOW_MS = 5 * 60 * 1000;

export function getClientIp(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip");
  if (real) {
    const trimmed = real.trim();
    if (trimmed) return trimmed;
  }
  return null;
}

export function hashIp(ip: string): string {
  const secret =
    process.env.IP_HASH_SECRET || process.env.JWT_SECRET || "readmail";
  return createHash("sha256").update(`${secret}:${ip}`).digest("base64url");
}
