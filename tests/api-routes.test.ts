/**
 * ==========================================
 * ESG GO 平台 - API 路由測試
 * ==========================================
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createCompleteDelegationAgent,
  executeCompleteDelegationTask,
  getDelegationManager,
} from '../src/agents/complete-delegation';
import { POST as executeDelegationPOST } from '../src/app/api/delegation/[id]/execute/route';
import { GET as auditTrailGET } from '../src/app/api/delegation/audit/route';
import { GET as eventStreamGET } from '../src/app/api/delegation/events/stream/route';
import { enhancedOmniBus } from '../src/lib/omni-agent-bus';
import type { NextRequest } from 'next/server';

// ==========================================
// 創建授權 API 測試
// ==========================================

describe('POST /api/delegation', () => {
  it('should create delegation with valid data', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'api-user-001',
      permissions: ['read', 'write', 'execute'],
      description: 'API 測試授權',
    });

    expect(agent).toBeDefined();
    expect(agent.signature.uuid).toBeDefined();
    expect(agent.principal).toBe('api-user-001');
    expect(agent.delegationScope.permissions).toContain('read');
    expect(agent.delegationScope.permissions).toContain('write');
    expect(agent.delegationScope.permissions).toContain('execute');
  });

  it('should create delegation with full permissions', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'api-user-002',
      permissions: ['full'],
    });

    expect(agent.delegationScope.permissions).toContain('full');
  });

  it('should create delegation with custom description', async () => {
    const description = '自訂描述測試';
    const agent = await createCompleteDelegationAgent({
      principalId: 'api-user-003',
      permissions: ['read'],
      description,
    });

    expect(agent.delegationScope.description).toBe(description);
  });

  it('should create delegation with expiration', async () => {
    const validUntil = Date.now() + 86400000; // 1 天後
    const agent = await createCompleteDelegationAgent({
      principalId: 'api-user-004',
      permissions: ['read'],
      validUntil,
    });

    expect(agent.delegationScope.validUntil).toBe(validUntil);
  });
});

// ==========================================
// 獲取授權 API 測試
// ==========================================

describe('GET /api/delegation', () => {
  it('should list active delegations', async () => {
    await createCompleteDelegationAgent({
      principalId: 'list-user-001',
      permissions: ['read'],
    });

    const manager = getDelegationManager();
    const delegations = await manager.getActiveDelegations();

    expect(delegations.length).toBeGreaterThan(0);
  });

  it('should filter delegations by principal', async () => {
    await createCompleteDelegationAgent({
      principalId: 'filter-user-001',
      permissions: ['read'],
    });

    const manager = getDelegationManager();
    const delegations = await manager.getActiveDelegations('filter-user-001');

    expect(delegations.every((d) => d.principalId === 'filter-user-001')).toBe(true);
  });
});

// ==========================================
// 獲取特定授權 API 測試
// ==========================================

describe('GET /api/delegation/[id]', () => {
  it('should get delegation by id', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'get-user-001',
      permissions: ['read'],
    });

    const manager = getDelegationManager();
    const delegation = await manager.getDelegation(agent.delegationScope.delegationId);

    expect(delegation).toBeDefined();
    expect(delegation?.delegationId).toBe(agent.delegationScope.delegationId);
    expect(delegation?.principalId).toBe('get-user-001');
  });

  it('should return undefined for non-existent delegation', async () => {
    const manager = getDelegationManager();
    const delegation = await manager.getDelegation('nonexistent-id');

    expect(delegation).toBeNull();
  });
});

// ==========================================
// 終止授權 API 測試
// ==========================================

describe('DELETE /api/delegation/[id]', () => {
  it('should terminate delegation', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'terminate-user-001',
      permissions: ['read'],
    });

    const manager = getDelegationManager();
    await manager.terminateDelegation(agent.delegationScope.delegationId, '測試終止');

    const delegation = await manager.getDelegation(agent.delegationScope.delegationId);
    expect(delegation).toBeNull();
  });

  it('should handle termination with reason', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'terminate-user-002',
      permissions: ['read'],
    });

    const manager = getDelegationManager();
    const reason = '任務完成，終止授權';
    await manager.terminateDelegation(agent.delegationScope.delegationId, reason);

    // 驗證授權已終止
    const delegation = await manager.getDelegation(agent.delegationScope.delegationId);
    expect(delegation).toBeNull();
  });
});

// ==========================================
// 執行任務 API 測試
// ==========================================

describe('POST /api/delegation/[id]/execute', () => {
  it('should execute task with delegation', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'execute-user-001',
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
  });

  it('should execute task without context', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'execute-user-002',
      permissions: ['execute'],
    });

    const result = await executeCompleteDelegationTask(
      agent,
      'simple-task',
      {}
    );

    expect(result.success).toBe(true);
  });

  it('should record execution history', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'execute-user-003',
      permissions: ['full'],
    });

    await executeCompleteDelegationTask(agent, 'task-1', {});
    await executeCompleteDelegationTask(agent, 'task-2', {});

    const history = agent.getExecutionHistory();
    expect(history.length).toBeGreaterThanOrEqual(2);
  });
});

// ==========================================
// 執行任務 API - 經由實際 gateway 端對端
// ==========================================

describe('POST /api/delegation/[id]/execute (gateway e2e)', () => {
  it('routes execution through omni-gateway.secureForward and returns hashLock', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'gw-user-001',
      permissions: ['full'],
    });
    const delegationId = agent.delegationScope.delegationId;

    const req = {
      json: async () => ({ intent: 'gateway-e2e-task', context: { x: 1 } }),
    } as unknown as NextRequest;

    const res = await executeDelegationPOST(req, {
      params: { id: delegationId },
    } as { params: { id: string } });

    const body = await res.json();

    expect(body.success).toBe(true);
    expect(body.executionId).toBeDefined();
    // 經由 omni-gateway 實際轉發，應回傳 64 字元 SHA-256 hashLock
    expect(body.gateway).toBeDefined();
    expect(body.gateway.startHashLock).toMatch(/^[0-9a-f]{64}$/);
    expect(body.gateway.completeHashLock).toMatch(/^[0-9a-f]{64}$/);
  });
});

// ==========================================
// 審計軌跡 API（monitor 權限把關）
// ==========================================

describe('GET /api/delegation/audit', () => {
  it('returns audit trail for delegation with monitor permission', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'audit-user-001',
      permissions: ['monitor', 'full'],
    });
    const delegationId = agent.delegationScope.delegationId;

    const req = {
      url: `http://localhost/api/delegation/audit?delegationId=${delegationId}`,
    } as unknown as NextRequest;

    const res = await auditTrailGET(req);
    const body = await res.json();

    expect(body.success).toBe(true);
    expect(body.delegationId).toBe(delegationId);
    expect(body.count).toBeGreaterThanOrEqual(1);
    expect(
      body.entries.some((e: { type: string }) => e.type === 'DELEGATION_CREATED')
    ).toBe(true);
  });

  it('rejects audit trail without monitor permission (403)', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'audit-user-002',
      permissions: ['read'],
    });
    const delegationId = agent.delegationScope.delegationId;

    const req = {
      url: `http://localhost/api/delegation/audit?delegationId=${delegationId}`,
    } as unknown as NextRequest;

    const res = await auditTrailGET(req);
    expect(res.status).toBe(403);
  });
});

// ==========================================
// 事件總線訂閱 API（SSE, monitor 權限把關）
// ==========================================

describe('GET /api/delegation/events/stream', () => {
  it('rejects without delegationId (400)', async () => {
    const req = {
      url: 'http://localhost/api/delegation/events/stream',
    } as unknown as NextRequest;

    const res = await eventStreamGET(req);
    expect(res.status).toBe(400);
  });

  it('rejects unknown delegation (404)', async () => {
    const req = {
      url: 'http://localhost/api/delegation/events/stream?delegationId=does-not-exist',
    } as unknown as NextRequest;

    const res = await eventStreamGET(req);
    expect(res.status).toBe(404);
  });

  it('rejects without monitor permission (403)', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'stream-user-002',
      permissions: ['read'],
    });
    const delegationId = agent.delegationScope.delegationId;

    const req = {
      url: `http://localhost/api/delegation/events/stream?delegationId=${delegationId}`,
    } as unknown as NextRequest;

    const res = await eventStreamGET(req);
    expect(res.status).toBe(403);
  });

  it('streams delegation events with monitor permission', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'stream-user-001',
      permissions: ['monitor', 'full'],
    });
    const delegationId = agent.delegationScope.delegationId;

    const ac = new AbortController();
    const req = {
      url: `http://localhost/api/delegation/events/stream?delegationId=${delegationId}`,
      signal: ac.signal,
    } as unknown as NextRequest;

    const res = await eventStreamGET(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/event-stream');

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    // 首幀應為 CONNECTED
    const first = await reader.read();
    const firstText = decoder.decode(first.value);
    expect(firstText).toContain('CONNECTED');
    expect(firstText).toContain(delegationId);

    // 經同一 bus 實例發布一筆委派事件
    enhancedOmniBus.publish('external-forward', {
      event: 'delegation.created',
      payload: { type: 'delegation.created', delegationId },
      ts: Date.now(),
      hashLock: 'a'.repeat(64),
    } as never);

    const second = await reader.read();
    const secondText = decoder.decode(second.value);
    expect(secondText).toContain('delegation.created');
    expect(secondText).toContain(delegationId);
    expect(secondText).toContain('a'.repeat(64));

    ac.abort();
    await reader.cancel().catch(() => {});
  });
});

// ==========================================
// 驗證授權 API 測試
// ==========================================

describe('驗證授權', () => {
  it('should validate existing permission', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'validate-user-001',
      permissions: ['read', 'write'],
    });

    const manager = getDelegationManager();

    const readValid = await manager.validateDelegation(
      agent.delegationScope.delegationId,
      'read'
    );
    expect(readValid).toBe(true);

    const writeValid = await manager.validateDelegation(
      agent.delegationScope.delegationId,
      'write'
    );
    expect(writeValid).toBe(true);
  });

  it('should reject non-existing permission', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'validate-user-002',
      permissions: ['read'],
    });

    const manager = getDelegationManager();

    const executeValid = await manager.validateDelegation(
      agent.delegationScope.delegationId,
      'execute'
    );
    expect(executeValid).toBe(false);
  });

  it('should reject expired delegation', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'validate-user-003',
      permissions: ['read'],
      validUntil: Date.now() + 1000, // 1 秒後過期
    });

    const manager = getDelegationManager();

    // 等待過期
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const valid = await manager.validateDelegation(
      agent.delegationScope.delegationId,
      'read'
    );
    expect(valid).toBe(false);
  });
});

// ==========================================
// 錯誤處理測試
// ==========================================

describe('錯誤處理', () => {
  it('should handle invalid delegation id', async () => {
    const manager = getDelegationManager();
    const delegation = await manager.getDelegation('invalid-id');

    expect(delegation).toBeNull();
  });

  it('should handle empty permissions', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'error-user-001',
      permissions: [],
    });

    expect(agent.delegationScope.permissions).toEqual([]);
  });

  it('should handle null description', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'error-user-002',
      permissions: ['read'],
      description: undefined,
    });

    expect(agent.delegationScope.description).toBeUndefined();
  });
});
