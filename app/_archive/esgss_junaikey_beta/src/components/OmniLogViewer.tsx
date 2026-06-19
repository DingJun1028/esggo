import React, { memo, useState, useEffect, useCallback, type UIEvent } from 'react';
import {
  X,
  Download,
  Trash2,
  Filter,
  Search,
  AlertCircle,
  Info,
  AlertTriangle,
  Bug,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { omniLogger, LogLevel, LogCategory, type LogEntry } from '@/services/omniLogger';
import { useConfirm } from '@/hooks/useConfirm';

interface LogViewerProps {
  readonly onClose: () => void;
}

const getLevelColor = (level: LogLevel): string => {
  switch (level) {
    case LogLevel.DEBUG:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    case LogLevel.INFO:
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case LogLevel.WARN:
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case LogLevel.ERROR:
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case LogLevel.CRITICAL:
      return 'bg-red-600/40 text-red-300 border-red-600/50';
  }
};

const getLevelIcon = (level: LogLevel) => {
  switch (level) {
    case LogLevel.DEBUG:
      return <Bug className="w-3 h-3" />;
    case LogLevel.INFO:
      return <Info className="w-3 h-3" />;
    case LogLevel.WARN:
      return <AlertTriangle className="w-3 h-3" />;
    case LogLevel.ERROR:
    case LogLevel.CRITICAL:
      return <AlertCircle className="w-3 h-3" />;
  }
};

const LogEntryRow = memo<{ log: LogEntry }>(({ log }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${log.level === LogLevel.CRITICAL ? 'bg-red-900/10' : ''
        }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <Badge
          className={`${getLevelColor(log.level)} flex items-center gap-1 text-[10px] font-mono px-2 py-0.5`}
        >
          {getLevelIcon(log.level)}
          {log.level}
        </Badge>
        <Badge variant="outline" className="text-[9px] font-mono px-1.5 py-0.5">
          {log.category}
        </Badge>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-200 font-mono">{log.message}</div>
          <div className="text-[10px] text-gray-500 mt-1 font-mono">
            {log.timestamp.toLocaleString()}
          </div>
        </div>
      </div>
      {expanded && (log.details || log.stack) && (
        <div className="mt-3 pl-12 space-y-2">
          {!!log.details && (
            <div className="bg-black/40 p-3 rounded border border-white/10">
              <div className="text-[9px] text-gray-500 mb-1 uppercase">詳細資訊</div>
              <pre className="text-[11px] text-gray-300 font-mono overflow-x-auto">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </div>
          )}
          {log.stack && (
            <div className="bg-black/40 p-3 rounded border border-red-900/30">
              <div className="text-[9px] text-red-500 mb-1 uppercase">堆疊追蹤</div>
              <pre className="text-[10px] text-red-300/70 font-mono overflow-x-auto whitespace-pre-wrap">
                {log.stack}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

LogEntryRow.displayName = 'LogEntryRow';

export const OmniLogViewer = memo<LogViewerProps>(({ onClose }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [displayCount, setDisplayCount] = useState(50); // ⚡ Bolt: Pagination state
  const [filterLevel, setFilterLevel] = useState<LogLevel | undefined>();
  const [filterCategory, setFilterCategory] = useState<LogCategory | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  // ⚡ Bolt: Debounce search to prevent expensive log filtering on every keystroke
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const DEBOUNCE_DELAY_MS = 300;

  // ⚡ Bolt: Update debounced value after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, DEBOUNCE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ⚡ Bolt: Reset pagination when filters change
  useEffect(() => {
    setDisplayCount(50);
  }, [filterLevel, filterCategory, debouncedSearchQuery]);

  const refreshLogs = useCallback(() => {
    const filtered = omniLogger.getLogs({
      level: filterLevel,
      category: filterCategory,
      search: debouncedSearchQuery || undefined,
    });
    setLogs(filtered);
  }, [filterLevel, filterCategory, debouncedSearchQuery]);

  // ⚡ Bolt: Infinite scroll handler
  const handleScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      // Load more when within 50px of bottom
      if (scrollHeight - scrollTop - clientHeight < 50) {
        setDisplayCount(prev => {
          if (prev >= logs.length) return prev;
          return prev + 50;
        });
      }
    },
    [logs.length]
  );

  const visibleLogs = logs.slice(0, displayCount);

  useEffect(() => {
    refreshLogs();

    if (autoRefresh) {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      // ⚡ Bolt: Throttle log updates to 200ms to prevent UI freezing during log bursts
      // This reduces re-renders significantly when hundreds of logs are emitted in a short time.
      const unsubscribe = omniLogger.subscribe(() => {
        if (!timeoutId) {
          timeoutId = setTimeout(() => {
            refreshLogs();
            timeoutId = null;
          }, 200);
        }
      });

      return () => {
        unsubscribe();
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }

    return undefined; // No cleanup needed when autoRefresh is false
  }, [refreshLogs, autoRefresh]);

  const confirm = useConfirm();

  const handleClearLogs = useCallback(async () => {
    const ok = await confirm({
      title: '清除所有日誌',
      message: '您確定要清除所有日誌嗎？此操作不可恢復。',
      variant: 'danger',
      confirmLabel: '確認清除',
      cancelLabel: '取消'
    });

    if (ok) {
      omniLogger.clearLogs();
      refreshLogs();
    }
  }, [refreshLogs, confirm]);

  const handleExport = useCallback((format: 'json' | 'csv' | 'txt') => {
    omniLogger.downloadLogs(format);
  }, []);

  const stats = omniLogger.getStats();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-6xl h-[90vh] bg-neutral-900/95 border-[#00FFFF]/30 flex flex-col">
        <CardHeader className="border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-[#00FFFF] flex items-center gap-2">
                <Bug className="w-5 h-5" aria-hidden="true" />
                全知日誌 (OmniLogs)
              </CardTitle>
              <div className="flex gap-2 text-[10px] font-mono">
                <Badge className="bg-blue-500/20 text-blue-400">總數: {stats.total}</Badge>
                {stats.errors > 0 && (
                  <Badge className="bg-red-500/20 text-red-400">錯誤: {stats.errors}</Badge>
                )}
                {stats.warnings > 0 && (
                  <Badge className="bg-yellow-500/20 text-yellow-400">警告: {stats.warnings}</Badge>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded transition-colors"
              aria-label="Close log viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-wrap gap-3">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00FFFF]/50"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="搜尋日誌關鍵字..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-black/40 border border-white/10 rounded text-sm focus:outline-none focus:border-[#00FFFF]/50 text-white placeholder-gray-500"
              />
            </div>

            {/* Level Filter */}
            <select
              value={filterLevel || ''}
              onChange={e => setFilterLevel((e.target.value as LogLevel) || undefined)}
              className="px-3 py-2 bg-black/40 border border-white/10 rounded text-sm focus:outline-none focus:border-[#00FFFF]/50 text-white"
            >
              <option value="">所有層級</option>
              {Object.values(LogLevel).map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={filterCategory || ''}
              onChange={e => setFilterCategory((e.target.value as LogCategory) || undefined)}
              className="px-3 py-2 bg-black/40 border border-white/10 rounded text-sm focus:outline-none focus:border-[#00FFFF]/50 text-white"
            >
              <option value="">所有分類</option>
              {Object.values(LogCategory).map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => handleExport('json')}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Download className="w-3 h-3 mr-1" aria-hidden="true" /> JSON
              </Button>
              <Button
                onClick={() => handleExport('csv')}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                CSV
              </Button>
              <Button
                onClick={handleClearLogs}
                variant="outline"
                size="sm"
                className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-3 h-3 mr-1" aria-hidden="true" /> 清除
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-0" onScroll={handleScroll}>
          {visibleLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Bug className="w-12 h-12 mb-3 opacity-30" aria-hidden="true" />
              <p>目前沒有日誌記錄</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {visibleLogs.map(log => (
                <LogEntryRow key={log.id} log={log} />
              ))}
              {visibleLogs.length < logs.length && (
                <div className="p-4 text-center text-xs text-gray-500 animate-pulse">
                  載入更多日誌... ({visibleLogs.length} / {logs.length})
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

OmniLogViewer.displayName = 'OmniLogViewer';
