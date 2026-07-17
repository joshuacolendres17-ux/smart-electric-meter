import { ref, update } from "firebase/database";
import { rtdb } from "../firebase/config";
import { Zap } from "lucide-react";

function MasterSwitch({ relays }) {
  // Master is "ON" only if at least one relay is on; "ALL ON" only if every relay is on
  const allOn = Object.values(relays).every((v) => v === true);
  const anyOn = Object.values(relays).some((v) => v === true);

  const toggleAll = () => {
    const nextState = !allOn; // if not all on, turn all ON; if all on, turn all OFF
    const updates = {};
    Object.keys(relays).forEach((key) => {
updates[`Electric Meter ESP32/Relays/${key}`] = nextState;
    });
    update(ref(rtdb), updates);
  };

  return (
    <div className="bg-panel rounded-lg border border-copper/30 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Zap size={18} className={anyOn ? "text-copper" : "text-white/30"} />
        <div>
          <p className="text-sm text-white font-medium">Master Control</p>
          <p className={`text-xs font-mono ${allOn ? "text-safety-green" : anyOn ? "text-copper" : "text-white/30"}`}>
            {allOn ? "ALL ON" : anyOn ? "PARTIALLY ON" : "ALL OFF"}
          </p>
        </div>
      </div>
      <button
  onClick={toggleAll}
  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
    allOn ? "bg-copper" : anyOn ? "bg-copper/40" : "bg-white/10"
  }`}
>
  <span
    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
      allOn ? "translate-x-6" : "translate-x-1"
    }`}
  />
</button>
    </div>
  );
}

export default MasterSwitch;