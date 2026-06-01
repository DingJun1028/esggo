'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { Cpu, Zap, Settings, Shield, Terminal, Play, Power, Activity, Database, Key, Server, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

const MODELS = [
  { id: 'gemini-2-pro', name: 'Gemini 2.0 Pro', provider: 'Google', status: 'Active', latency: '120ms', tokens: '1.2M / day' },
  { id: 'gemini-2.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google', status: 'Active', latency: '45ms', tokens: '8.4M / day' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', status: 'Standby', latency: '350ms', tokens: '0' },
];

export default function AIPlatformPage() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="⚙️">
              Admin Console
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <Cpu className="text-cyan-core" /> AI 整合平台 AI Platform
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              全域 AI 資源調度中心。切換模型後台、監控 Token 消耗量、配置 RAG 向量索引。
            </p>
          </div>
          <div className="flex gap-3">
            <UniversalButton variant="secondary" className="flex items-center gap-2">
               <Activity size={16} /> 實時監控
            </UniversalButton>
            <UniversalButton variant="primary" className="flex items-center gap-2">
               <Settings size={16} /> 全域配置
            </UniversalButton>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Model Management */}
           <div className="lg:col-span-2 space-y-8">
              <UniversalCard title="模型實例管理 Models" variant="glow">
                 <div className="divide-y divide-white/5">
                    {MODELS.map((m) => (
                      <div key={m.id} className="py-4 flex items-center justify-between group hover:bg-white/5 px-2 rounded-xl transition-all">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-cyan-core">
                               <Server size={20} />
                            </div>
                            <div>
                               <h4 className="font-bold text-white/90">{m.name}</h4>
                               <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{m.provider} • Latency: {m.latency}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-6">
                            <div className="text-right hidden md:block">
                               <p className="text-[10px] font-black text-white/20 uppercase">Daily Usage</p>
                               <p className="text-xs font-mono text-cyan-core/70">{m.tokens}</p>
                            </div>
                            <UniversalBadge variant={m.status === 'Active' ? 'success' : 'secondary'}>{m.status}</UniversalBadge>
                            <button className="text-white/20 hover:text-white transition-colors"><Settings size={16} /></button>
                         </div>
                      </div>
                    ))}
                 </div>
              </UniversalCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <UniversalCard title="RAG 向量庫狀態" variant="bordered">
                    <div className="space-y-4">
                       <div className="flex justify-between items-end">
                          <div>
                             <p className="text-[10px] font-black text-white/30">Total Documents</p>
                             <h4 className="text-2xl font-black">12,450</h4>
                          </div>
                          <Database size={24} className="text-indigo-400" />
                       </div>
                       <div className="space-y-2">
                          <p className="text-xs font-bold text-white/60">最後索引時間</p>
                          <p className="text-xs font-mono text-white/30">2026-05-30 04:00:12</p>
                       </div>
                       <UniversalButton variant="secondary" className="w-full text-xs">重建全域索引</UniversalButton>
                    </div>
                 </UniversalCard>
                 <UniversalCard title="Prompt 安全攔截" variant="bordered">
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold">P0 安全過濾器</span>
                          <UniversalBadge variant="success">Hardened</UniversalBadge>
                       </div>
                       <p className="text-[11px] text-white/50 leading-relaxed italic">
                         已自動過濾包含敏感商業機密或非授權 API Key 的提示詞。
                       </p>
                       <UniversalButton variant="secondary" className="w-full text-xs">檢視攔截日誌</UniversalButton>
                    </div>
                 </UniversalCard>
              </div>
           </div>

           {/* Cost & Analytics */}
           <div className="space-y-8">
              <UniversalCard title="資源消耗統計 Cost" variant="glass">
                 <div className="space-y-6">
                    <div className="text-center py-4">
                       <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.3em] mb-2">Estimated Monthly Cost</p>
                       <p className="text-4xl font-black text-white">$428.50</p>
                    </div>
                    <div className="space-y-4">
                       <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-white/40">
                             <span>Google Vertex AI</span>
                             <span>$312.00</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-cyan-core" style={{ width: '70%' }} />
                          </div>
                       </div>
                       <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-white/40">
                             <span>Supabase Vector</span>
                             <span>$85.50</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500" style={{ width: '20%' }} />
                          </div>
                       </div>
                    </div>
                 </div>
              </UniversalCard>

              <div className="p-8 bg-gradient-to-br from-rose-500/20 to-orange-600/20 rounded-[2.5rem] border border-rose-500/30 text-center">
                 <BarChart size={32} className="text-rose-400 mb-4 mx-auto" />
                 <h3 className="font-bold text-lg mb-2">算力警報</h3>
                 <p className="text-xs text-white/60 mb-6">SustainWrite 批次生成任務導致算力負載超過 90%。</p>
                 <UniversalButton variant="primary" className="w-full bg-rose-500 hover:bg-rose-600 text-white">擴展部署節點</UniversalButton>
              </div>

              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex items-center gap-4">
                 <Key size={24} className="text-cyan-400 shrink-0" />
                 <div>
                    <h5 className="text-xs font-bold">API Key 管理</h5>
                    <p className="text-[10px] text-white/30 italic">已加密存儲於 Secret Manager</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
