'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Network, FileText, Shield, UserCheck, 
  Database, GitBranch, ArrowRight, Activity 
} from 'lucide-react';
import { BrandCard, BrandBadge } from '../brand';
import { MemoryGraph, NodeType } from '../../lib/memory-graph-engine';
import { cn } from '../../lib/utils';

interface Props {
  graph: MemoryGraph;
  title?: string;
}

const NODE_CONFIG: Record<NodeType, { icon: any, color: string, bg: string }> = {
  EVIDENCE: { icon: FileText, color: '#003262', bg: '#f1f5f9' },
  POLICY: { icon: Shield, color: '#3b7ea1', bg: '#eff6ff' },
  MEMORY: { icon: Database, color: '#10b981', bg: '#f0fdf4' },
  STAKEHOLDER_EXPECTATION: { icon: UserCheck, color: '#8b5cf6', bg: '#f5f3ff' },
  SIMULATION: { icon: Activity, color: '#f59e0b', bg: '#fffbeb' },
};

export function MemoryGraphVisualizer({ graph, title = '永續記憶因果圖譜' }: Props) {
  return (
    <BrandCard padding="none" className="overflow-hidden border-none shadow-premium bg-white">
      <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-berkeley-blue flex items-center justify-center text-white">
            <Network size={18} />
          </div>
          <h4 className="text-[11px] font-black text-berkeley-blue uppercase tracking-[0.2em]">{title}</h4>
        </div>
        <BrandBadge variant="success" size="xs">Causal Trace Active</BrandBadge>
      </div>

      <div className="p-4 sm:p-8 relative flex flex-row items-center justify-start sm:justify-center gap-8 sm:gap-12 min-h-[350px] sm:min-h-[400px] overflow-x-auto no-scrollbar">
        {/* Simplified linear graph visual for prototype */}
        {graph.nodes.map((node, i) => {
          const Config = NODE_CONFIG[node.type];
          return (
            <React.Fragment key={node.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 group shrink-0"
              >
                <div className="flex flex-col items-center gap-3 w-32 sm:w-40 text-center">
                  <div 
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center shadow-lg border-2 border-white transition-all group-hover:scale-110 group-hover:rotate-6"
                    style={{ backgroundColor: Config.bg, color: Config.color }}
                  >
                    <Config.icon size={24} className="sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{node.type}</p>
                    <p className="text-[10px] sm:text-xs font-bold text-berkeley-blue leading-tight truncate w-full px-1">{node.label}</p>
                    {node.status && (
                      <span className="text-[7px] sm:text-[8px] font-black uppercase text-emerald-600 mt-1 inline-block bg-emerald-50 px-1.5 py-0.5 rounded">
                        {node.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Pulse Effect for current focused node (usually evidence) */}
                {node.type === 'EVIDENCE' && (
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping -z-10 scale-125 sm:scale-150 blur-xl opacity-30" />
                )}
              </motion.div>

              {/* Edge Arrow */}
              {i < graph.nodes.length - 1 && (
                <motion.div 
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: i * 0.2 + 0.1 }}
                  className="flex items-center text-slate-200 shrink-0"
                >
                  <ArrowRight size={16} className="animate-pulse sm:w-5 sm:h-5" />
                  <div className="h-px w-6 sm:w-8 bg-gradient-to-r from-slate-200 to-transparent" />
                </motion.div>
              )}
            </React.Fragment>
          );
        })}

        {/* Causal Background Grid */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003262 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 justify-start sm:justify-center min-w-max px-2">
          {Object.entries(NODE_CONFIG).map(([type, config]) => (
            <div key={type} className="flex items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{type.split('_')[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </BrandCard>
  );
}
