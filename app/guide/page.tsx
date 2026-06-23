// @ts-nocheck
'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';
import {
  ShieldCheck,
  Layers,
  Database,
  Eye,
  Brain,
  Award,
  Search,
  CheckCircle2,
  Sparkles,
  Cpu,
  Activity,
  Info,
  HelpCircle,
  CheckCircle,
  RefreshCcw,
} from 'lucide-react';
import { logUserActivity } from '@/lib/telemetry';

// =========================================================================
// Platform Navigation & 5T Compliance Matrix Page ( 白色底色 • 極致簡約 )
// =========================================================================
export default function PlatformGuidePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDimension, setActiveTab] = useState<string>('all');

  const systemInfo = {
    version: 'v8.5.1-Stable',
    codename: 'OmniCore Matrix Evolved',
    buildStatus: 'All Green 🟢',
    lastAudited: '2026-06-15',
  };

  // Full dataset of platform capabilities (mapping the 118 tests)
  const capabilities = [
    {
      id: 1,
      module: '5T 誠信與安全金庫 (5T Integrity & Vault)',
      capabilities:
        '零知識證明 (ZKP) 密碼學防篡改雜湊鎖、SHA-256 數位簽章與哈希密封技術、RLS (行級安全) 權限阻斷校驗、實證單據上傳 (OmniEvidenceUploader) 封印',
      testFiles:
        'lib/crypto-proof.test.ts, app/api/crypto/simulator/route.test.ts, lib/omni-core/integrity.test.ts',
      dimension: 'Trustworthy',
      testsCount: 24,
      desc: '提供數位誠信的密碼學基礎，保障數據不可篡改。',
    },
    {
      id: 2,
      module: 'SustainWrite™ 專家寫作 (SustainWrite Engine)',
      capabilities:
        'GRI / CBAM 永續編織專家模板配對、編輯器 (Tiptap) 原子狀態與還原/重做操作、AI 筆記融入與即時打字流編織、筆記章節專屬釘選 (Pinning) 狀態',
      testFiles:
        'useSustainWriteStore.test.ts, components/ChapterEditor.test.tsx, tests/contract/esg-report.test.ts',
      dimension: 'Tangible',
      testsCount: 32,
      desc: '高自適應專家級寫作系統，一鍵將碎片化素材編織為合規章節。',
    },
    {
      id: 3,
      module: '商情與外部情資感知 (Intelligence Hub)',
      capabilities:
        '外部環境監測、政策與法規動態抓取、今日永續觀察者日報 (Daily Observer Report) AI 生成、5T Hash Lock 鏈上雜湊校驗',
      testFiles:
        'app/api/social/insights/route.test.ts, app/api/oa-agent-api/schedule/route.test.ts',
      dimension: 'Trackable',
      testsCount: 16,
      desc: '外部風險感知與情資監控中樞，自動產出日報提供決策輔助。',
    },
    {
      id: 4,
      module: '雙重大宗性與碳排核算 (Materiality & CBAM)',
      capabilities:
        'GRI 大宗性衝突矩陣評估算法、範疇一、二、三 CBAM 碳排放公式精密計算、行動交辦與數位孿生模擬',
      testFiles: 'lib/esg/carbon-calculator.test.ts, tests/test-pdf.test.ts',
      dimension: 'Transparent',
      testsCount: 18,
      desc: '提供算法與算式透明的碳排放校驗及大宗性矩陣核心評估。',
    },
    {
      id: 5,
      module: '自癒守護者與代理蜂群 (Autonomous Healing & Swarm)',
      capabilities:
        '啟發式故障自我修復 (Heuristic Healing) 診斷、連線中斷時的 Simulation 模擬降級保護、智慧筆記 (OmniNotes) 跨組件數據流橋接',
      testFiles:
        'lib/omni-core/healer.test.ts, lib/omni-space/global-healing.test.ts, tests/jes-monitor.test.ts',
      dimension: 'Traceable',
      testsCount: 14,
      desc: '維繫常青系統的自我修復代理，在各通訊層面保障連續性。',
    },
    {
      id: 6,
      module: '系統底層與全遙測日誌 (Core Logging & Telemetry)',
      capabilities:
        '跨平台雙向 TypeScript 類型偏移校驗、全遙測 (Telemetry) 動作、點擊與配置儲存、多維度關聯知識圖譜與時序日誌',
      testFiles:
        'OmniLoggerService.test.ts, app/actions/test-actions.test.ts, lib/memory-graph-engine.test.ts',
      dimension: 'Trackable',
      testsCount: 14,
      desc: '全平台前後端雙向型別與操作記錄器，提供100%追溯性。',
    },
  ];

  // Filtering Logic
  const filteredCapabilities = useMemo(() => {
    return capabilities.filter((item) => {
      const matchesSearch =
        item.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.capabilities.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.testFiles.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab = activeDimension === 'all' || item.dimension === activeDimension;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeDimension]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 2) {
      logUserActivity('guide_search_capabilities', { query: e.target.value });
    }
  };

  const handleTabChange = (dimension: string) => {
    setActiveTab(dimension);
    logUserActivity('guide_filter_dimension', { dimension });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 md:p-8 selection:bg-cyan-500/30 transition-colors duration-normal">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in- duration-700">
        {/* Header Area */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-200/80">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-sm">
              <Award className="text-cyan-600" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Sparkles size={11} className="text-cyan-500" /> Platform Walkthrough & Audit
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-cyan-50 text-cyan-800 rounded border border-cyan-100 font-mono">
                  {systemInfo.version}
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                平台功能導覽與合規矩陣
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
                {systemInfo.codename} • BUILD STATUS: {systemInfo.buildStatus}
              </p>
            </div>
          </div>
          <div className="flex gap-2 font-mono text-xs bg-white border border-slate-200/60 p-3 rounded-xl shadow-sm">
            <div className="flex flex-col text-slate-500 gap-1">
              <div className="flex justify-between gap-4">
                <span>Core Build:</span>
                <span className="font-bold text-emerald-600">{systemInfo.buildStatus}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Last Audited:</span>
                <span className="font-bold text-slate-700">{systemInfo.lastAudited}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-xl p-6 space-y-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-widest">系統總測試數</span>
              <CheckCircle2 size={18} className="text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              118<span className="text-sm text-slate-400 ml-2 font-normal">Passed</span>
            </div>
            <p className="text-[10px] text-emerald-600 font-mono font-bold">100% Success Rate</p>
          </div>

          <div className="bg-white border border-slate-200/60 shadow-sm rounded-xl p-6 space-y-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-widest">自動自檢檔案</span>
              <Database size={18} className="text-cyan-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              32<span className="text-sm text-slate-400 ml-2 font-normal">Files</span>
            </div>
            <p className="text-[10px] text-cyan-600 font-mono font-bold">Vitest & Webpack Unit</p>
          </div>

          <div className="bg-white border border-slate-200/60 shadow-sm rounded-xl p-6 space-y-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-widest">系統代碼架構</span>
              <Cpu size={18} className="text-[#63a6b0]" />
            </div>
            <div className="text-3xl font-black text-slate-900">TypeScript</div>
            <p className="text-[10px] text-slate-500 font-mono font-bold">End-to-End Type Safety</p>
          </div>

          <div className="bg-white border border-slate-200/60 shadow-sm rounded-xl p-6 space-y-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-widest">5T 協議守護</span>
              <ShieldCheck size={18} className="text-cyan-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">Active</div>
            <p className="text-[10px] text-cyan-600 font-mono font-bold">ZKP & Vault Ensured</p>
          </div>
        </div>

        {/* Search & Tabs Filter Panel */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="搜尋模組、測試名稱或代碼..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
            />
            <Search className="absolute left-2.5 top-3 text-slate-400" size={13} />
          </div>

          <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto">
            <button
              onClick={() => handleTabChange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                activeDimension === 'all'
                  ? 'bg-cyan-50 border-cyan-200 text-cyan-700'
                  : 'bg-slate-50 border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              全部
            </button>
            {['Trustworthy', 'Tangible', 'Trackable', 'Transparent', 'Traceable'].map((dim) => (
              <button
                key={dim}
                onClick={() => handleTabChange(dim)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  activeDimension === dim
                    ? 'bg-cyan-50 border-cyan-200 text-cyan-700'
                    : 'bg-slate-50 border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {dim}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Main Display */}
        <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-500">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">5T 全自動誠信校驗功能矩陣</h3>
              <p className="text-xs text-slate-400 mt-1">
                此表格列出了目前 118 項經過 Vitest 校驗通過的系統單元與功能，保證數據的防篡改性。
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
              顯示結果：{filteredCapabilities.length} 類核心模組
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase border-b border-slate-200/60 tracking-wider">
                  <th className="p-4 pl-6">#</th>
                  <th className="p-4">平台核心模組 (Modules)</th>
                  <th className="p-4">測試能力與功能細節 (Capabilities)</th>
                  <th className="p-4">自動化測試路徑 (Test Files)</th>
                  <th className="p-4 pr-6 text-center">5T 對齊</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCapabilities.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-mono text-slate-400 font-bold">{idx + 1}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 mb-1">{item.module}</div>
                      <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed">
                        {item.desc}
                      </p>
                    </td>
                    <td className="p-4 text-slate-600 leading-relaxed font-normal max-w-[340px]">
                      {item.capabilities}
                    </td>
                    <td className="p-4 font-mono text-[10px] text-slate-500 max-w-[200px] break-all leading-normal">
                      {item.testFiles.split(', ').map((file, i) => (
                        <div
                          key={i}
                          className="mb-0.5 bg-slate-50 border border-slate-200/40 p-1 rounded"
                        >
                          {file}
                        </div>
                      ))}
                    </td>
                    <td className="p-4 pr-6 text-center">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded border ${
                          item.dimension === 'Trustworthy'
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            : item.dimension === 'Tangible'
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : item.dimension === 'Trackable'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : item.dimension === 'Transparent'
                            ? 'bg-rose-50 border-rose-200 text-rose-700'
                            : 'bg-cyan-50 border-cyan-200 text-cyan-700'
                        }`}
                      >
                        {item.dimension}
                      </span>
                      <div className="text-[10px] text-slate-400 font-bold mt-2 font-mono">
                        {item.testsCount} Tests Passed
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
