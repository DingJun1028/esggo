'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid3X3, ShieldCheck, Activity, Lock, Globe, 
  ChevronRight, Info, AlertTriangle, CheckCircle2,
  Database, RefreshCw, FileBarChart, Loader2, Zap,
  History, Fingerprint, Waves, Bot
  } from 'lucide-react';
import { 
  BrandCard, BrandButton, BrandBadge, BrandTabs, 
  StandardPage, BrandStatusDot, BrandModal
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';
import { 
  EndToEndMatrix, 
  MatrixLifecycleStage, 
  MatrixQueryResponse,
  MatrixCell
} from '../../types/matrix';
import { T5Status } from '../../types/omni-core';

/**
 * Omni_Terminal | 🏛️ 終始矩陣：語義治理介面
 * v1.1 | 液態玻璃交互質感 (Liquid Glass Interaction)
 */
export default function EndToEndMatrixPage() {
  const [data, setData] = useState<MatrixQueryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCell, setHoveredCell] = useState<{ stage: MatrixLifecycleStage, gate: T5Status, details: MatrixCell } | null>(null);

  const fetchMatrix = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/matrix?projectId=ox-holy-project');
      if (res.ok) {
        setData(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, []);

  const stages: MatrixLifecycleStage[] = ['ORIGIN', 'EXTRACTION', 'VERIFICATION', 'SEALING', 'REPORTING', 'ARCHIVING'];
  const gates: T5Status[] = ['Tangible', 'Traceable', 'Trackable', 'Transparent', 'Trustworthy'];

  const stageLabels: Record<MatrixLifecycleStage, string> = {
    'ORIGIN': '源起 (Origin)',
    'EXTRACTION': '提取 (Transmute)',
    'VERIFICATION': '驗證 (Dialectics)',
    'SEALING': '封印 (Immutable)',
    'REPORTING': '發布 (Manifest)',
    'ARCHIVING': '歸檔 (Eternal)'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS': return 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
      case 'FAIL': return 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]';
      case 'LOCKED': return 'bg-[#003262] shadow-[0_0_12px_rgba(0,50,98,0.4)]';
      default: return 'bg-slate-200';
    }
  };

  // ── Universal Page Configuration ──────────────────────────────────
  const pageConfig: UniversalPageConfig = {
    id: 'e2e-matrix',
    title: '英標繁博 · 終始矩陣',
    subtitle: '語義治理規範 v1.1 | 英標為骨，繁博為魂。',
    icon: <Grid3X3 size={32} className="text-[#003262]" />,
    griReference: 'Semantic Governance Protocol',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
    isOXModule: true,
    features: { useAuditLog: true },
    
    primaryActions: [
      { id: 'refresh', label: '重新核算', icon: <RefreshCw size={16} className={loading ? 'animate-spin' : ''}/>, onClick: fetchMatrix },
      { id: 'export', label: '匯出誠信證書', icon: <FileBarChart size={16}/>, variant: 'secondary', onClick: () => alert('正在生成誠信證書...') }
    ],

    kpis: [
      { key: 'compliance', label: '熵減秩序值', value: data?.matrix.complianceScore.toString() || '0', unit: '%', icon: <Waves size={18} className="text-blue-500"/>, verified: true },
      { key: 'locked_nodes', label: '不可磨滅之印記', value: '12', unit: 'Nodes', icon: <Fingerprint size={18} className="text-amber-500"/> },
      { key: 'audit_count', label: '溯源日誌', value: '1,284', unit: 'Entries', icon: <History size={18}/> },
    ],

    sections: [
      {
        id: 'matrix-grid',
        title: '語義治理結構矩陣 (Semantic Governance Grid)',
        columns: 12,
        component: (
          <div className="space-y-6">
            {loading ? (
              <div className="h-[600px] flex items-center justify-center bg-white/50 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <Loader2 size={64} className="animate-spin text-[#003262] opacity-20" />
                    <Bot size={32} className="absolute inset-0 m-auto text-[#003262] animate-pulse" />
                  </div>
                  <p className="text-xs font-black text-[#003262]/40 uppercase tracking-[0.4em]">正在重構語義網格...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto pb-8 no-scrollbar">
                <table className="w-full border-separate border-spacing-4">
                  <thead>
                    <tr>
                      <th className="p-4 text-left">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">英標緯線 \ 繁博經線</span>
                      </th>
                      {gates.map(gate => (
                        <th key={gate} className="p-4 text-center">
                          <div className="flex flex-col items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-[#FDB515]" />
                             <BrandBadge variant="outline" size="xs" className="px-5 py-2.5 rounded-2xl border-slate-100 bg-white shadow-sm text-[#003262] font-black tracking-widest uppercase">
                               {gate}
                             </BrandBadge>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stages.map((stage) => (
                      <tr key={stage}>
                        <td className="p-4 min-w-[200px]">
                          <div className="flex items-center gap-4 group">
                            <div className="w-1.5 h-12 bg-gradient-to-b from-[#003262] to-transparent rounded-full group-hover:scale-y-110 transition-transform origin-top" />
                            <div>
                              <p className="text-xs font-black text-[#003262] uppercase tracking-wider">{stageLabels[stage]}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Lifecycle Transmutation</p>
                            </div>
                          </div>
                        </td>
                        {gates.map((gate) => {
                          const cell = data?.matrix.grid[stage][gate];
                          const isActive = hoveredCell?.stage === stage && hoveredCell?.gate === gate;
                          return (
                            <td key={gate} className="p-0">
                              <motion.div
                                whileHover={{ scale: 1.05, y: -4 }}
                                onHoverStart={() => setHoveredCell({ stage, gate, details: cell! })}
                                onHoverEnd={() => setHoveredCell(null)}
                                className={`
                                  relative h-36 rounded-[2.5rem] border-2 transition-all duration-500 p-6 cursor-none
                                  ${isActive 
                                    ? 'border-[#003262] bg-white shadow-extreme z-10' 
                                    : 'border-slate-50 bg-white/60 backdrop-blur-md shadow-premium'}
                                `}
                              >
                                <div className="flex justify-between items-start mb-6">
                                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform duration-500 ${isActive ? 'rotate-12 scale-110' : ''} ${getStatusColor(cell?.status || '')}`}>
                                    {cell?.status === 'LOCKED' ? <Lock size={16} className="text-[#FDB515]" /> : <CheckCircle2 size={16} className="text-white" />}
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{cell?.status}</p>
                                    <div className="w-8 h-1 bg-slate-50 rounded-full mt-1 overflow-hidden">
                                       <motion.div 
                                         className="h-full bg-blue-500"
                                         initial={{ width: 0 }}
                                         animate={{ width: cell?.status === 'LOCKED' ? '100%' : '60%' }}
                                       />
                                    </div>
                                  </div>
                                </div>
                                
                                <p className="text-[10px] font-black text-[#003262] uppercase leading-none mb-2 tracking-tighter">{gate}</p>
                                <div className="h-[2px] w-4 bg-[#FDB515] mb-3" />
                                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed italic font-medium">
                                  {cell?.status === 'LOCKED' ? '誠信刻印：真理哈希已鎖定' : '辯證中：秩序建立中'}
                                </p>

                                {isActive && (
                                  <motion.div 
                                    layoutId="cursor-glow"
                                    className="absolute inset-0 rounded-[2.5rem] bg-blue-500/5 pointer-events-none"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                  />
                                )}
                              </motion.div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      },
      {
        id: 'node-soul',
        title: '熵減煉金術：混沌中開闢秩序之關鍵',
        columns: 4,
        component: (
          <BrandCard padding="lg" className="h-full bg-[#003262] text-white border-none shadow-2xl relative overflow-hidden rounded-[3rem]">
             <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-3xl bg-[#FDB515] flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <Zap size={28} className="text-[#003262]" />
                   </div>
                   <div>
                      <h4 className="font-black text-lg uppercase tracking-widest leading-none mb-1">萬能元件心核</h4>
                      <p className="text-[10px] text-blue-300 font-bold uppercase tracking-[0.2em]">Node Intelligence</p>
                   </div>
                </div>

                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-2xl">
                   <p className="text-[10px] font-black text-[#FDB515] uppercase tracking-[0.3em] mb-4">演化路徑 (Evolution History)</p>
                   <p className="text-sm text-blue-50/90 leading-relaxed font-medium italic">
                     「{hoveredCell?.details.evolutionNote || '請將游標懸浮於節點之上，以嗅探組件之靈魂演化軌跡。'}」
                   </p>
                </div>

                <div className="space-y-6 px-2">
                   <div>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Globe size={12}/> 數據標註 (Evidence Origin)
                      </p>
                      <p className="text-xs text-blue-100 font-bold uppercase tracking-tight">
                        {hoveredCell?.details.actorId || 'WAITING_FOR_INPUT'}
                      </p>
                   </div>

                   <div className="p-5 bg-gradient-to-br from-blue-900/40 to-transparent rounded-3xl border border-blue-500/20 shadow-inner">
                      <p className="text-[10px] font-black text-emerald-400 uppercase mb-3 flex items-center gap-2">
                        <Lock size={12}/> 哈希鎖定狀態 (Hash Locked)
                      </p>
                      <div className="flex items-center gap-3">
                         <div className="px-3 py-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                            <span className="text-[10px] font-mono text-emerald-400 truncate max-w-[180px] block">
                              {hoveredCell?.details.hashLock || 'UNSEALED_GATE'}
                            </span>
                         </div>
                      </div>
                   </div>
                </div>

                <BrandButton variant="primary" fullWidth className="bg-[#FDB515] hover:bg-amber-400 h-16 rounded-[1.5rem] font-black text-[#003262] text-xs shadow-xl transition-all active:scale-95">
                   啟動溯源真理驗證 (VERIFY TRUTH)
                </BrandButton>
             </div>
             <div className="absolute -bottom-20 -right-20 opacity-5 rotate-12">
                <Grid3X3 size={400} />
             </div>
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-[#FDB515]/30 to-transparent" 
             />
          </BrandCard>
        )
      },
      {
        id: 'soul-log',
        title: '溯源真理：數據之起始，不可磨滅之印記',
        columns: 8,
        component: (
          <BrandCard padding="lg" className="h-full border-none shadow-premium bg-white/40 backdrop-blur-xl rounded-[3rem]">
             <div className="space-y-5">
                {data?.auditTrail.map((log, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-6 bg-white/80 rounded-[2rem] border border-slate-50 group hover:border-[#003262]/20 hover:shadow-xl transition-all cursor-default"
                  >
                     <div className="flex items-center gap-6">
                        <div className="w-3 h-3 rounded-full bg-[#003262] group-hover:scale-150 transition-transform duration-500" />
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                              <p className="text-sm font-black text-[#003262]">{log.action}</p>
                              <BrandBadge variant="info" size="xs" className="scale-75 origin-left">{log.gate}</BrandBadge>
                           </div>
                           <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-2xl">
                             {log.descriptionZh}
                           </p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">刻印時間</p>
                        <p className="text-xs font-mono text-[#003262] font-bold">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                     </div>
                  </motion.div>
                ))}
                
                {data?.auditTrail.length === 0 && (
                  <div className="p-20 text-center space-y-4">
                     <Waves size={48} className="mx-auto text-slate-100 animate-pulse" />
                     <p className="text-sm font-black text-slate-300 uppercase tracking-widest">真理海洋靜謐中...</p>
                  </div>
                )}
             </div>
          </BrandCard>
        )
      }
    ]
  };

  return <StandardPage config={pageConfig} />;
}
