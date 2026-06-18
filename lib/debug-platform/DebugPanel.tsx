'use client';

import React, { useState, useEffect } from 'react';
import {
  Bug,
  Activity,
  Shield,
  Download,
  Trash2,
  X,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  FileText,
  Clock,
} from 'lucide-react';
import { debugService } from './DebugService';
import type { DebugLevel, DebugSnapshot, DebugEvent } from './types';

const LEVEL_COLORS: Record<DebugLevel, string> = {
  verbose: 'text-slate-400',
  debug: 'text-cyan-400',
  info: 'text-blue-400',
  warn: 'text-amber-400',
  error: 'text-red-400',
  fatal: 'text-red-600',
};

const LEVEL_ICONS: Record<DebugLevel, React.ReactNode> = {
  verbose: <Info size={12} />,
  debug: <Bug size={12} />,
  info: <Info size={12} />,
  warn: <AlertTriangle size={12} />,
  error: <AlertCircle size={12} />,
  fatal: <X size={12} />,
};

interface DebugPanelProps {
  defaultOpen?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function DebugPanel({ defaultOpen = false, position = 'bottom-right' }: DebugPanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [activeTab, setActiveTab] = useState<'logs' | 'snapshots' | 'metrics'>('logs');
  const [events, setEvents] = useState<DebugEvent[]>([]);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<DebugLevel | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('');

  useEffect(() => {
    const loadEvents = () => {
      const filtered =
        levelFilter === 'all'
          ? debugService.getEvents({ limit: 200 })
          : debugService.getEvents({ level: levelFilter, limit: 200 });
      setEvents(filtered);
    };

    loadEvents();
    const interval = setInterval(loadEvents, 2000);
    return () => clearInterval(interval);
  }, [levelFilter, sourceFilter]);

  const handleClear = () => {
    if (confirm('確定清除所有除錯記錄？')) {
      debugService.clear();
      setEvents([]);
    }
  };

  const handleExport = () => {
    const data = debugService.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `esggo-debug-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-cyan-500/20 border border-cyan-500/30 rounded-full flex items-center justify-center hover:bg-cyan-500/30 transition-all shadow-lg"
        aria-label="開啟除錯面板"
        title="除錯平台 (Debug Platform)"
      >
        <Bug size={20} className="text-cyan-400" />
      </button>
    );
  }

  return (
    <div
      className={`fixed ${
        position === 'bottom-right'
          ? 'bottom-4 right-4'
          : position === 'bottom-left'
          ? 'bottom-4 left-4'
          : position === 'top-right'
          ? 'top-4 right-4'
          : 'top-4 left-4'
      } z-50 w-96 max-h-[600px] bg-slate-900/95 border border-cyan-500/30 rounded-xl backdrop-blur-md shadow-xl flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Bug size={18} className="text-cyan-400" />
          <h3 className="text-sm font-bold text-white">除錯平台 (Debug Platform)</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleExport}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
            title="匯出記錄"
          >
            <Download size={14} />
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
            title="清除記錄"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="關閉"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex gap-1 px-3 py-2 border-b border-cyan-500/10">
        {(['logs', 'snapshots', 'metrics'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              activeTab === tab
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tab === 'logs' ? '日誌' : tab === 'snapshots' ? '快照' : '指標'}
          </button>
        ))}
      </div>

      {activeTab === 'logs' && (
        <div className="p-3 space-y-2 flex-1 overflow-y-auto">
          <div className="flex gap-2">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              className="flex-1 text-xs bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-300"
            >
              <option value="all">全部級別</option>
              {(['verbose', 'debug', 'info', 'warn', 'error', 'fatal'] as DebugLevel[]).map((l) => (
                <option key={l} value={l}>
                  {l.toUpperCase()}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="來源過濾..."
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-24 text-xs bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-300"
            />
          </div>

          <div className="space-y-1 max-h-80 overflow-y-auto">
            {events
              .slice(-50)
              .reverse()
              .map((event) => (
                <div
                  key={event.id}
                  className="border border-slate-700/50 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedEventId(expandedEventId === event.id ? null : event.id)
                    }
                    className="w-full p-2 flex items-center gap-2 text-left hover:bg-slate-800/50 transition-colors"
                  >
                    <span className={LEVEL_COLORS[event.level]}>{LEVEL_ICONS[event.level]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-slate-300 truncate">{event.source}</p>
                      <p className="text-xs text-slate-400 truncate">{event.message}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                    {expandedEventId === event.id ? (
                      <ChevronDown size={12} />
                    ) : (
                      <ChevronRight size={12} />
                    )}
                  </button>

                  {expandedEventId === event.id && (
                    <div className="p-3 bg-slate-950/50 border-t border-slate-700/50">
                      <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap break-all">
                        {JSON.stringify(
                          {
                            ...event,
                            stack: event.error instanceof Error ? event.error.stack : event.stack,
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            {events.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <p className="text-xs">尚無除錯事件記錄</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'snapshots' && (
        <div className="p-3 flex-1 overflow-y-auto">
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {debugService
              .getSnapshots()
              .slice(-20)
              .reverse()
              .map((snap) => (
                <div key={snap.id} className="border border-slate-700/50 rounded-lg p-3">
                  <p className="text-xs font-bold text-cyan-400">{snap.name}</p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {snap.tags?.map((t) => `#${t}`).join(' ')}
                  </p>
                  <pre className="text-xs text-slate-400 mt-2 font-mono truncate">
                    {JSON.stringify(snap.data).substring(0, 200)}...
                  </pre>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="p-3 flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400">總事件數</p>
                <p className="text-xl font-bold text-cyan-400">
                  {debugService.getMetrics().totalEvents}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400">錯誤數</p>
                <p className="text-xl font-bold text-red-400">
                  {debugService.getMetrics().errorCount}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400">警告數</p>
                <p className="text-xl font-bold text-amber-400">
                  {debugService.getMetrics().warnCount}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400">快照數</p>
                <p className="text-xl font-bold text-emerald-400">
                  {debugService.getSnapshots().length}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Activity size={12} /> 最新事件來源分布
              </h4>
              <div className="space-y-1">
                {Object.entries(
                  events.reduce((acc, e) => {
                    acc[e.source] = (acc[e.source] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([source, count]) => (
                  <div key={source} className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-mono">{source}</span>
                    <span className="text-cyan-400 font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
