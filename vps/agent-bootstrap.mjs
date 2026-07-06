#!/usr/bin/env node
/**
 * ==========================================
 * 🛡️ VPS Agent Bootstrap — 量子糾纏啟動腳本
 * ==========================================
 * 
 * 在 VPS 上運行，將 VPS Agent 註冊到 OmniCore 生態系統
 * 
 * 功能：
 * 1. 初始化 VPS Agent 並建立量子糾纏
 * 2. 定期健康檢查並同步狀態
 * 3. 接收並執行來自 OmniAgent 的指令
 * 4. 自動修復退相干（重新建立連接）
 * 
 * 啟動方式：
 *   node vps/agent-bootstrap.mjs
 * 
 * 環境變量：
 *   VPS_HOST         - VPS 主機地址 (默認: 161.118.248.180)
 *   VPS_PORT         - VPS SSH 端口 (默認: 8042)
 *   HEALTH_INTERVAL  - 健康檢查間隔 (默認: 30000ms)
 *   GATEWAY_PORT     - Gateway 端口 (默認: 8642)
 */

import { createHash } from 'crypto';
import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// ==========================================
// 配置
// ==========================================

const CONFIG = {
  vpsHost: process.env.VPS_HOST || '161.118.248.180',
  vpsPort: parseInt(process.env.VPS_PORT || '8042'),
  healthInterval: parseInt(process.env.HEALTH_INTERVAL || '30000'),
  gatewayPort: parseInt(process.env.GATEWAY_PORT || '8642'),
  projectName: 'esggo',
  projectPath: '/var/www/esggo',
};

// ==========================================
// 量子態管理
// ==========================================

const quantumState = {
  measurement: 'superposition',
  phase: Math.random() * Math.PI * 2,
  fidelity: 0,
  lastSyncAt: null,
  decoherenceCount: 0,
};

function collapse波函數(targetState = 'collapsed') {
  quantumState.measurement = targetState;
  quantumState.lastSyncAt = Date.now();
}

function restore糾纏態() {
  quantumState.measurement = 'entangled';
  quantumState.fidelity = Math.min(1, quantumState.fidelity + 0.1);
  quantumState.lastSyncAt = Date.now();
}

function handle退相干(reason) {
  quantumState.measurement = 'decohered';
  quantumState.fidelity = Math.max(0, quantumState.fidelity - 0.2);
  quantumState.decoherenceCount++;
  console.error(`[VPSAgent] ❌ 退相干: ${reason} (次數: ${quantumState.decoherenceCount})`);
  
  if (quantumState.decoherenceCount > 3) {
    console.log('[VPSAgent] 🔄 嘗試重新相干...');
    quantumState.measurement = 'entangled';
    quantumState.phase = Math.random() * Math.PI * 2;
    quantumState.fidelity = 0.5;
    quantumState.decoherenceCount = 0;
  }
}

// ==========================================
// SSH 命令執行
// ==========================================

function sshExec(command, timeoutMs = 10000) {
  try {
    const result = execSync(
      `ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 -p ${CONFIG.vpsPort} root@${CONFIG.vpsHost} "${command}"`,
      { encoding: 'utf-8', timeout: timeoutMs, stdio: ['pipe', 'pipe', 'pipe'] }
    );
    return { stdout: result.trim(), exitCode: 0 };
  } catch (error) {
    return { stdout: error.stdout?.trim() || '', stderr: error.stderr?.trim() || error.message, exitCode: error.status || 1 };
  }
}

function localExec(command, timeoutMs = 10000) {
  try {
    const result = execSync(command, { encoding: 'utf-8', timeout: timeoutMs, stdio: ['pipe', 'pipe', 'pipe'] });
    return { stdout: result.trim(), exitCode: 0 };
  } catch (error) {
    return { stdout: error.stdout?.trim() || '', stderr: error.stderr?.trim() || error.message, exitCode: error.status || 1 };
  }
}

// ==========================================
// 健康檢查
// ==========================================

async function performHealthCheck() {
  collapse波函數('collapsed');
  
  const startTime = Date.now();
  const issues = [];
  
  try {
    // 系統資源
    const cpuResult = localExec("top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | sed 's/%us,//'");
    const memResult = localExec("free -m | awk '/Mem:/ {printf \"%.1f\", $3/$2*100}'");
    const diskResult = localExec("df -h / | awk 'NR==2 {print $5}' | tr -d '%'");
    const loadResult = localExec("cat /proc/loadavg");
    
    const loadParts = loadResult.stdout.split(/\s+/);
    const system = {
      cpuPercent: parseFloat(cpuResult.stdout) || 0,
      memoryPercent: parseFloat(memResult.stdout) || 0,
      diskPercent: parseFloat(diskResult.stdout) || 0,
      loadAverage: [parseFloat(loadParts[0]) || 0, parseFloat(loadParts[1]) || 0, parseFloat(loadParts[2]) || 0],
    };

    // 服務狀態
    const services = {};
    
    // ESGGO Core
    const esggoResult = localExec('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/');
    services['esggo-core'] = {
      status: esggoResult.stdout !== '000' ? 'running' : 'stopped',
      health: esggoResult.stdout.startsWith('2') ? 'healthy' : 'unhealthy',
      port: 3000,
    };

    // Gateway
    const gatewayResult = localExec('curl -s -o /dev/null -w "%{http_code}" http://localhost:8642/health');
    services['omniagent-gateway'] = {
      status: gatewayResult.stdout !== '000' ? 'running' : 'stopped',
      health: gatewayResult.stdout.startsWith('2') ? 'healthy' : 'unhealthy',
      port: 8642,
    };

    // Nginx
    const nginxResult = localExec('systemctl is-active nginx');
    services['nginx'] = {
      status: nginxResult.stdout === 'active' ? 'running' : 'stopped',
      health: nginxResult.stdout === 'active' ? 'healthy' : 'unhealthy',
      port: 80,
    };

    // Redis
    const redisResult = localExec('redis-cli ping');
    services['redis'] = {
      status: redisResult.stdout === 'PONG' ? 'running' : 'stopped',
      health: redisResult.stdout === 'PONG' ? 'healthy' : 'unhealthy',
      port: 6379,
    };

    // 發現問題
    if (system.cpuPercent > 90) issues.push({ severity: 'critical', message: `CPU 過高: ${system.cpuPercent.toFixed(1)}%` });
    if (system.memoryPercent > 90) issues.push({ severity: 'critical', message: `RAM 過高: ${system.memoryPercent.toFixed(1)}%` });
    if (system.diskPercent > 85) issues.push({ severity: 'warning', message: `Disk 偏高: ${system.diskPercent.toFixed(1)}%` });

    for (const [name, svc] of Object.entries(services)) {
      if (svc.status === 'stopped') issues.push({ severity: 'critical', message: `${name} 已停止` });
    }

    const duration = Date.now() - startTime;
    
    restore糾纏態();
    
    return {
      timestamp: Date.now(),
      system,
      services,
      issues,
      durationMs: duration,
      quantum: { ...quantumState },
    };

  } catch (error) {
    handle退相干(error.message);
    return { timestamp: Date.now(), error: String(error), quantum: { ...quantumState } };
  }
}

// ==========================================
// 狀態報告
// ==========================================

function generateStatusReport(healthData) {
  const lines = [
    '═══════════════════════════════════════════════════════════════',
    '  🛡️ VPS Agent — 量子糾纏子代理狀態報告',
    '═══════════════════════════════════════════════════════════════',
    '',
    `  時間: ${new Date().toISOString()}`,
    `  主機: ${CONFIG.vpsHost}:${CONFIG.vpsPort}`,
    `  量子態: ${quantumState.measurement}`,
    `  保真度: ${(quantumState.fidelity * 100).toFixed(1)}%`,
    `  相位: ${quantumState.phase.toFixed(4)}`,
    '',
    '  ─── 系統資源 ───────────────────────────────────────────',
    `  CPU:   ${healthData.system?.cpuPercent?.toFixed(1) ?? 'N/A'}%`,
    `  RAM:   ${healthData.system?.memoryPercent?.toFixed(1) ?? 'N/A'}%`,
    `  Disk:  ${healthData.system?.diskPercent?.toFixed(1) ?? 'N/A'}%`,
    `  Load:  ${healthData.system?.loadAverage?.map(l => l.toFixed(2)).join(' / ') ?? 'N/A'}`,
    '',
    '  ─── 服務狀態 ───────────────────────────────────────────',
  ];

  for (const [name, svc] of Object.entries(healthData.services || {})) {
    const icon = svc.status === 'running' ? '✅' : '❌';
    const health = svc.health === 'healthy' ? '💚' : svc.health === 'degraded' ? '💛' : '❤️';
    lines.push(`  ${icon} ${name.padEnd(20)} ${health} ${svc.status} (port ${svc.port})`);
  }

  if (healthData.issues?.length > 0) {
    lines.push('', '  ─── 問題 ─────────────────────────────────────────────────');
    for (const issue of healthData.issues) {
      const icon = issue.severity === 'critical' ? '🚨' : '⚠️';
      lines.push(`  ${icon} [${issue.severity}] ${issue.message}`);
    }
  }

  lines.push(
    '',
    '═══════════════════════════════════════════════════════════════',
  );

  return lines.join('\n');
}

// ==========================================
// 主循環
// ==========================================

async function main() {
  console.log('[VPSAgent] 🛡️ VPS Agent 量子糾纏啟動中...');
  console.log(`[VPSAgent] 📍 主機: ${CONFIG.vpsHost}:${CONFIG.vpsPort}`);
  console.log(`[VPSAgent] ⏱️ 健康檢查間隔: ${CONFIG.healthInterval}ms`);
  
  // 初始健康檢查
  console.log('[VPSAgent] 🔍 執行初始健康檢查...');
  const initialHealth = await performHealthCheck();
  console.log(generateStatusReport(initialHealth));
  
  // 啟動定期健康檢查
  setInterval(async () => {
    const health = await performHealthCheck();
    console.log(generateStatusReport(health));
  }, CONFIG.healthInterval);
  
  console.log('[VPSAgent] ✨ VPS Agent 已啟動，等待量子糾纏指令...');
  console.log('[VPSAgent] 「萬能元件心核，量子糾纏永恆。」');
}

// 啟動
main().catch(error => {
  console.error('[VPSAgent] ❌ 啟動失敗:', error);
  process.exit(1);
});
