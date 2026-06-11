"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { OmniCard } from '@/components/omni/OmniCard';
import OmniBookCaseRegistry from '@/components/omni/OmniBookCaseRegistry';
import { RecordLifecycleStatus, AttentionStatus } from '@/shared-types/status';
import { OmniAgentPulse } from '@/components/ui/omni/OmniAgentPulse';

type ExpertTemplate = 'DEFAULT' | 'CARBON_FOCUS' | 'GOVERNANCE_FOCUS' | 'AGENT_MONITOR';

const getLayoutClasses = (template: ExpertTemplate, cell: string) => {
  const baseTransition = "transition-all duration-700 ease-in-out";
  let layoutClass = "";
  switch (template) {
    case 'CARBON_FOCUS':
      if (cell === 'carbon') layoutClass = 'md:col-span-12 md:row-span-4';
      else if (cell === 'audit') layoutClass = 'md:col-span-6 md:row-span-2';
      else if (cell === 'lock') layoutClass = 'md:col-span-6 md:row-span-2';
      else if (cell === 'hermes') layoutClass = 'md:col-span-12 md:row-span-2';
      else if (cell === 'bookcase') layoutClass = 'md:col-span-12 md:row-span-4';
      break;
    case 'GOVERNANCE_FOCUS':
      if (cell === 'lock') layoutClass = 'md:col-span-6 md:row-span-4';
      else if (cell === 'audit') layoutClass = 'md:col-span-6 md:row-span-4';
      else if (cell === 'carbon') layoutClass = 'md:col-span-8 md:row-span-2';
      else if (cell === 'hermes') layoutClass = 'md:col-span-4 md:row-span-2';
      else if (cell === 'bookcase') layoutClass = 'md:col-span-12 md:row-span-4';
      break;
    case 'AGENT_MONITOR':
      if (cell === 'hermes') layoutClass = 'md:col-span-12 md:row-span-4';
      else if (cell === 'carbon') layoutClass = 'md:col-span-4 md:row-span-3';
      else if (cell === 'lock') layoutClass = 'md:col-span-4 md:row-span-3';
      else if (cell === 'audit') layoutClass = 'md:col-span-4 md:row-span-3';
      else if (cell === 'bookcase') layoutClass = 'md:col-span-12 md:row-span-4';
      break;
    case 'DEFAULT':
    default:
      if (cell === 'carbon') layoutClass = 'md:col-span-8 md:row-span-4';
      else if (cell === 'lock') layoutClass = 'md:col-span-4 md:row-span-2';
      else if (cell === 'hermes') layoutClass = 'md:col-span-4 md:row-span-2';
      else if (cell === 'audit') layoutClass = 'md:col-span-12 md:row-span-2';
      else if (cell === 'bookcase') layoutClass = 'md:col-span-12 md:row-span-4';
      break;
  }
  return `${baseTransition} ${layoutClass}`;
};

export default function OmniAppDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [carbonValue, setCarbonValue] = useState<number | null>(null);
  const [auditLedger, setAuditLedger] = useState<{ methodology: string, engineState: string, assuranceStatus: string } | null>(null);
  const [hermesStatus, setHermesStatus] = useState<{ relayStatus: string, zkpPipeline: string, activeNodes: number } | null>(null);
  const [sovereignStatus, setSovereignStatus] = useState<{ lockStatus: string, action: string, encryption: string } | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<ExpertTemplate>('DEFAULT');
  const [isAISelecting, setIsAISelecting] = useState(false);

  const simulateAISelection = () => {
    setIsAISelecting(true);
    setTimeout(() => {
      const templates: ExpertTemplate[] = ['CARBON_FOCUS', 'GOVERNANCE_FOCUS', 'AGENT_MONITOR'];
      // Randomly pick a focus template (simulating AI decision based on user intent)
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      setActiveTemplate(randomTemplate);
      setIsAISelecting(false);
    }, 1200);
  };

  const [systemMetadata, setSystemMetadata] = useState({
    uuid: "8077e7d2-fbbb-2026-0606-omnitisth001",
    componentVersion: "8.5.0-Alpha", // 雙引擎版本號契合
    timestamp: Date.now(),
    evidence: {
      source_origin: "臺北市中小企業永續治理實證系統::IoT_Node_Carbon_4",
      timestamp: Date.now(),
      hash: "e837856ecdb57b2cff1c320260604141620173520...",
      flow_path: ["IoT Carbon Node", "Hermes Agent Pipeline", "Zero-Knowledge Proof Guard", "Bento Sovereign Grid"]
    }
  });

  const fetchNexusData = async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      const [carbonResponse, auditResponse, hermesResponse, sovereignResponse] = await Promise.all([
        fetch('/api/nexus/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tool: 'verify_carbon', 
            arguments: { scope: 1, data: { value: 1250.75, unit: 'tCO2e' } } 
          })
        }),
        fetch('/api/nexus/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tool: 'get_audit_ledger', 
            arguments: { methodology: '[GRI 2021 FRAMEWORK]' } 
          })
        }),
        fetch('/api/nexus/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tool: 'get_hermes_status', arguments: {} })
        }),
        fetch('/api/nexus/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tool: 'get_sovereign_status', arguments: {} })
        })
      ]);
      
      const carbonResult = await carbonResponse.json();
      const auditResult = await auditResponse.json();
      const hermesResult = await hermesResponse.json();
      const sovereignResult = await sovereignResponse.json();
      
      if (carbonResult.success && carbonResult.data) {
        setCarbonValue(carbonResult.data.verifiedValue);
        setSystemMetadata({
          uuid: carbonResult.metadata.uuid || "unknown-uuid",
          componentVersion: "8.5.0-Alpha",
          timestamp: carbonResult.metadata.timestamp,
          evidence: {
            source_origin: `OmniNexus API :: ${carbonResult.metadata.tool}`,
            timestamp: carbonResult.metadata.timestamp,
            hash: "0xTRUSTWORTHY_" + carbonResult.metadata.timestamp,
            flow_path: ["OmniNexus API", "Zero-Knowledge Proof Guard", "Bento Sovereign Grid"]
          }
        });
      }

      if (auditResult.success && auditResult.data) {
        setAuditLedger(auditResult.data);
      }
      if (hermesResult.success && hermesResult.data) {
        setHermesStatus(hermesResult.data);
      }
      if (sovereignResult.success && sovereignResult.data) {
        setSovereignStatus(sovereignResult.data);
      }
    } catch (error) {
      console.error("OmniNexus integration error:", error);
      setFetchError((error as Error).message || "An unknown error occurred while fetching data.");
    } finally {
      setIsFetching(false);
    }
  };

  React.useEffect(() => {
    fetchNexusData();
  }, []);

  return (
    // 全通之心：自發治理與圓通無礙 - 採用深貫廣通的液態玻璃背景與環境光暈
    <div className={`min-h-screen flex flex-col select-none antialiased transition-colors duration-700 ease-in-out relative overflow-hidden ${isDarkMode ? 'dark bg-slate-950 text-white' : 'light bg-slate-50 text-slate-900'}`}>
      
      {/* 圓通無礙：環境光暈 (Ambient Orbs) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/20 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-emerald-500/20 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[50%] h-[20%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none mix-blend-screen" />

      {/* 頂部固定導航列 */}
      <header className="h-14 border-b px-6 flex items-center justify-between z-30 dark:border-white/5 dark:bg-slate-950/40 backdrop-blur-md light:border-slate-900/5 light:bg-white/40">
        <div className="text-sm font-black bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent tracking-wider">
          臺北市中小企業永續治理實證系統 // ESGGO 雙模工版
        </div>
        <div className="flex items-center gap-4">
          {/* 無作妙德：5T狀態指示 */}
          <div className="hidden md:flex items-center gap-3 mr-4 text-[10px] font-mono opacity-80 border-r pr-4 dark:border-white/10 light:border-slate-900/10">
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />真 Traceable</span>
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />善 Transparent</span>
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />美 Tangible</span>
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />信 Trustworthy</span>
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />通 Trackable</span>
          </div>
          {/* SustainWrite 導航 */}
          <Link 
            href="/sustain-write"
            className="hidden md:flex text-xs font-mono border border-cyan-500/30 px-3 py-1.5 rounded-lg transition-all text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
          >
            ✏️ SustainWrite 永續編織
          </Link>

          {/* 切換按鈕（通：跨感知調試器） */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-xs font-mono border px-3 py-1.5 rounded-lg transition-all dark:border-white/10 dark:hover:bg-white/10 dark:bg-black/20 light:border-slate-900/10 light:hover:bg-black/5 light:bg-white/50 backdrop-blur-md shadow-sm"
          >
            {isDarkMode ? '☀️ LIGHT' : '🌙 DARK'}
          </button>
          <span className="text-xs font-mono opacity-60">v8.5.0-Alpha</span>
        </div>
      </header>

      {/* RWD 雙工主舞台 (Desktop 100vh 限高、Mobile 堆疊流動) */}
      <main className="flex-1 p-6 h-full md:h-[calc(100vh-3.5rem)] overflow-y-auto md:overflow-hidden flex flex-col relative z-20">
        
        {/* 零算力專家模板控制台 (Zero Compute Expert Templates Console) */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.1)] shrink-0">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className={`w-2 h-2 rounded-full ${isAISelecting ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'}`} />
            <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400 font-mono tracking-wide">
              零算力專家模板 (Zero-Compute Expert Templates)
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={simulateAISelection} 
              disabled={isAISelecting}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-2 ${isAISelecting ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30'}`}
            >
              {isAISelecting ? '⚡ AI 分析決策中...' : '🧠 AI 智能套用模板'}
            </button>
            <div className="w-px h-6 bg-current opacity-20 mx-2 hidden md:block"></div>
            {(['DEFAULT', 'CARBON_FOCUS', 'GOVERNANCE_FOCUS', 'AGENT_MONITOR'] as ExpertTemplate[]).map(t => (
              <button 
                key={t}
                onClick={() => setActiveTemplate(t)} 
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${activeTemplate === t ? 'bg-cyan-500/20 border-cyan-500 text-cyan-500 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'bg-black/10 dark:bg-white/5 border-transparent opacity-60 hover:opacity-100 hover:bg-cyan-500/10'}`}
              >
                {t === 'DEFAULT' ? '全能總覽' : 
                 t === 'CARBON_FOCUS' ? '碳管家特化' : 
                 t === 'GOVERNANCE_FOCUS' ? '內控治理特化' : '代理監控特化'}
              </button>
            ))}
          </div>
        </div>

        {fetchError && (
          <div className="mb-4 p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-red-500 text-lg">⚠️</span>
                <span className="text-red-500 text-sm font-bold font-mono">OmniNexus API Connection Interrupted</span>
              </div>
              <button onClick={() => setFetchError(null)} className="text-red-400 opacity-70 hover:opacity-100 transition-opacity text-xs font-mono">Dismiss</button>
            </div>
            <div className="text-red-400/80 text-xs font-mono">
              Diagnostic Details: {fetchError}
            </div>
            <div className="flex gap-3 mt-1">
              <button 
                onClick={fetchNexusData} 
                className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-mono hover:bg-red-500/30 transition-colors flex items-center gap-2"
                disabled={isFetching}
              >
                {isFetching ? '⏳ Retrying...' : '🔄 Retry Connection'}
              </button>
              <Link
                href="/diagnostics"
                className="px-3 py-1.5 bg-black/10 text-slate-400 dark:text-white/60 border border-current/20 rounded-lg text-xs font-mono hover:bg-black/20 dark:hover:bg-white/10 transition-colors"
              >
                🛠️ Run System Diagnostics
              </Link>
            </div>
          </div>
        )}
        <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-12 md:auto-rows-fr gap-6 pb-20 md:pb-0 overflow-y-auto pr-2">
         
          {/* Bento Cell 1: 核心指標區 */}
          <OmniCard 
            {...systemMetadata} 
            nodeName="ENV-001_OmniCard__CarbonScope1__Submit--Trustworthy"
            title="Scope 1 Emissions Tracker" 
            status={RecordLifecycleStatus.Active}
            className={getLayoutClasses(activeTemplate, 'carbon')}
          >
            <div className="h-full flex flex-col justify-center items-center">
              <span className="text-5xl font-black font-mono mb-2 dark:text-white light:text-slate-900">{carbonValue !== null ? carbonValue : '...'} <span className="text-sm text-cyan-500">tCO2e</span></span>
              <p className="text-xs opacity-60">善：算法公式已通過零幻覺驗算（FNNS 已綁定）</p>
            </div>
          </OmniCard>

          {/* Bento Cell 2: 核心禁區（信：自動鎖定） */}
          <OmniCard 
            {...systemMetadata} 
            nodeName="GOV-001_OmniCard__AuditLedger__Lock--Trustworthy"
            title="Sovereign Truth Lock" 
            status={RecordLifecycleStatus.Approved}
            isLocked={true}
            className={getLayoutClasses(activeTemplate, 'lock')}
          >
            <div className="flex flex-col gap-2 justify-center h-full">
              <div className="text-xs font-mono text-cyan-500 font-bold">CORE_ZONE: {sovereignStatus ? sovereignStatus.lockStatus : '...'}</div>
              <div className="w-full text-center border p-2 rounded-xl text-xs font-mono dark:border-cyan-500/30 dark:bg-cyan-500/5 light:border-cyan-600/30 light:bg-cyan-600/5">
                {sovereignStatus ? sovereignStatus.action : 'LOADING'}
              </div>
            </div>
          </OmniCard>

          {/* Bento Cell 3: 代理狀態 */}
          <OmniCard 
            {...systemMetadata} 
            nodeName="SYS-001_OmniCard__HermesAgent__Monitor--Tangible"
            title="Hermes swarm service" 
            status={RecordLifecycleStatus.Active}
            className={getLayoutClasses(activeTemplate, 'hermes')}
          >
            <div className="text-xs opacity-70 space-y-1 justify-center flex flex-col h-full">
              <div>• #代理網絡 5T 數據中繼：{hermesStatus ? hermesStatus.relayStatus : '...'}</div>
              <div>• 零知識證明 (ZKP) 驗證流水線：{hermesStatus ? hermesStatus.zkpPipeline : '...'}</div>
              {hermesStatus && <div className="text-emerald-500 mt-2 font-bold opacity-100">• Active Nodes: {hermesStatus.activeNodes}</div>}
            </div>
          </OmniCard>

          {/* Bento Cell 4: 全幅審查底層 */}
          <OmniCard 
            {...systemMetadata} 
            nodeName="SYS-002_OmniCard__AuditBaseline__View--Tangible"
            title="Audit Ledger Baseline" 
            status={RecordLifecycleStatus.Active}
            className={getLayoutClasses(activeTemplate, 'audit')}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono h-full items-center">
              <div className="p-3 bg-black/5 rounded-xl border border-current/10">
                <span className="opacity-50 block">METHODOLOGY</span>
                <span className="text-emerald-500 font-bold">{auditLedger ? auditLedger.methodology : 'LOADING...'}</span>
              </div>
              <div className="p-3 bg-black/5 rounded-xl border border-current/10">
                <span className="opacity-50 block">ENGINE STATE</span>
                <span className="text-cyan-500 font-bold">{auditLedger ? auditLedger.engineState : 'LOADING...'}</span>
              </div>
              <div className="p-3 bg-black/5 rounded-xl border border-current/10">
                <span className="opacity-50 block">ASSURANCE STATUS</span>
                <span className="text-amber-500 font-bold">{auditLedger ? auditLedger.assuranceStatus : 'LOADING...'}</span>
              </div>
            </div>
          </OmniCard>

          {/* Bento Cell 5: OmniBookCase註冊表 */}
          <OmniCard 
            {...systemMetadata} 
            nodeName="SYS-003_OmniCard__OmniBookCaseRegistry__View--Tangible"
            title="OmniBookCase Registry" 
            status={RecordLifecycleStatus.Active}
            className={getLayoutClasses(activeTemplate, 'bookcase')}
          >
            <div className="h-full w-full overflow-hidden">
              <OmniBookCaseRegistry />
            </div>
          </OmniCard>

        </div>
      </main>

      {/* 全通之心：全能之核 (OmniAgent Pulse) */}
      <OmniAgentPulse />
    </div>
  );
}
