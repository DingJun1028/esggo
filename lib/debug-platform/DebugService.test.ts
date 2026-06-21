import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DebugService, debugService } from './DebugService';

describe('DebugService', () => {
  let service: DebugService;

  beforeEach(() => {
    service = new DebugService();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('應該正確記錄除錯事件', () => {
    const event = service.log('debug', 'test-source', '測試訊息', { key: 'value' });

    expect(event.id).toBeDefined();
    expect(event.level).toBe('debug');
    expect(event.source).toBe('test-source');
    expect(event.message).toBe('測試訊息');
    expect(event.context).toEqual({ key: 'value' });
  });

  it('應該正確記錄錯誤事件', () => {
    const error = new Error('測試錯誤');
    const event = service.log('error', 'test-error', '錯誤發生', undefined, error);

    expect(event.level).toBe('error');
    expect(event.stack).toBeDefined();
  });

  it('應該正確建立快照', () => {
    const snapshot = service.snapshot('test-snapshot', { count: 42 }, ['tag1', 'tag2']);

    expect(snapshot.id).toBeDefined();
    expect(snapshot.name).toBe('test-snapshot');
    expect(snapshot.data).toEqual({ count: 42 });
    expect(snapshot.tags).toEqual(['tag1', 'tag2']);
  });

  it('應該正確過濾事件', () => {
    service.configure({ level: 'debug' });
    service.log('debug', 'source-a', 'debug message');
    service.log('info', 'source-b', 'info message');
    service.log('warn', 'source-a', 'warn message');

    const debugEvents = service.getEvents({ level: 'debug' });
    const warnEvents = service.getEvents({ level: 'warn' });
    const allEvents = service.getEvents();

    expect(debugEvents.length).toBeGreaterThan(0);
    expect(warnEvents.length).toBeGreaterThan(0);
    expect(allEvents.length).toBeGreaterThanOrEqual(debugEvents.length);
  });

  it('應該正確計算指標', () => {
    service.log('error', 'test', 'error 1');
    service.log('error', 'test', 'error 2');
    service.log('warn', 'test', 'warning');
    service.log('info', 'test', 'info');

    const metrics = service.getMetrics();

    expect(metrics.totalEvents).toBe(4);
    expect(metrics.errorCount).toBe(2);
    expect(metrics.warnCount).toBe(1);
  });

  it('應該正確匯出日誌', () => {
    service.log('info', 'export-test', 'test message');
    const exported = service.exportLogs();

    expect(() => JSON.parse(exported)).not.toThrow();
    const parsed = JSON.parse(exported);
    expect(parsed.events).toBeDefined();
    expect(parsed.snapshots).toBeDefined();
    expect(parsed.metrics).toBeDefined();
  });

  it('應該正確清除記錄', () => {
    service.log('info', 'test', 'before clear');
    service.clear();

    expect(service.getEvents().length).toBe(0);
    expect(service.getMetrics().totalEvents).toBe(0);
  });
});
