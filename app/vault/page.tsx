'use client';

import React, { useState, useEffect } from 'react';

import {
  FileText,
  Lock,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';

/* ─── Types ─── */
interface VaultRecord {
  id: string;
  fileName: string;
  category: string;
  status: 'verified' | 'pending' | 'rejected';
  hash: string;
  fiveTStatus: [boolean, boolean, boolean, boolean, boolean];
  createdAt: string;
  author: string;
  size: string;
}

/* ─── Mock Data ─── */
const MOCK_RECORDS: VaultRecord[] = [
  {
    id: 'v-001',
    fileName: '碳盤查報告_2025.pdf',
    category: '環境',
    status: 'verified',
    hash: '0xa1b2c3d4e5f6a1b2',
    fiveTStatus: [true, true, true, true, true],
    createdAt: '2025-12-15',
    author: 'ESG System',
    size: '2.4 MB',
  },
  {
    id: 'v-002',
    fileName: '2025永續報告書.docx',
    category: '報告',
    status: 'pending',
    hash: '',
    fiveTStatus: [true, true, true, false, false],
    createdAt: '2025-12-20',
    author: 'Reviewer A',
    size: '5.1 MB',
  },
  {
    id: 'v-003',
    fileName: '供應鏈數據_Q4.xlsx',
    category: '供應鏈',
    status: 'verified',
    hash: '0xf6e5d4c3b2a1f6e5',
    fiveTStatus: [true, true, true, true, true],
    createdAt: '2025-12-22',
    author: 'Auditor',
    size: '1.8 MB',
  },
  {
    id: 'v-004',
    fileName: '社會影響評估.pdf',
    category: '社會',
    status: 'rejected',
    hash: '',
    fiveTStatus: [true, false, false, false, false],
    createdAt: '2026-01-02',
    author: 'Manager',
    size: '3.2 MB',
  },
  {
    id: 'v-005',
    fileName: '能源審計報告.pdf',
    category: '環境',
    status: 'verified',
    hash: '0x1234567890abcdef',
    fiveTStatus: [true, true, true, true, true],
    createdAt: '2026-01-05',
    author: 'Energy Team',
    size: '4.0 MB',
  },
  {
    id: 'v-006',
    fileName: '治理架構說明.pdf',
    category: '治理',
    status: 'pending',
    hash: '',
    fiveTStatus: [true, true, false, false, false],
    createdAt: '2026-01-08',
    author: 'Compliance',
    size: '1.1 MB',
  },
];

const CATEGORIES = ['全部', '環境', '社會', '治理', '供應鏈', '報告'];

/* ─── Helpers ─── */
function getStatusConfig(status: VaultRecord['status']) {
  switch (status) {
    case 'verified':
      return {
        label: '已驗證',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: CheckCircle2,
      };
    case 'pending':
      return { label: '審核中', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock };
    case 'rejected':
      return {
        label: '已退回',
        color: 'bg-rose-50 text-rose-700 border-rose-200',
        icon: AlertCircle,
      };
  }
}

export default function VaultPage() {
  const [records, setRecords] = useState<VaultRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<VaultRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRecords(MOCK_RECORDS);
      setFilteredRecords(MOCK_RECORDS);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = records;
    if (selectedCategory !== '全部') {
      result = result.filter((r) => r.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) => r.fileName.toLowerCase().includes(q) || r.author.toLowerCase().includes(q)
      );
    }
    setFilteredRecords(result);
  }, [records, searchQuery, selectedCategory]);

  const stats = {
    total: records.length,
    verified: records.filter((r) => r.status === 'verified').length,
    pending: records.filter((r) => r.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#003262] tracking-tight">
              證據保管庫
            </h1>
            <p className="text-sm text-slate-400 mt-1">加密文件、佐證鎖檔、永久封存</p>
          </div>
          <OmniButton variant="primary" size="md" icon={<FileText size={16} />}>
            上傳檔案
          </OmniButton>
        </header>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <OmniBaseCard className="p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#003262]">{stats.total}</p>
              <p className="text-xs text-slate-400 font-medium">總檔案數</p>
            </div>
          </OmniBaseCard>
          <OmniBaseCard className="p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <CheckCircle2 size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#003262]">{stats.verified}</p>
              <p className="text-xs text-slate-400 font-medium">已驗證</p>
            </div>
          </OmniBaseCard>
          <OmniBaseCard className="p-5 flex items-center gap-4">
            <div className="p-3 bg-cyan-50 rounded-xl">
              <ShieldCheck size={20} className="text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#003262]">AES-256</p>
              <p className="text-xs text-slate-400 font-medium">加密等級</p>
            </div>
          </OmniBaseCard>
        </div>

        {/* ─── Search & Filter ─── */}
        <OmniBaseCard padding="md">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋檔案名稱或作者..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-300 transition-all"
              />
            </div>
            {/* Category filter - desktop */}
            <div className="hidden md:flex items-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                    selectedCategory === cat
                      ? 'bg-[#003262] text-white'
                      : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Category filter - mobile dropdown */}
            <div className="md:hidden">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </OmniBaseCard>

        {/* ─── File List ─── */}
        {/* Desktop: Table */}
        <div className="hidden md:block">
          <OmniBaseCard padding="none" className="overflow-hidden">
            {loading ? (
              <div className="h-48 flex items-center justify-center text-sm text-slate-400">
                載入中...
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    {['檔案名稱', '分類', '狀態', '5T 協議', '作者', '日期', '操作'].map((h) => (
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
                  {filteredRecords.map((record) => {
                    const statusConfig = getStatusConfig(record.status);
                    const StatusIcon = statusConfig.icon;
                    return (
                      <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FileText size={14} className="text-slate-400 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-[#003262]">
                                {record.fileName}
                              </p>
                              <p className="text-[10px] text-slate-400">{record.size}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <OmniBadge variant="secondary" size="sm">
                            {record.category}
                          </OmniBadge>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border',
                              statusConfig.color
                            )}
                          >
                            <StatusIcon size={10} />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {record.fiveTStatus.map((s, i) => (
                              <div
                                key={i}
                                className={cn(
                                  'w-2 h-3 rounded-sm',
                                  s ? 'bg-cyan-400' : 'bg-slate-200'
                                )}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">{record.author}</td>
                        <td className="px-4 py-3 text-xs text-slate-400">{record.createdAt}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 text-slate-400 hover:text-cyan-600 transition-colors rounded-lg hover:bg-cyan-50">
                              <Download size={14} />
                            </button>
                            {record.hash && (
                              <button className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50">
                                <Lock size={14} />
                              </button>
                            )}
                            <button className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <Search size={32} className="mx-auto mb-3 text-slate-200" />
                        <p className="text-sm text-slate-400">找不到符合條件的檔案</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </OmniBaseCard>
        </div>

        {/* Mobile: Card list */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="h-32 flex items-center justify-center text-sm text-slate-400">
              載入中...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="py-12 text-center">
              <Search size={32} className="mx-auto mb-3 text-slate-200" />
              <p className="text-sm text-slate-400">找不到符合條件的檔案</p>
            </div>
          ) : (
            filteredRecords.map((record) => {
              const statusConfig = getStatusConfig(record.status);
              const StatusIcon = statusConfig.icon;
              return (
                <div
                  key={record.id}
                  layout
                  className="bg-white rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={16} className="text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#003262] truncate">
                          {record.fileName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {record.size} · {record.author}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0',
                        statusConfig.color
                      )}
                    >
                      <StatusIcon size={10} />
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <OmniBadge variant="secondary" size="xs">
                        {record.category}
                      </OmniBadge>
                      <div className="flex gap-0.5">
                        {record.fiveTStatus.map((s, i) => (
                          <div
                            key={i}
                            className={cn(
                              'w-1.5 h-2.5 rounded-sm',
                              s ? 'bg-cyan-400' : 'bg-slate-200'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">{record.createdAt}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
