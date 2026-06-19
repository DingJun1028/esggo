/**
 * 💡 善向研發 (Benevolence R&D) - JunAiKey Tec 數據中心服務
 * --------------------------------------------------
 * [核心功能] 主數據管理 (Master Data Management, MDM)
 * [系統背景] 封裝 JunAiKey Tec 的數據中控技術，解決跨平台 ESG 數據孤島問題。
 * [技術價值] 提供單一真相來源 (SSOT) 彙整，實現全球連動的實時數據權威化。
 */

import { omniSpaceClient } from '@infra/api/OmniSpaceClient';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

export interface MasterRecord {
  id: string;
  sourceSystem: string;
  domain: string;
  data: any;
  version: number;
}

export class OmniDataCenterService {
  private static instance: OmniDataCenterService;
  private currentSession: string | null = null;

  static getInstance(): OmniDataCenterService {
    if (!OmniDataCenterService.instance) {
      OmniDataCenterService.instance = new OmniDataCenterService();
    }
    return OmniDataCenterService.instance;
  }

  /**
   * 啟動 OmniSpace 引擎
   */
  async activateOmniEngine(): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, 'Initializing OmniSpace MDM Engine...');
    this.currentSession = await omniSpaceClient.createSyncSession('ESG_SOVEREIGN');
    omniLogger.info(LogCategory.SYSTEM, `OmniSpace Engine Active. Session: ${this.currentSession}`);
  }

  /**
   * 將本地領域數據提煉為主數據並同步
   */
  async refineAndSync(domainData: any): Promise<void> {
    if (!this.currentSession) await this.activateOmniEngine();

    const masterRecord: MasterRecord = {
      id: domainData.uuid || domainData.id,
      sourceSystem: 'JunAiKey_Core',
      domain: 'ESG_INTELLIGENCE',
      data: domainData,
      version: Date.now(),
    };

    await omniSpaceClient.pushMasterData(masterRecord);
    omniLogger.info(LogCategory.DATA, 'Domain data successfully refined to Master Data Center.');
  }

  /**
   * 獲取 OmniSpace 彙整後的全局洞察
   */
  async getGlobalInsights(): Promise<any[]> {
    return await omniSpaceClient.fetchAggregatedData('all_integrated_nodes');
  }
}

export const omniDataCenterService = OmniDataCenterService.getInstance();
