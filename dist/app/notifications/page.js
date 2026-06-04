'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, XCircle, Zap, X } from 'lucide-react';
const MOCK_NOTIFICATIONS = [
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
    success: { label: '成功', color: '#16a34a', bg: '#dcfce7', icon: _jsx(CheckCircle, { size: 16 }) },
    warning: { label: '警告', color: '#d97706', bg: '#fef3c7', icon: _jsx(AlertTriangle, { size: 16 }) },
    error: { label: '錯誤', color: '#dc2626', bg: '#fef2f2', icon: _jsx(XCircle, { size: 16 }) },
    info: { label: '資訊', color: '#2563eb', bg: '#eff6ff', icon: _jsx(Info, { size: 16 }) },
    system: { label: '系統', color: '#7c3aed', bg: '#ede9fe', icon: _jsx(Zap, { size: 16 }) },
};
export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [typeFilter, setTypeFilter] = useState('all');
    const [readFilter, setReadFilter] = useState('all');
    const filtered = notifications.filter(n => {
        if (typeFilter !== 'all' && n.type !== typeFilter)
            return false;
        if (readFilter === 'unread' && n.read)
            return false;
        if (readFilter === 'read' && !n.read)
            return false;
        return true;
    });
    const unreadCount = notifications.filter(n => !n.read).length;
    const markRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };
    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };
    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };
    const timeAgo = (ts) => {
        const diff = Date.now() - new Date(ts).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60)
            return `${mins} 分鐘前`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24)
            return `${hrs} 小時前`;
        return `${Math.floor(hrs / 24)} 天前`;
    };
    return (_jsxs("div", { style: { padding: '24px', maxWidth: '900px', margin: '0 auto' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '12px' }, children: [_jsxs("div", { style: { width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #003262, #1a4d7a)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }, children: [_jsx(Bell, { size: 20, color: "white" }), unreadCount > 0 && (_jsx("span", { style: { position: 'absolute', top: '-4px', right: '-4px', width: '18px', height: '18px', background: '#dc2626', borderRadius: '50%', fontSize: '10px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }, children: unreadCount }))] }), _jsxs("div", { children: [_jsx("h1", { style: { fontSize: '20px', fontWeight: 800, color: '#1a1a2e', lineHeight: 1 }, children: "\u901A\u77E5\u4E2D\u5FC3" }), _jsxs("p", { style: { fontSize: '12px', color: '#6b7280', marginTop: '3px' }, children: [unreadCount, " \u5247\u672A\u8B80 \u00B7 ", notifications.length, " \u5247\u7E3D\u8A08"] })] })] }), unreadCount > 0 && (_jsxs("button", { onClick: markAllRead, style: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '9px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }, children: [_jsx(CheckCircle, { size: 13 }), "\u5168\u90E8\u6A19\u70BA\u5DF2\u8B80"] }))] }), _jsxs("div", { style: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }, children: [_jsx("div", { style: { display: 'flex', gap: '4px', background: '#f3f4f6', padding: '3px', borderRadius: '9px' }, children: ['all', 'unread', 'read'].map(f => (_jsx("button", { onClick: () => setReadFilter(f), style: { padding: '6px 14px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer', background: readFilter === f ? 'white' : 'transparent', color: readFilter === f ? '#003262' : '#6b7280', boxShadow: readFilter === f ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }, children: f === 'all' ? '全部' : f === 'unread' ? '未讀' : '已讀' }, f))) }), _jsx("div", { style: { display: 'flex', gap: '4px', flexWrap: 'wrap' }, children: ['all', 'success', 'warning', 'error', 'info', 'system'].map(t => (_jsx("button", { onClick: () => setTypeFilter(t), style: { padding: '6px 12px', borderRadius: '7px', border: '1.5px solid', borderColor: typeFilter === t ? '#003262' : '#e5e7eb', background: typeFilter === t ? '#003262' : 'white', color: typeFilter === t ? 'white' : '#374151', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }, children: t === 'all' ? '全部類型' : TYPE_CFG[t].label }, t))) })] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: filtered.length === 0 ? (_jsxs("div", { style: { textAlign: 'center', padding: '64px', color: '#9ca3af', background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb' }, children: [_jsx(Bell, { size: 40, style: { margin: '0 auto 12px', opacity: 0.3 } }), _jsx("div", { style: { fontSize: '15px', fontWeight: 600 }, children: "\u6C92\u6709\u7B26\u5408\u689D\u4EF6\u7684\u901A\u77E5" })] })) : filtered.map(n => {
                    const cfg = TYPE_CFG[n.type];
                    return (_jsxs("div", { style: {
                            background: n.read ? 'white' : '#f0f7ff',
                            borderRadius: '14px',
                            border: `1.5px solid ${n.read ? '#e5e7eb' : '#bfdbfe'}`,
                            padding: '16px 18px',
                            display: 'flex',
                            gap: '14px',
                            alignItems: 'flex-start',
                            transition: 'all 0.2s',
                        }, children: [_jsx("div", { style: { width: '36px', height: '36px', borderRadius: '10px', background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }, children: cfg.icon }), _jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '5px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }, children: [_jsx("span", { style: { fontSize: '14px', fontWeight: n.read ? 600 : 700, color: '#1a1a2e' }, children: n.title }), !n.read && _jsx("span", { style: { width: '7px', height: '7px', borderRadius: '50%', background: '#003262', flexShrink: 0 } }), _jsx("span", { style: { padding: '1px 7px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, background: cfg.bg, color: cfg.color }, children: cfg.label })] }), _jsx("span", { style: { fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap', flexShrink: 0 }, children: timeAgo(n.timestamp) })] }), _jsx("p", { style: { fontSize: '13px', color: '#6b7280', margin: '0 0 10px', lineHeight: 1.5 }, children: n.message }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }, children: [_jsx("span", { style: { padding: '2px 7px', borderRadius: '4px', fontSize: '10px', background: '#f3f4f6', color: '#6b7280' }, children: n.module }), n.tags.map(tag => (_jsx("span", { style: { padding: '2px 7px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: '#dbeafe', color: '#1d4ed8' }, children: tag }, tag))), n.actionUrl && (_jsx("a", { href: n.actionUrl, style: { marginLeft: 'auto', padding: '4px 12px', background: '#003262', color: 'white', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textDecoration: 'none' }, children: n.actionLabel })), !n.read && (_jsx("button", { onClick: () => markRead(n.id), style: { padding: '4px 10px', background: 'none', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '11px', color: '#6b7280', cursor: 'pointer' }, children: "\u6A19\u70BA\u5DF2\u8B80" })), _jsx("button", { onClick: () => deleteNotification(n.id), style: { padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', display: 'flex' }, children: _jsx(X, { size: 13 }) })] })] })] }, n.id));
                }) })] }));
}
//# sourceMappingURL=page.js.map