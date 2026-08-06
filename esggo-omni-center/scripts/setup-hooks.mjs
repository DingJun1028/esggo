#!/usr/bin/env node
// scripts/setup-hooks.mjs
// After cloning this repo, run `node scripts/setup-hooks.mjs` ONCE to
// wire git's hooksPath to the repo's .githooks/ directory. This makes
// the anti-mojibake `encoding-check` pre-commit hook run automatically
// on every commit (the "passive auto-handling" of mojibake).
//
// Why: core.hooksPath is a LOCAL git config (never committed), so a
// fresh clone will NOT activate .githooks/pre-commit until this runs.
import { execSync } from 'child_process';

try {
  execSync('git config core.hooksPath .githooks', { stdio: 'inherit' });
  const current = execSync('git config core.hooksPath', { encoding: 'utf-8' }).trim();
  console.log(`[setup-hooks] OK - core.hooksPath = ${current}`);
  console.log('[setup-hooks] encoding-check pre-commit is now active.');
} catch (e) {
  // In Docker builds, git may not be available — skip gracefully
  const msg = e.message || String(e);
  if (msg.includes('not found') || msg.includes('ENOENT') || msg.includes('git')) {
    console.warn('[setup-hooks] git not available, skipping (Docker build?)');
  } else {
    console.error('[setup-hooks] FAILED to set core.hooksPath:', msg);
    process.exit(1);
  }
}
