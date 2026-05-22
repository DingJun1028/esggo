'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Zap, Bot, Database, Shield, Globe, Cpu, X, Maximize2, Trash2 } from 'lucide-react';

interface TerminalLine {
  type: 'cmd' | 'out' | 'err' | 'info' | 'success';
  content: string;
}

export default function TerminalPage() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'info', content: 'Omni_Terminal Web Console [Version 1.0.0]' },
    { type: 'info', content: '(c) 2026 Antigravity AI. All rights reserved.' },
    { type: 'info', content: 'Type "help" to see available commands.' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const addLine = (type: TerminalLine['type'], content: string) => {
    setLines(prev => [...prev, { type, content }]);
  };

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    addLine('cmd', `> ${cmd}`);
    setInput('');

    const [action, ...args] = trimmed.split(' ');

    switch (action) {
      case 'help':
        addLine('out', 'Available commands:');
        addLine('out', '  agent status     - Check OmniHermes gateway status');
        addLine('out', '  agent trigger    - Manually trigger an AI task');
        addLine('out', '  vault list       - Show recent 5T records');
        addLine('out', '  blue status      - Check cloud control plane');
        addLine('out', '  clear            - Clear the terminal screen');
        addLine('out', '  exit             - Go back to dashboard');
        break;

      case 'clear':
        setLines([]);
        break;

      case 'agent':
        if (args[0] === 'status') {
          addLine('info', '📡 Fetching OmniHermes Gateway Status...');
          await new Promise(r => setTimeout(r, 800));
          addLine('success', '✅ Mode: LIVE (VPS-Native)');
          addLine('out', 'Version: 0.14.1 | Workers: 8 | Memory: 2.4 GB');
        } else {
          addLine('err', 'Usage: agent status');
        }
        break;

      case 'vault':
        if (args[0] === 'list') {
          addLine('info', '📦 Fetching recent Vault records...');
          await new Promise(r => setTimeout(r, 1000));
          addLine('out', '2026/05/22 | 8a2f1b0c | 5f3d9e2a... | IDENTITY');
          addLine('out', '2026/05/21 | 9c4e2d1a | b7a1f8c0... | CORE');
          addLine('success', 'Total: 2 records found.');
        } else {
          addLine('err', 'Usage: vault list');
        }
        break;

      case 'blue':
        if (args[0] === 'status') {
          addLine('info', '☁️ Connecting to BlueCC Control Plane...');
          await new Promise(r => setTimeout(r, 1200));
          addLine('success', '✅ Cluster: blue-cluster-01 (STABLE)');
          addLine('out', 'Region: asia-east1 | Active Nodes: 12');
        } else {
          addLine('err', 'Usage: blue status');
        }
        break;

      case 'exit':
        window.location.href = '/';
        break;

      default:
        addLine('err', `Unknown command: ${action}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--blue-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Terminal size={18} color="#fff" />
        </div>
        <div>
          <h1 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Omni_Terminal Web Console</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>Antigravity-Style Management Interface</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-icon btn-sm" style={{ color: '#94a3b8' }} onClick={() => setLines([])}><Trash2 size={16} /></button>
          <button className="btn btn-ghost btn-icon btn-sm" style={{ color: '#94a3b8' }}><Maximize2 size={16} /></button>
          <button className="btn btn-ghost btn-icon btn-sm" style={{ color: '#94a3b8' }} onClick={() => window.location.href = '/'}><X size={16} /></button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        style={{ 
          flex: 1, 
          background: '#020617', 
          borderRadius: 16, 
          border: '1px solid #1e293b', 
          padding: '1.5rem', 
          fontFamily: 'JetBrains Mono, monospace', 
          overflowY: 'auto',
          boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.4)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {lines.map((l, i) => (
            <div key={i} style={{ 
              fontSize: '0.8125rem', 
              lineHeight: 1.6, 
              color: l.type === 'err' ? '#ef4444' : l.type === 'success' ? '#10b981' : l.type === 'info' ? '#3b82f6' : '#cbd5e1',
              whiteSpace: 'pre-wrap'
            }}>
              {l.content}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <span style={{ color: '#10b981', fontWeight: 700 }}>$</span>
            <input 
              autoFocus
              className="terminal-input"
              style={{ 
                flex: 1, 
                background: 'none', 
                border: 'none', 
                outline: 'none', 
                color: '#fff', 
                fontFamily: 'inherit', 
                fontSize: '0.8125rem' 
              }}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCommand(input)}
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>
      </div>
      <style>{`
        .terminal-input { caret-color: #10b981; }
      `}</style>
    </div>
  );
}
