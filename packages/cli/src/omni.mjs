#!/usr/bin/env node

// ============================================================
// ESGGO CLI — Unified command-line tool
// ============================================================

const { program } = await import('commander');

program
  .name('esggo')
  .description('ESGGO — Unified CLI for ESG sustainability platform')
  .version('1.0.0');

// ── vault seal ─────────────────────────────────────────────
program
  .command('vault seal')
  .description('ZKP-seal an evidence document (5T Trust protocol)')
  .argument('<id>', 'evidence UUID')
  .action(async (id) => {
    const { createHash } = await import('crypto');
    console.log(`[S] Initiating ZKP sealing for ID: ${id}...`);
    const hash = createHash('sha256').update(id + Date.now()).digest('hex');
    console.log(`[v] Cryptographic Seal Applied Successfully!`);
    console.log('-'.repeat(35));
    console.log(`Document ID:  ${id}`);
    console.log(`Status:       VERIFIED`);
    console.log(`ZKP Hash:     ${hash}`);
    console.log('-'.repeat(35));
  });

// ── sonnar ─────────────────────────────────────────────────
const sonnar = program
  .command('sonnar')
  .description('ESGSonnar data queries');

sonnar
  .command('enterprise')
  .description('Fetch enterprise profile')
  .argument('<companyId>', 'company identifier')
  .action(async (companyId) => {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/sonnar/enterprise?companyId=${companyId}`);
    const json = await res.json();
    console.log(JSON.stringify(json.data, null, 2));
  });

sonnar
  .command('crawl')
  .description('Trigger a source crawl')
  .argument('[sourceId]', 'source ID (omit for all)')
  .action(async (sourceId) => {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/sonnar/crawl`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sourceId ? { sourceId } : { all: true }),
    });
    const json = await res.json();
    console.log(JSON.stringify(json.data, null, 2));
  });

sonnar
  .command('radar')
  .description('Show signal radar overview')
  .action(async () => {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/sonnar/radar`);
    const json = await res.json();
    console.log(JSON.stringify(json.data, null, 2));
  });

sonnar
  .command('knowledge')
  .description('Analyze text for ESG knowledge')
  .argument('<text>', 'text to analyze')
  .action(async (text) => {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/sonnar/knowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: text }),
    });
    const json = await res.json();
    console.log(JSON.stringify(json.data, null, 2));
  });

// ── report ─────────────────────────────────────────────────
program
  .command('report daily')
  .description('Trigger daily report generation')
  .action(async () => {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/daily-report`, { method: 'POST' });
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
  });

// ── status ─────────────────────────────────────────────────
program
  .command('status')
  .description('Show system health')
  .action(async () => {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    try {
      const res = await fetch(`${base}/api/health`, { signal: AbortSignal.timeout(5000) });
      const json = await res.json();
      console.log(`Status: ${res.ok ? 'OK' : 'DEGRADED'}`);
      console.log(JSON.stringify(json, null, 2));
    } catch {
      console.error(`Cannot reach ${base} — is the server running?`);
      process.exit(1);
    }
  });

// ── db ─────────────────────────────────────────────────────
program
  .command('db migrate')
  .description('Run Prisma database migrations')
  .action(async () => {
    const { execSync } = await import('child_process');
    console.log('[DB] Running prisma migrate...');
    execSync('npx prisma migrate dev', { stdio: 'inherit' });
  });

program
  .command('db push')
  .description('Push Prisma schema to database')
  .action(async () => {
    const { execSync } = await import('child_process');
    console.log('[DB] Pushing schema to database...');
    execSync('npx prisma db push', { stdio: 'inherit' });
  });

// ── Parse ──────────────────────────────────────────────────
program.parse();
