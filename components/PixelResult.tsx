"use client";

import { useRef, useState } from "react";
import { Check, Code2, Copy } from "lucide-react";
import { pixelImgTag } from "@/lib/pixel";

export default function PixelResult({ url }: { url: string }) {
  const copySourceRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"url" | "code">("code");
  const [copied, setCopied] = useState(false);

  const value = mode === "url" ? url : pixelImgTag(url);

  async function copy() {
    if (mode === "code") {
      try {
        await writePixelToClipboard();
      } catch {
        selectAndCopySource();
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function writePixelToClipboard() {
    if (navigator.clipboard?.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([pixelImgTag(url)], { type: "text/html" }),
          "text/plain": new Blob([url], { type: "text/plain" }),
        }),
      ]);
    } else {
      throw new Error("unsupported");
    }
  }

  function selectAndCopySource() {
    const el = copySourceRef.current;
    if (el) {
      const range = document.createRange();
      range.selectNodeContents(el);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      document.execCommand("copy");
      selection?.removeAllRanges();
    }
  }

  return (
    <div className="relative">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {mode === "url"
          ? "Copy the URL to use in an image tag."
          : "Copy the counter and paste it where you want to track views."}
      </p>
      <div className="mt-2 flex items-stretch gap-2">
        <div className="w-0 min-w-0 flex-1 truncate rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 font-mono text-xs text-neutral-700 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300">
          {value}
        </div>
        <button
          type="button"
          onClick={() => setMode(mode === "url" ? "code" : "url")}
          title={mode === "url" ? "Show img code" : "Show URL"}
          className="flex items-center justify-center rounded-md border border-neutral-900 bg-white px-3 text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-neutral-300 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <Code2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={copy}
          title={mode === "url" ? "Copy URL" : "Copy counter"}
          className="flex items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <div
        ref={copySourceRef}
        aria-hidden="true"
        className="pointer-events-none absolute opacity-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- selectable source element used by the copy fallback */}
        <img src={url} alt="" width={1} height={1} />
      </div>
    </div>
  );
}
