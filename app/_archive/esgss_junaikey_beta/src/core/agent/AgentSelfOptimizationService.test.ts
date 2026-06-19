/**
 * AgentSelfOptimizationService.test.ts
 * 
 * 🧪 AI Agent Self-Optimization Service 測試
 * -----------------------------------------
 * 測試代理自我優化服務的各項功能
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AgentSelfOptimizationService, AgentType, LogAnalysisResult, OptimizationRecommendation } from './AgentSelfOptimizationService';

describe('AgentSelfOptimizationService', () => {
    let service: AgentSelfOptimizationService;

    beforeEach(() => {
        service = new AgentSelfOptimizationService();
    });

    afterEach(() => {
        service.stopAutoAnalysis();
    });

    describe('初始化測試', () => {
        it('應該成功初始化服務', () => {
            expect(service).toBeDefined();
        });

        it('應該為所有代理類型初始化效能指標', () => {
            const overview = service.getAllAgentsOverview();
            const agentTypes: AgentType[] = ['main', 'coder', 'researcher', 'analyst', 'orchestrator'];
            
            agentTypes.forEach(agentType => {
                expect(overview[agentType]).toBeDefined();
                expect(overview[agentType].efficiency).toBeGreaterThanOrEqual(0);
                expect(overview[agentType].efficiency).toBeLessThanOrEqual(100);
            });
        });
    });

    describe('日誌分析測試', () => {
        it('應該成功分析代理日誌', async () => {
            const result = await service.analyzeAgentLogs('main');
            
            expect(result).toBeDefined();
            expect(result.analysisId).toBeDefined();
            expect(result.agentType).toBe('main');
            expect(result.totalLogs).toBeGreaterThan(0);
            expect(result.efficiency).toBeGreaterThanOrEqual(0);
            expect(result.efficiency).toBeLessThanOrEqual(100);
            expect(result.evidenceHash).toBeDefined();
        });

        it('應該正確計算日誌分佈', async () => {
            const result = await service.analyzeAgentLogs('coder');
            
            expect(result.logDistribution).toBeDefined();
            expect(result.logDistribution.debug).toBeGreaterThanOrEqual(0);
            expect(result.logDistribution.info).toBeGreaterThanOrEqual(0);
            expect(result.logDistribution.warn).toBeGreaterThanOrEqual(0);
            expect(result.logDistribution.error).toBeGreaterThanOrEqual(0);
            expect(result.logDistribution.critical).toBeGreaterThanOrEqual(0);
        });

        it('應該正確計算錯誤率', async () => {
            const result = await service.analyzeAgentLogs('researcher');
            
            expect(result.errorRate).toBeGreaterThanOrEqual(0);
            expect(result.errorRate).toBeLessThanOrEqual(1);
        });

        it('應該在分析完成時發出事件', async () => {
            const eventHandler = vi.fn();
            service.onAnalysisComplete(eventHandler);
            
            await service.analyzeAgentLogs('analyst');
            
            expect(eventHandler).toHaveBeenCalled();
            expect(eventHandler).toHaveBeenCalledWith(expect.objectContaining({
                agentType: 'analyst'
            }));
        });
    });

    describe('效能指標測試', () => {
        it('應該成功獲取代理效能摘要', () => {
            const summary = service.getAgentPerformanceSummary('main');
            
            expect(summary).toBeDefined();
            expect(summary.currentMetrics).toBeDefined();
            expect(Array.isArray(summary.currentMetrics)).toBe(true);
        });

        it('效能指標應包含必要的 5T 屬性', () => {
            const summary = service.getAgentPerformanceSummary('main');
            const metric = summary.currentMetrics[0];
            
            if (metric) {
                expect(metric.metricId).toBeDefined();  // [Traceable 可溯源]
                expect(metric.timestamp).toBeDefined(); // [Trackable 可追蹤]
                expect(metric.evidenceHash).toBeDefined(); // [Trustworthy 不可篡改]
            }
        });

        it('應該成功更新效能指標', () => {
            service.updateMetric('main', 'response_time', 200);
            const summary = service.getAgentPerformanceSummary('main');
            const metric = summary.currentMetrics.find(m => m.metricName === 'response_time');
            
            if (metric) {
                expect(metric.value).toBe(200);
            }
        });
    });

    describe('優化建議測試', () => {
        it('應該在分析後生成優化建議', async () => {
            const result = await service.analyzeAgentLogs('main');
            
            expect(result.recommendations).toBeDefined();
            expect(Array.isArray(result.recommendations)).toBe(true);
        });

        it('優化建議應包含必要欄位', async () => {
            const result = await service.analyzeAgentLogs('main');
            
            if (result.recommendations.length > 0) {
                const recommendation = result.recommendations[0];
                expect(recommendation.recommendationId).toBeDefined();
                expect(recommendation.type).toBeDefined();
                expect(recommendation.priority).toBeDefined();
                expect(recommendation.description).toBeDefined();
                expect(recommendation.estimatedImprovement).toBeGreaterThan(0);
            }
        });

        it('應該成功實施優化建議', async () => {
            const result = await service.analyzeAgentLogs('main');
            
            if (result.recommendations.length > 0) {
                const recommendation = result.recommendations[0];
                const action = await service.implementRecommendation(recommendation.recommendationId);
                
                expect(action).toBeDefined();
                expect(action?.status).toBe('implemented');
                expect(action?.actualImprovement).toBeGreaterThan(0);
                expect(action?.evidenceHash).toBeDefined();
            }
        });

        it('應該在實施優化時發出事件', async () => {
            const eventHandler = vi.fn();
            service.onOptimizationImplemented(eventHandler);
            
            const result = await service.analyzeAgentLogs('main');
            
            if (result.recommendations.length > 0) {
                await service.implementRecommendation(result.recommendations[0].recommendationId);
                expect(eventHandler).toHaveBeenCalled();
            }
        });

        it('應該返回 null 當建議不存在時', async () => {
            const action = await service.implementRecommendation('non-existent-id');
            expect(action).toBeNull();
        });
    });

    describe('自動分析測試', () => {
        it('應該成功啟動自動分析', () => {
            service.startAutoAnalysis(60000);
            // 沒有拋出異常即為成功
            expect(true).toBe(true);
        });

        it('應該成功停止自動分析', () => {
            service.startAutoAnalysis(60000);
            service.stopAutoAnalysis();
            // 沒有拋出異常即為成功
            expect(true).toBe(true);
        });
    });

    describe('5T Protocol 驗證測試', () => {
        it('分析結果應包含 evidenceHash', async () => {
            const result = await service.analyzeAgentLogs('main');
            
            expect(result.evidenceHash).toBeDefined();
            expect(result.evidenceHash).toMatch(/^[a-f0-9]{64}$/); // SHA-256 格式
        });

        it('效能指標應包含 evidenceHash', () => {
            const summary = service.getAgentPerformanceSummary('main');
            const metric = summary.currentMetrics[0];
            
            if (metric) {
                expect(metric.evidenceHash).toBeDefined();
                expect(metric.evidenceHash).toMatch(/^[a-f0-9]{64}$/);
            }
        });

        it('優化行動應包含 evidenceHash', async () => {
            const result = await service.analyzeAgentLogs('main');
            
            if (result.recommendations.length > 0) {
                const action = await service.implementRecommendation(result.recommendations[0].recommendationId);
                
                if (action) {
                    expect(action.evidenceHash).toBeDefined();
                    expect(action.evidenceHash).toMatch(/^[a-f0-9]{64}$/);
                }
            }
        });
    });

    describe('效能概覽測試', () => {
        it('應該返回所有代理的效能概覽', () => {
            const overview = service.getAllAgentsOverview();
            
            expect(overview).toBeDefined();
            expect(Object.keys(overview).length).toBe(5);
        });

        it('概覽應包含正確的狀態', () => {
            const overview = service.getAllAgentsOverview();
            
            Object.values(overview).forEach(agentOverview => {
                expect(['healthy', 'warning', 'critical']).toContain(agentOverview.status);
            });
        });
    });
});
