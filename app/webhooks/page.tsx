// @ts-nocheck
'use client';

import React, { useState } from 'react';

import {
  Zap,
  Globe,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Plus,
  Trash2,
  Settings,
  Search,
  Filter,
  Eye,
  Code,
  ShieldCheck,
  TrendingUp,
  Activity,
  ExternalLink,
  Copy,
  ChevronRight,
  ChevronDown,
  X,
  Play,
  Pause,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';

/* ─── Types ─── */
interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'paused' | 'error';
  successRate: number;
  totalDeliveries: number;
  lastDelivery?: string;
  createdAt: string;
  secret: string;
}

interface WebhookLog {
  id: string;
  webhookId: string;
  event: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: number;
  responseCode?: number;
  responseTime?: number;
  payload?: string;
}

/* ─── Mock Data ─── */
const WEBHOOK_ENDPOINTS: WebhookEndpoint[] = [
  {
    id: 'wh-001',
    name: 'CrewAI 代理回調',
    url: 'https://api.crewai.com/webhook/esggo',
    events: ['agent:completed', 'agent:error', 'task:updated'],
    status: 'active',
    successRate: 98.5,
    totalDeliveries: 1247,
    lastDelivery: '2026-01-18T10:30:00+08:00',
    createdAt: '2025-06-15',
    secret: 'whsec_****abc123',
  },
  {
    id: 'wh-002',
    name: 'Slack 通知',
    url: 'https://hooks.slack.com/services/xxx/yyy/zzz',
    events: ['report:completed', 'alert:urgent', 'compliance:failed'],
    status: 'active',
    successRate: 99.2,
    totalDeliveries: 856,
    lastDelivery: '2026-01-18T10:25:00+08:00',
    createdAt: '2025-07-20',
    secret: 'whsec_****def456',
  },
  {
    id: 'wh-003',
    name: 'Make.com 數據同步',
    url: 'https://hook.make.com/abc123def456',
    events: ['data:uploaded', 'vault:sealed', 'report:generated'],
    status: 'active',
    successRate: 95.8,
    totalDeliveries: 2340,
    lastDelivery: '2026-01-18T10:20:00+08:00',
    createdAt: '2025-05-10',
    secret: 'whsec_****ghi789',
  },
  {
    id: 'wh-004',
    name: 'Boost.space 同步',
    url: 'https://hook.boost.space/esggo-webhook',
    events: ['user:created', 'org:updated'],
    status: 'paused',
    successRate: 87.3,
    totalDeliveries: 456,
    lastDelivery: '2026-01-17T14:00:00+08:00',
    createdAt: '2025-08-05',
    secret: 'whsec_****jkl012',
  },
  {
    id: 'wh-005',
    name: 'Flowlu 專案整合',
    url: 'https://api.flowlu.com/webhook/esggo',
    events: ['task:completed', 'project:updated'],
    status: 'error',
    successRate: 72.1,
    totalDeliveries: 234,
    lastDelivery: '2026-01-16T09:00:00+08:00',
    createdAt: '2025-09-12',
    secret: 'whsec_****mno345',
  },
];

const WEBHOOK_LOGS: WebhookLog[] = [
  {
    id: 'log-001',
    webhookId: 'wh-001',
    event: 'agent:completed',
    status: 'success',
    timestamp: Date.now() - 300000,
    responseCode: 200,
    responseTime: 145,
    payload: '{"agent_id":"agent-001","status":"completed","result":"..."}',
  },
  {
    id: 'log-002',
    webhookId: 'wh-002',
    event: 'report:completed',
    status: 'success',
    timestamp: Date.now() - 600000,
    responseCode: 200,
    responseTime: 89,
    payload: '{"report_id":"rep-001","status":"completed"}',
  },
  {
    id: 'log-003',
    webhookId: 'wh-003',
    event: 'data:uploaded',
    status: 'success',
    timestamp: Date.now() - 900000,
    responseCode: 201,
    responseTime: 234,
    payload: '{"data_id":"data-001","size":1024}',
  },
  {
    id: 'log-004',
    webhookId: 'wh-005',
    event: 'task:completed',
    status: 'failed',
    timestamp: Date.now() - 1200000,
    responseCode: 500,
    responseTime: 5000,
    payload: '{"task_id":"task-001"}',
  },
  {
    id: 'log-005',
    webhookId: 'wh-001',
    event: 'task:updated',
    status: 'success',
    timestamp: Date.now() - 1500000,
    responseCode: 200,
    responseTime: 112,
    payload: '{"task_id":"task-002","status":"in_progress"}',
  },
  {
    id: 'log-006',
    webhookId: 'wh-004',
    event: 'user:created',
    status: 'pending',
    timestamp: Date.now() - 1800000,
    payload: '{"user_id":"user-001"}',
  },
];

const EVENT_TYPES = [
  { id: 'agent:completed', label: '代理完成', description: 'AI 代理完成任務時觸發' },
  { id: 'agent:error', label: '代理錯誤', description: 'AI 代理發生錯誤時觸發' },
  { id: 'task:updated', label: '任務更新', description: '任務狀態更新時觸發' },
  { id: 'task:completed', label: '任務完成', description: '任務完成時觸發' },
  { id: 'data:uploaded', label: '數據上傳', description: '新數據上傳時觸發' },
  { id: 'vault:sealed', label: '金庫封印', description: '證據庫封印完成時觸發' },
  { id: 'report:generated', label: '報告生成', description: '報告生成完成時觸發' },
  { id: 'report:completed', label: '報告完成', description: '報告完成審核時觸發' },
  { id: 'alert:urgent', label: '緊急警示', description: '高風險事件觸發時' },
  { id: 'compliance:failed', label: '合規失敗', description: '合規檢查失敗時觸發' },
  { id: 'user:created', label: '用戶建立', description: '新用戶註冊時觸發' },
  { id: 'org:updated', label: '組織更新', description: '組織資訊更新時觸發' },
  { id: 'project:updated', label: '專案更新', description: '專案狀態更新時觸發' },
];

/* ─── Components ─── */

function WebhookCard({
  webhook,
  onToggle,
  onDelete,
}: {
  webhook: WebhookEndpoint;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const statusConfig = {
    active: { label: '啟用中', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
    paused: { label: '已暫停', color: 'bg-amber-50 text-amber-600', icon: Pause },
    error: { label: '錯誤', color: 'bg-rose-50 text-rose-600', icon: AlertTriangle },
  };
  const config = statusConfig[webhook.status];
  const StatusIcon = config.icon;

  return (
    <div
      layout
      className={cn(
        'bg-white rounded-xl border p-4 hover:shadow-md transition-all',
        webhook.status === 'error'
          ? 'border-rose-200'
          : webhook.status === 'paused'
          ? 'border-amber-200'
          : 'border-slate-100'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              webhook.status === 'active'
                ? 'bg-emerald-50'
                : webhook.status === 'paused'
                ? 'bg-amber-50'
                : 'bg-rose-50'
            )}
          >
            <StatusIcon size={18} className={config.color.split(' ')[1]} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#003262]">{webhook.name}</h4>
            <p className="text-[10px] text-slate-400 truncate max-w-xs">{webhook.url}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {webhook.status === 'active' ? (
              <Pause size={14} className="text-slate-400" />
            ) : (
              <Play size={14} className="text-emerald-500" />
            )}
          </button>
          <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
            <Settings size={14} className="text-slate-400" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 size={14} className="text-slate-400 hover:text-rose-500" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 bg-slate-50 rounded-lg">
          <p className="text-sm font-black text-[#003262]">{webhook.successRate}%</p>
          <p className="text-[9px] text-slate-400">成功率</p>
        </div>
        <div className="text-center p-2 bg-slate-50 rounded-lg">
          <p className="text-sm font-black text-[#003262]">{webhook.totalDeliveries}</p>
          <p className="text-[9px] text-slate-400">總推送</p>
        </div>
        <div className="text-center p-2 bg-slate-50 rounded-lg">
          <p className="text-sm font-black text-[#003262]">{webhook.events.length}</p>
          <p className="text-[9px] text-slate-400">事件數</p>
        </div>
      </div>

      {/* Events */}
      <div className="flex flex-wrap gap-1 mb-3">
        {webhook.events.slice(0, 3).map((event) => (
          <span
            key={event}
            className="text-[9px] px-1.5 py-0.5 bg-cyan-50 text-cyan-600 rounded font-mono"
          >
            {event}
          </span>
        ))}
        {webhook.events.length > 3 && (
          <span className="text-[9px] px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded">
            +{webhook.events.length - 3}
          </span>
        )}
      </div>

      {/* Last Delivery */}
      {webhook.lastDelivery && (
        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-50">
          <span className="flex items-center gap-1">
            <Clock size={10} />
            最後推送:{' '}
            {new Date(webhook.lastDelivery).toLocaleString('zh-TW', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <button className="text-cyan-600 hover:text-cyan-800 font-medium">查看日誌</button>
        </div>
      )}
    </div>
  );
}

function LogRow({ log }: { log: WebhookLog }) {
  const [expanded, setExpanded] = useState(false);
  const webhook = WEBHOOK_ENDPOINTS.find((w) => w.id === log.webhookId);

  const statusConfig = {
    success: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', label: '成功' },
    failed: { icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50', label: '失敗' },
    pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', label: '等待中' },
  };
  const config = statusConfig[log.status];
  const StatusIcon = config.icon;

  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (minutes < 1) return '剛剛';
    if (minutes < 60) return `${minutes} 分鐘前`;
    if (hours < 24) return `${hours} 小時前`;
    return `${Math.floor(diff / 86400000)} 天前`;
  };

  return (
    <div className="border-b border-slate-50 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 py-3 px-2 hover:bg-slate-50/50 transition-colors text-left"
      >
        <div
          className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', config.bg)}
        >
          <StatusIcon size={12} className={config.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#003262]">
              {webhook?.name || log.webhookId}
            </span>
            <span
              className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded', config.bg, config.color)}
            >
              {config.label}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">{log.event}</p>
        </div>
        <div className="text-right shrink-0">
          {log.responseCode && (
            <p
              className={cn(
                'text-[10px] font-mono font-bold',
                log.responseCode < 300 ? 'text-emerald-600' : 'text-rose-600'
              )}
            >
              {log.responseCode}
            </p>
          )}
          {log.responseTime && <p className="text-[9px] text-slate-300">{log.responseTime}ms</p>}
        </div>
        <span className="text-[10px] text-slate-300 shrink-0">{timeAgo(log.timestamp)}</span>
        {expanded ? (
          <ChevronDown size={12} className="text-slate-300" />
        ) : (
          <ChevronRight size={12} className="text-slate-300" />
        )}
      </button>

      
        {expanded && log.payload && (
          <div
            className="overflow-hidden"
          >
            <div className="px-2 pb-3">
              <div className="bg-slate-900 rounded-lg p-3 relative">
                <button
                  onClick={() => navigator.clipboard.writeText(log.payload!)}
                  className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <Copy size={10} className="text-slate-400" />
                </button>
                <pre className="text-[10px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(JSON.parse(log.payload), null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      
    </div>
  );
}

/* ─── Main Page ─── */
export default function WebhooksPage() {
  const [activeTab, setActiveTab] = useState<'endpoints' | 'logs' | 'events' | 'settings'>(
    'endpoints'
  );
  const [endpoints, setEndpoints] = useState(WEBHOOK_ENDPOINTS);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const totalDeliveries = endpoints.reduce((sum, e) => sum + e.totalDeliveries, 0);
  const avgSuccessRate =
    Math.round((endpoints.reduce((sum, e) => sum + e.successRate, 0) / endpoints.length) * 10) / 10;
  const activeCount = endpoints.filter((e) => e.status === 'active').length;

  const handleToggle = (id: string) => {
    setEndpoints((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: e.status === 'active' ? 'paused' : 'active' } : e
      )
    );
  };

  const handleDelete = (id: string) => {
    setEndpoints((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-50 rounded-full blur-3xl breathing-glow-amber" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg breathing-glow-amber">
                <Zap size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">Webhook 管理</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Webhooks · 自動化數據流動 · 實時推送
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-black text-[#003262]">
                  {activeCount}/{endpoints.length}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">啟用中</p>
              </div>
              <div className="w-px h-10 bg-slate-100" />
              <div className="text-right">
                <p className="text-2xl font-black text-emerald-600">{avgSuccessRate}%</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">成功率</p>
              </div>
              <div className="w-px h-10 bg-slate-100" />
              <div className="text-right">
                <p className="text-2xl font-black text-[#003262]">
                  {totalDeliveries.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">總推送</p>
              </div>
            </div>
          </div>
        </header>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'endpoints' as const, label: '端點管理', icon: Globe, count: endpoints.length },
            { id: 'logs' as const, label: '推送日誌', icon: Activity, count: WEBHOOK_LOGS.length },
            { id: 'events' as const, label: '事件類型', icon: Zap, count: EVENT_TYPES.length },
            { id: 'settings' as const, label: '安全設定', icon: ShieldCheck },
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
        {activeTab === 'endpoints' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#003262]">Webhook 端點</h3>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                onClick={() => setShowCreateModal(true)}
                className="bg-[#003262] hover:bg-[#002244] text-white"
              >
                新增端點
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {endpoints.map((webhook) => (
                <WebhookCard
                  key={webhook.id}
                  webhook={webhook}
                  onToggle={() => handleToggle(webhook.id)}
                  onDelete={() => handleDelete(webhook.id)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#003262] flex items-center gap-2">
                <Activity size={16} className="text-amber-500" />
                推送日誌
              </h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="搜尋日誌..."
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>
                <button className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                  <Filter size={14} className="text-slate-400" />
                </button>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {WEBHOOK_LOGS.map((log) => (
                <LogRow key={log.id} log={log} />
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'events' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#003262]">支援的事件類型</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {EVENT_TYPES.map((event) => (
                <div key={event.id} className="bg-white rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-[10px] font-mono text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded">
                      {event.id}
                    </code>
                  </div>
                  <h4 className="text-sm font-bold text-[#003262] mb-1">{event.label}</h4>
                  <p className="text-[10px] text-slate-400">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5">
              <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500" />
                安全設定
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'HMAC 簽章驗證', desc: '使用 SHA-256 驗證請求來源', enabled: true },
                  { label: 'IP 白名單', desc: '限制只有特定 IP 可以發送請求', enabled: false },
                  { label: 'TLS 1.3 加密', desc: '所有通訊使用 TLS 1.3 加密', enabled: true },
                  { label: '重試機制', desc: '失敗時自動重試 3 次', enabled: true },
                  { label: '超時設定', desc: '請求超時時間 30 秒', enabled: true },
                ].map((setting) => (
                  <div
                    key={setting.label}
                    className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#003262]">{setting.label}</p>
                      <p className="text-[10px] text-slate-400">{setting.desc}</p>
                    </div>
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
              <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-500" />
                推送統計
              </h3>
              <div className="space-y-4">
                {[
                  { label: '今日推送', value: '1,247', trend: '+12%' },
                  { label: '本週推送', value: '8,562', trend: '+8%' },
                  { label: '本月推送', value: '32,847', trend: '+15%' },
                  { label: '平均響應時間', value: '145ms', trend: '-23ms' },
                  { label: '失敗率', value: '1.5%', trend: '-0.3%' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{stat.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-bold text-[#003262]">
                        {stat.value}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-bold',
                          stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'
                        )}
                      >
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ─── Create Modal ─── */}
        
          {showCreateModal && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <div
                className="bg-white rounded-2xl p-6 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#003262]">新增 Webhook 端點</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-1 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <X size={18} className="text-slate-400" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">端點名稱</label>
                    <input
                      type="text"
                      placeholder="例如：Slack 通知"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">回調 URL</label>
                    <input
                      type="url"
                      placeholder="https://your-server.com/webhook"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">訂閱事件</label>
                    <div className="flex flex-wrap gap-2">
                      {EVENT_TYPES.slice(0, 6).map((event) => (
                        <label
                          key={event.id}
                          className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg cursor-pointer hover:bg-cyan-50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                          />
                          <span className="text-[10px] text-slate-600">{event.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCreateModal(false)}
                    >
                      取消
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Plus size={14} />}
                      className="bg-[#003262] hover:bg-[#002244] text-white"
                    >
                      建立端點
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        
      </div>
    </div>
  );
}
