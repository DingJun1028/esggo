'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { omniRealtime } from '@/lib/realtime/SupabaseOmniRealtimeService';
import {
  LayoutDashboard, Activity, ShieldCheck, Cpu,
  TrendingUp, Database, Lock, AlertTriangle, Fingerprint,
  EyeOff, Key, Calculator, BookOpen
} from 'lucide-react';
import { BrandStatusDot } from '@/components/brand';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
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
      onEventReceived: (event: unknown) => {
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
    <div className="min-h-screen bg-slate-50 text-slate-600 p-6 md:p-10 font-sans selection:bg-cyan-100 overflow-x-hidden">
      {/* 柔和背景光暈 */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-100/40 blur-[150px] rounded-full pointer-events-none mix-blend-multiply" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-100/40 blur-[150px] rounded-full pointer-events-none mix-blend-multiply" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-8 relative z-10"
      >
        {/* ─── Header 區塊 ────────────────────────────── */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BrandStatusDot status="active" pulse size="sm" />
              <span className="text-xs font-mono font-black tracking-[0.3em] text-cyan-600 uppercase">
                System_Resonance_Optimal
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <LayoutDashboard className="text-cyan-600" size={32} />
              主權治理終端 <span className="text-slate-400 font-light">| Dashboard</span>
            </h1>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="border-indigo-200 text-indigo-600 bg-white/50 backdrop-blur-md">
              <ShieldCheck size={14} className="mr-1" /> 5T 協議啟用
            </Badge>
            <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-white/50 backdrop-blur-md">
              <Database size={14} className="mr-1" /> ZKP 加密運算中
            </Badge>
          </div>
        </header>

        {/* ─── Bento Grid 佈局 ────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[180px] gap-6">

          {/* 1. 總合規健康度 (Hero Card) - 佔 2x2 */}
          <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-2">
            <Card className="h-full flex flex-col justify-between overflow-hidden relative group bg-white/80 backdrop-blur-xl border-white shadow-xl shadow-slate-200/50 p-8">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp size={120} className="text-cyan-600" />
              </div>
              <div>
                <h2 className="text-sm font-mono text-slate-400 tracking-widest uppercase mb-1">Overall ESG Health</h2>
                <div className="text-7xl font-black text-slate-900 tracking-tighter">
                  94<span className="text-4xl text-cyan-600">.2%</span>
                </div>
                <p className="text-sm text-cyan-600 mt-3 font-bold bg-cyan-50 w-fit px-4 py-1.5 rounded-full border border-cyan-100">
                  +2.4% 自上次 OmniAgent 校準
                </p>
              </div>
              <div className="space-y-4 relative z-10 pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                    <span className="text-slate-400">GRI 2021 覆蓋率</span>
                    <span className="text-emerald-600">100%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                    <div className="bg-emerald-500 h-full w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                    <span className="text-slate-400">TCFD 情境分析</span>
                    <span className="text-amber-600">85%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                    <div className="bg-amber-500 h-full w-[85%]" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* 2. 萬能蜂群狀態 (Swarm Activity) - 佔 2x1 */}
          <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-1">
            <Card className="h-full flex flex-col justify-center border-white bg-white/70 backdrop-blur-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-indigo-600 font-black tracking-widest text-xs uppercase">
                  <Cpu size={18} /> OmniAgent Swarm
                </div>
                <BrandStatusDot status="active" pulse />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-inner">
                  <div className="text-[10px] font-black text-slate-400 uppercase mb-1">活躍 Agent</div>
                  <div className="text-2xl font-black text-slate-900">12</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-inner">
                  <div className="text-[10px] font-black text-slate-400 uppercase mb-1">共鳴修復</div>
                  <div className="text-2xl font-black text-indigo-600">3</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-inner">
                  <div className="text-[10px] font-black text-slate-400 uppercase mb-1">系統熵值</div>
                  <div className="text-2xl font-black text-emerald-600">0.08</div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* 3. ZK-Privacy 加密引擎 - 佔 1x1 */}
          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
            <Card className="h-full flex flex-col justify-between border-white bg-white/70 backdrop-blur-xl shadow-sm p-6 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5">
                <Fingerprint size={100} className="text-emerald-600" />
              </div>
              <div className="flex items-center gap-2 text-emerald-600 font-black tracking-widest text-[10px] uppercase mb-2">
                <Lock size={16} /> ZK-Privacy Engine
              </div>
              <div>
                <div className="text-4xl font-black text-slate-900 mb-1">42<span className="text-sm font-normal text-slate-400 ml-1">項</span></div>
                <div className="text-[10px] font-medium text-slate-400 leading-tight">受 Pedersen 承諾保護之機密數據</div>
              </div>
            </Card>
          </motion.div>

          {/* 4. 警報與風險雷達 - 佔 1x1 */}
          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
            <Card className="h-full flex flex-col justify-between border-white bg-white/70 backdrop-blur-xl shadow-sm p-6">
              <div className="flex items-center gap-2 text-rose-600 font-black tracking-widest text-[10px] uppercase mb-2">
                <AlertTriangle size={16} /> Risk Radar
              </div>
              <div>
                <div className="text-4xl font-black text-slate-900 mb-1">1<span className="text-sm font-normal text-slate-400 ml-1">起</span></div>
                <div className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded inline-block mt-1 border border-rose-100">
                  需法務簽署合規缺口
                </div>
              </div>
            </Card>
          </motion.div>

          {/* 5. 5T Evidence Vault 實證封印日誌 - 佔全寬 (4x1) */}
          <motion.div variants={itemVariants} className="md:col-span-4 md:row-span-1">
            <Card className="h-full border-white bg-white/60 backdrop-blur-xl shadow-sm p-6 flex flex-col">
              <div className="flex items-center gap-2 text-cyan-700 font-black tracking-widest text-[10px] uppercase mb-4">
                <Database size={16} /> Evidence Vault (最近封印日誌)
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {/* 動態日誌條目 (來自 Realtime 同步) */}
                {vaultLogs.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    key={log.id + i} 
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-white transition-all hover:shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{log.id}</span>
                      <span className="text-sm font-bold text-slate-700">{log.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-cyan-600/60 bg-cyan-50 px-2 py-1 rounded border border-cyan-100">{log.hash}</span>
                      <Badge variant="verified" className="text-[10px] px-2 py-1">{log.status}</Badge>
                      <span className="text-[10px] font-bold text-slate-400 min-w-[80px] text-right uppercase">{log.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* 6. 高維密碼學互動模擬器 (Crypto Simulator) - 佔全寬 (4x1) */}
          <motion.div variants={itemVariants} className="md:col-span-4">
            <div className="mb-6 border border-slate-200 rounded-[2rem] bg-white shadow-sm overflow-hidden h-[240px]">
              <CausalTopologyGraph
                taskId="SIM-CRYPTO-ZKP"
                agentStatus={graphState.agentStatus}
                zkpStatus={graphState.zkpStatus}
                vaultStatus={graphState.vaultStatus}
              />
            </div>
            <Card className="h-full border-white bg-white/70 backdrop-blur-xl shadow-sm p-8 flex flex-col md:flex-row gap-8">
              {/* L1/L2/L3 去敏模擬 */}
              <div className="flex-1 space-y-4 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-8">
                <div className="flex items-center gap-2 text-indigo-600 font-black tracking-widest text-[10px] uppercase">
                  <EyeOff size={16} /> Data Masking (L1/L2/L3)
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={maskInput}
                      onChange={e => setMaskInput(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-300 transition-colors"
                    />
                    <select
                      value={maskLevel}
                      onChange={e => setMaskLevel(e.target.value as any)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-bold focus:outline-none"
                    >
                      <option value="L1">L1 模糊化</option>
                      <option value="L2">L2 假名化</option>
                      <option value="L3">L3 不可逆</option>
                    </select>
                    <Button variant="primary" onClick={handleMask} className="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100">
                      遮罩
                    </Button>
                  </div>
                  {maskedOutput && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-[11px] text-indigo-600 break-all relative mt-2 shadow-inner">
                      <span className="text-slate-400 absolute -top-2 left-4 bg-white px-2 text-[9px] font-black uppercase tracking-widest">Output</span>
                      {maskedOutput}
                      {maskLevel === 'L2' && maskedOutput.startsWith('L2::') && (
                        <button onClick={handleUnmask} className="mt-4 block w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 py-2 rounded-xl border border-emerald-200 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                          <Key size={14} /> 授權解密還原
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Pedersen 承諾同態加法模擬 */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 font-black tracking-widest text-[10px] uppercase">
                  <Calculator size={16} /> Pedersen Homomorphic Sum
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pedersenValues}
                      onChange={e => setPedersenValues(e.target.value)}
                      placeholder="輸入數值 (以逗號分隔, 例: 500,700,300)"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-300 transition-colors"
                    />
                    <Button variant="primary" onClick={handlePedersen} className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 whitespace-nowrap">
                      同態加總
                    </Button>
                  </div>
                  {pedersenResult && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-emerald-100 font-mono text-[11px] text-emerald-700 space-y-3 mt-2 shadow-inner">
                      <div className="max-h-24 overflow-y-auto custom-scrollbar space-y-1.5 pr-2">
                        {pedersenResult.commitments.map((c: unknown, i: number) => (
                          <div key={i} className="truncate"><span className="text-slate-400">C{i + 1} ({c.value}):</span> {c.commitment.substring(0, 32)}...</div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-emerald-200/50 truncate">
                        <span className="text-slate-400">Total expected:</span> {pedersenResult.expectedTotal.substring(0, 32)}...
                      </div>
                      <div className="font-black text-[10px] uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full inline-block border border-emerald-200">
                        {pedersenResult.isValid ? '✅ 同態加法驗證通過 (ZKP Valid)' : '❌ 驗證失敗'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* 7. ESG 法規智能問答 (RAG) - 佔全寬 (4x1) */}
          <motion.div variants={itemVariants} className="md:col-span-4">
            <Card className="h-full border-white bg-white/70 backdrop-blur-xl shadow-sm p-8">
              <div className="flex items-center gap-2 text-cyan-700 font-black tracking-widest text-[10px] uppercase mb-6">
                <BookOpen size={16} /> ESG 法規智能問答 (RAG Knowledge Base)
              </div>
              <ESGSmartQA />
            </Card>
          </motion.div>

          {/* 8. Slack OmniAgent Gateway - 佔全寬 (4x1) */}
          <motion.div variants={itemVariants} className="md:col-span-4 pb-12">
            <SlackGatewayCard />
          </motion.div>

        </div>
      </motion.div>

      {/* Global Style Injector */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.1); }
      `}</style>
    </div>
  );
}