/**
 * ==========================================
 * 完全代主自行 - 全量日誌持久化 E2E 驗證
 * ==========================================
 *
 * 驗證 journal.jsonl 的全量留存不變量：
 * - append → readAll 一致性（不抽樣、不截斷）
 * - readSince 斷點續傳正確性
 * - 審計與事件共用序號空間
 * - 跨測試隔離（暫存檔）
 */

import { describe, it, expect, afterEach } from 'vitest';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { unlinkSync, existsSync, readFileSync } from 'fs';
import {
  createDelegationJournal,
  type JournalRecord,
} from '../src/agents/complete-delegation/journal';

describe('全量日誌持久化 (Journal JSONL)', () => {
  const cleanup: string[] = [];

  afterEach(() => {
    for (const p of cleanup) {
      try {
        if (existsSync(p)) unlinkSync(p);
      } catch { /* ignore */ }
    }
    cleanup.length = 0;
  });

  it('append → readAll 一致性：寫入 N 筆後讀回完全一致', () => {
    const path = join(tmpdir(), `esggo-journal-e2e-${randomUUID()}.jsonl`);
    cleanup.push(path);
    const journal = createDelegationJournal(path);

    const entries: Omit<JournalRecord, 'id'>[] = [
      { kind: 'audit', ts: 1000, type: 'DELEGATION_CREATED', delegationId: 'd-001' },
      { kind: 'event', ts: 1001, type: 'delegation.created', delegationId: 'd-001', topic: 'auth', hashLock: 'a'.repeat(64), source: 'test', payload: { note: 'first' } },
      { kind: 'audit', ts: 1002, type: 'DELEGATION_VALIDATED', delegationId: 'd-001' },
      { kind: 'event', ts: 1003, type: 'delegation.decision.made', delegationId: 'd-001', topic: 'decision', hashLock: 'b'.repeat(64), source: 'test', payload: { note: 'second' } },
      { kind: 'audit', ts: 1004, type: 'AUTONOMOUS_DECISION', delegationId: 'd-001' },
      { kind: 'event', ts: 1005, type: 'delegation.terminated', delegationId: 'd-001', topic: 'auth', hashLock: 'c'.repeat(64), source: 'test', payload: { note: 'third' } },
    ];

    const ids = entries.map((e) => journal.append(e));
    // 序號單調遞增
    for (let i = 1; i < ids.length; i++) {
      expect(ids[i]).toBeGreaterThan(ids[i - 1]);
    }
    // 第一筆 id 為 1
    expect(ids[0]).toBe(1);

    const all = journal.readAll();
    expect(all.length).toBe(entries.length);

    // 逐一比對（id 由 journal 分配）
    for (let i = 0; i < entries.length; i++) {
      expect(all[i].id).toBe(ids[i]);
      expect(all[i].kind).toBe(entries[i].kind);
      expect(all[i].type).toBe(entries[i].type);
      expect(all[i].ts).toBe(entries[i].ts);
    }
  });

  it('readSince：依 kind 過濾 + sinceId 斷點續傳', () => {
    const path = join(tmpdir(), `esggo-journal-since-${randomUUID()}.jsonl`);
    cleanup.push(path);
    const journal = createDelegationJournal(path);

    // 交錯寫入 audit 與 event
    const a1 = journal.append({ kind: 'audit', ts: 100, type: 'A1', delegationId: 'd-1' });
    const e1 = journal.append({ kind: 'event', ts: 200, type: 'E1', delegationId: 'd-1', topic: 't', hashLock: '', source: 's', payload: {} });
    const a2 = journal.append({ kind: 'audit', ts: 300, type: 'A2', delegationId: 'd-1' });
    const e2 = journal.append({ kind: 'event', ts: 400, type: 'E2', delegationId: 'd-1', topic: 't', hashLock: '', source: 's', payload: {} });
    const a3 = journal.append({ kind: 'audit', ts: 500, type: 'A3', delegationId: 'd-1' });
    const e3 = journal.append({ kind: 'event', ts: 600, type: 'E3', delegationId: 'd-1', topic: 't', hashLock: '', source: 's', payload: {} });

    // 只取 event
    const events = journal.readSince('event');
    expect(events.length).toBe(3);
    expect(events.map((e) => e.id)).toEqual([e1, e2, e3]);

    // sinceId = e1 → 取 e2, e3
    const resumed = journal.readSince('event', e1);
    expect(resumed.length).toBe(2);
    expect(resumed[0].id).toBe(e2);
    expect(resumed[1].id).toBe(e3);

    // sinceId = e2 → 取 e3
    const resumed2 = journal.readSince('event', e2);
    expect(resumed2.length).toBe(1);
    expect(resumed2[0].id).toBe(e3);

    // 只取 audit
    const audits = journal.readSince('audit');
    expect(audits.length).toBe(3);
    expect(audits.map((a) => a.id)).toEqual([a1, a2, a3]);
  });

  it('空日誌：readAll / readSince 回傳空陣列', () => {
    const path = join(tmpdir(), `esggo-journal-empty-${randomUUID()}.jsonl`);
    cleanup.push(path);
    const journal = createDelegationJournal(path);

    expect(journal.readAll()).toEqual([]);
    expect(journal.readSince('event')).toEqual([]);
    expect(journal.readSince('audit')).toEqual([]);
    expect(journal.readSince('event', 42)).toEqual([]);
  });

  it('JSONL 檔案格式：每行為合法 JSON + id 欄位', () => {
    const path = join(tmpdir(), `esggo-journal-format-${randomUUID()}.jsonl`);
    cleanup.push(path);
    const journal = createDelegationJournal(path);

    journal.append({ kind: 'audit', ts: 1, type: 'T1' });
    journal.append({ kind: 'event', ts: 2, type: 'T2', delegationId: 'd', topic: 't', hashLock: 'h', source: 's', payload: { x: 1 } });

    const raw = readFileSync(path, 'utf8');
    const lines = raw.trim().split('\n').filter(Boolean);
    expect(lines.length).toBe(2);

    for (const line of lines) {
      const obj = JSON.parse(line);
      expect(typeof obj.id).toBe('number');
      expect(typeof obj.kind).toBe('string');
      expect(typeof obj.ts).toBe('number');
      expect(typeof obj.type).toBe('string');
    }
  });

  it('序號跨日誌實例持久化：重新開啟後 id 從斷點續編', () => {
    const path = join(tmpdir(), `esggo-journal-persist-${randomUUID()}.jsonl`);
    cleanup.push(path);

    // 第一個實例：寫入 3 筆
    const j1 = createDelegationJournal(path);
    j1.append({ kind: 'audit', ts: 1, type: 'A1' });
    j1.append({ kind: 'event', ts: 2, type: 'E1', delegationId: 'd', topic: 't', hashLock: '', source: 's', payload: {} });
    j1.append({ kind: 'audit', ts: 3, type: 'A2' });

    // 第二個實例（模擬重啟）：寫入 2 筆
    const j2 = createDelegationJournal(path);
    const id4 = j2.append({ kind: 'event', ts: 4, type: 'E2', delegationId: 'd', topic: 't', hashLock: '', source: 's', payload: {} });
    const id5 = j2.append({ kind: 'audit', ts: 5, type: 'A3' });

    // id 從 4 續編（不重複）
    expect(id4).toBe(4);
    expect(id5).toBe(5);

    // readAll 共 5 筆
    expect(j2.readAll().length).toBe(5);
  });
});
