'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Database,
  ShieldCheck,
  Activity,
  Server,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Eye,
  Settings,
  FileText,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import Protocol5TStrip from '@/components/omni/Protocol5TStrip';

/* ─── Types ─── */
interface SystemMetric {
  label: string;
  value: string;
  unit?: string;
  trend?: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  resource: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  ip: string;
}

/* ─── Mock Data ─── */
const SYSTEM_METRICS: SystemMetric[] = [
  { label: 'CPU 使用率', value: '23', unit: '%', trend: -5, icon: Server, color: 'text-cyan-600' },
  {
    label: '記憶體',
    value: '4.2',
    unit: 'GB',
    trend: 2,
    icon: HardDrive,
    color: 'text-emerald-600',
  },
  { label: '活躍用戶', value: '1,247', trend: 12, icon: Users, color: 'text-blue-600' },
  { label: 'API 請求/分', value: '342', trend: 8, icon: Activity, color: 'text-violet-600' },
  {
    label: '資料庫大小',
    value: '256',
    unit: 'MB',
    trend: 3,
    icon: Database,
    color: 'text-amber-600',
  },
  { label: '網路延遲', value: '23', unit: 'ms', trend: -8, icon: Wifi, color: 'text-rose-600' },
];

const AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-001',
    action: '用戶登入',
    user: 'admin@esggo.com',
    resource: 'Auth System',
    timestamp: '2026-01-18T10:30:00+08:00',
    status: 'success',
    ip: '192.168.1.100',
  },
  {
    id: 'log-002',
    action: '數據上傳',
    user: 'cso@company.com',
    resource: 'Evidence Vault',
    timestamp: '2026-01-18T10:25:00+08:00',
    status: 'success',
    ip: '10.0.0.55',
  },
  {
    id: 'log-003',
    action: '權限變更',
    user: 'admin@esggo.com',
    resource: 'User Management',
    timestamp: '2026-01-18T10:20:00+08:00',
    status: 'warning',
    ip: '192.168.1.100',
  },
  {
    id: 'log-004',
    action: '報告生成',
    user: 'advisor@consult.com',
    resource: 'Report Engine',
    timestamp: '2026-01-18T10:15:00+08:00',
    status: 'success',
    ip: '172.16.0.22',
  },
  {
    id: 'log-005',
    action: '登入失敗',
    user: 'unknown@hack.com',
    resource: 'Auth System',
    timestamp: '2026-01-18T10:10:00+08:00',
    status: 'error',
    ip: '45.33.32.156',
  },
];

const FIVE_T_STATUS: [boolean, boolean, boolean, boolean, boolean] = [
  true,
  true,
  true,
  false,
  true,
];

/* ─── Components ─── */

function MetricCard({ metric, index }: { metric: SystemMetric; index: number }) {
  const Icon = metric.icon;
  const isPositive = metric.trend && metric.trend > 0;
  const isNegative = metric.trend && metric.trend < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={cn('p-2 rounded-lg bg-slate-50')}>
          <Icon size={16} className={metric.color} />
        </div>
        {metric.trend !== undefined && (
          <span
            className={cn(
              'text-[10px] font-bold flex items-center gap-0.5',
              isPositive ? 'text-emerald-600' : isNegative ? 'text-rose-600' : 'text-slate-400'
            )}
          >
            {isPositive ? '↑' : isNegative ? '↓' : '—'} {Math.abs(metric.trend)}%
          </span>
        )}
      </div>
      <p className="text-xl font-black text-[#003262]">
        {metric.value}
        {metric.unit && <span className="text-sm text-slate-400 ml-1">{metric.unit}</span>}
      </p>
      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{metric.label}</p>
    </motion.div>
  );
}

function AuditLogRow({ entry }: { entry: AuditLogEntry }) {
  const statusConfig = {
    success: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', label: '成功' },
    warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', label: '警告' },
    error: { icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50', label: '錯誤' },
  };
  const sc = statusConfig[entry.status];
  const StatusIcon = sc.icon;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', sc.bg)}>
        <StatusIcon size={14} className={sc.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#003262]">{entry.action}</span>
          <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded', sc.bg, sc.color)}>
            {sc.label}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5 truncate">
          {entry.user} · {entry.resource}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[10px] text-slate-400 font-mono">{entry.ip}</p>
        <p className="text-[9px] text-slate-300">
          {new Date(entry.timestamp).toLocaleTimeString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function AdminBackendPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'audit' | 'system'>('overview');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Settings size={24} className="text-slate-600" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">管理後台</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Admin Backend · 系統監控與管理
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <OmniBadge variant="success" size="sm" icon={<CheckCircle2 size={10} />}>
                系統正常
              </OmniBadge>
              <OmniBadge variant="primary" size="sm" icon={<ShieldCheck size={10} />}>
                5T 驗證
              </OmniBadge>
            </div>
          </div>
        </header>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'overview' as const, label: '系統概覽', icon: LayoutDashboard },
            { id: 'users' as const, label: '用戶管理', icon: Users },
            { id: 'audit' as const, label: '審計日誌', icon: FileText },
            { id: 'system' as const, label: '系統設定', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all',
                activeTab === tab.id
                  ? 'bg-[#003262] text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Content ─── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* System Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {SYSTEM_METRICS.map((metric, i) => (
                <MetricCard key={metric.label} metric={metric} index={i} />
              ))}
            </div>

            {/* 5T Protocol Status + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <OmniBaseCard className="p-5">
                  <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-cyan-500" />
                    5T 協議狀態
                  </h3>
                  <Protocol5TStrip status={FIVE_T_STATUS} showLabels size="lg" />
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {(['T1', 'T2', 'T3', 'T4', 'T5'] as const).map((code, i) => {
                      const passed = FIVE_T_STATUS[i];
                      return (
                        <div
                          key={code}
                          className={cn(
                            'text-center py-2 rounded-lg text-xs font-bold',
                            passed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          )}
                        >
                          {passed ? '✓' : '⚠'} {code}
                        </div>
                      );
                    })}
                  </div>
                </OmniBaseCard>
              </div>

              <OmniBaseCard className="p-5">
                <h3 className="text-base font-bold text-[#003262] mb-4">快速操作</h3>
                <div className="space-y-2">
                  {[
                    { label: '數據備份', icon: Download, color: 'text-blue-600' },
                    { label: '系統更新', icon: RefreshCw, color: 'text-emerald-600' },
                    { label: '清理快取', icon: Trash2, color: 'text-amber-600' },
                    { label: '安全掃描', icon: Lock, color: 'text-violet-600' },
                    { label: '上傳憑證', icon: Upload, color: 'text-cyan-600' },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-slate-50 transition-colors"
                    >
                      <action.icon size={14} className={action.color} />
                      <span className="text-xs font-medium text-slate-600">{action.label}</span>
                    </button>
                  ))}
                </div>
              </OmniBaseCard>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <OmniBaseCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#003262]">用戶管理</h3>
              <button className="px-3 py-1.5 bg-[#003262] text-white text-xs font-bold rounded-lg">
                新增用戶
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['用戶', '角色', '組織', '狀態', '最後登入', '操作'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    {
                      name: 'Admin',
                      role: '系統管理員',
                      org: 'ESGGO',
                      status: 'active',
                      lastLogin: '10 分鐘前',
                    },
                    {
                      name: 'CSO User',
                      role: '永續長',
                      org: 'Company A',
                      status: 'active',
                      lastLogin: '1 小時前',
                    },
                    {
                      name: 'Advisor',
                      role: '顧問',
                      org: 'Consulting',
                      status: 'active',
                      lastLogin: '3 小時前',
                    },
                    {
                      name: 'Analyst',
                      role: '分析師',
                      org: 'Investment',
                      status: 'idle',
                      lastLogin: '2 天前',
                    },
                  ].map((user) => (
                    <tr key={user.name} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-sm font-medium text-[#003262]">{user.name}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{user.role}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{user.org}</td>
                      <td className="px-4 py-3">
                        <OmniBadge
                          variant={user.status === 'active' ? 'success' : 'warning'}
                          size="xs"
                        >
                          {user.status === 'active' ? '活躍' : '閒置'}
                        </OmniBadge>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">{user.lastLogin}</td>
                      <td className="px-4 py-3">
                        <button className="text-xs text-cyan-600 hover:text-cyan-800 font-medium">
                          編輯
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </OmniBaseCard>
        )}

        {activeTab === 'audit' && (
          <OmniBaseCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#003262] flex items-center gap-2">
                <FileText size={16} className="text-cyan-500" />
                審計日誌
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="搜尋日誌..."
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                />
                <button className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <Download size={14} className="text-slate-400" />
                </button>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {AUDIT_LOGS.map((entry) => (
                <AuditLogRow key={entry.id} entry={entry} />
              ))}
            </div>
          </OmniBaseCard>
        )}

        {activeTab === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OmniBaseCard className="p-5">
              <h3 className="text-base font-bold text-[#003262] mb-4">系統設定</h3>
              <div className="space-y-4">
                {[
                  { label: '維護模式', enabled: false },
                  { label: '自動備份', enabled: true },
                  { label: 'ZKP 驗證', enabled: true },
                  { label: '區塊鏈錨定', enabled: true },
                  { label: 'AI 合規引擎', enabled: true },
                ].map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{setting.label}</span>
                    <button
                      className={cn(
                        'w-10 h-5 rounded-full transition-colors relative',
                        setting.enabled ? 'bg-emerald-500' : 'bg-slate-200'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                          setting.enabled ? 'left-5' : 'left-0.5'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </OmniBaseCard>

            <OmniBaseCard className="p-5">
              <h3 className="text-base font-bold text-[#003262] mb-4">數據管理</h3>
              <div className="space-y-3">
                {[
                  { label: '數據庫備份', desc: '上次備份: 2 小時前', action: '立即備份' },
                  { label: '快取清理', desc: 'Redis 使用率: 45%', action: '清理快取' },
                  { label: '日誌輪替', desc: '日誌大小: 128 MB', action: '輪替日誌' },
                  { label: '證據庫封存', desc: '待封存: 23 筆', action: '執行封存' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                  >
                    <div>
                      <p className="text-xs font-medium text-[#003262]">{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.desc}</p>
                    </div>
                    <button className="text-[10px] font-bold text-cyan-600 hover:text-cyan-800">
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </OmniBaseCard>
          </div>
        )}
      </div>
    </div>
  );
}
