/**
 * Process Guardian - 安全防護腳本
 * 防止 Node 進程無限增殖的安全機制
 * 
 * 功能:
 * 1. 監控並限制最大 Node 進程數
 * 2. 自動終止異常增殖的進程
 * 3. 記錄安全事件日誌
 * 4. 提供定時檢查機制
 */

import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

// 安全配置
const CONFIG = {
    MAX_NODE_PROCESSES: 15,      // 最大允許 Node 進程數 (放寬一點以適應並發開發)
    CHECK_INTERVAL_MS: 5000,     // 檢查間隔 (5秒)
    MAX_RESTART_ATTEMPTS: 3,     // 最大重啟次數
    MAX_MEMORY_MB: 2048,         // 單個進程最大內存 (2GB)
    LOG_FILE: './logs/process-guardian.log',
    MAX_LOG_SIZE_MB: 10,         // 日誌最大大小
    ENABLE_AUTO_KILL: true,      // 啟用自動終止
};


// 進程追蹤
interface ProcessInfo {
    pid: number;
    command: string;
    startTime: number;
    restartCount: number;
}

const trackedProcesses = new Map<number, ProcessInfo>();
let isMonitoring = false;

/**
 * 寫入日誌並檢查大小 (防止日誌無限成長)
 */
async function log(message: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    try {
        const logDir = path.dirname(CONFIG.LOG_FILE);
        await fs.mkdir(logDir, { recursive: true });

        // 檢查日誌大小
        try {
            const stats = await fs.stat(CONFIG.LOG_FILE);
            if (stats.size > CONFIG.MAX_LOG_SIZE_MB * 1024 * 1024) {
                // 簡單旋轉：重新命名舊日誌
                await fs.rename(CONFIG.LOG_FILE, `${CONFIG.LOG_FILE}.old`);
            }
        } catch (e) { /* 文件不存在則忽略 */ }

        await fs.appendFile(CONFIG.LOG_FILE, logMessage);
    } catch (error) {
        console.error('Failed to write log:', error);
    }

    console.log(logMessage.trim());
}

/**
 * 獲取當前 Node 進程列表 (使用 PowerShell 以獲取更多資訊)
 */
async function getNodeProcesses(): Promise<(ProcessInfo & { memoryMB: number })[]> {
    try {
        // 使用 PowerShell 獲取 PID, 命令行和內存使用量 (WorkingSet64 是位元組)
        const { stdout } = await execAsync(
            'powershell -Command "Get-Process node | Select-Object Id, ProcessName, WorkingSet64, @{Name=\'CommandLine\';Expression={(Get-CimInstance Win32_Process -Filter \\"ProcessId = $($_.Id)\\").CommandLine}} | ConvertTo-Json"',
            { encoding: 'utf8' }
        );

        if (!stdout || stdout.trim() === '') return [];

        let rawData = JSON.parse(stdout);
        if (!Array.isArray(rawData)) rawData = [rawData];

        const processes: (ProcessInfo & { memoryMB: number })[] = [];
        const currentPid = process.pid;

        for (const proc of rawData) {
            const pid = proc.Id;
            if (pid === currentPid) continue;

            const cmdLine = proc.CommandLine || '';
            if (cmdLine.includes('vscode') || cmdLine.includes('cursor')) continue;

            processes.push({
                pid: pid,
                command: cmdLine,
                startTime: Date.now(),
                restartCount: 0,
                memoryMB: Math.round(proc.WorkingSet64 / (1024 * 1024)),
            });
        }

        return processes;
    } catch (error) {
        return [];
    }
}

/**
 * 強制終止指定 PID 的進程
 */
async function killProcess(pid: number, reason: string): Promise<void> {
    try {
        await execAsync(`taskkill /F /PID ${pid}`);
        await log(`✅ 已終止進程 PID: ${pid} (${reason})`);
    } catch (error) {
        await log(`❌ 終止 PID ${pid} 失敗: ${error}`);
    }
}

/**
 * 強制終止所有 Node 進程 (安全模式)
 */
async function killAllNodeProcesses(reason: string = '緊急清理'): Promise<void> {
    const processes = await getNodeProcesses();
    if (processes.length === 0) return;

    await log(`⚠️ 緊急終止: ${reason} (涉及 ${processes.length} 個進程)`);

    for (const proc of processes) {
        await killProcess(proc.pid, reason);
    }

    trackedProcesses.clear();
}

/**
 * 監控循環
 */
async function monitorLoop(): Promise<void> {
    if (!isMonitoring) return;

    try {
        const processes = await getNodeProcesses();
        const processCount = processes.length;

        // 1. 檢查數量限制
        if (processCount > CONFIG.MAX_NODE_PROCESSES) {
            await log(`⚠️ 警告: 進程數 (${processCount}) 超過限制 (${CONFIG.MAX_NODE_PROCESSES})`);
            if (CONFIG.ENABLE_AUTO_KILL) {
                await killAllNodeProcesses('數量過多');
            }
        }

        // 2. 檢查內存限制
        for (const proc of processes) {
            if (proc.memoryMB > CONFIG.MAX_MEMORY_MB) {
                await log(`⚠️ 警告: PID ${proc.pid} 內存使用量過高 (${proc.memoryMB} MB)`);
                if (CONFIG.ENABLE_AUTO_KILL) {
                    await killProcess(proc.pid, '內存超限');
                }
            }
        }

        if (processCount > 0) {
            const totalMem = processes.reduce((acc, p) => acc + p.memoryMB, 0);
            await log(`🔍 監控中: ${processCount} 個進程 | 總內存: ${totalMem} MB`);
        }

        // 更新追蹤列表
        trackedProcesses.clear();
        for (const proc of processes) {
            trackedProcesses.set(proc.pid, proc);
        }

    } catch (error) {
        await log(`❌ 監控異常: ${error}`);
    }

    // 設定下次檢查
    setTimeout(monitorLoop, CONFIG.CHECK_INTERVAL_MS);
}

/**
 * 啟動監控
 */
export async function startGuardian(): Promise<void> {
    await log('🚀 Process Guardian 啟動');
    isMonitoring = true;

    // 立即執行一次檢查
    await monitorLoop();
}

/**
 * 停止監控
 */
export async function stopGuardian(): Promise<void> {
    await log('🛑 Process Guardian 停止');
    isMonitoring = false;
}

/**
 * 手動觸發安全檢查
 */
export async function triggerSafetyCheck(): Promise<void> {
    await log('🔧 手動觸發安全檢查');
    await killAllNodeProcesses('手動觸發');
}

// 執行入口
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);

    switch (args[0]) {
        case 'start':
            startGuardian();
            break;
        case 'stop':
            stopGuardian();
            break;
        case 'check':
            triggerSafetyCheck();
            break;
        default:
            console.log(`
Process Guardian - 安全防護腳本
用法:
  npm run guardian:start    啟動監控
  npm run guardian:stop     停止監控  
  npm run guardian:check    執行安全檢查
      `);
    }
}

export default {
    startGuardian,
    stopGuardian,
    triggerSafetyCheck,
};
