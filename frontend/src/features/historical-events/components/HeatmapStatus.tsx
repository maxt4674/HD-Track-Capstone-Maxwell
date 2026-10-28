interface HeatmapStatusProps {
  count: number | null;
}

export default function HeatmapStatus({
  count,
}: HeatmapStatusProps) {
  return (
    <div className="mt-5 rounded-lg border
                    border-slate-200 bg-slate-50
                    px-6 py-5">
      <div className="flex items-center gap-3">
        <span className="text-lg text-[#1A2E61]">
          Matching Events:
        </span>

        <span className="text-2xl font-bold text-[#1A2E61]">
          {count === null ? "—" : count}
        </span>
      </div>
    </div>
  );
}