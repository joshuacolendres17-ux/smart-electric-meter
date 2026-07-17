function MeterCard({ label, value, unit, status = "normal" }) {
  const statusColor = {
    normal: "bg-safety-green",
    warning: "bg-copper",
    danger: "bg-safety-red",
  }[status];

  return (
    <div className="bg-panel rounded-lg overflow-hidden border border-white/5">
      <div className={`h-1 ${statusColor}`} />
      <div className="p-5">
        <p className="text-xs tracking-widest text-white/40 font-display uppercase mb-2">
          {label}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-mono font-medium text-white">
            {value}
          </span>
          <span className="text-sm font-mono text-white/40">{unit}</span>
        </div>
      </div>
    </div>
  );
}

export default MeterCard;