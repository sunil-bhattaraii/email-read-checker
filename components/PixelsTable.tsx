"use client";

import { useState } from "react";
import { Check, ChevronDown, Copy, RefreshCw, Trash2 } from "lucide-react";
import type { Pixel } from "@/lib/types";
import PixelResult from "@/components/PixelResult";

function formatDate(value: string | null): string {
  if (!value) return "Never";
  return new Date(value).toLocaleString();
}

function pixelUrl(pixelId: string): string {
  return `${window.location.origin}/p/${pixelId}`;
}

export default function PixelsTable({
  pixels,
  loading,
  onRefresh,
  onDelete,
}: {
  pixels: Pixel[];
  loading: boolean;
  onRefresh: () => void;
  onDelete: (pixelId: string) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyUrl(pixelId: string) {
    await navigator.clipboard.writeText(pixelUrl(pixelId));
    setCopiedId(pixelId);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function toggleRow(pixelId: string) {
    setExpandedId((cur) => (cur === pixelId ? null : pixelId));
  }

  return (
    <section className="mt-6 rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
        <h2 className="text-sm font-semibold text-neutral-900">
          Your pixels
          <span className="ml-2 text-xs font-normal text-neutral-500">
            {pixels.length} total
          </span>
        </h2>
        <button
          onClick={onRefresh}
          title="Refresh"
          className="flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>
      {pixels.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-neutral-500">
          No pixels yet. Create one above.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
                <th className="px-6 py-3 font-medium">Purpose</th>
                <th className="px-6 py-3 font-medium">Tracking URL</th>
                <th className="px-6 py-3 font-medium">Opens</th>
                <th className="px-6 py-3 font-medium">Last opened</th>
                <th className="px-6 py-3 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {pixels.map((pixel) => {
                const expanded = expandedId === pixel.pixelId;
                return (
                  <FragmentRow
                    key={pixel.pixelId}
                    pixel={pixel}
                    expanded={expanded}
                    copiedId={copiedId}
                    onCopyUrl={copyUrl}
                    onToggle={toggleRow}
                    onDelete={onDelete}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function FragmentRow({
  pixel,
  expanded,
  copiedId,
  onCopyUrl,
  onToggle,
  onDelete,
}: {
  pixel: Pixel;
  expanded: boolean;
  copiedId: string | null;
  onCopyUrl: (pixelId: string) => void;
  onToggle: (pixelId: string) => void;
  onDelete: (pixelId: string) => void;
}) {
  return (
    <>
      <tr
        onClick={() => onToggle(pixel.pixelId)}
        aria-expanded={expanded}
        className={`cursor-pointer ${expanded ? "bg-neutral-50" : "hover:bg-neutral-50"}`}
      >
        <td className="max-w-[200px] px-6 py-3 text-neutral-900">
          <span className="flex items-center gap-1.5">
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 text-neutral-400 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
            <span className="line-clamp-1">{pixel.purpose}</span>
          </span>
        </td>
        <td className="px-6 py-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopyUrl(pixel.pixelId);
            }}
            title="Copy URL"
            className="group inline-flex items-center gap-1.5 font-mono text-xs text-neutral-600 hover:text-indigo-600"
          >
            <span className="max-w-[220px] truncate">
              /p/{pixel.pixelId}
            </span>
            {copiedId === pixel.pixelId ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            )}
          </button>
        </td>
        <td className="px-6 py-3">
          <span className="font-medium text-neutral-900">{pixel.opens}</span>
        </td>
        <td className="px-6 py-3 text-neutral-600">
          {formatDate(pixel.lastOpenedAt)}
        </td>
        <td className="px-6 py-3 text-right">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(pixel.pixelId);
            }}
            title="Delete pixel"
            className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-neutral-50/60">
          <td colSpan={5} className="px-6 py-4">
            <PixelResult url={pixelUrl(pixel.pixelId)} />
          </td>
        </tr>
      )}
    </>
  );
}
