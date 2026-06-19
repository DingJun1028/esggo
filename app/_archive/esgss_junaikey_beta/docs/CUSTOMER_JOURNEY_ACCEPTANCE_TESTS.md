# ESGSS_JUNAIKEY 客戶旅程驗收測試文檔
## Customer Journey Acceptance Test Specification (CJATS) v2.0

---

## Table of Contents

1. [文檔概述](#文檔概述)
2. [核心原則](#核心原則)
3. [驗收測試框架](#驗收測試框架)
4. [服務功能驗收測試清單](#服務功能驗收測試清單)
5. [測試報告模板](#測試報告模板)
6. [執行測試](#執行測試)
7. [維護指南](#維護指南)

---

## 文檔概述

本文件定義了 ESGSS_JUNAIKEY 系統中所有服務功能的客戶旅程體驗標準及相應的驗收測試項目。

| 欄位 | 內容 |
|------|------|
| 版本 | 2.0 |
| 更新日期 | 2026-02-08 |
| 狀態 | 積極開發中 |

---

## 核心原則

每個服務功能必須滿足以下客戶旅程體驗標準：

| 原則 | 說明 |
|------|------|
| 即時反饋 | 用戶必須獲得即時的系統狀態反饋 |
| 視覺引導 | 清晰的視覺指示引導用戶完成旅程 |
| 漸進式載入 | 分階段顯示進度，避免用戶等待焦慮 |
| 優雅降級 | 失敗時提供清晰的恢復選項 |
| 可追溯性 | 每個操作都有唯一的旅程 ID，便於追蹤和除錯 |

---

## 驗收測試框架

### 測試覆蓋率要求

| 組件類型 | 單元測試覆蓋率 | 整合測試覆蓋率 | E2E 測試覆蓋率 |
|---------|--------------|--------------|--------------|
| 核心服務 | ≥ 90% | ≥ 80% | ≥ 60% |
| UI 組件 | ≥ 85% | ≥ 70% | ≥ 50% |
| API 端點 | ≥ 95% | ≥ 90% | ≥ 70% |
| 安全模組 | ≥ 100% | ≥ 100% | ≥ 80% |

---

## 服務功能驗收測試清單

### 1. AI 智能代理服務 (AgentCore)

#### 1.1 Writer Agent 驗收測試

```typescript
// tests/agents/writer-agent.acceptance.test.ts
describe('Writer Agent - Customer Journey Acceptance', () => {
    let writerAgent: WriterAgent;
    let journeyTracker: JourneyTracker;

    beforeEach(() => {
        writerAgent = new WriterAgent();
        journeyTracker = new JourneyTracker('writer-agent-journey');
    });

    it('用戶應該能夠生成符合 GRI 標準的永續報告敘事', async () => {
        const journey = journeyTracker.startJourney('generate-narrative');
        
        const result = await writerAgent.generateNarrative('GRI-305-1', {
            emissions: 15000,
            unit: 'tonnes CO2e',
            year: 2025
        });

        // 驗收標準
        expect(result.metadata.confidence).toBeGreaterThanOrEqual(0.9);
        expect(result.content).toContain('GRI 305-1');
        expect(result.metadata.protocol_tags).toContain('traceable');
        expect(result.metadata.telemetry.duration).toBeLessThan(5000);
        
        journeyTracker.completeJourney(journey);
    });

    it('系統應該在生成失敗時提供優雅的錯誤處理', async () => {
        const journey = journeyTracker.startJourney('error-handling');
        
        // 模擬無效輸入
        await expect(
            writerAgent.generateNarrative('', null)
        ).rejects.toThrow('Missing required inputs');
        
        // 驗收標準：錯誤應包含 journey ID
        expect(journey.error).toBeDefined();
        expect(journey.error.recoveryOptions).toContain('retry');
        
        journeyTracker.failJourney(journey, 'invalid-input');
    });
});
```

#### 1.2 Auditor Agent 驗收測試

```typescript
// tests/agents/auditor-agent.acceptance.test.ts
describe('Auditor Agent - Customer Journey Acceptance', () => {
    let auditorAgent: AuditorAgent;

    beforeEach(() => {
        auditorAgent = new AuditorAgent();
    });

    it('用戶應該能夠審核敘事的合規性', async () => {
        const journey = JourneyManager.start('audit-narrative');
        
        const result = await auditorAgent.auditNarrative(
            'Our carbon emissions reduced by 15% in 2025.',
            { emissions: { 2025: 12750, 2024: 15000 } }
        );

        // 驗收標準
        expect(result.pass).toBe(true);
        expect(result.feedback).toContain('compliant');
        expect(result.telemetry.duration).toBeLessThan(3000);
        expect(result.telemetry.auditTrailId).toBeDefined();
        
        JourneyManager.complete(journey);
    });

    it('系統應該追蹤完整的審計軌跡', async () => {
        const auditLog = await auditorAgent.getAuditTrail('audit-123');
        
        expect(auditLog).toEqual({
            timestamp: expect.any(Date),
            agentId: 'auditor-agent',
            inputs: expect.any(Object),
            outputs: expect.any(Object),
            complianceScore: expect.any(Number),
            protocolViolations: []
        });
    });
});
```

---

### 2. 知識殿堂服務 (KnowledgeSanctuary)

#### 2.1 RAG 檢索驗收測試

```typescript
// tests/knowledge/retrieval.acceptance.test.ts
describe('Knowledge Sanctuary - RAG Retrieval Journey', () => {
    let knowledgeService: KnowledgeSanctuaryService;
    let journeyContext: JourneyContext;

    beforeEach(() => {
        knowledgeService = new KnowledgeSanctuaryService();
        journeyContext = new JourneyContext('rag-journey');
    });

    it('用戶應該能夠檢索相關知識上下文', async () => {
        const journey = journeyContext.start('context-retrieval');
        
        const results = await knowledgeService.retrieveContext(
            'What are the GRI standards for carbon emissions?',
            5
        );

        // 驗收標準
        expect(results.length).toBeGreaterThan(0);
        expect(results.length).toBeLessThanOrEqual(5);
        expect(results[0].similarity).toBeGreaterThanOrEqual(0.7);
        expect(results[0].content).toBeDefined();
        
        journeyContext.complete(journey, { itemsFound: results.length });
    });

    it('系統應該快取檢索結果以提高效能', async () => {
        const journey = journeyContext.start('cache-verification');
        
        // 第一次檢索
        const firstResult = await knowledgeService.retrieveContext('ESG reporting');
        
        // 模擬時間推移
        jest.advanceTimersByTime(1000);
        
        // 第二次檢索（應該使用快取）
        const secondResult = await knowledgeService.retrieveContext('ESG reporting');
        
        // 驗收標準
        expect(secondResult).toEqual(firstResult);
        expect(journey.telemetry.cacheHit).toBe(true);
        
        journeyContext.complete(journey);
    });

    it('系統應該在服務不可用時提供 Mock 數據', async () => {
        const journey = journeyContext.start('fallback-behavior');
        
        // 模擬 Supabase 未配置
        const mockService = new MockKnowledgeSanctuary();
        const results = await mockService.retrieveContext('any query');
        
        // 驗收標準
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].metadata.source).toBeDefined();
        expect(journey.telemetry.fallbackUsed).toBe(true);
        
        journeyContext.complete(journey, { fallbackMode: true });
    });
});
```

---

### 3. 快取中介層 (Cache Middleware)

#### 3.1 Redis 快取驗收測試

```typescript
// tests/middleware/cache.acceptance.test.ts
describe('Cache Middleware - Customer Journey', () => {
    let cacheService: CacheService;
    let journeyTracker: JourneyTracker;

    beforeEach(() => {
        cacheService = new RedisCacheService();
        journeyTracker = new JourneyTracker('cache-journey');
    });

    it('用戶請求應該被正確快取和檢索', async () => {
        const journey = journeyTracker.startJourney('cache-operation');
        
        const cacheKey = 'user:123:profile';
        const testData = { name: 'John', role: 'admin' };
        
        // 設置快取
        await cacheService.set(cacheKey, testData, 300);
        
        // 獲取快取
        const cached = await cacheService.get(cacheKey);
        
        // 驗收標準
        expect(cached).toEqual(testData);
        expect(journey.telemetry.cacheStatus).toBe('HIT');
        expect(journey.telemetry.duration).toBeLessThan(100);
        
        journeyTracker.completeJourney(journey);
    });

    it('系統應該追蹤快取命中率', async () => {
        const stats = cacheService.getStats();
        
        // 驗收標準
        expect(stats).toEqual({
            hits: expect.any(Number),
            misses: expect.any(Number),
            errors: expect.any(Number),
            hitRate: expect.any(Number),
            lastHit: expect.any(Date),
            lastMiss: expect.any(Date)
        });
    });

    it('快取應該在 TTL 過期後自動失效', async () => {
        const journey = journeyTracker.startJourney('ttl-expiration');
        
        await cacheService.set('temp-data', 'value', 1); // 1秒 TTL
        
        // 等待 TTL 過期
        await new Promise(resolve => setTimeout(resolve, 1100));
        
        const result = await cacheService.get('temp-data');
        
        // 驗收標準
        expect(result).toBeNull();
        expect(journey.telemetry.cacheStatus).toBe('EXPIRED');
        
        journeyTracker.completeJourney(journey);
    });
});
```

---

### 4. CSRF 安全防護 (CSRF Protection)

#### 4.1 CSRF 驗收測試

```typescript
// tests/security/csrf.acceptance.test.ts
describe('CSRF Protection - Customer Journey', () => {
    let csrfService: CSRFService;
    let journeyContext: JourneyContext;

    beforeEach(() => {
        csrfService = new CSRFService();
        journeyContext = new JourneyContext('csrf-journey');
    });

    it('用戶應該能夠獲取有效的 CSRF token', async () => {
        const journey = journeyContext.start('token-generation');
        
        const token = await csrfService.generateToken();
        
        // 驗收標準
        expect(token).toBeDefined();
        expect(token.length).toBeGreaterThan(16);
        expect(journey.securityTokens.csrfToken).toBe(token);
        
        journeyContext.complete(journey);
    });

    it('有效 token 應該被接受', async () => {
        const journey = journeyContext.start('token-validation');
        
        const token = await csrfService.generateToken();
        const isValid = await csrfService.validateToken(token);
        
        // 驗收標準
        expect(isValid).toBe(true);
        expect(journey.securityEvents).toContain('token_validated');
        
        journeyContext.complete(journey);
    });

    it('無效 token 應該被拒絕', async () => {
        const journey = journeyContext.start('token-rejection');
        
        const isValid = await csrfService.validateToken('invalid-token-123');
        
        // 驗收標準
        expect(isValid).toBe(false);
        expect(journey.securityEvents).toContain('token_rejected');
        expect(journey.telemetry.blockedRequest).toBe(true);
        
        journeyContext.complete(journey, { blocked: true });
    });

    it('系統應該記錄所有 CSRF 違規', async () => {
        const violations = await csrfService.getViolations();
        
        // 驗收標準
        expect(violations).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    timestamp: expect.any(Date),
                    ip: expect.any(String),
                    userAgent: expect.any(String),
                    blockedToken: expect.any(String)
                })
            ])
        );
    });
});
```

---

### 5. Swarm 智能代理系統

#### 5.1 Swarm 旅程驗收測試

```typescript
// tests/swarm/swarm.acceptance.test.ts
describe('Swarm Intelligence - Customer Journey', () => {
    let swarmDashboard: SwarmDashboard;
    let agentManager: AgentManager;

    beforeEach(() => {
        swarmDashboard = new SwarmDashboard();
        agentManager = new AgentManager();
    });

    it('用戶應該能夠部署代理任務', async () => {
        const journey = swarmDashboard.startMission('deploy-agent');
        
        const mission = await agentManager.deployMission({
            type: 'REPORT_GENERATION',
            agents: ['writer-agent', 'auditor-agent'],
            priority: 'HIGH'
        });

        // 驗收標準
        expect(mission.missionId).toBeDefined();
        expect(mission.status).toBe('DEPLOYED');
        expect(mission.agents.length).toBe(2);
        expect(journey.telemetry.deploymentTime).toBeLessThan(5000);
        
        swarmDashboard.completeMission(journey);
    });

    it('系統應該顯示所有代理的即時狀態', async () => {
        const agentStatuses = await agentManager.getAllAgentStatus();
        
        // 驗收標準
        expect(agentStatuses).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    agentId: expect.any(String),
                    status: expect.stringMatching(/online|busy|offline/),
                    cpuUsage: expect.any(Number),
                    memoryUsage: expect.any(Number),
                    tasksCompleted: expect.any(Number)
                })
            ])
        );
    });

    it('任務應該被自動分配給空閒代理', async () => {
        const assignment = await agentManager.assignTask('task-123');
        
        // 驗收標準
        expect(assignment.agentId).toBeDefined();
        expect(assignment.estimatedCompletion).toBeDefined();
        expect(assignment.queuePosition).toBe(0);
    });
});
```

---

### 6. 載入狀態組件 (LoadingSpinner)

#### 6.1 UI 體驗驗收測試

```typescript
// tests/ui/loading-spinner.acceptance.test.ts
describe('LoadingSpinner - Customer Journey', () => {
    let spinner: RenderedComponent<LoadingSpinner>;
    let journeyContext: JourneyContext;

    beforeEach(() => {
        spinner = render(LoadingSpinner, { size: 'lg', variant: 'primary' });
        journeyContext = new JourneyContext('loading-journey');
    });

    it('載入動畫應該平滑運行', async () => {
        const journey = journeyContext.start('animation-test');
        
        // 驗收標準：動畫不應卡頓
        await expectAnimationSmoothness(spinner.container, {
            maxFrameDrop: 2,
            targetFPS: 60
        });
        
        journeyContext.complete(journey);
    });

    it('進度條應該準確反映進度', async () => {
        const journey = journeyContext.start('progress-test');
        
        spinner.rerender({ showProgress: true, progress: 50 });
        
        const progressBar = spinner.container.querySelector('.progress-bar');
        expect(progressBar.style.width).toBe('50%');
        
        journeyContext.complete(journey);
    });

    it('旅程 ID 應該被正確追蹤', async () => {
        const journeyId = 'test-journey-123';
        spinner.rerender({ journeyId });
        
        const journeyElement = spinner.container.querySelector('[data-journey-id]');
        expect(journeyElement.textContent).toContain(journeyId);
    });
});
```

---

## 測試報告模板

```markdown
## 客戶旅程測試報告

### 測試週期：YYYY-MM-DD 至 YYYY-MM-DD

### 覆蓋率摘要

| 指標 | 目標值 | 實際值 | 狀態 |
|------|--------|--------|------|
| 單元測試覆蓋率 | ≥ 90% | 92.5% | ✅ 通過 |
| 整合測試覆蓋率 | ≥ 80% | 85.2% | ✅ 通過 |
| E2E 測試覆蓋率 | ≥ 60% | 68.3% | ✅ 通過 |
| 安全測試覆蓋率 | 100% | 100% | ✅ 通過 |

### 客戶旅程評估

| 旅程名稱 | 完成率 | 平均時長 | 用戶滿意度 |
|----------|--------|----------|------------|
| Writer Agent 敘事生成 | 100% | 2.3s | ⭐⭐⭐⭐⭐ |
| Auditor Agent 審核 | 100% | 1.8s | ⭐⭐⭐⭐⭐ |
| Knowledge RAG 檢索 | 98% | 0.5s | ⭐⭐⭐⭐ |
| Cache 查詢 | 100% | 0.1s | ⭐⭐⭐⭐⭐ |
| CSRF 驗證 | 100% | 0.05s | ⭐⭐⭐⭐⭐ |
| Swarm 任務部署 | 95% | 3.2s | ⭐⭐⭐⭐ |

### 待解決問題

| ID | 優先級 | 描述 | 預計修復時間 |
|----|--------|------|--------------|
| CJ-123 | 高 | iOS Safari 動畫效能問題 | 1 天 |
| CJ-456 | 中 | Android 低版本兼容性 | 3 天 |
```

---

## 執行測試

```bash
# 執行所有驗收測試
npm run test:acceptance

# 執行特定服務測試
npm run test:acceptance -- --grep "Writer Agent"

# 生成測試報告
npm run test:acceptance -- --reporter=mocha-junit-reporter
npm run test:acceptance -- --reporter=html-cov

# CI/CD 整合
npm run test:acceptance:ci
```

---

## 維護指南

| 維護項目 | 頻率 | 說明 |
|----------|------|------|
| 新增服務測試 | 每次 | 必須包含對應的驗收測試 |
| 流程修改更新 | 每次 | 需要更新相關旅程測試 |
| 月度Review | 每月 | 評估測試覆蓋率並補充缺失項目 |
| 季度審計 | 每季 | 驗收測試文檔與實際代碼同步 |

---

**文檔維護者：** ESGSS_JUNAIKEY 開發團隊  
**下次審核：** 2026-03-08
```

---

## 維護指南

| 維護項目 | 頻率 | 說明 |
|----------|------|------|
| 新增服務測試 | 每次 | 必須包含對應的驗收測試 |
| 流程修改更新 | 每次 | 需要更新相關旅程測試 |
| 月度Review | 每月 | 評估測試覆蓋率並補充缺失項目 |
| 季度審計 | 每季 | 驗收測試文檔與實際代碼同步 |

---

**文檔維護者：** ESGSS_JUNAIKEY 開發團隊  
**下次審核：** 2026-03-08

