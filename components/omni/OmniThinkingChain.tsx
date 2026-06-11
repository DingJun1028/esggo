'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Search, GitBranch, Shield, CheckCircle, Sparkles, ChevronRight, Circle } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ThinkingStep {
  id: string;
  phase: 'observe' | 'reason' | 'synthesize' | 'verify' | 'seal';
  label: string;
  detail: string;
  status: 'pending' | 'active' | 'done';
  depth?: number; // 0-2, sub-thought depth
}

interface OmniThinkingChainProps {
  isThinking: boolean;
  steps?: ThinkingStep[];
  title?: string;
  onComplete?: () => void;
  compact?: boolean;
}

// ── Phase Config ──────────────────────────────────────────────────────────────
const PHASE_CONFIG = {
  observe:    { icon: Search,     color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    border: 'border-cyan-400/30',    glow: 'shadow-cyan-500/20',    label: 'OBSERVE'    },
  reason:     { icon: Brain,      color: 'text-violet-400',  bg: 'bg-violet-400/10',  border: 'border-violet-400/30',  glow: 'shadow-violet-500/20',  label: 'REASON'     },
  synthesize: { icon: GitBranch,  color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/30',   glow: 'shadow-amber-500/20',   label: 'SYNTHESIZE' },
  verify:     { icon: Shield,     color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', glow: 'shadow-emerald-500/20', label: 'VERIFY'     },
  seal:       { icon: Sparkles,   color: 'text-rose-400',    bg: 'bg-rose-400/10',    border: 'border-rose-400/30',    glow: 'shadow-rose-500/20',    label: 'SEAL'       },
};

// ── Default demo steps ────────────────────────────────────────────────────────
const DEFAULT_STEPS: ThinkingStep[] = [
  { id: '1',   phase: 'observe',    status: 'pending', label: '讀取輸入語義',           detail: '解析使用者意圖與 ESG 指標關聯性',          depth: 0 },
  { id: '1a',  phase: 'observe',    status: 'pending', label: '上下文感知',             detail: '掃描歷史對話與 5T 知識庫',                 depth: 1 },
  { id: '2',   phase: 'reason',     status: 'pending', label: '多路徑推理展開',         detail: '同時評估 GRI / CSRD / TCFD 三條合規路徑',  depth: 0 },
  { id: '2a',  phase: 'reason',     status: 'pending', label: '碳排放因子匹配',         detail: '比對 ISO 14064-1 排放因子資料庫',          depth: 1 },
  { id: '2b',  phase: 'reason',     status: 'pending', label: '風險矩陣評估',           detail: 'TCFD 氣候情境 1.5°C / 2°C 情境交叉分析',   depth: 2 },
  { id: '3',   phase: 'synthesize', status: 'pending', label: '知識整合',               detail: '將多路徑推理結果收斂為最優解',             depth: 0 },
  { id: '3a',  phase: 'synthesize', status: 'pending', label: '草稿生成',               detail: '依 GRI 2021 框架組裝章節結構',             depth: 1 },
  { id: '4',   phase: 'verify',     status: 'pending', label: '5T 誠信驗算',            detail: 'T1 溯源 · T2 透明 · T4 可信任 驗算閘門',  depth: 0 },
  { id: '4a',  phase: 'verify',     status: 'pending', label: 'ZKP 零知識證明',         detail: 'Pedersen Commitment 同態加法驗證',         depth: 1 },
  { id: '5',   phase: 'seal',       status: 'pending', label: 'SHA-256 Hash Lock 封印', detail: '輸出結果寫入不可篡改的永恆記憶',           depth: 0 },
];

// ── Animated Connector ────────────────────────────────────────────────────────
const ThinkingConnector = ({ active, depth }: { active: boolean; depth: number }) => (
  <div className={`flex items-start ${depth > 0 ? 'ml-6' : ''}`}>
    <div className="flex flex-col items-center mr-3" style={{ marginLeft: depth * 16 }}>
      <div className={`w-px flex-1 min-h-[20px] transition-all duration-500 ${active ? 'bg-gradient-to-b from-violet-400/60 to-transparent' : 'bg-white/5'}`} />
    </div>
  </div>
);

// ── Thinking Node ─────────────────────────────────────────────────────────────
const ThinkingNode = ({ step, index }: { step: ThinkingStep; index: number }) => {
  const cfg = PHASE_CONFIG[step.phase];
  const Icon = cfg.icon;
  const isActive = step.status === 'active';
  const isDone   = step.status === 'done';
  const isPending = step.status === 'pending';
  const indent = (step.depth ?? 0) * 20;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: isPending ? 0.35 : 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      style={{ marginLeft: indent }}
      className="relative"
    >
      <div className={`
        flex items-start gap-3 px-3 py-2.5 rounded-xl border transition-all duration-500
        ${isActive  ? `${cfg.bg} ${cfg.border} shadow-lg ${cfg.glow}` : ''}
        ${isDone    ? 'bg-white/3 border-white/5' : ''}
        ${isPending ? 'border-transparent' : ''}
      `}>
        {/* Icon */}
        <div className={`
          flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5
          ${isActive ? `${cfg.bg} border ${cfg.border}` : 'bg-white/5'}
          transition-all duration-300
        `}>
          {isDone ? (
            <CheckCircle size={14} className="text-emerald-400" />
          ) : isActive ? (
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Icon size={14} className={cfg.color} />
            </motion.div>
          ) : (
            <Circle size={10} className="text-white/20" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {(step.depth ?? 0) === 0 && (
              <span className={`text-[9px] font-black tracking-widest font-mono ${isDone ? 'text-emerald-500' : isActive ? cfg.color : 'text-white/20'}`}>
                {cfg.label}
              </span>
            )}
            <span className={`text-xs font-bold truncate ${isDone ? 'text-white/60' : isActive ? 'text-white' : 'text-white/25'}`}>
              {step.label}
            </span>
          </div>

          <AnimatePresence>
            {(isActive || isDone) && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`text-[10px] leading-relaxed font-mono ${isDone ? 'text-white/30' : 'text-white/55'}`}
              >
                {step.detail}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Active typing cursor */}
          {isActive && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className={`inline-block w-1 h-3 ml-1 rounded-sm ${cfg.color.replace('text-', 'bg-')} opacity-80`}
            />
          )}
        </div>

        {/* Done tick line */}
        {isDone && (
          <ChevronRight size={12} className="text-white/15 flex-shrink-0 mt-1" />
        )}
      </div>
    </motion.div>
  );
};

// ── Radar Pulse Ring ──────────────────────────────────────────────────────────
const RadarRing = ({ active }: { active: boolean }) => (
  <div className="relative w-10 h-10 flex items-center justify-center">
    {active && <>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-violet-400/30"
          animate={{ scale: [1, 1.8 + i * 0.4], opacity: [0.6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
        />
      ))}
    </>}
    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${active ? 'bg-violet-500/20 border-violet-400/40' : 'bg-white/5 border-white/10'}`}>
      <Brain size={18} className={active ? 'text-violet-300' : 'text-white/30'} />
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
export function OmniThinkingChain({
  isThinking,
  steps: externalSteps,
  title = 'OmniAgent 思維鏈 (Thinking Chain)',
  onComplete,
  compact = false,
}: OmniThinkingChainProps) {
  const [steps, setSteps]         = useState<ThinkingStep[]>((externalSteps || DEFAULT_STEPS).map(s => ({ ...s, status: 'pending' })));
  const [activeIdx, setActiveIdx] = useState(-1);
  const [done, setDone]           = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isThinking) {
      setSteps((externalSteps || DEFAULT_STEPS).map(s => ({ ...s, status: 'pending' })));
      setActiveIdx(-1);
      setDone(false);
      return;
    }

    const list = (externalSteps || DEFAULT_STEPS).map(s => ({ ...s, status: 'pending' as const }));
    setSteps(list);
    setActiveIdx(0);
    setDone(false);

    let idx = 0;
    const advance = () => {
      setSteps(prev => prev.map((s, i) =>
        i < idx  ? { ...s, status: 'done' }   :
        i === idx ? { ...s, status: 'active' } :
        { ...s, status: 'pending' }
      ));
      setActiveIdx(idx);

      const delay = 400 + Math.random() * 600 + (list[idx]?.depth ?? 0) * 200;
      timerRef.current = setTimeout(() => {
        idx++;
        if (idx < list.length) {
          advance();
        } else {
          setSteps(prev => prev.map(s => ({ ...s, status: 'done' })));
          setActiveIdx(list.length);
          setDone(true);
          onComplete?.();
        }
      }, delay);
    };

    timerRef.current = setTimeout(advance, 200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isThinking]);

  if (!isThinking && !done) return null;

  const doneCount    = steps.filter(s => s.status === 'done').length;
  const progress     = (doneCount / steps.length) * 100;
  const currentPhase = activeIdx >= 0 && activeIdx < steps.length ? steps[activeIdx]?.phase : 'seal';
  const cfg          = PHASE_CONFIG[currentPhase] || PHASE_CONFIG.seal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={`rounded-3xl overflow-hidden border border-white/8 bg-slate-950/70 backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.07)] ${compact ? 'max-w-sm' : 'w-full'}`}
    >
      {/* Top gloss line */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <RadarRing active={!done} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black tracking-widest text-violet-400 font-mono uppercase">
              {done ? 'COMPLETE' : cfg.label}
            </span>
            {!done && (
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="flex gap-0.5"
              >
                {[0,1,2].map(i => (
                  <div key={i} className={`w-1 h-1 rounded-full ${cfg.color.replace('text-', 'bg-')}`} />
                ))}
              </motion.div>
            )}
          </div>
          <p className="text-xs font-bold text-white/70 truncate">{title}</p>
        </div>
        {done && <Sparkles size={16} className="text-emerald-400 flex-shrink-0" />}
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-3 pb-1">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Thinking Chain Progress</span>
          <span className="text-[9px] font-mono text-white/40">{doneCount}/{steps.length}</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${done ? 'bg-emerald-400' : `bg-gradient-to-r from-violet-500 to-${cfg.color.split('-')[1]}-400`}`}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ background: done ? '#34d399' : `linear-gradient(to right, #7c3aed, ${cfg.color.includes('cyan') ? '#22d3ee' : cfg.color.includes('amber') ? '#fbbf24' : cfg.color.includes('emerald') ? '#34d399' : cfg.color.includes('rose') ? '#fb7185' : '#a78bfa'})` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="px-4 py-3 space-y-1 max-h-80 overflow-y-auto scrollbar-none">
        {steps.map((step, i) => (
          <ThinkingNode key={step.id} step={step} index={i} />
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
          OmniAgent · Hermes Core · 5T Protocol
        </span>
        {done && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[9px] font-black text-emerald-400 font-mono"
          >
            ✓ SEALED
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
