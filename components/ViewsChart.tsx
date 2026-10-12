export type ChartPoint = { label: string; value: number };

export default function ViewsChart({
  points,
  height = 96,
}: {
  points: ChartPoint[];
  height?: number;
}) {
  const max = Math.max(1, ...points.map((p) => p.value));
  const mid = Math.floor(points.length / 2);

  return (
    <div>
      <div
        className="flex items-end gap-px border-b border-neutral-200"
        style={{ height }}
      >
        {points.map((p, i) => (
          <div
            key={i}
            title={`${p.label}: ${p.value}`}
            className="flex-1 rounded-t bg-indigo-500/80 transition-colors hover:bg-indigo-600"
            style={{
              height: p.value > 0 ? Math.max(2, Math.round((p.value / max) * (height - 2))) : 0,
            }}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-neutral-400">
        <span>{points[0]?.label}</span>
        {points.length > 2 && <span>{points[mid]?.label}</span>}
        <span>{points[points.length - 1]?.label}</span>
      </div>
    </div>
  );
}
