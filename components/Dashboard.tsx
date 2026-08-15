"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LogOut } from "lucide-react";
import type { Pixel, SessionUser } from "@/lib/types";
import {
  addGuestOwnedPixel,
  clearGuestPixels,
  genPixelId,
  loadGuestPixels,
  pixelUrl,
  saveGuestPixels,
} from "@/lib/guest";
import GeneratePanel from "@/components/GeneratePanel";
import PixelsTable from "@/components/PixelsTable";
import Instructions from "@/components/Instructions";

export default function Dashboard({ user }: { user: SessionUser | null }) {
  const router = useRouter();
  const [pixels, setPixels] = useState<Pixel[]>(() =>
    user ? [] : loadGuestPixels()
  );
  const [loading, setLoading] = useState(Boolean(user));

  const fetchPixels = useCallback(async (): Promise<Pixel[]> => {
    const res = await fetch("/api/pixels");
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.pixels ?? [];
  }, []);

  const mergeOpens = useCallback(async (list: Pixel[]): Promise<Pixel[]> => {
    const ids = list.map((p) => p.pixelId);
    if (!ids.length) return list;
    try {
      const res = await fetch(
        `/api/pixels/opens?ids=${encodeURIComponent(ids.join(","))}`
      );
      if (!res.ok) return list;
      const data = await res.json();
      const remote: {
        pixelId: string;
        opens: number;
        lastOpenedAt: string | null;
      }[] = data.pixels ?? [];
      const byId = new Map(remote.map((p) => [p.pixelId, p] as const));
      return list.map((p) => {
        const s = byId.get(p.pixelId);
        return s
          ? { ...p, opens: s.opens, lastOpenedAt: s.lastOpenedAt }
          : p;
      });
    } catch {
      return list;
    }
  }, []);

  useEffect(() => {
    if (!user) {
      saveGuestPixels(pixels);
      return;
    }
  }, [user, pixels]);

  useEffect(() => {
    if (user) return;
    let cancelled = false;
    (async () => {
      const base = loadGuestPixels();
      const merged = await mergeOpens(base);
      if (!cancelled && merged.length) setPixels(merged);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, mergeOpens]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const guest = loadGuestPixels();
      if (guest.length) {
        try {
          const res = await fetch("/api/pixels/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pixels: guest.map((p) => ({
                pixelId: p.pixelId,
                purpose: p.purpose,
              })),
            }),
          });
          if (res.ok) clearGuestPixels();
        } catch {
          // Keep guest pixels for the next sync attempt.
        }
      }
      if (cancelled) return;
      try {
        const list = await fetchPixels();
        if (!cancelled) setPixels(list);
      } catch {
        // Keep the empty list on failure.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, fetchPixels]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  async function createPixel(
    purpose: string
  ): Promise<{ pixel: Pixel; url: string }> {
    if (user) {
      const res = await fetch("/api/pixels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to generate pixel.");
      }
      setPixels((prev) => [data.pixel, ...prev]);
      return { pixel: data.pixel, url: data.url };
    }
    const pixel: Pixel = {
      pixelId: genPixelId(),
      purpose,
      opens: 0,
      lastOpenedAt: null,
      createdAt: new Date().toISOString(),
    };
    addGuestOwnedPixel(pixel.pixelId);
    setPixels((prev) => [pixel, ...prev]);
    return { pixel, url: pixelUrl(pixel.pixelId) };
  }

  async function handleDelete(pixelId: string) {
    if (!user) {
      setPixels((prev) => prev.filter((p) => p.pixelId !== pixelId));
      return;
    }
    const res = await fetch(`/api/pixels/${pixelId}`, { method: "DELETE" });
    if (res.ok) {
      setPixels((prev) => prev.filter((p) => p.pixelId !== pixelId));
    }
  }

  async function handleReset(pixelId: string) {
    const reset = (prev: Pixel[]) =>
      prev.map((p) =>
        p.pixelId === pixelId ? { ...p, opens: 0, lastOpenedAt: null } : p
      );
    if (!user) {
      setPixels(reset);
      return;
    }
    const res = await fetch(`/api/pixels/${pixelId}`, { method: "PATCH" });
    if (res.ok) {
      setPixels(reset);
    }
  }

  async function refresh() {
    if (!user) {
      setPixels(await mergeOpens(loadGuestPixels()));
      return;
    }
    setLoading(true);
    try {
      setPixels(await fetchPixels());
    } catch {
      // Keep the previous list on failure.
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">
            Email Read Checker
          </h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            {user
              ? `Signed in as ${user.username}`
              : "Pixels are saved in this browser until you sign in."}
          </p>
        </div>
        {user ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </Link>
        )}
      </header>

      <GeneratePanel createPixel={createPixel} />
      <PixelsTable
        pixels={pixels}
        loading={loading}
        onRefresh={refresh}
        onDelete={handleDelete}
        onReset={handleReset}
      />
      <Instructions />
    </main>
  );
}
