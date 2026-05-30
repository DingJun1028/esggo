import { OmniCard } from '@/src/shared/types';
import { EventStore } from './event-store';
import { StateDiffEngine } from './diff-engine';

/**
 * HealingResult: 全局調和自癒結果契約
 */
export interface HealingResult {
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  reconciledCount: number;
  logs: string[];
}

export type HealingLevel = 'LV1_MONITOR' | 'LV2_AUTO_HEAL' | 'LV3_QUANTUM_LOCK';

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

  /**
   * 量子鎖定：暫停節點的寫入權限，防範污染擴散
   */
  lock?(): Promise<void>;
}

/**
 * IGlobalHealing: 全域痊癒核心協議門
 */
export interface IGlobalHealing {
  scanAllEntities(): Promise<Map<string, OmniCard>>;
  compareWithGPL(): Promise<Map<string, { truth: OmniCard | null; snapshot: OmniCard; node: IAdapterNode }>>;
  applyHealing(): Promise<HealingResult>;
}

/**
 * GlobalHealing: 萬能心核全域自愈調和器
 * 核心機制遵循 5T 協議門，在資料分歧時進行自動化自愈
 */
export class GlobalHealing implements IGlobalHealing {
  private adapterNodes: IAdapterNode[] = [];
  private eventStore: EventStore;
  private healingLevel: HealingLevel;

  constructor(eventStore: EventStore, healingLevel: HealingLevel = 'LV2_AUTO_HEAL') {
    this.eventStore = eventStore;
    this.healingLevel = healingLevel;
  }

  /**
   * 註冊一個適配器節點到調和網路中
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
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        throw new Error(`[全域掃描失敗] 無法從 ${node.platform} 節點 (${node.id}) 提取快照: ${errorMsg}`);
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

    logs.push(`[全域痊癒] 啟動調和自癒機制 (權限等級: ${this.healingLevel})，註冊節點數: ${this.adapterNodes.length}`);

    try {
      const comparison = await this.compareWithGPL();

      for (const [cardUuid, { truth, snapshot, node }] of Array.from(comparison.entries())) {
        let currentTruth = truth;

        // 1. 同步引擎 (Sync Engine)：若 GPL 缺失，以終端快照為準補全溯源鏈
        if (!currentTruth) {
          logs.push(`[同步補全] 卡牌 ${cardUuid} 在 GPL 中缺乏真理源頭，自動以快照建立初始溯源事件。`);
          await this.eventStore.appendEvent(cardUuid, 'CARD_CREATED', snapshot, node.platform);
          currentTruth = snapshot;
          continue; // 已補全，此時無差異
        }

        // 2. 狀態對比 (Diff Engine)
        const diffResult = StateDiffEngine.compare(currentTruth, snapshot);

        if (diffResult.isAligned) {
          logs.push(`[一致] 與 GPL 真理狀態完全契合，無需撫平。`);
        } else {
          logs.push(`[偏離] 檢測到數據偏差！嚴重程度: ${diffResult.severity}`);
          logs.push(`  - 差異詳情: ${JSON.stringify(diffResult.differences)}`);

          // 3. 根據權限等級 (Healing Level) 決定處置策略
          if (this.healingLevel === 'LV1_MONITOR') {
            logs.push(`[監控] LV1 模式，僅紀錄差異，不進行自動撫平。`);
            await this.eventStore.appendEvent(cardUuid, 'HEALING_LOGGED', snapshot, 'Omni-Avatar');
            continue;
          }

          if (this.healingLevel === 'LV3_QUANTUM_LOCK' && diffResult.severity === 'CRITICAL') {
            logs.push(`[量子鎖住] 檢測到 CRITICAL 衝突！啟動 LV3 深度防污染鎖定！暫停節點寫入權限。`);
            if (node.lock) {
              await node.lock();
            }
            await this.eventStore.appendEvent(cardUuid, 'QUANTUM_LOCKED', currentTruth, 'Omni-Avatar');
            failedCount++; // 鎖定視為未能撫平，需人工介入
            continue;
          }

          // LV2 或 LV3 非 CRITICAL 的差異，進行強制修復
          try {
            await node.heal(currentTruth);
            reconciledCount++;
            logs.push(`[成功] 差異撫平完成！已強制更新 ${node.platform} 節點 (${node.id}) 至真理狀態。`);
            
            // 痊癒日誌系統：將「痊癒」過程記錄在 GPL 中
            await this.eventStore.appendEvent(cardUuid, 'HEALING_APPLIED', currentTruth, 'Omni-Avatar');
          } catch (error: unknown) {
            failedCount++;
            const errorMsg = error instanceof Error ? error.message : String(error);
            logs.push(`[錯誤] 撫平節點 ${node.platform} (${node.id}) 失敗: ${errorMsg}`);
            await this.eventStore.appendEvent(cardUuid, 'HEALING_FAILED', snapshot, 'Omni-Avatar');
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
    } catch (e: unknown) {
      logs.push(`[災難性失敗] 全局調和過程中發生未預期錯誤: ${e?.message || e}`);
      return {
        status: 'FAILED',
        reconciledCount: 0,
        logs,
      };
    }
  }
}
