// @ts-nocheck
import { DebugEvent, DebugLevel, DebugSnapshot, DebugMetrics, DebugConfig } from './types';

const DEBUG_LEVELS: Record<DebugLevel, number> = {
  verbose: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5,
};

export class DebugService {
  private static instance: DebugService;
  private config: DebugConfig = {
    enabled: process.env.NODE_ENV !== 'production',
    level: 'debug',
    bufferSize: 1000,
    captureConsole: true,
    captureErrors: true,
    captureWarnings: true,
  };
  private events: DebugEvent[] = [];
  private snapshots: DebugSnapshot[] = [];
  private originalConsole: Partial<Console> = {};
  private metrics: DebugMetrics = {
    totalEvents: 0,
    errorCount: 0,
    warnCount: 0,
  };

  public static getInstance(): DebugService {
    if (!DebugService.instance) {
      DebugService.instance = new DebugService();
    }
    return DebugService.instance;
  }

  private constructor() {
    this.setupGlobalHandlers();
  }

  private setupGlobalHandlers(): void {
    if (typeof window === 'undefined') return;

    if (this.config.captureConsole) {
      this.originalConsole = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error,
        debug: 'debug' in console ? console.debug : undefined,
      };

      console.log = (...args: unknown[]) => this.log('info', 'console', args.join(' '));
      console.info = (...args: unknown[]) => this.log('info', 'console', args.join(' '));
      console.warn = (...args: unknown[]) => this.log('warn', 'console', args.join(' '));
      console.error = (...args: unknown[]) => this.log('error', 'console', args.join(' '));
      if ('debug' in console) {
        console.debug = (...args: unknown[]) => this.log('debug', 'console', args.join(' '));
      }
    }

    if (this.config.captureErrors) {
      window.addEventListener('error', (e: ErrorEvent) => {
        this.log('error', 'window', e.message, {
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno,
          stack: e.error?.stack,
        });
      });

      window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
        this.log('error', 'promise', 'Unhandled Promise Rejection', {
          reason: String(e.reason),
          stack: e.reason?.stack,
        });
      });
    }
  }

  public configure(cfg: Partial<DebugConfig>): void {
    this.config = { ...this.config, ...cfg };
  }

  public log(
    level: DebugLevel,
    source: string,
    message: string,
    context?: Record<string, unknown>,
    error?: Error | unknown
  ): DebugEvent {
    if (!this.config.enabled || DEBUG_LEVELS[level] < DEBUG_LEVELS[this.config.level]) {
      return {} as DebugEvent;
    }

    const event: DebugEvent = {
      id: `debug-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      level,
      source,
      message,
      context,
      error,
      stack: error instanceof Error ? error.stack : undefined,
    };

    this.events.push(event);
    this.metrics.totalEvents++;

    if (level === 'error') this.metrics.errorCount++;
    if (level === 'warn') this.metrics.warnCount++;

    if (this.events.length > this.config.bufferSize) {
      this.events.shift();
    }

    if (this.config.captureConsole) {
      // Output through original console
      const originalMethod = this.originalConsole[level];
      if (originalMethod) {
        originalMethod('[Debug]', event);
      }
    }

    this.flushToRemote();

    return event;
  }

  public snapshot(name: string, data: Record<string, unknown>, tags?: string[]): DebugSnapshot {
    if (!this.config.enabled) return {} as DebugSnapshot;

    const snap: DebugSnapshot = {
      id: `snap-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      name,
      data,
      tags,
    };

    this.snapshots.push(snap);
    return snap;
  }

  public getEvents(filter?: { level?: DebugLevel; source?: string; limit?: number }): DebugEvent[] {
    let result = [...this.events];

    if (filter?.level) {
      result = result.filter((e) => e.level === filter.level);
    }
    if (filter?.source) {
      result = result.filter((e) => e.source === filter.source);
    }
    if (filter?.limit) {
      result = result.slice(-filter.limit);
    }

    return result;
  }

  public getSnapshots(limit: number = 50): DebugSnapshot[] {
    return [...this.snapshots].slice(-limit);
  }

  public getMetrics(): DebugMetrics {
    return { ...this.metrics };
  }

  public clear(): void {
    this.events = [];
    this.snapshots = [];
    this.metrics = {
      totalEvents: 0,
      errorCount: 0,
      warnCount: 0,
    };
  }

  public exportLogs(): string {
    return JSON.stringify(
      {
        events: this.events,
        snapshots: this.snapshots,
        metrics: this.metrics,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }

  private async flushToRemote(): Promise<void> {
    if (!this.config.remoteEndpoint) return;

    try {
      const payload = {
        events: this.events.slice(-10),
        timestamp: Date.now(),
      };

      fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch {
      // Silent fail to prevent infinite loops
    }
  }

  public destroy(): void {
    if (this.originalConsole.log) console.log = this.originalConsole.log;
    if (this.originalConsole.info) console.info = this.originalConsole.info;
    if (this.originalConsole.warn) console.warn = this.originalConsole.warn;
    if (this.originalConsole.error) console.error = this.originalConsole.error;
    if (this.originalConsole.debug) console.debug = this.originalConsole.debug;
  }
}

export const debugService = DebugService.getInstance();
