'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
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
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';

/* ─── Types ─── */
interface IntelligenceRecord {
  id: number;
  date: string;
  trend_title: string;
  impact: 'High' | 'Medium' | 'Low';
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  hash_lock: string | null;
  source_origin: string;
}

type ReportState = { loading: boolean; content: string; visible: boolean };

/* ─── Mock Data ─── */
const MOCK_DATA: IntelligenceRecord[] = [
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
  {
    id: 4,
    date: '2026-06-10',
    trend_title: 'ISO 14064-3:2024 新版盤查標準發布',
    impact: 'Medium',
    sentiment: 'Positive',
    hash_lock: '0xabcd1234ef5678',
    source_origin: 'ISO.org',
  },
  {
    id: 5,
    date: '2026-06-08',
    trend_title: '永續金融評鑑指標調整，強化公司治理',
    impact: 'High',
    sentiment: 'Neutral',
    hash_lock: null,
    source_origin: 'FSC Taiwan',
  },
];

/* ─── Helpers ─── */
function getImpactConfig(impact: IntelligenceRecord['impact']) {
  switch (impact) {
    case 'High':
      return { label: 'High Impact', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    case 'Medium':
      return { label: 'Medium Impact', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'Low':
      return { label: 'Low Impact', color: 'bg-slate-50 text-slate-600 border-slate-200' };
  }
}

function getSentimentConfig(sentiment: IntelligenceRecord['sentiment']) {
  switch (sentiment) {
    case 'Positive':
      return { label: 'Positive', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' };
    case 'Negative':
      return { label: 'Negative', color: 'bg-rose-50 border-rose-200 text-rose-700' };
    case 'Neutral':
      return { label: 'Neutral', color: 'bg-slate-50 border-slate-200 text-slate-600' };
  }
}

export default function IntelligencePage() {
  const [data, setData] = useState<IntelligenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sealingId, setSealingId] = useState<number | null>(null);
  const [report, setReport] = useState<ReportState>({
    loading: false,
    content: '',
    visible: false,
  });
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_DATA);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleAddRecord = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      fetchData();
    }, 1000);
  };

  function fetchData() {
    setData(MOCK_DATA);
  }

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
      }
    } catch {
      // silent
    } finally {
      setSealingId(null);
    }
  };

  const handleGenerateReport = async () => {
    setReport({ loading: true, content: '', visible: true });
    try {
      const res = await fetch('/api/ai/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: 'default',
          chapterName: 'Daily Sustainability Observer Report',
          content: '',
          prompt: `你是一個資深的 ESG 永續觀察家。根據以下 ESG 產業情報，撰寫一份專業的《當日永續觀察者日報》。結構包含：1.今日情資摘要 2.核心趨勢深度剖析 3.專家合規決策指南。使用 HTML 標籤排版。\n\n${data
            .map(
              (item, i) =>
                `${i + 1}. [${item.date}] ${item.trend_title} (來源: ${item.source_origin})`
            )
            .join('\n')}`,
          targetWordCount: 450,
        }),
      });
      if (!res.ok) throw new Error('Report generation failed');
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');
      const decoder = new TextDecoder();
      let text = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value);
        setReport((prev) => ({ ...prev, content: text }));
      }
    } catch {
      setReport((prev) => ({
        ...prev,
        content: '<p class="text-rose-500">報告生成失敗，請重試。</p>',
      }));
    } finally {
      setReport((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleCopyReport = () => {
    const cleanText = report.content.replace(/<[^>]*>/g, '');
    navigator.clipboard.writeText(cleanText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const stats = {
    total: data.length,
    verified: data.filter((d) => d.hash_lock).length,
    highImpact: data.filter((d) => d.impact === 'High').length,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-100">
              <Globe size={24} className="text-cyan-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <OmniBadge variant="primary" size="sm" icon={<Brain size={10} />}>
                  OmniAgent Ready
                </OmniBadge>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  INTELLIGENCE
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-[#003262] tracking-tight">
                ESG 商情中心
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                GLOBAL INTELLIGENCE & TRENDS
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <OmniButton
              variant="primary"
              size="md"
              icon={<Brain size={14} />}
              onClick={handleGenerateReport}
              isLoading={report.loading}
              disabled={data.length === 0 || report.loading}
              className="bg-[#003262] hover:bg-[#002244] text-white flex-1 md:flex-none"
            >
              生成今日日報
            </OmniButton>
            <OmniButton
              variant="outline"
              size="md"
              icon={<Plus size={14} />}
              onClick={handleAddRecord}
              isLoading={isProcessing}
              className="flex-1 md:flex-none"
            >
              新增紀錄
            </OmniButton>
          </div>
        </header>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <OmniBaseCard className="p-5 flex items-center gap-4">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <TrendingUp size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#003262]">{stats.total}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                本日追蹤情報
              </p>
            </div>
          </OmniBaseCard>
          <OmniBaseCard className="p-5 flex items-center gap-4">
            <div className="p-2.5 bg-cyan-50 rounded-xl">
              <ShieldCheck size={18} className="text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#003262]">
                98.5<span className="text-sm text-slate-400">%</span>
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                5T 驗證率
              </p>
            </div>
          </OmniBaseCard>
          <OmniBaseCard className="p-5 flex items-center gap-4">
            <div className="p-2.5 bg-rose-50 rounded-xl">
              <AlertTriangle size={18} className="text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#003262]">{stats.highImpact}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                高風險預警
              </p>
            </div>
          </OmniBaseCard>
        </div>

        {/* ─── Report Card ─── */}
        {report.visible && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <OmniBaseCard className="border-cyan-100 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 rounded-lg">
                    <FileText size={18} className="text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#003262] flex items-center gap-2">
                      當日永續觀測日報
                      <Sparkles size={14} className="text-amber-500" />
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Generated by OmniAgent · {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReport}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1"
                  >
                    <Clipboard size={10} /> {isCopied ? '已複製' : '複製'}
                  </button>
                  <button
                    onClick={() => setReport({ loading: false, content: '', visible: false })}
                    className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </div>
              <div className="p-5">
                {report.loading && !report.content && (
                  <div className="flex items-center gap-2 text-cyan-600 font-mono text-sm animate-pulse">
                    <Loader2 size={14} className="animate-spin" /> AI 正在撰寫日報...
                  </div>
                )}
                {report.content && (
                  <div
                    className="prose prose-sm max-w-none text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: report.content }}
                  />
                )}
                {report.loading && report.content && (
                  <span className="inline-block w-1 h-4 bg-cyan-500 animate-pulse ml-0.5" />
                )}
              </div>
            </OmniBaseCard>
          </motion.div>
        )}

        {/* ─── Intelligence Table ─── */}
        <OmniBaseCard padding="none" className="overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-base font-bold text-[#003262]">外部情報觀測視圖</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              今日已完成 5T 協議雜湊校驗。點擊操作進行區塊封印與誠信驗證。
            </p>
          </div>

          {/* Desktop table */}
          {loading ? (
            <div className="h-40 flex items-center justify-center text-sm text-slate-400">
              載入中...
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      {['日期', '情報標題', '衝擊', '情緒', '來源', '5T Hash', '操作'].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.map((row) => {
                      const impact = getImpactConfig(row.impact);
                      const sentiment = getSentimentConfig(row.sentiment);
                      return (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 text-xs text-slate-500 font-mono whitespace-nowrap">
                            {row.date}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-[#003262] max-w-xs truncate">
                            {row.trend_title}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                                impact.color
                              )}
                            >
                              {impact.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                                sentiment.color
                              )}
                            >
                              {sentiment.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">{row.source_origin}</td>
                          <td className="px-4 py-3">
                            {row.hash_lock ? (
                              <OmniBadge
                                variant="success"
                                size="sm"
                                icon={<ShieldCheck size={10} />}
                              >
                                {row.hash_lock.substring(0, 8)}...
                              </OmniBadge>
                            ) : (
                              <OmniBadge variant="default" size="sm">
                                未封印
                              </OmniBadge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {!row.hash_lock ? (
                              <button
                                onClick={() => handleSeal(row.id)}
                                disabled={sealingId === row.id}
                                className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 hover:text-cyan-800 disabled:opacity-50 transition-colors"
                              >
                                {sealingId === row.id ? (
                                  <Loader2 size={10} className="animate-spin" />
                                ) : (
                                  <Lock size={10} />
                                )}
                                封印
                              </button>
                            ) : (
                              <CheckCircle2 size={14} className="text-emerald-500" />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-slate-50">
                {data.map((row) => {
                  const impact = getImpactConfig(row.impact);
                  const sentiment = getSentimentConfig(row.sentiment);
                  return (
                    <div key={row.id} className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-medium text-[#003262] leading-snug">
                          {row.trend_title}
                        </p>
                        <span
                          className={cn(
                            'text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0',
                            sentiment.color
                          )}
                        >
                          {sentiment.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                            impact.color
                          )}
                        >
                          {impact.label}
                        </span>
                        <span className="text-[10px] text-slate-400">{row.source_origin}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{row.date}</span>
                        {row.hash_lock && <ShieldCheck size={12} className="text-emerald-500" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </OmniBaseCard>
      </div>
    </div>
  );
}
