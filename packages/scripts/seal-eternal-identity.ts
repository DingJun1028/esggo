/**
 * scripts/seal-eternal-identity.ts — §20.8 永恆持久萬能標籤 · 刻印種子
 *
 * 為「萬能代理 / 萬能分身 / 萬能蜂群」三類實體建立永恆（eternal）OmniTag，
 * 寫入 append-only registry 並以 Hash Lock 封存。
 *
 * 5T 對映：
 *   Traceable  — 每筆紀錄帶 entityClass 與 source_origin（由 tag.agent/avatar/swarm 推導）
 *   Trackable  — 落盤為 JSONL，可逐筆列舉與重算 Hash Lock
 *   Tangible   — 執行後直接印出三類實體的 hashLock 與不可變證據
 *   Transparent— 全程只呼叫 src/lib 的契約函式，不繞過任何檢查
 *   Trustworthy— lifecycle:eternal 一律不可變；重跑不會覆寫既有封印
 *
 * [agent:30][squad:5T驗算][lifecycle:active][p1][platform:esggo][best-practice:结界]
 */

import {
  OmniTagRegistry,
  resolveIdentity,
  type OmniTagSet,
} from '../cli/oa-cli/src/omnitag';

const REGISTRY_PATH = '.oa/omnitag-registry.jsonl';

/**
 * 三類實體的永恆身分。
 * lifecycle 全部為 eternal —— 依 §20.8，這是終態：不看 security，一律不可變更。
 */
const ETERNAL_ENTITIES: Array<{ entityId: string; tag: OmniTagSet; content: string }> = [
  {
    entityId: 'oa-agent-queenbee',
    tag: {
      agent: 'agent:01',
      squad: '智庫聖所',
      lifecycle: 'eternal',
      priority: 'p0',
      security: 'restricted',
      platform: 'esggo',
      bestPractice: '结界',
      arcana: '光之羽翼',
    },
    content: '萬能蜂后 — 萬能代理陣列之首，戰略提純與跨組協調',
  },
  {
    entityId: 'oa-avatar-omni',
    tag: {
      avatar: 'avatar:omni',
      squad: '智庫聖所',
      lifecycle: 'eternal',
      priority: 'p1',
      security: 'internal',
      platform: 'omni',
      bestPractice: '结界',
      arcana: '全知之眼',
    },
    content: '萬能分身 / Omni Avatar — 使用者身分投影與偏好鏡像',
  },
  {
    entityId: 'oa-swarm-team-30',
    tag: {
      swarm: 'swarm:oa-team-30',
      squad: '5T驗算',
      lifecycle: 'eternal',
      priority: 'p0',
      security: 'restricted',
      platform: 'esggo',
      bestPractice: '结界',
      arcana: '記憶聖所',
    },
    content: '萬能蜂群 — 30 靈魂五大陣列，5T 驗算與永恆刻印守護者',
  },
];

function main(): void {
  const registry = new OmniTagRegistry({ path: REGISTRY_PATH });
  const existing = new Map(registry.listArtifacts().map((a) => [a.entityId, a]));

  console.log(`[§20.8] 永恆刻印 · registry=${REGISTRY_PATH}`);
  console.log(`[§20.8] 既有紀錄=${existing.size} 種即將刻印=${ETERNAL_ENTITIES.length} 筆\n`);

  let sealed = 0;
  let alreadyFrozen = 0;

  for (const { entityId, tag, content } of ETERNAL_ENTITIES) {
    const identity = resolveIdentity(tag);
    const prior = existing.get(entityId);

    if (prior) {
      const v = registry.verifyArtifact(entityId);
      console.log(
        `[skip] ${entityId.padEnd(22)} 已封印（${prior.entityClass}）hashLock=${prior.hashLock.slice(0, 16)}… tampered=${v.tampered}`,
      );
      alreadyFrozen++;
      continue;
    }

    const record = registry.persistArtifact({ entityId, tag, content });
    sealed++;
    console.log(
      `[seal] ${entityId.padEnd(22)} class=${record.entityClass.padEnd(6)} id=${identity?.id.padEnd(16)} arcana=${tag.arcana} hashLock=${record.hashLock.slice(0, 16)}…`,
    );
  }

  console.log(`\n[§20.8] 新增=${sealed} 已存在=${alreadyFrozen}`);

  // 不可變證據：嘗試覆寫既有封印必須被拒
  console.log('\n[§20.8] 不可變性驗證（嘗試重寫應全部被拒）');
  for (const { entityId, tag, content } of ETERNAL_ENTITIES) {
    try {
      registry.persistArtifact({ entityId, tag, content });
      console.log(`  [FAIL] ${entityId} 竟然覆寫成功 — 永恆契約失效！`);
      process.exitCode = 1;
    } catch (err) {
      console.log(`  [OK]   ${entityId.padEnd(22)} 被拒：${(err as Error).message.slice(0, 72)}`);
    }
  }

  // 完整性驗證：重算 Hash Lock 確認未被竄改
  console.log('\n[§20.8] Hash Lock 完整性');
  let tamperedCount = 0;
  for (const { entityId } of ETERNAL_ENTITIES) {
    const v = registry.verifyArtifact(entityId);
    if (v.tampered) tamperedCount++;
    console.log(`  ${v.tampered ? '[FAIL]' : '[OK]  '} ${entityId.padEnd(22)} tampered=${v.tampered}`);
  }

  const total = registry.listArtifacts().length;
  console.log(`\n[§20.8] registry 總計 ${total} 筆；竄改 ${tamperedCount} 筆`);
  if (tamperedCount > 0) process.exitCode = 1;

  // ─── 自檢段（2026-10-01 補）───────────────────────────────────────
  // 背景：header 曾宣稱 sourceOrigin「由 tag.agent/avatar/swarm 推導」，
  // 但實作只讀 params.tag.agent，avatar/swarm 實際落盤為 unknown。
  // 註解會漂移 —— 此段讓「註解」與「落盤產物」在每次執行時強行對帳。
  console.log('\n[§20.8] 自檢：落盤紀錄 vs 預期推導');
  let drift = 0;
  for (const { entityId, tag } of ETERNAL_ENTITIES) {
    const record = registry.listArtifacts().find((a) => a.entityId === entityId);
    const expected = resolveIdentity(tag)?.id ?? 'unknown';
    const actual = record?.sourceOrigin ?? '<no-record>';
    const ok = actual === expected && actual !== 'unknown';
    if (!ok) drift++;
    console.log(
      `  ${ok ? '[OK]  ' : '[FAIL]'} ${entityId.padEnd(22)} 期望=${expected.padEnd(16)} 實際=${actual}`,
    );
  }
  if (drift > 0) {
    console.log(`  [FAIL] ${drift} 筆 metadata 與預期推導不符（註解與實作漂移）`);
    process.exitCode = 1;
  }
}

main();