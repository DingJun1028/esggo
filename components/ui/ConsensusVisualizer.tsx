'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Bot, CheckCircle2, XCircle, AlertCircle, 
  Zap, Shield, MessageSquare, ArrowRight 
} from 'lucide-react';
import { BrandCard, BrandBadge, BrandStatusDot } from '../brand';
import { ConsensusResult, AgentOpinion } from '../../lib/swarm-consensus-engine';
import { cn } from '../../lib/utils';

interface Props {
  result: ConsensusResult;
}

const VOTE_META = {
  AGREE: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', label: '贊成' },
  DISAGREE: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: '反對' },
  CONDITIONALLY_AGREE: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50', label: '條件贊成' },
};

export function ConsensusVisualizer({ result }: Props) {
  return (
    <div className="space-y-8">
      {/* Consensus Core */}
      <BrandCard padding="lg" className="bg-gradient-to-br from-slate-900 to-berkeley-blue text-white border-none shadow-premium relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="relative">
             <div className={cn(
               "w-32 h-32 rounded-full flex items-center justify-center border-4 border-white/10 relative z-10 transition-all duration-1000",
               result.status === 'STRONG_CONSENSUS' ? "shadow-[0_0_50px_rgba(16,185,129,0.4)]" : "shadow-[0_0_50px_rgba(251,191,36,0.4)]"
             )}>
                <div className="text-4xl font-black font-mono tracking-tighter">{result.consensusScore}%</div>
             </div>
             {/* Swarm Animation Rings */}
             <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full scale-125" />
             <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 border border-white/10 rounded-full scale-150" />
          </div>

          <div>
             <BrandBadge variant="gold" className="px-4 py-1.5 font-black tracking-widest text-xs">{result.status}</BrandBadge>
             <h3 className="text-xl font-bold mt-4 max-w-md">蜂群共識已達成：策略路徑確認</h3>
             <p className="text-xs text-primary-200 opacity-60 mt-2 font-mono">HASH: {result.hashLock.substring(0, 32)}...</p>
          </div>
        </div>
        <Zap size={200} className="absolute -bottom-20 -right-20 text-white/5 rotate-12" />
      </BrandCard>

      {/* Agent Opinions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.opinions.map((opinion, idx) => {
          const Meta = VOTE_META[opinion.vote];
          return (
            <motion.div
              key={opinion.agentId}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <BrandCard padding="md" className="h-full hover:border-blue-200 transition-all flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", Meta.bg, Meta.color)}>
                      <Bot size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{opinion.role}</p>
                      <h4 className="text-sm font-bold text-berkeley-blue">{opinion.agentId.split('-')[1]}</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <BrandBadge variant={opinion.vote === 'AGREE' ? 'success' : 'warning'} size="xs">{Meta.label}</BrandBadge>
                    <p className="text-[8px] font-black text-slate-300 uppercase mt-1">Conf: {Math.round(opinion.confidence * 100)}%</p>
                  </div>
                </div>
                
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex-1">
                   <p className="text-xs text-slate-600 leading-relaxed italic">
                     "{opinion.critique}"
                   </p>
                </div>
              </BrandCard>
            </motion.div>
          );
        })}
      </div>

      {/* Final Action */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
         <div className="flex items-center gap-3 text-emerald-800">
            <Shield size={20} />
            <p className="text-xs font-bold uppercase tracking-tight">戰略執行權限已授權：5T 封印寫入中...</p>
         </div>
         <BrandStatusDot status="active" pulse size="sm" />
      </div>
    </div>
  );
}
