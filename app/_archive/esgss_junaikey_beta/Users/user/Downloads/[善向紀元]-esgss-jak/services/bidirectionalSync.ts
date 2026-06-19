/**
 * JunAiKey 雙向同步服務
 * 實現ESG系統與外部平台的雙向數據同步
 */

import { BidirectionalSyncBridge } from '../types';
import { SoulManager } from './soulManager';
import { logKernelEvent } from './logger';

export class BidirectionalSyncService {
  private static bridges: Map<string, BidirectionalSyncBridge> = new Map();
  private static syncInterval: NodeJS.Timeout | null = null;

  /**
   * 初始化同步橋接器
   */
  static initializeBridges(): void {
    // ESG系統 ↔ Boost.space 橋接器
    const esgToBoostBridge: BidirectionalSyncBridge = {
      sourceSystem: 'ESG_SYSTEM',
      targetSystem: 'BOOST_SPACE',
      mappings: {
        entityMappings: {
          'company': 'organization',
          'supplier': 'contact',
          'esg_report': 'document',
          'carbon_asset': 'asset'
        },
        fieldMappings: {
          'company.name': 'organization.name',
          'supplier.riskStatus': 'contact.status',
          'esg_report.score': 'document.score',
          'carbon_asset.value': 'asset.value'
        },
        workflowMappings: {
          'supplier_onboarding': 'contact_creation_workflow',
          'esg_assessment': 'document_review_workflow',
          'carbon_trading': 'asset_transaction_workflow'
        }
      },
      syncRules: {
        triggerEvents: ['esg_data_updated', 'supplier_status_changed', 'carbon_asset_traded'],
        conflictResolution: 'MERGE',
        frequency: 'REAL_TIME'
      },
      healthMetrics: {
        lastSync: 0,
        successRate: 100,
        latency: 0,
        errorCount: 0
      }
    };

    // Boost.space ↔ ESG系統 橋接器
    const boostToEsgBridge: BidirectionalSyncBridge = {
      sourceSystem: 'BOOST_SPACE',
      targetSystem: 'ESG_SYSTEM',
      mappings: {
        entityMappings: {
          'organization': 'company',
          'contact': 'supplier',
          'document': 'esg_report',
          'asset': 'carbon_asset'
        },
        fieldMappings: {
          'organization.name': 'company.name',
          'contact.status': 'supplier.riskStatus',
          'document.score': 'esg_report.score',
          'asset.value': 'carbon_asset.value'
        },
        workflowMappings: {
          'contact_creation_workflow': 'supplier_onboarding',
          'document_review_workflow': 'esg_assessment',
          'asset_transaction_workflow': 'carbon_trading'
        }
      },
      syncRules: {
        triggerEvents: ['organization_updated', 'contact_modified', 'document_processed'],
        conflictResolution: 'SOURCE_WINS',
        frequency: 'REAL_TIME'
      },
      healthMetrics: {
        lastSync: 0,
        successRate: 100,
        latency: 0,
        errorCount: 0
      }
    };

    this.bridges.set('esg_boost_bridge', esgToBoostBridge);
    this.bridges.set('boost_esg_bridge', boostToEsgBridge);

    // 註冊到SoulManager
    SoulManager.createSyncBridge(esgToBoostBridge);
    SoulManager.createSyncBridge(boostToEsgBridge);

    logKernelEvent('SYNC', 'BRIDGES_INITIALIZED', 'SUCCESS', {
      bridgeCount: this.bridges.size,
      systems: ['ESG_SYSTEM', 'BOOST_SPACE']
    });
  }

  /**
   * 啟動自動同步
   */
  static startAutoSync(): void {
    // 每30秒執行一次同步檢查
    this.syncInterval = setInterval(async () => {
      await this.executeAllBridges();
    }, 30000);

    logKernelEvent('SYNC', 'AUTO_SYNC_STARTED', 'INFO', {
      interval: 30000,
      activeBridges: this.bridges.size
    });
  }

  /**
   * 停止自動同步
   */
  static stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      logKernelEvent('SYNC', 'AUTO_SYNC_STOPPED', 'INFO');
    }
  }

  /**
   * 執行所有橋接器的同步
   */
  static async executeAllBridges(): Promise<void> {
    const syncPromises = Array.from(this.bridges.keys()).map(bridgeId =>
      this.executeBridgeSync(bridgeId)
    );

    try {
      await Promise.allSettled(syncPromises);
      logKernelEvent('SYNC', 'ALL_BRIDGES_SYNCED', 'SUCCESS', {
        bridgeCount: this.bridges.size
      });
    } catch (error) {
      logKernelEvent('SYNC', 'SYNC_BATCH_FAILED', 'ERROR', { error: error.message });
    }
  }

  /**
   * 執行特定橋接器的同步
   */
  static async executeBridgeSync(bridgeId: string): Promise<void> {
    const bridge = this.bridges.get(bridgeId);
    if (!bridge) {
      throw new Error(`橋接器 ${bridgeId} 不存在`);
    }

    const startTime = Date.now();

    try {
      // 使用SoulManager執行同步
      await SoulManager.executeBidirectionalSync(bridgeId);

      // 更新健康指標
      bridge.healthMetrics.lastSync = Date.now();
      bridge.healthMetrics.latency = Date.now() - startTime;
      bridge.healthMetrics.successRate = Math.min(100, bridge.healthMetrics.successRate + 1);

      logKernelEvent('SYNC', 'BRIDGE_SYNC_SUCCESS', 'SUCCESS', {
        bridgeId,
        latency: bridge.healthMetrics.latency,
        successRate: bridge.healthMetrics.successRate
      });

    } catch (error) {
      bridge.healthMetrics.errorCount++;
      bridge.healthMetrics.successRate = Math.max(0, bridge.healthMetrics.successRate - 5);

      logKernelEvent('SYNC', 'BRIDGE_SYNC_FAILED', 'ERROR', {
        bridgeId,
        error: error.message,
        errorCount: bridge.healthMetrics.errorCount
      });

      throw error;
    }
  }

  /**
   * 手動觸發數據同步
   */
  static async triggerManualSync(
    sourceSystem: string,
    targetSystem: string,
    entityType: string,
    entityId: string
  ): Promise<void> {
    const bridgeId = `${sourceSystem.toLowerCase()}_${targetSystem.toLowerCase()}_bridge`;
    const bridge = this.bridges.get(bridgeId);

    if (!bridge) {
      throw new Error(`未找到 ${sourceSystem} → ${targetSystem} 的橋接器`);
    }

    logKernelEvent('SYNC', 'MANUAL_SYNC_TRIGGERED', 'INFO', {
      sourceSystem,
      targetSystem,
      entityType,
      entityId
    });

    // 執行定向同步
    await this.executeBridgeSync(bridgeId);
  }

  /**
   * 增強數據同步 - ESG系統學習Boost.space的能力
   */
  static async enhanceWithBoostSpace(bridgeId: string): Promise<void> {
    const bridge = this.bridges.get(bridgeId);
    if (!bridge) return;

    try {
      // 從Boost.space獲取工作流數據
      const boostWorkflows = await this.fetchBoostSpaceWorkflows();

      // 將工作流轉換為ESG技能
      const newSkills = this.convertWorkflowsToSkills(boostWorkflows);

      // 應用到相關靈魂
      for (const skill of newSkills) {
        // 這裡可以實現自動應用到ESG靈魂的邏輯
        logKernelEvent('SYNC', 'BOOST_ENHANCEMENT_APPLIED', 'INFO', {
          skillName: skill.name,
          bridgeId
        });
      }

    } catch (error) {
      logKernelEvent('SYNC', 'BOOST_ENHANCEMENT_FAILED', 'ERROR', {
        bridgeId,
        error: error.message
      });
    }
  }

  /**
   * 回饋增強 - 將ESG洞察同步回Boost.space
   */
  static async feedbackToBoostSpace(bridgeId: string): Promise<void> {
    const bridge = this.bridges.get(bridgeId);
    if (!bridge) return;

    try {
      // 獲取ESG分析結果
      const esgInsights = await this.gatherEsgInsights();

      // 轉換為Boost.space格式
      const boostInsights = this.convertEsgInsights(esgInsights);

      // 同步回Boost.space
      await this.sendToBoostSpace(boostInsights);

      logKernelEvent('SYNC', 'ESG_FEEDBACK_SYNCED', 'SUCCESS', {
        bridgeId,
        insightsCount: esgInsights.length
      });

    } catch (error) {
      logKernelEvent('SYNC', 'ESG_FEEDBACK_FAILED', 'ERROR', {
        bridgeId,
        error: error.message
      });
    }
  }

  /**
   * 獲取同步健康狀態
   */
  static getSyncHealth(): {
    bridges: Array<{
      id: string;
      sourceSystem: string;
      targetSystem: string;
      lastSync: number;
      successRate: number;
      latency: number;
      errorCount: number;
      status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
    }>;
    overallHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  } {
    const bridges = Array.from(this.bridges.entries()).map(([id, bridge]) => {
      const status = this.determineBridgeStatus(bridge);
      return {
        id,
        sourceSystem: bridge.sourceSystem,
        targetSystem: bridge.targetSystem,
        lastSync: bridge.healthMetrics.lastSync,
        successRate: bridge.healthMetrics.successRate,
        latency: bridge.healthMetrics.latency,
        errorCount: bridge.healthMetrics.errorCount,
        status
      };
    });

    const overallHealth = this.calculateOverallHealth(bridges);

    return { bridges, overallHealth };
  }

  // 私有輔助方法

  private static determineBridgeStatus(bridge: BidirectionalSyncBridge): 'HEALTHY' | 'WARNING' | 'CRITICAL' {
    const { successRate, errorCount, lastSync } = bridge.healthMetrics;
    const timeSinceLastSync = Date.now() - lastSync;

    if (successRate >= 95 && errorCount < 5 && timeSinceLastSync < 300000) { // 5分鐘內
      return 'HEALTHY';
    } else if (successRate >= 80 && errorCount < 10) {
      return 'WARNING';
    } else {
      return 'CRITICAL';
    }
  }

  private static calculateOverallHealth(bridges: any[]): 'HEALTHY' | 'WARNING' | 'CRITICAL' {
    const criticalCount = bridges.filter(b => b.status === 'CRITICAL').length;
    const warningCount = bridges.filter(b => b.status === 'WARNING').length;

    if (criticalCount > 0) return 'CRITICAL';
    if (warningCount > 0) return 'WARNING';
    return 'HEALTHY';
  }

  private static async fetchBoostSpaceWorkflows(): Promise<any[]> {
    // 模擬從Boost.space獲取工作流數據
    return [
      {
        id: 'workflow_001',
        name: '自動供應商評估',
        steps: ['數據收集', '風險分析', '報告生成'],
        triggers: ['supplier_added', 'quarterly_review']
      }
    ];
  }

  private static convertWorkflowsToSkills(workflows: any[]): any[] {
    return workflows.map(workflow => ({
      id: `skill_from_boost_${workflow.id}`,
      name: `來自Boost.space: ${workflow.name}`,
      type: 'ACTIVE' as const,
      description: `基於Boost.space工作流自動生成的技能`,
      parameters: { workflowId: workflow.id },
      energyCost: 10,
      mastery: 0
    }));
  }

  private static async gatherEsgInsights(): Promise<any[]> {
    // 從ESG系統收集洞察數據
    const insights = localStorage.getItem('esg-insights');
    return insights ? JSON.parse(insights) : [];
  }

  private static convertEsgInsights(insights: any[]): any[] {
    return insights.map(insight => ({
      ...insight,
      source: 'ESG_SYSTEM',
      timestamp: Date.now()
    }));
  }

  private static async sendToBoostSpace(data: any[]): Promise<void> {
    // 模擬發送到Boost.space
    console.log('同步ESG洞察到Boost.space:', data);
  }
}

// 初始化橋接器
BidirectionalSyncService.initializeBridges();