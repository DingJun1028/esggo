"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context/app-context";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Zap,
  Activity,
  ShieldAlert,
  Database,
  Cpu,
  RefreshCw,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Gauge,
  Wind,
  Server,
  MousePointer2,
  ChevronRight,
  Terminal
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

const ANOMALIES = [
  { id: 1, source: "台電二路 (電力數據)", desc: "預估用電量與實際感測值偏差超過 12.5%", severity: "High", status: "Pending" },
  { id: 2, source: "供應商 A：碳足跡清單", desc: "Q3 數據上傳頻率較歷史均值下降 25%，疑有漏報風險", severity: "Medium", status: "Investigating" },
  { id: 3, source: "範疇一：公務車用油錄入", desc: "格式不符造成小數點位數溢出，系統已自動校正", severity: "Low", status: "Resolved" },
];

const INITIAL_PERFORMANCE_DATA = [
  { time: "00:00", cpu: 45, energy: 30 },
  { time: "04:00", cpu: 30, energy: 20 },
  { time: "08:00", cpu: 65, energy: 50 },
  { time: "12:00", cpu: 85, energy: 75 },
  { time: "16:00", cpu: 70, energy: 60 },
  { time: "20:00", cpu: 55, energy: 40 },
];

export function SystemOptimizationView() {
  const { isGreenComputingMode, setIsGreenComputingMode, updateAnalyticalMetric } = useAppContext();
  const [isCleaning, setIsCleaning] = useState(false);
  const [optimizationScore, setOptimizationScore] = useState(82);
  const [performanceData, setPerformanceData] = useState(INITIAL_PERFORMANCE_DATA);

  // Live Data Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceData(prev => prev.map(d => ({
        ...d,
        cpu: Math.max(10, Math.min(100, d.cpu + (Math.random() * 4 - 2))),
        energy: Math.max(10, Math.min(100, d.energy + (Math.random() * 4 - 2)))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCleanAnomalies = () => {
    setIsCleaning(true);
    setTimeout(() => {
      setIsCleaning(false);
      setOptimizationScore(prev => Math.min(100, prev + 5));
      updateAnalyticalMetric?.("dataPurity", 5);
      // Simulate success notification
    }, 2000);
  };

  return (
    <div className={cn(
      "space-y-8 pb-20 transition-all duration-1000 relative",
      isGreenComputingMode && "brightness-[0.9] saturate-[0.8] contrast-[1.1]"
    )}>
      {/* Background Micro-grid (Sovereign Layer) */}
      <div className={cn(
        "fixed inset-0 pointer-events-none opacity-0 transition-opacity duration-1000 z-0",
        isGreenComputingMode && "opacity-100"
      )}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98111_1px,transparent_1px),linear-gradient(to_bottom,#10b98111_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent animate-pulse" />
      </div>

      {/* Full-screen Scanline Overlay during purification */}
      <AnimatePresence>
        {isCleaning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
          >
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: "200%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-full h-1/2 bg-gradient-to-b from-transparent via-stitch-teal-start/20 to-transparent blur-2xl"
            />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(20,184,166,0.03)_0px,rgba(20,184,166,0.03)_1px,transparent_1px,transparent_2px)] bg-[size:100%_2px]" />
          </motion.div>
        )}
      </AnimatePresence>

      {isGreenComputingMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 pointer-events-none z-50 rounded-[32px] border-[12px] border-emerald-500/20 shadow-[inset_0_0_150px_rgba(16,185,129,0.1)] transition-all duration-1000"
        >
          <div className="absolute top-8 right-8 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Low Emission Sync: On
            </span>
          </div>
        </motion.div>
      )}

      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-3xl font-black text-stitch-text tracking-tighter flex items-center gap-3">
            系統優化中心
            <div className="w-2 h-2 rounded-full bg-stitch-teal-start shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
          </h1>
          <p className="text-stitch-muted mt-2 font-medium max-w-lg">
            監控數據熵值、調整運算能效並管理核心 AI 模型路徑。
            <span className="text-stitch-teal-start ml-2 font-black text-[10px] uppercase tracking-tighter cursor-help">Sovereign OS v2.0</span>
          </p>
        </div>

        <GlassCard className="px-6 py-4 flex items-center gap-6 border-black/5 stitch-glass shadow-sovereign-sm bg-white/40 backdrop-blur-3xl group">
          <div className="text-right">
            <p className="text-[10px] font-black text-stitch-muted uppercase tracking-widest mb-1 group-hover:text-stitch-teal-start transition-colors">整體優化評分</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-stitch-teal-start">{optimizationScore}</span>
              <span className="text-xs font-bold text-stitch-muted">/ 100</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-stitch-teal-start to-stitch-teal-end p-px shadow-lg group-hover:shadow-stitch-teal-start/20 transition-all">
            <div className="w-full h-full rounded-[0.85rem] bg-white flex items-center justify-center">
              <Gauge className="w-7 h-7 text-stitch-teal-start group-hover:rotate-12 transition-transform" />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* 1. Entropy Forge - Anomaly Detection */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-8 space-y-8 border-black/5 shadow-minimal relative overflow-hidden bg-white/40 backdrop-blur-3xl">
            {/* Background Fluid Decor */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-stitch-teal-start/5 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px]" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-white shadow-sovereign-sm border border-black/5 text-stitch-teal-start relative">
                  <div className="absolute inset-0 bg-stitch-teal-start/5 animate-pulse rounded-2xl" />
                  <ShieldAlert className="w-8 h-8 relative z-10" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-stitch-text tracking-tight group-hover:text-stitch-teal-start transition-colors">數據熵值熔爐 (Entropy Forge)</h3>
                  <p className="text-[10px] font-black text-stitch-muted uppercase tracking-widest mt-1 flex items-center gap-2">
                    主動監測 ESG 數據異常與完整度偏移
                    <span className="w-1 h-1 rounded-full bg-stitch-muted/30" />
                    <span className="text-stitch-teal-start">Live Forensic Scanning</span>
                  </p>
                </div>
              </div>
              <Button
                variant="solid"
                onClick={handleCleanAnomalies}
                disabled={isCleaning}
                className="px-8 py-7 h-auto font-black text-xs uppercase tracking-widest rounded-3xl group border-none bg-stitch-teal-start text-white hover:shadow-[0_20px_50px_rgba(20,184,166,0.3)] hover:-translate-y-1 transition-all disabled:opacity-50"
              >
                {isCleaning ? (
                  <RefreshCw className="w-4 h-4 mr-3 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-3 group-hover:rotate-12 transition-transform" />
                )}
                {isCleaning ? "優化處理中..." : "啟動全域數據淨化"}
              </Button>
            </div>

            <div className="space-y-4 relative z-10">
              <AnimatePresence>
                {ANOMALIES.map((anomaly, idx) => (
                  <motion.div
                    key={anomaly.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 rounded-[2rem] border border-black/5 bg-white/50 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-white hover:shadow-sovereign-sm transition-all"
                  >
                    <div className="flex gap-6 flex-1">
                      <div className="relative">
                        <div className={cn(
                          "w-1 h-12 rounded-full",
                          anomaly.severity === 'High' ? 'bg-red-500' :
                            anomaly.severity === 'Medium' ? 'bg-amber-500' :
                              'bg-stitch-teal-start'
                        )} />
                        {anomaly.severity === 'High' && (
                          <div className="absolute inset-0 bg-red-500 blur-md animate-pulse opacity-50" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-stitch-text">{anomaly.source}</span>
                          <Badge
                            variant={anomaly.severity === 'High' ? 'critical' : anomaly.severity === 'Medium' ? 'lethal' : 'optimal'}
                            styleType="sovereign"
                            className="px-3 py-0.5 text-[9px] uppercase font-black tracking-widest shadow-sm"
                          >
                            {anomaly.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-stitch-muted font-bold leading-relaxed max-w-md">{anomaly.desc}</p>
                      </div>
                    </div>
                    <Button variant="wireframe" className="h-11 px-7 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-stitch-teal-start hover:text-white border-black/5 transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                      審閱詳情
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="p-7 bg-gradient-to-r from-stitch-teal-start/[0.03] to-transparent rounded-[2.5rem] border border-stitch-teal-start/10 flex items-start gap-4">
              <div className="p-3 rounded-[1.25rem] bg-white shadow-sovereign-sm border border-black/5 shrink-0 group-hover:rotate-12 transition-transform">
                <Database className="w-6 h-6 text-stitch-teal-start" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-black text-stitch-teal-start flex items-center gap-2">
                  數據資產對齊報告：API 實時鏈接
                  <div className="w-1.5 h-1.5 rounded-full bg-stitch-teal-start animate-ping" />
                </h4>
                <p className="text-xs text-stitch-muted leading-relaxed font-bold">
                  當前系統已負載 12 組物聯網串接端點與 3 組第三方核查 API。數據純淨度指標已較上週提升 14.2%，自動化審核成功率達 92.8%。
                  <span className="block mt-2 text-[10px] font-black text-stitch-teal-start/60 underline cursor-pointer">檢視鏈路健康度地圖 →</span>
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 2. Efficiency Mode - Green Computing */}
        <div className="space-y-6">
          <GlassCard className="p-8 space-y-8 border-black/5 shadow-minimal bg-white/40 backdrop-blur-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white shadow-sm border border-emerald-500/10 text-emerald-600">
                  <Wind className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-stitch-text tracking-tight uppercase text-sm">綠色算力模式</h3>
                  <p className="text-[9px] font-black text-emerald-600/60 uppercase tracking-tighter">Dynamic Emission Control</p>
                </div>
              </div>
              <button
                onClick={() => setIsGreenComputingMode?.(!isGreenComputingMode)}
                className={cn(
                  "w-14 h-7 rounded-full p-1.5 transition-all duration-500 shadow-inner",
                  isGreenComputingMode ? 'bg-emerald-500' : 'bg-stitch-muted/20'
                )}
              >
                <motion.div
                  className="w-4 h-4 rounded-full bg-white shadow-md"
                  animate={{ x: isGreenComputingMode ? 28 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              <div className="p-6 rounded-[2rem] bg-white border border-black/5 shadow-minimal space-y-2">
                <p className="text-[10px] font-black text-stitch-muted uppercase tracking-widest">CPU 負載</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-stitch-text tracking-tighter">{isGreenComputingMode ? '32%' : '58%'}</p>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
              </div>
              <div className="p-6 rounded-[2rem] bg-white border border-black/5 shadow-minimal space-y-2">
                <p className="text-[10px] font-black text-stitch-muted uppercase tracking-widest">節能效率</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-emerald-600 tracking-tighter">+{isGreenComputingMode ? '45%' : '12%'}</p>
                  <ChevronRight className="w-4 h-4 text-emerald-300" />
                </div>
              </div>
            </div>

            <div className="h-[200px] w-full mt-4 relative z-10 bg-emerald-500/5 rounded-3xl p-4 border border-emerald-500/10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(16,185,129,0.1)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      borderRadius: '1.5rem',
                      border: '1px solid rgba(16,185,129,0.2)',
                      padding: '16px',
                      boxShadow: '0 20px 40px rgba(16,185,129,0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                    labelStyle={{ fontWeight: 'black', color: '#64748b', fontSize: '9px', textTransform: 'uppercase', marginBottom: '8px' }}
                  />
                  <XAxis hide dataKey="time" />
                  <YAxis hide />
                  <Area
                    type="monotone"
                    dataKey="energy"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorPerf)"
                    strokeWidth={4}
                    animationDuration={2000}
                    baseLine={0}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(16,185,129,0.02)_20px,rgba(16,185,129,0.02)_40px)]" />
            </div>

            <div className="flex gap-4 text-[10px] font-bold text-emerald-800 bg-emerald-50/50 p-5 rounded-3xl border border-emerald-100/50 italic leading-relaxed relative z-10">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                動態算力節省模式已啟動，系統將優先調用邊緣緩存節點。
                <p className="mt-1 font-black text-emerald-500 uppercase tracking-tighter not-italic">Estimated Saving: 2.4kg CO2e/hr</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Interaction Optimization */}
        <GlassCard className="p-10 space-y-8 border-black/5 shadow-minimal bg-white/40 backdrop-blur-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-stitch-teal-start/20 to-transparent" />

          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-white shadow-sovereign-sm border border-black/5 text-stitch-teal-start">
              <MousePointer2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-black text-stitch-text tracking-tight uppercase">操作體驗優化</h3>
              <p className="text-[9px] font-black text-stitch-muted uppercase tracking-widest mt-0.5">Interface Response Engines</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="p-8 rounded-[2.5rem] bg-white border border-black/5 hover:border-stitch-teal-start/30 hover:-translate-y-1 hover:shadow-sovereign-sm transition-all space-y-5 group relative">
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-stitch-teal-start/40" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-stitch-teal-start/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                <BarChart3 className="w-6 h-6 text-stitch-teal-start" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-black text-stitch-text">極速預渲染看板</h4>
                <p className="text-[11px] text-stitch-muted font-bold leading-relaxed">
                  針對數據密集的 ESG 儀表板進行底層幾何渲染優化，首屏加載速度提升 40%。
                </p>
              </div>
              <Button variant="wireframe" className="w-full py-5 h-auto font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-stitch-teal-start hover:text-white transition-all shadow-sm border-black/5">應用全局緩存</Button>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-white border border-black/5 hover:border-amber-500/30 hover:-translate-y-1 hover:shadow-sovereign-sm transition-all space-y-5 group relative">
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-amber-500/40" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-sm">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-black text-stitch-text">智能熱圖通告</h4>
                <p className="text-[11px] text-stitch-muted font-bold leading-relaxed">
                  根據使用者習慣自動調整最重要的 ESG 指標位置，實現點擊效率最大化。
                </p>
              </div>
              <Button variant="wireframe" className="w-full py-5 h-auto font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-amber-500 hover:text-white transition-all shadow-sm border-black/5">開啟動態佈局</Button>
            </div>
          </div>
        </GlassCard>

        {/* Real-time Logs / Audit */}
        <GlassCard className="p-10 flex flex-col border-black/10 shadow-sovereign bg-[#0a0f18] group relative overflow-hidden">
          {/* Scanning Line Decoration */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.4)_0px,rgba(0,0,0,0.4)_1px,transparent_1px,transparent_3px)]" />
            <motion.div
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 0.1, repeat: Infinity }}
              className="absolute inset-0 bg-emerald-500/5"
            />
          </div>

          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white">
                <Terminal className="w-7 h-7 text-slate-500 group-hover:text-stitch-teal-start transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight uppercase">系統審核軌跡 (System Logs)</h3>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Live Forensic Trail v4.0</p>
              </div>
            </div>
            <div className="flex gap-1.5 p-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-red-500/80 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-amber-500/80" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
            </div>
          </div>

          <div className="flex-1 space-y-6 font-mono text-[11px] overflow-hidden relative z-10">
            {[
              { time: "08:45:12", tag: "INFO", color: "text-emerald-400", msg: "Green Computing Mode: ACTIVE. Edge cache nodes initialized." },
              { time: "08:42:05", tag: "WARN", color: "text-amber-400", msg: "Anomaly detected in Scope 2 sensor. Verification required." },
              { time: "08:30:00", tag: "SYNC", color: "text-blue-400", msg: "Cross-platform metadata sync: NCBDB <=> SRC Vault COMPLETED." },
              { time: "08:15:44", tag: "INFO", color: "text-emerald-400", msg: "ZKP Handshake: User Session Sec-V4 ESTABLISHED." },
              { time: "08:02:11", tag: "SYS", color: "text-slate-500", msg: "Auto-cleanup of temporary export buffers triggered." }
            ].map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-5 border-b border-white/5 pb-3 last:border-none group/line hover:bg-white/5 transition-colors cursor-crosshair px-2 -mx-2 rounded-lg"
              >
                <span className="text-slate-500 font-bold group-hover/line:text-slate-300 transition-colors w-16">{log.time}</span>
                <span className={cn("font-black w-14 tracking-tighter truncate", log.color)}>[{log.tag}]</span>
                <span className="text-slate-400 group-hover/line:text-slate-200 transition-colors uppercase truncate flex-1">{log.msg}</span>
                <Activity className="w-3 h-3 text-white/10 group-hover/line:text-stitch-teal-start transition-colors" />
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex justify-between items-center relative z-10">
            <div className="text-[10px] text-slate-500 font-bold flex items-center gap-4">
              <span className="animate-pulse flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                DART SYNC ACTIVE
              </span>
              <span className="opacity-40">Uptime: 242:15:04</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-5 py-2.5 bg-white/5 rounded-2xl border border-white/10 hover:border-stitch-teal-start/30 transition-all cursor-pointer">
              <Activity className="w-3 h-3 text-emerald-500" />
              系統連線中：穩定
            </div>
          </div>

          {/* CRT Flickering Effect Overlay */}
          <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent animate-pulse" />
        </GlassCard>
      </div>
    </div>
  );
}
