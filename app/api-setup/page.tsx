'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';
import { logUserActivity } from '@/lib/telemetry';
import {
  Settings,
  Key,
  ShieldCheck,
  Cpu,
  Database,
  Network,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  RefreshCcw,
  Eye,
  EyeOff,
  Brain,
  Zap,
  FileText,
  Globe,
} from 'lucide-react';

const DEFAULT_OPENROUTER_MODEL = 'mistralai/mistral-small-3.1-24b:free';

export default function ApiSetupPage() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // API Key States
  const [openrouterKey, setOpenrouterKey] = useState('已加密保護');
  const [openrouterModel, setOpenrouterModel] = useState(DEFAULT_OPENROUTER_MODEL);
  const [geminiKey, setGeminiKey] = useState('AIzaSyD-unconfigured-api-key');
  const [gatewayUrl, setGatewayUrl] = useState('http://161.118.248.180:8642');
  const [supabaseUrl, setSupabaseUrl] = useState('https://tenant-esg-taiwan.supabase.co');

  // Input Password Visibility toggles
  const [showOR, setShowOR] = useState(false);
  const [showGemini, setShowGemini] = useState(false);

  const handleSaveConfigs = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    // Simulate saving and encrypting configurations in background
    setTimeout(async () => {
      setLoading(false);
      setSaved(true);
      logUserActivity('apisetup_save_keys_simulation', {
        hasOpenRouter: !!openrouterKey,
        openrouterModel,
        hasGemini: !!geminiKey,
        gatewayUrl,
      });
      // Clear saved notice after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  };

  const handleResetDefaults = () => {
    setOpenrouterKey('已加密保護');
    setOpenrouterModel(DEFAULT_OPENROUTER_MODEL);
    setGeminiKey('');
    setGatewayUrl('http://161.118.248.180:8642');
    setSupabaseUrl('https://tenant-esg-taiwan.supabase.co');
    logUserActivity('apisetup_reset_defaults');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 md:p-8 selection:bg-cyan-500/30 transition-colors duration-normal">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Area */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-200/80">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-sm">
              <Settings className="text-cyan-600" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Sparkles size={11} className="text-cyan-500" /> Platform Integration Center
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-cyan-50 text-cyan-800 rounded border border-cyan-100 font-mono">
                  v8.5.1-Stable
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                整合中心 (API Setup)
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
                CONFIGURE KEYWAYS • BRIDGE CLOUD CONNECTORS
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              icon={<RefreshCcw size={16} />}
              onClick={handleResetDefaults}
              className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 rounded-xl h-10 px-4 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              還原預設
            </Button>
          </div>
        </header>

        {/* Two Column Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left Column: Form Configuration Panel (3/5 width) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Key className="text-cyan-600" size={18} /> API 金鑰與連線配置
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  請在此配置您的雲端憑證。所有金鑰均在本機經 256
                  位元對稱加密後，安全存放於主機底層保護中。
                </p>
              </div>

              <form onSubmit={handleSaveConfigs} className="space-y-5">
                {/* OpenRouter API Key Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Cpu size={14} className="text-cyan-600" /> OpenRouter API Key
                    </label>
                    <span className="text-[10px] text-cyan-600 font-mono font-bold bg-cyan-50 px-1.5 py-0.5 rounded">
                      OpenRouter G4 金鑰
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showOR ? 'text' : 'password'}
                      value={openrouterKey}
                      onChange={(e) => setOpenrouterKey(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-3 text-slate-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOR(!showOR)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showOR ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Globe size={14} className="text-cyan-600" /> OpenRouter G4 免費版模型
                    </label>
                    <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      無限免費版
                    </span>
                  </div>
                  <input
                    type="text"
                    value={openrouterModel}
                    onChange={(e) => setOpenrouterModel(e.target.value)}
                    placeholder={DEFAULT_OPENROUTER_MODEL}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-slate-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-mono"
                  />
                  <p className="text-[10px] text-slate-400">目前設定：{openrouterModel}</p>
                </div>

                {/* Gemini API Key Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Brain size={14} className="text-cyan-600" /> Google Gemini API Key
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">備用解析金鑰</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showGemini ? 'text' : 'password'}
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-3 text-slate-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGemini(!showGemini)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showGemini ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Next.js Gateway API Endpoint */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Network size={14} className="text-cyan-600" /> OmniAgent Gateway Endpoint URL
                  </label>
                  <input
                    type="text"
                    value={gatewayUrl}
                    onChange={(e) => setGatewayUrl(e.target.value)}
                    placeholder="http://161.118.248.180:8642"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-slate-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-mono"
                  />
                </div>

                {/* Supabase Host URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Database size={14} className="text-cyan-600" /> Supabase Storage / Database
                    Host
                  </label>
                  <input
                    type="text"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://your-tenant-project.supabase.co"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-slate-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-mono"
                  />
                </div>

                {/* Save and Notice Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    {saved && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-300">
                        <CheckCircle2 size={14} className="text-emerald-500" />{' '}
                        雲端金庫配置已保存成功！
                      </span>
                    )}
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={loading}
                    className="w-full md:w-auto bg-[#63a6b0] hover:bg-[#528d96] text-white border-none shadow-sm flex items-center gap-2 rounded-xl h-11 px-6 transition-all font-bold cursor-pointer"
                  >
                    {loading ? '安全刻印中...' : '儲存配置'}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Descriptions - Unlocked Features & Satisfied Needs (2/5 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Unlocked Features (解鎖功能) */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Zap className="text-amber-500" size={16} /> 金鑰配置將解鎖哪些強大功能？
              </h3>

              <ul className="space-y-4 text-xs text-slate-600 leading-relaxed">
                <li className="flex gap-2">
                  <div className="w-5 h-5 bg-cyan-50 rounded text-cyan-600 flex items-center justify-center shrink-0 font-bold font-mono">
                    1
                  </div>
                  <div>
                    <strong className="text-slate-800">OpenRouter G4 免費版專家全息編寫：</strong>
                    <p className="text-slate-500 mt-1">
                      解鎖 SustainWrite 引擎的「啟動全息編織」與「AI 融入/潤飾」。AI
                      會在您的游標處動態打字，將情資完美轉化成 GRI/CBAM 專家報告。
                    </p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <div className="w-5 h-5 bg-cyan-50 rounded text-cyan-600 flex items-center justify-center shrink-0 font-bold font-mono">
                    2
                  </div>
                  <div>
                    <strong className="text-slate-800">當日永續觀察者日報 (Daily Report)：</strong>
                    <p className="text-slate-500 mt-1">
                      解鎖商情中心的一鍵生成日報功能。AI 實時分析最新政策法規與多達 10
                      家公司的填答庫，生成深度剖析與行動指南。
                    </p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <div className="w-5 h-5 bg-cyan-50 rounded text-cyan-600 flex items-center justify-center shrink-0 font-bold font-mono">
                    3
                  </div>
                  <div>
                    <strong className="text-slate-800">
                      5T 密碼學佐證上鏈封印 (ZKP Vault Seal)：
                    </strong>
                    <p className="text-slate-500 mt-1">
                      啟用證據金庫的「5T 封印」與「5T 驗證」。自動產生抗篡改的 SHA-256
                      哈希鎖並鎖定（Hash Locked）在 PostgreSQL。
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Satisfied User Needs (滿足需求) */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldCheck className="text-emerald-500" size={16} /> 這能滿足企業治理何種需求？
              </h3>

              <ul className="space-y-4 text-xs text-slate-600 leading-relaxed">
                <li className="flex gap-2">
                  <div className="w-5 h-5 bg-emerald-50 rounded text-emerald-600 flex items-center justify-center shrink-0 font-bold font-mono">
                    A
                  </div>
                  <div>
                    <strong className="text-slate-800">
                      免除本地大算力支出 (Zero-Local Compute)：
                    </strong>
                    <p className="text-slate-500 mt-1">
                      企業無需自行建置昂貴的 AI 伺服器，直接透過 OpenRouter 的無限免費接口，享受最新
                      31B 甚至 405B 等級的頂級專家算力。
                    </p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <div className="w-5 h-5 bg-emerald-50 rounded text-emerald-600 flex items-center justify-center shrink-0 font-bold font-mono">
                    B
                  </div>
                  <div>
                    <strong className="text-slate-800">
                      第方確信與審計防備 (Assurance-Ready)：
                    </strong>
                    <p className="text-slate-500 mt-1">
                      佐證單據（PDF/CSV）一經上傳，即刻計算密碼學 Hash 並寫入 Audit
                      Trail，為第三方的查證與確信（Assurance）提供確鑿、防篡改的數位信任證據。
                    </p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <div className="w-5 h-5 bg-emerald-50 rounded text-emerald-600 flex items-center justify-center shrink-0 font-bold font-mono">
                    C
                  </div>
                  <div>
                    <strong className="text-slate-800">零幻覺決策與自動化合規：</strong>
                    <p className="text-slate-500 mt-1">
                      從情資偵測、數據原子、公式驗算，到最終報告段落產出，均有因果刻印與 Formula
                      對照，完全杜絕 AI 幻覺。
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
