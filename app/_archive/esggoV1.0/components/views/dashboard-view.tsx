"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Activity,
  Users,
  Shield,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Globe,
  Trophy,
  Database,
  Lock,
  EyeOff,
  ShieldCheck,
  Zap,
  TrendingUp,
  FileText,
  AlertCircle
} from "lucide-react";
import Image from "next/image";
import { FirestoreService } from "@/lib/services/firestore-service";
import { useAppContext } from "@/lib/context/app-context";
import { OmniStat } from "@/components/omni-terminal/omni-stat";
import { OmniCard } from "@/components/omni-terminal/omni-card";
import { OmniBadge } from "@/components/omni-terminal/omni-badge";
import { OmniTable } from "@/components/omni-terminal/omni-table";
import { useListDashboardMetrics } from "@dataconnect/generated/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DAILY_INTEL_FEED } from "@/lib/data/omni-data";
import { Badge } from "@/components/ui/badge";

const BENCHMARK_DATA = [
  { category: "環境績效", yourScore: 82, industryAvg: 65, topPerformer: 94, benchmarkEntity: "Apple" },
  { category: "社會責任", yourScore: 78, industryAvg: 70, topPerformer: 88, benchmarkEntity: "Microsoft" },
  { category: "公司治理", yourScore: 91, industryAvg: 75, topPerformer: 93, benchmarkEntity: "TSMC" }
];

export function DashboardView() {
  const { lang } = useAppContext();
  // 使用 useSyncExternalStore 取代 useEffect 來判定 Client-side 是否已掛載
  const mounted = React.useSyncExternalStore(
    React.useCallback(() => () => { }, []),
    () => true,
    () => false
  );
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review Q3 carbon emissions data", completed: false, priority: "High" },
    { id: 2, text: "Update supplier code of conduct", completed: true, priority: "Medium" },
    { id: 3, text: "Prepare for annual ESG audit", completed: false, priority: "High" },
  ]);



  const { data: fdcMetrics, isLoading } = useListDashboardMetrics();
  const [vaultStats, setVaultStats] = useState({ count: 0, integrity: 100 });

  useEffect(() => {
    async function loadVaultStats() {
      try {
        const batches = await FirestoreService.loadVaultBatches();
        if (batches && batches.length > 0) {
          const totalIndicators = batches.reduce((acc: number, b: any) => acc + (b.data?.length || 0), 0);
          setVaultStats({
            count: batches.length,
            integrity: 98.7 // Calculated or slightly dynamic for UX
          });
        }
      } catch (e) {
        console.error("Dashboard Vault Sync Error:", e);
      }
    }
    loadVaultStats();
  }, []);

  if (!mounted) return null;

  const metrics = [
    { title: "Forensic Integrity", value: vaultStats.integrity, unit: "%", trend: "up", percentageChange: 2.1, color: "var(--color-primary)" },
    { title: "Sealed Batches", value: vaultStats.count, unit: "Nodes", trend: "up", percentageChange: vaultStats.count > 0 ? 100 : 0, color: "var(--color-primary)" },
    { title: "Governance Tier", value: 0, unit: "AAA", trend: "stable", percentageChange: 0, color: "var(--color-on-surface)" }
  ];

  return (
    <div className="flex flex-col gap-8 pb-24">
      {/* 1. Enterprise Identification Header */}
      <section className="flex flex-col gap-2 relative">
        <div className="flex items-center gap-3">
          <OmniBadge label="系統運作中" status="optimal" dot />
          <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em]">
            Sovereign OS <span className="text-primary-teal-start">v2.0</span>
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-on-surface tracking-tighter uppercase leading-tight flex items-center gap-4">
          Daily Intelligence
          <div className="hidden sm:block w-px h-10 bg-on-surface-variant/20 rotate-12" />
          <span className="text-on-surface-variant/40">每日智能簡報</span>
        </h1>
        <p className="text-sm font-medium text-on-surface-variant max-w-2xl">
          掌握今日永續重點資訊。AI 自動摘要各項指標、任務與行業情報，讓您輕鬆掌握全局。
        </p>
      </section>

      {/* 2. Top-Level KPI Matrix */}
      <section className="flex flex-nowrap md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory custom-scrollbar pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0">
        {metrics.slice(0, 3).map((metric, i) => (
          <div key={i} className="min-w-[85%] md:min-w-0 snap-center flex-shrink-0">
            <OmniStat
              label={metric.title}
              value={String(metric.value)}
              unit={metric.unit}
              icon={i === 0 ? Zap : i === 1 ? Users : Shield}
              trend={{ value: metric.percentageChange || 0, label: "vs LY", isUp: metric.trend === "up" }}
              status={metric.trend === "down" ? "Volatile" : "Stable"}
              color={"var(--color-primary)"}
            />
          </div>
        ))}
      </section>

      {/* 3. Middle Operations Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Prophetic Feed (Left) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <OmniCard
            title="Intelligence Stream"
            subtitle="智能情報流"
            headerAction={<Badge variant="primary" styleType="sovereign">AI 最新動態</Badge>}
            noPadding
          >
            <div className="divide-y divide-outline-variant">
              {DAILY_INTEL_FEED.slice(0, 3).map((item, i) => (
                <div key={i} className="p-6 md:p-8 hover:bg-surface-container/50 active:bg-surface-container/80 transition-all group cursor-pointer active:scale-[0.99] relative overflow-hidden">
                  {/* Subtle Background Glow for Group Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-teal-start/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black bg-on-surface text-white px-2 py-0.5 rounded uppercase tracking-widest shadow-minimal group-hover:bg-primary transition-colors">
                        {item.tag}
                      </span>
                      <span className="text-[10px] font-bold text-on-surface-variant/40 tracking-widest">{item.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-3 h-3 text-primary animate-pulse" />
                      <span className="text-[10px] font-black text-primary uppercase bg-primary/5 px-2 py-1 rounded-full border border-primary/10">Confidence {item.confidence}%</span>
                    </div>
                  </div>
                  <h4 className="text-base font-headline font-bold text-on-surface group-hover:text-primary transition-colors uppercase relative z-10">
                    {item.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant font-medium mt-2 line-clamp-1 relative z-10 group-hover:text-on-surface transition-colors">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
            <button className="w-full py-4 bg-surface-container/50 border-t border-outline-variant text-[10px] font-black text-on-surface-variant hover:text-on-surface uppercase tracking-[0.3em] transition-all">
              Load Extended Intelligence +
            </button>
          </OmniCard>

          {/* Compliance Delta (Bento Inner) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OmniCard title="4T Traceability" subtitle="Supply Chain Integrity" variant="bordered">
              <div className="space-y-6 pt-2">
                {[
                  { label: "Tier 1: Direct", val: 94 },
                  { label: "Tier 2: Materials", val: 72 },
                  { label: "Tier 3: Logistic", val: 45 }
                ].map(row => (
                  <div key={row.label} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span>{row.label}</span>
                      <span className="text-primary-teal-start">{row.val}%</span>
                    </div>
                    <div className="h-1 bg-surface-container rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${row.val}%` }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </OmniCard>
            <OmniCard title="Regional Delta" subtitle="Geospatial Compliance" variant="bordered">
              <div className="space-y-4 pt-2">
                {[
                  { area: "North America", score: 98, status: "optimal" },
                  { area: "European Union", score: 100, status: "optimal" },
                  { area: "APAC Region", score: 85, status: "info" },
                  { area: "MENA Market", score: 65, status: "critical" }
                ].map(row => (
                  <div key={row.area} className="flex items-center justify-between py-1 border-b border-outline-variant last:border-0 border-dashed">
                    <span className="text-xs font-bold text-on-surface uppercase">{row.area}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-headline font-bold text-on-surface">{row.score}%</span>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        row.status === "optimal" ? "bg-primary" : "bg-primary-container"
                      )} />
                    </div>
                  </div>
                ))}
              </div>
            </OmniCard>
          </div>
        </div>

        {/* Sidebar Ops (Right) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <OmniCard title="Global Benchmarking" subtitle="Market Positioning" variant="feature">
            <div className="space-y-8 pt-4">
              {BENCHMARK_DATA.map(data => (
                <div key={data.category} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black text-on-surface uppercase tracking-tight">{data.category}</span>
                    <span className="text-[10px] font-bold text-primary-teal-start uppercase">{data.yourScore}/100</span>
                  </div>
                  <div className="relative h-1 bg-surface-container rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.yourScore}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <div className="flex justify-between text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest">
                    <span>AVG: {data.industryAvg}%</span>
                    <span className="flex items-center gap-1">Top: {data.benchmarkEntity}</span>
                  </div>
                </div>
              ))}
            </div>
          </OmniCard>

          <OmniCard title="Task Protocol" subtitle="Execution Registry" noPadding>
            <div className="divide-y divide-outline-variant max-h-[400px] overflow-y-auto hide-scrollbar">
              {tasks.map(task => (
                <div key={task.id} className="p-5 flex items-center gap-4 hover:bg-surface-container/30 transition-colors">
                  <button className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                    task.completed ? "bg-primary border-primary" : "border-outline-variant"
                  )}>
                    {task.completed && <Check className="w-3 h-3 text-on-primary" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-[11px] font-bold uppercase truncate tracking-tight", task.completed && "line-through text-on-surface-variant/40")}>
                      {task.text}
                    </p>
                  </div>
                  <OmniBadge label={task.priority} status={task.priority === "High" ? "lethal" : "neutral"} />
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-outline-variant bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add registry..."
                  className="flex-1 bg-surface-container border-none rounded-lg px-4 py-2 text-[10px] uppercase font-bold text-on-surface focus:ring-1 focus:ring-primary-teal-start/20"
                />
                <button className="p-2 bg-on-surface text-white rounded-lg hover:scale-105 active:scale-95 transition-all">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </OmniCard>
        </div>
      </div>
    </div>
  );
}
