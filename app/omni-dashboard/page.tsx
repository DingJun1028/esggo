"use client";

import React, { useState } from 'react';
import { OmniCard } from '@/components/omni/OmniCard';
import OmniBookCaseRegistry from '@/components/omni/OmniBookCaseRegistry';
import { RecordLifecycleStatus, AttentionStatus } from '@/shared-types/status';

export default function OmniAppDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const mockSystemMetadata = {
    uuid: "8077e7d2-fbbb-2026-0606-omnitisth001",
    componentVersion: "8.5.0-Alpha", // 雙引擎版本號契合
    timestamp: Date.now(),
    evidence: {
      source_origin: "臺北市中小企業永續治理實證系統::IoT_Node_Carbon_4",
      timestamp: Date.now(),
      hash: "e837856ecdb57b2cff1c320260604141620173520...",
      flow_path: ["IoT Carbon Node", "Hermes Agent Pipeline", "Zero-Knowledge Proof Guard", "Bento Sovereign Grid"]
    }
  };

  return (
    // 使用 class 注入 dark 或 light 主題控制
    <div className={`min-h-screen flex flex-col select-none antialiased transition-colors duration-300 ${isDarkMode ? 'dark bg-[#020617] text-white' : 'light bg-[#F8FAFC] text-slate-900'}`}>
      
      {/* 頂部固定導航列 */}
      <header className="h-14 border-b px-6 flex items-center justify-between z-30 dark:border-white/5 dark:bg-slate-950/40 backdrop-blur-md light:border-slate-900/5 light:bg-white/40">
        <div className="text-sm font-black bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent tracking-wider">
          臺北市中小企業永續治理實證系統 // ESGGO 雙模工版
        </div>
        <div className="flex items-center gap-4">
          {/* 切換按鈕（通：跨感知調試器） */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-xs font-mono border px-2 py-1 rounded dark:border-white/10 dark:hover:bg-white/5 light:border-slate-900/10 light:hover:bg-black/5"
          >
            {isDarkMode ? '☀️ LIGHT MODE' : '🌙 DARK MODE'}
          </button>
          <span className="text-xs font-mono opacity-60">v8.5.0-Alpha</span>
        </div>
      </header>

      {/* RWD 雙工主舞台 (Desktop 100vh 限高、Mobile 堆疊流動) */}
      <main className="flex-1 p-6 h-full md:h-[calc(100vh-3.5rem)] overflow-y-auto md:overflow-hidden">
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-12 md:grid-rows-10 gap-6">
         
          {/* Bento Cell 1: 核心指標區 */}
          <OmniCard 
            {...mockSystemMetadata} 
            nodeName="ENV-001_OmniCard__CarbonScope1__Submit--Trustworthy"
            title="Scope 1 Emissions Tracker" 
            status={RecordLifecycleStatus.Active}
            className="md:col-span-8 md:row-span-4"
          >
            <div className="h-full flex flex-col justify-center items-center">
              <span className="text-5xl font-black font-mono mb-2 dark:text-white light:text-slate-900">428.15 <span className="text-sm text-cyan-500">tCO2e</span></span>
              <p className="text-xs opacity-60">善：算法公式已通過零幻覺驗算（FNNS 已綁定）</p>
            </div>
          </OmniCard>

          {/* Bento Cell 2: 核心禁區（信：自動鎖定） */}
          <OmniCard 
            {...mockSystemMetadata} 
            nodeName="GOV-001_OmniCard__AuditLedger__Lock--Trustworthy"
            title="Sovereign Truth Lock" 
            status={RecordLifecycleStatus.Approved}
            isLocked={true}
            className="md:col-span-4 md:row-span-2"
          >
            <div className="flex flex-col gap-2 justify-center h-full">
              <div className="text-xs font-mono text-cyan-500 font-bold">CORE_ZONE: HASH_LOCKED</div>
              <div className="w-full text-center border p-2 rounded-xl text-xs font-mono dark:border-cyan-500/30 dark:bg-cyan-500/5 light:border-cyan-600/30 light:bg-cyan-600/5">
                OBJECT.FREEZE()
              </div>
            </div>
          </OmniCard>

          {/* Bento Cell 3: 代理狀態 */}
          <OmniCard 
            {...mockSystemMetadata} 
            nodeName="SYS-001_OmniCard__HermesAgent__Monitor--Tangible"
            title="Hermes swarm service" 
            status={RecordLifecycleStatus.Active}
            className="md:col-span-4 md:row-span-2"
          >
            <div className="text-xs opacity-70 space-y-1 justify-center flex flex-col h-full">
              <div>• #代理網絡 5T 數據中繼：[連線中]</div>
              <div>• 零知識證明 (ZKP) 驗證流水線：[健全]</div>
            </div>
          </OmniCard>

          {/* Bento Cell 4: 全幅審查底層 */}
          <OmniCard 
            {...mockSystemMetadata} 
            nodeName="SYS-002_OmniCard__AuditBaseline__View--Tangible"
            title="Audit Ledger Baseline" 
            status={RecordLifecycleStatus.Active}
            className="md:col-span-12 md:row-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono h-full items-center">
              <div className="p-3 bg-black/5 rounded-xl border border-current/10">
                <span className="opacity-50 block">METHODOLOGY</span>
                <span className="text-emerald-500 font-bold">[GRI 2021 FRAMEWORK]</span>
              </div>
              <div className="p-3 bg-black/5 rounded-xl border border-current/10">
                <span className="opacity-50 block">ENGINE STATE</span>
                <span className="text-cyan-500 font-bold">#原罪煉金_熵減寶石_v8.5</span>
              </div>
              <div className="p-3 bg-black/5 rounded-xl border border-current/10">
                <span className="opacity-50 block">ASSURANCE STATUS</span>
                <span className="text-amber-500 font-bold">5T ALL COMPLIANT</span>
              </div>
            </div>
          </OmniCard>

          {/* Bento Cell 5: OmniBookCase註冊表 */}
          <OmniCard 
            {...mockSystemMetadata} 
            nodeName="SYS-003_OmniCard__OmniBookCaseRegistry__View--Tangible"
            title="OmniBookCase Registry" 
            status={RecordLifecycleStatus.Active}
            className="md:col-span-12 md:row-span-4"
          >
            <div className="h-full w-full overflow-hidden">
              <OmniBookCaseRegistry />
            </div>
          </OmniCard>

        </div>
      </main>
    </div>
  );
}
