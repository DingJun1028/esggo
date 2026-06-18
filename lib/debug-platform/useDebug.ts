import { useEffect, useCallback } from 'react';
import { DebugEvent, DebugLevel, DebugSnapshot } from './types';
import { debugService } from './DebugService';

export function useDebug() {
  const log = useCallback(
    (
      level: DebugLevel,
      source: string,
      message: string,
      context?: Record<string, unknown>,
      error?: Error | unknown
    ) => {
      return debugService.log(level, source, message, context, error);
    },
    []
  );

  const snapshot = useCallback((name: string, data: Record<string, unknown>, tags?: string[]) => {
    return debugService.snapshot(name, data, tags);
  }, []);

  const getEvents = useCallback(
    (filter?: { level?: DebugLevel; source?: string; limit?: number }) => {
      return debugService.getEvents(filter);
    },
    []
  );

  const getSnapshots = useCallback(() => {
    return debugService.getSnapshots();
  }, []);

  const clear = useCallback(() => {
    debugService.clear();
  }, []);

  const exportLogs = useCallback(() => {
    return debugService.exportLogs();
  }, []);

  return {
    log,
    debug: (source: string, message: string, context?: Record<string, unknown>) =>
      log('debug', source, message, context),
    info: (source: string, message: string, context?: Record<string, unknown>) =>
      log('info', source, message, context),
    warn: (source: string, message: string, context?: Record<string, unknown>) =>
      log('warn', source, message, context),
    error: (
      source: string,
      message: string,
      error?: Error | unknown,
      context?: Record<string, unknown>
    ) => log('error', source, message, context, error),
    snapshot,
    getEvents,
    getSnapshots,
    clear,
    exportLogs,
  };
}

export function useDebugSnapshot(
  name: string,
  data: Record<string, unknown>,
  deps: unknown[] = []
) {
  useEffect(() => {
    debugService.snapshot(name, data);
  }, deps);
}
