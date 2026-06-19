import React, { useState } from 'react';
import { Leaf, Wind, Droplets } from 'lucide-react';

const CarbonReductionEstimator: React.FC = () => {
  const [activityType, setActivityType] = useState('electricity');
  const [amount, setAmount] = useState(1000);

  // Emission Factors (kgCO2e per unit)
  const factors = {
    electricity: { label: 'Electricity Saved (kWh)', factor: 0.5, unit: 'kWh' }, // Avg Grid
    diesel: { label: 'Diesel Reduced (L)', factor: 2.68, unit: 'L' },
    waste: { label: 'Waste Diverted (kg)', factor: 1.2, unit: 'kg' }, // Landfill avoidance
  };

  const selected = factors[activityType as keyof typeof factors];
  const reduction = (amount * selected.factor).toFixed(1);
  const treesEquivalent = (Number(reduction) / 22).toFixed(1); // ~22kg CO2 per tree/year

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
        <Leaf className="w-6 h-6 text-emerald-400" />
        Carbon Reduction Estimator
      </h2>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-400 mb-2">
            Reduction Activity
          </label>
          <div className="flex bg-slate-800 p-1 rounded-lg">
            {Object.entries(factors).map(([key, f]) => (
              <button
                key={key}
                onClick={() => setActivityType(key)}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                  activityType === key
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-400 mb-2">
            {selected.label}
          </label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
          />
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-emerald-900/40 to-black rounded-xl p-5 border border-emerald-500/20 flex flex-col items-center justify-center text-center">
        <div className="text-4xl font-black text-white mb-1">
          {reduction} <span className="text-lg text-emerald-400 font-bold">kgCO2e</span>
        </div>
        <div className="text-xs text-slate-400 uppercase tracking-wider mb-4">
          Estimated Avoidance
        </div>

        <div className="flex items-center gap-2 text-emerald-200 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <Leaf className="w-4 h-4" />
          <span className="text-xs font-bold">~ {treesEquivalent} Trees Planted</span>
        </div>
      </div>
    </div>
  );
};

export default CarbonReductionEstimator;
