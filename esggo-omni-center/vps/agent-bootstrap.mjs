#!/usr/bin/env node
/**
 * ==========================================
 * 🛡️ VPS Agent — OmniCore Cooperation Bridge
 * ==========================================
 *
 * Runs on the VPS and cooperates with the OmniAgent Gateway (the "萬能系統"):
 *   1. Registers this agent with the gateway on startup
 *   2. Sends periodic heartbeats with system health
 *   3. Pulls queued commands and executes them locally
 *   4. Reports command results back to the gateway
 *
 * Start:   node vps/agent-bootstrap.mjs
 *
 * Env:
 *   GATEWAY_URL     - OmniAgent Gateway base URL (default: http://localhost:8642)
 *   GATEWAY_TOKEN   - optional X-Omni-Token for auth
 *   AGENT_ID        - stable agent id (default: derived from hostname)
 *   AGENT_NAME      - display name
 *   HEALTH_INTERVAL - heartbeat interval ms (default: 30000)
 *   POLL_INTERVAL   - command poll interval ms (default: 5000)
 *   CHANNEL         - how this agent is reached (default: direct)
 */

import { execSync } from 'child_process';
import { hostname } from 'os';
import { createHash } from 'crypto';

const CONFIG = {
  gatewayUrl: (process.env.GATEWAY_URL || 'http://localhost:8642').replace(/\/$/, ''),
  gatewayToken: process.env.GATEWAY_TOKEN || process.env.GATEWAY_API_KEY || '',
  agentId:
    process.env.AGENT_ID ||
    'vps-' + createHash('sha1').update(hostname()).digest('hex').slice(0, 12),
  agentName: process.env.AGENT_NAME || `VPS Agent (${hostname()})`,
  channel: process.env.CHANNEL || 'direct',
  capabilities: (process.env.AGENT_CAPS || 'shell,health,relay').split(','),
  healthInterval: parseInt(process.env.HEALTH_INTERVAL || '30000'),
  pollInterval: parseInt(process.env.POLL_INTERVAL || '5000'),
};

function log(msg) {
  console.log(`[VPSAgent ${new Date().toISOString()}] ${msg}`);
}

// ==========================================
// Local command execution
// ==========================================
function localExec(command, timeoutMs = 30000) {
  try {
    const out = execSync(command, {
      encoding: 'utf-8',
      timeout: timeoutMs,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { stdout: out.trim(), exitCode: 0 };
  } catch (error) {
    return {
      stdout: (error.stdout || '').toString().trim(),
      stderr: (error.stderr || error.message).toString().trim(),
      exitCode: error.status || 1,
    };
  }
}

// ==========================================
// Gateway HTTP client
// ==========================================
async function gateway(path, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (CONFIG.gatewayToken) headers['X-Omni-Token'] = CONFIG.gatewayToken;
  const res = await fetch(`${CONFIG.gatewayUrl}${path}`, {
    method: body ? 'POST' : 'GET',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try {
    return { status: res.status, data: text ? JSON.parse(text) : null };
  } catch {
    return { status: res.status, data: { raw: text } };
  }
}

// ==========================================
// Cooperation primitives
// ==========================================
async function register() {
  const { status, data } = await gateway('/agent/register', {
    agentId: CONFIG.agentId,
    name: CONFIG.agentName,
    host: hostname(),
    channel: CONFIG.channel,
    capabilities: CONFIG.capabilities,
  });
  log(status === 200 ? `Registered with gateway (${CONFIG.gatewayUrl})` : `Register failed: ${status}`);
  return status === 200;
}

async function heartbeat(system) {
  const { status, data } = await gateway('/agent/heartbeat', {
    agentId: CONFIG.agentId,
    host: hostname(),
    channel: CONFIG.channel,
    capabilities: CONFIG.capabilities,
    system,
  });
  if (status !== 200) {
    log(`Heartbeat failed (${status}) — re-registering`);
    await register();
    return [];
  }
  return (data && data.pending) || [];
}

async function reportResult(commandId, result) {
  await gateway('/agent/result', {
    agentId: CONFIG.agentId,
    commandId,
    result,
  });
}

// ==========================================
// Health check
// ==========================================
function collectHealth() {
  const cpu = localExec("top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | sed 's/%us,//'");
  const mem = localExec("free -m | awk '/Mem:/ {printf \"%.1f\", $3/$2*100}'");
  const disk = localExec("df -h / | awk 'NR==2 {print $5}' | tr -d '%'");
  const load = localExec('cat /proc/loadavg').stdout.split(/\s+/);

  const services = {};
  const check = (name, port, path = '/') => {
    const r = localExec(
      `curl -s -o /dev/null -w "%{http_code}" --max-time 3 http://localhost:${port}${path}`,
    );
    services[name] = {
      status: r.stdout !== '000' ? 'running' : 'stopped',
      health: r.stdout.startsWith('2') ? 'healthy' : 'unhealthy',
      port,
    };
  };
  check('esggo-core', 3000, '/');
  check('omniagent-gateway', 8642, '/status');
  const nginx = localExec('systemctl is-active nginx').stdout;
  services['nginx'] = {
    status: nginx === 'active' ? 'running' : 'stopped',
    health: nginx === 'active' ? 'healthy' : 'unhealthy',
    port: 80,
  };

  return {
    cpuPercent: parseFloat(cpu.stdout) || 0,
    memoryPercent: parseFloat(mem.stdout) || 0,
    diskPercent: parseFloat(disk.stdout) || 0,
    loadAverage: [parseFloat(load[0]) || 0, parseFloat(load[1]) || 0, parseFloat(load[2]) || 0],
    services,
  };
}

// ==========================================
// Command execution loop
// ==========================================
async function executePending(commands) {
  for (const cmd of commands) {
    log(`Executing: ${cmd.command}`);
    const start = Date.now();
    const r = localExec(cmd.command);
    const result = {
      commandId: cmd.id,
      stdout: r.stdout.slice(0, 50000),
      stderr: r.stderr.slice(0, 10000),
      exitCode: r.exitCode,
      durationMs: Date.now() - start,
      ts: new Date().toISOString(),
    };
    await reportResult(cmd.id, result);
    log(`Result reported (exit=${r.exitCode}, ${result.durationMs}ms)`);
  }
}

// ==========================================
// Main
// ==========================================
async function main() {
  log(`Starting VPS Agent cooperation bridge → ${CONFIG.gatewayUrl}`);
  log(`Agent ID: ${CONFIG.agentId} | Channel: ${CONFIG.channel}`);

  await register();

  setInterval(async () => {
    const system = collectHealth();
    const pending = await heartbeat(system);
    if (pending.length) await executePending(pending);
  }, CONFIG.healthInterval);

  setInterval(async () => {
    const { status, data } = await gateway('/agent/heartbeat', { agentId: CONFIG.agentId });
    if (status === 200 && data && data.pending && data.pending.length) {
      await executePending(data.pending);
    }
  }, CONFIG.pollInterval);

  log('VPS Agent is cooperating with the Omni system. 「萬能元件心核，量子糾纏永恆。」');
}

main().catch((error) => {
  console.error('[VPSAgent] Fatal:', error);
  process.exit(1);
});
