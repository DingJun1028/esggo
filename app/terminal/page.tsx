'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { Terminal as TerminalIcon, Play, Power, ShieldAlert, Cpu, Database, Command, RefreshCw, X, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TerminalPage() {
  const [logs, setLogs] = useState([
    { id: 1, type: 'info', time: '14:20:05', msg: 'OmniCore v8.5.1 Initializing...' },
    { id: 2, type: 'success', time: '14:20:06', msg: 'Auth Bridge: Secure' },
    { id: 3, type: 'info', time: '14:20:07', msg: 'Awaiting Command...' },
  ]);
  const [input, setInput] = useState('');
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newLogs = [...logs, { id: Date.now(), type: 'cmd', time: new Date().toLocaleTimeString().split(' ')[0], msg: `> ${input}` }];
    setLogs(newLogs);
    setInput('');

    // Simulate response
    setTimeout(() => {
      const response = { id: Date.now() + 1, type: 'info', time: new Date().toLocaleTimeString().split(' ')[0], msg: `Executing: ${input}...` };
      if (input === 'omni check') {
        response.msg = 'System Health: 100%. All logic gates operational.';
        response.type = 'success';
      } else if (input === 'help') {
        response.msg = 'Available Commands: omni check, swarm status, seal --all, purge cache';
      }
      setLogs(prev => [...prev, response]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="warning" icon="⌨️">
              VIII. 系統維護與品質
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <TerminalIcon className="text-amber-400" /> 終端主控 Terminal
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              低階系統存取介面。直接與 OmniCore 核芯對話，執行緊急修復指令與數據遷移任務。
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Terminal Main */}
           <div className="lg:col-span-3">
              <div className="bg-black/80 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col h-[600px] backdrop-blur-2xl">
                 {/* Window Header */}
                 <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/5">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                       <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                       <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                       <Command size={12} /> root@omnicore:~
                    </div>
                    <div className="w-12" />
                 </div>

                 {/* Console Area */}
                 <div className="flex-1 overflow-y-auto p-6 font-mono text-xs space-y-2 no-scrollbar">
                    {logs.map((log) => (
                      <div key={log.id} className="flex gap-4 group">
                         <span className="text-white/20 shrink-0">[{log.time}]</span>
                         <span className={
                           log.type === 'success' ? 'text-emerald-400' :
                           log.type === 'error' ? 'text-rose-400' :
                           log.type === 'cmd' ? 'text-cyan-400 font-bold' :
                           'text-white/70'
                         }>
                            {log.msg}
                         </span>
                      </div>
                    ))}
                    <div ref={logEndRef} />
                 </div>

                 {/* Input Area */}
                 <form onSubmit={handleCommand} className="p-4 bg-white/5 border-t border-white/5 flex items-center gap-3">
                    <ChevronRight size={16} className="text-cyan-400" />
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="輸入指令... (鍵入 'help' 查看清單)"
                      className="flex-1 bg-transparent border-none outline-none text-cyan-100 font-mono text-xs"
                      autoFocus
                    />
                 </form>
              </div>
           </div>

           {/* Sidebar Controls */}
           <div className="space-y-8">
              <UniversalCard title="系統特權 Session" variant="bordered">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-white/40">User</span>
                       <span className="font-bold text-white/90 underline decoration-cyan-500">SuperAdmin</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-white/40">Access</span>
                       <UniversalBadge variant="error" className="text-[8px]">LEVEL_0</UniversalBadge>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-white/40">Expires</span>
                       <span className="font-mono text-white/60">01:42:05</span>
                    </div>
                    <UniversalButton variant="outline" className="w-full text-xs py-2 h-auto">登出並銷毀 Session</UniversalButton>
                 </div>
              </UniversalCard>

              <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] text-center">
                 <ShieldAlert size={32} className="text-rose-400 mx-auto mb-4 animate-pulse" />
                 <h4 className="font-bold text-rose-400 uppercase tracking-widest text-sm">危險區域</h4>
                 <p className="text-[10px] text-white/40 mt-2 mb-6">以下操作將直接影響主權資料庫。執行前請務必確認已完成 5T 備份。</p>
                 <UniversalButton variant="secondary" className="w-full text-rose-400 border-rose-500/20 hover:bg-rose-500/10">格式化 Evidence Vault</UniversalButton>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
