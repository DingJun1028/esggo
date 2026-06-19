'use client';

import React, { useState, useEffect } from 'react';

import {
  Fingerprint,
  ShieldAlert,
  Link as LinkIcon,
  Database,
  CheckCircle2,
  History,
  Loader2,
  Search,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';

/* ─── Types ─── */
interface AuditLog {
  id: string;
  action: string;
  entity: string;
  user: string;
  time: string;
  status: 'Trustworthy' | 'Pending' | 'Failed';
  hash: string;
  fullHash: string;
}

/* ─── Mock Data ─── */
const MOCK_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    action: 'Data Seal',
    entity: 'Scope 1 Emissions',
    user: 'OmniCore System',
    time: '2026-01-15T10:30:00+08:00',
    status: 'Trustworthy',
    hash: '0xa1b2c3d4...e5f6',
    fullHash: '0xa1b2c3d4e5f6a1b2c3d4e5f6',
  },
  {
    id: 'log-002',
    action: 'Audit Verify',
    entity: 'Water Usage Report',
    user: 'Auditor A',
    time: '2026-01-15T09:15:00+08:00',
    status: 'Trustworthy',
    hash: '0xf6e5d4c3...b2a1',
    fullHash: '0xf6e5d4c3b2a1f6e5d4c3b2a1',
  },
  {
    id: 'log-003',
    action: 'Hash Lock',
    entity: 'Supply Chain Data',
    user: 'System',
    time: '2026-01-14T16:45:00+08:00',
    status: 'Pending',
    hash: '—',
    fullHash: '',
  },
  {
    id: 'log-004',
    action: 'Integrity Check',
    entity: 'GRI Report 2025',
    user: 'Reviewer B',
    time: '2026-01-14T14:20:00+08:00',
    status: 'Trustworthy',
    hash: '0x12345678...abcd',
    fullHash: '0x1234567890abcdef1234567890',
  },
  {
    id: 'log-005',
    action: 'Data Upload',
    entity: 'Energy Audit Q4',
    user: 'Manager',
    time: '2026-01-13T11:00:00+08:00',
    status: 'Failed',
    hash: '—',
    fullHash: '',
  },
];

const FIVE_T_ITEMS = [
  { key: 'traceable', label: 'Traceable', desc: '可溯源' },
  { key: 'trackable', label: 'Trackable', desc: '可追蹤' },
  { key: 'transparent', label: 'Transparent', desc: '透明' },
  { key: 'tangible', label: 'Tangible', desc: '可量化' },
  { key: 'trustworthy', label: 'Trustworthy', desc: '可信' },
];

/* ─── Helpers ─── */
function getStatusConfig(status: AuditLog['status']) {
  switch (status) {
    case 'Trustworthy':
      return { label: 'Trustworthy', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'Pending':
      return { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'Failed':
      return { label: 'Failed', color: 'bg-rose-50 text-rose-700 border-rose-200' };
  }
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('zh-TW', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function AuditCenterPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogs(MOCK_LOGS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const stats = {
    total: logs.length,
    trustworthy: logs.filter((l) => l.status === 'Trustworthy').length,
    pending: logs.filter((l) => l.status === 'Pending').length,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <Fingerprint size={24} className="text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <OmniBadge variant="primary" size="sm" icon={<ShieldAlert size={10} />}>
                  5T-Verified
                </OmniBadge>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  AUDIT-001
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-[#003262] tracking-tight">
                稽核與信任中心
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Cryptographic Hash Locks & Immutable Ledger
              </p>
            </div>
          </div>
        </header>

        {/* ─── Stats Row ─── */}
        <div className="grid grid-cols-3 gap-4">
          <OmniBaseCard className="p-4 text-center">
            <p className="text-2xl font-black text-[#003262]">{stats.total}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              總稽核數
            </p>
          </OmniBaseCard>
          <OmniBaseCard className="p-4 text-center">
            <p className="text-2xl font-black text-emerald-600">{stats.trustworthy}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              已驗證
            </p>
          </OmniBaseCard>
          <OmniBaseCard className="p-4 text-center">
            <p className="text-2xl font-black text-amber-600">{stats.pending}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              待處理
            </p>
          </OmniBaseCard>
        </div>

        {/* ─── Main Content ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: 5T Protocol Panel */}
          <div className="lg:col-span-1">
            <OmniBaseCard className="p-5 border-indigo-100">
              <h3 className="font-bold text-[#003262] flex items-center gap-2 mb-4">
                <Database size={16} className="text-indigo-500" />
                5T Integrity Protocol
              </h3>
              <ul className="space-y-3">
                {FIVE_T_ITEMS.map((item, i) => (
                  <li key={item.key} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs text-slate-400">({item.desc})</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {i < 4 ? '100%' : 'Locked'}
                    </span>
                  </li>
                ))}
              </ul>
            </OmniBaseCard>
          </div>

          {/* Right: Audit Log Table */}
          <div className="lg:col-span-3">
            <OmniBaseCard padding="none" className="overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-[#003262] flex items-center gap-2">
                  <History size={16} className="text-slate-400" />
                  不可篡改日誌
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  Live DB Sync
                </div>
              </div>

              {loading ? (
                <div className="h-48 flex flex-col items-center justify-center gap-3">
                  <Loader2 size={24} className="text-indigo-500 animate-spin" />
                  <span className="text-sm text-slate-400">載入稽核日誌...</span>
                </div>
              ) : logs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100">
                        {['Timestamp', 'Action', 'Entity', 'Hash Lock', 'Status'].map((h) => (
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
                      {logs.map((log) => {
                        const statusConfig = getStatusConfig(log.status);
                        return (
                          <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 text-xs text-slate-500 font-mono whitespace-nowrap">
                              {formatTime(log.time)}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-[#003262]">
                              {log.action}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-500">{log.entity}</td>
                            <td className="px-4 py-3">
                              {log.hash !== '—' ? (
                                <span
                                  className="inline-flex items-center gap-1 text-xs font-mono text-indigo-600"
                                  title={log.fullHash}
                                >
                                  <LinkIcon size={10} />
                                  {log.hash}
                                </span>
                              ) : (
                                <span className="text-xs text-slate-300">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={cn(
                                  'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                                  statusConfig.color
                                )}
                              >
                                {statusConfig.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <Search size={32} className="mx-auto mb-3 text-slate-200" />
                  <p className="text-sm text-slate-400">目前尚無稽核紀錄</p>
                </div>
              )}
            </OmniBaseCard>
          </div>
        </div>
      </div>
    </div>
  );
}
