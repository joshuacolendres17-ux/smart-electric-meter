import { ref, set } from "firebase/database";
import { rtdb } from "../firebase/config";

function BreakerSwitch({ label, relayKey, isOn }) {
  const toggleRelay = () => {
    const relayRef = ref(rtdb, `Electric Meter ESP32/Relays/${relayKey}`);
    set(relayRef, !isOn);
  };

  return (
    <div className="bg-panel rounded-lg border border-white/5 p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-white/80 font-medium">{label}</p>
        <p className={`text-xs font-mono ${isOn ? "text-safety-green" : "text-white/30"}`}>
          {isOn ? "ON" : "OFF"}
        </p>
      </div>
      <button
        onClick={toggleRelay}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isOn ? "bg-copper" : "bg-white/10"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOn ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export default BreakerSwitch;