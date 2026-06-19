import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  RotateCcw,
  Activity,
} from 'lucide-react';

interface FinanceState {
  balance: number;
  revenue: number;
  expenses: number;
  roi: number;
  history: number[];
}

export const FinanceSim: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [stats, setStats] = useState<FinanceState>({
    balance: 1000000,
    revenue: 50000,
    expenses: 35000,
    roi: 12.5,
    history: [1000000],
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setStats(prev => {
          const variableRevenue = prev.revenue * (1 + (Math.random() * 0.1 - 0.05));
          const variableExpenses = prev.expenses * (1 + (Math.random() * 0.08 - 0.02));
          const net = variableRevenue - variableExpenses;
          const newBalance = prev.balance + net;

          return {
            balance: newBalance,
            revenue: variableRevenue,
            expenses: variableExpenses,
            roi: ((newBalance - 1000000) / 1000000) * 100,
            history: [...prev.history.slice(-19), newBalance],
          };
        });
      }, 1000 / simulationSpeed);
    }
    return () => clearInterval(interval);
  }, [isRunning, simulationSpeed]);

  const handleReset = () => {
    setIsRunning(false);
    setStats({
      balance: 1000000,
      revenue: 50000,
      expenses: 35000,
      roi: 12.5,
      history: [1000000],
    });
  };

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            金融模擬預測
          </h2>
          <p className="text-slate-400 text-sm mt-1">財務健康度與投資回報預測系統</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-2 rounded-lg transition-colors ${isRunning ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'}`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-cyan-500/10">
          <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            總資產 (Total Assets)
          </div>
          <div className="text-2xl font-bold text-white">{formatMoney(stats.balance)}</div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-cyan-500/10">
          <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            月收入 (Revenue)
          </div>
          <div className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
            {formatMoney(stats.revenue)}
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-cyan-500/10">
          <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            月支出 (Expenses)
          </div>
          <div className="text-2xl font-bold text-rose-400 flex items-center gap-2">
            {formatMoney(stats.expenses)}
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-cyan-500/10">
          <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            投資回報率 (ROI)
          </div>
          <div
            className={`text-2xl font-bold flex items-center gap-2 ${stats.roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}
          >
            {stats.roi.toFixed(2)}%
            <Activity className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Simulation Speed Control */}
      <div className="mb-6">
        <label className="text-sm text-slate-400 mb-2 block flex justify-between">
          <span>模擬速度 (Simulation Speed)</span>
          <span className="text-white">{simulationSpeed}x</span>
        </label>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={simulationSpeed}
          onChange={e => setSimulationSpeed(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>

      {/* Simple Visualization Bar */}
      <div className="h-32 flex items-end gap-1">
        {stats.history.map((val, idx) => {
          const height = Math.min(100, Math.max(5, (val / 1500000) * 100)); // Normalize
          return (
            <div
              key={idx}
              className="flex-1 bg-emerald-500/30 hover:bg-emerald-500/50 transition-all rounded-t-sm"
              style={{ height: `${height}%` }}
              title={formatMoney(val)}
            />
          );
        })}
      </div>
    </div>
  );
};
