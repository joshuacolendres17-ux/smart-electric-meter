import { useState, useMemo } from "react";
import { ArrowUp, ArrowDown, Minus, AlertTriangle } from "lucide-react";
import MeterCard from "../components/MeterCard";

// Mock daily log data (will later come from Firestore energyLogs)
const generateMockLogs = () => {
  const logs = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const kwh = +(6 + Math.random() * 7).toFixed(1);
    logs.push({
      date: date.toISOString().split("T")[0],
      peakPower: Math.round(600 + Math.random() * 700),
      energy: kwh,
      avgVoltage: +(218 + Math.random() * 4).toFixed(1),
      overload: kwh > 11.5,
    });
  }
  return logs;
};

const allLogs = generateMockLogs();

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function TrendIndicator({ current, previous }) {
  if (previous == null) return <Minus size={14} className="text-white/20" />;
  const diff = current - previous;
  if (Math.abs(diff) < 0.2) return <Minus size={14} className="text-white/30" />;
  if (diff > 0) return <ArrowUp size={14} className="text-safety-red" />;
  return <ArrowDown size={14} className="text-safety-green" />;
}

function Monitoring() {
  const [range, setRange] = useState("week"); // "week" | "month"
  const [expandedDate, setExpandedDate] = useState(null);

  const visibleLogs = useMemo(() => {
    const count = range === "week" ? 7 : 30;
    return allLogs.slice(-count).reverse(); // most recent first
  }, [range]);

  const todayKwh = allLogs[allLogs.length - 1].energy;
  const weekKwh = allLogs.slice(-7).reduce((sum, l) => sum + l.energy, 0);
  const monthKwh = allLogs.reduce((sum, l) => sum + l.energy, 0);
  const peakDay = allLogs.reduce((max, l) => (l.energy > max.energy ? l : max), allLogs[0]);

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-white mb-2">
        Monitoring
      </h1>
      <p className="text-white/40 text-sm mb-8">
        Daily energy consumption records
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MeterCard label="Today" value={todayKwh.toFixed(1)} unit="kWh" status="normal" />
        <MeterCard label="This Week" value={weekKwh.toFixed(1)} unit="kWh" status="normal" />
        <MeterCard label="This Month" value={monthKwh.toFixed(1)} unit="kWh" status="normal" />
        <MeterCard
          label="Peak Day"
          value={peakDay.energy.toFixed(1)}
          unit="kWh"
          status={peakDay.overload ? "danger" : "normal"}
        />
      </div>

      {/* Records table */}
      <div className="bg-panel rounded-lg border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4">
          <p className="text-xs tracking-widest text-white/40 uppercase">
            Daily Log
          </p>
          <div className="flex gap-1 bg-panel-light rounded-md p-1">
            <button
              onClick={() => setRange("week")}
              className={`px-3 py-1 text-xs rounded font-mono transition-colors ${
                range === "week" ? "bg-copper text-black" : "text-white/50 hover:text-white/80"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setRange("month")}
              className={`px-3 py-1 text-xs rounded font-mono transition-colors ${
                range === "month" ? "bg-copper text-black" : "text-white/50 hover:text-white/80"
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-white/5 text-white/40 text-xs uppercase tracking-wider">
                <th className="text-left font-medium px-6 py-3">Date</th>
                <th className="text-right font-medium px-4 py-3">Peak Power</th>
                <th className="text-right font-medium px-4 py-3">Energy</th>
                <th className="text-right font-medium px-4 py-3">Avg Voltage</th>
                <th className="text-center font-medium px-4 py-3">Trend</th>
                <th className="text-center font-medium px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleLogs.map((log, i) => {
                const previous = visibleLogs[i + 1]; // next row = previous day (since reversed)
                const isExpanded = expandedDate === log.date;
                return (
                  <>
                    <tr
                      key={log.date}
                      onClick={() => setExpandedDate(isExpanded ? null : log.date)}
                      className="border-t border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-3 text-white/80 font-mono">
                        {formatDate(log.date)}
                      </td>
                      <td className="px-4 py-3 text-right text-white/70 font-mono">
                        {log.peakPower} W
                      </td>
                      <td className="px-4 py-3 text-right text-white font-mono">
                        {log.energy.toFixed(1)} kWh
                      </td>
                      <td className="px-4 py-3 text-right text-white/70 font-mono">
                        {log.avgVoltage} V
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <TrendIndicator current={log.energy} previous={previous?.energy} />
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex justify-center">
                          {log.overload ? (
                            <span className="flex items-center gap-1 text-safety-red text-xs font-mono">
                              <AlertTriangle size={12} /> High
                            </span>
                          ) : (
                            <span className="text-safety-green text-xs font-mono">Normal</span>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-panel-light/50 border-t border-white/5">
                        <td colSpan={6} className="px-6 py-4 text-white/50 text-xs">
                          Detailed 15-minute readings for {formatDate(log.date)} will appear
                          here once connected to live device logs.
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Monitoring;