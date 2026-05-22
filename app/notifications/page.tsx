'use client';
import { useState } from 'react';
import {
  Bell, CheckCircle, AlertTriangle, Info, XCircle, Zap,
  Clock, Globe, Leaf, Shield, FileText, Database, X,
  Filter
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'system';
  title: string;
  message: string;
  module: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  tags: string[];
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'ZKP 驗算完成',
    message: 'GRI 305-1 溫室氣體範疇一排放數據已通過零知識驗算，Hash Lock 已生成。',
    module: '證據金庫',
    timestamp: '2026-05-20T09:42:00Z',
    read: false,
    actionUrl: '/vault',
    actionLabel: '前往金庫',
    tags: ['ZKP', 'GRI 305-1', 'T5'],
  },
  {
    id: '2',
    type: 'warning',
    title: 'CBAM 申報截止提醒',
    message: '2026 年 Q2 CBAM 申報截止日為 2026-07-31，距今還有 72 天，請盡快完成碳足跡資料填報。',
    module: 'CBAM 試算器',
    timestamp: '2026-05-20T08:00:00Z',
    read: false,
    actionUrl: '/cbam-calculator',
    actionLabel: '前往試算',
    tags: ['CBAM', 'EU', '合規期限'],
  },
  {
    id: '3',
    type: 'info',
    title: 'AI 合規掃描完成',
    message: 'Gemini AI 已完成永續報告第三章內容掃描，發現 2 項潛在綠漂風險，建議修改措辭。',
    module: '永續撰寫',
    timestamp: '2026-05-19T16:30:00Z',
    read: false,
    actionUrl: '/editor',
    actionLabel: '查看建議',
    tags: ['AI', '綠漂', 'GRI'],
  },
  {
    id: '4',
    type: 'success',
    title: '企業健檢完成',
    message: '本次 ESG 健檢得分 72.5 分，E 面向 68 分、S 面向 75 分、G 面向 74 分，已生成 90 天改善路線圖。',
    module: '企業健檢',
    timestamp: '2026-05-19T14:00:00Z',
    read: true,
    actionUrl: '/health-check',
    actionLabel: '查看報告',
    tags: ['健檢', 'ESG', '路線圖'],
  },
  {
    id: '5',
    type: 'system',
    title: '數位分身知識庫更新',
    message: '已新增 3 篇永續知識條目至 RAG 知識倉庫，數位分身現在可以回答關於 TCFD 氣候情境分析的問題。',
    module: '數位分身',
    timestamp: '2026-05-19T10:15:00Z',
    read: true,
    actionUrl: '/digital-twin',
    actionLabel: '前往分身',
    tags: ['RAG', 'TCFD', 'AI'],
  },
  {
    id: '6',
    type: 'error',
    title: '佐證文件缺漏警告',
    message: 'GRI 302-1 能源消耗指標缺少 12 月份台電帳單，無法完成該指標的 5T 封印，請盡快上傳。',
    module: '證據金庫',
    timestamp: '2026-05-18T11:00:00Z',
    read: true,
    actionUrl: '/vault',
    actionLabel: '上傳文件',
    tags: ['GRI 302-1', '佐證', '待補'],
  },
  {
    id: '7',
    type: 'info',
    title: '金管會法規更新通知',
    message: '金管會於 2026-05-15 發布上市公司永續報告書新規範更新，2027 年起需符合 IFRS S1/S2 雙軌揭露要求。',
    module: '商情中心',
    timestamp: '2026-05-18T09:00:00Z',
    read: true,
    actionUrl: '/intelligence',
    actionLabel: '查看詳情',
    tags: ['金管會', 'IFRS S1', '法規'],
  },
  {
    id: '8',
    type: 'success',
    title: '淨零路線圖里程碑達成',
    message: '「完成基準年碳盤查」里程碑已標記為達成，SBTi 1.5°C 目標路徑進度 23%。',
    module: '淨零路線圖',
    timestamp: '2026-05-17T15:30:00Z',
    read: true,
    actionUrl: '/roadmap',
    actionLabel: '查看路線圖',
    tags: ['SBTi', '里程碑', '減碳'],
  },
];

const TYPE_CFG = {
  success: { label: '成功', color: '#16a34a', bg: '#dcfce7', icon: <CheckCircle size={16} /> },
  warning: { label: '警告', color: '#d97706', bg: '#fef3c7', icon: <AlertTriangle size={16} /> },
  error:   { label: '錯誤', color: '#dc2626', bg: '#fef2f2', icon: <XCircle size={16} /> },
  info:    { label: '資訊', color: '#2563eb', bg: '#eff6ff', icon: <Info size={16} /> },
  system:  { label: '系統', color: '#7c3aed', bg: '#ede9fe', icon: <Zap size={16} /> },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<string>('all');

  const filtered = notifications.filter(n => {
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    if (readFilter === 'unread' && n.read) return false;
    if (readFilter === 'read' && !n.read) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} 分鐘前`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} 小時前`;
    return `${Math.floor(hrs / 24)} 天前`;
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #003262, #1a4d7a)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Bell size={20} color="white" />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '18px', height: '18px', background: '#dc2626', borderRadius: '50%', fontSize: '10px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a2e', lineHeight: 1 }}>通知中心</h1>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '3px' }}>{unreadCount} 則未讀 · {notifications.length} 則總計</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '9px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            <CheckCircle size={13} />全部標為已讀
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '4px', background: '#f3f4f6', padding: '3px', borderRadius: '9px' }}>
          {['all', 'unread', 'read'].map(f => (
            <button key={f} onClick={() => setReadFilter(f)} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer', background: readFilter === f ? 'white' : 'transparent', color: readFilter === f ? '#003262' : '#6b7280', boxShadow: readFilter === f ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
              {f === 'all' ? '全部' : f === 'unread' ? '未讀' : '已讀'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {['all', 'success', 'warning', 'error', 'info', 'system'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{ padding: '6px 12px', borderRadius: '7px', border: '1.5px solid', borderColor: typeFilter === t ? '#003262' : '#e5e7eb', background: typeFilter === t ? '#003262' : 'white', color: typeFilter === t ? 'white' : '#374151', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
              {t === 'all' ? '全部類型' : TYPE_CFG[t as keyof typeof TYPE_CFG].label}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#9ca3af', background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb' }}>
            <Bell size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <div style={{ fontSize: '15px', fontWeight: 600 }}>沒有符合條件的通知</div>
          </div>
        ) : filtered.map(n => {
          const cfg = TYPE_CFG[n.type];
          return (
            <div
              key={n.id}
              style={{
                background: n.read ? 'white' : '#f0f7ff',
                borderRadius: '14px',
                border: `1.5px solid ${n.read ? '#e5e7eb' : '#bfdbfe'}`,
                padding: '16px 18px',
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {cfg.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: n.read ? 600 : 700, color: '#1a1a2e' }}>{n.title}</span>
                    {!n.read && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#003262', flexShrink: 0 }} />}
                    <span style={{ padding: '1px 7px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap', flexShrink: 0 }}>{timeAgo(n.timestamp)}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 10px', lineHeight: 1.5 }}>{n.message}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '10px', background: '#f3f4f6', color: '#6b7280' }}>{n.module}</span>
                  {n.tags.map(tag => (
                    <span key={tag} style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: '#dbeafe', color: '#1d4ed8' }}>{tag}</span>
                  ))}
                  {n.actionUrl && (
                    <a href={n.actionUrl} style={{ marginLeft: 'auto', padding: '4px 12px', background: '#003262', color: 'white', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textDecoration: 'none' }}>
                      {n.actionLabel}
                    </a>
                  )}
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} style={{ padding: '4px 10px', background: 'none', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '11px', color: '#6b7280', cursor: 'pointer' }}>
                      標為已讀
                    </button>
                  )}
                  <button onClick={() => deleteNotification(n.id)} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', display: 'flex' }}>
                    <X size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}