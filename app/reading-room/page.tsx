// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';
import { Table } from '@/components/ui/v2/Table';
import { ESGSmartQA } from '@/components/ui/ESGSmartQA';
import {
  BookOpen,
  Search,
  Plus,
  ShieldCheck,
  Activity,
  Brain,
  Lock,
  Loader2,
  FileText,
  Database,
} from 'lucide-react';

export default function ReadingRoomPage() {
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sealingId, setSealingId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const loadStats = async (category?: string | null) => {
    try {
      let url = '/api/reading-room/stats?t=' + Date.now();
      if (category) url += `&category=${encodeURIComponent(category)}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setStats(json.stats);
      }
    } catch (e) {
      console.error('Stats fetch error:', e);
    }
  };

  const loadDocs = async (category?: string | null, query?: string) => {
    setLoading(true);
    try {
      let url = '/api/reading-room/documents?t=' + Date.now();
      if (category) url += `&category=${encodeURIComponent(category)}`;
      if (query) url += `&q=${encodeURIComponent(query)}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        const docs = (json.documents || []).map((doc: any) => ({
          id: doc.id,
          date: doc.published_date || doc.created_at?.slice(0, 10),
          doc_title: doc.title,
          status: doc.file_url ? '已索引' : '待處理',
          vectors: 0,
          hash_lock: null,
          source_origin: doc.source || 'System',
          category: doc.category,
          esg_category: doc.esg_category,
          file_url: doc.file_url,
          tags: doc.tags,
          gri_reference: doc.gri_reference,
        }));
        setData(docs);
      } else {
        setData([]);
      }
    } catch (e) {
      console.error('Fetch Error:', e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshAll = async (cat?: string | null, q?: string) => {
    await loadDocs(cat, q);
    await loadStats(cat);
  };

  useEffect(() => {
    refreshAll(activeCategory, searchQuery);
  }, [activeCategory, searchQuery]);

  const handleSeal = async (id: string) => {
    setSealingId(id as any);
    try {
      const response = await fetch('/api/vault/seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evidence: { table: 'reading-room', recordId: id, timestamp: Date.now() },
          type: '5t-seal',
        }),
      });
      const resData = await response.json();
      if (resData.success && resData.hashLock) {
        setData((prev) =>
          prev.map((m) => (m.id === id ? { ...m, hash_lock: resData.hashLock } : m))
        );
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
      } else {
        alert('❌ 驗證失敗 (Verification Failed)：金庫校驗不符，資料可能已受損。');
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
      loadDocs(activeCategory, searchQuery);
    }, 1500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadDocs(activeCategory, searchQuery);
  };

  const handleCategoryChange = (cat: string | null) => {
    setActiveCategory(cat);
    loadDocs(cat, searchQuery);
  };

  const categories = [
    { key: null, label: '全部' },
    { key: 'standard', label: '標準' },
    { key: 'regulation', label: '法規' },
    { key: 'industry-report', label: '年鑑' },
    { key: 'case-study', label: '標竿案例' },
  ];

  function StatCard({
    title,
    value,
    unit,
    icon,
    iconColor,
    formula,
    formulaDetail,
  }: {
    title: string;
    value: any;
    unit: string;
    icon: React.ReactNode;
    iconColor: string;
    formula: string;
    formulaDetail: string;
  }) {
    const [showFormula, setShowFormula] = useState(false);
    return (
      <div
        className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        onMouseEnter={() => setShowFormula(true)}
        onMouseLeave={() => setShowFormula(false)}
      >
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
          <span className={iconColor}>{icon}</span>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-black text-slate-900">{value}</span>
          <span className="text-sm text-slate-500">{unit}</span>
        </div>
        {showFormula && (
          <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-[10px] text-slate-600 leading-relaxed">
            <div className="font-mono font-bold text-slate-800">{formula}</div>
            <div className="mt-1 text-slate-500">{formulaDetail}</div>
          </div>
        )}
      </div>
    );
  }

  const columns = [
    { key: 'date', label: '日期' },
    {
      key: 'doc_title',
      label: '文獻名稱',
      render: (val: any, row: any) => {
        const doc: any = row;
        return (
          <span className="flex items-center gap-2">
            <FileText size={14} className="text-cyan-400" />
            {doc.file_url ? (
              <a
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              >
                {val}
              </a>
            ) : (
              <span>{val}</span>
            )}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: '狀態',
      render: (val: any) => (
        <Badge variant={val === '已索引' ? 'success' : 'warning'} size="sm">
          {val}
        </Badge>
      ),
    },
    {
      key: 'category',
      label: '類別',
      render: (val: any) => <span className="text-xs text-slate-400">{val || '-'}</span>,
    },
    {
      key: 'esg_category',
      label: 'ESG',
      render: (val: any) => <span className="text-xs text-slate-400">{val || '-'}</span>,
    },
    {
      key: 'gri_reference',
      label: 'GRI',
      render: (val: any) => (val ? <code className="text-xs text-amber-400">{val}</code> : null),
    },
    {
      key: 'tags',
      label: '標籤',
      render: (val: any) => {
        if (!val || !Array.isArray(val) || val.length === 0)
          return <span className="text-xs text-slate-500">-</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {val.slice(0, 3).map((tag: string, i: number) => (
              <span key={i} className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: 'source_origin',
      label: '來源 (Source)',
      render: (val: any) =>
        val ? (
          <a
            href={val}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:underline"
          >
            {val.slice(0, 40)}...
          </a>
        ) : null,
    },
    {
      key: 'hash_lock',
      label: '5T Hash Lock',
      render: (val: any) =>
        val ? (
          <Badge variant="success" size="sm" icon={<ShieldCheck size={12} />}>
            {val.substring(0, 8)}...
          </Badge>
        ) : (
          <Badge variant="default" size="sm">
            未封印
          </Badge>
        ),
    },
    {
      key: 'action',
      label: '操作 (Actions)',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          {!row.hash_lock && (
            <button
              onClick={() => handleSeal(row.id)}
              disabled={sealingId === row.id}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {sealingId === row.id ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Lock size={14} />
              )}
              T5 封印
            </button>
          )}
          <button
            onClick={() => (row.hash_lock ? handleVerify(row.id) : undefined)}
            disabled={verifyingId === row.id}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-700 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {verifyingId === row.id ? <Loader2 size={14} className="animate-spin" /> : null}
            {row.hash_lock ? '驗證 5T' : '編輯'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 md:p-8 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Area */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm relative group">
              <div className="absolute inset-0 bg-blue-100 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <BookOpen className="text-blue-600 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Badge variant="primary" size="sm" icon={<Brain size={12} />}>
                  OmniAgent Ready
                </Badge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                  READING-ROOM
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">永續閱覽室</h1>
              <p className="text-slate-500 font-mono text-sm tracking-widest uppercase mt-2">
                SUSTAINABILITY READING ROOM
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              icon={<Search size={16} />}
              onClick={() => document.getElementById('rr-search')?.focus()}
              className="flex-1 md:flex-none"
            >
              檢索
            </Button>
            <Button
              variant="primary"
              icon={<Plus size={16} />}
              onClick={handleAddRecord}
              isLoading={isProcessing}
              className="flex-1 md:flex-none"
            >
              新增紀錄
            </Button>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key ?? 'all'}
                onClick={() => handleCategoryChange(cat.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  activeCategory === cat.key
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <form onSubmit={handleSearch} className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋文獻、來源或標籤..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 w-64"
            />
          </form>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="收錄文獻"
            value={stats?.totalDocs ?? '-'}
            unit="Docs"
            icon={<BookOpen size={18} />}
            iconColor="text-emerald-500"
            formula="總收錄數 = SELECT COUNT(*) FROM reading_room_documents"
            formulaDetail="直接計算資料庫表格中的文件總筆數"
          />
          <StatCard
            title="已索引"
            value={stats?.indexedDocs ?? '-'}
            unit="筆"
            icon={<ShieldCheck size={18} />}
            iconColor="text-cyan-500"
            formula="已索引 = Σ[file_url IS NOT NULL]"
            formulaDetail="逐筆判斷 file_url 是否存在，存在則視為已索引"
          />
          <StatCard
            title="索引率"
            value={stats?.sealRate ?? '-'}
            unit="%"
            icon={<Activity size={18} />}
            iconColor="text-blue-500"
            formula="索引率 = (已索引 / 總收錄數) × 100%"
            formulaDetail="分母為全部文件數，分子為具 file_url 的文件數，四捨五入至小數點 1 位"
          />
          <StatCard
            title="待處理"
            value={stats?.pendingDocs ?? '-'}
            unit="筆"
            icon={<Database size={18} />}
            iconColor="text-amber-500"
            formula="待處理 = 總收錄數 - 已索引"
            formulaDetail="尚未設定 file_url 或 file_url 為空的文件"
          />
        </div>

        {/* Main Workspace Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card
              variant="default"
              title="業務資料視圖"
              subtitle="Data synced with 5T Integrity Protocol"
              className="min-h-[400px]"
            >
              <Table columns={columns} data={data} loading={loading} />
            </Card>
          </div>

          <div className="space-y-6">
            <Card variant="default" title="永續知識大腦" subtitle="ESGSmartQA (RAG Powered)">
              <div className="space-y-4 text-sm text-slate-300">
                <p className="mb-4">
                  您可以直接在下方詢問關於 TCFD、CBAM、或者上傳的 ESG 報告書內容。
                </p>
                {/* 注入真實的 RAG QA 組件 */}
                <ESGSmartQA />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
