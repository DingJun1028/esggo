// lib/omni-hub/registry.ts
// 萬能中心 — 設施註冊表

import type { AgentRegistration, AgentStatus, AgentRole } from './types';

export class FacilityRegistry {
  private facilities: Map<string, AgentRegistration> = new Map();
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;
    // 載入預設設施
    this.loadDefaultFacilities();
    this.initialized = true;
  }

  private loadDefaultFacilities(): void {
    const defaults: AgentRegistration[] = [
      {
        id: 'omni-agent',
        name: 'OmniAgent',
        displayName: '萬能代理',
        role: 'orchestrator',
        description: '總指揮代理，負責協調所有子代理與任務分派',
        status: 'idle',
        capabilities: [
          {
            name: 'task_delegation',
            description: '任務委派',
            inputTypes: ['task'],
            outputTypes: ['result'],
            version: '1.0',
          },
          {
            name: 'agent_coordination',
            description: '代理協調',
            inputTypes: ['agents'],
            outputTypes: ['plan'],
            version: '1.0',
          },
        ],
        memoryAccess: ['read', 'write', 'admin'],
        maxConcurrentTasks: 10,
        currentTaskCount: 0,
        healthScore: 98,
        fiveTStatus: [true, true, true, true, true],
        registeredAt: new Date().toISOString(),
        lastHeartbeat: new Date().toISOString(),
        metadata: { version: '2.0.0', author: 'ESGGO' },
      },
      {
        id: 'omni-key',
        name: 'OmniKey',
        displayName: '萬能元鑰',
        role: 'guardian',
        description: '身份驗證與授權管理，一切未知的解答',
        status: 'idle',
        capabilities: [
          {
            name: 'authentication',
            description: '身份驗證',
            inputTypes: ['credentials'],
            outputTypes: ['token'],
            version: '1.0',
          },
          {
            name: 'authorization',
            description: '授權管理',
            inputTypes: ['token', 'resource'],
            outputTypes: ['decision'],
            version: '1.0',
          },
        ],
        memoryAccess: ['read', 'write'],
        maxConcurrentTasks: 5,
        currentTaskCount: 0,
        healthScore: 95,
        fiveTStatus: [true, true, true, true, false],
        registeredAt: new Date().toISOString(),
        lastHeartbeat: new Date().toISOString(),
        metadata: { version: '2.0.0' },
      },
      {
        id: 'omni-logger',
        name: 'OmniLogger',
        displayName: '萬能日誌',
        role: 'auditor',
        description: '統一日誌系統，記錄所有代理操作與系統事件',
        status: 'idle',
        capabilities: [
          {
            name: 'log_collection',
            description: '日誌收集',
            inputTypes: ['event'],
            outputTypes: ['log'],
            version: '1.0',
          },
          {
            name: 'audit_trail',
            description: '稽核軌跡',
            inputTypes: ['query'],
            outputTypes: ['report'],
            version: '1.0',
          },
        ],
        memoryAccess: ['read', 'write'],
        maxConcurrentTasks: 20,
        currentTaskCount: 0,
        healthScore: 100,
        fiveTStatus: [true, true, true, true, true],
        registeredAt: new Date().toISOString(),
        lastHeartbeat: new Date().toISOString(),
        metadata: { version: '1.0.0' },
      },
      {
        id: 'omni-memory',
        name: 'OmniMemory',
        displayName: '萬能記憶',
        role: 'researcher',
        description: '共享記憶管理，代理間的知識庫與上下文儲存',
        status: 'idle',
        capabilities: [
          {
            name: 'memory_store',
            description: '記憶儲存',
            inputTypes: ['data'],
            outputTypes: ['reference'],
            version: '1.0',
          },
          {
            name: 'memory_search',
            description: '記憶搜尋',
            inputTypes: ['query'],
            outputTypes: ['results'],
            version: '1.0',
          },
        ],
        memoryAccess: ['read', 'write', 'admin'],
        maxConcurrentTasks: 15,
        currentTaskCount: 0,
        healthScore: 92,
        fiveTStatus: [true, true, true, false, false],
        registeredAt: new Date().toISOString(),
        lastHeartbeat: new Date().toISOString(),
        metadata: { version: '1.0.0' },
      },
      {
        id: 'sustain-writer',
        name: 'SustainWriter',
        displayName: '永續撰寫者',
        role: 'writer',
        description: 'ESG 永續報告撰寫與內容生成',
        status: 'idle',
        capabilities: [
          {
            name: 'report_drafting',
            description: '報告起草',
            inputTypes: ['data', 'template'],
            outputTypes: ['draft'],
            version: '1.0',
          },
          {
            name: 'content_generation',
            description: '內容生成',
            inputTypes: ['prompt'],
            outputTypes: ['content'],
            version: '1.0',
          },
        ],
        memoryAccess: ['read', 'write'],
        maxConcurrentTasks: 5,
        currentTaskCount: 0,
        healthScore: 88,
        fiveTStatus: [true, true, false, true, false],
        registeredAt: new Date().toISOString(),
        lastHeartbeat: new Date().toISOString(),
        metadata: { version: '1.0.0' },
      },
      {
        id: 'esg-analyst',
        name: 'ESGAnalyst',
        displayName: 'ESG 分析師',
        role: 'analyst',
        description: 'ESG 數據分析、合規檢查與風險評估',
        status: 'idle',
        capabilities: [
          {
            name: 'data_analysis',
            description: '數據分析',
            inputTypes: ['dataset'],
            outputTypes: ['insights'],
            version: '1.0',
          },
          {
            name: 'compliance_check',
            description: '合規檢查',
            inputTypes: ['report', 'standard'],
            outputTypes: ['gaps'],
            version: '1.0',
          },
        ],
        memoryAccess: ['read', 'write'],
        maxConcurrentTasks: 8,
        currentTaskCount: 0,
        healthScore: 90,
        fiveTStatus: [true, true, true, true, false],
        registeredAt: new Date().toISOString(),
        lastHeartbeat: new Date().toISOString(),
        metadata: { version: '1.0.0' },
      },
      {
        id: 'carbon-calculator',
        name: 'CarbonCalculator',
        displayName: '碳排計算者',
        role: 'calculator',
        description: 'ISO 14064-1 碳排放計算與 5T 溯源證據生成',
        status: 'idle',
        capabilities: [
          {
            name: 'emission_calc',
            description: '排放計算',
            inputTypes: ['activity_data', 'factors'],
            outputTypes: ['emissions'],
            version: '1.0',
          },
          {
            name: 'evidence_gen',
            description: '證據生成',
            inputTypes: ['calculation'],
            outputTypes: ['evidence'],
            version: '1.0',
          },
        ],
        memoryAccess: ['read', 'write'],
        maxConcurrentTasks: 3,
        currentTaskCount: 0,
        healthScore: 85,
        fiveTStatus: [true, true, false, false, false],
        registeredAt: new Date().toISOString(),
        lastHeartbeat: new Date().toISOString(),
        metadata: { version: '1.0.0' },
      },
    ];

    for (const facility of defaults) {
      this.facilities.set(facility.id, facility);
    }
  }

  async register(facility: AgentRegistration): Promise<void> {
    await this.init();
    this.facilities.set(facility.id, {
      ...facility,
      registeredAt: facility.registeredAt || new Date().toISOString(),
      lastHeartbeat: new Date().toISOString(),
    });
  }

  async deregister(id: string): Promise<void> {
    this.facilities.delete(id);
  }

  get(id: string): AgentRegistration | undefined {
    return this.facilities.get(id);
  }

  getAll(): AgentRegistration[] {
    return Array.from(this.facilities.values()).sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    );
  }

  getByRole(role: AgentRole): AgentRegistration[] {
    return this.getAll().filter((f) => f.role === role);
  }

  getByStatus(status: AgentStatus): AgentRegistration[] {
    return this.getAll().filter((f) => f.status === status);
  }

  async updateStatus(id: string, status: AgentStatus): Promise<void> {
    const facility = this.facilities.get(id);
    if (facility) {
      facility.status = status;
      facility.lastHeartbeat = new Date().toISOString();
    }
  }

  async updateHeartbeat(id: string): Promise<void> {
    const facility = this.facilities.get(id);
    if (facility) {
      facility.lastHeartbeat = new Date().toISOString();
    }
  }

  async updateHealthScore(id: string, score: number): Promise<void> {
    const facility = this.facilities.get(id);
    if (facility) {
      facility.healthScore = Math.max(0, Math.min(100, score));
    }
  }

  getStats(): { total: number; byStatus: Record<string, number>; byRole: Record<string, number> } {
    const byStatus: Record<string, number> = {};
    const byRole: Record<string, number> = {};
    this.facilities.forEach((f) => {
      byStatus[f.status] = (byStatus[f.status] || 0) + 1;
      byRole[f.role] = (byRole[f.role] || 0) + 1;
    });
    return { total: this.facilities.size, byStatus, byRole };
  }
}
