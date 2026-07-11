/**
 * ==========================================
 * ESG GO 平台 - 整合測試
 * ==========================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createCompleteDelegationAgent,
  executeCompleteDelegationTask,
  getDelegationManager,
} from '../src/agents/complete-delegation';
import {
  ESGAnalysisEngine,
  ESGVisualizationEngine,
} from '../src/lib/esg-analysis';
import {
  LRUCache,
  BatchProcessor,
  ConnectionPool,
  PerformanceMonitor,
} from '../src/agents/complete-delegation/performance-optimizer';

// ==========================================
// 完全自主代行整合測試
// ==========================================

describe('完全自主代行 - 整合測試', () => {
  let manager: ReturnType<typeof getDelegationManager>;

  beforeEach(() => {
    manager = getDelegationManager();
  });

  it('should create and manage delegation lifecycle', async () => {
    // 創建授權
    const agent = await createCompleteDelegationAgent({
      principalId: 'integration-user-001',
      permissions: ['read', 'write', 'execute'],
      description: '整合測試授權',
    });

    expect(agent).toBeDefined();
    expect(agent.signature.uuid).toBeDefined();
    expect(agent.principal).toBe('integration-user-001');

    // 獲取授權
    const delegation = await manager.getDelegation(agent.delegationScope.delegationId);
    expect(delegation).toBeDefined();
    expect(delegation?.principalId).toBe('integration-user-001');

    // 驗證授權
    const isValid = await manager.validateDelegation(
      agent.delegationScope.delegationId,
      'read'
    );
    expect(isValid).toBe(true);

    // 終止授權
    await manager.terminateDelegation(agent.delegationScope.delegationId, '測試完成');
    const afterTerminate = await manager.getDelegation(agent.delegationScope.delegationId);
    expect(afterTerminate).toBeNull();
  });

  it('should execute task with delegation', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'integration-user-002',
      permissions: ['full'],
    });

    const result = await executeCompleteDelegationTask(
      agent,
      'test-task',
      { data: 'test' }
    );

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.executionId).toBeDefined();
    expect(result.duration).toBeGreaterThan(0);
  });

  it('should handle multiple delegations', async () => {
    const agent1 = await createCompleteDelegationAgent({
      principalId: 'user-001',
      permissions: ['read'],
    });

    const agent2 = await createCompleteDelegationAgent({
      principalId: 'user-002',
      permissions: ['write'],
    });

    const activeDelegations = await manager.getActiveDelegations();
    expect(activeDelegations.length).toBeGreaterThanOrEqual(2);
  });

  it('should filter delegations by principal', async () => {
    await createCompleteDelegationAgent({
      principalId: 'filter-user-001',
      permissions: ['read'],
    });

    await createCompleteDelegationAgent({
      principalId: 'filter-user-002',
      permissions: ['read'],
    });

    const filtered = await manager.getActiveDelegations('filter-user-001');
    expect(filtered.every((d) => d.principalId === 'filter-user-001')).toBe(true);
  });
});

// ==========================================
// ESG 分析引擎整合測試
// ==========================================

describe('ESG 分析引擎 - 整合測試', () => {
  let analysisEngine: ESGAnalysisEngine;
  let visualizationEngine: ESGVisualizationEngine;

  beforeEach(() => {
    analysisEngine = ESGAnalysisEngine.getInstance();
    visualizationEngine = ESGVisualizationEngine.getInstance();
  });

  const mockEnvironmental = {
    carbonEmissions: {
      scope1: 500,
      scope2: 300,
      scope3: 200,
      total: 1000,
      unit: 'tCO2e' as const,
      reductionTarget: 800,
      reductionProgress: 60,
    },
    energyConsumption: {
      renewable: 600,
      nonRenewable: 400,
      total: 1000,
      unit: 'MWh' as const,
      efficiency: 75,
      renewableRatio: 60,
    },
    wasteManagement: {
      recycled: 800,
      landfilled: 150,
      incinerated: 50,
      total: 1000,
      unit: 'tonnes' as const,
      recyclingRate: 80,
    },
    waterUsage: {
      freshwater: 5000,
      recycled: 2000,
      total: 7000,
      unit: 'm³' as const,
      efficiency: 85,
      waterStress: 'medium' as const,
    },
    biodiversityImpact: {
      score: 70,
      affectedArea: 50,
      mitigationMeasures: ['Reforestation'],
      netPositive: true,
    },
  };

  const mockSocial = {
    workforce: {
      totalEmployees: 1000,
      turnoverRate: 12,
      trainingHours: 24,
      satisfactionScore: 75,
      livingWage: true,
    },
    diversity: {
      genderDiversity: { female: 45, male: 52, nonBinary: 3 },
      ageDiversity: { under30: 30, between30and50: 50, over50: 20 },
      ethnicDiversity: 65,
      payEquityRatio: 0.95,
    },
    healthSafety: {
      incidentRate: 2.5,
      lostTimeInjuryRate: 1.2,
      nearMissReporting: 85,
      safetyTrainingHours: 16,
      fatalityCount: 0,
    },
    humanRights: {
      policyInPlace: true,
      dueDiligenceScore: 80,
      grievanceMechanism: true,
      supplierAuditRate: 75,
    },
    communityImpact: {
      investmentInCommunity: 500000,
      volunteerHours: 800,
      localEmploymentRate: 70,
      socialPrograms: 5,
    },
  };

  const mockGovernance = {
    boardComposition: {
      totalMembers: 11,
      independentDirectors: 75,
      femaleDirectors: 40,
      averageTenure: 4.5,
      diversityIndex: 70,
    },
    ethics: {
      codeOfEthics: true,
      antiCorruptionPolicy: true,
      whistleblowerMechanism: true,
      trainingCompletionRate: 95,
      violationsReported: 2,
    },
    transparency: {
      esgReporting: true,
      thirdPartyVerification: true,
      disclosureScore: 85,
      reportingStandards: ['GRI', 'SASB', 'TCFD'],
    },
    riskManagement: {
      esgRiskAssessment: true,
      climateRiskAssessment: true,
      cyberSecurityScore: 80,
      businessContinuityPlan: true,
    },
  };

  it('should perform complete ESG analysis', async () => {
    const result = await analysisEngine.analyze(
      mockEnvironmental,
      mockSocial,
      mockGovernance,
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      }
    );

    expect(result).toBeDefined();
    expect(result.scores.overall).toBeGreaterThan(0);
    expect(result.scores.overall).toBeLessThanOrEqual(100);
    expect(result.insights.length).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.benchmarks.length).toBeGreaterThan(0);
  });

  it('should generate visualization from analysis', async () => {
    const result = await analysisEngine.analyze(
      mockEnvironmental,
      mockSocial,
      mockGovernance,
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      }
    );

    const dashboard = visualizationEngine.generateDashboard(result);
    expect(dashboard).toBeDefined();
    expect(dashboard.components.length).toBeGreaterThan(0);
  });

  it('should generate HTML report', async () => {
    const result = await analysisEngine.analyze(
      mockEnvironmental,
      mockSocial,
      mockGovernance,
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      }
    );

    const html = visualizationEngine.generateHTMLReport(result);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('ESG 分析報告');
  });

  it('should generate text report', async () => {
    const result = await analysisEngine.analyze(
      mockEnvironmental,
      mockSocial,
      mockGovernance,
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      }
    );

    const report = analysisEngine.generateReport(result);
    expect(report).toContain('ESG 分析報告');
    expect(report).toContain('整體分數');
  });

  it('should add and analyze data points', () => {
    const dataPoints = [
      {
        id: 'dp-1',
        timestamp: new Date(),
        category: 'environmental' as const,
        metric: 'carbonEmissions',
        value: 100,
        unit: 'tCO2e',
        source: 'manual',
      },
      {
        id: 'dp-2',
        timestamp: new Date(),
        category: 'social' as const,
        metric: 'employeeCount',
        value: 1000,
        unit: 'people',
        source: 'hr-system',
      },
    ];

    analysisEngine.addDataPoints(dataPoints);
    // 驗證沒有拋出錯誤
  });
});

// ==========================================
// 效能優化整合測試
// ==========================================

describe('效能優化 - 整合測試', () => {
  it('should work with LRU cache in real scenario', () => {
    const cache = new LRUCache<string>({
      maxSize: 100,
      ttl: 60000,
    });

    // 模擬快取使用場景
    for (let i = 0; i < 50; i++) {
      cache.set(`key-${i}`, `value-${i}`);
    }

    expect(cache.size).toBe(50);

    // 讀取快取
    for (let i = 0; i < 50; i++) {
      expect(cache.get(`key-${i}`)).toBe(`value-${i}`);
    }

    // 添加更多項目，觸發淘汰
    for (let i = 50; i < 150; i++) {
      cache.set(`key-${i}`, `value-${i}`);
    }

    expect(cache.size).toBe(100);
  });

  it('should batch process items efficiently', async () => {
    const processed: number[][] = [];
    const processor = new BatchProcessor<number, number>(
      async (items) => {
        processed.push(items);
        return items.map((item) => item * 2);
      },
      { batchSize: 5, batchDelay: 50 }
    );

    const results = await Promise.all([
      processor.add(1),
      processor.add(2),
      processor.add(3),
      processor.add(4),
      processor.add(5),
      processor.add(6),
      processor.add(7),
    ]);

    expect(results).toEqual([2, 4, 6, 8, 10, 12, 14]);
    expect(processed.length).toBe(2);
  });

  it('should manage connection pool effectively', async () => {
    const connections: string[] = [];
    const pool = new ConnectionPool<string>(
      () => `conn-${Date.now()}-${Math.random()}`,
      (conn) => {
        const idx = connections.indexOf(conn);
        if (idx > -1) connections.splice(idx, 1);
      },
      { minSize: 2, maxSize: 5 }
    );

    // 獲取連線
    const conn1 = await pool.acquire();
    const conn2 = await pool.acquire();
    expect(pool.getStatus().inUse).toBe(2);

    // 釋放連線
    pool.release(conn1);
    pool.release(conn2);
    expect(pool.getStatus().inUse).toBe(0);
    expect(pool.getStatus().available).toBe(2);

    // 關閉連線池
    pool.close();
    expect(pool.getStatus().total).toBe(0);
  });

  it('should monitor performance metrics', () => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.clear();

    // 記錄多個操作
    for (let i = 0; i < 10; i++) {
      monitor.record('test-op', 100 + i * 10);
    }

    const stats = monitor.getStats('test-op');
    expect(stats).toBeDefined();
    expect(stats!.count).toBe(10);
    expect(stats!.avgTime).toBe(145);
    expect(stats!.minTime).toBe(100);
    expect(stats!.maxTime).toBe(190);

    // 生成報告
    const report = monitor.generateReport();
    expect(report).toContain('效能監控報告');
    expect(report).toContain('test-op');
  });
});

// ==========================================
// API 路由整合測試
// ==========================================

describe('API 路由 - 整合測試', () => {
  it('should validate delegation permissions correctly', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'api-test-user',
      permissions: ['read', 'write'],
    });

    const manager = getDelegationManager();

    // 驗證已有權限
    const readValid = await manager.validateDelegation(
      agent.delegationScope.delegationId,
      'read'
    );
    expect(readValid).toBe(true);

    // 驗證沒有權限
    const executeValid = await manager.validateDelegation(
      agent.delegationScope.delegationId,
      'execute'
    );
    expect(executeValid).toBe(false);
  });

  it('should handle delegation expiration', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'expiry-test-user',
      permissions: ['read'],
      validUntil: Date.now() + 1000, // 1 秒後過期
    });

    const manager = getDelegationManager();

    // 立即驗證應該有效
    const valid = await manager.validateDelegation(
      agent.delegationScope.delegationId,
      'read'
    );
    expect(valid).toBe(true);

    // 等待過期
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const expired = await manager.validateDelegation(
      agent.delegationScope.delegationId,
      'read'
    );
    expect(expired).toBe(false);
  });
});

// ==========================================
// 錯誤處理測試
// ==========================================

describe('錯誤處理 - 整合測試', () => {
  it('should handle invalid delegation gracefully', async () => {
    const manager = getDelegationManager();
    const delegation = await manager.getDelegation('nonexistent-id');
    expect(delegation).toBeNull();
  });

  it('should handle batch processor errors', async () => {
    const processor = new BatchProcessor<number, number>(
      async () => {
        throw new Error('Test error');
      },
      { batchSize: 1 }
    );

    await expect(processor.add(1)).rejects.toThrow('Test error');
  });

  it('should handle cache TTL expiration', async () => {
    const cache = new LRUCache<string>({
      maxSize: 10,
      ttl: 100,
    });

    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');

    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(cache.get('key')).toBeUndefined();
  });
});

// ==========================================
// 效能基準測試
// ==========================================

describe('效能基準 - 整合測試', () => {
  it('should handle high-volume cache operations', () => {
    const cache = new LRUCache<number>({
      maxSize: 10000,
      ttl: 60000,
    });

    const start = Date.now();

    // 寫入 10000 個項目
    for (let i = 0; i < 10000; i++) {
      cache.set(`key-${i}`, i);
    }

    // 讀取 10000 個項目
    for (let i = 0; i < 10000; i++) {
      cache.get(`key-${i}`);
    }

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(1000); // 應該在 1 秒內完成
    expect(cache.size).toBe(10000);
  });

  it('should handle concurrent batch processing', async () => {
    const processor = new BatchProcessor<number, number>(
      async (items) => items.map((item) => item * 2),
      { batchSize: 10, batchDelay: 10 }
    );

    const start = Date.now();

    // 並發添加 100 個項目
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(processor.add(i));
    }

    const results = await Promise.all(promises);
    const duration = Date.now() - start;

    expect(results.length).toBe(100);
    expect(duration).toBeLessThan(2000); // 應該在 2 秒內完成
  });
});
