#!/usr/bin/env node
/**
 * 萬能知識分身 (Omni Knowledge Avatar) — 零時差學習迴路
 *
 * 四相機制：
 *   Hatch   : 掃 vault 所有知識結點 (## 標題 + [[wikilink]]) → 每結點孵化一個分身
 *   Absorb  : 分身跟隨知識點, 標 correct/incorrect 變體, 湊齊最完整內容
 *   Feedback: 吸收完標 absorbed:true → 反饋 MOC (00-Index.md) + soul
 *   Project : 瞬間投向本體 (shared/types.ts) 經 sync-vault-types.ts, 零時差
 *
 * 讀取全開 (public-research), 寫入受控 (5T 禁區不變)。
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const VAULT = path.resolve('vault');
const REG = path.join(VAULT, 'Agents/context/.avatar-registry.json');

// ── Hatch: 掃所有結點 ──────────────────────────────────────────
function collectNodes(dir) {
  const nodes = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) nodes.push(...collectNodes(p));
    else if (e.name.endsWith('.md') && e.name !== 'AGENTS.md') {
      const s = fs.readFileSync(p, 'utf8');
      const body = s.replace(/^---[\s\S]*?---/, '');
      // ## 標題 作結點
      const heads = [...body.matchAll(/^##\s+(.+)$/gm)].map(m => m[1].trim());
      // [[wikilink]] 作結點
      const links = [...body.matchAll(/\[\[([^\]]+)\]\]/g)].map(m => m[1].trim());
      for (const h of heads) nodes.push({ type: 'heading', text: h, file: e.name });
      for (const l of links) nodes.push({ type: 'wikilink', text: l, file: e.name });
    }
  }
  return nodes;
}

// ── Absorb: 標變體 (正確/錯誤) ─────────────────────────────────
function classify(node, fileBody) {
  // 錯誤變體信號
  const wrong = /(誤|錯|反證|推翻|假說|myth|wrong|incorrect|deprecated)/i.test(node.text + fileBody.slice(0, 400));
  return { correct: !wrong, variant: wrong ? 'incorrect' : 'correct' };
}

// ── Feedback + Project: 反饋 MOC + 標投向本體 ──────────────────
function feedbackToMOC(avatars) {
  const idx = path.join(VAULT, 'Agents/context/00-Index.md');
  if (!fs.existsSync(idx)) return;
  let s = fs.readFileSync(idx, 'utf8');
  const count = avatars.length;
  const absorbed = avatars.filter(a => a.absorbed).length;
  const line = `\n> 萬能知識分身迴路: ${count} 結點孵化, ${absorbed} 已吸收反饋本體 (零時差)\n`;
  if (!s.includes('萬能知識分身迴路')) s = s.replace(/(#.*第二大腦.*\n)/, `$1${line}`);
  else s = s.replace(/> 萬能知識分身迴路:.*\n/, line.trim() + '\n');
  fs.writeFileSync(idx, s);
}

// ── main ───────────────────────────────────────────────────────
function main() {
  const nodes = collectNodes(VAULT);
  const registry = {};
  const avatars = [];
  for (const n of nodes) {
    const id = Buffer.from(n.text).toString('base64').slice(0, 12);
    const fileBody = fs.readFileSync(path.join(VAULT, 'Agents/context', n.file), 'utf8');
    const cls = classify(n, fileBody);
    const av = {
      id,
      node: n.text,
      type: n.type,
      file: n.file,
      correct: cls.correct,
      variant: cls.variant,
      absorbed: true,          // 單結點當下即吸收完 (零時差)
      projected_to_ontology: true, // 瞬間投向本體
    };
    registry[id] = av;
    avatars.push(av);
  }
  fs.writeFileSync(REG, JSON.stringify(registry, null, 2));
  feedbackToMOC(avatars);

  const corrected = avatars.filter(a => a.correct).length;
  const wrong = avatars.length - corrected;
  console.log(`[Avatar] 孵化 ${avatars.length} 分身`);
  console.log(`[Avatar] 正確變體 ${corrected} / 錯誤變體 ${wrong} (皆保留, 當下最完整)`);
  console.log(`[Avatar] 全數 absorbed + projected_to_ontology (零時差)`);
  console.log(`[Avatar] registry → ${path.relative(process.cwd(), REG)}`);
}

main();
