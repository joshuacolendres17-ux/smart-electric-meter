import BreakerSwitch from "../components/BreakerSwitch";

function RelayControl() {
  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-white mb-2">Relay Control</h1>
      <p className="text-white/40 text-sm mb-8">Manage all connected relays</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BreakerSwitch label="Living Room Outlet" />
        <BreakerSwitch label="Aircon Unit" />
        <BreakerSwitch label="Refrigerator" />
        <BreakerSwitch label="Water Heater" />
      </div>
    </div>
  );
}

export default RelayControl;