"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import type { Pixel } from "@/lib/types";
import PixelResult from "@/components/PixelResult";

export default function GeneratePanel({
  createPixel,
}: {
  createPixel: (
    purpose: string
  ) => Promise<{ pixel: Pixel; url: string }>;
}) {
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ url: string } | null>(null);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!purpose.trim()) {
      setError("Enter a purpose first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { url } = await createPixel(purpose.trim());
      setResult({ url });
      setPurpose("");
    } catch {
      setError("Failed to generate pixel.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-neutral-900">Create a pixel</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Give the pixel a purpose so you can recognize it later.
      </p>
      <form onSubmit={generate} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="e.g. Newsletter issue 12, welcome email"
          className="flex-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
        <button
          type="submit"
          disabled={busy}
          className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Generate pixel
        </button>
      </form>
      {error && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {result && (
        <div className="mt-5 border-t border-neutral-200 pt-5">
          <PixelResult url={result.url} />
        </div>
      )}
    </section>
  );
}
