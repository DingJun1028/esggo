// @ts-nocheck
'use client';

import React, { useState } from 'react';

import {
  LucideIcon,
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
  Key,
  UserPlus,
  Edit3,
  MoreHorizontal,
  Search,
  Filter,
  ChevronDown,
  X,
  Copy,
  Zap,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/v2/Card';
import { Badge } from '@/components/ui/v2/Input';
import Protocol5TStrip from '@/components/omni/Protocol5TStrip';
import { Button } from '@/components/ui/v2/Button';

/* ─── Types ─── */
interface SystemMetric {
  label: string;
  value: string;
  unit?: string;
  trend?: number;
  icon: LucideIcon;
  color: string;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  org: string;
  status: 'active' | 'idle' | 'suspended';
  lastLogin: string;
  permissions: string[];
  createdAt: string;
}

interface RolePermission {
  id: string;
  name: string;
  description: string;
  permissions: { module: string; read: boolean; write: boolean; delete: boolean; admin: boolean }[];
  userCount: number;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed: string;
  status: 'active' | 'revoked';
  createdAt: string;
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

const USERS: UserRecord[] = [
  {
    id: 'u-001',
    name: 'Admin',
    email: 'admin@esggo.com',
    role: '超級管理員',
    org: 'ESGGO',
    status: 'active',
    lastLogin: '10 分鐘前',
    permissions: ['*'],
    createdAt: '2025-01-01',
  },
  {
    id: 'u-002',
    name: '林永續',
    email: 'cso@company.com',
    role: '永續長',
    org: 'Company A',
    status: 'active',
    lastLogin: '1 小時前',
    permissions: ['dashboard', 'vault', 'reports', 'audit'],
    createdAt: '2025-06-15',
  },
  {
    id: 'u-003',
    name: '王顧問',
    email: 'advisor@consult.com',
    role: '顧問',
    org: 'Consulting',
    status: 'active',
    lastLogin: '3 小時前',
    permissions: ['dashboard', 'reports'],
    createdAt: '2025-07-20',
  },
  {
    id: 'u-004',
    name: '張分析師',
    email: 'analyst@invest.com',
    role: '分析師',
    org: 'Investment',
    status: 'idle',
    lastLogin: '2 天前',
    permissions: ['dashboard'],
    createdAt: '2025-08-10',
  },
  {
    id: 'u-005',
    name: '陳訪客',
    email: 'guest@test.com',
    role: '訪客',
    org: 'Test Org',
    status: 'suspended',
    lastLogin: '30 天前',
    permissions: ['dashboard:read'],
    createdAt: '2025-12-01',
  },
];

const ROLES: RolePermission[] = [
  {
    id: 'role-001',
    name: '超級管理員',
    description: '完整系統存取權限',
    permissions: [{ module: '全部模組', read: true, write: true, delete: true, admin: true }],
    userCount: 1,
  },
  {
    id: 'role-002',
    name: '永續長',
    description: '管理 ESG 數據、報告與稽核',
    permissions: [
      { module: 'Dashboard', read: true, write: true, delete: false, admin: false },
      { module: 'Vault', read: true, write: true, delete: true, admin: false },
      { module: 'Reports', read: true, write: true, delete: true, admin: false },
      { module: 'Audit', read: true, write: true, delete: false, admin: false },
    ],
    userCount: 12,
  },
  {
    id: 'role-003',
    name: '顧問',
    description: '查看數據、生成報告',
    permissions: [
      { module: 'Dashboard', read: true, write: false, delete: false, admin: false },
      { module: 'Reports', read: true, write: true, delete: false, admin: false },
    ],
    userCount: 28,
  },
  {
    id: 'role-004',
    name: '分析師',
    description: '僅查看數據',
    permissions: [{ module: 'Dashboard', read: true, write: false, delete: false, admin: false }],
    userCount: 45,
  },
  {
    id: 'role-005',
    name: '訪客',
    description: '唯讀存取',
    permissions: [{ module: 'Dashboard', read: true, write: false, delete: false, admin: false }],
    userCount: 120,
  },
];

const API_KEYS: APIKey[] = [
  {
    id: 'key-001',
    name: 'Production API',
    key: 'sk_prod_****abc123def456',
    permissions: ['read', 'write'],
    lastUsed: '5 分鐘前',
    status: 'active',
    createdAt: '2025-06-01',
  },
  {
    id: 'key-002',
    name: 'CrewAI Integration',
    key: 'sk_prod_****ghi789jkl012',
    permissions: ['read', 'write', 'webhook'],
    lastUsed: '1 小時前',
    status: 'active',
    createdAt: '2025-07-15',
  },
  {
    id: 'key-003',
    name: 'Read Only',
    key: 'sk_read_****mno345pqr678',
    permissions: ['read'],
    lastUsed: '3 天前',
    status: 'active',
    createdAt: '2025-08-20',
  },
  {
    id: 'key-004',
    name: 'Legacy Key',
    key: 'sk_prod_****stu901vwx234',
    permissions: ['read', 'write'],
    lastUsed: '45 天前',
    status: 'revoked',
    createdAt: '2025-01-15',
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
  return (
    <div
      className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg bg-slate-50">
          <Icon size={16} className={metric.color} />
        </div>
        {metric.trend !== undefined && (
          <span
            className={cn(
              'text-[10px] font-bold flex items-center gap-0.5',
              isPositive ? 'text-emerald-600' : 'text-rose-600'
            )}
          >
            {isPositive ? '↑' : '↓'} {Math.abs(metric.trend)}%
          </span>
        )}
      </div>
      <p className="text-xl font-black text-[#003262]">
        {metric.value}
        {metric.unit && <span className="text-sm text-slate-400 ml-1">{metric.unit}</span>}
      </p>
      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{metric.label}</p>
    </div>
  );
}

function UserRow({ user }: { user: UserRecord }) {
  const statusConfig = {
    active: { label: '活躍', color: 'bg-emerald-50 text-emerald-600' },
    idle: { label: '閒置', color: 'bg-amber-50 text-amber-600' },
    suspended: { label: '停用', color: 'bg-rose-50 text-rose-600' },
  };
  const sc = statusConfig[user.status];

  return (
    <tr className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#003262] flex items-center justify-center text-white text-xs font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-[#003262]">{user.name}</p>
            <p className="text-[10px] text-slate-400">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-slate-600">{user.role}</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-slate-500">{user.org}</span>
      </td>
      <td className="px-4 py-3">
        <Badge
          variant={
            user.status === 'active' ? 'success' : user.status === 'idle' ? 'warning' : 'error'
          }
          size="xs"
        >
          {sc.label}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-slate-400">{user.lastLogin}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-slate-50 rounded transition-colors">
            <Edit3 size={12} className="text-slate-400" />
          </button>
          <button className="p-1 hover:bg-slate-50 rounded transition-colors">
            <Lock size={12} className="text-slate-400" />
          </button>
          <button className="p-1 hover:bg-rose-50 rounded transition-colors">
            <Trash2 size={12} className="text-slate-400 hover:text-rose-500" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function RoleCard({ role }: { role: RolePermission }) {
  return (
    <div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold text-[#003262]">{role.name}</h4>
          <p className="text-[10px] text-slate-400">{role.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">{role.userCount} 用戶</span>
          <button className="p-1 hover:bg-slate-50 rounded transition-colors">
            <MoreHorizontal size={14} className="text-slate-400" />
          </button>
        </div>
      </div>
      <div className="space-y-1.5">
        {role.permissions.map((perm) => (
          <div key={perm.module} className="flex items-center justify-between text-[10px]">
            <span className="text-slate-600">{perm.module}</span>
            <div className="flex items-center gap-1">
              {perm.read && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="讀取" />
              )}
              {perm.write && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" title="寫入" />}
              {perm.delete && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" title="刪除" />
              )}
              {perm.admin && (
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" title="管理" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function APIKeyRow({ apiKey, disabled }: { apiKey: APIKey; disabled?: boolean }) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (disabled) return;
    navigator.clipboard.writeText(apiKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl border p-4 transition-all',
        apiKey.status === 'revoked' ? 'border-rose-200 opacity-60' : 'border-slate-100',
        disabled && 'opacity-70'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Key size={14} className="text-slate-400" />
          <span className="text-sm font-bold text-[#003262]">{apiKey.name}</span>
          <Badge variant={apiKey.status === 'active' ? 'success' : 'error'} size="xs">
            {apiKey.status === 'active' ? '啟用' : '已撤銷'}
          </Badge>
          {disabled && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded">
              暫停
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            disabled={disabled}
            className={cn(
              'p-1 rounded transition-colors',
              disabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-slate-50'
            )}
          >
            {copied ? (
              <CheckCircle2 size={12} className="text-emerald-500" />
            ) : (
              <Copy size={12} className="text-slate-400" />
            )}
          </button>
          <button
            disabled={disabled}
            className={cn(
              'p-1 rounded transition-colors',
              disabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-rose-50'
            )}
          >
            <Trash2 size={12} className={disabled ? 'text-slate-300' : 'text-slate-400 hover:text-rose-500'} />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <code className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded flex-1 truncate">
          {showKey ? apiKey.key : apiKey.key.replace(/(?<=.{8}).(?=.{4})/g, '*')}
        </code>
        <button
          onClick={() => setShowKey(!showKey)}
          className="p-1 hover:bg-slate-50 rounded transition-colors"
        >
          <Eye size={12} className="text-slate-400" />
        </button>
      </div>
      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-1">
          {apiKey.permissions.map((p) => (
            <span key={p} className="px-1.5 py-0.5 bg-slate-50 rounded">
              {p}
            </span>
          ))}
        </div>
        <span>最後使用: {apiKey.lastUsed}</span>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function AdminBackendPage() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'users' | 'roles' | 'api-keys' | 'system'
  >('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = USERS.filter((u) => {
    if (
      searchQuery &&
      !u.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !u.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-100 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Settings size={24} className="text-slate-600" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">管理後台</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Admin Backend · 系統控制 · 權限精細化
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm" icon={<CheckCircle2 size={10} />}>
                系統正常
              </Badge>
              <Badge variant="primary" size="sm" icon={<ShieldCheck size={10} />}>
                5T 驗證
              </Badge>
            </div>
          </div>
        </header>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'overview' as const, label: '系統概覽', icon: LayoutDashboard },
            { id: 'users' as const, label: '用戶管理', icon: Users, count: USERS.length },
            { id: 'roles' as const, label: '角色權限', icon: ShieldCheck, count: ROLES.length },
            { id: 'api-keys' as const, label: 'API 金鑰', icon: Key, count: API_KEYS.length },
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
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center',
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ─── Content ─── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {SYSTEM_METRICS.map((metric, i) => (
                <MetricCard key={metric.label} metric={metric} index={i} />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="p-5">
                  <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-cyan-500" />
                    5T 協議狀態
                  </h3>
                  <Protocol5TStrip status={FIVE_T_STATUS} showLabels size="lg" />
                </Card>
              </div>
              <Card className="p-5">
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
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#003262]">用戶管理</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜尋用戶..."
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<UserPlus size={14} />}
                  className="bg-[#003262] hover:bg-[#002244] text-white"
                >
                  新增用戶
                </Button>
              </div>
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
                <tbody>
                  {filteredUsers.map((user) => (
                    <UserRow key={user.id} user={user} />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'roles' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#003262]">角色與權限</h3>
                <p className="text-xs text-slate-400">管理用戶角色與模組存取權限</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                className="bg-[#003262] hover:bg-[#002244] text-white"
              >
                新增角色
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ROLES.map((role) => (
                <RoleCard key={role.id} role={role} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'api-keys' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#003262]">API 金鑰管理</h3>
                <p className="text-xs text-slate-400">管理 API 金鑰與存取權限</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-200">
                  ⏸ 暫停使用
                </span>
              </div>
            </div>
            {/* 暫停提示 */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-700">金鑰更換功能暫時下架</p>
                  <p className="text-xs text-amber-600 mt-1">
                    金鑰輪轉與更換功能正在維護中。現有金鑰仍可正常使用，但暫停新增、更換與撤銷操作。
                    如有緊急需求，請聯繫系統管理員。
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {API_KEYS.map((apiKey) => (
                <APIKeyRow key={apiKey.id} apiKey={apiKey} disabled />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5">
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
            </Card>
            <Card className="p-5">
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
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
