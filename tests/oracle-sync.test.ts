/**
 * ==========================================
 * Oracle ADB 雙向同步 — TS↔Python JSON 合約單元測試
 * ==========================================
 * 透過 mock child_process.execFile, 攔截 oracle-sync-service 對
 * scripts/oracle-sync.py 的所有呼叫, 驗證:
 *   1. 無 OMNI_DB_PWD 時所有函式 graceful skip (不呼叫 Python)
 *   2. reconcile / read / matrix / sync 的「送出 JSON 合約」形狀正確
 *   3. 收到的 Python 輸出能被正確 parse 成 ReconcileResult / entries
 *   4. Python 崩潰 / 回傳髒 JSON 時錯誤被 catch 成 ok:false (不拋)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockExecFile, calls, state } = vi.hoisted(() => {
  const calls: Array<{ cmd: string; args: string[] }> = [];
  const state = { boom: false, badJson: false };
  const mockExecFile = vi.fn();
  const PROMISIFY_CUSTOM = Symbol.for('nodejs.util.promisify.custom');

  // 模擬 oracle-sync.py 各 subcommand 的行為
  const routePy = (args: string[]): string => {
    const cmd = args[1];
    if (cmd === 'reconcile') {
      const payload = JSON.parse(args[2] ?? '{}');
      const entities = payload.entities ?? [];
      const results = entities.map((e: any) => {
        const o = Number(e.origin_seq ?? 0);
        const t = Number(e.terminal_seq ?? 0);
        let status = 'synced';
        if (o > t) status = 'behind_oracle';
        else if (t > o) status = 'behind_app';
        return {
          uuid: e.uuid,
          origin_seq: o,
          terminal_seq: t,
          status,
          direction: e.direction ?? 'bidirectional',
        };
      });
      return JSON.stringify({
        ok: true,
        summary: {
          total: results.length,
          synced: results.filter((r: any) => r.status === 'synced').length,
          behind_oracle: results.filter((r: any) => r.status === 'behind_oracle').length,
          behind_app: results.filter((r: any) => r.status === 'behind_app').length,
        },
        push: results.filter((r: any) => r.status === 'behind_oracle'),
        pull: results.filter((r: any) => r.status === 'behind_app'),
        matrix: results,
      });
    }
    if (cmd === 'read') {
      return JSON.stringify({
        ok: true,
        count: 2,
        entries: [
          {
            seq: 1,
            prev_hash: '0',
            curr_hash: 'h1',
            uuid: 'u1',
            action: 'TRUST_GRANT',
            timestamp: 100,
          },
          {
            seq: 2,
            prev_hash: 'h1',
            curr_hash: 'h2',
            uuid: 'u2',
            action: 'TRUST_GRANT',
            timestamp: 200,
          },
        ],
      });
    }
    if (cmd === 'matrix') {
      return JSON.stringify({ ok: true, table: 'omni_lifecycle.sync_matrix' });
    }
    if (cmd === 'sync') {
      const pair = JSON.parse(args[2] ?? '{}');
      return JSON.stringify({ ok: true, uuid: pair.uuid ?? pair.pairId, curr_hash: 'hc' });
    }
    return JSON.stringify({ ok: false, error: `unknown cmd in mock: ${cmd}` });
  };

  // 讓 service 內部的 promisify(execFile) 解析為 { stdout, stderr }
  // promisify 在模組載入時就捕捉此函式, 故用 state 控制行為 (不可事後替換 symbol)
  // @ts-expect-error symbol 索引賦值 — 動態掛載 promisify.custom
  mockExecFile[PROMISIFY_CUSTOM] = (_cmd: string, args: string[]) => {
    if (state.boom) return Promise.reject(new Error('python boom'));
    if (state.badJson) return Promise.resolve({ stdout: 'not-json', stderr: '' });
    calls.push({ cmd: args[1], args });
    return Promise.resolve({ stdout: routePy(args), stderr: '' });
  };

  return { mockExecFile, calls, state };
});

vi.mock('child_process', () => ({ execFile: mockExecFile }));

// 必須在 vi.mock 之後才 import, 確保模組載入時 execFile 已是 mock
import {
  hasOracleCreds,
  reconcileBidirectional,
  pullFromOracle,
  ensureSyncMatrix,
  upsertSyncMatrix,
  syncTagPairToOracle,
  type SyncMatrixRow,
} from '../src/core/tags/oracle-sync-service';

describe('Oracle sync — graceful skip (no creds)', () => {
  beforeEach(() => {
    delete process.env.OMNI_DB_PWD;
    calls.length = 0;
    state.boom = false;
    state.badJson = false;
    mockExecFile.mockClear();
  });

  it('hasOracleCreds() is false without OMNI_DB_PWD', () => {
    expect(hasOracleCreds()).toBe(false);
  });

  it('reconcileBidirectional short-circuits without creds (no Python call)', async () => {
    const r = await reconcileBidirectional([{ uuid: 'u1', originSeq: 1, terminalSeq: 0 }]);
    expect(r.ok).toBe(false);
    expect(calls.length).toBe(0);
  });

  it('pullFromOracle short-circuits without creds', async () => {
    const r = await pullFromOracle(0);
    expect(r.ok).toBe(false);
    expect(calls.length).toBe(0);
  });

  it('ensureSyncMatrix short-circuits without creds', async () => {
    const r = await ensureSyncMatrix();
    expect(r.ok).toBe(false);
    expect(calls.length).toBe(0);
  });
});

describe('Oracle sync — JSON contract (with creds)', () => {
  beforeEach(() => {
    process.env.OMNI_DB_PWD = 'test-pwd';
    calls.length = 0;
    state.boom = false;
    state.badJson = false;
    mockExecFile.mockClear();
  });

  it('reconcileBidirectional sends origin_seq/terminal_seq/direction & parses matrix', async () => {
    const r = await reconcileBidirectional(
      [
        { uuid: 'u1', originSeq: 5, terminalSeq: 2 }, // behind_oracle -> push
        { uuid: 'u2', originSeq: 1, terminalSeq: 4 }, // behind_app   -> pull
        { uuid: 'u3', originSeq: 3, terminalSeq: 3 }, // synced
      ],
      true,
    );
    expect(r.ok).toBe(true);
    expect(r.summary).toEqual({ total: 3, synced: 1, behindApp: 1, behindOracle: 1 });
    expect(r.push.map((p) => p.uuid)).toEqual(['u1']);
    expect(r.pull.map((p) => p.uuid)).toEqual(['u2']);
    expect(r.matrix).toHaveLength(3);

    // 驗證送出的合約形狀 (service -> python)
    expect(calls.length).toBe(1);
    expect(calls[0].cmd).toBe('reconcile');
    const sent = JSON.parse(calls[0].args[2]);
    expect(sent.auto).toBe(true);
    expect(sent.entities[0]).toEqual({
      uuid: 'u1',
      origin_seq: 5,
      terminal_seq: 2,
      direction: 'bidirectional',
    });
  });

  it('pullFromOracle(0) calls `read` with no limit and parses entries', async () => {
    const r = await pullFromOracle(0);
    expect(r.ok).toBe(true);
    expect(r.count).toBe(2);
    expect(r.entries).toHaveLength(2);
    expect(r.entries[0].uuid).toBe('u1');
    expect(calls[0].cmd).toBe('read');
    expect(calls[0].args).toHaveLength(2); // [SCRIPT, 'read']
  });

  it('pullFromOracle(10) passes limit to `read`', async () => {
    await pullFromOracle(10);
    expect(calls[0].args).toEqual([calls[0].args[0], 'read', '10']);
  });

  it('ensureSyncMatrix calls `matrix` subcommand', async () => {
    const r = await ensureSyncMatrix();
    expect(r.ok).toBe(true);
    expect(calls[0].cmd).toBe('matrix');
  });

  it('upsertSyncMatrix delegates to reconcile with auto=true', async () => {
    const row: SyncMatrixRow = {
      uuid: 'u9',
      originSeq: 7,
      terminalSeq: 7,
      status: 'synced',
      direction: 'app->oracle',
    };
    const r = await upsertSyncMatrix(row);
    expect(r.ok).toBe(true);
    expect(calls[0].cmd).toBe('reconcile');
    const sent = JSON.parse(calls[0].args[2]);
    expect(sent.auto).toBe(true);
    expect(sent.entities[0]).toEqual({
      uuid: 'u9',
      origin_seq: 7,
      terminal_seq: 7,
      direction: 'app->oracle',
    });
  });

  it('syncTagPairToOracle sends `sync` with pair payload', async () => {
    const r = await syncTagPairToOracle({ uuid: 'abc', action: 'TRUST_GRANT', timestamp: 123 });
    expect(r.ok).toBe(true);
    expect(calls[0].cmd).toBe('sync');
    const sent = JSON.parse(calls[0].args[2]);
    expect(sent.uuid).toBe('abc');
    expect(sent.action).toBe('TRUST_GRANT');
  });
});

describe('Oracle sync — error resilience', () => {
  beforeEach(() => {
    process.env.OMNI_DB_PWD = 'test-pwd';
    calls.length = 0;
    state.boom = false;
    state.badJson = false;
    mockExecFile.mockClear();
  });

  it('Python crash (rejection) is caught -> ok:false with reason', async () => {
    state.boom = true;
    const r = await reconcileBidirectional([{ uuid: 'u1', originSeq: 1, terminalSeq: 0 }]);
    expect(r.ok).toBe(false);
    expect(r.reason).toContain('reconcile failed');
  });

  it('malformed JSON from Python is caught -> ok:false', async () => {
    state.badJson = true;
    const r = await reconcileBidirectional([{ uuid: 'u1', originSeq: 1, terminalSeq: 0 }]);
    expect(r.ok).toBe(false);
    expect(typeof r.reason).toBe('string');
  });
});
