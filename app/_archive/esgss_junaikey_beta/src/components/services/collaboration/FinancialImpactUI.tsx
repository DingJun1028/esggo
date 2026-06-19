import React, { useEffect, useState, useMemo } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  ShieldCheck,
  DollarSign,
  AlertTriangle,
  BarChart3,
  ArrowUpRight,
  Info,
  ChevronRight,
} from 'lucide-react';
import {
  financialImpactService,
  FinancialImpactMetrics,
  ImpactBreakdown,
} from '../../../services/FinancialImpactService';

interface FinancialImpactUIProps {
  theme?: string;
}

export const FinancialImpactUI: React.FC<FinancialImpactUIProps> = ({ theme = 'dark' }) => {
  const [metrics, setMetrics] = useState<FinancialImpactMetrics | null>(null);
  const [breakdown, setBreakdown] = useState<ImpactBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [m, b] = await Promise.all([
          financialImpactService.calculateImpact(),
          financialImpactService.getImpactBreakdown(),
        ]);
        setMetrics(m);
        setBreakdown(b);
      } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, '[FinancialImpactUI] Failed to fetch financial impact data', { error })
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-6 p-6 h-full overflow-y-auto ${isDark ? 'text-slate-100' : 'text-slate-900'}`}
    >
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financial Impact Analysis</h2>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Real-time ROI and risk mitigation modeling based on 5T Protocol metrics.
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-700'}`}
        >
          Live Projection
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total ESG Savings"
          value={`$${(metrics?.totalSavings || 0).toLocaleString()}`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="emerald"
          isDark={isDark}
        />
        <StatCard
          title="Risk Mitigation Value"
          value={`$${(metrics?.riskMitigationValue || 0).toLocaleString()}`}
          icon={<ShieldCheck className="w-5 h-5" />}
          color="blue"
          isDark={isDark}
        />
        <StatCard
          title="Carbon Tax Exposure"
          value={`$${(metrics?.carbonTaxExposure || 0).toLocaleString()}`}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="orange"
          isDark={isDark}
        />
        <StatCard
          title="Projected ROI"
          value={`${(metrics?.roi || 0).toFixed(1)}%`}
          icon={<BarChart3 className="w-5 h-5" />}
          color="indigo"
          isDark={isDark}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Impact Breakdown */}
        <div
          className={`lg:col-span-2 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} p-6`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Value Creation Channels</h3>
            <button
              className={`text-xs ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors underline`}
            >
              Download Report (PDF)
            </button>
          </div>

          <div className="space-y-4">
            {breakdown.map((item, idx) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-lg border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}
              >
                <div className="flex gap-4 items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-white shadow-sm'}`}
                  >
                    <DollarSign className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{item.category}</h4>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-emerald-500">
                    +${item.impactValue.toLocaleString()}
                  </div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Est. Annual Gain
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Intelligence Insight */}
        <div
          className={`rounded-xl border ${isDark ? 'bg-blue-900/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'} p-6 relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 p-4">
            <Info className={`w-8 h-8 ${isDark ? 'text-blue-500/20' : 'text-blue-500/10'}`} />
          </div>

          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Sentient Insight
          </h3>

          <p
            className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
          >
            Based on current **Scope 3 trajectory**, transitioning to **Tier 1 Verified Partners**
            in the "Manufacturing" sector would yield a **12.4% reduction** in potential carbon tax
            exposure while increasing risk resilience by **18%**.
          </p>

          <button
            className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              isDark
                ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Initiate Optimization Mission
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'emerald' | 'blue' | 'orange' | 'indigo';
  isDark: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, isDark }) => {
  const colors = {
    emerald: isDark
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      : 'bg-emerald-50 text-emerald-700 border-emerald-100',
    blue: isDark
      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      : 'bg-blue-50 text-blue-700 border-blue-100',
    orange: isDark
      ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      : 'bg-orange-50 text-orange-700 border-orange-100',
    indigo: isDark
      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
      : 'bg-indigo-50 text-indigo-700 border-indigo-100',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg border ${colors[color]}`}>{icon}</div>
        <div
          className={`text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-wider`}
        >
          Tier 5 Data
        </div>
      </div>
      <div>
        <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-1`}>
          {title}
        </div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
      </div>
    </motion.div>
  );
};
