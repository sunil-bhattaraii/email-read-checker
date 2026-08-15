"use client";

import { useState } from "react";
import { Check, Code2, Copy } from "lucide-react";
import { pixelImgTag } from "@/lib/pixel";

export default function PixelResult({ url }: { url: string }) {
  const [mode, setMode] = useState<"url" | "code">("url");
  const [copied, setCopied] = useState(false);

  const value = mode === "url" ? url : pixelImgTag(url);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      <p className="text-sm text-neutral-500">
        {mode === "url"
          ? "Use this URL in the image tag of your email."
          : "Paste this img code into the HTML source of your email."}
      </p>
      <div className="mt-2 flex items-stretch gap-2">
        <div className="flex-1 truncate rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 font-mono text-xs text-neutral-700">
          {value}
        </div>
        <button
          type="button"
          onClick={() => setMode(mode === "url" ? "code" : "url")}
          title={mode === "url" ? "Show img code" : "Show URL"}
          className={`flex items-center justify-center rounded-md border px-3 text-neutral-600 transition-colors ${
            mode === "code"
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-neutral-300 bg-white hover:bg-neutral-100"
          }`}
        >
          <Code2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={copy}
          title="Copy to clipboard"
          className="flex items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
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
      <div className="mt-3 flex select-all items-center gap-2 rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-3 py-2">
        {/* eslint-disable-next-line @next/next/no-img-element -- must use a raw img so the real tracking URL is used and can be copied */}
        <img
          src={url}
          alt=""
          width={1}
          height={1}
          title="Tracking pixel (invisible)"
        />
        <span className="text-xs text-neutral-500">
          Rendered pixel. Right-click it and copy it, or select it and paste
          into your email.
        </span>
      </div>
    </div>
  );
}