import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, HelpCircle, RefreshCcw } from 'lucide-react';

const SROICalculator: React.FC = () => {
  const [investment, setInvestment] = useState(100000);
  const [beneficiaries, setBeneficiaries] = useState(500);
  const [outcomeType, setOutcomeType] = useState('health');

  // Financial Proxies (Mock Values)
  const proxies = {
    health: {
      label: 'Improved Physical Health',
      value: 3500,
      desc: 'Reduced medical costs per person/year',
    },
    education: {
      label: 'Skill Acquisition',
      value: 5200,
      desc: 'Increased earning potential per person/year',
    },
    community: {
      label: 'Community Cohesion',
      value: 1200,
      desc: 'Reduced crime & social service reliance',
    },
  };

  const selectedProxy = proxies[outcomeType as keyof typeof proxies];

  // Calculation (Simplified for UI Demo)
  // Total Value = Beneficiaries * Proxy Value
  // SROI Ratio = Total Value / Investment
  const totalSocialValue = beneficiaries * selectedProxy.value;
  const sroiRatio = (totalSocialValue / investment).toFixed(2);
  const netValue = totalSocialValue - investment;

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-emerald-400" />
          SROI Calculator
        </h2>
        <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">
          Methodology: Proxy Valuation
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">
              Total Investment ($)
            </label>
            <input
              type="number"
              value={investment}
              onChange={e => setInvestment(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">
              Beneficiaries Reached
            </label>
            <input
              type="number"
              value={beneficiaries}
              onChange={e => setBeneficiaries(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">
              Target Outcome (Proxy)
            </label>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(proxies).map(([key, p]) => (
                <div
                  key={key}
                  onClick={() => setOutcomeType(key)}
                  className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                    outcomeType === key
                      ? 'bg-emerald-600/20 border-emerald-500'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <div
                      className={`text-sm font-bold ${outcomeType === key ? 'text-white' : 'text-slate-300'}`}
                    >
                      {p.label}
                    </div>
                    <div className="text-xs text-slate-500">{p.desc}</div>
                  </div>
                  <div className="text-emerald-400 font-mono font-bold text-sm">
                    ${p.value.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />

          <div className="text-center mb-8 relative z-10">
            <h3 className="text-slate-400 text-sm uppercase tracking-wider font-bold mb-2">
              Social Return on Investment
            </h3>
            <div className="text-6xl font-black text-white flex items-center justify-center gap-2">
              <span className="text-3xl text-slate-500 font-bold">1 :</span>
              {sroiRatio}
            </div>
            <div
              className={`text-sm font-bold mt-2 ${Number(sroiRatio) > 1 ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {Number(sroiRatio) > 1 ? 'POSITIVE IMPACT' : 'NEGATIVE RETURN'}
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-slate-400 text-sm">Total Social Value</span>
              <span className="text-emerald-300 font-mono font-bold text-lg">
                ${totalSocialValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-slate-400 text-sm">Net Present Value (NPV)</span>
              <span className="text-emerald-300 font-mono font-bold text-lg">
                ${netValue.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-8 relative z-10">
            <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Generate SROI Report
            </button>
            <p className="text-[10px] text-center text-slate-500 mt-2">
              *Estimates based on standard financial proxies. Not valid for financial auditing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SROICalculator;
