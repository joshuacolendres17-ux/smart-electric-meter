function TopBar({ isConnected = false }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">
          Smart Electric Meter
        </h1>
        <p className="text-white/40 text-sm">Overview — Household Panel</p>
      </div>
      <div className="flex items-center gap-2 bg-panel border border-white/5 rounded-full px-4 py-2">
        <span
          className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-safety-green animate-pulse" : "bg-safety-red"
          }`}
        />
        <span className="text-xs text-white/60 font-mono">
          {isConnected ? "Device Online" : "Device Offline"}
        </span>
      </div>
    </div>
  );
}

export default TopBar;