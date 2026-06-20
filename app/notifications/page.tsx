// @ts-nocheck
'use client';

import React, { useState } from 'react';

import {
  Bell,
  Mail,
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Settings,
  Filter,
  Search,
  Plus,
  Eye,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Users,
  Globe,
  Zap,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  X,
  Volume2,
  VolumeX,
  Smartphone,
  MailOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';

/* ─── Types ─── */
interface NotificationItem {
  id: string;
  type: 'system' | 'alert' | 'report' | 'compliance' | 'ai' | 'webhook';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  actions?: { label: string; action: string; primary?: boolean }[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  channel: ('email' | 'push' | 'sms' | 'slack')[];
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  trigger: string;
  status: 'active' | 'paused' | 'draft';
  openRate: number;
  clickRate: number;
  sent: number;
  lastSent?: string;
}

/* ─── Mock Data ─── */
const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-001',
    type: 'alert',
    title: '供應鏈風險警示',
    message: '供應商 A 的 Scope 3 數據缺失已超過 7 天，請儘速處理。',
    timestamp: Date.now() - 300000,
    read: false,
    priority: 'urgent',
    channel: ['email', 'push'],
    actions: [
      { label: '查看詳情', action: 'view', primary: true },
      { label: '稍後提醒', action: 'snooze' },
    ],
  },
  {
    id: 'notif-002',
    type: 'report',
    title: '報告生成完成',
    message: '2025 年度永續報告已通過 5T 驗證，可下載 PDF 版本。',
    timestamp: Date.now() - 3600000,
    read: false,
    priority: 'high',
    channel: ['email'],
    actions: [
      { label: '下載報告', action: 'download', primary: true },
      { label: '查看報告', action: 'view' },
    ],
  },
  {
    id: 'notif-003',
    type: 'compliance',
    title: '5T 驗證提醒',
    message: '本週尚有 3 筆數據未完成 Transparent (信) 驗證。',
    timestamp: Date.now() - 7200000,
    read: true,
    priority: 'normal',
    channel: ['email', 'push'],
    actions: [{ label: '執行驗證', action: 'verify', primary: true }],
  },
  {
    id: 'notif-004',
    type: 'ai',
    title: 'AI 洞察通知',
    message: 'Gemini 2.0 發現新的碳排熱點，建議檢視能源 D 供應商。',
    timestamp: Date.now() - 86400000,
    read: true,
    priority: 'high',
    channel: ['push'],
    actions: [{ label: '查看洞察', action: 'view', primary: true }],
  },
  {
    id: 'notif-005',
    type: 'system',
    title: '系統維護通知',
    message: '系統將於本週日 02:00-04:00 進行維護，期間無法使用。',
    timestamp: Date.now() - 172800000,
    read: true,
    priority: 'low',
    channel: ['email'],
  },
  {
    id: 'notif-006',
    type: 'webhook',
    title: 'Webhook 事件',
    message: 'CrewAI 代理已完成 Intelligence Aggregator 任務。',
    timestamp: Date.now() - 259200000,
    read: true,
    priority: 'normal',
    channel: ['slack'],
    actions: [{ label: '查看結果', action: 'view' }],
  },
];

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'email-001',
    name: '5T 驗證提醒',
    subject: '【ESGGO】您的 5T 驗證即將到期',
    trigger: '驗證到期前 3 天',
    status: 'active',
    openRate: 78,
    clickRate: 45,
    sent: 1247,
    lastSent: '2026-01-18T10:00:00+08:00',
  },
  {
    id: 'email-002',
    name: '報告生成完成',
    subject: '【ESGGO】您的永續報告已生成完成',
    trigger: '報告完成後',
    status: 'active',
    openRate: 92,
    clickRate: 68,
    sent: 856,
    lastSent: '2026-01-18T09:30:00+08:00',
  },
  {
    id: 'email-003',
    name: '風險警示通知',
    subject: '【ESGGO】供應鏈風險警示 - 需立即處理',
    trigger: '高風險事件觸發',
    status: 'active',
    openRate: 95,
    clickRate: 82,
    sent: 234,
    lastSent: '2026-01-17T14:00:00+08:00',
  },
  {
    id: 'email-004',
    name: '每週摘要',
    subject: '【ESGGO】您的 ESG 週報摘要',
    trigger: '每週一 09:00',
    status: 'active',
    openRate: 65,
    clickRate: 32,
    sent: 3120,
    lastSent: '2026-01-13T09:00:00+08:00',
  },
  {
    id: 'email-005',
    name: '召回通知',
    subject: '【ESGGO】我們想念您！查看最新 ESG 動態',
    trigger: '7 天未登入',
    status: 'paused',
    openRate: 42,
    clickRate: 18,
    sent: 567,
  },
];

/* ─── Components ─── */

function NotificationCard({
  notification,
  onRead,
  onDelete,
}: {
  notification: NotificationItem;
  onRead: () => void;
  onDelete: () => void;
}) {
  const typeConfig = {
    system: { icon: Settings, color: 'text-slate-500', bg: 'bg-slate-50', label: '系統' },
    alert: { icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50', label: '警示' },
    report: { icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50', label: '報告' },
    compliance: { icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-50', label: '合規' },
    ai: { icon: Zap, color: 'text-violet-500', bg: 'bg-violet-50', label: 'AI' },
    webhook: { icon: Globe, color: 'text-cyan-500', bg: 'bg-cyan-50', label: 'Webhook' },
  };
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  const priorityConfig = {
    low: { label: '低', color: 'bg-slate-100 text-slate-500' },
    normal: { label: '普通', color: 'bg-blue-50 text-blue-600' },
    high: { label: '高', color: 'bg-amber-50 text-amber-600' },
    urgent: { label: '緊急', color: 'bg-rose-50 text-rose-600' },
  };
  const pConfig = priorityConfig[notification.priority];

  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return '剛剛';
    if (minutes < 60) return `${minutes} 分鐘前`;
    if (hours < 24) return `${hours} 小時前`;
    return `${days} 天前`;
  };

  return (
    <div
      layout
      className={cn(
        'bg-white rounded-xl border p-4 transition-all hover:shadow-md',
        !notification.read ? 'border-cyan-200 bg-cyan-50/20' : 'border-slate-100'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-lg shrink-0', config.bg)}>
          <Icon size={16} className={config.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4
              className={cn(
                'text-sm font-bold truncate',
                !notification.read ? 'text-[#003262]' : 'text-slate-600'
              )}
            >
              {notification.title}
            </h4>
            {!notification.read && (
              <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0 breathing-glow" />
            )}
          </div>
          <p className="text-xs text-slate-500 line-clamp-2 mb-2">{notification.message}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded', pConfig.color)}>
              {pConfig.label}
            </span>
            <span className="text-[9px] text-slate-300">{timeAgo(notification.timestamp)}</span>
            <div className="flex items-center gap-1">
              {notification.channel.map((ch) => (
                <span key={ch} className="text-[9px] text-slate-400 capitalize">
                  {ch}
                </span>
              ))}
            </div>
          </div>
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              {notification.actions.map((action) => (
                <button
                  key={action.action}
                  onClick={onRead}
                  className={cn(
                    'text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors',
                    action.primary
                      ? 'bg-[#003262] text-white hover:bg-[#002244]'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={onDelete}
          className="p-1 hover:bg-slate-50 rounded transition-colors shrink-0"
        >
          <X size={14} className="text-slate-300" />
        </button>
      </div>
    </div>
  );
}

function EmailTemplateCard({ template }: { template: EmailTemplate }) {
  return (
    <div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-[#003262] truncate">{template.name}</h4>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">{template.subject}</p>
        </div>
        <OmniBadge
          variant={
            template.status === 'active'
              ? 'success'
              : template.status === 'paused'
              ? 'warning'
              : 'secondary'
          }
          size="xs"
        >
          {template.status === 'active' ? '啟用' : template.status === 'paused' ? '暫停' : '草稿'}
        </OmniBadge>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
        <div className="text-center p-2 bg-slate-50 rounded-lg">
          <p className="font-mono font-bold text-[#003262]">{template.openRate}%</p>
          <p className="text-[9px] text-slate-400">開啟率</p>
        </div>
        <div className="text-center p-2 bg-slate-50 rounded-lg">
          <p className="font-mono font-bold text-[#003262]">{template.clickRate}%</p>
          <p className="text-[9px] text-slate-400">點擊率</p>
        </div>
        <div className="text-center p-2 bg-slate-50 rounded-lg">
          <p className="font-mono font-bold text-[#003262]">{template.sent}</p>
          <p className="text-[9px] text-slate-400">已發送</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <span>觸發: {template.trigger}</span>
        {template.lastSent && (
          <span>最後發送: {new Date(template.lastSent).toLocaleDateString('zh-TW')}</span>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'templates' | 'settings'>('inbox');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const urgentCount = notifications.filter((n) => n.priority === 'urgent' && !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'urgent') return n.priority === 'urgent';
    return true;
  });

  const handleRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-50 rounded-full blur-3xl breathing-glow" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg breathing-glow">
                  <Bell size={24} className="text-white" />
                </div>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">通知中心</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Notifications · 個性化推送 · 即時召回
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-black text-[#003262]">{notifications.length}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">全部通知</p>
              </div>
              <div className="w-px h-10 bg-slate-100" />
              <div className="text-right">
                <p className="text-2xl font-black text-cyan-600">{unreadCount}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">未讀</p>
              </div>
              <div className="w-px h-10 bg-slate-100" />
              <div className="text-right">
                <p className="text-2xl font-black text-rose-600">{urgentCount}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">緊急</p>
              </div>
            </div>
          </div>
        </header>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'inbox' as const, label: '收件匣', icon: MailOpen, badge: unreadCount },
            { id: 'templates' as const, label: '郵件模板', icon: Mail },
            { id: 'settings' as const, label: '通知設定', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all relative',
                activeTab === tab.id
                  ? 'bg-[#003262] text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span
                  className={cn(
                    'w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center',
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ─── Content ─── */}
        {activeTab === 'inbox' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {[
                  { id: 'all' as const, label: '全部', count: notifications.length },
                  { id: 'unread' as const, label: '未讀', count: unreadCount },
                  { id: 'urgent' as const, label: '緊急', count: urgentCount },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                      filter === f.id
                        ? 'bg-[#003262] text-white'
                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                    )}
                  >
                    {f.label}
                    <span
                      className={cn(
                        'w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center',
                        filter === f.id ? 'bg-white/20' : 'bg-slate-100'
                      )}
                    >
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="搜尋通知..."
                    className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-bold text-cyan-600 hover:text-cyan-800"
                  >
                    全部標記已讀
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            
              {filteredNotifications.length > 0 ? (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onRead={() => handleRead(notification.id)}
                      onDelete={() => handleDelete(notification.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MailOpen size={48} className="mx-auto mb-4 text-slate-200" />
                  <p className="text-sm text-slate-400">沒有符合條件的通知</p>
                </div>
              )}
            
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#003262]">郵件模板</h3>
                <p className="text-xs text-slate-400">管理自動化郵件通知模板</p>
              </div>
              <OmniButton
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                className="bg-[#003262] hover:bg-[#002244] text-white"
              >
                新增模板
              </OmniButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EMAIL_TEMPLATES.map((template) => (
                <EmailTemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OmniBaseCard className="p-5">
              <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
                <Bell size={16} className="text-cyan-500" />
                通知管道
              </h3>
              <div className="space-y-4">
                {[
                  {
                    id: 'email',
                    label: '電子郵件',
                    icon: Mail,
                    enabled: true,
                    desc: '系統通知、報告完成、風險警示',
                  },
                  {
                    id: 'push',
                    label: '推播通知',
                    icon: Smartphone,
                    enabled: true,
                    desc: '即時警示、AI 洞察',
                  },
                  {
                    id: 'sms',
                    label: '簡訊通知',
                    icon: MessageSquare,
                    enabled: false,
                    desc: '緊急事件通知',
                  },
                  {
                    id: 'slack',
                    label: 'Slack',
                    icon: Globe,
                    enabled: true,
                    desc: 'Webhook 事件、團隊協作',
                  },
                ].map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <channel.icon size={16} className="text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-[#003262]">{channel.label}</p>
                        <p className="text-[10px] text-slate-400">{channel.desc}</p>
                      </div>
                    </div>
                    <button
                      className={cn(
                        'w-10 h-5 rounded-full transition-colors relative',
                        channel.enabled ? 'bg-emerald-500' : 'bg-slate-200'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                          channel.enabled ? 'left-5' : 'left-0.5'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </OmniBaseCard>

            <OmniBaseCard className="p-5">
              <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
                <Clock size={16} className="text-amber-500" />
                通知時機
              </h3>
              <div className="space-y-4">
                {[
                  { id: 'realtime', label: '即時通知', enabled: true, desc: '重要事件立即推送' },
                  { id: 'digest', label: '每日摘要', enabled: true, desc: '每日 09:00 發送' },
                  { id: 'weekly', label: '每週摘要', enabled: true, desc: '每週一 09:00 發送' },
                  { id: 'recall', label: '召回通知', enabled: true, desc: '7 天未登入時發送' },
                ].map((timing) => (
                  <div
                    key={timing.id}
                    className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#003262]">{timing.label}</p>
                      <p className="text-[10px] text-slate-400">{timing.desc}</p>
                    </div>
                    <button
                      className={cn(
                        'w-10 h-5 rounded-full transition-colors relative',
                        timing.enabled ? 'bg-emerald-500' : 'bg-slate-200'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                          timing.enabled ? 'left-5' : 'left-0.5'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </OmniBaseCard>

            <OmniBaseCard className="p-5 md:col-span-2">
              <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500" />
                通知統計
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: '本月發送', value: '2,847', icon: Send, color: 'text-blue-600' },
                  { label: '平均開啟率', value: '78%', icon: Eye, color: 'text-emerald-600' },
                  { label: '平均點擊率', value: '42%', icon: TrendingUp, color: 'text-amber-600' },
                  { label: '退回率', value: '0.3%', icon: AlertTriangle, color: 'text-rose-600' },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center p-4 bg-slate-50 rounded-xl">
                      <Icon size={20} className={cn('mx-auto mb-2', stat.color)} />
                      <p className="text-xl font-black text-[#003262]">{stat.value}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </OmniBaseCard>
          </div>
        )}
      </div>
    </div>
  );
}
