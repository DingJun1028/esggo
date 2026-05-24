'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings2, Cpu, Database, Bell, Shield, Radio, Key, Github, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { BrandButton, BrandBadge, BrandCard, BrandTabs, BrandProgress } from './index';

interface HermesControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HermesControlCenter({ isOpen, onClose }: HermesControlCenterProps) {
  const [activeTab, setActiveTab] = useState('system');

  const tabs = [
    { id: 'system', label: '核心系統', icon: <Settings2 size={14}/> },
    { id: 'compliance', label: '合規情報', icon: <Shield size={14}/> },
    { id: 'models', label: 'AI 模型', icon: <Cpu size={14}/> },
    { id: 'mcp',    label: 'MCP 整合', icon: <Radio size={14}/> },
    { id: 'about',  label: '關於本站', icon: <Info size={14}/> },
  ];
  ...
              {activeTab === 'compliance' && (
                <div className="space-y-8 fade-in">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                         <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">5T Integrity Score</p>
                         <p className="text-3xl font-black text-emerald-800 font-mono">94.2%</p>
                         <div className="h-1.5 w-full bg-emerald-200/50 rounded-full mt-4 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: '94.2%' }} className="h-full bg-emerald-500" />
                         </div>
                      </div>
                      <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                         <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Unsealed Evidence</p>
                         <p className="text-3xl font-black text-amber-800 font-mono">12</p>
                         <p className="text-[9px] font-bold text-amber-600/60 mt-2 uppercase tracking-tighter">Requires 5T Sealing Logic</p>
                      </div>
                   </div>

                   <section className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Active Compliance Gaps</h4>
                      <div className="space-y-2">
                         {[
                           { tag: 'GRI 305-1', desc: '缺少 2024 年度範疇一直接排放數據', severity: 'high' },
                           { tag: 'GRI 403-9', desc: '職業安全訓練紀錄未經 5T 封印', severity: 'medium' },
                           { tag: 'GRI 2-7', desc: '員工人數統計需重新校準', severity: 'low' },
                         ].map((gap, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                              <div className="flex items-center gap-3">
                                 <BrandBadge variant="outline" size="xs" className="font-mono">{gap.tag}</BrandBadge>
                                 <span className="text-[11px] font-bold text-slate-600">{gap.desc}</span>
                              </div>
                              <div className={`w-2 h-2 rounded-full ${gap.severity === 'high' ? 'bg-red-500' : gap.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                           </div>
                         ))}
                      </div>
                   </section>

                   <BrandButton variant="primary" fullWidth className="h-14 rounded-2xl shadow-xl shadow-blue-500/10" onClick={() => alert('啟動全域合規性掃描...')}>
                      <Bot size={18} className="mr-2" /> 啟動 OmniHermes 全域審計
                   </BrandButton>
                </div>
              )}

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 lg:p-8">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-white/95 backdrop-blur-2xl rounded-[40px] border border-white shadow-extreme max-w-4xl w-full h-[80vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <header className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/50">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#003262] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                 <Settings2 size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-black text-[#003262] uppercase tracking-tight">Hermes Control Center</h2>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">OmniHermes Enterprise OS v11.7</p>
              </div>
           </div>
           <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all hover:rotate-90">
              <X size={20} />
           </button>
        </header>

        {/* Tab Sidebar + Content */}
        <div className="flex-1 flex overflow-hidden">
           {/* Sidebar Tabs */}
           <aside className="w-56 border-r border-slate-50 p-6 space-y-2 bg-slate-50/30">
              {tabs.map(t => (
                <button 
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-black transition-all ${activeTab === t.id ? 'bg-white text-[#003262] shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-[#003262] hover:bg-white/50'}`}
                >
                   {t.icon} {t.label}
                </button>
              ))}
              
              <div className="mt-auto pt-8 border-t border-slate-100 space-y-4">
                 <button className="w-full flex items-center justify-between px-5 py-3 text-[10px] font-black text-slate-400 uppercase hover:text-rose-500 transition-colors group">
                    <span className="flex items-center gap-3"><LogOut size={14}/> Sign_Out</span>
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
                 </button>
              </div>
           </aside>

           {/* Main Content */}
           <main className="flex-1 overflow-y-auto p-10 no-scrollbar bg-white">
              {activeTab === 'system' && (
                <div className="space-y-8 fade-in">
                   <section>
                      <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 ml-1">General Preferences</h4>
                      <div className="grid gap-4">
                         {[
                           { label: '5T 實時同步', desc: '在每次寫入數據時自動進行 SHA-256 誠信簽署', enabled: true },
                           { label: '自癒與蜂群模式', desc: '當 AI 檢測到錯誤時自動切換備用模型進行修復', enabled: true },
                           { label: '高密度佈局 (Compact)', desc: '壓縮頁面間距以優化單屏數據承載量', enabled: true },
                         ].map((item, i) => (
                           <div key={i} className="flex items-center justify-between p-6 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-all group">
                              <div className="max-w-[70%]">
                                 <p className="text-sm font-black text-[#003262]">{item.label}</p>
                                 <p className="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed">{item.desc}</p>
                              </div>
                              <div className={`w-12 h-6 rounded-full p-1 transition-all ${item.enabled ? 'bg-[#003262]' : 'bg-slate-200'}`}>
                                 <div className={`w-4 h-4 rounded-full bg-white transition-all ${item.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                              </div>
                           </div>
                         ))}
                      </div>
                   </section>

                   <section className="p-8 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-center justify-between">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#3B7EA1] shadow-sm"><Key size={24}/></div>
                         <div>
                            <p className="text-sm font-black text-[#003262]">API Endpoint Configuration</p>
                            <p className="text-[11px] text-[#3B7EA1] font-bold">Connected to Google GenAI · Gemini 2.0</p>
                         </div>
                      </div>
                      <BrandButton variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest bg-white border border-blue-100 px-6">Manage_Keys</BrandButton>
                   </section>
                </div>
              )}

              {activeTab === 'models' && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 fade-in">
                   <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-200"><Cpu size={32}/></div>
                   <div>
                      <p className="text-sm font-bold text-slate-400">模型列表讀取中...</p>
                      <BrandProgress value={45} size="xs" color="blue" animated className="w-48 mt-4" />
                   </div>
                </div>
              )}

              {activeTab === 'mcp' && (
                <div className="space-y-8 fade-in text-center py-10">
                   <div className="w-20 h-20 rounded-[32px] bg-indigo-50 flex items-center justify-center text-indigo-500 mx-auto mb-6 shadow-inner"><Radio size={40}/></div>
                   <h3 className="text-2xl font-black text-[#003262]">MCP Marketplace</h3>
                   <p className="text-sm text-slate-500 max-w-sm mx-auto">連接外部數據源與工具集，包括 GitHub、Slack、Notion 與自定義 API。</p>
                   <div className="flex gap-3 justify-center">
                      <BrandButton variant="primary" className="rounded-xl px-10 h-12 font-black">Browse Marketplace</BrandButton>
                      <BrandButton variant="ghost" className="rounded-xl px-10 h-12 font-black border border-slate-100">Add Source</BrandButton>
                   </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="space-y-8 fade-in">
                   <div className="text-center py-6">
                      <div className="w-24 h-24 rounded-[36px] bg-gradient-to-br from-[#003262] to-[#3B7EA1] flex items-center justify-center mx-auto mb-8 shadow-2xl relative overflow-hidden">
                         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                         <span className="text-3xl font-black text-white relative z-10">G</span>
                      </div>
                      <h3 className="text-3xl font-black text-[#003262] tracking-tighter">ESG GO Enterprise</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em] mt-2">Sovereign Governance OS</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-6">
                      <BrandCard padding="lg" className="glass-panel border-none shadow-sm hover:shadow-md transition-all text-center group cursor-pointer">
                         <Github size={24} className="mx-auto text-slate-300 group-hover:text-black transition-colors mb-3" />
                         <p className="text-[11px] font-black text-[#003262] uppercase tracking-widest">Source_Code</p>
                      </BrandCard>
                      <BrandCard padding="lg" className="glass-panel border-none shadow-sm hover:shadow-md transition-all text-center group cursor-pointer">
                         <HelpCircle size={24} className="mx-auto text-slate-300 group-hover:text-[#FDB515] transition-colors mb-3" />
                         <p className="text-[11px] font-black text-[#003262] uppercase tracking-widest">Documentation</p>
                      </BrandCard>
                   </div>
                </div>
              )}
           </main>
        </div>

        {/* Footer */}
        <footer className="px-10 py-6 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <BrandBadge variant="outline" size="xs" className="border-slate-200 text-slate-400 font-bold px-4 h-8 flex items-center">v11.7.0_STABLE</BrandBadge>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Local_Compute_Node_Active</span>
              </div>
           </div>
           <BrandButton variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest" onClick={onClose}>Close_Control_Center</BrandButton>
        </footer>
      </motion.div>
    </div>
  );
}

function Info(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
