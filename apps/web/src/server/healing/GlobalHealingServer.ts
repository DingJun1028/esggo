import { OmniCard } from '@/src/shared/types';
import { GlobalHealing, HealingLevel, HealingResult, IAdapterNode } from '../../../lib/omni-space/global-healing';
import { EventStore } from '../../../lib/omni-space/event-store';

/**
 * GlobalHealingService: 萬能心核全域自癒調和服務
 * 將測試通過的 GlobalHealing 引擎與 EventStore 真理溯源機制橋接至伺服器層。
 * 遵循 5T 協議門，確保異質外部資料源與本系統的真理狀態達成最終一致性。
 */
export class GlobalHealingService {
  private eventStore: EventStore;
  private healer: GlobalHealing;
  private registeredNodesMap: Map<string, IAdapterNode> = new Map();

  constructor(eventStore?: EventStore, level: HealingLevel = 'LV2_AUTO_HEAL') {
    this.eventStore = eventStore || new EventStore();
    this.healer = new GlobalHealing(this.eventStore, level);
  }

  /**
   * 獲取當前的真理事件儲存庫 (GPL EventStore)
   */
  public getEventStore(): EventStore {
    return this.eventStore;
  }

  /**
   * 獲取底層全域調和自癒引擎實例
   */
  public getHealer(): GlobalHealing {
    return this.healer;
  }

  /**
   * 註冊一個外部適配器節點 (如 Notion, AlTable) 到調和網路中
   */
  public registerNode(node: IAdapterNode): void {
    this.registeredNodesMap.set(node.cardUuid, node);
    this.healer.registerNode(node);
  }

  /**
   * 清除調和網路中所有已註冊的適配器節點
   */
  public clearNodes(): void {
    this.registeredNodesMap.clear();
    this.healer.clearNodes();
  }

  /**
   * 執行調和網路中所有已註冊節點的全域自癒
   */
  public async healAll(): Promise<HealingResult> {
    return this.healer.applyHealing();
  }

  /**
   * 針對單張卡牌的自癒處理 (相容原 healCard 介面)
   * 若卡牌未註冊於網路中，將動態建立臨時內置記憶體適配器節點，對其進行 GPL 真理狀態比對與自癒。
   *
   * @param card 需要自癒調和的卡牌快照
   * @param level 自癒強度等級，預設為自動修復 (LV2_AUTO_HEAL)
   */
  public async healCard(card: OmniCard, level: HealingLevel = 'LV2_AUTO_HEAL'): Promise<HealingResult> {
    console.log(`[GlobalHealingService] 啟動卡牌自癒階段，卡牌 UUID: ${card.uuid}`);

    // 動態檢查是否已有該卡牌的適配節點註冊在調和網路中
    const hasNode = this.registeredNodesMap.has(card.uuid);

    if (!hasNode) {
      console.log(`[GlobalHealingService] 卡牌 ${card.uuid} 未註冊適配器節點，建立臨時記憶體適配器進行調和`);

      const memoryNode: IAdapterNode = {
        platform: 'Notion', // 預設以 Notion 協議進行包裝
        id: `temp-memory-${card.uuid}`,
        cardUuid: card.uuid,
        getSnapshot: async () => card,
        heal: async (truthState: OmniCard) => {
          console.log(`[GlobalHealingService] 記憶體節點自癒中: 將外部快照強制更新至真理狀態`);
          // 原地更新傳入的 card 物件狀態以體現自癒成效
          Object.assign(card, {
            name: truthState.name,
            status: truthState.status,
            attributes: [...truthState.attributes],
            abilities: [...truthState.abilities],
            lastUpdated: truthState.lastUpdated
          });
        }
      };

      this.registerNode(memoryNode);
    }

    // 透過 GlobalHealing 引擎執行差異撫平與痊癒
    return this.healer.applyHealing();
  }
}

// 匯出預設單例以供系統各模組無縫對接
export const globalHealingService = new GlobalHealingService();
