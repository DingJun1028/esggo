'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, ShieldCheck, Zap, Layers, Cpu, Layout, Sparkles, Activity, Brain } from 'lucide-react';
import { BrandCard, BrandButton, BrandBadge, BrandStatusDot } from '@/components/brand';
import CausalTopologyGraph, { NodeStatus } from '@/components/ui/CausalTopologyGraph';

interface LogEntry {
  time: string;
  level: 'error' | 'heal' | 'system' | 'zkp';
  text: string;
}

function LandingContent() {
  const [activeTaskId, setActiveTaskId] = useState<string>('task_genesis');
  const [executionId, setExecutionId] = useState<string>('exec_init');

  // 記錄四個因果律節點的真實狀態 (undefined 表示使用模擬模式)
  const [swarmStatus, setSwarmStatus] = useState<NodeStatus | undefined>(undefined);
  const [zkpStatus, setZkpStatus] = useState<NodeStatus | undefined>(undefined);
  const [vaultStatus, setVaultStatus] = useState<NodeStatus | undefined>(undefined);
  const [healingStatus, setHealingStatus] = useState<NodeStatus | undefined>(undefined);
  const [healingLogs, setHealingLogs] = useState<LogEntry[]>([]);

  // 🌟 發起實時測試
  const handleManualTrigger = async () => {
    // 重置狀態以展現完整的重新執行過渡動畫
    setSwarmStatus('idle');
    setZkpStatus('idle');
    setVaultStatus('idle');
    setHealingStatus('idle');
    setHealingLogs([]);

    // 隨機選擇一種角色來展示「多層次輸出」
    const roles = ['public', 'auditor', 'board', 'legal'];
    const selectedRole = roles[Math.floor(Math.random() * roles.length)];

    try {
      const res = await fetch('/api/swarm/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audienceRole: selectedRole })
      });
      if (!res.ok) console.error('[Dashboard] 手動觸發發生異常');
    } catch (e) {
      console.error('[Dashboard] 手動觸發連線失敗', e);
    }
  };

  // 🌟 與 orchestrator.ts 雙向綁定的狀態掛載邏輯 (WebSocket)
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_SWARM_WS_URL || 'ws://localhost:3000/api/swarm/ws';
    let socket: WebSocket | null = null;
    let isMounted = true;

    const initWS = async () => {
      try {
        // 🌟 HTTP Ping 喚醒機制：確保首次開啟頁面時 WebSocket Server 必定掛載
        const pingUrl = wsUrl.replace(/^ws/, 'http');
        await fetch(pingUrl, { method: 'GET' }).catch(() => {
          console.warn('[Dashboard] Ping 喚醒請求失敗，將直接嘗試 WS 連線');
        });

        if (!isMounted) return;

        socket = new WebSocket(wsUrl);

        socket.onerror = () => {
          console.warn('[Dashboard] 蜂群連線失敗，自動切換至「液態現實」模擬展演模式。');
          setSwarmStatus(undefined);
          setZkpStatus(undefined);
          setVaultStatus(undefined);
          setHealingStatus(undefined);
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.taskId) setActiveTaskId(data.taskId);
            if (data.executionId) setExecutionId(data.executionId);

            // 根據後端拋出的內部狀態改變視覺反饋，並連動 Healing Guardian
            switch (data.stage) {
              case 'DRAFTING':
                setSwarmStatus('processing');
                break;
              case 'ZKP_VERIFYING':
                setSwarmStatus('success');
                setZkpStatus('processing');
                break;
              case 'HEALING_STARTED':
                setZkpStatus('failed'); // ZKP 校驗失敗，紅燈警報
                setHealingStatus('healing'); // 啟動紅轉藍的治癒節點
                if (data.message) {
                  const getTime = () => new Date().toLocaleTimeString('en-US', { hour12: false });
                  setHealingLogs(prev => [...prev, { time: getTime(), level: 'error', text: data.message }]);

                  setTimeout(() => {
                    setHealingLogs(prev => [...prev, { time: getTime(), level: 'heal', text: 'OmniAgent 已從 ERP 系統提取缺漏的 350 噸碳排憑證...' }]);
                  }, 800);

                  setTimeout(() => {
                    setHealingLogs(prev => [...prev, { time: getTime(), level: 'zkp', text: '重新產生 Pedersen 承諾並同態加總，驗證通過。' }]);
                  }, 1800);
                }
                break;
              case 'SEALING_5T':
                setHealingStatus(prev => (prev && prev !== 'idle') ? 'success' : prev);
                setZkpStatus('success');
                setVaultStatus('processing');
                break;
              case 'COMPLETED':
                setVaultStatus('success');
                break;
              case 'FAILED':
                if (data.node === 'Agent') setSwarmStatus('failed');
                if (data.node === 'ZKP') setZkpStatus('failed');
                if (data.node === 'Healing') setHealingStatus('failed');
                break;
            }
          } catch (err) {
            console.error('[Dashboard] WS Message 解析失敗:', err);
          }
        };
      } catch (e) {
        console.error('[Dashboard] 蜂群連線尚未建立', e);
      }
    };

    initWS();

    return () => {
      isMounted = false;
      if (socket) socket.close();
    };
  }, []); // 採用 functional update (prev)，避免依賴狀態導致 WS 頻繁重連

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white flex flex-col items-center justify-center p-6 lg:p-12 selection:bg-cyan-500/30">
      {/* ─── Layer 0: Void & Luminous Effects ────────────────────────── */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-6xl w-full flex flex-col items-center text-center space-y-16"
      >
        {/* ─── Layer 1: Structural Content ────────────────────────────── */}
        <motion.div variants={item} className="flex flex-col items-center gap-6">
          <div className="flex gap-4 mb-2">
            <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
              <BrandStatusDot status="active" pulse size="sm" />
              <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase">OmniAgent_Live</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="text-[10px] font-black tracking-[0.3em] text-emerald-400 uppercase">5T_Protocol_Active</span>
            </div>
          </div>

          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] uppercase">
            ESGGO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-glow-cyan">
              善向永續
            </span>
          </h1>

          <p className="mt-8 text-xl md:text-2xl text-slate-400 max-w-3xl font-medium leading-relaxed tracking-tight">
            Sovereign Governance Operating System. <br />
            由 <span className="text-white font-bold">OmniAgent</span> 總指揮官全域調度，承載 <span className="text-[#FDB515] font-bold">JunAiKey</span> 無上意志。<br />
            「代碼即契約，數據即生命，架構即秩序。」
          </p>

          <div className="flex gap-6 mt-4">
            <BrandButton variant="primary" size="lg" className="rounded-2xl px-12 group" onClick={() => window.location.href = '/dashboard'}>
              啟動治理終端 <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
            </BrandButton>
            <BrandButton variant="glass" size="lg" className="rounded-2xl px-12" onClick={() => window.location.href = '/wiki'}>
              探索架構聖碑
            </BrandButton>
          </div>

          {/* 🌟 手動觸發按鈕 */}
          <div className="mt-6 flex items-center justify-center">
            <button
              onClick={handleManualTrigger}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-cyan-500/50 bg-cyan-500/10 text-cyan-400 text-sm font-bold tracking-widest hover:bg-cyan-500/20 hover:scale-105 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-pulse"
            >
              <Activity size={16} />
              [TEST] 手動觸發 (動態角色多層次輸出)
            </button>
          </div>
        </motion.div>

        {/* ─── Layer 1.5: System Resonance & Causal Link (因果律拓樸圖) ─ */}
        <motion.div variants={item} className="w-full relative z-10">
          <CausalTopologyGraph
            taskId={activeTaskId}
            executionId={executionId}
            agentStatus={swarmStatus}
            zkpStatus={zkpStatus}
            vaultStatus={vaultStatus}
            healingStatus={healingStatus}
          />
        </motion.div>

        {/* ─── Layer 1.6: Healing Guardian Terminal ───────────────────── */}
        {healingLogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            className="w-full relative z-10 max-w-5xl mx-auto -mt-8"
          >
            <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(99,102,241,0.15)] font-mono text-sm text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
              <div className="flex items-center gap-2 mb-3 text-indigo-400 border-b border-indigo-500/20 pb-3">
                <Activity size={16} className="animate-pulse" />
                <span className="font-bold tracking-widest uppercase">Healing_Guardian_Terminal</span>
              </div>
              <div className="space-y-2 h-32 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-indigo-500/30 [&::-webkit-scrollbar-thumb]:rounded-full">
                {healingLogs.map((log, i) => {
                  let colorClass = 'text-slate-300';
                  if (log.level === 'error') colorClass = 'text-rose-400';
                  if (log.level === 'heal') colorClass = 'text-cyan-400';
                  if (log.level === 'zkp') colorClass = 'text-emerald-400';

                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                      <span className="text-slate-500 shrink-0">[{log.time}]</span>
                      <span className={colorClass}>{log.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── Layer 2: Hologram Interactions (Bento Grid) ────────────── */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 w-full">

          <Link href="/dashboard" className="group h-full">
            <BrandCard variant="hologram" hover padding="lg" className="h-full flex flex-col justify-between text-left group-hover:border-cyan-500/40 transition-colors">
              <div className="space-y-6">
                <div className="p-4 w-fit rounded-[1.5rem] bg-cyan-500/10 text-cyan-400 shadow-inner group-hover:scale-110 transition-transform">
                  <Layout size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight uppercase">Bento 治理平台</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">進入 Liquid Glass Premium 儀表板，體驗 T3 Tangible 全感官治理躍遷。</p>
                </div>
              </div>
              <div className="mt-12 flex items-center text-cyan-400 text-xs font-black tracking-widest uppercase">
                進入主權終端 <Zap size={14} className="ml-2 animate-pulse" />
              </div>
            </BrandCard>
          </Link>

          <Link href="/map" className="group h-full">
            <BrandCard variant="hologram" hover padding="lg" className="h-full flex flex-col justify-between text-left group-hover:border-indigo-500/40 transition-colors">
              <div className="space-y-6">
                <div className="p-4 w-fit rounded-[1.5rem] bg-indigo-500/10 text-indigo-400 shadow-inner group-hover:scale-110 transition-transform">
                  <Globe size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight uppercase">OmniMap 全景圖</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">鳥瞰全端數據演進脈絡，精準映射 5T 誠信協議與 GRI 治理缺口。</p>
                </div>
              </div>
              <div className="mt-12 flex items-center text-indigo-400 text-xs font-black tracking-widest uppercase">
                展開系統藍圖 <Activity size={14} className="ml-2" />
              </div>
            </BrandCard>
          </Link>

          <Link href="/atomic" className="group h-full">
            <BrandCard variant="hologram" hover padding="lg" className="h-full flex flex-col justify-between text-left group-hover:border-emerald-500/40 transition-colors">
              <div className="space-y-6">
                <div className="p-4 w-fit rounded-[1.5rem] bg-emerald-500/10 text-emerald-400 shadow-inner group-hover:scale-110 transition-transform">
                  <Layers size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight uppercase">萬能元件原子庫</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">基於「參照原則」建構的四聖主題組件，展現液態玻璃的極致工藝。</p>
                </div>
              </div>
              <div className="mt-12 flex items-center text-emerald-400 text-xs font-black tracking-widest uppercase">
                瀏覽原子庫 <Sparkles size={14} className="ml-2" />
              </div>
            </BrandCard>
          </Link>

          <Link href="/omni-shards" className="group h-full">
            <BrandCard variant="hologram" hover padding="lg" className="h-full flex flex-col justify-between text-left group-hover:border-purple-500/40 transition-colors">
              <div className="space-y-6">
                <div className="p-4 w-fit rounded-[1.5rem] bg-purple-500/10 text-purple-400 shadow-inner group-hover:scale-110 transition-transform">
                  <Brain size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight uppercase">無有技藝進化</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">進入 OmniAgent 記憶中樞，將對話殘影淬鍊為具備心法的高階技能奧義。</p>
                </div>
              </div>
              <div className="mt-12 flex items-center text-purple-400 text-xs font-black tracking-widest uppercase">
                提取記憶碎片 <Activity size={14} className="ml-2 animate-pulse" />
              </div>
            </BrandCard>
          </Link>

        </motion.div>

        <motion.div variants={item} className="pt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
            <span className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black">
              OmniCore P0 Genesis Infrastructure // v8.5.5-Stable
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  return <LandingContent />;
}
