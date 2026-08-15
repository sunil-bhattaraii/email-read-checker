export default function Footer({ visits }: { visits: number | null }) {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-between gap-1 px-4 py-4 text-xs text-neutral-500 sm:flex-row">
        <p>© {new Date().getFullYear()} Email Read Checker</p>
        <p>
          {visits == null
            ? "Page visits unavailable"
            : `${visits.toLocaleString()} page visits`}
        </p>
      </div>
    </footer>
  );
}
