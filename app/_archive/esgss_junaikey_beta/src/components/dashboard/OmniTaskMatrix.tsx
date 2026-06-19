import React, { useEffect, useState } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, AlertTriangle, Zap, Target, Activity } from 'lucide-react';
import {
  evolutionaryCalendarService,
  CriticalPivot,
} from '../../services/EvolutionaryCalendarService';
import { activeInsightEngine, InsightNudge } from '../../services/ActiveInsightEngine';

import { useConfirm } from '../../hooks/useConfirm';

export const OmniTaskMatrix: React.FC = () => {
  const confirm = useConfirm();
  const [pivots, setPivots] = useState<CriticalPivot[]>([]);
  const [nudges, setNudges] = useState<InsightNudge[]>([]);
  const [agencyTasks, setAgencyTasks] = useState<any[]>([]);

  const handleInjectTask = async (nudge: InsightNudge) => {
    const ok = await confirm({
      title: '任務注入系統',
      message: `確定要將 "${nudge.message}" 注入主動任務矩陣嗎？這將調動相關 Agent 資源進行即時干預。`,
      confirmLabel: '確認注入',
      cancelLabel: '取消',
      variant: 'success'
    });

    if (ok) {
      omniLogger.info(LogCategory.SYSTEM, '[OmniTaskMatrix] Task injected:', nudge.id);
      // In a real app, this would call a service
      alert('任務已成功注入矩陣');
    }
  };

  useEffect(() => {
    const load = async () => {
      const p = await evolutionaryCalendarService.calculateCriticalPivots('善向永續');
      const n = await activeInsightEngine.generateNudges();

      // Auto-trigger inspection on load for demo
      await import('../../lib/agency-service').then(async ({ Agency_Service }) => {
        await Agency_Service.autoInspect();
        const tasks = await Agency_Service.getTasks();
        setAgencyTasks(tasks);
      });

      setPivots(p);
      setNudges(n);
    };
    load();
  }, []);

  return (
    <div className="h-full flex flex-col gap-6 p-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden">
      {/* 1. Agency Tasks (Trackable) - NEW SECTION for Phase 37 */}
      <section className="flex-none flex flex-col mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-emerald-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-tighter">
              Agency Matrix (自動巡檢)
            </h3>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
            Active
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
          {agencyTasks.length === 0 && (
            <div className="text-slate-500 text-xs italic px-2">
              System Green. No active inspections.
            </div>
          )}
          {agencyTasks.map((task, idx) => (
            <div
              key={idx}
              className="min-w-[200px] p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-xl flex flex-col gap-2 relative overflow-hidden"
            >
              {/* Scan Line Animation */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-400/50 animate-[scan_2s_linear_infinite]" />

              <div className="flex justify-between items-start">
                <span className="text-[10px] text-emerald-300 font-mono tracking-wide">
                  {task.id?.slice(0, 8) || 'TASK'}
                </span>
                <span
                  className={`text-[9px] px-1.5 rounded ${task.priority === 'High' ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}
                >
                  {task.status}
                </span>
              </div>
              <div className="font-bold text-xs text-white leading-tight">{task.title}</div>
              <div className="text-[10px] text-emerald-400/60 mt-auto flex items-center gap-1">
                Agent: {task.agent_id}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Pivots Section */}
      <section className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-cyan-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-tighter">
              進化里程碑 (Critical Pivots)
            </h3>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
          {pivots.map(p => (
            <div
              key={p.id}
              className="p-3 bg-slate-950/50 border border-slate-800 rounded-2xl flex items-center gap-4 group hover:border-cyan-500/30 transition-all"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${p.syncStatus === 'SYNCED'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-slate-800 text-slate-500'
                  }`}
              >
                {p.syncStatus === 'SYNCED' ? <CheckCircle size={18} /> : <Clock size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-200 truncate">{p.milestone}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] text-slate-500 font-mono">
                    {new Date(p.targetDate).toLocaleDateString()}
                  </span>
                  <div className="flex gap-1">
                    {p.dnaMarkers.map((m, i) => (
                      <span
                        key={i}
                        className="text-[8px] px-1 bg-slate-800 text-slate-500 rounded border border-slate-700"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Insight Nudges Section */}
      <section className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-amber-400" />
          <h3 className="text-sm font-black text-white uppercase tracking-tighter">
            主動洞察 (Active Insights)
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
          {nudges.map(n => (
            <motion.div
              key={n.id}
              whileHover={{ x: 5 }}
              className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-2 opacity-20">
                <Target size={40} className="text-amber-400" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[8px] font-black px-1.5 py-0.5 rounded ${n.priority === 'HIGH'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                      }`}
                  >
                    {n.priority} ADVICE
                  </span>
                </div>
                <p className="text-xs text-amber-200 font-medium mb-2 leading-relaxed">
                  {n.message}
                </p>
                <button
                  onClick={() => handleInjectTask(n)}
                  className="flex items-center gap-1 text-[10px] text-amber-400 font-black hover:text-amber-300 transition-colors"
                >
                  立即注入任務矩陣 <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ArrowRight = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
