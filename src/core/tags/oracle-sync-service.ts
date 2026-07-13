// ============================================================
// Oracle ADB Sync Service — 萬能標籤配對合成層的 Oracle 同步
// src/core/tags/oracle-sync-service.ts
// ============================================================
// 呼叫 scripts/oracle-sync.py (oci-cli venv 的 oracledb thin mode)
// 將 TagPair 同步進 OMNI_TRUST_LEDGER (hash-chain) + OMNI_PROFILE_VECTOR。
//
// 前置（VPS 需具備，否則 graceful skip）：
//   - OMNI_DB_PWD 設於 gateway/app .env
//   - OMNI_PYTHON 指向 oci-cli venv python (含 oracledb)
//   - ~/.oci/config + pem (OCI CLI 憑證)
//   - ADB wallet 下載至 OMNI_WALLET_DIR

import { execFile } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as os from 'os';

const execFileAsync = promisify(execFile);
const SCRIPT = path.resolve(process.cwd(), 'scripts/oracle-sync.py');
const PYTHON = (process.env.OMNI_PYTHON || 'python3').replace(/^~/, os.homedir());

function hasOracleCreds(): boolean {
  return !!process.env.OMNI_DB_PWD;
}

export interface OracleSyncResult {
  ok: boolean;
  synced?: number;
  reason?: string;
}

// 初始化 Oracle schema (建 omni_trust/omni_profile/omni_lifecycle + 表)
export async function initOracleSchema(): Promise<OracleSyncResult> {
  if (!hasOracleCreds()) {
    return { ok: false, reason: 'OMNI_DB_PWD not set — skipping Oracle init' };
  }
  try {
    const { stdout } = await execFileAsync(PYTHON, [SCRIPT, 'init'], {
      env: { ...process.env },
      timeout: 60000,
    });
    const out = JSON.parse(stdout.trim());
    return { ok: !!out.ok, reason: out.ok ? undefined : out.error };
  } catch (e) {
    return { ok: false, reason: `oracle init failed: ${(e as Error).message}` };
  }
}

// 同步一組 TagPair 進 Oracle (hash-chain 信任帳本)
export async function syncTagPairToOracle(pair: {
  pairId?: string;
  anchorId?: string;
  uuid?: string;
  action?: string;
  timestamp?: number;
}): Promise<OracleSyncResult> {
  if (!hasOracleCreds()) {
    return { ok: false, reason: 'OMNI_DB_PWD not set — skipping Oracle sync' };
  }
  try {
    const { stdout } = await execFileAsync(
      PYTHON,
      [SCRIPT, 'sync', JSON.stringify(pair)],
      { env: { ...process.env }, timeout: 60000 },
    );
    const out = JSON.parse(stdout.trim());
    return { ok: !!out.ok, reason: out.ok ? undefined : out.error };
  } catch (e) {
    return { ok: false, reason: `oracle sync failed: ${(e as Error).message}` };
  }
}
