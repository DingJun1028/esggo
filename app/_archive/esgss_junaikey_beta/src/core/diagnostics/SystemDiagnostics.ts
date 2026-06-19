/**
 * Jun.AI.Key - 系統診斷模組 (System Diagnostics)
 * 感知層核心：監控系統健康狀況、資源使用與熵值
 */

import { v4 as uuidv4 } from 'uuid';

export type SystemStatus = 'healthy' | 'degraded' | 'critical';

export interface SystemHealth {
  status: SystemStatus;
  entropy: number; // 0-1, 1 為最大混亂
  resources: {
    cpu: number; // 模擬百分比
    memory: number; // 模擬百分比
    networkLatency: number; // ms
  };
  activeAgents: number;
  lastCheck: number;
  issues: string[];
}

export class SystemDiagnostics {
  private healthHistory: SystemHealth[] = [];
  private readonly MAX_HISTORY = 100;

  constructor() {}

  /**
   * 執行全面健康檢查
   */
  async checkHealth(): Promise<SystemHealth> {
    const resources = await this.monitorResources();
    const entropy = this.calculateEntropy(resources);
    const status = this.determineStatus(entropy, resources);

    const health: SystemHealth = {
      status,
      entropy,
      resources,
      activeAgents: this.countActiveAgents(), // 模擬數據，實際應從 Registry 獲取
      lastCheck: Date.now(),
      issues: this.detectIssues(resources, entropy),
    };

    this.recordHealth(health);
    return health;
  }

  /**
   * 獲取診斷報告
   */
  getDiagnosticsReport(): string {
    const current = this.healthHistory[this.healthHistory.length - 1];
    if (!current) return 'No diagnostics data available.';

    return `
=== System Diagnostics Report ===
Status: ${current.status.toUpperCase()}
Entropy: ${(current.entropy * 100).toFixed(1)}%
Resources: CPU ${current.resources.cpu}%, Mem ${current.resources.memory}%
Active Agents: ${current.activeAgents}
Issues: ${current.issues.length > 0 ? current.issues.join(', ') : 'None'}
=================================
    `.trim();
  }

  // --- Private Methods ---

  private async monitorResources() {
    // 模擬資源監控 (在瀏覽器環境中無法直接獲取真實系統資源)
    return {
      cpu: Math.floor(Math.random() * 60) + 10, // 10-70%
      memory: Math.floor(Math.random() * 50) + 20, // 20-70%
      networkLatency: Math.floor(Math.random() * 100) + 20, // 20-120ms
    };
  }

  private calculateEntropy(resources: {
    cpu: number;
    memory: number;
    networkLatency: number;
  }): number {
    // 簡單的熵計算模型：資源使用率越高，延遲越高，熵越高
    const cpuFactor = resources.cpu / 100;
    const memFactor = resources.memory / 100;
    const netFactor = Math.min(resources.networkLatency / 500, 1);

    // 引入隨機波動模擬環境不確定性
    const chaos = Math.random() * 0.1;

    return cpuFactor * 0.4 + memFactor * 0.3 + netFactor * 0.3 + chaos;
  }

  private determineStatus(
    entropy: number,
    resources: {
      cpu: number;
      memory: number;
      networkLatency: number;
    }
  ): SystemStatus {
    if (entropy > 0.8 || resources.cpu > 90 || resources.memory > 90) return 'critical';
    if (entropy > 0.5 || resources.cpu > 70 || resources.memory > 70) return 'degraded';
    return 'healthy';
  }

  private countActiveAgents(): number {
    // 模擬：應該連接 AgentRegistry
    return Math.floor(Math.random() * 5) + 3;
  }

  private detectIssues(
    resources: {
      cpu: number;
      memory: number;
      networkLatency: number;
    },
    entropy: number
  ): string[] {
    const issues: string[] = [];
    if (resources.cpu > 80) issues.push('High CPU Usage');
    if (resources.memory > 80) issues.push('High Memory Usage');
    if (resources.networkLatency > 300) issues.push('Network Latency High');
    if (entropy > 0.7) issues.push('System Entropy Critical');
    return issues;
  }

  private recordHealth(health: SystemHealth) {
    this.healthHistory.push(health);
    if (this.healthHistory.length > this.MAX_HISTORY) {
      this.healthHistory.shift();
    }
  }
}
