'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Activity, Brain, ShieldCheck, Zap, Terminal, Globe, Hexagon, Cloud, Unplug, Flame } from 'lucide-react';
import { omniAgentBus } from '@/lib/omni-core/agent-bus';
import OmniMECEDashboard from '@/components/omni-core/OmniMECEDashboard';
import OmniCodexViewer from '@/components/omni-core/OmniCodexViewer';

interface SwarmLog {
  id: string;
  agent: 'Antigravity' | 'OmniJules' | 'OmniNexus';
  action: string;
  target: string;
  timestamp: Date;
  status: 'processing' | 'success' | 'healing';
}

export default function SwarmPage() {
  const [logs, setLogs] = useState<SwarmLog[]>([]);
  const [isVpsBound, setIsVpsBound] = useState(false);
  const VPS_IP = '161.118.248.180';

  useEffect(() => {
    // 模擬 OmniAgentBus 的即時廣播訊號
    const mockLogs: SwarmLog[] = [
      { id: '1', agent: 'Antigravity', action: '解析意圖', target: 'GRI 305-1 碳盤查', timestamp: new Date(Date.now() - 10000), status: 'success' },
      { id: '2', agent: 'OmniNexus', action: '調度 RAG 檢索', target: '知識庫: 碳係數', timestamp: new Date(Date.now() - 8000), status: 'success' },
      { id: '3', agent: 'OmniJules', action: '觸發 Karma 修復', target: 'DOM 亂碼節點', timestamp: new Date(Date.now() - 3000), status: 'healing' }
    ];
    setLogs(mockLogs);

    const interval = setInterval(() => {
      const agents: ('Antigravity' | 'OmniJules' | 'OmniNexus')[] = ['Antigravity', 'OmniJules', 'OmniNexus'];
      const actions = ['驗證 5T', '更新矩陣', '掃描 DOM', '分配任務', '對齊數據'];
      const targets = ['ESG_Atoms', 'UI_Layer', 'Nexus_Gateway', 'Memory_Sanctuary'];
      
      const newLog: SwarmLog = {
        id: Math.random().toString(36).substr(2, 9),
        agent: agents[Math.floor(Math.random() * agents.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        target: targets[Math.floor(Math.random() * targets.length)],
        timestamp: new Date(),
        status: Math.random() > 0.8 ? 'healing' : 'success'
      };

      setLogs(prev => [newLog, ...prev].slice(0, 8)); // 保持最新的 8 筆
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'Antigravity': return 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10';
      case 'OmniJules': return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
      case 'OmniNexus': return 'text-indigo-400 border-indigo-400/30 bg-indigo-400/10';
      default: return 'text-slate-400 border-slate-400/30 bg-slate-400/10';
    }
  };

  const getAgentIcon = (agent: string) => {
    switch (agent) {
      case 'Antigravity': return <Brain size={18} />;
      case 'OmniJules': return <ShieldCheck size={18} />;
      case 'OmniNexus': return <Globe size={18} />;
      default: return <Terminal size={18} />;
    }
  };

  const toggleVpsBinding = () => {
    if (isVpsBound) {
      omniAgentBus.unbindVPS();
      setIsVpsBound(false);
      
      setLogs(prev => [{
        id: crypto.randomUUID(),
        agent: 'OmniNexus',
        action: 'VPS 連線解除',
        target: `Cloud Node (${VPS_IP})`,
        timestamp: new Date(),
        status: 'success' as 'processing' | 'success' | 'healing'
      } as SwarmLog, ...prev].slice(0, 8));
      
    } else {
      omniAgentBus.bindToVPS(VPS_IP);
      setIsVpsBound(true);
      
      setLogs(prev => [{
        id: crypto.randomUUID(),
        agent: 'OmniNexus',
        action: 'VPS 矩陣同步綁定',
        target: `Cloud Node (${VPS_IP}:8642)`,
        timestamp: new Date(),
        status: 'success' as 'processing' | 'success' | 'healing'
      } as SwarmLog, ...prev].slice(0, 8));
    }
  const triggerStressTest = () => {
    // 模擬 16 法則壓力測試
    const events: { type: 'HEAL'|'STRATEGIZE'|'EXECUTE'|'OBSERVE'; source: string; msg: string }[] = [
      { type: 'OBSERVE', source: 'OmniNexus', msg: '偵測到異常高頻流量 (Anomaly Detected)' },
      { type: 'STRATEGIZE', source: 'Antigravity', msg: '動態重構路由路徑 (Dynamic Routing)' },
      { type: 'HEAL', source: 'OmniJules', msg: 'Karma Protocol 啟動 - 記憶體修復 (Memory Healed)' },
      { type: 'EXECUTE', source: 'OmniAgentBus', msg: '無縫接軌新架構 (Architecture Deployed)' },
      { type: 'OBSERVE', source: 'OmniNexus', msg: '5T 數據驗證完成 (5T Verified)' },
      { type: 'HEAL', source: 'OmniJules', msg: '消除編碼衝突亂碼 (Garbled Text Fixed)' }
    ];

    events.forEach((ev, i) => {
      setTimeout(() => {
        omniAgentBus.publish(ev.type, ev.source, { detail: ev.msg });
        
        // UI Log
        setLogs(prev => [{
          id: crypto.randomUUID(),
          agent: ev.source as any,
          action: ev.type,
          target: ev.msg,
          timestamp: new Date(),
          status: ev.type === 'HEAL' ? 'healing' : 'success'
        }, ...prev].slice(0, 8));
      }, i * 600); // 快速連發
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      {/* 標題區 */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-4"
          >
            <Network size={16} />
            <span className="text-xs font-bold tracking-widest uppercase">OmniAgent Swarm</span>
          </motion.div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 mb-2 tracking-tight">
            蜂群指揮中心
          </h1>
          <p className="text-slate-400 text-sm">即時監控 Antigravity、OmniJules 與 OmniNexus 的協作狀態與 5T 驗證流。</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={toggleVpsBinding}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(0,0,0,0.3)] ${
              isVpsBound 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30' 
                : 'bg-[#020617]/60 border-slate-500/40 text-slate-400 hover:text-white hover:border-white/40'
            }`}
          >
            {isVpsBound ? (
              <>
                <Cloud size={16} className="animate-pulse" />
                <span>已綁定 VPS ({VPS_IP})</span>
              </>
            ) : (
              <>
                <Unplug size={16} />
                <span>綁定至雲端 VPS</span>
              </>
            )}
          </button>

          <button 
            onClick={triggerStressTest}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all text-sm font-bold tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          >
            <Flame size={16} className="animate-pulse" />
            <span>觸發壓力測試 (Stress Test)</span>
          </button>

          <div className="flex flex-col items-end justify-center ml-4">
            <span className="text-xs text-slate-500 uppercase tracking-widest mb-1">系統心跳 (Tick)</span>
            <div className="flex items-center gap-2 text-emerald-400 font-mono">
              <Activity size={18} className="animate-pulse" />
              <span>12ms</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 左側：Agent 狀態雷達/面板 */}
        <div className="space-y-6">
          <div className="relative bg-[#020617]/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400 border border-cyan-500/30">
                <Brain size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">Antigravity</h3>
                <p className="text-xs text-cyan-400 font-mono">主代理 / 意圖解析</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-400"><span className="flex items-center gap-2"><Zap size={14}/> 活躍任務</span> <span className="text-white font-mono">2</span></div>
              <div className="flex justify-between text-slate-400"><span className="flex items-center gap-2"><Hexagon size={14}/> 矩陣吞吐量</span> <span className="text-white font-mono">98%</span></div>
            </div>
          </div>

          <div className="relative bg-[#020617]/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400 border border-amber-500/30">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">OmniJules</h3>
                <p className="text-xs text-amber-400 font-mono">果因引擎 / 被動修復</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-400"><span className="flex items-center gap-2"><Zap size={14}/> 攔截次數</span> <span className="text-white font-mono">1,204</span></div>
              <div className="flex justify-between text-slate-400"><span className="flex items-center gap-2"><Hexagon size={14}/> 治癒率</span> <span className="text-white font-mono">100%</span></div>
            </div>
          </div>
          
          <div className="relative bg-[#020617]/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 border border-indigo-500/30">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">OmniNexus</h3>
                <p className="text-xs text-indigo-400 font-mono">閘道 / 外部調度</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-400"><span className="flex items-center gap-2"><Zap size={14}/> 路由節點</span> <span className="text-white font-mono">45</span></div>
              <div className="flex justify-between text-slate-400"><span className="flex items-center gap-2"><Hexagon size={14}/> API 健康度</span> <span className="text-white font-mono">99.9%</span></div>
            </div>
          </div>
        </div>

        {/* 右側：即時 Agent Bus 監聽日誌 */}
        <div className="lg:col-span-2 relative bg-[#020617]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col h-full min-h-[600px]">
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Activity size={20} className="text-indigo-400" />
              OmniAgentBus 實時監聽
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE STREAM
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`flex items-start gap-4 p-4 rounded-xl border bg-black/40 ${log.status === 'healing' ? 'border-red-500/30' : 'border-white/5'}`}
                >
                  <div className={`mt-1 p-1.5 rounded-md border ${getAgentColor(log.agent)}`}>
                    {getAgentIcon(log.agent)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${getAgentColor(log.agent).split(' ')[0]}`}>
                        {log.agent}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-slate-300 font-medium text-base mb-1">
                      {log.action}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10 font-mono">
                        Target: {log.target}
                      </span>
                      {log.status === 'healing' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold uppercase tracking-wider animate-pulse">
                          Karma Healing Triggered
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* 萬能 MECE 進化看板 */}
      <div className="mt-8">
        <OmniMECEDashboard />
      </div>

      {/* 自主通典 (Codex) 展覽 & 終始矩陣 */}
      <div className="mt-8 mb-16">
        <OmniCodexViewer isVpsBound={isVpsBound} toggleVpsBinding={toggleVpsBinding} />
      </div>

    </div>
  );
}
