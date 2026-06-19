/**
 * 🎯 Optical Dashboard Component
 * --------------------------------------------------
 * [核心] 光學儀表板
 * [功能] 高科技視覺化 + ESG 指標 + AI 洞察
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Zap, Eye } from 'lucide-react';

interface MetricData {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface OpticalDashboardProps {
  theme?: 'hexagon' | 'bagua';
}

export const OpticalDashboard: React.FC<OpticalDashboardProps> = ({ theme = 'hexagon' }) => {
  const [metrics, setMetrics] = useState<MetricData[]>([
    { label: 'ESG Score', value: 85, unit: '%', trend: 'up', change: 5 },
    { label: 'Carbon Reduction', value: 42, unit: 'tons', trend: 'up', change: 12 },
    { label: 'Social Impact', value: 78, unit: 'pts', trend: 'stable', change: 0 },
    { label: 'Governance', value: 92, unit: '%', trend: 'up', change: 3 },
  ]);

  return (
    <div className="optical-dashboard w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 overflow-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400">
              ESGsunshine Dashboard
            </h1>
            <p className="text-slate-400 mt-1">JunAiKey Analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="text-cyan-400" size={20} />
            <span className="text-sm text-slate-400">Optical View</span>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} index={index} theme={theme} />
        ))}
      </div>

      {/* Central Visualization */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <CentralVisualization theme={theme} />
        </div>
        <div>
          <AIInsights />
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ metric: MetricData; index: number; theme: string }> = ({
  metric,
  index,
  theme,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      {/* Optical Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />

      <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
        {/* Hexagon/Bagua Pattern Background */}
        <div className="absolute top-2 right-2 opacity-10">
          {theme === 'hexagon' ? <HexagonPattern /> : <BaguaPattern />}
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-400">{metric.label}</span>
            <TrendIndicator trend={metric.trend} change={metric.change} />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{metric.value}</span>
            <span className="text-lg text-slate-400">{metric.unit}</span>
          </div>

          {/* Optical Progress Bar */}
          <div className="mt-4 h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${metric.value}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TrendIndicator: React.FC<{ trend: string; change: number }> = ({ trend, change }) => {
  const color =
    trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400';

  return (
    <div className={`flex items-center gap-1 ${color}`}>
      <TrendingUp size={16} className={trend === 'down' ? 'rotate-180' : ''} />
      <span className="text-sm">
        {change > 0 ? '+' : ''}
        {change}%
      </span>
    </div>
  );
};

const CentralVisualization: React.FC<{ theme: string }> = ({ theme }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-8 h-96"
    >
      <h3 className="text-xl font-bold text-white mb-6">ESG Performance Matrix</h3>

      {/* Central Optical Pattern */}
      <div className="flex items-center justify-center h-full">
        {theme === 'hexagon' ? <HexagonVisualization /> : <BaguaVisualization />}
      </div>
    </motion.div>
  );
};

const AIInsights: React.FC = () => {
  const insights = [
    { icon: Zap, text: 'Carbon reduction exceeding targets by 12%', type: 'success' },
    { icon: Activity, text: 'Social impact metrics show steady growth', type: 'info' },
    { icon: TrendingUp, text: 'Governance score improved to 92%', type: 'success' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6"
    >
      <h3 className="text-xl font-bold text-white mb-4">AI Insights</h3>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg"
          >
            <insight.icon
              size={20}
              className={insight.type === 'success' ? 'text-green-400' : 'text-cyan-400'}
            />
            <p className="text-sm text-slate-300">{insight.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Placeholder components for patterns
const HexagonPattern: React.FC = () => (
  <svg width="60" height="60" viewBox="0 0 60 60">
    <polygon
      points="30,5 55,17.5 55,42.5 30,55 5,42.5 5,17.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const BaguaPattern: React.FC = () => (
  <svg width="60" height="60" viewBox="0 0 60 60">
    <circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="30" y1="5" x2="30" y2="55" stroke="currentColor" strokeWidth="2" />
    <line x1="5" y1="30" x2="55" y2="30" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const HexagonVisualization: React.FC = () => (
  <div className="relative w-64 h-64">
    <motion.svg
      width="256"
      height="256"
      viewBox="0 0 256 256"
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
    >
      <polygon
        points="128,20 220,70 220,170 128,220 36,170 36,70"
        fill="none"
        stroke="url(#hexGradient)"
        strokeWidth="3"
      />
      <defs>
        <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </motion.svg>
  </div>
);

const BaguaVisualization: React.FC = () => (
  <div className="relative w-64 h-64">
    <motion.svg
      width="256"
      height="256"
      viewBox="0 0 256 256"
      animate={{ rotate: -360 }}
      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
    >
      <circle cx="128" cy="128" r="100" fill="none" stroke="url(#baguaGradient)" strokeWidth="3" />
      <defs>
        <linearGradient id="baguaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </motion.svg>
  </div>
);
