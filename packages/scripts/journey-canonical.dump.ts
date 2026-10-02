/**
 * journey 產品功能矩陣 canonical JSON dump 器
 * 存在原因：與 scripts/domain-canonical.dump.ts 同 —— verify 腳本以 spawnSync
 * 呼叫時，Windows shell 會吃掉 tsx -e 的引號導致 Transform failed。
 * 改以獨立檔案呼叫，零引號傳遞。
 * 輸出：單行 JSON 到 stdout（供 scripts/verify-journey-matrix.mjs 解析）
 *
 * source_origin: scripts/domain-canonical.dump.ts
 */

import JOURNEY_DOMAINS from '../src/matrix/journey/index';
import {
  JOURNEY_PAGES,
  JOURNEY_APIS,
  JOURNEY_TABLES,
} from '../src/matrix/journey/routes';

console.log(JSON.stringify({
  DOMAINS: JOURNEY_DOMAINS,
  PAGES: JOURNEY_PAGES,
  APIS: JOURNEY_APIS,
  TABLES: JOURNEY_TABLES,
}));
