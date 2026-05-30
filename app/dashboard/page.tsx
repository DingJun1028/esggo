'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { omniRealtime } from '@/lib/realtime/SupabaseOmniRealtimeService';
import {
  LayoutDashboard, Activity, ShieldCheck, Cpu,
  TrendingUp, Database, Lock, AlertTriangle, Fingerprint,
  EyeOff, Key, Calculator, BookOpen
} from 'lucide-react';
import { BrandCard, BrandBadge, BrandStatusDot } from '@/components/brand';
import CausalTopologyGraph, { NodeStatus } from '@/components/ui/CausalTopologyGraph';
import { ESGSmartQA } from '@/components/ui/ESGSmartQA';
import { SlackGatewayCard } from '@/components/slack/SlackGatewayCard';


export default function DashboardPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  // 🌟 密碼學模擬器狀態
  const [maskInput, setMaskInput] = useState('Sensitive-Data-001');
  const [maskLevel, setMaskLevel] = useState<'L1' | 'L2' | 'L3'>('L1');
  const [maskedOutput, setMaskedOutput] = useState('');
  const [l2Key, setL2Key] = useState('');

  const [pedersenValues, setPedersenValues] = useState('500, 700, 300');
  const [pedersenResult, setPedersenResult] = useState<any>(null);
  const [graphState, setGraphState] = useState<{ zkpStatus?: NodeStatus, vaultStatus?: NodeStatus, agentStatus?: NodeStatus }>({
    agentStatus: 'idle', zkpStatus: 'idle', vaultStatus: 'idle'
  });

  // Evidence Vault Logs State
  const [vaultLogs, setVaultLogs] = useState([
    { id: 'ART-8821', title: '2025 年度碳排盤查總表 (子公司加總)', hash: 'a1b2...9f8e', time: '10 mins ago', status: 'ZK-Verified' },
    { id: 'ART-8820', title: 'Q3 董事會決議紀錄', hash: 'c3d4...7a6b', time: '2 hours ago', status: '5T-Sealed' },
    { id: 'ART-8819', title: '供應商合約去敏證明 (L2 遮罩)', hash: 'e5f6...5c4d', time: '5 hours ago', status: '5T-Sealed' },
  ]);

  useEffect(() => {
    // 啟動 Realtime 監聽
    omniRealtime.connect(null, {
      onPresenceSync: () => {},
      onStatusChange: () => {},
      onEventReceived: (event: any) => {
        if (event.type === 'SEAL') {
          try {
             const payloadObj = JSON.parse(event.payload);
             setVaultLogs(prev => [
                {
                  id: payloadObj.id || `ART-${Math.floor(Math.random() * 9000) + 1000}`,
                  title: payloadObj.title || '系統加密操作',
                  hash: payloadObj.hash || 'xxxx...xxxx',
                  time: 'Just now',
                  status: payloadObj.status || '5T-Sealed'
                },
                ...prev
             ].slice(0, 10)); // 僅保留最新的 10 筆
          } catch (e) {}
        }
      }
    });

    return () => {
      omniRealtime.disconnect();
    };
  }, []);

  const handleMask = async () => {
    try {
      setGraphState({ agentStatus: 'processing', zkpStatus: 'idle', vaultStatus: 'idle' });
      const res = await fetch('/api/crypto/simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mask', data: maskInput, level: maskLevel })
      });
      const data = await res.json();
      setMaskedOutput(data.masked);
      if (data.l2KeyHex) setL2Key(data.l2KeyHex);
      setGraphState({ agentStatus: 'success', zkpStatus: 'processing', vaultStatus: 'idle' });
      
      // 廣播事件至 OmniRealtime
      omniRealtime.emitEvent({
        type: 'SEAL',
        payload: JSON.stringify({
          title: `資料去敏操作 (${maskLevel})`,
          hash: data.masked.substring(0, 8) + '...' + data.masked.slice(-4),
          status: '5T-Sealed'
        })
      }, null);

      setTimeout(() => setGraphState({ agentStatus: 'success', zkpStatus: 'success', vaultStatus: 'idle' }), 500);
    } catch (e) {
      setGraphState({ agentStatus: 'failed', zkpStatus: 'idle', vaultStatus: 'idle' });
    }
  };

  const handleUnmask = async () => {
    try {
      setGraphState({ agentStatus: 'processing', zkpStatus: 'idle', vaultStatus: 'idle' });
      const res = await fetch('/api/crypto/simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unmask', masked: maskedOutput, l2KeyHex: l2Key })
      });
      const data = await res.json();
      if (data.unmasked) {
        setMaskedOutput(data.unmasked);
        setGraphState({ agentStatus: 'success', zkpStatus: 'success', vaultStatus: 'idle' });
        
        omniRealtime.emitEvent({
          type: 'SEAL',
          payload: JSON.stringify({
            title: '授權解密還原 (L2)',
            hash: 'VERIFIED_ACCESS',
            status: 'ZK-Verified'
          })
        }, null);
      } else {
        alert(data.error);
        setGraphState({ agentStatus: 'failed', zkpStatus: 'idle', vaultStatus: 'idle' });
      }
    } catch (e) {
      setGraphState({ agentStatus: 'failed', zkpStatus: 'idle', vaultStatus: 'idle' });
    }
  };

  const handlePedersen = async () => {
    try {
      setGraphState({ agentStatus: 'success', zkpStatus: 'processing', vaultStatus: 'idle' });
      const values = pedersenValues.split(',').map(v => Number(v.trim())).filter(v => !isNaN(v));
      const res = await fetch('/api/crypto/simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'pedersen', values })
      });
      const data = await res.json();
      setPedersenResult(data);
      if (data.isValid) {
        setGraphState({ agentStatus: 'success', zkpStatus: 'success', vaultStatus: 'processing' });
        
        omniRealtime.emitEvent({
          type: 'SEAL',
          payload: JSON.stringify({
            title: 'Pedersen 同態加總驗證',
            hash: data.expectedTotal.substring(0, 8) + '...',
            status: 'ZK-Verified'
          })
        }, null);

        setTimeout(() => setGraphState({ agentStatus: 'success', zkpStatus: 'success', vaultStatus: 'success' }), 1000);
      } else {
        setGraphState({ agentStatus: 'success', zkpStatus: 'failed', vaultStatus: 'idle' });
      }
    } catch (e) {
      setGraphState({ agentStatus: 'success', zkpStatus: 'failed', vaultStatus: 'idle' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-10 font-sans selection:bg-cyan-500/30">
      {/* 神經形態背景光暈 */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-8 relative z-10"
      >
        {/* ─── Header 區塊 ────────────────────────────── */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BrandStatusDot status="active" pulse size="sm" />
              <span className="text-xs font-mono font-black tracking-[0.3em] text-cyan-400 uppercase">
                System_Resonance_Optimal
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <LayoutDashboard className="text-cyan-400" size={32} />
              主權治理終端 <span className="text-slate-500 font-light">| Dashboard</span>
            </h1>
          </div>
          <div className="flex gap-3">
            <BrandBadge variant="outline" className="border-indigo-500/30 text-indigo-300">
              <ShieldCheck size={14} className="mr-1" /> 5T 協議啟用
            </BrandBadge>
            <BrandBadge variant="outline" className="border-emerald-500/30 text-emerald-300">
              <Database size={14} className="mr-1" /> ZKP 加密運算中
            </BrandBadge>
          </div>
        </header>

        {/* ─── Bento Grid 佈局 ────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[180px] gap-6">

          {/* 1. 總合規健康度 (Hero Card) - 佔 2x2 */}
          <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-2">
            <BrandCard variant="hologram" padding="lg" className="h-full flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                <TrendingUp size={120} className="text-cyan-500" />
              </div>
              <div>
                <h2 className="text-sm font-mono text-slate-400 tracking-widest uppercase mb-1">Overall ESG Health</h2>
                <div className="text-6xl font-black text-white tracking-tighter">
                  94<span className="text-3xl text-cyan-400">.2%</span>
                </div>
                <p className="text-sm text-cyan-400 mt-2 font-medium bg-cyan-500/10 w-fit px-3 py-1 rounded-full">
                  +2.4% 自上次 OmniAgent 校準
                </p>
              </div>
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">GRI 2021 覆蓋率</span>
                  <span className="text-emerald-400 font-bold">100%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-full" />
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-slate-400">TCFD 情境分析</span>
                  <span className="text-amber-400 font-bold">85%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[85%]" />
                </div>
              </div>
            </BrandCard>
          </motion.div>

          {/* 2. 萬能蜂群狀態 (Swarm Activity) - 佔 2x1 */}
          <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-1">
            <BrandCard variant="glass" padding="md" className="h-full flex flex-col justify-center border-indigo-500/20">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-indigo-400 font-bold tracking-widest text-sm uppercase">
                  <Cpu size={18} /> OmniAgent Swarm
                </div>
                <BrandStatusDot status="active" pulse />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#0f172a] rounded-xl p-3 border border-white/5">
                  <div className="text-xs text-slate-500 mb-1">活躍 Agent</div>
                  <div className="text-2xl font-black text-white">12</div>
                </div>
                <div className="bg-[#0f172a] rounded-xl p-3 border border-white/5">
                  <div className="text-xs text-slate-500 mb-1">共鳴修復 (今日)</div>
                  <div className="text-2xl font-black text-indigo-400">3</div>
                </div>
                <div className="bg-[#0f172a] rounded-xl p-3 border border-white/5">
                  <div className="text-xs text-slate-500 mb-1">系統熵值</div>
                  <div className="text-2xl font-black text-emerald-400">0.08</div>
                </div>
              </div>
            </BrandCard>
          </motion.div>

          {/* 3. ZK-Privacy 加密引擎 - 佔 1x1 */}
          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
            <BrandCard variant="glass" padding="md" className="h-full flex flex-col justify-between border-emerald-500/20 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Fingerprint size={100} className="text-emerald-500" />
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold tracking-widest text-xs uppercase mb-2">
                <Lock size={16} /> ZK-Privacy Engine
              </div>
              <div>
                <div className="text-3xl font-black text-white mb-1">42<span className="text-sm font-normal text-slate-400 ml-1">項</span></div>
                <div className="text-xs text-slate-400">受 Pedersen 承諾保護之機密數據</div>
              </div>
            </BrandCard>
          </motion.div>

          {/* 4. 警報與風險雷達 - 佔 1x1 */}
          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
            <BrandCard variant="glass" padding="md" className="h-full flex flex-col justify-between border-rose-500/20">
              <div className="flex items-center gap-2 text-rose-400 font-bold tracking-widest text-xs uppercase mb-2">
                <AlertTriangle size={16} /> Risk Radar
              </div>
              <div>
                <div className="text-3xl font-black text-white mb-1">1<span className="text-sm font-normal text-slate-400 ml-1">起</span></div>
                <div className="text-xs text-rose-300 bg-rose-500/10 px-2 py-1 rounded inline-block mt-1">
                  需法務簽署合規缺口
                </div>
              </div>
            </BrandCard>
          </motion.div>

          {/* 5. 5T Evidence Vault 實證封印日誌 - 佔全寬 (4x1) */}
          <motion.div variants={itemVariants} className="md:col-span-4 md:row-span-1">
            <BrandCard variant="glass" padding="md" className="h-full border-cyan-500/20 flex flex-col">
              <div className="flex items-center gap-2 text-cyan-400 font-bold tracking-widest text-xs uppercase mb-4">
                <Database size={16} /> Evidence Vault (最近封印日誌)
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {/* 動態日誌條目 (來自 Realtime 同步) */}
                {vaultLogs.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    key={log.id + i} 
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-slate-500">{log.id}</span>
                      <span className="text-sm font-medium text-slate-200">{log.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-cyan-500/50 bg-cyan-500/10 px-2 py-0.5 rounded">{log.hash}</span>
                      <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">{log.status}</span>
                      <span className="text-xs text-slate-500 min-w-[80px] text-right">{log.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </BrandCard>
          </motion.div>

          {/* 6. 高維密碼學互動模擬器 (Crypto Simulator) - 佔全寬 (4x1) */}
          <motion.div variants={itemVariants} className="md:col-span-4">
            <div className="mb-6">
              <CausalTopologyGraph
                taskId="SIM-CRYPTO-ZKP"
                agentStatus={graphState.agentStatus}
                zkpStatus={graphState.zkpStatus}
                vaultStatus={graphState.vaultStatus}
              />
            </div>
            <BrandCard variant="glass" padding="md" className="h-full border-indigo-500/20 flex flex-col md:flex-row gap-6">
              {/* L1/L2/L3 去敏模擬 */}
              <div className="flex-1 space-y-4 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                <div className="flex items-center gap-2 text-indigo-400 font-bold tracking-widest text-xs uppercase">
                  <EyeOff size={16} /> Data Masking (L1/L2/L3)
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={maskInput}
                      onChange={e => setMaskInput(e.target.value)}
                      className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                    />
                    <select
                      value={maskLevel}
                      onChange={e => setMaskLevel(e.target.value as any)}
                      className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                    >
                      <option value="L1">L1 模糊化</option>
                      <option value="L2">L2 假名化</option>
                      <option value="L3">L3 不可逆</option>
                    </select>
                    <button onClick={handleMask} className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-4 py-2 rounded-lg text-sm transition-colors border border-indigo-500/30">
                      遮罩
                    </button>
                  </div>
                  {maskedOutput && (
                    <div className="p-3 bg-black/40 rounded-lg border border-indigo-500/20 font-mono text-xs text-indigo-300 break-all relative mt-2">
                      <span className="text-slate-500 absolute -top-2 left-2 bg-[#0f172a] px-1 text-[10px]">Output</span>
                      {maskedOutput}
                      {maskLevel === 'L2' && maskedOutput.startsWith('L2::') && (
                        <button onClick={handleUnmask} className="mt-3 block w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 py-1.5 rounded border border-emerald-500/20 transition-colors flex items-center justify-center gap-1">
                          <Key size={14} /> 授權解密還原
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Pedersen 承諾同態加法模擬 */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold tracking-widest text-xs uppercase">
                  <Calculator size={16} /> Pedersen Homomorphic Sum
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pedersenValues}
                    onChange={e => setPedersenValues(e.target.value)}
                    placeholder="輸入數值 (以逗號分隔, 例: 500,700,300)"
                    className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                  />
                  <button onClick={handlePedersen} className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-4 py-2 rounded-lg text-sm transition-colors border border-emerald-500/30 whitespace-nowrap">
                    同態加總
                  </button>
                </div>
                {pedersenResult && (
                  <div className="p-3 bg-black/40 rounded-lg border border-emerald-500/20 font-mono text-xs text-emerald-300 space-y-2 mt-2">
                    <div className="max-h-24 overflow-y-auto custom-scrollbar space-y-1 pr-2">
                      {pedersenResult.commitments.map((c: any, i: number) => (
                        <div key={i} className="truncate"><span className="text-slate-500">C{i + 1} ({c.value}):</span> {c.commitment.substring(0, 20)}...</div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-emerald-500/20 truncate">
                      <span className="text-slate-500">Total expected:</span> {pedersenResult.expectedTotal.substring(0, 20)}...
                    </div>
                    <div className="font-bold text-emerald-400 mt-2 bg-emerald-500/10 px-2 py-1 rounded inline-block">
                      {pedersenResult.isValid ? '✅ 同態加法驗證通過 (ZKP Valid)' : '❌ 驗證失敗'}
                    </div>
                  </div>
                )}
              </div>
            </BrandCard>
          </motion.div>

          {/* 7. ESG 法規智能問答 (RAG) - 佔全寬 (4x1) */}
          <motion.div variants={itemVariants} className="md:col-span-4">
            <BrandCard variant="glass" padding="md" className="h-full border-blue-500/20">
              <div className="flex items-center gap-2 text-blue-400 font-bold tracking-widest text-xs uppercase mb-4">
                <BookOpen size={16} /> ESG 法規智能問答 (RAG Knowledge Base)
              </div>
              <ESGSmartQA />
            </BrandCard>
          </motion.div>

          {/* 8. Slack OmniAgent Gateway - 佔全寬 (4x1) */}
          <motion.div variants={itemVariants} className="md:col-span-4">
            <SlackGatewayCard />
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}