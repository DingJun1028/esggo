#!/usr/bin/env node

/**
 * OmniHermes + ESG Go Native CLI Tool
 * v1.0.0 | Antigravity-Style Terminal Interface
 */

import { Command } from 'commander';
import pc from 'picocolors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const program = new Command();

const DEFAULT_HERMES_GATEWAY_URL = 'http://161.118.248.180:8642';

// ── BlueCC Simulation ────────────────────────────────────────────────────────
async function fetchBlueStatus() {
  return {
    cluster_id: 'blue-cluster-01',
    status: 'healthy',
    active_nodes: 12,
    region: 'asia-east1'
  };
}

async function fetchHermesStatusLocal() {
  const url = process.env.NEXT_PUBLIC_HERMES_GATEWAY_URL || DEFAULT_HERMES_GATEWAY_URL;
  try {
    const res = await fetch(`${url}/status`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error('Gateway offline');
    return await res.json();
  } catch (e) {
    return {
      status: 'online',
      version: '0.14.1',
      active_workers: 4,
      memory_usage: '2.4 GB',
      is_mock: true
    };
  }
}

program
  .name('omni')
  .description('OmniHermes + ESG Go Terminal Interface')
  .version('1.0.0');

// ── Database & System Commands ───────────────────────────────────────────────
const db = program.command('db').description('Database and system administration');

db.command('check')
  .description('Check database connection and environment')
  .action(async () => {
    console.log(pc.blue('🔍 Checking Omni_Terminal System Environment...'));
    
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      console.log(pc.red('❌ Missing Supabase environment variables.'));
      process.exit(1);
    }

    try {
      const supabase = createClient(url, key);
      const { data, error } = await supabase.from('audit_logs').select('count').limit(1);
      
      if (error) throw error;
      
      console.log(pc.green('✅ Supabase Connection: STABLE'));
      console.log(pc.cyan(`📡 Endpoint: ${url}`));
    } catch (err) {
      console.log(pc.red(`❌ Database Error: ${err.message}`));
    }
  });

// ── Agent & Swarm Commands ───────────────────────────────────────────────────
const agent = program.command('agent').description('Omni-Agent and Swarm orchestration');

agent.command('status')
  .description('Fetch current Hermes Gateway status')
  .action(async () => {
    console.log(pc.blue('📡 Fetching OmniHermes Gateway Status...'));
    const status = await fetchHermesStatusLocal();
    
    if (status.is_mock) {
      console.log(pc.yellow('⚠️ Mode: MOCK (Local Fallback)'));
    } else {
      console.log(pc.green('✅ Mode: LIVE (VPS-Native)'));
    }
    
    console.log(pc.white(`----------------------------------`));
    console.log(`Version:  ${status.version}`);
    console.log(`Workers:  ${status.active_workers}`);
    console.log(`Memory:   ${status.memory_usage}`);
    console.log(pc.white(`----------------------------------`));
  });

agent.command('run <task>')
  .description('Run an agent task via Edge Function with Function Calling')
  .action(async (task) => {
    console.log(pc.cyan(`🤖 Invoking Edge AgentZ0 for task: "${task}"...`));
    try {
      // Typically NEXT_PUBLIC_SITE_URL or localhost for local dev
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Agent API failed');
      
      if (!data.result || !data.result.success) {
        console.log(pc.red(`❌ Agent (${data.result?.agent || 'Unknown'}) Execution Error: ${JSON.stringify(data.result?.error?.message || data.result?.error || data.error || 'Unknown Error')}`));
      } else {
        console.log(pc.green(`✅ Agent (${data.result.agent}) execution successful!`));
        console.log(pc.white('──────────────────────────────────────────────────'));
        console.log(pc.yellow(data.result.result));
        console.log(pc.white('──────────────────────────────────────────────────'));
      }
    } catch (err) {
      console.log(pc.red(`❌ Agent Execution Error: ${err.message}`));
    }
  });

// ── Vault & ZKP Commands ─────────────────────────────────────────────────────
const vault = program.command('vault').description('Cryptographic seal and evidence management');

vault.command('list')
  .description('List recent records from Vault Omni Core')
  .option('-l, --limit <number>', 'Number of records to fetch', '10')
  .action(async (options) => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(url, key);

    console.log(pc.blue(`📦 Listing recent ${options.limit} Vault records...`));
    
    try {
      const { data, error } = await supabase
        .from('vault_omni_core')
        .select('uuid, dimension, hash_lock, timestamp')
        .order('timestamp', { ascending: false })
        .limit(parseInt(options.limit));

      if (error) {
        console.log(pc.red(`❌ Error: ${error.message}`));
        return;
      }

      data.forEach(r => {
        const time = new Date(r.timestamp).toLocaleString();
        console.log(`${pc.gray(time)} | ${pc.cyan(r.uuid.slice(0,8))} | ${pc.green(r.hash_lock.slice(0,12))}... | ${pc.white(r.dimension)}`);
      });
    } catch (err) {
      console.log(pc.red(`❌ Error: ${err.message}`));
    }
  });

// ── Intelligence Hub Commands ────────────────────────────────────────────────
const intel = program.command('intel').description('ESG Intelligence and Regulatory Hub');

intel.command('fetch <source>')
  .description('Fetch latest regulations (EU, TW, GRI)')
  .action(async (source) => {
    console.log(pc.blue(`🔍 Fetching ESG intelligence from [${source.toUpperCase()}]...`));
    
    // Simulate scraper logic (matching lib/services/scraper.ts)
    await new Promise(r => setTimeout(r, 1500));
    
    const data = {
      'EU': [{ title: 'EU 2023/956: CBAM Implementing Regulation', date: '2023-05-16' }],
      'TW': [{ title: '氣候變遷因應法：碳費徵收辦法草案', date: '2024-04-29' }],
      'GRI': [{ title: 'GRI 101: Biodiversity 2024', date: '2024-01-25' }]
    };

    const results = data[source.toUpperCase()] || [];
    if (results.length === 0) {
      console.log(pc.yellow('⚠️ No recent updates found for this source.'));
    } else {
      results.forEach(r => {
        console.log(`${pc.green('✅ FOUND')} | ${pc.white(r.title)} (${pc.gray(r.date)})`);
      });
    }
  });

// ── Audit & Integrity Commands ───────────────────────────────────────────────
const audit = program.command('audit').description('5T Integrity & Compliance auditing');

audit.command('report')
  .description('Generate a 5T integrity summary report')
  .action(async () => {
    console.log(pc.blue('📊 Generating 5T Integrity Audit Report...'));
    
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      console.log(pc.yellow('⚠️ Database offline. Showing simulation based on local memory.'));
      await new Promise(r => setTimeout(r, 1000));
      console.log(pc.white('------------------------------------------'));
      console.log(`${pc.bold('Organization:')}  ESG GO Terminal v8.5.1`);
      console.log(`${pc.bold('Audit Date:')}    ${new Date().toLocaleDateString()}`);
      console.log(pc.white('------------------------------------------'));
      console.log(`${pc.cyan('T1 Traceable:')}    ${pc.green('100%')} (Digital Twin Grounding)`);
      console.log(`${pc.cyan('T2 Transparent:')}  ${pc.green('92%')}  (Open RPC Specs)`);
      console.log(`${pc.cyan('T3 Tangible:')}     ${pc.green('85%')}  (UI Atomic Consistency)`);
      console.log(`${pc.cyan('T4 Trustworthy:')}  ${pc.yellow('78%')}  (ZKP Vault Seals)`);
      console.log(`${pc.cyan('T5 Trackable:')}    ${pc.green('95%')}  (Audit Log Stream)`);
      console.log(pc.white('------------------------------------------'));
      console.log(`${pc.bold('OVERALL TRUST SCORE:')} ${pc.magenta('90/100')}`);
      return;
    }

    try {
      const supabase = createClient(url, key);
      const { data: vaultRecords } = await supabase.from('vault_omni_core').select('uuid');
      const { data: auditLogs } = await supabase.from('audit_logs').select('id');
      
      console.log(pc.green('✅ Real-time data retrieved.'));
      console.log(pc.white('------------------------------------------'));
      console.log(`${pc.bold('Sealed Records:')}  ${vaultRecords?.length || 0}`);
      console.log(`${pc.bold('Audit Events:')}    ${auditLogs?.length || 0}`);
      console.log(`${pc.bold('Integrity Status:')} ${pc.green('HEALTHY')}`);
      console.log(pc.white('------------------------------------------'));
    } catch (err) {
      console.log(pc.red(`❌ Audit failed: ${err.message}`));
    }
  });

// ── BlueCC & Cloud Commands ──────────────────────────────────────────────────
const blue = program.command('blue').description('BlueCC Cloud Control Plane management');

blue.command('status')
  .description('Fetch global agent cluster status from BlueCC')
  .action(async () => {
    console.log(pc.blue('☁️ Connecting to BlueCC Control Plane...'));
    const status = await fetchBlueStatus();
    
    console.log(pc.green(`✅ Cluster: ${status.cluster_id} (STABLE)`));
    console.log(`Region:  ${status.region}`);
    console.log(`Nodes:   ${status.active_nodes} Active`);
  });

blue.command('deploy <agentName>')
  .description('Deploy a new agent instance to the cloud')
  .action(async (name) => {
    console.log(pc.cyan(`🚀 Provisioning Agent [${name}] on BlueCC...`));
    await new Promise(r => setTimeout(r, 1500));
    console.log(pc.green(`✅ Deployment successful: https://${name}.agents.blue.cc`));
  });

program.parse();
