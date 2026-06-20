'use client';

import React, { useState, useEffect } from 'react';

import {
  Leaf,
  Droplets,
  Zap,
  ShieldAlert,
  BarChart3,
  FileText,
  Bell,
  Search,
  Settings,
  Fingerprint,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Lock as LockIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import OmniKpiCard from '@/components/omni/OmniKpiCard';
import Protocol5TStrip from '@/components/omni/Protocol5TStrip';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniPremiumCard } from '@/components/ui/omni/OmniPremiumCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';

/* ─── Types ─── */
interface OmniTableDataRow {
  id: string;
  source_origin: string;
  zkp_sealed: boolean;
  status: 'Verified' | 'Pending' | 'Void';
  content: string;
  value: string;
  hash: string;
}

interface KpiCardData {
  id: string;
  title: string;
  value: string;
  unit: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  trend?: number;
  fiveTStatus: [boolean, boolean, boolean, boolean, boolean];
  accentBorder?: 'emerald' | 'cyan' | 'rose' | 'amber';
}

/* ─── Mock Data ─── */
const KPI_CARDS: KpiCardData[] = [
  {
    id: 'scope1',
    title: 'Scope 1 直接排放',
    value: '450.2',
    unit: 'tCO₂e',
    icon: Leaf,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    trend: -3.2,
    fiveTStatus: [true, true, true, true, true],
    accentBorder: 'emerald',
  },
  {
    id: 'water',
    title: '水資源使用量',
    value: '8,205',
    unit: 'm³',
    icon: Droplets,
    iconColor: 'text-cyan-600',
    iconBg: 'bg-cyan-50',
    trend: 1.5,
    fiveTStatus: [true, true, true, true, false],
    accentBorder: 'cyan',
  },
  {
    id: 'energy',
    title: '能源消耗',
    value: '12.5M',
    unit: 'kWh',
    icon: Zap,
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50',
    trend: -8.1,
    fiveTStatus: [true, true, true, false, false],
    accentBorder: 'rose',
  },
  {
    id: 'supply',
    title: '供應鏈合規',
    value: '94.8',
    unit: '%',
    icon: ShieldAlert,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    trend: 2.3,
    fiveTStatus: [true, true, true, true, true],
    accentBorder: 'amber',
  },
];

const INITIAL_TABLE_DATA: OmniTableDataRow[] = [
  {
    id: 'esg-001',
    source_origin: 'ERP_System_A',
    zkp_sealed: true,
    status: 'Verified',
    content: 'Scope 1 Direct Emissions',
    value: '450.2 tCO2e',
    hash: '0xabc123...890def',
  },
  {
    id: 'esg-002',
    source_origin: 'Supplier_API_Node',
    zkp_sealed: false,
    status: 'Pending',
    content: 'Scope 3 Purchased Goods',
    value: '1,205.8 tCO2e',
    hash: '',
  },
  {
    id: 'esg-003',
    source_origin: 'Legacy_CSV_Upload',
    zkp_sealed: false,
    status: 'Void',
    content: 'Unverified Water Usage',
    value: '890 m³',
    hash: '',
  },
  {
    id: 'esg-004',
    source_origin: 'Smart_Grid_API',
    zkp_sealed: true,
    status: 'Verified',
    content: 'ISO 50001 Energy Audit',
    value: '98.5%',
    hash: '0x789xyz...456abc',
  },
];

const QUICK_ACTIONS = [
  {
    icon: BarChart3,
    label: 'Analytics',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
  },
  {
    icon: Fingerprint,
    label: 'Audit Trail',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    icon: FileText,
    label: 'GRI Reports',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
  },
  {
    icon: Bell,
    label: 'Alerts',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
  },
  {
    icon: Search,
    label: 'Data Mining',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    icon: Settings,
    label: 'Config',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-100',
  },
];

/* ─── Helpers ─── */
function getStatusColor(status: OmniTableDataRow['status']): string {
  switch (status) {
    case 'Verified':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Pending':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Void':
      return 'bg-slate-50 text-slate-500 border-slate-200';
  }
}

function getAccentBorderStyle(accent?: string): string {
  switch (accent) {
    case 'emerald':
      return 'border-l-4 border-l-emerald-400';
    case 'cyan':
      return 'border-l-4 border-l-cyan-400';
    case 'rose':
      return 'border-l-4 border-l-rose-400';
    case 'amber':
      return 'border-l-4 border-l-amber-400';
    default:
      return '';
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<OmniTableDataRow[]>(INITIAL_TABLE_DATA);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (e) {
        console.error('Failed to fetch user', e);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    window.location.href = '/auth/login';
  };

  const handleSeal = async (id: string) => {
    await new Promise((r) => setTimeout(r, 800));
    setData((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              zkp_sealed: true,
              status: 'Verified' as const,
              hash: '0x' + Math.random().toString(16).substring(2, 10) + '...sealed',
            }
          : row
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* ─── Header ─── */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">
                OmniSync Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#003262] tracking-tight">
              {user?.name ? `歡迎回來，${user.name}` : '全域數據金庫'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              OmniCore Data Routing & 5T Integrity Audit Workflow
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-500 font-medium">ZKP 封裝率</span>
              <span className="text-base font-bold text-[#003262]">99.9%</span>
            </div>
            <OmniButton variant="outline" size="sm" icon={<RefreshCw size={14} />}>
              同步
            </OmniButton>
            <OmniButton variant="outline" size="sm" onClick={handleSignOut} className="border-rose-200 text-rose-600 hover:bg-rose-50">
              登出
            </OmniButton>
          </div>
        </header>

        {/* ─── KPI Cards ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {KPI_CARDS.map((kpi, i) => (
            <div
              key={kpi.id}
            >
              <OmniPremiumCard
                className={cn(
                  'p-5 flex flex-col',
                  getAccentBorderStyle(kpi.accentBorder)
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={cn('p-2.5 rounded-xl', kpi.iconBg)}>
                    <kpi.icon size={20} className={kpi.iconColor} />
                  </div>
                  {kpi.trend !== undefined && (
                    <span
                      className={cn(
                        'text-xs font-bold px-2 py-0.5 rounded-full',
                        kpi.trend >= 0
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-rose-50 text-rose-600'
                      )}
                    >
                      {kpi.trend >= 0 ? '↑' : '↓'} {Math.abs(kpi.trend)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                  {kpi.title}
                </p>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-2xl font-black text-[#003262]">{kpi.value}</span>
                  <span className="text-sm text-slate-400">{kpi.unit}</span>
                </div>
                <div className="mt-auto pt-2">
                  <Protocol5TStrip status={kpi.fiveTStatus} />
                </div>
              </OmniPremiumCard>
            </div>
          ))}
        </div>

        {/* ─── Quick Actions ─── */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
            快速操作
          </p>
          <div className="w-full overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex gap-3 min-w-max">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  className={cn(
                    'flex flex-col items-center justify-center min-w-[80px] md:min-w-[100px] h-20 md:h-24 rounded-2xl border transition-all duration-200 hover:shadow-md',
                    action.bg,
                    action.border
                  )}
                >
                  <action.icon size={20} className={cn(action.color, 'mb-1.5')} />
                  <span className="text-[10px] md:text-xs font-bold text-slate-600">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Data Ledger Table ─── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-[#003262]">資料溯源帳本</h3>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                Live Sync
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">{data.length} records</span>
          </div>

          <OmniBaseCard padding="none" className="overflow-hidden">
            {loading ? (
              <div className="h-48 flex flex-col items-center justify-center gap-3">
                <Loader2 size={24} className="text-cyan-500 animate-spin" />
                <span className="text-sm text-slate-400">Synchronizing OmniMemorySync...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      {['Content', 'Value', 'Source', 'Status', '5T Seal', 'Action'].map((h) => (
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
                    {data.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#003262]">
                          {row.content}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 font-mono">{row.value}</td>
                        <td className="px-4 py-3 text-xs text-slate-400">{row.source_origin}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                              getStatusColor(row.status)
                            )}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {row.zkp_sealed ? (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                              <LockIcon size={12} />
                              <span className="font-mono">{row.hash.substring(0, 10)}...</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {!row.zkp_sealed && (
                            <button
                              onClick={() => handleSeal(row.id)}
                              className="text-xs font-bold text-cyan-600 hover:text-cyan-800 transition-colors"
                            >
                              Seal
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </OmniBaseCard>
        </div>
      </div>
    </div>
  );
}
