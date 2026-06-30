#!/usr/bin/env node

/**
 * Encoding Check — Scans for U+FFFD (garbled characters)
 *
 * Usage:
 *   node scripts/encoding-check.mjs              # check all tracked files
 *   node scripts/encoding-check.mjs --staged      # check git staged files
 *   node scripts/encoding-check.mjs --fix         # replace U+FFFD with '?'
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const args = process.argv.slice(2);
const isStaged = args.includes('--staged');
const shouldFix = args.includes('--fix');

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
  if (!['ts', 'tsx', 'js', 'mjs', 'cjs', 'json', 'md', 'html', 'css', 'yaml', 'yml'].includes(ext)) return [];

  const content = readFileSync(filePath, 'utf-8');
  const matches = [];
  const idx = content.indexOf('\uFFFD');
  if (idx !== -1) {
    const lineNum = content.slice(0, idx).split('\n').length;
    const line = content.split('\n')[lineNum - 1]?.trim();
    matches.push({ file: filePath, line: lineNum, text: line });
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
  console.log(`[encoding-check] ✓ ${isStaged ? 'Staged' : 'All'} files clean — no U+FFFD found`);
  process.exit(0);
}

console.log(`[encoding-check] ✗ Found ${allMatches.length} U+FFFD occurrence(s):\n`);
for (const m of allMatches) {
  console.log(`  ${m.file}:${m.line}  —  ${m.text}`);
}

if (shouldFix) {
  console.log('\n[encoding-check] Fixing by replacing U+FFFD with "?"...');
  const fixed = new Set();
  for (const m of allMatches) {
    if (fixed.has(m.file)) continue;
    fixed.add(m.file);
    const content = readFileSync(m.file, 'utf-8');
    writeFileSync(m.file, content.replace(/\uFFFD/g, '?'), 'utf-8');
    console.log(`  Fixed: ${m.file}`);
  }
  console.log('\n[encoding-check] Done. Please review and re-stage files.');
  process.exit(1);
}

console.log('\n[encoding-check] Use --fix to auto-replace with "?".');
process.exit(1);
