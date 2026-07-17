import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../firebase/config";
import { WifiOff } from "lucide-react";
import TopBar from "../components/TopBar";
import MeterCard from "../components/MeterCard";
import BreakerSwitch from "../components/BreakerSwitch";
import MasterSwitch from "../components/MasterSwitch";

const defaultData = {
  voltage: 0,
  current: 0,
  power: 0,
  energy: 0,
  frequency: 0,
  powerFactor: 0,
  relays: { "relay 1": false, "relay 2": false, "relay 3": false, "relay 4": false },
};

const relayLabels = {
  "relay 1": "Living Room Outlet",
  "relay 2": "Aircon Unit",
  "relay 3": "Refrigerator",
  "relay 4": "Water Heater",
};

function Overview() {
  const [data, setData] = useState(defaultData);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const liveRef = ref(rtdb, "Electric Meter ESP32"); // listen to the WHOLE root
    const unsubscribe = onValue(liveRef, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        setData({
          ...defaultData,
          ...value.esp32,          // voltage, current, power, etc.
          relays: { ...defaultData.relays, ...value.Relays }, // Relays (capital R)
        });
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <TopBar isConnected={isConnected} />

      {!isConnected && (
        <div className="flex items-center gap-2 bg-safety-red/10 border border-safety-red/30 rounded-lg px-4 py-3 mb-6">
          <WifiOff size={16} className="text-safety-red" />
          <p className="text-sm text-safety-red">ESP32 not connected</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <MeterCard label="Voltage" value={data.voltage} unit="V" status="normal" />
        <MeterCard label="Current" value={data.current} unit="A" status="normal" />
        <MeterCard label="Power" value={data.power} unit="W" status="normal" />
        <MeterCard label="Energy" value={data.energy} unit="kWh" status="normal" />
        <MeterCard label="Frequency" value={data.frequency} unit="Hz" status="normal" />
        <MeterCard label="Power Factor" value={data.powerFactor} unit="" status="normal" />
      </div>

      <h2 className="text-lg font-display font-semibold text-white mb-4">
        Relay Control
      </h2>

      <div className="mb-4">
        <MasterSwitch relays={data.relays} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(relayLabels).map(([key, label]) => (
          <BreakerSwitch
            key={key}
            relayKey={key}
            label={label}
            isOn={data.relays?.[key] ?? false}
          />
        ))}
      </div>
    </>
  );
}

export default Overview;