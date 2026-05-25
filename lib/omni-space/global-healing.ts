import { OmniCard } from '../../types/omni-card';
import { EventStore } from './event-store';

/**
 * HealingResult: 全局調和自癒結果契約
 */
export interface HealingResult {
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  reconciledCount: number;
  logs: string[];
}

/**
 * IAdapterNode: 異質外部資料源適配器節點
 * 每個節點代表外部平台 (如 Notion 或 AlTable) 的一個實體，能被掃描與被強制修復
 */
export interface IAdapterNode {
  platform: 'Notion' | 'AlTable';
  id: string; // 外部頁面或記錄的 ID (e.g. page_id, record_id)
  cardUuid: string; // 對應到我們系統中的唯一卡牌 UUID (Traceable)
  
  /**
   * 提取該外部節點當下的卡牌快照
   */
  getSnapshot(): Promise<OmniCard>;
  
  /**
   * 將外部節點的狀態強制更新 (Heal) 為真理狀態
   */
  heal(truthState: OmniCard): Promise<void>;
}

/**
 * IGlobalHealing: 全域痊癒核心協議門
 */
export interface IGlobalHealing {
  /**
   * 全局掃描：遍歷所有適配器節點，提取最新的卡牌快照
   */
  scanAllEntities(): Promise<Map<string, OmniCard>>;

  /**
   * 溯源校驗：讀取 GPL 事件流，重建真理狀態，並與各節點快照比對
   */
  compareWithGPL(): Promise<Map<string, { truth: OmniCard | null; snapshot: OmniCard; node: IAdapterNode }>>;

  /**
   * 差異撫平：若終端數據偏離真理，強制調用適配器修正，確保資料一致性
   */
  applyHealing(): Promise<HealingResult>;
}

/**
 * GlobalHealing: 萬能心核全域自愈調和器
 * 核心機制遵循 5T 協議門，在資料分歧時進行自動化自愈
 */
export class GlobalHealing implements IGlobalHealing {
  private adapterNodes: IAdapterNode[] = [];
  private eventStore: EventStore;

  constructor(eventStore: EventStore) {
    this.eventStore = eventStore;
  }

  /**
   * 註冊一個適配器節點到調和網路中
   * @param node 適配器節點
   */
  public registerNode(node: IAdapterNode): void {
    this.adapterNodes.push(node);
  }

  /**
   * 清除已註冊的節點 (測試隔離輔助)
   */
  public clearNodes(): void {
    this.adapterNodes = [];
  }

  /**
   * 1. 全局掃描：遍歷所有適配器節點，提取當下的卡牌快照 (Tangible)
   */
  public async scanAllEntities(): Promise<Map<string, OmniCard>> {
    const snapshots = new Map<string, OmniCard>();
    for (const node of this.adapterNodes) {
      try {
        const snapshot = await node.getSnapshot();
        snapshots.set(node.cardUuid, snapshot);
      } catch (err: any) {
        throw new Error(`[全域掃描失敗] 無法從 ${node.platform} 節點 (${node.id}) 提取快照: ${err?.message || err}`);
      }
    }
    return snapshots;
  }

  /**
   * 2. 溯源校驗：讀取 GPL 的事件流，重建該卡牌的「真理狀態」(Truth State)，與終端進行比對 (Traceable)
   */
  public async compareWithGPL(): Promise<Map<string, { truth: OmniCard | null; snapshot: OmniCard; node: IAdapterNode }>> {
    const comparison = new Map<string, { truth: OmniCard | null; snapshot: OmniCard; node: IAdapterNode }>();
    
    for (const node of this.adapterNodes) {
      const snapshot = await node.getSnapshot();
      const truth = this.eventStore.rebuildTruthState(node.cardUuid);
      comparison.set(node.cardUuid, { truth, snapshot, node });
    }
    
    return comparison;
  }

  /**
   * 3. 差異撫平 (Healing)：若終端數據偏離真理狀態，強制呼叫適配器修復，確保資料一致 (Transparent)
   */
  public async applyHealing(): Promise<HealingResult> {
    const logs: string[] = [];
    let reconciledCount = 0;
    let failedCount = 0;

    logs.push(`[全域痊癒] 啟動調和自癒機制，目前註冊的適配器節點數量: ${this.adapterNodes.length}`);

    try {
      const comparison = await this.compareWithGPL();

      for (const [cardUuid, { truth, snapshot, node }] of comparison.entries()) {
        if (!truth) {
          logs.push(`[警報] 卡牌 ${cardUuid} 在 GPL 中找不到事件溯源歷史 (缺乏真理源頭)，跳過撫平。`);
          continue;
        }

        // 比較 snapshot 與 truth 是否一致 (基於 5T 協議內容)
        const isAligned = 
          snapshot.name === truth.name &&
          snapshot.status === truth.status &&
          JSON.stringify(snapshot.attributes) === JSON.stringify(truth.attributes) &&
          JSON.stringify(snapshot.abilities) === JSON.stringify(truth.abilities);

        if (isAligned) {
          logs.push(`[一致] 節點 ${node.platform} (${node.id}) 與 GPL 真理狀態完全契合，無需撫平。`);
        } else {
          logs.push(`[偏離] 檢測到數據偏差！節點 ${node.platform} (${node.id}) 資料落後或偏離。`);
          logs.push(`  - GPL 真理狀態: ${JSON.stringify(truth)}`);
          logs.push(`  - 終端 Snapshot: ${JSON.stringify(snapshot)}`);

          try {
            // 強制呼叫適配器修復，進行差異撫平
            await node.heal(truth);
            reconciledCount++;
            logs.push(`[成功] 差異撫平完成！已強制更新 ${node.platform} 節點 (${node.id}) 至真理狀態。`);
          } catch (error: any) {
            failedCount++;
            logs.push(`[錯誤] 撫平節點 ${node.platform} (${node.id}) 失敗: ${error?.message || error}`);
          }
        }
      }

      let status: 'SUCCESS' | 'PARTIAL' | 'FAILED' = 'SUCCESS';
      if (failedCount > 0) {
        status = reconciledCount > 0 ? 'PARTIAL' : 'FAILED';
      }

      logs.push(`[調和結束] 狀態: ${status}, 成功修復節點數: ${reconciledCount}, 失敗節點數: ${failedCount}`);

      return {
        status,
        reconciledCount,
        logs,
      };
    } catch (e: any) {
      logs.push(`[災難性失敗] 全局調和過程中發生未預期錯誤: ${e?.message || e}`);
      return {
        status: 'FAILED',
        reconciledCount: 0,
        logs,
      };
    }
  }
}
