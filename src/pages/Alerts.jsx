import { useState } from "react";
import { AlertTriangle, Bell, CheckCircle2, Zap, Activity } from "lucide-react";

// Mock alert history (will later come from Firestore alerts collection)
// "activeRelays" = which relays were ON at the moment this alert triggered
const mockAlerts = [
  {
    id: 1,
    timestamp: "2026-07-16 14:32",
    type: "overload",
    message: "Total current exceeded 20A limit — reading was 22.4A",
    activeRelays: ["Aircon Unit", "Water Heater"],
    resolved: true,
  },
  {
    id: 2,
    timestamp: "2026-07-15 09:10",
    type: "overload",
    message: "Total power exceeded 3000W limit — reading was 3210W",
    activeRelays: ["Aircon Unit", "Refrigerator", "Water Heater"],
    resolved: true,
  },
  {
    id: 3,
    timestamp: "2026-07-14 21:47",
    type: "voltage",
    message: "Voltage spike detected — reading was 248.6V",
    activeRelays: ["Living Room Outlet", "Refrigerator"],
    resolved: false,
  },
  {
    id: 4,
    timestamp: "2026-07-12 18:05",
    type: "voltage",
    message: "Voltage dropped below 200V — reading was 194.3V",
    activeRelays: ["Aircon Unit"],
    resolved: true,
  },
];

const typeStyles = {
  overload: { icon: Zap, label: "Overload" },
  voltage: { icon: Activity, label: "Voltage" },
};

function AlertRow({ alert }) {
  const { icon: TypeIcon, label } = typeStyles[alert.type];
  return (
    <div className="flex items-start gap-3 bg-panel-light/50 rounded-lg border border-white/5 p-4">
      <div className={`mt-0.5 ${alert.resolved ? "text-white/30" : "text-safety-red"}`}>
        {alert.resolved ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <TypeIcon size={13} className="text-copper" />
            <p className="text-sm text-white font-medium">{label} Alert</p>
          </div>
          <span className="text-xs text-white/30 font-mono whitespace-nowrap">
            {alert.timestamp}
          </span>
        </div>
        <p className="text-xs text-white/50 mb-2">{alert.message}</p>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] text-white/30 uppercase tracking-wide mt-0.5">
            Relays on at the time:
          </span>
          {alert.activeRelays.map((r) => (
            <span
              key={r}
              className="text-[10px] font-mono bg-white/5 text-white/50 px-2 py-0.5 rounded-full"
            >
              {r}
            </span>
          ))}
        </div>
      </div>
      <span
        className={`text-xs font-mono px-2 py-1 rounded-full whitespace-nowrap ${
          alert.resolved
            ? "bg-white/5 text-white/40"
            : "bg-safety-red/10 text-safety-red"
        }`}
      >
        {alert.resolved ? "Resolved" : "Active"}
      </span>
    </div>
  );
}

function Alerts() {
  const [currentThreshold, setCurrentThreshold] = useState("20");
  const [powerThreshold, setPowerThreshold] = useState("3000");
  const [voltageMax, setVoltageMax] = useState("245");
  const [voltageMin, setVoltageMin] = useState("200");
  const [filter, setFilter] = useState("all"); // all | active | resolved

  const filteredAlerts = mockAlerts.filter((a) => {
    if (filter === "active") return !a.resolved;
    if (filter === "resolved") return a.resolved;
    return true;
  });

  const activeCount = mockAlerts.filter((a) => !a.resolved).length;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-white mb-2">
        Alerts
      </h1>
      <p className="text-white/40 text-sm mb-8">
        System-wide overload and voltage notifications
      </p>

      {activeCount > 0 && (
        <div className="flex items-center gap-2 bg-safety-red/10 border border-safety-red/30 rounded-lg px-4 py-3 mb-6">
          <AlertTriangle size={16} className="text-safety-red" />
          <p className="text-sm text-safety-red">
            {activeCount} active alert{activeCount > 1 ? "s" : ""} require your attention
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Threshold settings */}
        <div className="md:col-span-1 bg-panel rounded-lg border border-white/5 p-6 space-y-6 h-fit">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-copper" />
              <p className="text-sm text-white font-medium">Overload Limits</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs tracking-widest text-white/40 uppercase mb-2 block">
                  Max Total Current (A)
                </label>
                <input
                  type="number"
                  value={currentThreshold}
                  onChange={(e) => setCurrentThreshold(e.target.value)}
                  className="w-full bg-panel-light border border-white/10 rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-copper"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest text-white/40 uppercase mb-2 block">
                  Max Total Power (W)
                </label>
                <input
                  type="number"
                  value={powerThreshold}
                  onChange={(e) => setPowerThreshold(e.target.value)}
                  className="w-full bg-panel-light border border-white/10 rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-copper"
                />
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-copper" />
              <p className="text-sm text-white font-medium">Voltage Range</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs tracking-widest text-white/40 uppercase mb-2 block">
                  Max Voltage (V)
                </label>
                <input
                  type="number"
                  value={voltageMax}
                  onChange={(e) => setVoltageMax(e.target.value)}
                  className="w-full bg-panel-light border border-white/10 rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-copper"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest text-white/40 uppercase mb-2 block">
                  Min Voltage (V)
                </label>
                <input
                  type="number"
                  value={voltageMin}
                  onChange={(e) => setVoltageMin(e.target.value)}
                  className="w-full bg-panel-light border border-white/10 rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-copper"
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-white/30 pt-4 border-t border-white/5">
            These limits apply to your household's total reading from the meter —
            not individual relays, since one sensor monitors the whole system.
          </p>
        </div>

        {/* Alert history */}
        <div className="md:col-span-2 bg-panel rounded-lg border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-white/40" />
              <p className="text-xs tracking-widest text-white/40 uppercase">
                Alert History
              </p>
            </div>
            <div className="flex gap-1 bg-panel-light rounded-md p-1">
              {["all", "active", "resolved"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-xs rounded font-mono capitalize transition-colors ${
                    filter === f ? "bg-copper text-black" : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => <AlertRow key={alert.id} alert={alert} />)
            ) : (
              <p className="text-white/30 text-sm text-center py-8">
                No {filter !== "all" ? filter : ""} alerts to show.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Alerts;