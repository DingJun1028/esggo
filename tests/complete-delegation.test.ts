/**
 * ==========================================
 * 完全代主自行 - 測試文件
 * ==========================================
 * 
 * 測試完全代主自行功能
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { randomUUID } from 'crypto';
import { join, unlinkSync } from 'path';
import { tmpdir } from 'os';
import {
  CompleteDelegationManager,
  AutonomousDecisionEngine,
  CompleteDelegationAgent,
  createCompleteDelegationAgent,
  executeCompleteDelegationTask,
  getDelegationManager,
  getDecisionEngine,
  resetDelegationManager,
  resetDecisionEngine,
} from '../src/agents/complete-delegation';
import * as delegationEvents from '../src/agents/complete-delegation/events';
import {
  createDelegationJournal,
  setDefaultJournal,
} from '../src/agents/complete-delegation/journal';
import { DelegationEventNames, DelegationTopics } from '../src/types/complete-delegation';

describe('完全代主自行 (Complete Autonomous Delegation)', () => {
  let manager: CompleteDelegationManager;
  let engine: AutonomousDecisionEngine;

  beforeEach(() => {
    resetDelegationManager();
    resetDecisionEngine();
    manager = getDelegationManager();
    engine = getDecisionEngine();
  });

  describe('CompleteDelegationManager', () => {
    it('should create complete delegation', async () => {
      const scope = await manager.createCompleteDelegation({
        principalId: 'user-123',
        agentId: 'agent-001',
        permissions: ['full'],
      });

      expect(scope.delegationId).toBeDefined();
      expect(scope.principalId).toBe('user-123');
      expect(scope.agentId).toBe('agent-001');
      expect(scope.permissions).toContain('full');
      expect(scope.signature).toBeDefined();
    });

    it('should validate delegation', async () => {
      const scope = await manager.createCompleteDelegation({
        principalId: 'user-123',
        agentId: 'agent-001',
        permissions: ['read', 'write'],
      });

      const isValidRead = await manager.validateDelegation(
        scope.delegationId,
        'read'
      );
      const isValidExecute = await manager.validateDelegation(
        scope.delegationId,
        'execute'
      );

      expect(isValidRead).toBe(true);
      expect(isValidExecute).toBe(false);
    });

    it('should terminate delegation', async () => {
      const scope = await manager.createCompleteDelegation({
        principalId: 'user-123',
        agentId: 'agent-001',
        permissions: ['full'],
      });

      await manager.terminateDelegation(scope.delegationId, 'Test termination');

      const retrieved = await manager.getDelegation(scope.delegationId);
      expect(retrieved).toBeNull();
    });

    it('should get active delegations', async () => {
      await manager.createCompleteDelegation({
        principalId: 'user-123',
        agentId: 'agent-001',
        permissions: ['full'],
      });

      await manager.createCompleteDelegation({
        principalId: 'user-456',
        agentId: 'agent-002',
        permissions: ['read'],
      });

      const allDelegations = await manager.getActiveDelegations();
      const userDelegations = await manager.getActiveDelegations('user-123');

      expect(allDelegations.length).toBe(2);
      expect(userDelegations.length).toBe(1);
    });
  });

  describe('AutonomousDecisionEngine', () => {
    it('should assess autonomy capability', async () => {
      const canExecute = await engine.canAutonomouslyExecute(
        'generate simple report'
      );

      expect(typeof canExecute).toBe('boolean');
    });

    it('should make autonomous decision', async () => {
      const decision = await engine.makeDecision({
        intent: 'generate-report',
        options: [
          { id: 'option-1', description: 'Option 1', score: 0.6 },
          { id: 'option-2', description: 'Option 2', score: 0.8 },
          { id: 'option-3', description: 'Option 3', score: 0.7 },
        ],
        constraints: [],
      });

      expect(decision.decisionId).toBeDefined();
      expect(decision.selectedOption.id).toBe('option-2');
      expect(decision.confidence).toBeGreaterThan(0);
      expect(decision.rationale).toBeDefined();
    });

    it('should record decision', async () => {
      // 使用唯一的意圖避免歷史衝突
      const uniqueIntent = `test-intent-${Date.now()}`;
      
      const decision = await engine.makeDecision({
        intent: uniqueIntent,
        options: [{ id: 'option-1', description: 'Test Option' }],
        constraints: [],
      });

      await engine.recordDecision(decision);

      const history = engine.getDecisionHistory('autonomous-engine');
      // 找到剛記錄的決策
      const recordedDecision = history.find(d => d.decisionId === decision.decisionId);
      expect(recordedDecision).toBeDefined();
      expect(recordedDecision?.decisionId).toBe(decision.decisionId);
    });

    it('should report to principal', async () => {
      const decision = await engine.makeDecision({
        intent: 'test-intent',
        options: [{ id: 'option-1', description: 'Test Option' }],
        constraints: [],
      });

      await engine.reportToPrincipal(decision);

      expect(decision.reportedToPrincipal).toBe(true);
    });
  });

  describe('CompleteDelegationAgent', () => {
    it('should create agent with delegation scope', async () => {
      const scope = await manager.createCompleteDelegation({
        principalId: 'user-123',
        agentId: 'agent-001',
        permissions: ['full'],
      });

      const agent = new CompleteDelegationAgent('user-123', scope);

      expect(agent.principal).toBe('user-123');
      expect(agent.delegationScope.delegationId).toBe(scope.delegationId);
      expect(agent.signature.uuid).toBe('agent-001');
    });

    it('should execute on behalf of principal', async () => {
      const agent = await createCompleteDelegationAgent({
        principalId: 'user-123',
        permissions: ['full'],
      });

      const result = await agent.executeOnBehalfOfPrincipal(
        'test-task',
        { data: 'test-data' }
      );

      expect(result.success).toBe(true);
      expect(result.executionId).toBeDefined();
      expect(result.result).toBeDefined();
    });

    it('should get constraints', async () => {
      const scope = await manager.createCompleteDelegation({
        principalId: 'user-123',
        agentId: 'agent-001',
        permissions: ['full'],
        restrictions: [
          {
            type: 'scope',
            description: 'Test restriction',
            value: 'test-value',
          },
        ],
      });

      const agent = new CompleteDelegationAgent('user-123', scope);

      const constraints = agent.getConstraints();
      expect(constraints.length).toBe(1);
      expect(constraints[0].type).toBe('scope');
    });

    it('should get execution history', async () => {
      const agent = await createCompleteDelegationAgent({
        principalId: 'user-123',
        permissions: ['full'],
      });

      await agent.executeOnBehalfOfPrincipal('test-task-1');
      await agent.executeOnBehalfOfPrincipal('test-task-2');

      const history = agent.getExecutionHistory();
      expect(history.length).toBe(2);
    });
  });

  describe('Factory Functions', () => {
    it('should create agent via factory function', async () => {
      const agent = await createCompleteDelegationAgent({
        principalId: 'user-123',
        permissions: ['full'],
      });

      expect(agent).toBeInstanceOf(CompleteDelegationAgent);
      expect(agent.principal).toBe('user-123');
    });

    it('should execute task via factory function', async () => {
      const agent = await createCompleteDelegationAgent({
        principalId: 'user-123',
        permissions: ['full'],
      });

      const result = await executeCompleteDelegationTask(
        agent,
        'test-task',
        { data: 'test-data' }
      );

      expect(result.success).toBe(true);
    });
  });

  describe('Integration', () => {
    it('should execute complete delegation flow', async () => {
      // 1. 創建代理
      const agent = await createCompleteDelegationAgent({
        principalId: 'user-123',
        permissions: ['full'],
        description: 'Integration test agent',
      });

      // 2. 執行任務
      const result = await executeCompleteDelegationTask(
        agent,
        'generate-esg-report',
        { data: 'test-esg-data' }
      );

      // 3. 驗證結果
      expect(result.success).toBe(true);
      expect(result.executionId).toBeDefined();
      expect(result.result).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);

      // 4. 檢查執行歷史
      const history = agent.getExecutionHistory();
      expect(history.length).toBe(1);
    });
  });
});

// ==========================================
// 事件總線貫通（深貫廣通）— 經 omni-gateway 轉發至 omni-agent-bus
// ==========================================

describe('完全代主自行 事件總線貫通', () => {
  it('manager publishes DELEGATION_CREATED on create', async () => {
    const spy = vi.spyOn(delegationEvents, 'publishDelegationEvent');
    const agent = await createCompleteDelegationAgent({
      principalId: 'bus-user-001',
      permissions: ['full'],
    });
    const delegationId = agent.delegationScope.delegationId;

    expect(spy).toHaveBeenCalledWith(
      DelegationEventNames.DELEGATION_CREATED,
      DelegationTopics.AUTHORIZATION,
      expect.objectContaining({ delegationId }),
      'CompleteDelegationManager'
    );
    spy.mockRestore();
  });

  it('engine publishes DECISION_MADE on execute', async () => {
    const spy = vi.spyOn(delegationEvents, 'publishDelegationEvent');
    const agent = await createCompleteDelegationAgent({
      principalId: 'bus-user-002',
      permissions: ['full'],
    });
    const result = await executeCompleteDelegationTask(agent, 'bus-task', {});
    const decisionId = (result.metadata as { decisionId?: string })?.decisionId;

    expect(spy).toHaveBeenCalledWith(
      DelegationEventNames.DELEGATION_DECISION_MADE,
      DelegationTopics.DECISION,
      expect.objectContaining({ decisionId }),
      'AutonomousDecisionEngine'
    );
    spy.mockRestore();
  });

  it('agent publishes DECISION_REPORTED on report', async () => {
    const spy = vi.spyOn(delegationEvents, 'publishDelegationEvent');
    const manager = getDelegationManager();
    const scope = await manager.createCompleteDelegation({
      principalId: 'bus-user-003',
      agentId: 'agent-bus-003',
      permissions: ['full'],
    });
    const agent = new CompleteDelegationAgent('bus-user-003', scope);
    await agent.reportToPrincipal({
      executionId: 'exec-bus-003',
      intent: 'report',
      decision: null,
      result: { ok: true },
      status: 'completed',
      timestamp: Date.now(),
    });

    expect(spy).toHaveBeenCalledWith(
      DelegationEventNames.DELEGATION_DECISION_REPORTED,
      DelegationTopics.REPORTING,
      expect.objectContaining({ executionId: 'exec-bus-003' }),
      'CompleteDelegationAgent'
    );
    spy.mockRestore();
  });
});

// ==========================================
// 全量審計軌跡（對齊「全量」不變量）
// ==========================================

describe('全量審計軌跡', () => {
  it('getFullAuditTrail returns the delegation audit entries (persisted, not truncated)', async () => {
    const manager = getDelegationManager();
    const agent = await createCompleteDelegationAgent({
      principalId: 'full-user-001',
      permissions: ['full'],
    });
    const delegationId = agent.delegationScope.delegationId;

    const trail = await manager.getFullAuditTrail(delegationId);
    expect(trail.length).toBeGreaterThanOrEqual(1);
    expect(
      trail.some((e) => (e as { type?: string }).type === 'DELEGATION_CREATED')
    ).toBe(true);
  });
});

describe('全量事件軌跡', () => {
  it('publishDelegationEvent persists full event trail (not truncated)', async () => {
    const tmpPath = join(tmpdir(), `esggo-events-${randomUUID()}.jsonl`);
    setDefaultJournal(createDelegationJournal(tmpPath));
    try {
      const manager = getDelegationManager();
      const delegationId = 'evt-del-001';
      const res = await delegationEvents.publishDelegationEvent(
        DelegationEventNames.DELEGATION_CREATED,
        DelegationTopics.AUTHORIZATION,
        { delegationId, note: 'persist-me' },
        'test'
      );
      expect(res.status).toBe('ok');
      expect(res.hashLock).toMatch(/^[0-9a-f]{64}$/);

      const trail = await manager.getFullEventTrail(delegationId);
      expect(trail.length).toBe(1);
      expect(trail[0].delegationId).toBe(delegationId);
      expect(trail[0].type).toBe(DelegationEventNames.DELEGATION_CREATED);
      expect(trail[0].hashLock).toBe(res.hashLock);
    } finally {
      setDefaultJournal(null);
      try {
        unlinkSync(tmpPath);
      } catch {
        /* ignore */
      }
    }
  });

  it('getFullEventTrail supports sinceId resume (Last-Event-ID)', async () => {
    const tmpPath = join(tmpdir(), `esggo-events-resume-${randomUUID()}.jsonl`);
    setDefaultJournal(createDelegationJournal(tmpPath));
    try {
      const manager = getDelegationManager();
      const delegationId = 'evt-del-002';
      await delegationEvents.publishDelegationEvent(
        DelegationEventNames.DELEGATION_CREATED,
        DelegationTopics.AUTHORIZATION,
        { delegationId, note: 'first' },
        'test'
      );
      await delegationEvents.publishDelegationEvent(
        'delegation.decision.made',
        'delegation.decision',
        { delegationId, note: 'second' },
        'test'
      );

      const all = await manager.getFullEventTrail(delegationId);
      expect(all.length).toBe(2);
      const firstId = all[0].id;

      // 僅回放 firstId 之後的事件（斷點續傳）
      const resumed = await manager.getFullEventTrail(delegationId, firstId);
      expect(resumed.length).toBe(1);
      expect(resumed[0].type).toBe('delegation.decision.made');
    } finally {
      setDefaultJournal(null);
      try {
        unlinkSync(tmpPath);
      } catch {
        /* ignore */
      }
    }
  });
});
