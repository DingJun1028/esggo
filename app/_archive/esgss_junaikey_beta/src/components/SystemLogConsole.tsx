import React, { useEffect, useState, memo, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { omniLogger, LogEntry } from '@/omni/infrastructure/logging/OmniLogger';

const MAX_LOG_ENTRIES = 50;
const LOG_THROTTLE_MS = 200;

export const SystemLogConsole = memo(() => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsBufferRef = useRef<LogEntry[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Real-Time Log Subscription
  useEffect(() => {
    // Subscribe to OmniLogger
    const unsubscribe = omniLogger.subscribe(log => {
      // ⚡ Bolt: Buffer logs to throttle updates to 200ms
      // Prevents re-render storms during high-frequency logging events
      logsBufferRef.current.push(log);

      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          const bufferedLogs = [...logsBufferRef.current];
          logsBufferRef.current = []; // Clear buffer immediately

          setLogs(prev => {
            const newLogs = [...prev, ...bufferedLogs];
            return newLogs.slice(-MAX_LOG_ENTRIES); // Keep last N logs
          });
          timeoutRef.current = null;
        }, LOG_THROTTLE_MS);
      }
    });

    return () => {
      unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-black/80 rounded-xl border border-white/10 p-4 font-mono text-xs overflow-hidden relative">
      <div className="absolute top-2 right-4 flex gap-1" aria-hidden="true">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div className="w-2 h-2 rounded-full bg-green-500" />
      </div>
      <div className="flex items-center gap-2 text-slate-500 mb-3 border-b border-white/5 pb-2">
        <Terminal className="w-3 h-3" />
        <span>OMNI_KERNEL_LOG_STREAM_V11.0</span>
      </div>
      <div
        className="space-y-1.5 h-32 overflow-y-auto custom-scrollbar flex flex-col-reverse focus-visible:ring-2 focus-visible:ring-white/20 outline-none rounded-md"
        role="log"
        aria-live="polite"
        aria-label="System Log Console"
        tabIndex={0}
      >
        {logs.map(log => (
          <div key={log.id} className="flex gap-3 animate-fade-in group">
            <span className="text-slate-600 opacity-50 text-[10px] group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span
              className={
                log.level === 'ERROR'
                  ? 'text-cyber-alert'
                  : log.level === 'WARN'
                    ? 'text-primary'
                    : log.category === 'AI'
                      ? 'text-cyber-blue'
                      : 'text-emerald-500'
              }
            >
              <span className="opacity-75">[{log.category}]</span> {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

SystemLogConsole.displayName = 'SystemLogConsole';
