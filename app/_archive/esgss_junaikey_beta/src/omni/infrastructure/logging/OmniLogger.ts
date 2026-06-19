// OmniLogger Service - Omni Log System
// Tracks runtime logs, errors, and development activities
// [Compliance Protocol] 4 Yes + 1 No Protocol (Traceable, Trackable, Calculable, Immutable, Locked)

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export enum LogCategory {
  SYSTEM = 'SYSTEM',
  API = 'API',
  UI = 'UI',
  DATA = 'DATA',
  AUTH = 'AUTH',
  PERFORMANCE = 'PERFORMANCE',
  GENESIS = 'GENESIS', // New category for Genesis Protocol
  DEVELOPMENT = 'DEVELOPMENT',
  AI = 'AI',
  LEGION = 'LEGION',
  ESG = 'ESG',
  GAME = 'GAME',
  SEC = 'SEC',
  SECURITY = 'SECURITY',
  AGENT = 'AGENT',
  KNOWLEDGE = 'KNOWLEDGE',
  USER = 'USER',
  INTEGRATION = 'INTEGRATION',
  ACTIVE_AGENT = 'ACTIVE_AGENT',
  GROWTH = 'GROWTH',
  BUSINESS = 'BUSINESS',
  USER_ACTION = 'USER_ACTION',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  MEMORY = 'MEMORY',
  FINANCE = 'FINANCE',
  GOVERNANCE = 'GOVERNANCE',
  VALIDATION = 'VALIDATION',
  ETHICS = 'ETHICS',
  BLOCKCHAIN = 'BLOCKCHAIN',
  SOVEREIGN = 'SOVEREIGN',
  ORIGIN = 'ORIGIN',
  AGENCY = 'AGENCY',
  STRATEGY = 'STRATEGY',
  NETWORK = 'NETWORK',
  SYNC = 'SYNC',
}

export interface IOmniLogPayload {
  readonly message: string; // Log message content
  readonly level: LogLevel; // 🔴 Immutable: Log level
  readonly category: LogCategory; // Category
  readonly source_origin: string; // 🟢 Traceable: Marking call source (e.g., "AuthService.login")
  readonly trace_id: string; // 🔵 Trackable: UUID linking the entire request lifecycle
  readonly metadata?: Record<string, unknown>; // Data carrier
  readonly formula_ref?: string; // 🟠 Calculable: If algorithms are involved, mark the formula source
  readonly timestamp: number; // Inscribed timestamp
  readonly hash_lock?: string; // 🔒 Hash Lock
}

// Backend storage compliant LogEntry
export interface LogEntry extends IOmniLogPayload {
  readonly id: string;
  // Legacy support fields mapping
  readonly details?: unknown;
  readonly stack?: string;
  readonly userAgent?: string;
  readonly url?: string;
}

/**
 * Handles persistence of logs to localStorage.
 * Best Practice: Separates storage concerns from logging logic.
 */
class LogStorage {
  private readonly logKey = 'omni_logs';
  private readonly maxPersistedLogs = 200; // Best Practice: Use a constant for magic numbers, increased for better context.

  constructor(private onError: (message: string, error: unknown) => void) { }

  public load(): LogEntry[] {
    if (typeof globalThis.localStorage === 'undefined') return [];
    try {
      const stored = globalThis.localStorage.getItem(this.logKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Basic type safety check
        if (Array.isArray(parsed)) {
          return parsed.map((log: any) => ({
            ...log,
            timestamp: log.timestamp || Date.now(),
          }));
        }
      }
    } catch (error) {
      this.onError('Failed to load persisted logs', error);
    }
    return [];
  }

  public persist(logs: LogEntry[]): void {
    if (typeof globalThis.localStorage === 'undefined') return;
    try {
      // Persist only the most recent logs to avoid exceeding localStorage limits
      const recent = logs.slice(-this.maxPersistedLogs);
      globalThis.localStorage.setItem(this.logKey, JSON.stringify(recent));
    } catch (error) {
      this.onError('Failed to save logs', error);
    }
  }

  public clear(): void {
    if (typeof globalThis.localStorage !== 'undefined') {
      globalThis.localStorage.removeItem(this.logKey);
    }
  }
}

/**
 * Best Practice: Encapsulates backup and restore functionality.
 * Manages storing, retrieving, and downloading log backups from localStorage.
 */
class BackupManager {
  private readonly backupPrefix = 'omni_backup_';
  private autoBackupInterval?: any;

  // Takes a reference to the logger to log its own operations and access logs.
  constructor(private logger: OmniLoggerService) { }

  public createBackup(name?: string): string {
    const backupName = name || `backup_${new Date().toISOString()}`;
    const backup = {
      name: backupName,
      timestamp: new Date().toISOString(),
      logs: this.logger.getLogs(undefined, true), // Get all logs, in chronological order
      stats: this.logger.getStats(),
      version: '1.0.0',
    };

    try {
      if (typeof globalThis.localStorage !== 'undefined') {
        globalThis.localStorage.setItem(`${this.backupPrefix}${backupName}`, JSON.stringify(backup));
      }
      this.logger.info(LogCategory.DEVELOPMENT, `Backup Created: ${backupName}`, {
        logsCount: backup.logs.length,
      });
      return backupName;
    } catch (error) {
      this.logger.error(LogCategory.SYSTEM, 'Backup Creation Failed', { error });
      throw error;
    }
  }

  public enableAutoBackup(intervalMinutes: number = 60) {
    if (this.autoBackupInterval && typeof globalThis.clearInterval !== 'undefined') {
      globalThis.clearInterval(this.autoBackupInterval);
    }

    this.createBackup(`auto_${Date.now()}`);

    if (typeof globalThis.setInterval !== 'undefined') {
      this.autoBackupInterval = globalThis.setInterval(
        () => {
          this.createBackup(`auto_${Date.now()}`);
          this.cleanOldBackups(10);
        },
        intervalMinutes * 60 * 1000
      );

      this.logger.info(LogCategory.SYSTEM, `Auto-backup Enabled (Interval: ${intervalMinutes}m)`);
    }
  }

  public disableAutoBackup() {
    if (this.autoBackupInterval && typeof globalThis.clearInterval !== 'undefined') {
      globalThis.clearInterval(this.autoBackupInterval);
      this.autoBackupInterval = undefined;
      this.logger.info(LogCategory.SYSTEM, 'Auto-backup Disabled');
    }
  }

  public listBackups(): Array<{ name: string; timestamp: string; logsCount: number }> {
    const backups: Array<{ name: string; timestamp: string; logsCount: number }> = [];

    if (typeof globalThis.localStorage === 'undefined') return backups;

    for (let i = 0; i < globalThis.localStorage.length; i++) {
      const key = globalThis.localStorage.key(i);
      if (key?.startsWith(this.backupPrefix)) {
        try {
          const item = globalThis.localStorage.getItem(key);
          if (!item) continue;
          const data = JSON.parse(item);
          backups.push({
            name: data.name,
            timestamp: data.timestamp,
            logsCount: data.logs?.length || 0,
          });
        } catch (error) {
          console.warn('Failed to read backup:', key, error);
        }
      }
    }

    return backups.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public restoreBackup(backupName: string): boolean {
    try {
      if (typeof globalThis.localStorage === 'undefined') return false;
      const backupData = globalThis.localStorage.getItem(`${this.backupPrefix}${backupName}`);
      if (!backupData) {
        this.logger.error(LogCategory.SYSTEM, `Backup not found: ${backupName}`);
        return false;
      }

      const backup = JSON.parse(backupData);
      this.logger.setLogs(backup.logs); // Assumes logger has a setLogs method

      this.logger.info(LogCategory.SYSTEM, `Restored from Backup: ${backupName}`, {
        logsCount: backup.logs.length,
      });

      return true;
    } catch (error) {
      this.logger.error(LogCategory.SYSTEM, 'Backup Restoration Failed', {
        backupName,
        error,
      });
      return false;
    }
  }

  public deleteBackup(backupName: string): boolean {
    try {
      if (typeof globalThis.localStorage !== 'undefined') {
        globalThis.localStorage.removeItem(`${this.backupPrefix}${backupName}`);
      }
      this.logger.info(LogCategory.DEVELOPMENT, `Backup Deleted: ${backupName}`);
      return true;
    } catch (error) {
      this.logger.error(LogCategory.SYSTEM, 'Backup Deletion Failed', {
        backupName,
        error,
      });
      return false;
    }
  }

  public cleanOldBackups(keepCount: number = 10) {
    const backups = this.listBackups();
    const toDelete = backups.slice(keepCount);

    toDelete.forEach(backup => {
      this.deleteBackup(backup.name);
    });

    if (toDelete.length > 0) {
      this.logger.info(LogCategory.DEVELOPMENT, `Cleaned up ${toDelete.length} old backups`);
    }
  }

  public downloadBackup(backupName: string) {
    try {
      if (typeof globalThis.localStorage === 'undefined' || typeof globalThis.document === 'undefined') {
        this.logger.error(LogCategory.SYSTEM, 'Backup download not supported in this environment');
        return;
      }
      const backupData = globalThis.localStorage.getItem(`${this.backupPrefix}${backupName}`);
      if (!backupData) {
        this.logger.error(LogCategory.SYSTEM, `Backup does not exist: ${backupName}`);
        return;
      }

      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${backupName}.json`;
      a.click();
      URL.revokeObjectURL(url);

      this.logger.info(LogCategory.DEVELOPMENT, `Backup Downloaded: ${backupName}`);
    } catch (error) {
      this.logger.error(LogCategory.SYSTEM, 'Backup Download Failed', {
        backupName,
        error,
      });
    }
  }

  public async importBackup(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const backup = JSON.parse(text);

      if (!backup.logs || !backup.name) {
        throw new Error('Invalid backup file format');
      }

      if (typeof globalThis.localStorage !== 'undefined') {
        globalThis.localStorage.setItem(`${this.backupPrefix}${backup.name}`, text);
      }
      this.logger.info(LogCategory.DEVELOPMENT, `Backup imported: ${backup.name}`);
      return true;
    } catch (error) {
      this.logger.error(LogCategory.SYSTEM, 'Backup import failed', { error });
      return false;
    }
  }
}

export class OmniLoggerService {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private listeners: Set<(log: LogEntry) => void> = new Set();
  private isLogging = false;
  private storage: LogStorage;
  private backupManager: BackupManager;
  // ⚡ Bolt Optimization: Cache for search strings to avoid repetitive JSON.stringify calls
  private searchCache = new WeakMap<LogEntry, string>();

  // ⚡ Bolt Optimization: Running stats cache for O(1) access
  private _stats = {
    total: 0,
    byLevel: {} as Record<LogLevel, number>,
    byCategory: {} as Record<LogCategory, number>,
    errors: 0,
    warnings: 0,
  };

  private isProduction = (() => {
    try {
      // Safe access for Vite env
      // @ts-ignore
      return typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.PROD : false;
    } catch {
      return false;
    }
  })();

  constructor() {
    this.storage = new LogStorage((message, error) => {
      console.warn(`[LogStorage] ${message}`, error);
    });
    // Must instantiate backupManager after the logger is minimally available
    this.backupManager = new BackupManager(this);
    this.logs = this.storage.load();
    this.calculateInitialStats();
    this.setupGlobalErrorHandlers();
    this.info('System_Core', 'Omni Logger System Started', {
      source_origin: 'OmniLogger.constructor',
    });
  }

  // ⚡ Bolt Optimization: Helper to reset stats
  private resetStats() {
    this._stats = {
      total: 0,
      byLevel: {} as Record<LogLevel, number>,
      byCategory: {} as Record<LogCategory, number>,
      errors: 0,
      warnings: 0,
    };
  }

  // ⚡ Bolt Optimization: Helper to calculate stats from scratch
  private calculateInitialStats() {
    this.resetStats();
    this.logs.forEach(log => this.updateStats(log, 1));
  }

  // ⚡ Bolt Optimization: Update stats incrementally (O(1))
  private updateStats(log: LogEntry, delta: 1 | -1) {
    this._stats.total += delta;

    const levelCount = this._stats.byLevel[log.level] || 0;
    this._stats.byLevel[log.level] = Math.max(0, levelCount + delta);

    const catCount = this._stats.byCategory[log.category] || 0;
    this._stats.byCategory[log.category] = Math.max(0, catCount + delta);

    if (log.level === LogLevel.ERROR || log.level === LogLevel.CRITICAL) {
      this._stats.errors = Math.max(0, this._stats.errors + delta);
    }
    if (log.level === LogLevel.WARN) {
      this._stats.warnings = Math.max(0, this._stats.warnings + delta);
    }
  }

  // Setup global error handling
  private setupGlobalErrorHandlers() {
    if (typeof globalThis.window !== 'undefined') {
      globalThis.window.addEventListener('error', this.handleGlobalError);
      globalThis.window.addEventListener('unhandledrejection', this.handlePromiseRejection);
    }
  }

  private handleGlobalError = (event: ErrorEvent) => {
    this.error(LogCategory.SYSTEM, `Unhandled Error: ${event.message}`, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      source_origin: 'GlobalErrorHandler',
    });
  };

  private handlePromiseRejection = (event: PromiseRejectionEvent) => {
    this.error(LogCategory.SYSTEM, `Unhandled Promise Rejection: ${event.reason}`, {
      reason: event.reason,
      source_origin: 'GlobalPromiseHandler',
    });
  };

  // Core Hash Lock Generation (Cryptographically Secure)
  private async generateHashLock(payload: any): Promise<string> {
    const crypto = globalThis.crypto;
    if (crypto?.subtle) {
      try {
        const str = JSON.stringify(payload);
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        console.warn('[OmniLogger] SHA-256 hashing failed, falling back to simple hash.', e);
      }
    }

    try {
      const str = JSON.stringify(payload);
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      return `fallback_${hash.toString(16)}`;
    } catch (e) {
      return 'hash_error';
    }
  }

  // Console output (with styling)
  private consoleLog(entry: LogEntry) {
    const styles = {
      [LogLevel.DEBUG]: 'color: #888',
      [LogLevel.INFO]: 'color: #0f0; font-weight: bold',
      [LogLevel.WARN]: 'color: #ff0; font-weight: bold',
      [LogLevel.ERROR]: 'color: #f00; font-weight: bold',
      [LogLevel.CRITICAL]: 'color: #f00; background: #fff; font-weight: bold; padding: 2px 4px',
    };

    const timestamp = new Date(entry.timestamp).toISOString();
    console.log(
      `%c[${entry.level}]%c [${entry.category}] ${timestamp} - ${entry.message}`,
      styles[entry.level] || 'color: inherit',
      'color: inherit');
    if (entry.details) console.log('[OmniLogger] Details:', entry.details);
    if (entry.stack) console.log('[OmniLogger] Stack:', entry.stack);
  }

  // General logging method (4 Yes + 1 No Protocol Payload)
  public logPayload(payload: IOmniLogPayload): void {
    if (this.isLogging) return;

    try {
      this.isLogging = true;

      const entry: LogEntry = {
        ...payload,
        id: `log_${payload.timestamp}_${Math.random().toString(36).substr(2, 9)}`,
        details: payload.metadata,
        userAgent: typeof globalThis.navigator !== 'undefined' ? globalThis.navigator.userAgent : 'NodeServer',
        url: typeof globalThis.window !== 'undefined' ? globalThis.window.location.href : 'server-internal',
      };

      Object.freeze(entry);

      // ⚡ Bolt Optimization: Update stats incrementally
      this.updateStats(entry, 1);

      this.logs.push(entry);

      // ⚡ Bolt Optimization: Use shift() to remove old logs and update stats
      while (this.logs.length > this.maxLogs) {
        const removed = this.logs.shift();
        if (removed) {
          this.updateStats(removed, -1);
        }
      }

      this.listeners.forEach(listener => listener(entry));

      if (!this.isProduction) {
        this.consoleLog(entry);
      }

      if (this.logs.length % 10 === 0) {
        this.storage.persist(this.logs);
      }

      if (payload.level === LogLevel.CRITICAL || payload.level === LogLevel.ERROR) {
        this.storage.persist(this.logs);
      }
    } finally {
      this.isLogging = false;
    }
  }

  // Legacy method overload for backward compatibility
  async log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    details?: unknown,
    stack?: string
  ) {
    const detailsRecord = (details && typeof details === 'object' ? details : {}) as Record<
      string,
      unknown
    >;
    const timestamp = Date.now();
    let hash_lock: string | undefined;

    if (level === LogLevel.ERROR || level === LogLevel.CRITICAL) {
      hash_lock = await this.generateHashLock({ message, timestamp });
    }

    const payload: IOmniLogPayload = {
      level,
      category,
      message,
      metadata: detailsRecord,
      source_origin:
        typeof detailsRecord.source_origin === 'string'
          ? detailsRecord.source_origin
          : 'Legacy_Call',
      trace_id:
        typeof detailsRecord.trace_id === 'string' ? detailsRecord.trace_id : `trace_${timestamp}`,
      timestamp,
      hash_lock,
    };

    this.logPayload(payload);
  }

  private toLogCategory(category: string): LogCategory {
    return Object.values(LogCategory).includes(category as any)
      ? (category as LogCategory)
      : LogCategory.SYSTEM;
  }

  // Convenience methods
  debug(category: LogCategory | string, message: string, details?: unknown) {
    this.log(LogLevel.DEBUG, this.toLogCategory(category), message, details).catch(err =>
      console.error('[OmniLogger] Asynchronous log failed in debug:', err)
    );
  }

  info(category: LogCategory | string, message: string, details?: unknown) {
    this.log(LogLevel.INFO, this.toLogCategory(category), message, details).catch(err =>
      console.error('[OmniLogger] Asynchronous log failed in info:', err)
    );
  }

  warn(category: LogCategory | string, message: string, details?: unknown) {
    this.log(LogLevel.WARN, this.toLogCategory(category), message, details).catch(err =>
      console.error('[OmniLogger] Asynchronous log failed in warn:', err)
    );
  }

  error(messageOrCategory: LogCategory | string, messageOrDetails?: string | unknown, details?: unknown) {
    // 判斷參數模式
    let category: LogCategory;
    let message: string;
    let finalDetails: unknown;

    if (typeof messageOrDetails === 'string') {
      // 模式 1: error(category, message, details?)
      category = this.toLogCategory(messageOrCategory);
      message = messageOrDetails;
      finalDetails = details;
    } else {
      // 模式 2: error(message, details?)
      category = LogCategory.SYSTEM;
      message = typeof messageOrCategory === 'string' ? messageOrCategory : 'Error';
      finalDetails = messageOrDetails;
    }

    const stack = new Error().stack;
    const enrichedDetails = { ...(finalDetails && typeof finalDetails === 'object' ? finalDetails : {}), stack };
    this.log(LogLevel.ERROR, category, message, enrichedDetails, stack).catch(
      err => console.error('[OmniLogger] Asynchronous log failed in error:', err)
    );
  }

  critical(category: LogCategory | string, message: string, details?: unknown) {
    const stack = new Error().stack;
    const enrichedDetails = { ...(details && typeof details === 'object' ? details : {}), stack };
    this.log(
      LogLevel.CRITICAL,
      this.toLogCategory(category),
      message,
      enrichedDetails,
      stack
    ).catch(err => console.error('[OmniLogger] Asynchronous log failed in critical:', err));
  }

  /**
   * Sovereign Audit Log
   * 🔒 Immutable sovereign audit, used to record major system transformations or sealing actions.
   */
  async sovereignAudit(operation: string, metadata: any = {}) {
    const timestamp = Date.now();
    const hash_lock = await this.generateHashLock({ operation, timestamp, metadata });

    const payload: IOmniLogPayload = {
      level: LogLevel.CRITICAL,
      category: LogCategory.SOVEREIGN,
      message: `[Sovereign Audit] ${operation}`,
      metadata: {
        ...metadata,
        epoch: '10.1.0-ULTIMATE',
        signature: 'ORIGIN_SEAL_ACTIVE',
      },
      source_origin: 'OmniLogger.sovereignAudit',
      trace_id: `audit_${timestamp}`,
      timestamp,
      hash_lock,
    };

    console.log(
      '%c[SOVEREIGN AUDIT]%c ' + operation,
      'color: #ffd700; font-weight: bold; background: #000; padding: 2px 4px',
      'color: #fff'
    );
    this.logPayload(payload);
  }

  /**
   * Internal method to set logs, primarily for backup restoration.
   * @param newLogs The new array of log entries.
   * @internal
   */
  public setLogs(newLogs: any[]) {
    // Best Practice: Ensure backwards compatibility with different timestamp formats
    this.logs = newLogs.map((log: any) => ({
      ...log,
      timestamp:
        typeof log.timestamp === 'string'
          ? new Date(log.timestamp).getTime()
          : typeof log.timestamp === 'number'
            ? log.timestamp
            : Date.now(),
    }));
    this.storage.persist(this.logs);
    this.calculateInitialStats(); // Recalculate stats
  }

  // ⚡ Bolt Optimization: Memoize the searchable string computation
  private getCachedSearchString(log: LogEntry): string {
    if (this.searchCache.has(log)) {
      return this.searchCache.get(log)!;
    }
    // Expensive operation: JSON.stringify + toLowerCase
    const str = (log.message + ' ' + JSON.stringify(log.details || '')).toLowerCase();
    this.searchCache.set(log, str);
    return str;
  }

  // Get logs
  getLogs(
    filter?: {
      level?: LogLevel;
      category?: LogCategory;
      startTime?: Date;
      endTime?: Date;
      search?: string;
    },
    chronological = false
  ): LogEntry[] {
    // ⚡ Bolt Optimization: Single-pass filtering to avoid multiple array allocations and iterations
    let filtered: LogEntry[];

    if (filter) {
      const startTs = filter.startTime ? new Date(filter.startTime).getTime() : 0;
      const endTs = filter.endTime ? new Date(filter.endTime).getTime() : Infinity;
      const search = filter.search ? filter.search.toLowerCase() : null;

      filtered = this.logs.filter(log => {
        if (filter.level && log.level !== filter.level) return false;
        if (filter.category && log.category !== filter.category) return false;
        if (startTs > 0 && log.timestamp < startTs) return false;
        if (endTs < Infinity && log.timestamp > endTs) return false;
        if (search && !this.getCachedSearchString(log).includes(search)) return false;
        return true;
      });
    } else {
      filtered = [...this.logs];
    }

    return chronological ? filtered : filtered.reverse();
  }

  // Subscribe to log updates
  subscribe(listener: (log: LogEntry) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    this.resetStats(); // Reset stats
    this.storage.clear();
    this.info(LogCategory.SYSTEM, 'Logs Cleared');
  }

  // Export logs
  exportLogs(format: 'json' | 'csv' | 'txt' = 'json'): string {
    const logsToExport = this.getLogs(undefined, true); // Chronological
    if (format === 'json') {
      return JSON.stringify(logsToExport, null, 2);
    } else if (format === 'csv') {
      const headers = 'ID,Timestamp,Level,Category,Message,Details\n';
      const rows = logsToExport
        .map(
          log =>
            `"${log.id}","${new Date(log.timestamp).toISOString()}","${log.level}","${log.category}","${log.message}","${JSON.stringify(log.details || '')}"`
        )
        .join('\n');
      return headers + rows;
    } else {
      return logsToExport
        .map(
          log =>
            `[${new Date(log.timestamp).toISOString()}] [${log.level}] [${log.category}] ${log.message}\n${log.details ? JSON.stringify(log.details, null, 2) : ''}\n`
        )
        .join('\n---\n');
    }
  }

  // Download logs
  downloadLogs(format: 'json' | 'csv' | 'txt' = 'json') {
    const content = this.exportLogs(format);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omni-logs-${new Date().toISOString()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    this.info(LogCategory.DEVELOPMENT, `Logs exported to ${format} format`);
  }

  // Get statistics
  // ⚡ Bolt Optimization: Return cached stats (O(1)) instead of recalculating (O(N))
  getStats() {
    return {
      ...this._stats,
      byLevel: { ...this._stats.byLevel },
      byCategory: { ...this._stats.byCategory },
    };
  }

  // ========== Backup Management (Delegated) ==========
  public createBackup(name?: string): string {
    return this.backupManager.createBackup(name);
  }

  public enableAutoBackup(intervalMinutes: number = 60) {
    this.backupManager.enableAutoBackup(intervalMinutes);
  }

  public disableAutoBackup() {
    this.backupManager.disableAutoBackup();
  }

  public listBackups(): Array<{ name: string; timestamp: string; logsCount: number }> {
    return this.backupManager.listBackups();
  }

  public restoreBackup(backupName: string): boolean {
    return this.backupManager.restoreBackup(backupName);
  }

  public deleteBackup(backupName: string): boolean {
    return this.backupManager.deleteBackup(backupName);
  }

  public cleanOldBackups(keepCount: number = 10) {
    this.backupManager.cleanOldBackups(keepCount);
  }

  public downloadBackup(backupName: string) {
    this.backupManager.downloadBackup(backupName);
  }

  public async importBackup(file: File): Promise<boolean> {
    return this.backupManager.importBackup(file);
  }

  // Cleanup resources
  destroy() {
    this.disableAutoBackup();
    this.listeners.clear();

    if (typeof globalThis.window !== 'undefined') {
      globalThis.window.removeEventListener('error', this.handleGlobalError);
      globalThis.window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
    }

    this.info(LogCategory.SYSTEM, 'Omni Logger System Closed and Cleaned');
  }
}

export const omniLogger = new OmniLoggerService();

// Legacy Logger Compatibility Layer
import { BehaviorSubject } from 'rxjs';

// Removed duplicate import to avoid conflict
export interface KernelLog {
  id: string;
  timestamp: number;
  source: string;
  operation: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  metadata: any;
}

export const kernelLogs$ = new BehaviorSubject<KernelLog[]>([]);

export const logKernelEvent = (
  source: string,
  operation: string,
  level: KernelLog['level'],
  metadata: any = {}
) => {
  // Forward to OmniLogger
  const omniLevel =
    level === 'ERROR' ? LogLevel.ERROR : level === 'WARNING' ? LogLevel.WARN : LogLevel.INFO;

  let category: LogCategory;
  if (Object.values(LogCategory).some(c => c === source)) {
    category = source as LogCategory;
  } else {
    category = LogCategory.SYSTEM; // Fallback category
  }

  // This is tricky because log is async. We'll fire and forget.
  omniLogger
    .log(omniLevel, category, operation, { ...metadata, originalSource: source })
    .catch(err => omniLogger.error(LogCategory.SYSTEM, '[OmniLogger] Asynchronous log failed in logKernelEvent:', { error: err }));

  // Maintain legacy stream
  const log: KernelLog = {
    id: `klog-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    source,
    operation,
    level,
    metadata,
  };

  const current = kernelLogs$.value;
  kernelLogs$.next([log, ...current].slice(0, 100));
};

// Global access for legacy systems
if (typeof window !== 'undefined') {
  (window as any).omniLogger = omniLogger;
  (window as any).logKernelEvent = logKernelEvent;
}
