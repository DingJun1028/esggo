// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import {
  Leaf, Droplets, Zap, ShieldAlert, BarChart3, Fingerprint,
  FileText, Bell, Search, Settings, RefreshCw, Loader2,
  Lock as LockIcon, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';
import { SectionHeader } from '@/components/ui/v2/Input';
import Protocol5TStrip from '@/components/omni/Protocol5TStrip';
import OmniAgentIntegrations from '@/components/omni/OmniAgentIntegrations';

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
  accent?: 'emerald' | 'cyan' | 'rose' | 'amber';
}

/* ─── Mock Data ─── */
const KPI_CARDS: KpiCardData[] = [
  { id: 'scope1', title: 'Scope 1 直接排放', value: '450.2', unit: 'tCO₂e', icon: Leaf, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50', trend: -3.2, fiveTStatus: [true, true, true, true, true], accent: 'emerald' },
  { id: 'water', title: '水資源使用量', value: '8,205', unit: 'm³', icon: Droplets, iconColor: 'text-cyan-600', iconBg: 'bg-cyan-50', trend: 1.5, fiveTStatus: [true, true, true, true, false], accent: 'cyan' },
  { id: 'energy', title: '能源消耗', value: '12.5M', unit: 'kWh', icon: Zap, iconColor: 'text-rose-600', iconBg: 'bg-rose-50', trend: -8.1, fiveTStatus: [true, true, true, false, false], accent: 'rose' },
  { id: 'supply', title: '供應鏈合規', value: '94.8', unit: '%', icon: ShieldAlert, iconColor: 'text-amber-600', iconBg: 'bg-amber-50', trend: 2.3, fiveTStatus: [true, true, true, true, true], accent: 'amber' },
];

const INITIAL_TABLE_DATA: OmniTableDataRow[] = [
  { id: 'esg-001', source_origin: 'ERP_System_A', zkp_sealed: true, status: 'Verified', content: 'Scope 1 Direct Emissions', value: '450.2 tCO2e', hash: '0xabc123...890def' },
  { id: 'esg-002', source_origin: 'Supplier_API_Node', zkp_sealed: false, status: 'Pending', content: 'Scope 3 Purchased Goods', value: '1,205.8 tCO2e', hash: '' },
  { id: 'esg-003', source_origin: 'Legacy_CSV_Upload', zkp_sealed: false, status: 'Void', content: 'Unverified Water Usage', value: '890 m³', hash: '' },
  { id: 'esg-004', source_origin: 'Smart_Grid_API', zkp_sealed: true, status: 'Verified', content: 'ISO 50001 Energy Audit', value: '98.5%', hash: '0x789xyz...456abc' },
];

const QUICK_ACTIONS = [
  { icon: BarChart3, label: 'Analytics' },
  { icon: Fingerprint, label: 'Audit Trail' },
  { icon: FileText, label: 'GRI Reports' },
  { icon: Bell, label: 'Alerts' },
  { icon: Search, label: 'Data Mining' },
  { icon: Settings, label: 'Config' },
];

const STATUS_VARIANT = { Verified: 'success', Pending: 'warning', Void: 'neutral' };

export default function DashboardPage() {
  const [data, setData] = useState<OmniTableDataRow[]>(INITIAL_TABLE_DATA);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) { const d = await res.json(); setUser(d.user); }
      } catch (e) {
        console.error('Failed to fetch user', e);
      } finally { setLoading(false); }
    }
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    window.location.href = '/auth/login';
  };

  const handleSeal = async (id: string) => {
    await new Promise(r => setTimeout(r, 800));
    setData(prev => prev.map(row =>
      row.id === id ? { ...row, zkp_sealed: true, status: 'Verified', hash: '0x' + Math.random().toString(16).substring(2, 10) + '...sealed' } : row
    ));
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* ─── Header ─── */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-600 tracking-wider uppercase">OmniSync Active</span>
            </div>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
              {user?.name ? `歡迎回來，${user.name}` : '全域數據金庫'}
            </h1>
            <p className="text-sm text-neutral-400 mt-1">OmniCore Data Routing & 5T Integrity Audit Workflow</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="success" size="md">ZKP 封裝率 99.9%</Badge>
            <Button variant="ghost" size="sm" icon={<RefreshCw size={14} />}>同步</Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>登出</Button>
          </div>
        </header>

        {/* ─── KPI Cards ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_CARDS.map((kpi) => (
            <Card key={kpi.id} variant="default" padding="md" hover>
              <div className="flex justify-between items-start mb-3">
                <div className={cn('p-2 rounded-lg', kpi.iconBg)}>
                  <kpi.icon size={18} className={kpi.iconColor} />
                </div>
                {kpi.trend !== undefined && (
                  <Badge variant={kpi.trend >= 0 ? 'success' : 'error'} size="sm">
                    {kpi.trend >= 0 ? '↑' : '↓'} {Math.abs(kpi.trend)}%
                  </Badge>
                )}
              </div>
              <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-1">{kpi.title}</p>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-2xl font-black text-neutral-900">{kpi.value}</span>
                <span className="text-sm text-neutral-400">{kpi.unit}</span>
              </div>
              <Protocol5TStrip status={kpi.fiveTStatus} />
            </Card>
          ))}
        </div>

        {/* ─── Quick Actions ─── */}
        <div>
          <SectionHeader title="快速操作" />
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Card key={action.label} variant="outlined" padding="sm" hover className="text-center cursor-pointer">
                <action.icon size={18} className="text-neutral-400 mx-auto mb-1.5" />
                <span className="text-[10px] font-semibold text-neutral-600">{action.label}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* ─── OmniAgent Integrations ─── */}
        <OmniAgentIntegrations />

        {/* ─── Data Ledger Table ─── */}
        <div>
          <SectionHeader
            title="資料溯源帳本"
            subtitle={`${data.length} records`}
            action={
              <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                Live Sync
              </div>
            }
          />

          <Card variant="default" padding="none">
            {loading ? (
              <div className="h-48 flex flex-col items-center justify-center gap-3">
                <Loader2 size={24} className="text-cyan-500 animate-spin" />
                <span className="text-sm text-neutral-400">Synchronizing OmniMemorySync...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100">
                      {['Content', 'Value', 'Source', 'Status', '5T Seal', 'Action'].map((h) => (
                        <th key={h} className="px-4 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {data.map((row) => (
                      <tr key={row.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-neutral-900">{row.content}</td>
                        <td className="px-4 py-3 text-sm text-neutral-600 font-mono">{row.value}</td>
                        <td className="px-4 py-3 text-xs text-neutral-400">{row.source_origin}</td>
                        <td className="px-4 py-3">
                          <Badge variant={STATUS_VARIANT[row.status]} size="sm">{row.status}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          {row.zkp_sealed ? (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                              <LockIcon size={12} />
                              <span className="font-mono">{row.hash.substring(0, 10)}...</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-neutral-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {!row.zkp_sealed && (
                            <button onClick={() => handleSeal(row.id)} className="text-xs font-bold text-cyan-600 hover:text-cyan-800 transition-colors">
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
          </Card>
        </div>
      </div>
    </div>
  );
}
