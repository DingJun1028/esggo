/**
 * Nexus Core: External Sync Service
 * 用於將 OmniCore 的數據 (如知識入庫、使用者回饋) 同步至外部系統 (OmniTable.ai, OmniBlue 等)
 */

export interface SyncPayload {
  source: string;
  timestamp: string;
  [key: string]: unknown;
}

export interface HealingGuardianEvent {
  type: 'healing';
  data: {
    message: string;
    originalQuery?: string;
    actionTaken: string;
    success: boolean;
    timestamp: string;
  };
}

export interface FeedbackEvent {
  type: 'feedback';
  data: {
    messageId?: string;
    query: string;
    answer?: string;
    feedback: number | string;
    timestamp: string;
  };
}

export interface IngestionEvent {
  type: 'ingestion';
  data: {
    documentId: string;
    status: string;
    timestamp: string;
  };
}

export type EvolutionEvent = HealingGuardianEvent | FeedbackEvent | IngestionEvent;

export class ExternalSyncService {
  private static instance: ExternalSyncService;

  private constructor() {}

  public static getInstance(): ExternalSyncService {
    if (!ExternalSyncService.instance) {
      ExternalSyncService.instance = new ExternalSyncService();
    }
    return ExternalSyncService.instance;
  }

  /**
   * 同步至 OmniTable.ai (知識聖殿的數據基石)
   */
  public async syncToOmniTable(datasheetId: string, payload: any): Promise<boolean> {
    console.log(`[Nexus] 🔄 準備同步數據至 OmniTable.ai (Datasheet: ${datasheetId})`, payload);
    try {
      const token = process.env.OMNITABLE_API_TOKEN;
      if (!token) {
        console.warn('[Nexus] ⚠️ 缺少 OMNITABLE_API_TOKEN，跳過 OmniTable 實際同步');
        return false;
      }

      const response = await fetch(`https://api.omni-table.ai/fusion/v1/datasheets/${datasheetId}/records`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                Payload: JSON.stringify(payload),
                Type: payload.type || 'unknown',
                Timestamp: new Date().toISOString()
              }
            }
          ]
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error(`[Nexus] ❌ OmniTable API 錯誤:`, errData);
        return false;
      }
      
      console.log(`[Nexus] ✅ 成功同步至 OmniTable.ai`);
      return true;
    } catch (error) {
      console.error(`[Nexus] ❌ 同步 OmniTable.ai 失敗:`, error);
      return false;
    }
  }

  /**
   * 同步至 OmniBlue (企業核心控制 / ERP CRM)
   */
  public async syncToOmniBlue(endpoint: string, payload: unknown): Promise<boolean> {
    console.log(`[Nexus] 🔄 準備同步數據至 OmniBlue 系統 (Endpoint: ${endpoint})`, payload);
    try {
      const apiKey = process.env.OMNIBLUE_API_KEY;
      const baseUrl = process.env.OMNIBLUE_BASE_URL || 'https://api.omniblue.com';
      if (!apiKey) {
        console.warn('[Nexus] ⚠️ 缺少 OMNIBLUE_API_KEY，跳過 OmniBlue 實際同步');
        return false;
      }

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
         console.error(`[Nexus] ❌ OmniBlue API 錯誤: HTTP ${response.status}`);
         return false;
      }
      
      console.log(`[Nexus] ✅ 成功同步至 OmniBlue`);
      return true;
    } catch (error) {
      console.error(`[Nexus] ❌ 同步 OmniBlue 失敗:`, error);
      return false;
    }
  }

  /**
   * 觸發萬能進化環 (Evolution Loop) 的聯合同步
   * 當系統獲得使用者回饋，或是核心資料庫更新時觸發
   */
  public async triggerEvolutionSync(event: EvolutionEvent) {
    console.log(`[Evolution Loop] 🧬 啟動萬能進化環聯合同步機制... 事件類型: ${event.type}`);
    
    // 並行發送至多個外部系統
    const results = await Promise.allSettled([
      this.syncToOmniTable('dst_evolution_logs', event),
      this.syncToOmniBlue('/v1/events/omni-core', event)
    ]);

    const successCount = results.filter(r => r.status === 'fulfilled' && (r as PromiseFulfilledResult<boolean>).value === true).length;
    console.log(`[Evolution Loop] 🧬 同步完成，成功推送至 ${successCount} 個外部節點。`);
  }
}
