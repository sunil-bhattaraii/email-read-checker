"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import type { Pixel } from "@/lib/types";
import GeneratePanel from "@/components/GeneratePanel";
import PixelsTable from "@/components/PixelsTable";
import Instructions from "@/components/Instructions";

export default function Dashboard({ username }: { username: string }) {
  const router = useRouter();
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPixels = useCallback(async (): Promise<Pixel[]> => {
    const res = await fetch("/api/pixels");
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.pixels ?? [];
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchPixels()
      .then((list) => {
        if (!cancelled) setPixels(list);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchPixels]);

  async function refresh() {
    setLoading(true);
    try {
      setPixels(await fetchPixels());
    } catch {
      // Keep the previous list on failure.
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function handleCreated(pixel: Pixel) {
    setPixels((prev) => [pixel, ...prev]);
  }

  async function handleDelete(pixelId: string) {
    const res = await fetch(`/api/pixels/${pixelId}`, { method: "DELETE" });
    if (res.ok) {
      setPixels((prev) => prev.filter((p) => p.pixelId !== pixelId));
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
            Signed in as {username}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </header>

      <GeneratePanel onCreated={handleCreated} />
      <PixelsTable
        pixels={pixels}
        loading={loading}
        onRefresh={refresh}
        onDelete={handleDelete}
      />
      <Instructions />
    </main>
  );
}
