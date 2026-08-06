#!/usr/bin/env node

/**
 * Encoding Check v2.0 — Root cause prevention
 *
 * Scans for:
 *   - U+FFFD (garbled replacement character)
 *   - Non-UTF-8 encoded files
 *
 * Usage:
 *   node scripts/encoding-check.mjs              # check all tracked files
 *   node scripts/encoding-check.mjs --staged      # check git staged files
 *   node scripts/encoding-check.mjs --fix         # log corruption for manual recovery
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'fs';
import { resolve, relative } from 'path';

const args = process.argv.slice(2);
const isStaged = args.includes('--staged');
const shouldFix = args.includes('--fix');

const ROOT = resolve(import.meta.dirname, '..');
const RECOVERY_LOG = resolve(ROOT, '.encoding-recovery.log');
const VALID_EXTS = new Set([
  'ts', 'tsx', 'jsx', 'js', 'mjs', 'cjs',
  'json', 'md', 'mdx', 'html', 'css',
  'yaml', 'yml', 'sh', 'ps1', 'bash',
  'env', 'prisma', 'toml', 'xml', 'svg',
  'vue', 'svelte', 'astro', 'graphql', 'sql',
]);

function getStagedFiles() {
  const out = execSync('git diff --cached --name-only --diff-filter=ACMR', { encoding: 'utf-8' });
  return out.trim().split('\n').filter(Boolean);
}

function findTrackedFiles() {
  const out = execSync('git ls-files', { encoding: 'utf-8' });
  return out.trim().split('\n').filter(Boolean);
}

function scanFile(filePath) {
  if (!existsSync(filePath)) return [];
  const ext = filePath.split('.').pop();
  if (!VALID_EXTS.has(ext)) return [];

  const raw = readFileSync(filePath); // read as Buffer

  // Check 1: Is it valid UTF-8?
  const content = raw.toString('utf-8');
  const buf = Buffer.from(content, 'utf-8');
  if (!buf.equals(raw)) {
    return [{ file: filePath, line: 0, text: `[NON-UTF8] File is not valid UTF-8 (raw=${raw.length}B, decoded=${buf.length}B)` }];
  }

  // Check 2: U+FFFD occurrences
  const matches = [];
  const idx = content.indexOf('\uFFFD');
  if (idx !== -1) {
    const lineNum = content.slice(0, idx).split('\n').length;
    const lines = content.split('\n');
    const line = lines[lineNum - 1]?.trim();
    // Show surrounding context for recovery
    const ctxBefore = lines[lineNum - 2]?.trim() || '';
    const ctxAfter = lines[lineNum]?.trim() || '';
    matches.push({
      file: filePath,
      line: lineNum,
      text: line,
      context: { before: ctxBefore, line, after: ctxAfter },
    });
  }

  return matches;
}

const files = isStaged ? getStagedFiles() : findTrackedFiles();
const allMatches = [];

for (const file of files) {
  const matches = scanFile(file);
  allMatches.push(...matches);
}

if (allMatches.length === 0) {
  console.log(`[encoding-check] \u2713 ${isStaged ? 'Staged' : 'All'} files clean — no encoding issues`);
  process.exit(0);
}

console.log(`[encoding-check] \u2717 Found ${allMatches.length} issue(s):\n`);
for (const m of allMatches) {
  console.log(`  ${m.file}:${m.line}`);
  console.log(`    ${m.text}`);
  if (m.context) {
    console.log(`    Context:`);
    console.log(`      before: ${m.context.before}`);
    console.log(`      BAD:    ${m.context.line}`);
    console.log(`      after:  ${m.context.after}`);
  }
  console.log();
}

if (shouldFix) {
  // Recovery mode: log corruption context for manual fix, then replace with placeholder
  console.log('[encoding-check] Writing recovery log...');
  const header = `\n=== Recovery ${new Date().toISOString()} ===\n`;
  appendFileSync(RECOVERY_LOG, header, 'utf-8');

  const fixed = new Set();
  for (const m of allMatches) {
    if (fixed.has(m.file)) continue;
    fixed.add(m.file);

    const content = readFileSync(m.file, 'utf-8');

    // Log all U+FFFD locations for recovery
    let pos = 0; let count = 0;
    while ((pos = content.indexOf('\uFFFD', pos)) !== -1) {
      count++;
      const lineNum = content.slice(0, pos).split('\n').length;
      const line = content.split('\n')[lineNum - 1]?.trim() || '';
      const snippet = line.length > 80 ? '...' + line.slice(-60) : line;
      appendFileSync(RECOVERY_LOG, `  ${m.file}:${lineNum} [occ #${count}] -> ${snippet}\n`, 'utf-8');
      pos++;
    }

    // Replace with marked placeholder (actual fix)
    const newContent = content.replace(/\uFFFD/g, '[U+FFFD_REMOVED]');
    writeFileSync(m.file, newContent, 'utf-8');
    console.log(`  Logged: ${m.file}`);
  }
  console.log(`\n[encoding-check] Recovery log: ${RECOVERY_LOG}`);
  console.log('[encoding-check] Manual fix required: edit files to replace \uFFFD with correct characters.');
  console.log('[encoding-check] Hint: These are usually emoji (🚀📄🔗🏆📖🌱🔥🔔✅💎🌟💬📣🌸🌳🛡️👍🎓📊)');
  process.exit(1);
}

console.log('[encoding-check] Use --fix to log corruption for manual recovery.');
process.exit(1);
