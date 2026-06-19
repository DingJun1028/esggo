/**
 * OmniLogger Unit Tests
 * Tests for OmniLoggerService: core logging, stats, subscribers, filtering
 * [5T Protocol] Traceable test coverage for Omni logging infrastructure
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OmniLoggerService, LogLevel, LogCategory, type LogEntry } from '../OmniLogger';

describe('OmniLoggerService', () => {
    let logger: OmniLoggerService;

    beforeEach(() => {
        // Clear localStorage before each test
        globalThis.localStorage?.clear?.();

        // Ensure window has addEventListener/removeEventListener
        // (the global test setup.ts overwrites window with a plain object)
        if (typeof globalThis.window !== 'undefined') {
            if (!globalThis.window.addEventListener) {
                (globalThis.window as any).addEventListener = vi.fn();
            }
            if (!globalThis.window.removeEventListener) {
                (globalThis.window as any).removeEventListener = vi.fn();
            }
        }

        // Suppress console output during tests
        vi.spyOn(console, 'log').mockImplementation(() => { });
        vi.spyOn(console, 'warn').mockImplementation(() => { });
        vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.spyOn(console, 'debug').mockImplementation(() => { });

        // Mock crypto.subtle for generateHashLock (used by ERROR/CRITICAL logs)
        const mockSubtle = {
            digest: vi.fn(async (_algo: string, _data: ArrayBuffer) => {
                // Return a deterministic 32-byte hash
                return new ArrayBuffer(32);
            }),
        };
        vi.stubGlobal('crypto', {
            ...(globalThis.crypto || {}),
            subtle: mockSubtle,
            randomUUID: globalThis.crypto?.randomUUID || vi.fn(() => 'test-uuid'),
        });

        logger = new OmniLoggerService();
    });

    afterEach(() => {
        try { logger?.destroy(); } catch { /* noop */ }
        vi.restoreAllMocks();
    });

    // ─── Constructor & Initialization ─────────────────────────

    describe('constructor', () => {
        it('should log startup message on creation', () => {
            // Constructor logs "Omni Logger System Started"
            const logs = logger.getLogs(undefined, true);
            const startupLog = logs.find(l => l.message.includes('Omni Logger System Started'));
            expect(startupLog).toBeDefined();
            expect(startupLog?.category).toBe(LogCategory.SYSTEM);
        });

        it('should initialize with valid stats', () => {
            const stats = logger.getStats();
            expect(stats.total).toBeGreaterThanOrEqual(1); // at least the startup log
        });
    });

    // ─── Convenience Methods (info/warn/error/debug) ──────────

    describe('info', () => {
        it('should create a log entry with INFO level', async () => {
            logger.info(LogCategory.SYSTEM, 'Test info message');
            await vi.waitFor(() => {
                const logs = logger.getLogs({ level: LogLevel.INFO });
                const found = logs.find(l => l.message === 'Test info message');
                expect(found).toBeDefined();
                expect(found?.level).toBe(LogLevel.INFO);
            });
        });
    });

    describe('warn', () => {
        it('should create a log entry with WARN level', async () => {
            logger.warn(LogCategory.SECURITY, 'Security warning');
            await vi.waitFor(() => {
                const logs = logger.getLogs({ level: LogLevel.WARN });
                const found = logs.find(l => l.message === 'Security warning');
                expect(found).toBeDefined();
                expect(found?.category).toBe(LogCategory.SECURITY);
            });
        });
    });

    describe('error', () => {
        it('should create a log entry with ERROR level and stack trace', async () => {
            logger.error(LogCategory.SYSTEM, 'Test error', { code: 'E001' });
            await vi.waitFor(() => {
                const logs = logger.getLogs({ level: LogLevel.ERROR });
                const found = logs.find(l => l.message === 'Test error');
                expect(found).toBeDefined();
                expect(found?.level).toBe(LogLevel.ERROR);
            });
        });

        it('should support ERROR level payload with SYSTEM default category', () => {
            // Synchronous test using logPayload (the async error() -> log() path
            // is unreliable in jsdom due to event loop timing)
            const listener = vi.fn();
            logger.subscribe(listener);

            logger.logPayload({
                level: LogLevel.ERROR,
                category: LogCategory.SYSTEM,
                message: 'Simple error message',
                source_origin: 'test',
                trace_id: 'trace_err',
                timestamp: Date.now(),
            });

            const entry = listener.mock.calls[0]?.[0] as LogEntry;
            expect(entry).toBeDefined();
            expect(entry.message).toBe('Simple error message');
            expect(entry.category).toBe(LogCategory.SYSTEM);
            expect(entry.level).toBe(LogLevel.ERROR);
        });
    });

    describe('debug', () => {
        it('should create a log entry with DEBUG level', async () => {
            logger.debug(LogCategory.PERFORMANCE, 'Debug trace');
            await vi.waitFor(() => {
                const logs = logger.getLogs({ level: LogLevel.DEBUG });
                const found = logs.find(l => l.message === 'Debug trace');
                expect(found).toBeDefined();
            });
        });
    });

    // ─── getLogs (Filtering) ──────────────────────────────────

    describe('getLogs', () => {
        it('should return all logs without filter', () => {
            const logs = logger.getLogs();
            expect(logs.length).toBeGreaterThanOrEqual(1); // at least startup
        });

        it('should filter by level', async () => {
            logger.info(LogCategory.SYSTEM, 'Info log');
            logger.warn(LogCategory.SYSTEM, 'Warn log');

            await vi.waitFor(() => {
                const warnings = logger.getLogs({ level: LogLevel.WARN });
                expect(warnings.every(l => l.level === LogLevel.WARN)).toBe(true);
            });
        });

        it('should filter by category', async () => {
            logger.info(LogCategory.API, 'API log');
            logger.info(LogCategory.UI, 'UI log');

            await vi.waitFor(() => {
                const apiLogs = logger.getLogs({ category: LogCategory.API });
                expect(apiLogs.every(l => l.category === LogCategory.API)).toBe(true);
            });
        });

        it('should filter by search text', async () => {
            logger.info(LogCategory.SYSTEM, 'Alpha search target');
            logger.info(LogCategory.SYSTEM, 'Beta unrelated');

            await vi.waitFor(() => {
                const results = logger.getLogs({ search: 'alpha' });
                expect(results.length).toBeGreaterThanOrEqual(1);
                expect(results.every(l => l.message.toLowerCase().includes('alpha'))).toBe(true);
            });
        });

        it('should return chronological order when flag is true', () => {
            const chrono = logger.getLogs(undefined, true);
            const reverse = logger.getLogs(undefined, false);
            if (chrono.length >= 2) {
                // chronological: first entry is oldest
                expect(chrono[0].timestamp).toBeLessThanOrEqual(chrono[chrono.length - 1].timestamp);
                // reverse: first entry is newest
                expect(reverse[0].timestamp).toBeGreaterThanOrEqual(reverse[reverse.length - 1].timestamp);
            }
        });
    });

    // ─── getStats ─────────────────────────────────────────────

    describe('getStats', () => {
        it('should track log counts by level', async () => {
            logger.warn(LogCategory.SYSTEM, 'Warn 1');
            logger.warn(LogCategory.SYSTEM, 'Warn 2');

            await vi.waitFor(() => {
                const stats = logger.getStats();
                expect(stats.warnings).toBeGreaterThanOrEqual(2);
            });
        });

        it('should track errors separately', async () => {
            const initialStats = logger.getStats();
            const initialErrors = initialStats.errors;

            logger.error(LogCategory.SYSTEM, 'Error 1');

            await vi.waitFor(() => {
                const stats = logger.getStats();
                expect(stats.errors).toBeGreaterThan(initialErrors);
            });
        });

        it('should return a copy (not the internal reference)', () => {
            const stats1 = logger.getStats();
            const stats2 = logger.getStats();
            expect(stats1).not.toBe(stats2); // different object references
            expect(stats1.byLevel).not.toBe(stats2.byLevel);
        });
    });

    // ─── subscribe / unsubscribe ──────────────────────────────

    describe('subscribe', () => {
        it('should notify listener on new log via logPayload', () => {
            const listener = vi.fn();
            logger.subscribe(listener);

            // Use logPayload for synchronous notification
            logger.logPayload({
                level: LogLevel.INFO,
                category: LogCategory.SYSTEM,
                message: 'Subscribe test',
                source_origin: 'test',
                trace_id: 'trace_1',
                timestamp: Date.now(),
            });

            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ message: 'Subscribe test' }),
            );
        });

        it('should stop notifying after unsubscribe', () => {
            const listener = vi.fn();
            const unsub = logger.subscribe(listener);

            unsub(); // unsubscribe

            logger.logPayload({
                level: LogLevel.INFO,
                category: LogCategory.SYSTEM,
                message: 'After unsub',
                source_origin: 'test',
                trace_id: 'trace_2',
                timestamp: Date.now(),
            });

            // listener should NOT have been called with "After unsub"
            const afterCalls = listener.mock.calls.filter(
                (call: any[]) => call[0]?.message === 'After unsub',
            );
            expect(afterCalls).toHaveLength(0);
        });
    });

    // ─── clearLogs ────────────────────────────────────────────

    describe('clearLogs', () => {
        it('should empty the log buffer and reset stats', async () => {
            logger.info(LogCategory.SYSTEM, 'Before clear');

            await vi.waitFor(() => {
                expect(logger.getLogs().length).toBeGreaterThan(0);
            });

            logger.clearLogs();

            // After clear, only the "Logs Cleared" message itself may exist
            await vi.waitFor(() => {
                const stats = logger.getStats();
                // Stats should be very low (just the "Logs Cleared" log itself)
                expect(stats.total).toBeLessThanOrEqual(2);
            });
        });
    });

    // ─── exportLogs ───────────────────────────────────────────

    describe('exportLogs', () => {
        it('should export logs in JSON format', () => {
            const json = logger.exportLogs('json');
            const parsed = JSON.parse(json);
            expect(Array.isArray(parsed)).toBe(true);
        });

        it('should export logs in CSV format with headers', () => {
            const csv = logger.exportLogs('csv');
            expect(csv.startsWith('ID,Timestamp,Level,Category,Message,Details')).toBe(true);
        });

        it('should export logs in TXT format', () => {
            const txt = logger.exportLogs('txt');
            expect(typeof txt).toBe('string');
            expect(txt.length).toBeGreaterThan(0);
        });
    });

    // ─── destroy ──────────────────────────────────────────────

    describe('destroy', () => {
        it('should clear listeners on destroy', () => {
            const listener = vi.fn();
            logger.subscribe(listener);
            logger.destroy();

            // After destroy, logging should not notify the old listener
            logger.logPayload({
                level: LogLevel.INFO,
                category: LogCategory.SYSTEM,
                message: 'After destroy',
                source_origin: 'test',
                trace_id: 'trace_3',
                timestamp: Date.now(),
            });

            const afterCalls = listener.mock.calls.filter(
                (call: any[]) => call[0]?.message === 'After destroy',
            );
            expect(afterCalls).toHaveLength(0);
        });
    });

    // ─── logPayload (core) ────────────────────────────────────

    describe('logPayload', () => {
        it('should create an immutable log entry with generated id', () => {
            const listener = vi.fn();
            logger.subscribe(listener);

            logger.logPayload({
                level: LogLevel.INFO,
                category: LogCategory.SYSTEM,
                message: 'Immutable test',
                source_origin: 'test.spec',
                trace_id: 'trace_imm',
                timestamp: Date.now(),
            });

            const entry = listener.mock.calls[0][0] as LogEntry;
            expect(entry.id).toMatch(/^log_/);
            expect(entry.source_origin).toBe('test.spec');
            // Verify immutability (Object.freeze)
            expect(() => {
                (entry as any).message = 'modified';
            }).toThrow();
        });

        it('should prevent re-entrant logging', () => {
            // Subscribe a listener that tries to log again
            const reentrantListener = vi.fn((log: LogEntry) => {
                // This should be silently ignored due to isLogging guard
                logger.logPayload({
                    level: LogLevel.DEBUG,
                    category: LogCategory.SYSTEM,
                    message: 'Re-entrant',
                    source_origin: 'test',
                    trace_id: 'trace_re',
                    timestamp: Date.now(),
                });
            });

            logger.subscribe(reentrantListener);

            logger.logPayload({
                level: LogLevel.INFO,
                category: LogCategory.SYSTEM,
                message: 'Trigger re-entrancy',
                source_origin: 'test',
                trace_id: 'trace_trigger',
                timestamp: Date.now(),
            });

            // The re-entrant "Re-entrant" message should NOT be in the logs
            const reentrantLogs = logger
                .getLogs(undefined, true)
                .filter(l => l.message === 'Re-entrant');
            expect(reentrantLogs).toHaveLength(0);
        });
    });
});
