import React, { useState } from 'react';
import { Language } from '@/types';
import {
  Globe,
  TrendingUp,
  AlertTriangle,
  Target,
  Shield,
  Zap,
  Activity,
  Map as MapIcon,
  Maximize2,
  MoreHorizontal,
  Crosshair,
} from 'lucide-react';

export const StrategyHub: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const [activeRegion, setActiveRegion] = useState('Global');

  // Mock Data for War Room
  const activeAlerts = [
    {
      id: 1,
      level: 'critical',
      message: isZh ? '歐盟 CBAM 碳關稅政策更新' : 'EU CBAM Policy Update',
      time: '10 min ago',
    },
    {
      id: 2,
      level: 'warning',
      message: isZh ? '供應鏈水資源風險升高 (東南亞)' : 'Supply Chain Water Risk (SEA)',
      time: '1 hr ago',
    },
    {
      id: 3,
      level: 'info',
      message: isZh ? '2025 Q1 永續報告數據彙整中' : '2025 Q1 Data Compilation',
      time: '2 hrs ago',
    },
  ];

  const pestelData = [
    { category: 'Political', score: 85, trend: '+2%' },
    { category: 'Economic', score: 72, trend: '-1%' },
    { category: 'Social', score: 90, trend: '+5%' },
    { category: 'Technological', score: 88, trend: '+8%' },
    { category: 'Environmental', score: 94, trend: '+12%' },
    { category: 'Legal', score: 80, trend: '0%' },
  ];

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-950 text-slate-100 animate-in fade-in duration-500">
      {/* Header Section */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
              <Crosshair className="w-8 h-8 text-red-500 animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              {isZh ? '永續戰情室' : 'Strategic War Room'}
            </span>
          </h1>
          <p className="text-slate-400 mt-2 font-mono text-sm">
            {isZh
              ? '全球風險監控與戰略決策中心'
              : 'Global Risk Monitoring & Strategic Decision Center'}
          </p>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-300">DEFCON 4</span>
          </div>
          <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg flex items-center gap-2">
            <Globe className="w-4 h-4 text-aqua-400" />
            <span className="text-xs font-bold text-slate-300">ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Global Map & Alerts (8 cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Global Risk Map Visualization Placeholder */}
          <div className="relative h-[400px] bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-700 mix-blend-overlay"></div>

            <div className="absolute top-4 left-6 z-10">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-aqua-500" />
                {isZh ? '全球風險熱點圖' : 'Global Risk Heatmap'}
              </h3>
            </div>

            {/* Simulated Interactive Points */}
            <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
            <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-red-500 rounded-full border-2 border-white/20"></div>

            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-amber-500 rounded-full animate-ping delay-700 opacity-75"></div>
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-amber-500 rounded-full border-2 border-white/20"></div>

            <div className="absolute bottom-1/3 right-1/4 w-5 h-5 bg-aqua-500 rounded-full animate-ping delay-300 opacity-75"></div>
            <div className="absolute bottom-1/3 right-1/4 w-5 h-5 bg-aqua-500 rounded-full border-2 border-white/20"></div>

            {/* Grid Overlay Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="absolute bottom-4 right-6 flex gap-2">
              <button className="p-2 bg-slate-800 rounded hover:bg-slate-700 text-slate-300">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real-time Ticker */}
          <div className="bg-slate-900/80 border-l-4 border-red-500 rounded-r-xl p-4 flex items-center gap-4 overflow-hidden relative">
            <div className="flex items-center gap-2 text-red-400 font-bold whitespace-nowrap z-10 bg-slate-900 pr-4">
              <Zap className="w-5 h-5" />
              {isZh ? '即時快訊' : 'LIVE FEED'}
            </div>
            <div className="flex-1 overflow-hidden relative h-6">
              <div className="absolute whitespace-nowrap animate-marquee flex gap-12 text-slate-300 text-sm">
                {activeAlerts.map((alert, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${alert.level === 'critical' ? 'bg-red-500' : alert.level === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}
                    ></span>
                    [{alert.time}] {alert.message}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: PESTEL & Objectives (4 cols) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* PESTEL Analysis Card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-500" />
                PESTEL {isZh ? '分析' : 'Analysis'}
              </h3>
              <MoreHorizontal className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white" />
            </div>

            <div className="space-y-4">
              {pestelData.map(item => (
                <div key={item.category} className="group">
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-slate-400">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{item.score}</span>
                      <span
                        className={`text-xs ${item.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {item.trend}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-500 group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Objectives */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex-1">
            <h3 className="font-bold text-slate-200 mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              {isZh ? '戰略目標' : 'Strategic Objectives'}
            </h3>
            <ul className="space-y-4">
              {[
                {
                  text: isZh ? '2026 達成碳中和 (Scope 1+2)' : '2026 Carbon Neutral (Scope 1+2)',
                  progress: 75,
                  status: 'good',
                },
                {
                  text: isZh ? '供應鏈 100% 綠色認證' : '100% Green Certified Supply Chain',
                  progress: 42,
                  status: 'warning',
                },
                {
                  text: isZh ? 'ESG 投資回報率 > 15%' : 'ESG ROI > 15%',
                  progress: 88,
                  status: 'good',
                },
              ].map((obj, i) => (
                <li
                  key={i}
                  className="flex flex-col gap-2 p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 transition-colors"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300 font-medium">{obj.text}</span>
                    <span className={obj.status === 'good' ? 'text-green-400' : 'text-amber-400'}>
                      {obj.progress}%
                    </span>
                  </div>
                  <div className="h-1 w-full bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${obj.status === 'good' ? 'bg-green-500' : 'bg-amber-500'}`}
                      style={{ width: `${obj.progress}%` }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Metrics (12 cols) */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'E-Score', value: '92.4', trend: '↑', color: 'text-emerald-400' },
            { label: 'S-Score', value: '88.1', trend: '↑', color: 'text-blue-400' },
            { label: 'G-Score', value: '95.0', trend: '-', color: 'text-purple-400' },
            { label: 'Overall', value: 'AAA', trend: '★', color: 'text-amber-400' },
          ].map((metric, i) => (
            <div
              key={i}
              className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-slate-600 transition-colors"
            >
              <span className="text-slate-500 font-mono font-bold text-sm tracking-widest">
                {metric.label}
              </span>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-black ${metric.color}`}>{metric.value}</span>
                <span className="text-slate-600 text-xs">{metric.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
