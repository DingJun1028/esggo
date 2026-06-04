'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Search, Command, Bot, Database, FileText, Layout, Zap, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
const ACTIONS = [
    { id: 'nav-dash', title: '前往 控制台', icon: _jsx(Layout, { size: 16 }), shortcut: 'G D', path: '/' },
    { id: 'nav-editor', title: '前往 永續撰寫 sustaining writing', icon: _jsx(FileText, { size: 16 }), shortcut: 'G E', path: '/editor' },
    { id: 'nav-vault', title: '前往 證據金庫 vault', icon: _jsx(Database, { size: 16 }), shortcut: 'G V', path: '/vault' },
    { id: 'nav-swarm', title: '前往 代理蜂群 swarm', icon: _jsx(Bot, { size: 16 }), shortcut: 'G S', path: '/swarm' },
    { id: 'cmd-seal', title: '執行 5T 全章節封印', icon: _jsx(Shield, { size: 16 }), shortcut: '⌘ S', action: () => alert('正在啟動 5T 批次封印流程...') },
    { id: 'cmd-audit', title: '檢索 審計日誌', icon: _jsx(Search, { size: 16 }), shortcut: '⌘ L', path: '/audit-log' },
];
export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const router = useRouter();
    const toggle = useCallback(() => setIsOpen(prev => !prev), []);
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                toggle();
            }
            if (e.key === 'Escape')
                setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggle]);
    const filteredActions = ACTIONS.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "modal-overlay", style: { zIndex: 10000, background: 'rgba(0,50,98,0.4)', backdropFilter: 'blur(4px)' }, onClick: toggle, children: [_jsxs("div", { className: "modal", style: { maxWidth: 640, top: '20%', transform: 'none', background: '#fff', borderRadius: '16px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }, onClick: e => e.stopPropagation(), children: [_jsxs("div", { style: { padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem' }, children: [_jsx(Search, { size: 20, className: "text-slate-400" }), _jsx("input", { autoFocus: true, className: "input", style: { border: 'none', boxShadow: 'none', fontSize: '1rem', padding: '0.5rem 0' }, placeholder: "\u8F38\u5165\u6307\u4EE4\u6216\u641C\u5C0B\u9801\u9762... (G D, G E, G V)", value: query, onChange: e => setQuery(e.target.value) }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', background: '#f1f5f9', borderRadius: 6, fontSize: 10, fontWeight: 700, color: '#94a3b8' }, children: [_jsx(Command, { size: 10 }), " K"] })] }), _jsx("div", { style: { padding: '0.5rem', maxHeight: 320, overflowY: 'auto' }, children: filteredActions.length === 0 ? (_jsx("div", { style: { padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }, children: "\u672A\u627E\u5230\u7B26\u5408\u7684\u6307\u4EE4" })) : (filteredActions.map(action => (_jsxs("div", { style: {
                                padding: '0.75rem 1rem',
                                borderRadius: 10,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                transition: 'all 0.15s'
                            }, className: "hover-bg-slate-50 group", onClick: () => {
                                if (action.path)
                                    router.push(action.path);
                                if (action.action)
                                    action.action();
                                setIsOpen(false);
                            }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' }, children: [_jsx("div", { style: { width: 32, height: 32, borderRadius: 8, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003262' }, children: action.icon }), _jsx("span", { style: { fontSize: '0.875rem', fontWeight: 600, color: '#334155' }, children: action.title })] }), _jsx("div", { style: { fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }, children: action.shortcut })] }, action.id)))) }), _jsxs("div", { style: { padding: '0.75rem 1.25rem', background: '#f8fafc', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { style: { display: 'flex', gap: 12 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b' }, children: [_jsx("kbd", { style: { padding: '2px 4px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 4 }, children: "\u2191\u2193" }), " \u9078\u64C7"] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b' }, children: [_jsx("kbd", { style: { padding: '2px 4px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 4 }, children: "Enter" }), " \u57F7\u884C"] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--blue-700)' }, children: [_jsx(Zap, { size: 10 }), " Omni_Terminal Web"] })] })] }), _jsx("style", { children: `
        .hover-bg-slate-50:hover { background: #f1f5f9; }
        kbd { font-family: sans-serif; }
      ` })] }));
}
//# sourceMappingURL=CommandPalette.js.map