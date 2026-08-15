"use client";

import { useRef, useState } from "react";
import { Check, Code2, Copy } from "lucide-react";
import { pixelImgTag } from "@/lib/pixel";

export default function PixelResult({ url }: { url: string }) {
  const boxRef = useRef<HTMLButtonElement>(null);
  const [mode, setMode] = useState<"url" | "code">("code");
  const [copied, setCopied] = useState(false);
  const [copiedPixel, setCopiedPixel] = useState(false);

  const value = mode === "url" ? url : pixelImgTag(url);

  async function writePixelToClipboard() {
    const html = pixelImgTag(url);
    if (navigator.clipboard?.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([url], { type: "text/plain" }),
        }),
      ]);
    } else {
      throw new Error("unsupported");
    }
  }

  async function copyPixel() {
    try {
      await writePixelToClipboard();
    } catch {
      // Fallback: select the box contents and copy them.
      const box = boxRef.current;
      if (box) {
        const range = document.createRange();
        range.selectNodeContents(box);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        document.execCommand("copy");
        selection?.removeAllRanges();
      }
    }
    setCopiedPixel(true);
    setTimeout(() => setCopiedPixel(false), 1500);
  }

  async function copy() {
    if (mode === "code") {
      await copyPixel();
    } else {
      await navigator.clipboard.writeText(url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      <p className="text-sm text-neutral-500">
        {mode === "url"
          ? "Copy the URL to use in an image tag in your email."
          : "Copy the pixel and paste it into your email."}
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
          title={mode === "url" ? "Copy URL" : "Copy pixel"}
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
      <button
        type="button"
        ref={boxRef}
        onClick={copyPixel}
        title="Click to copy the pixel"
        className={`mt-3 block w-full cursor-pointer select-all rounded-md border border-dashed px-3 py-2 text-left transition-colors ${
          copiedPixel
            ? "border-green-500 bg-green-50"
            : "border-neutral-300 bg-neutral-50 hover:border-indigo-400"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- must use a raw img so the real tracking URL is used and can be copied */}
        <img
          src={url}
          alt=""
          width={1}
          height={1}
          title="Tracking pixel (invisible)"
        />
      </button>
      <p className="mt-1 select-none text-xs text-neutral-500">
        {copiedPixel
          ? "Copied. Paste it into your email."
          : "Click the box to copy the pixel, then paste it into your email."}
      </p>
    </div>
  );
}
