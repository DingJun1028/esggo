'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Command, Bot, Database, FileText, Layout, X, Zap, Shield, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ACTIONS = [
  { id: 'nav-dash', title: '前往 控制台', icon: <Layout size={16} />, shortcut: 'G D', path: '/' },
  { id: 'nav-editor', title: '前往 永續撰寫 sustaining writing', icon: <FileText size={16} />, shortcut: 'G E', path: '/editor' },
  { id: 'nav-vault', title: '前往 證據金庫 vault', icon: <Database size={16} />, shortcut: 'G V', path: '/vault' },
  { id: 'nav-swarm', title: '前往 代理蜂群 swarm', icon: <Bot size={16} />, shortcut: 'G S', path: '/swarm' },
  { id: 'cmd-seal', title: '執行 5T 全章節封印', icon: <Shield size={16} />, shortcut: '⌘ S', action: () => alert('正在啟動 5T 批次封印流程...') },
  { id: 'cmd-audit', title: '檢索 審計日誌', icon: <Search size={16} />, shortcut: '⌘ L', path: '/audit-log' },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  const filteredActions = ACTIONS.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 10000, background: 'rgba(0,50,98,0.4)', backdropFilter: 'blur(4px)' }} onClick={toggle}>
      <div 
        className="modal" 
        style={{ maxWidth: 640, top: '20%', transform: 'none', background: '#fff', borderRadius: '16px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Search size={20} className="text-slate-400" />
          <input 
            autoFocus
            className="input" 
            style={{ border: 'none', boxShadow: 'none', fontSize: '1rem', padding: '0.5rem 0' }}
            placeholder="輸入指令或搜尋頁面... (G D, G E, G V)" 
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', background: '#f1f5f9', borderRadius: 6, fontSize: 10, fontWeight: 700, color: '#94a3b8' }}>
            <Command size={10} /> K
          </div>
        </div>

        <div style={{ padding: '0.5rem', maxHeight: 320, overflowY: 'auto' }}>
          {filteredActions.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
              未找到符合的指令
            </div>
          ) : (
            filteredActions.map(action => (
              <div 
                key={action.id}
                style={{ 
                  padding: '0.75rem 1rem', 
                  borderRadius: 10, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                className="hover-bg-slate-50 group"
                onClick={() => {
                  if (action.path) router.push(action.path);
                  if (action.action) action.action();
                  setIsOpen(false);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003262' }}>
                    {action.icon}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>{action.title}</span>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>
                  {action.shortcut}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ padding: '0.75rem 1.25rem', background: '#f8fafc', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b' }}>
              <kbd style={{ padding: '2px 4px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 4 }}>↑↓</kbd> 選擇
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b' }}>
              <kbd style={{ padding: '2px 4px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 4 }}>Enter</kbd> 執行
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--blue-700)' }}>
            <Zap size={10} /> Omni_Terminal Web
          </div>
        </div>
      </div>
      <style>{`
        .hover-bg-slate-50:hover { background: #f1f5f9; }
        kbd { font-family: sans-serif; }
      `}</style>
    </div>
  );
}
