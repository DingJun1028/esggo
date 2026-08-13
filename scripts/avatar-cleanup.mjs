#!/usr/bin/env node
/**
 * 萬能知識分身 · 防回歸清理 (avatar-cleanup)
 *
 * 確保 C 線 --apply 測試型別 (IAvatarProbe*) 不殘留進 shared/types.ts canonical。
 * 在 cron 閉環末尾跑，掃 shared/types.ts 移除所有 IAvatarProbe* 開頭的 interface/type/enum。
 */
import fs from 'node:fs';
import path from 'node:path';

const TYPES = path.resolve('shared', 'types.ts');
if (!fs.existsSync(TYPES)) { console.log('[cleanup] 無 shared/types.ts, skip'); process.exit(0); }

let s = fs.readFileSync(TYPES, 'utf8');
const before = (s.match(/export\s+(?:type|interface|enum)\s+IAvatarProbe/g) || []).length;
if (before === 0) { console.log('[cleanup] ✅ 無測試型別殘留'); process.exit(0); }

// 移除 IAvatarProbe* 區塊 (從 export 到配對的 })
const re = /export\s+(?:type|interface|enum)\s+IAvatarProbe[A-Za-z0-9_]*[\s\S]*?\n}\n?/g;
s = s.replace(re, '');
fs.writeFileSync(TYPES, s);
console.log(`[cleanup] ✅ 移除 ${before} 個測試型別 (IAvatarProbe*)`);
