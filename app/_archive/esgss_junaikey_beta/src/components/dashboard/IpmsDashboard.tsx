import React, { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Leaf,
  Activity,
  Zap,
  Clock,
  Target,
  Users,
  TrendingUp,
  AlertTriangle,
  Globe,
  Droplets,
  Wind,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DashboardDataService,
  SystemHealthData,
  ESGScoreData,
  ProjectStatusData,
} from '../../services/mock/DashboardDataService';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

// --- Components ---

const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`glass-panel-premium p-6 relative overflow-hidden group ${className}`}
  >
    {/* Dynamic Background Glow */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700 ease-out" />
    <div className="relative z-10 h-full">{children}</div>
  </motion.div>
);

const MetricValue: React.FC<{
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ElementType;
  color?: string;
}> = ({ label, value, unit, trend, trendValue, icon: Icon, color = 'text-slate-200' }) => (
  <div className="flex flex-col h-full justify-between">
    <div className="flex items-start justify-between mb-2">
      <span className="text-slate-400 text-xs font-medium tracking-wider uppercase">{label}</span>
      {Icon && <Icon className={`w-5 h-5 ${color} opacity-80`} />}
    </div>
    <div className="flex items-end gap-2">
      <span className={`text-3xl font-light tracking-tight ${color}`}>
        {value}
        {unit && <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>}
      </span>
    </div>
    {trend && (
      <div
        className={`flex items-center gap-1 text-xs mt-2 ${
          trend === 'up'
            ? 'text-emerald-400'
            : trend === 'down'
              ? 'text-rose-400'
              : 'text-slate-400'
        }`}
      >
        {trend === 'up' ? (
          <TrendingUp className="w-3 h-3" />
        ) : trend === 'down' ? (
          <TrendingUp className="w-3 h-3 rotate-180" />
        ) : null}
        <span>{trendValue}</span>
      </div>
    )}
  </div>
);

export const IpmsDashboard: React.FC = () => {
  // Data State
  const [healthData, setHealthData] = useState<SystemHealthData | null>(null);
  const [esgTrend, setEsgTrend] = useState<ESGScoreData[]>([]);
  const [projectDist, setProjectDist] = useState<ProjectStatusData[]>([]);

  useEffect(() => {
    const service = DashboardDataService.getInstance();

    // Subscribe to streams
    const healthSub = service.getSystemHealthStream().subscribe(setHealthData);
    const trendSub = service.getESGTrendData().subscribe(setEsgTrend);
    setProjectDist(service.getProjectDistribution());

    return () => {
      healthSub.unsubscribe();
      trendSub.unsubscribe();
    };
  }, []);

  return (
    <div className="w-full h-full min-h-screen">
      {/* Header Section (Mobile Optimized) */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extralight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 mb-2">
            IPMS <span className="font-bold text-cyan-400">NEXUS</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl">
            整合式專案管理系統 v7.0 • <span className="text-emerald-400">系統運作最佳化</span>
          </p>
        </div>

        {/* Quick Actions / Status */}
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <GlassCard className="!p-3 !min-w-[120px] flex items-center gap-3">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-emerald-500 blur-sm animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase">網路延遲</span>
              <span className="text-xs font-bold text-emerald-400">
                {healthData?.network ?? '--'} ms
              </span>
            </div>
          </GlassCard>
          <GlassCard className="!p-3 !min-w-[120px] flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase">CPU 負載</span>
              <span className="text-xs font-bold text-cyan-400">{healthData?.cpu ?? '--'}%</span>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)] md:auto-rows-[160px]">
        {/* 1. ESG Score Trend (Large Chart) */}
        <GlassCard className="col-span-1 md:col-span-8 md:row-span-2 relative">
          <div className="absolute top-6 left-6 z-10">
            <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              ESG 績效指數
            </h3>
            <p className="text-slate-400 text-xs mt-1">E, S, G 三維度即時影響力追蹤</p>
          </div>

          <div className="w-full h-full pt-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={esgTrend}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[60, 100]}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
                <Area
                  type="monotone"
                  dataKey="environmental"
                  stroke="#34d399"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  fill="none"
                  opacity={0.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* 2. System Intelligence (Radial) */}
        <GlassCard className="col-span-1 md:col-span-4 md:row-span-2 flex flex-col items-center justify-center">
          <h3 className="absolute top-6 left-6 text-sm font-medium text-slate-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> 系統效能
          </h3>
          <div className="w-full h-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="60%"
                outerRadius="100%"
                barSize={10}
                data={[
                  { name: 'Energy', value: healthData?.energyEfficiency ?? 0, fill: '#f59e0b' },
                  { name: 'Memory', value: 100 - (healthData?.memory ?? 0), fill: '#3b82f6' },
                  { name: 'Stability', value: 98, fill: '#10b981' },
                ]}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  dataKey="value"
                  cornerRadius={10}
                />
                <Legend
                  iconSize={8}
                  layout="vertical"
                  verticalAlign="middle"
                  wrapperStyle={{ right: 8, top: '20%' }}
                  formatter={value => <span className="text-slate-400 text-xs">{value}</span>}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            {/* Center Metric */}
            <div className="absolute inset-0 flex items-center justify-center pt-8 pointer-events-none">
              <div className="text-center">
                <span className="text-3xl font-bold text-slate-200">
                  {healthData?.energyEfficiency.toFixed(1)}%
                </span>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">能源效率</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* 3. Key Metrics Row */}
        <GlassCard className="col-span-1 md:col-span-3">
          <MetricValue
            label="活躍專案"
            value="12"
            unit="進行中"
            trend="up"
            trendValue="+2 本週新增"
            icon={Target}
            color="text-blue-400"
          />
        </GlassCard>

        <GlassCard className="col-span-1 md:col-span-3">
          <MetricValue
            label="碳抵換量"
            value="854"
            unit="tCO2e"
            trend="up"
            trendValue="較上月成長 15%"
            icon={Wind}
            color="text-emerald-400"
          />
        </GlassCard>

        <GlassCard className="col-span-1 md:col-span-3 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
          <MetricValue
            label="AI 代理"
            value="48"
            unit="活躍中"
            trend="neutral"
            trendValue="負載最佳化"
            icon={Activity}
            color="text-indigo-400"
          />
        </GlassCard>

        <GlassCard className="col-span-1 md:col-span-3">
          <MetricValue
            label="利害關係人"
            value="3.2k"
            unit="人"
            trend="up"
            trendValue="+128 新增"
            icon={Users}
            color="text-amber-400"
          />
        </GlassCard>

        {/* 4. Project Status Distribution */}
        <GlassCard className="col-span-1 md:col-span-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-300">專案健康度分佈</h3>
            <span className="text-xs text-slate-500">即時狀態</span>
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={projectDist} barSize={12}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={80}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: 'rgba(255,255,255,0.1)',
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {projectDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* 5. Alerts / Feed */}
        <GlassCard className="col-span-1 md:col-span-6 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-300">智慧訊號源</h3>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="space-y-3">
            <div className="flex gap-3 items-start p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="mt-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <div>
                <p className="text-xs text-slate-300">Q1 專案已達成碳抵換目標。</p>
                <span className="text-[10px] text-slate-500">2 分鐘前 • 自動驗證</span>
              </div>
            </div>
            <div className="flex gap-3 items-start p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="mt-1 w-2 h-2 rounded-full bg-amber-400" />
              <div>
                <p className="text-xs text-slate-300">B區伺服器偵測到高能耗異常。</p>
                <span className="text-[10px] text-slate-500">15 分鐘前 • 異常偵測</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
