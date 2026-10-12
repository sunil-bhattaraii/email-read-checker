"use client";

import { useEffect, useState } from "react";
import ViewsChart, { type ChartPoint } from "@/components/ViewsChart";

type Series = {
  daily: ChartPoint[];
  hourly: ChartPoint[];
};

type Range = "7d" | "30d" | "90d" | "48h";

const RANGE_DAYS: Record<Exclude<Range, "48h">, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

const RANGES: { value: Range; label: string }[] = [
  { value: "48h", label: "48 hours" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
];

function formatHour(t: string): string {
  const d = new Date(`${t}:00:00Z`);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    timeZone: "UTC",
  });
}

function formatDay(d: string): string {
  const date = new Date(`${d}T00:00:00Z`);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function ViewsAnalytics({
  pixelId,
  refreshToken = 0,
}: {
  pixelId: string;
  refreshToken?: number;
}) {
  const [data, setData] = useState<Series | null>(null);
  const [failed, setFailed] = useState(false);
  const [range, setRange] = useState<Range>("90d");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/pixels/${pixelId}/analytics`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(
        (json: {
          daily: { d: string; count: number }[];
          hourly: { t: string; count: number }[];
        }) => {
          if (cancelled) return;
          setData({
            daily: json.daily.map((p) => ({ label: formatDay(p.d), value: p.count })),
            hourly: json.hourly.map((p) => ({ label: formatHour(p.t), value: p.count })),
          });
        }
      )
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [pixelId, refreshToken]);

  const points = !data
    ? []
    : range === "48h"
      ? data.hourly
      : data.daily.slice(-RANGE_DAYS[range]);
  const total = points.reduce((sum, p) => sum + p.value, 0);
  const rangeLabel = range === "48h" ? "48 hours" : `${RANGE_DAYS[range]} days`;

  return (
    <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          Views over time
        </p>
        <div className="flex rounded-md bg-neutral-100 p-0.5 dark:bg-neutral-800">
          {RANGES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRange(r.value)}
              className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                range === r.value
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3">
        {failed ? (
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Couldn&apos;t load analytics.
          </p>
        ) : !data ? (
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Loading…
          </p>
        ) : (
          <>
            <p className="mb-1 text-xs text-neutral-500 dark:text-neutral-400">
              {total} view{total === 1 ? "" : "s"} in the last {rangeLabel}
            </p>
            <ViewsChart points={points} />
          </>
        )}
      </div>
    </div>
  );
}
