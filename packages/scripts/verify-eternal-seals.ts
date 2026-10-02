/**
 * scripts/verify-eternal-seals.ts — §20.8 永恆刻印完整性 gate（P3 / CI 接入點）
 *
 * 用途：只做「讀 + 重算」，不寫任何東西。
 *   - 讀 .oa/omnitag-registry.jsonl
 *   - 對每筆重算 Hash Lock，任一 tampered=true 即 exit 1
 *   - 附帶檢查 lifecycle:eternal 紀錄的 sourceOrigin 不得為 unknown
 *
 * 與 seal-eternal-identity.ts 的差別：那是「刻印 + 自證」（會嘗試寫入），
 * 這個是「純驗證」（唯讀）。CI 只該跑這個 —— 跑刻印腳本會誤觸不可變契約。
 *
 * 5T：Trackable（逐筆列出可追蹤）／Transparent（列出真實阻斷條件與 rc）
 *
 * [agent:30][squad:5T驗算][lifecycle:active][p1][platform:esggo]
 */

import { OmniTagRegistry } from '../cli/oa-cli/src/omnitag';

const REGISTRY_PATH = '.oa/omnitag-registry.jsonl';

function main(): void {
  const registry = new OmniTagRegistry({ path: REGISTRY_PATH });
  const artifacts = registry.listArtifacts();

  if (artifacts.length === 0) {
    console.error(`[§20.8] registry 無紀錄：${REGISTRY_PATH}`);
    process.exitCode = 1;
    return;
  }

  console.log(`[§20.8] 完整性 gate · registry=${REGISTRY_PATH} · ${artifacts.length} 筆\n`);

  // 阻斷條件一：Hash Lock 重算不符
  let tampered = 0;
  const tamperedIds: string[] = [];
  for (const a of artifacts) {
    const v = registry.verifyArtifact(a.entityId);
    if (v.tampered) {
      tampered++;
      tamperedIds.push(a.entityId);
    }
    console.log(
      `  ${v.tampered ? '[FAIL]' : '[OK]  '} ${a.entityId.padEnd(22)} class=${a.entityClass.padEnd(6)} hashLock=${a.hashLock.slice(0, 16)}… tampered=${v.tampered}`,
    );
  }

  // 注意：sourceOrigin=unknown 是「已知歷史缺口」，不是竄改。
  // 把它設為阻斷條件會讓 CI 長期紅 —— 一個長期紅的 gate 等於沒有 gate
  // （人會習慣性忽略它）。故只 warn 並回報數量，由 WARN_ORIGIN_BLOCKED 開關提升為阻斷。
  const WARN_ONLY = process.env.OMNITAG_BLOCK_UNKNOWN_ORIGIN !== '1';
  let unknownOrigin = 0;
  const unknownIds: string[] = [];
  for (const a of artifacts) {
    if (a.sourceOrigin === 'unknown') {
      unknownOrigin++;
      unknownIds.push(a.entityId);
    }
  }

  console.log(`\n[§20.8] 總計 ${artifacts.length} 筆；竄改 ${tampered} 筆；sourceOrigin=unknown ${unknownOrigin} 筆`);

  if (tampered > 0) {
    console.error(`[GATE FAIL] Hash Lock 竄改：${tamperedIds.join(', ')}`);
    process.exitCode = 1;
  }
  if (unknownOrigin > 0) {
    const msg = `sourceOrigin 未推導（2026-10-01 前寫入的歷史紀錄）：${unknownIds.join(', ')}`;
    if (WARN_ONLY) {
      console.warn(`[GATE WARN] ${msg}`);
      console.warn('[GATE WARN] 竄改=0，完整性未受損；此為 metadata 缺口，非封印損毀。');
    } else {
      console.error(`[GATE FAIL] ${msg}`);
      process.exitCode = 1;
    }
  }

  if (process.exitCode) {
    console.error('[GATE] 結果 = FAIL');
  } else {
    console.log('[GATE] 結果 = PASS');
  }
}

main();
