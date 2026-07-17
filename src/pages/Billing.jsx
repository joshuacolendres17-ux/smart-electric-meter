import { useState, useMemo } from "react";

function Billing() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rate, setRate] = useState("11.50");

  // Mock: average daily kWh usage (will later come from Firebase logs)
  const avgDailyKwh = 8.4;

  const { days, totalKwh, totalBill } = useMemo(() => {
    if (!startDate || !endDate) return { days: 0, totalKwh: 0, totalBill: 0 };
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.max(
      0,
      Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1
    );
    const kwh = diffDays * avgDailyKwh;
    const bill = kwh * parseFloat(rate || 0);
    return { days: diffDays, totalKwh: kwh, totalBill: bill };
  }, [startDate, endDate, rate]);

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-white mb-2">
        Billing Calculator
      </h1>
      <p className="text-white/40 text-sm mb-8">
        Estimate your electricity bill for any date range
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="bg-panel rounded-lg border border-white/5 p-6 space-y-5">
          <div>
            <label className="text-xs tracking-widest text-white/40 uppercase mb-2 block">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-panel-light border border-white/10 rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-copper"
            />
          </div>

          <div>
            <label className="text-xs tracking-widest text-white/40 uppercase mb-2 block">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-panel-light border border-white/10 rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-copper"
            />
          </div>

          <div>
            <label className="text-xs tracking-widest text-white/40 uppercase mb-2 block">
              Price per kWh (₱)
            </label>
            <input
              type="number"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full bg-panel-light border border-white/10 rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-copper"
            />
            <p className="text-xs text-white/30 mt-1">
              Rates change often — update this to match your latest bill.
            </p>
          </div>
        </div>

        {/* Result panel */}
        <div className="bg-panel rounded-lg border border-white/5 p-6 flex flex-col justify-center">
          <p className="text-xs tracking-widest text-white/40 uppercase mb-2">
            Estimated Bill
          </p>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-mono font-medium text-copper">
              ₱{totalBill.toFixed(2)}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-white/60">
              <span>Billing period</span>
              <span className="font-mono text-white/80">{days} days</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Total consumption</span>
              <span className="font-mono text-white/80">
                {totalKwh.toFixed(1)} kWh
              </span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Rate applied</span>
              <span className="font-mono text-white/80">₱{rate}/kWh</span>
            </div>
          </div>

          <p className="text-xs text-white/30 mt-6 pt-4 border-t border-white/5">
            Based on average daily usage — will use real meter logs once connected to Firebase.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Billing;