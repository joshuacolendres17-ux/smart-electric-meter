import { useState } from "react";
import { Clock, AlertTriangle, Zap, Pencil } from "lucide-react";

const defaultRelayNames = {
  "relay 1": "Living Room Outlet",
  "relay 2": "Aircon Unit",
  "relay 3": "Refrigerator",
  "relay 4": "Water Heater",
};

// Which relays are considered "high load" for conflict warnings
const highLoadRelays = ["relay 2", "relay 4"];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function RelayControl() {
  const [relayNames, setRelayNames] = useState(defaultRelayNames);
  const [editingKey, setEditingKey] = useState(null);

  const [masterSchedule, setMasterSchedule] = useState({
    enabled: false,
    onTime: "06:00",
    offTime: "22:00",
    activeDays: [...days],
  });

  const [schedules, setSchedules] = useState(
    Object.keys(defaultRelayNames).reduce((acc, key) => {
      acc[key] = { enabled: false, onTime: "06:00", offTime: "08:00", activeDays: [...days] };
      return acc;
    }, {})
  );

  const updateSchedule = (key, field, value) => {
    setSchedules((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const toggleDay = (key, day) => {
    setSchedules((prev) => {
      const activeDays = prev[key].activeDays.includes(day)
        ? prev[key].activeDays.filter((d) => d !== day)
        : [...prev[key].activeDays, day];
      return { ...prev, [key]: { ...prev[key], activeDays } };
    });
  };

  const updateMaster = (field, value) => {
    setMasterSchedule((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMasterDay = (day) => {
    setMasterSchedule((prev) => {
      const activeDays = prev.activeDays.includes(day)
        ? prev.activeDays.filter((d) => d !== day)
        : [...prev.activeDays, day];
      return { ...prev, activeDays };
    });
  };

  // Detect conflict: 2+ high-load relays scheduled ON at the same time
  const conflict = (() => {
    const activeHighLoad = highLoadRelays.filter((k) => schedules[k].enabled);
    if (activeHighLoad.length < 2) return null;
    const [a, b] = activeHighLoad;
    if (schedules[a].onTime === schedules[b].onTime) {
      return `${relayNames[a]} and ${relayNames[b]} are both scheduled ON at ${schedules[a].onTime} — this may cause an overload.`;
    }
    return null;
  })();

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-white mb-2">
        Relay Control
      </h1>
      <p className="text-white/40 text-sm mb-8">
        Set automatic ON/OFF schedules for each relay
      </p>

      {conflict && (
        <div className="flex items-center gap-2 bg-copper/10 border border-copper/30 rounded-lg px-4 py-3 mb-6">
          <AlertTriangle size={16} className="text-copper" />
          <p className="text-sm text-copper">{conflict}</p>
        </div>
      )}

      {/* Master schedule */}
      <div className="bg-panel rounded-lg border border-copper/30 overflow-hidden mb-4">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-copper" />
            <p className="text-sm text-white font-medium">Master Schedule</p>
            <span className="text-[10px] font-mono bg-white/5 text-white/40 px-2 py-0.5 rounded-full">
              Applies to all relays
            </span>
          </div>
          <button
            onClick={() => updateMaster("enabled", !masterSchedule.enabled)}
            className={`text-xs font-mono px-3 py-1 rounded-full transition-colors ${
              masterSchedule.enabled
                ? "bg-copper text-black"
                : "bg-white/5 text-white/40 hover:text-white/70"
            }`}
          >
            {masterSchedule.enabled ? "Enabled" : "Disabled"}
          </button>
        </div>

        {masterSchedule.enabled && (
          <div className="border-t border-white/5 p-4 bg-panel-light/30 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[10px] tracking-widest text-white/30 uppercase mb-1 block">
                  Turn ON at
                </label>
                <input
                  type="time"
                  value={masterSchedule.onTime}
                  onChange={(e) => updateMaster("onTime", e.target.value)}
                  className="w-full bg-panel border border-white/10 rounded-md px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-copper"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] tracking-widest text-white/30 uppercase mb-1 block">
                  Turn OFF at
                </label>
                <input
                  type="time"
                  value={masterSchedule.offTime}
                  onChange={(e) => updateMaster("offTime", e.target.value)}
                  className="w-full bg-panel border border-white/10 rounded-md px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-copper"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] tracking-widest text-white/30 uppercase mb-1.5 block">
                Repeat on
              </label>
              <div className="flex gap-1.5">
                {days.map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleMasterDay(day)}
                    className={`w-8 h-8 rounded-md text-[10px] font-mono transition-colors ${
                      masterSchedule.activeDays.includes(day)
                        ? "bg-copper text-black"
                        : "bg-panel text-white/30 hover:text-white/60 border border-white/10"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Per-relay schedules */}
      <div className="space-y-4">
        {Object.entries(relayNames).map(([key, name]) => (
          <div key={key} className="bg-panel rounded-lg border border-white/5 overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {editingKey === key ? (
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) =>
                      setRelayNames((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    onBlur={() => setEditingKey(null)}
                    onKeyDown={(e) => e.key === "Enter" && setEditingKey(null)}
                    className="bg-panel-light border border-copper/50 rounded-md px-2 py-1 text-sm text-white font-medium focus:outline-none"
                  />
                ) : (
                  <>
                    <p className="text-sm text-white font-medium">{name}</p>
                    <button
                      onClick={() => setEditingKey(key)}
                      className="text-white/20 hover:text-white/50 transition-colors"
                    >
                      <Pencil size={12} />
                    </button>
                  </>
                )}
                {highLoadRelays.includes(key) && (
                  <span className="text-[10px] font-mono bg-copper/10 text-copper px-2 py-0.5 rounded-full">
                    High load
                  </span>
                )}
              </div>
              <button
                onClick={() => updateSchedule(key, "enabled", !schedules[key].enabled)}
                className={`text-xs font-mono px-3 py-1 rounded-full transition-colors ${
                  schedules[key].enabled
                    ? "bg-copper text-black"
                    : "bg-white/5 text-white/40 hover:text-white/70"
                }`}
              >
                {schedules[key].enabled ? "Enabled" : "Disabled"}
              </button>
            </div>

            {schedules[key].enabled && (
              <div className="border-t border-white/5 p-4 bg-panel-light/30 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] tracking-widest text-white/30 uppercase mb-1 block">
                      Turn ON at
                    </label>
                    <input
                      type="time"
                      value={schedules[key].onTime}
                      onChange={(e) => updateSchedule(key, "onTime", e.target.value)}
                      className="w-full bg-panel border border-white/10 rounded-md px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-copper"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] tracking-widest text-white/30 uppercase mb-1 block">
                      Turn OFF at
                    </label>
                    <input
                      type="time"
                      value={schedules[key].offTime}
                      onChange={(e) => updateSchedule(key, "offTime", e.target.value)}
                      className="w-full bg-panel border border-white/10 rounded-md px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-copper"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] tracking-widest text-white/30 uppercase mb-1.5 block">
                    Repeat on
                  </label>
                  <div className="flex gap-1.5">
                    {days.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(key, day)}
                        className={`w-8 h-8 rounded-md text-[10px] font-mono transition-colors ${
                          schedules[key].activeDays.includes(day)
                            ? "bg-copper text-black"
                            : "bg-panel text-white/30 hover:text-white/60 border border-white/10"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RelayControl;