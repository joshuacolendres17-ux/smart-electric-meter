import { useState } from "react";
import { User, Zap, Cpu, Save, CheckCircle2 } from "lucide-react";

function Settings() {
  const [householdName, setHouseholdName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [defaultRate, setDefaultRate] = useState("11.50");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Will later write to Firestore users/{userId} document
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-white mb-2">
        Settings
      </h1>
      <p className="text-white/40 text-sm mb-8">
        Household info, billing defaults, and device details
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Household / Account */}
        <div className="bg-panel rounded-lg border border-white/5 p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <User size={16} className="text-copper" />
            <p className="text-sm text-white font-medium">Household &amp; Account</p>
          </div>

          <div>
            <label className="text-xs tracking-widest text-white/40 uppercase mb-2 block">
              Household Name
            </label>
            <input
              type="text"
              placeholder="e.g. Dela Cruz Residence"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              className="w-full bg-panel-light border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-copper placeholder:text-white/20"
            />
          </div>

          <div>
            <label className="text-xs tracking-widest text-white/40 uppercase mb-2 block">
              Owner Name
            </label>
            <input
              type="text"
              placeholder="e.g. Juan Dela Cruz"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full bg-panel-light border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-copper placeholder:text-white/20"
            />
          </div>

          <div>
            <label className="text-xs tracking-widest text-white/40 uppercase mb-2 block">
              Contact Email
            </label>
            <input
              type="email"
              placeholder="e.g. juan@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-panel-light border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-copper placeholder:text-white/20"
            />
            <p className="text-xs text-white/30 mt-1">
              Used for alert notifications once email support is enabled.
            </p>
          </div>
        </div>

        {/* Billing default */}
        <div className="bg-panel rounded-lg border border-white/5 p-6 space-y-5 h-fit">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} className="text-copper" />
            <p className="text-sm text-white font-medium">Billing Default</p>
          </div>

          <div>
            <label className="text-xs tracking-widest text-white/40 uppercase mb-2 block">
              Default Price per kWh (₱)
            </label>
            <input
              type="number"
              step="0.01"
              value={defaultRate}
              onChange={(e) => setDefaultRate(e.target.value)}
              className="w-full bg-panel-light border border-white/10 rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-copper"
            />
            <p className="text-xs text-white/30 mt-1">
              This pre-fills the rate field on your Billing page, so you don't
              have to retype it every time — just update it here when your
              electricity rate changes.
            </p>
          </div>
        </div>
      </div>

      {/* Device Info */}
      <div className="bg-panel rounded-lg border border-white/5 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Cpu size={16} className="text-copper" />
          <p className="text-sm text-white font-medium">Device Info</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-white/30 uppercase tracking-wide mb-1">Device ID</p>
            <p className="font-mono text-white/70">esp32-01</p>
          </div>
          <div>
            <p className="text-xs text-white/30 uppercase tracking-wide mb-1">Sensor</p>
            <p className="font-mono text-white/70">PZEM-004T v3</p>
          </div>
          <div>
            <p className="text-xs text-white/30 uppercase tracking-wide mb-1">Firmware</p>
            <p className="font-mono text-white/70">v1.0.0</p>
          </div>
          <div>
            <p className="text-xs text-white/30 uppercase tracking-wide mb-1">Last Seen</p>
            <p className="font-mono text-white/70">—</p>
          </div>
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="flex items-center gap-2 bg-copper hover:bg-copper/90 text-black text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
      >
        {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
        {saved ? "Saved" : "Save Changes"}
      </button>
    </div>
  );
}

export default Settings;