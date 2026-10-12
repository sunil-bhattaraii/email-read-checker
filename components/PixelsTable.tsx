"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Eye,
  RefreshCw,
  RotateCcw,
  Trash2,
} from "lucide-react";
import type { Pixel } from "@/lib/types";
import type { ViewsImageTheme } from "@/lib/views-image";
import PixelResult from "@/components/PixelResult";
import ViewsAnalytics from "@/components/ViewsAnalytics";

function formatDate(value: string | null): string {
  if (!value) return "Never";
  return new Date(value).toLocaleString();
}

function pixelUrl(pixelId: string): string {
  return `${window.location.origin}/p/${pixelId}`;
}

function viewsImageUrl(
  pixelId: string,
  theme: ViewsImageTheme = "light"
): string {
  return `${window.location.origin}/p/${pixelId}/views-image?theme=${theme}`;
}

export default function PixelsTable({
  pixels,
  loading,
  onRefresh,
  onDelete,
  onReset,
}: {
  pixels: Pixel[];
  loading: boolean;
  onRefresh: () => void;
  onDelete: (pixelId: string) => void;
  onReset: (pixelId: string) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedBadgeId, setCopiedBadgeId] = useState<string | null>(null);
  const [badgeTheme, setBadgeTheme] = useState<ViewsImageTheme>("light");
  const [previewRev, setPreviewRev] = useState(0);
  const [refreshTick, setRefreshTick] = useState(0);
  const [resetTarget, setResetTarget] = useState<Pixel | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Pixel | null>(null);

  async function copyUrl(pixelId: string) {
    await navigator.clipboard.writeText(pixelUrl(pixelId));
    setCopiedId(pixelId);
    setTimeout(() => setCopiedId(null), 1500);
  }

  async function copyBadge(pixelId: string) {
    await navigator.clipboard.writeText(viewsImageUrl(pixelId, badgeTheme));
    setCopiedBadgeId(pixelId);
    setTimeout(() => setCopiedBadgeId(null), 1500);
  }

  function toggleRow(pixelId: string) {
    setExpandedId((cur) => {
      const next = cur === pixelId ? null : pixelId;
      if (next) setPreviewRev((r) => r + 1);
      return next;
    });
  }

  function changeBadgeTheme(theme: ViewsImageTheme) {
    setBadgeTheme(theme);
    setPreviewRev((r) => r + 1);
  }

  function handleRefresh() {
    onRefresh();
    setRefreshTick((t) => t + 1);
  }

  function confirmReset() {
    if (!resetTarget) return;
    onReset(resetTarget.pixelId);
    setResetTarget(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    onDelete(deleteTarget.pixelId);
    setDeleteTarget(null);
  }

  return (
    <section className="mt-6 rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Your counters
          <span className="ml-2 text-xs font-normal text-neutral-500 dark:text-neutral-400">
            {pixels.length} total
          </span>
        </h2>
        <button
          onClick={handleRefresh}
          title="Refresh"
          className="flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>
      {pixels.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
          No counters yet. Create one above.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                <th className="px-6 py-3 font-medium">Purpose</th>
                <th className="px-6 py-3 font-medium">Tracking URL</th>
                <th className="px-6 py-3 font-medium">Views</th>
                <th className="px-6 py-3 font-medium">Last viewed</th>
                <th className="px-6 py-3 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {pixels.map((pixel) => {
                const expanded = expandedId === pixel.pixelId;
                return (
                  <FragmentRow
                    key={pixel.pixelId}
                    pixel={pixel}
                    expanded={expanded}
                    copiedId={copiedId}
                    copiedBadgeId={copiedBadgeId}
                    badgeTheme={badgeTheme}
                    previewRev={previewRev}
                    refreshToken={refreshTick}
                    onCopyUrl={copyUrl}
                    onCopyBadge={copyBadge}
                    onBadgeThemeChange={changeBadgeTheme}
                    onToggle={toggleRow}
                    onResetRequest={(pixel) => setResetTarget(pixel)}
                    onDeleteRequest={(pixel) => setDeleteTarget(pixel)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 dark:bg-black/60">
          <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Reset views?
            </h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              This resets the view count for{" "}
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {resetTarget.purpose}
              </span>{" "}
              to 0 and clears the last viewed time. This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setResetTarget(null)}
                className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 dark:bg-black/60">
          <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Delete counter?
            </h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              This permanently deletes{" "}
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {deleteTarget.purpose}
              </span>{" "}
              and its view history. This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function FragmentRow({
  pixel,
  expanded,
  copiedId,
  copiedBadgeId,
  badgeTheme,
  previewRev,
  refreshToken,
  onCopyUrl,
  onCopyBadge,
  onBadgeThemeChange,
  onToggle,
  onResetRequest,
  onDeleteRequest,
}: {
  pixel: Pixel;
  expanded: boolean;
  copiedId: string | null;
  copiedBadgeId: string | null;
  badgeTheme: ViewsImageTheme;
  previewRev: number;
  refreshToken: number;
  onCopyUrl: (pixelId: string) => void;
  onCopyBadge: (pixelId: string) => void;
  onBadgeThemeChange: (theme: ViewsImageTheme) => void;
  onToggle: (pixelId: string) => void;
  onResetRequest: (pixel: Pixel) => void;
  onDeleteRequest: (pixel: Pixel) => void;
}) {
  return (
    <>
      <tr
        onClick={() => onToggle(pixel.pixelId)}
        aria-expanded={expanded}
        className={`cursor-pointer ${
          expanded
            ? "bg-neutral-50 dark:bg-neutral-800/50"
            : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
        }`}
      >
        <td className="max-w-[200px] px-6 py-3 text-neutral-900 dark:text-neutral-100">
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
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopyUrl(pixel.pixelId);
              }}
              title="Copy URL"
              className="group inline-flex items-center gap-1.5 font-mono text-xs text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400"
            >
              <span className="max-w-[220px] truncate">
                /p/{pixel.pixelId}
              </span>
              {copiedId === pixel.pixelId ? (
                <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopyBadge(pixel.pixelId);
              }}
              title="Copy badge image URL"
              aria-label="Copy badge image URL"
              className="rounded-md p-1 text-neutral-400 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {copiedBadgeId === pixel.pixelId ? (
                <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </td>
        <td className="px-6 py-3">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {pixel.opens}
          </span>
        </td>
        <td className="px-6 py-3 text-neutral-600 dark:text-neutral-400">
          {formatDate(pixel.lastOpenedAt)}
        </td>
        <td className="px-6 py-3 text-right">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResetRequest(pixel);
            }}
            title="Reset views"
            className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/40 dark:hover:text-amber-400"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteRequest(pixel);
            }}
            title="Delete counter"
            className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-neutral-50/60 dark:bg-neutral-900/40">
          <td colSpan={5} className="px-6 py-4">
            <PixelResult url={pixelUrl(pixel.pixelId)} />
            <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  View-count badge
                </p>
                <div className="flex rounded-md bg-neutral-100 p-0.5 dark:bg-neutral-800">
                  <button
                    type="button"
                    onClick={() => onBadgeThemeChange("light")}
                    className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                      badgeTheme === "light"
                        ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100"
                        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    }`}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => onBadgeThemeChange("dark")}
                    className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                      badgeTheme === "dark"
                        ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100"
                        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => onBadgeThemeChange("neutral")}
                    className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                      badgeTheme === "neutral"
                        ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100"
                        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    }`}
                  >
                    Neutral
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- dynamic SVG badge from the views-image API */}
                <img
                  src={`${viewsImageUrl(pixel.pixelId, badgeTheme)}&t=${previewRev}-${refreshToken}`}
                  alt="View-count badge"
                  className="h-7 shrink-0 rounded-full border border-neutral-200 dark:border-neutral-700"
                />
                <div className="w-0 min-w-0 flex-1 truncate rounded-md border border-neutral-300 bg-neutral-50 px-3 py-1.5 font-mono text-xs text-neutral-700 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300">
                  {viewsImageUrl(pixel.pixelId, badgeTheme)}
                </div>
                <button
                  type="button"
                  onClick={() => onCopyBadge(pixel.pixelId)}
                  title="Copy badge image URL"
                  className="flex shrink-0 items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  {copiedBadgeId === pixel.pixelId ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            <ViewsAnalytics
              pixelId={pixel.pixelId}
              refreshToken={refreshToken}
            />
          </td>
        </tr>
      )}
    </>
  );
}
