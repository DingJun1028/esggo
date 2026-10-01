/**
 * 域層 canonical JSON dump 器
 * 存在原因：verify-domain-matrix.mjs 以 spawnSync 呼叫時，Windows shell 會吃掉
 * tsx -e 的引號導致 Transform failed。改以獨立檔案呼叫，零引號傳遞。
 * 輸出：單行 JSON 到 stdout（供 scripts/verify-domain-matrix.mjs 解析）
 */

import DOMAINS from '../src/matrix/index';
import { PAGES, API_PREFIX_RULES } from '../src/matrix/routes';

// RegExp 無法 JSON 序列化（會變成 {}），故序列化為 source 字串，
// 由守門端 rehydrate 成 RegExp。否則 new RegExp(undefined) 匹配一切 → 全部誤判 D1。
const rules = API_PREFIX_RULES.map((r) => ({ src: r.pattern.source, domain: r.domain, note: r.note }));

console.log(JSON.stringify({ DOMAINS, PAGES, API_PREFIX_RULES: rules }));
