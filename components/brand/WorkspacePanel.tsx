'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Search, Database, History, ChevronRight, Maximize2, Shield, Bot, Layout, Info } from 'lucide-react';
import { BrandBadge, BrandCard, BrandCardHeader, BrandTabs, BrandStatusDot } from './index';

interface WorkspacePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkspacePanel({ isOpen, onClose }: WorkspacePanelProps) {
  const [activeTab, setActiveTab] = useState('context');

  const tabs = [
    { id: 'context', label: '對話脈絡', icon: <Bot size={14}/> },
    { id: 'vault',   label: '證據預覽', icon: <Database size={14}/> },
    { id: 'history', label: '執行軌跡', icon: <History size={14}/> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 w-[400px] bg-white border-l border-slate-100 shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-50">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#003262] flex items-center justify-center text-white shadow-lg">
                   <Layout size={20} />
                </div>
                <div>
                   <h3 className="text-sm font-black text-[#003262] uppercase tracking-widest">Workspace</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Hermes Node Panel</p>
                </div>
             </div>
             <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all hover:rotate-90">
                <X size={20} />
             </button>
          </div>

          {/* Tabs */}
          <div className="px-4 py-2 bg-slate-50/50">
             <BrandTabs 
               activeTab={activeTab} 
               onTabChange={setActiveTab}
               tabs={tabs}
             />
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
             {activeTab === 'context' && (
               <div className="space-y-6 fade-in">
                  <div className="p-5 rounded-[24px] bg-blue-50/50 border border-blue-100">
                     <div className="flex items-center gap-2 mb-3">
                        <Info size={14} className="text-[#003262]" />
                        <span className="text-[11px] font-black text-[#003262] uppercase tracking-widest">Active Insight</span>
                     </div>
                     <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        目前 Agent 正在分析 「2024Q3 節能專案」。右側面板將根據您的對話即時加載相關的 GRI 指標與佐證文件。
                     </p>
                  </div>
                  
                  <section className="space-y-4">
                     <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-2">Referenced Files</h4>
                     {[
                       { name: 'Power_Bill_Aug.pdf', size: '2.4 MB', type: 'PDF' },
                       { name: 'Solar_Installation_Plan.docx', size: '1.8 MB', type: 'DOCX' }
                     ].map((file, i) => (
                       <BrandCard key={i} padding="sm" className="glass-panel border-none shadow-sm hover:shadow-md transition-all group cursor-pointer">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                   <FileText size={16} />
                                </div>
                                <div>
                                   <p className="text-xs font-bold text-slate-700">{file.name}</p>
                                   <p className="text-[10px] text-slate-300 font-black">{file.size} · {file.type}</p>
                                </div>
                             </div>
                             <ChevronRight size={14} className="text-slate-200 group-hover:text-blue-500 transition-all" />
                          </div>
                       </BrandCard>
                     ))}
                  </section>

                  <section className="p-6 bg-slate-900 rounded-[32px] text-white overflow-hidden relative group">
                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                        <Shield size={120} color="#fff" strokeWidth={1} />
                     </div>
                     <p className="text-[10px] font-black text-blue-200/40 uppercase tracking-[0.3em] mb-4">5T Integrity Guard</p>
                     <p className="text-xs text-blue-50/80 leading-relaxed font-medium mb-6">
                        此工作區所有的檔案預覽均經過 SHA-256 驗簽。若檢測到哈希不一致，預覽將被自動鎖定以保護治理主權。
                     </p>
                     <BrandBadge variant="gold" size="xs" className="font-black px-4">T4_ENCRYPTED</BrandBadge>
                  </section>
               </div>
             )}

             {activeTab === 'vault' && (
               <div className="flex flex-col items-center justify-center h-full text-center space-y-4 fade-in">
                  <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-200">
                     <Search size={32} />
                  </div>
                  <div>
                     <p className="text-sm font-bold text-slate-400">尚未選擇檔案</p>
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Select from context to preview</p>
                  </div>
               </div>
             )}

             {activeTab === 'history' && (
               <div className="space-y-4 fade-in">
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-2">Agent Traces</h4>
                  {[
                    { time: '14:20:05', msg: 'RAG Search Completed (5 sources)', status: 'success' },
                    { time: '14:19:58', msg: 'Querying GRI 302-1 Table...', status: 'running' },
                    { time: '14:19:40', msg: 'Session Initialized', status: 'success' }
                  ].map((trace, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl border border-slate-50 bg-slate-50/30">
                       <span className="text-[10px] font-black font-mono text-slate-300">{trace.time}</span>
                       <div className="flex-1">
                          <p className="text-[11px] font-bold text-slate-600">{trace.msg}</p>
                          <BrandStatusDot status={trace.status === 'success' ? 'active' : 'warning'} size="sm" label={trace.status.toUpperCase()} />
                       </div>
                    </div>
                  ))}
               </div>
             )}
          </div>

          {/* Footer Footer */}
          <div className="p-6 border-t border-slate-50 bg-slate-50/20">
             <button className="w-full h-12 bg-[#003262] rounded-xl flex items-center justify-center gap-2 text-white font-black text-[11px] uppercase tracking-widest shadow-xl hover:shadow-[#003262]/20 transition-all">
                <Maximize2 size={14} /> Fullscreen_Mode
             </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
