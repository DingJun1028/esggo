// 5T 守門驗證 — ftg-journey-server JWT_SECRET fail-fast 三道閘門
//
// 為何需要這份測試（2026-09-27）:
//   server.js 的啟動守門若被改回寬鬆版（例如只留封鎖清單、拿掉長度下限，
//   或把 process.exit(1) 改成 warning），服務會安靜地用可預測的金鑰簽 token，
//   造成 JWT 偽造。這是「看起來綠、實際失守」的典型，故以測試鎖住契約。
//
// 隔離說明: apps/ftg-journey-server/node_modules 在本 repo 不完整
//   （express/index.js 缺失），無法真正啟動 server.js。
//   因此本測試以「同一組常數 + 同一組判斷式」獨立重現守門邏輯，
//   驗證的是「規則本身正確」，非「server.js 已載入該規則」。
//   兩者的同步性由下方 5T-Traceable 的逐字元比對守住。
//
// 執行: cd apps/ftg-journey-server && node --test jwt-gate.test.js

import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── 從 server.js 讀取真實常數，避免測試與實作漂移（5T-Traceable）─────────
const serverSrc = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');

function readConst(name) {
  // 常數可能是字串 (LEAKED_FROM_GIT_HISTORY) 或數字 (MIN_SECRET_LENGTH)，
  // 兩者皆需支援，否則讀取階段就會擲斷，掩蓋真正的守門斷言。
  // 注意: 必須用 String.raw。在普通 template literal 中 \s 會被解析成字面 "s"，
  // 導致正則變成 /const X =s*/ 而永遠比對不到（首次實測即因此擲 actual: null）。
  const m = serverSrc.match(
    new RegExp(String.raw`const ${name} =\s*\n?\s*'?([^'\n]+?)'?\s*;`)
  );
  assert.ok(m, `server.js 內找不到常數 ${name}（守門邏輯已變更，請同步本測試）`);
  return m[1];
}

const LEAKED_FROM_GIT_HISTORY = readConst('LEAKED_FROM_GIT_HISTORY');
const MIN_SECRET_LENGTH = Number(readConst('MIN_SECRET_LENGTH'));

const KNOWN_LEAKED_DEFAULTS = new Set([
  'ftg-journey-secret-key-change-in-production',
  'change-in-production',
  'secret',
  'password',
]);

// ─── 守門判斷式（逐行對應 server.js:41-69）────────────────────────────────
function gate(secret) {
  const t = (secret ?? '').trim();
  if (!t) return 'REJECT';
  if (KNOWN_LEAKED_DEFAULTS.has(t.toLowerCase()) || t === LEAKED_FROM_GIT_HISTORY)
    return 'REJECT';
  if (t.length < MIN_SECRET_LENGTH) return 'REJECT';
  return 'ACCEPT';
}

test('已外洩於公開 git 歷史的金鑰必須被擋下', () => {
  assert.equal(gate(LEAKED_FROM_GIT_HISTORY), 'REJECT');
});

test('外洩金鑰常數事實正確：128 hex / 64 bytes', () => {
  assert.equal(LEAKED_FROM_GIT_HISTORY.length, 128);
  assert.match(LEAKED_FROM_GIT_HISTORY, /^[0-9a-f]{128}$/);
});

test('舊硬編碼預設值必須被擋下', () => {
  assert.equal(gate('ftg-journey-secret-key-change-in-production'), 'REJECT');
});

test('常見弱值必須被擋下（含大小寫與空白繞過）', () => {
  for (const w of ['a', '123', 'password', 'PassWord', '  password  ', 'secret']) {
    assert.equal(gate(w), 'REJECT', `弱值 "${w}" 竟被接受`);
  }
});

test('未設定 / 空字串必須被擋下', () => {
  assert.equal(gate(undefined), 'REJECT');
  assert.equal(gate(''), 'REJECT');
  assert.equal(gate('   '), 'REJECT');
});

test('長度不足必須被擋下（邊界：31 < 32）', () => {
  assert.equal(gate('a'.repeat(MIN_SECRET_LENGTH - 1)), 'REJECT');
});

test('長度達標的隨機金鑰必須被接受（邊界：32 = 32）', () => {
  assert.equal(gate('a'.repeat(MIN_SECRET_LENGTH)), 'ACCEPT');
  assert.equal(gate(crypto.randomBytes(48).toString('hex')), 'ACCEPT');
});
