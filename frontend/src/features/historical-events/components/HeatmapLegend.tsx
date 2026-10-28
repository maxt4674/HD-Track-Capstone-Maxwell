export default function HeatmapLegend() {
  return (
    <div className="absolute right-4 top-4 z-10
                    rounded-lg border border-slate-200
                    bg-white p-3 shadow-md">
      <div
        className="h-3 w-64 rounded-full"
        style={{
          background:
            "linear-gradient(to right, " +
            "#5555ff, #00cfff, #00e676, " +
            "#ffeb3b, #ff9800, #ff1744)",
        }}
      />

      <div className="mt-2 flex justify-between
                      text-xs text-[#1A2E61]">
        <span>Low concentration</span>
        <span>High concentration</span>
      </div>
    </div>
  );
}