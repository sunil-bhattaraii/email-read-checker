"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/visits", { method: "POST" });
        const data = await res.json();
        if (!cancelled) {
          setVisits(typeof data.count === "number" ? data.count : null);
        }
      } catch {
        // Leave the count hidden on failure.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-between gap-1 px-4 py-4 text-xs text-neutral-500 sm:flex-row">
        <p>© {new Date().getFullYear()} ReadMail</p>
        <p>
          {visits == null
            ? "Page visits…"
            : `${visits.toLocaleString()} page visits`}
        </p>
      </div>
    </footer>
  );
}
