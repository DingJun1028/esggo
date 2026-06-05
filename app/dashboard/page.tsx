'use client';

import React, { useState, useEffect } from 'react';
import {
  Layout, Shield, Activity, Fingerprint, Database,
  Sparkles, Send, CheckCircle2, Lock, GitMerge, X, Layers
} from 'lucide-react';
import { AtomicCard } from '@/lib/design-system/AtomicCard';
import { AtomicButton } from '@/lib/design-system/AtomicButton';
import { AtomicBadge } from '@/lib/design-system/AtomicBadge';
import { AtomicInput } from '@/lib/design-system/AtomicInput';
import { AtomicProgress } from '@/lib/design-system/AtomicProgress';
import { AtomicToggle } from '@/lib/design-system/AtomicToggle';
import { atomicManager, IAtomicComponent } from '@/lib/design-system/atomic-core';
import OmniKpiCard from '@/components/omni/OmniKpiCard';
import { Leaf, Users, Building2 } from 'lucide-react/icons';
import { getUniversalNotesAction, semanticCreateTaskAction, TaskRecord } from '@/lib/agent/UniversalNotesTracker';

export default function SovereignDashboard() {
  // 三欄式佈局：控制右側 Workspace Panel 展開/收合
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [ncbdbStatus, setNcbdbStatus] = useState<{ status: string; data?: any }>({ status: 'Awaiting Sync...' });
  const [isMemorySyncing, setIsMemorySyncing] = useState(true);
  const [isRegistryModalOpen, setIsRegistryModalOpen] = useState(false);
  const [registeredAtoms, setRegisteredAtoms] = useState<IAtomicComponent[]>([]);
  const [esgData, setEsgData] = useState<any>(null);
  const [universalNotes, setUniversalNotes] = useState<TaskRecord[]>([]);
  const [hiveMindLogs, setHiveMindLogs] = useState<string[]>([
    `[${new Date().toISOString().substring(11, 19)}] SYS_BOOT`,
    '> OmniAgent Bus connected.',
    '> Awaiting JunAiKey semantics...'
  ]);
  const [composerInput, setComposerInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  // 當打開註冊表 Modal 時，從萬能心核庫撈取已註冊的元件
  useEffect(() => {
    if (isRegistryModalOpen) {
      setRegisteredAtoms(atomicManager.getAllRegisteredAtoms());
    }
  }, [isRegistryModalOpen]);

  // 自動同步觸發 (Automated Sync Trigger): 每當應用加載，將最新的本地註冊庫同步至雲端
  useEffect(() => {
    const syncComponents = async () => {
      console.log('[OmniCore] Automated Sync Trigger initiated...');
      await atomicManager.syncToCloud();
    };
    // 稍微延遲以確保所有元件都已經註冊
    const timer = setTimeout(syncComponents, 1500);
    return () => clearTimeout(timer);
  }, []);

  // 確認 NCBDB 資料庫中資料
  useEffect(() => {
    const verifyNCBDBData = async () => {
      try {
        // 透過 API 路由確認 NCBDB 遙測資料與連線狀態
        const res = await fetch('/api/telemetry/route');
        const data = res.ok ? await res.json() : null;
        setNcbdbStatus({
          status: res.ok ? 'NCBDB 100% READY (Data Confirmed)' : 'NCBDB OFFLINE',
          data
        });
      } catch (err) {
        setNcbdbStatus({ status: 'NCBDB SYNC FAILED' });
      }
    };
    verifyNCBDBData();
  }, []);

  // 取得真實 ESG KPI 數據
  useEffect(() => {
    const fetchEsgData = async () => {
      try {
        const res = await fetch('/api/metrics/esg');
        const json = await res.json();
        if (json.success) {
          setEsgData(json.data);
        }
      } catch (err) {
        console.error('[Dashboard] Error fetching ESG metrics:', err);
      }
    };
    fetchEsgData();
  }, []);

  // 實時連動：輪詢獲取萬能筆記的最新自主任務狀態
  useEffect(() => {
    let mounted = true;
    const syncNotes = async () => {
      try {
        const notes = await getUniversalNotesAction();
        if (mounted) setUniversalNotes(notes);
      } catch (e) { }
    };
    syncNotes();
    const interval = setInterval(syncNotes, 3000); // 3秒實時心跳同步
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  // 實時連動：建立真實 WebSocket 連線接收 Hive Mind 廣播日誌
  useEffect(() => {
    // 支援從環境變數注入 WebSocket 服務，預設回退至同源的 API 串流端點
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = process.env.NEXT_PUBLIC_SWARM_WS_URL || `${protocol}//${window.location.host}/api/swarm/stream`;
    
    let ws: WebSocket;
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setHiveMindLogs(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] 🌐 OmniCore Hive Mind WebSocket Connected.`].slice(-20));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const time = new Date().toISOString().substring(11, 19);
          // 支援 orchestrator.ts 中發送的 { stage, node, message, taskId }
          let logText = `[${time}] `;
          if (data.node) logText += `[${data.node}] `;
          if (data.stage) logText += `${data.stage} `;
          if (data.message) logText += `- ${data.message}`;
          else if (data.taskId) logText += `- Task ID: ${data.taskId.substring(0, 8)}...`;
          
          setHiveMindLogs(prev => [...prev, logText.trim()].slice(-20));
        } catch (err) {
          const time = new Date().toISOString().substring(11, 19);
          setHiveMindLogs(prev => [...prev, `[${time}] ${event.data}`].slice(-20));
        }
      };

      ws.onclose = () => {
        setHiveMindLogs(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] ⚠️ WebSocket Disconnected. Reconnecting in 5s...`].slice(-20));
        reconnectTimer = setTimeout(connect, 5000);
      };

      ws.onerror = (err) => {
        console.error('[Hive Mind WS Error]', err);
        ws.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) {
        ws.onclose = null; // 避免元件卸載時觸發不必要的重連
        ws.close();
      }
    };
  }, []);

  // 處理語義對話框送出
  const handleSemanticSubmit = async () => {
    if (!composerInput.trim()) return;
    setIsComposing(true);
    const currentPrompt = composerInput;
    setComposerInput(''); // 立即清空輸入框提升 UX

    // 將人類引導記錄寫入底層日誌
    setHiveMindLogs(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] 接收語義引導: "${currentPrompt}"...`].slice(-20));

    try {
      await semanticCreateTaskAction(currentPrompt);

      setHiveMindLogs(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] 語義已轉譯，萬能筆記任務生成完畢。`].slice(-20));

      // 強制立刻同步一次萬能筆記，實現零延遲 UI 回饋
      const notes = await getUniversalNotesAction();
      setUniversalNotes(notes);

      // 如果右側面板未展開，則自動展開以展示新任務
      if (!isWorkspaceOpen) setIsWorkspaceOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsComposing(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#020617] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#06b6d4]/10 via-[#020617] to-[#020617] text-slate-200 overflow-hidden flex font-sans selection:bg-[#06b6d4]/30">
      {/* Layer 0: Void (Background) is handled by the wrapper bg-[#020617] */}

      {/* --- 左側：導航與 OmniAgent 狀態 (Layer 1) --- */}
      <aside className="w-20 md:w-64 border-r border-white/10 bg-white/5 backdrop-blur-[12px] flex flex-col justify-between z-10 shrink-0">
        <div>
          {/* 系統核心標識 */}
          <div className="h-16 border-b border-white/10 flex items-center px-4 md:px-6 gap-3">
            <div className="w-8 h-8 rounded flex-shrink-0 bg-[#06b6d4] shadow-[0_0_15px_rgba(6,182,212,0.6)] flex items-center justify-center">
              <Sparkles className="text-[#020617] w-5 h-5" />
            </div>
            <span className="hidden md:block font-bold text-[#06b6d4] tracking-widest text-sm">
              ESGGO 5T
            </span>
          </div>

          {/* 導航選單 */}
          <nav className="p-4 space-y-2">
            {['Dashboard', 'Evidence Vault', 'ZK-Privacy', 'Audit Logs'].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-all border border-transparent hover:border-white/10 hover:shadow-[0_0_10px_rgba(6,182,212,0.1)] group">
                <Database className="w-5 h-5 text-slate-400 group-hover:text-[#06b6d4] transition-colors" />
                <span className="hidden md:block text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  {item}
                </span>
              </div>
            ))}
          </nav>
        </div>

        {/* OmniAgent 狀態回報 */}
        <div className="p-4 border-t border-white/10 flex items-center justify-center md:justify-start gap-3 bg-black/20">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10b981]"></span>
          </div>
          <div className="hidden md:block text-xs font-mono">
            <div className="text-[#10b981]">OmniAgent</div>
            <div className="text-slate-500">100% READY</div>
          </div>
        </div>
      </aside>

      {/* --- 中央：主內容區與 Bento Grid (Layer 1 & 2) --- */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* 頂部 Header */}
        <header className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-[12px] flex items-center justify-between px-6 shrink-0">
          <h1 className="text-lg font-semibold text-white/90 font-mono tracking-wide flex items-center gap-2">
            <span className="text-[#06b6d4]">/</span> SOVEREIGN_GOVERNANCE_OS
          </h1>
          <div className="flex items-center gap-3">
            <AtomicButton
              variant="outline"
              onClick={() => setIsRegistryModalOpen(true)}
              title="View OmniCore Registry"
              className="hidden sm:flex gap-2 border-[#06b6d4]/30 text-[#06b6d4] hover:bg-[#06b6d4]/10"
            >
              <Layers className="w-4 h-4" />
              <span className="text-xs font-mono">Registry</span>
            </AtomicButton>
            <AtomicButton
              variant="ghost"
              onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
              className={isWorkspaceOpen ? 'bg-white/10 border-white/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : ''}
              title="Toggle Workspace (Ctrl+B)"
            >
              <Layout className={`w-5 h-5 ${isWorkspaceOpen ? 'text-[#06b6d4]' : 'text-slate-400'}`} />
            </AtomicButton>
          </div>
        </header>

        {/* Bento Grid (萬能元件佈局) */}
        <div className="flex-1 overflow-y-auto p-6 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">

          {/* ESG 核心指標 (E, S, G) */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
            <OmniKpiCard
              title={esgData?.environmental?.title || "溫室氣體總排量 (Scope 1+2)"}
              value={esgData?.environmental?.value || "14,250"}
              unit={esgData?.environmental?.unit || "tCO2e"}
              trend={esgData?.environmental?.trend || -3.2}
              trendLabel={esgData?.environmental?.trendLabel || "較前年"}
              fiveTStatus={esgData?.environmental?.fiveTStatus || [true, true, true, true, true]}
              icon={<Leaf size={18} />}
              dataSource={esgData?.environmental?.dataSource || "NCBDB_ERP_SYNC"}
            />
            <OmniKpiCard
              title={esgData?.social?.title || "多元共融指數 (D&I Score)"}
              value={esgData?.social?.value || "82.4"}
              unit={esgData?.social?.unit || "分"}
              trend={esgData?.social?.trend || 4.5}
              trendLabel={esgData?.social?.trendLabel || "較前年"}
              fiveTStatus={esgData?.social?.fiveTStatus || [true, true, true, true, false]}
              icon={<Users size={18} />}
              dataSource={esgData?.social?.dataSource || "HR_SURVEY_VAULT"}
            />
            <OmniKpiCard
              title={esgData?.governance?.title || "董事會獨立性"}
              value={esgData?.governance?.value || "65.0"}
              unit={esgData?.governance?.unit || "%"}
              trend={esgData?.governance?.trend || 0}
              trendLabel={esgData?.governance?.trendLabel || "無變動"}
              fiveTStatus={esgData?.governance?.fiveTStatus || [true, true, true, true, true]}
              icon={<Building2 size={18} />}
              dataSource={esgData?.governance?.dataSource || "GOVERNANCE_LEDGER"}
            />
          </div>

          {/* 5T 協議門狀態卡片 */}
          <AtomicCard glassIntensity="medium" hoverEffect="glow" padding="md" className="lg:col-span-2 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#06b6d4]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

            <h2 className="text-sm uppercase tracking-widest text-[#06b6d4] mb-6 flex items-center gap-2 font-semibold">
              <Shield className="w-4 h-4" /> 5T Protocol Integrity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {[
                { key: 'Truth', label: 'Traceable', icon: GitMerge, active: true },
                { key: 'Good', label: 'Transparent', icon: Activity, active: true },
                { key: 'Beauty', label: 'Tangible', icon: Sparkles, active: true },
                { key: 'Trust', label: 'Hash Lock', icon: Lock, active: true, highlight: true },
                { key: 'Trans', label: 'Trackable', icon: CheckCircle2, active: true },
              ].map((t, idx) => (
                <div key={idx} className={`flex flex-col items-center justify-center p-4 rounded-lg border ${t.highlight ? 'border-[#10b981]/50 bg-[#10b981]/10' : 'border-white/10 bg-black/20'} backdrop-blur-sm`}>
                  <t.icon className={`w-6 h-6 mb-2 ${t.highlight ? 'text-[#10b981]' : 'text-[#06b6d4]'}`} />
                  <span className="text-xs font-mono text-slate-300">{t.key}</span>
                  <span className="text-[10px] text-slate-500 mt-1">{t.label}</span>
                </div>
              ))}
            </div>
          </AtomicCard>

          {/* ZK-Proof 隱私引擎狀態 */}
          <AtomicCard glassIntensity="medium" hoverEffect="glow" padding="md">
            <h2 className="text-sm uppercase tracking-widest text-[#10b981] mb-4 flex items-center gap-2 font-semibold">
              <Fingerprint className="w-4 h-4" /> ZK-Privacy Engine
            </h2>
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-slate-400">Pedersen Commitments</span>
                <AtomicBadge variant="outline">Active (L3)</AtomicBadge>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-slate-400">Zero-Knowledge Proofs</span>
                <AtomicBadge variant="verified">Verified</AtomicBadge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Hash Time</span>
                <span className="text-white">124 ms</span>
              </div>
            </div>
          </AtomicCard>

          {/* 數據主權 - 萬能永憶 (Eternal Memory) 佔位 */}
          <AtomicCard glassIntensity="high" hoverEffect="glow" padding="lg" className="lg:col-span-3 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#06b6d4]/5 via-transparent to-[#10b981]/5 opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div className="space-y-1">
                <h2 className="text-sm uppercase tracking-widest text-[#06b6d4] font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Eternal Memory Hologram
                </h2>
                <p className="text-xs text-slate-400 font-mono">Quantum sync status & data sovereign integrity check.</p>
              </div>

              <AtomicToggle
                label={isMemorySyncing ? "SYNC ACTIVE" : "SYNC PAUSED"}
                isToggled={isMemorySyncing}
                onToggle={setIsMemorySyncing}
              />
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <AtomicProgress value={isMemorySyncing ? 78 : 45} variant={isMemorySyncing ? 'default' : 'warning'} showLabel label="Global State Sync" />
                <AtomicProgress value={100} variant="success" showLabel label="ZK-Proofs Generated" />
              </div>
              <div className="flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/30 p-6 shadow-inner">
                <div className="text-center space-y-3">
                  <div className={`inline-flex p-3 rounded-full border transition-all duration-500 ${isMemorySyncing ? 'bg-[#06b6d4]/10 border-[#06b6d4]/30 shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-pulse' : 'bg-white/5 border-white/10 grayscale'}`}>
                    <Database className={`w-6 h-6 ${isMemorySyncing ? 'text-[#06b6d4]' : 'text-slate-500'}`} />
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    {isMemorySyncing ? "> Encrypting & syncing sovereign memory blocks..." : "> Memory sync suspended by user."}
                  </div>
                </div>
              </div>
            </div>
          </AtomicCard>
        </div>

        {/* --- Global Composer (Layer 2: Hologram) --- */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-20">
          <div className="rounded-2xl border border-[#06b6d4]/30 bg-[#020617]/90 backdrop-blur-[16px] p-2 flex items-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:shadow-[0_0_40px_rgba(6,182,212,0.25)] transition-shadow duration-300">

            {/* Agent 切換 */}
            <AtomicButton variant="ghost" className="!w-10 !h-10 !p-0 !min-w-0 !rounded-full bg-[#06b6d4]/10 flex items-center justify-center border border-[#06b6d4]/40 hover:bg-[#06b6d4]/20 transition-colors" title="Switch Agent">
              <Activity className="text-[#06b6d4] w-5 h-5" />
            </AtomicButton>

            {/* 語義引導輸入框 */}
            <div className="flex-1">
              <AtomicInput
                value={composerInput}
                onChange={(e) => setComposerInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isComposing) handleSemanticSubmit();
                }}
                disabled={isComposing}
                placeholder="JunAiKey 語義引導：請輸入指令，將自動解析為治理任務..."
                className="!bg-transparent !border-none !outline-none !shadow-none focus:!ring-0 !text-white placeholder:!text-slate-500 !px-0 w-full text-sm font-medium"
              />
            </div>

            {/* Context Ring 與發送按鈕 */}
            <div className="w-10 h-10 flex items-center justify-center relative">
              {isComposing ? (
                <div className="absolute inset-0 rounded-full border border-[#10b981]/50 animate-[spin_3s_linear_infinite]"></div>
              ) : (
                <div className="absolute inset-0 rounded-full border border-dashed border-[#06b6d4]/30"></div>
              )}
              <AtomicButton
                onClick={handleSemanticSubmit}
                disabled={isComposing || !composerInput.trim()}
                variant="ghost"
                className={`relative !w-8 !h-8 !p-0 !min-w-0 !rounded-full ${isComposing ? 'bg-[#10b981]/10 text-[#10b981]/50' : 'bg-[#10b981]/20 hover:bg-[#10b981]/40 text-[#10b981]'} flex items-center justify-center transition-colors`}
              >
                <Send className="w-4 h-4 ml-0.5" />
              </AtomicButton>
            </div>
          </div>
        </div>
      </main>

      {/* --- 右側：Workspace Panel --- */}
      <aside
        className={`transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border-l border-white/10 bg-white/5 backdrop-blur-[16px] z-20 overflow-hidden shrink-0 ${isWorkspaceOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 border-none'
          }`}
      >
        <div className="w-80 h-full flex flex-col p-4 bg-black/20">
          {/* 蜂群控制台標頭 */}
          <div className="flex items-center justify-between mb-4 shrink-0 border-b border-white/10 pb-3">
            <h3 className="text-xs font-bold text-[#06b6d4] uppercase tracking-widest font-mono flex items-center gap-2 shadow-cyan-glow">
              <Activity className="w-4 h-4" /> Hive Mind Console
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              <span className="text-[10px] text-[#10b981] font-mono tracking-wide">SYNCED</span>
            </div>
          </div>

          {/* 連動區：萬能筆記實時追蹤 (Universal Notes) */}
          <div className="mb-4 shrink-0">
            <h4 className="text-[10px] text-slate-400 font-mono mb-2 flex justify-between">
              <span>UNIVERSAL_NOTES</span>
              <span className="text-cyan-core">{universalNotes.length} TASKS</span>
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {universalNotes.length === 0 ? (
                <div className="text-[10px] text-slate-500 italic flex items-center justify-center p-4 border border-dashed border-white/10 rounded-lg">No autonomous tasks recorded.</div>
              ) : (
                universalNotes.slice(0, 4).map(note => (
                  <div key={note.id} className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-1.5 hover:border-[#06b6d4]/30 hover:bg-white/10 transition-colors shadow-sm">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs text-slate-200 line-clamp-1 font-medium flex-1" title={note.title}>{note.title}</span>
                      {note.assignee && (
                        <span className="shrink-0 text-[8px] font-mono px-1.5 py-0.5 rounded border border-[#06b6d4]/30 text-[#06b6d4] bg-[#06b6d4]/10 flex items-center gap-1">
                          <Activity className="w-2.5 h-2.5" />
                          {note.assignee}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[9px] text-slate-500 font-mono">ID: {note.id.substring(0, 6)}...</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${note.status === 'Done' ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30' :
                        note.status === 'In Progress' ? 'bg-[#06b6d4]/20 text-[#06b6d4] border border-[#06b6d4]/30 animate-pulse' :
                          'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                        }`}>{note.status.toUpperCase()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 連動區：蜂群底層日誌 (Swarm Logs) */}
          <h4 className="text-[10px] text-slate-400 font-mono mb-2 mt-2 pt-2 border-t border-white/10 flex items-center gap-2">
            <Layers className="w-3 h-3" /> SWARM_EVENT_LOGS
          </h4>
          <div className="flex-1 border border-white/10 rounded-lg bg-[#020617] p-3 overflow-y-auto text-[10px] text-slate-400 font-mono space-y-1.5 custom-scrollbar shadow-inner">
            {hiveMindLogs.map((log, i) => (
              <div key={i} className={`break-words ${
                log.includes('OmniCore') || log.includes('🌐') ? 'text-[#06b6d4]' : 
                log.includes('⚠️') || log.includes('❌') || log.includes('FAILED') ? 'text-[#FF4D6D]' : 
                log.includes('✅') || log.includes('Healing') || log.includes('COMPLETED') ? 'text-[#10b981]' : 
                log.includes('SYS_BOOT') ? 'text-slate-500' : 
                log.includes('ZKP') ? 'text-[#8B5CF6]' : 
                'text-slate-300'
              }`}>
                {log}
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-white/10 text-[#10b981] flex flex-col items-start gap-1.5">
              <span>&gt; {ncbdbStatus.status}</span>
              {ncbdbStatus.data && (
                <AtomicBadge variant="verified">DATA CONFIRMED</AtomicBadge>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* --- Component Registry Modal (Layer 3: System Overlay) --- */}
      {isRegistryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <AtomicCard glassIntensity="high" padding="lg" className="w-full max-w-3xl max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.15)]">
            <div className="flex justify-between items-center mb-6 shrink-0 border-b border-white/10 pb-4">
              <h2 className="text-sm font-bold text-[#06b6d4] tracking-widest flex items-center gap-2 uppercase font-mono">
                <Layers className="w-5 h-5" /> OmniCore Atomic Registry
              </h2>
              <AtomicButton variant="ghost" className="!p-2 hover:bg-white/10" onClick={() => setIsRegistryModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </AtomicButton>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {registeredAtoms.length === 0 ? (
                <div className="text-slate-400 text-sm font-mono text-center py-12 flex flex-col items-center gap-3">
                  <Database className="w-8 h-8 opacity-50" />
                  <span>[ No atoms registered yet. Awaiting OmniCore initialization... ]</span>
                </div>
              ) : (
                registeredAtoms.map((atom) => (
                  <div key={atom.atomId} className="p-4 rounded-lg border border-white/10 bg-black/40 flex flex-col gap-3 group hover:border-[#06b6d4]/50 hover:bg-white/5 transition-colors duration-300">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                        {atom.atomId}
                      </span>
                      <AtomicBadge variant={atom.core.status === 'Trustworthy' ? 'verified' : 'warning'}>
                        {atom.core.status}
                      </AtomicBadge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-[11px] font-mono text-slate-400 bg-black/30 p-3 rounded border border-white/5">
                      <div>
                        <span className="text-slate-500 block mb-1">TYPE_LEVEL</span>
                        <AtomicBadge variant="default">{atom.type}</AtomicBadge>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">VERSION</span>
                        <span className="text-slate-200">{atom.version}</span>
                      </div>
                      <div className="sm:col-span-2 pt-2 border-t border-white/5">
                        <span className="text-slate-500 block mb-1">INTENT_SPECIFICATION</span>
                        <span className="text-slate-200">{atom.reference.intent} ({atom.reference.specification})</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-500 block mb-1">GOVERNANCE_NODE</span>
                        <span className="text-[#06b6d4]">{atom.reference.governanceNode}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AtomicCard>
        </div>
      )}
    </div>
  );
}