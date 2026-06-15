'use client';

import React, { useState, useEffect } from 'react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import { OmniBaseTable } from '@/components/ui/omni/OmniBaseTable';
import { logUserActivity } from '@/lib/telemetry';
import {
  Globe,
  Search,
  Plus,
  ShieldCheck,
  Activity,
  Brain,
  Lock,
  Loader2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  FileText,
  Sparkles,
  X,
} from 'lucide-react';

export default function IntelligencePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sealingId, setSealingId] = useState<number | null>(null);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  // New Daily Report States
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/metrics/intelligence', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setData(json.data || []);
      } else {
        // Fallback mock data for Intelligence Center
        setData([
          {
            id: 1,
            date: '2026-06-15',
            trend_title: '歐盟碳邊境調整機制 (CBAM) 申報期程異動',
            impact: 'High',
            sentiment: 'Negative',
            hash_lock: '0x8f2fa882ca3a21',
            source_origin: 'EU Commission',
          },
          {
            id: 2,
            date: '2026-06-14',
            trend_title: '台積電承諾加速 RE100 目標達成',
            impact: 'Medium',
            sentiment: 'Positive',
            hash_lock: null,
            source_origin: 'Reuters',
          },
          {
            id: 3,
            date: '2026-06-12',
            trend_title: '綠色融資審查標準升級，防範漂綠風險',
            impact: 'High',
            sentiment: 'Neutral',
            hash_lock: '0x1ca8ffd92b9d4f',
            source_origin: 'Bloomberg ESG',
          },
        ]);
      }
    } catch (e) {
      console.error('Fetch Error:', e);
      setData([
        {
          id: 1,
          date: '2026-06-15',
          trend_title: '歐盟碳邊境調整機制 (CBAM) 申報期程異動',
          impact: 'High',
          sentiment: 'Negative',
          hash_lock: '0x8f2fa882ca3a21',
          source_origin: 'EU Commission',
        },
        {
          id: 2,
          date: '2026-06-14',
          trend_title: '台積電承諾加速 RE100 目標達成',
          impact: 'Medium',
          sentiment: 'Positive',
          hash_lock: null,
          source_origin: 'Reuters',
        },
        {
          id: 3,
          date: '2026-06-12',
          trend_title: '綠色融資審查標準升級，防範漂綠風險',
          impact: 'High',
          sentiment: 'Neutral',
          hash_lock: '0x1ca8ffd92b9d4f',
          source_origin: 'Bloomberg ESG',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSeal = async (id: number) => {
    setSealingId(id);
    try {
      const response = await fetch('/api/vault/seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evidence: { table: 'intelligence', recordId: id, timestamp: Date.now() },
          type: '5t-seal',
        }),
      });
      const resData = await response.json();
      if (resData.success && resData.hashLock) {
        setData((prev) =>
          prev.map((m) => (m.id === id ? { ...m, hash_lock: resData.hashLock } : m))
        );
        logUserActivity('intelligence_record_seal', { recordId: id, hashLock: resData.hashLock });
      } else {
        alert('封印失敗 (Seal Failed): ' + (resData.error || 'Unknown Error'));
      }
    } catch (error) {
      console.error('Seal exception:', error);
      alert('無法連線至封印金庫 (Vault Connection Error)。');
    } finally {
      setSealingId(null);
    }
  };

  const handleVerify = async (id: number) => {
    setVerifyingId(id);
    try {
      const response = await fetch('/api/vault/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId: id, type: '5t-seal' }),
      });
      const resData = await response.json();
      if (resData.success && resData.valid) {
        alert('✅ 驗證成功 (Verification Success)：資料未遭篡改，符合 5T 誠信協議。');
        logUserActivity('intelligence_record_verify_success', { recordId: id });
      } else {
        alert('❌ 驗證失敗 (Verification Failed)：金庫校驗不符，資料可能已受損。');
        logUserActivity('intelligence_record_verify_failed', { recordId: id });
      }
    } catch (e) {
      console.error('Verify exception:', e);
      alert('連線金庫時發生錯誤 (Vault Connection Error)。');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleAddRecord = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      logUserActivity('intelligence_record_add_simulation');
      fetchData(); // re-fetch after add
    }, 1500);
  };

  // Generate Daily Sustainability Observer Report
  const handleGenerateDailyReport = async () => {
    setIsGeneratingReport(true);
    setGeneratedReport('');
    logUserActivity('intelligence_daily_report_start', { newsCount: data.length });

    // Format all today's intelligence items as clean text context
    const newsContext = data
      .map(
        (item, idx) =>
          `${idx + 1}. [${item.date}] ${item.trend_title} (來源: ${item.source_origin}, 衝擊: ${
            item.impact
          })`
      )
      .join('\n');

    try {
      const res = await fetch('/api/ai/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: 'default',
          chapterName: 'Daily Sustainability Observer Report',
          content: '',
          prompt: `你是一個資深、專業的 ESG 永續觀察家。請根據以下今日收集到的最新 ESG 產業與法規情報動態：\n\n${newsContext}\n\n撰寫一份專業、深入、條理清晰的《當日永續觀察者日報 (Daily Sustainability Observer Report)》。報告結構應包含：\n1. 今日情資摘要（以宏觀角度總結今日動態）\n2. 核心趨勢深度剖析（針對重要法規或事件如 CBAM 申報，進行對企業供應鏈的衝擊分析與因應建議）\n3. 專家合規決策指南（提供具體、可落地的行動建議，符合 GRI 準則導向）。\n\n直接輸出報告內容（使用專業、正式的繁體中文，格式採用美觀、乾淨的 HTML 標籤如 <h2>, <p>, <ul>, <li> 等，不需任何多餘的引言或客套話）。`,
          targetWordCount: 450,
        }),
      });

      if (!res.ok) throw new Error('Daily Report generation failed');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Failed to get stream reader');

      const decoder = new TextDecoder();
      let reportText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        reportText += chunk;
        setGeneratedReport(reportText); // Stream typed output live for effect!
      }
      logUserActivity('intelligence_daily_report_complete', { newsCount: data.length });
    } catch (err) {
      console.error('Report generation failed:', err);
      setGeneratedReport(
        '<p className="text-red-500 font-bold">⚠️ 報告生成失敗，請確認 AI 模組狀態或重試。</p>'
      );
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!generatedReport) return;
    // Strip HTML tags for clean clipboard text
    const cleanText = generatedReport.replace(/<[^>]*>/g, '');
    navigator.clipboard.writeText(cleanText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      logUserActivity('intelligence_copy_report');
    });
  };

  const columns = [
    { key: 'date', label: '發布日期' },
    {
      key: 'trend_title',
      label: '情報標題 (Intelligence Title)',
      render: (val: any) => <span className="font-semibold text-slate-800">{val}</span>,
    },
    {
      key: 'impact',
      label: '衝擊程度',
      render: (val: any) => (
        <OmniBadge
          variant={val === 'High' ? 'error' : val === 'Medium' ? 'warning' : 'primary'}
          size="sm"
        >
          {val} Impact
        </OmniBadge>
      ),
    },
    {
      key: 'sentiment',
      label: '市場情緒',
      render: (val: any) => (
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
            val === 'Positive'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : val === 'Negative'
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
        >
          {val}
        </span>
      ),
    },
    { key: 'source_origin', label: '來源 (Source)' },
    {
      key: 'hash_lock',
      label: '5T Hash Lock',
      render: (val: any) =>
        val ? (
          <OmniBadge variant="success" size="sm" icon={<ShieldCheck size={11} />}>
            {val.substring(0, 8)}...
          </OmniBadge>
        ) : (
          <OmniBadge variant="default" size="sm">
            未封印
          </OmniBadge>
        ),
    },
    {
      key: 'action',
      label: '操作 (Actions)',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          {!row.hash_lock ? (
            <button
              onClick={() => handleSeal(row.id)}
              disabled={sealingId === row.id}
              className="flex items-center gap-1 text-cyan-600 hover:text-cyan-800 text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {sealingId === row.id ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Lock size={12} />
              )}
              T5 封印
            </button>
          ) : (
            <button
              onClick={() => handleVerify(row.id)}
              disabled={verifyingId === row.id}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {verifyingId === row.id ? <Loader2 size={12} className="animate-spin" /> : null}
              驗證 5T
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 md:p-8 selection:bg-cyan-500/30 transition-colors duration-normal">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Area */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-200/80">
          <div className="flex items-center gap-4">
            <div
              onClick={() => {
                if (generatedReport) {
                  setGeneratedReport(null);
                  logUserActivity('intelligence_toggle_report_via_logo_close');
                } else if (data.length > 0) {
                  handleGenerateDailyReport();
                }
              }}
              className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-sm relative cursor-pointer hover:bg-cyan-500/20 active:scale-95 transition-all"
              title="點擊切換生成或關閉今日永續觀察者日報"
            >
              <Globe className="text-cyan-600" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <OmniBadge variant="primary" size="sm" icon={<Brain size={12} />}>
                  OmniAgent Ready
                </OmniBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">
                  INTELLIGENCE
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">ESG 商情中心</h1>
              <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
                GLOBAL INTELLIGENCE & TRENDS
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
            <OmniButton
              variant="primary"
              icon={<Brain size={16} />}
              onClick={handleGenerateDailyReport}
              isLoading={isGeneratingReport}
              disabled={data.length === 0 || isGeneratingReport}
              className="flex-1 md:flex-none bg-[#63a6b0] hover:bg-[#528d96] text-white border-none shadow-sm flex items-center gap-2 rounded-xl h-10 px-4 transition-all"
            >
              生成今日日報
            </OmniButton>
            <OmniButton
              variant="outline"
              icon={<Plus size={16} />}
              onClick={handleAddRecord}
              isLoading={isProcessing}
              className="flex-1 md:flex-none bg-white hover:bg-slate-50 text-slate-700 border-slate-200 rounded-xl h-10 px-4 transition-all shadow-sm flex items-center gap-2"
            >
              新增紀錄
            </OmniButton>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-6 space-y-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-widest">本日追蹤情報</span>
              <TrendingUp size={18} className="text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              42<span className="text-sm text-slate-400 ml-2 font-normal">News</span>
            </div>
            <p className="text-[10px] text-emerald-600 font-mono font-bold">+12 since yesterday</p>
          </div>

          <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-6 space-y-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-widest">5T 驗證率</span>
              <ShieldCheck size={18} className="text-cyan-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              98.5<span className="text-sm text-slate-400 ml-2 font-normal">%</span>
            </div>
            <p className="text-[10px] text-cyan-600 font-mono font-bold">Secured by Vault</p>
          </div>

          <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-6 space-y-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-widest">高風險預警</span>
              <AlertTriangle size={18} className="text-rose-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              3<span className="text-sm text-slate-400 ml-2 font-normal">Alerts</span>
            </div>
            <p className="text-[10px] text-rose-600 font-mono font-bold">Needs Attention</p>
          </div>
        </div>

        {/* Live Typewritten Daily Report Card (日報看板) */}
        {generatedReport !== null && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <OmniBaseCard
              variant="default"
              className="bg-white border border-slate-200/80 rounded-2xl shadow-md p-6 space-y-4 relative overflow-hidden"
            >
              {/* Gloss highlight */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 via-[#63a6b0] to-blue-500" />

              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 rounded-lg text-cyan-600">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      當日永續觀察者日報{' '}
                      <Sparkles className="text-yellow-500 animate-pulse" size={16} />
                    </h2>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Generated Live by OmniAgent G4 • {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyToClipboard}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Clipboard size={13} /> {isCopied ? '已複製' : '複製純文字'}
                  </button>
                  <button
                    onClick={() => setGeneratedReport(null)}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shadow-sm"
                    title="收合日報"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Styled Generated Report Body */}
              <div className="prose max-w-none text-slate-700 leading-relaxed text-sm space-y-4">
                {isGeneratingReport && !generatedReport && (
                  <div className="flex items-center gap-2 text-cyan-600 font-mono font-bold animate-pulse py-4">
                    <Loader2 size={16} className="animate-spin" /> AI
                    正在解析今日情報並撰寫日報中...
                  </div>
                )}
                {generatedReport && (
                  <div
                    className="animate-in fade-in duration-300 font-normal leading-relaxed text-slate-700"
                    dangerouslySetInnerHTML={{ __html: generatedReport }}
                  />
                )}
                {isGeneratingReport && generatedReport && (
                  <span className="inline-block w-1.5 h-4 bg-cyan-500 animate-pulse ml-0.5" />
                )}
              </div>
            </OmniBaseCard>
          </div>
        )}

        {/* Main Workspace Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">外部情報觀測視圖</h3>
                <p className="text-xs text-slate-400 mt-1">
                  今日已完成 5T 協議雜湊校驗。點擊操作進行區塊封印與誠信驗證。
                </p>
              </div>
              <OmniBaseTable columns={columns} data={data} loading={loading} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-slate-800 font-bold text-sm flex items-center gap-2 mb-3">
                <Brain className="text-cyan-600" size={16} />
                OmniAgent 趨勢分析
              </h3>
              <div className="space-y-4 text-xs text-slate-500 leading-relaxed">
                <p>商情中心代理 (Intelligence Agent) 已為您整理最新的全球永續發展動態。</p>
                <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl">
                  <h4 className="font-bold text-cyan-700 text-xs mb-2">
                    本週洞察 (Weekly Insight)
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    近期歐盟 CBAM
                    申報規則變動對亞太區供應鏈造成顯著影響，建議企業應盡速完成第三範疇碳盤查作業以應對即將到來的稽核。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
