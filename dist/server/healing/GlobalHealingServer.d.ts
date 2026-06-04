import { OmniCard } from '@/src/shared/types';
import { GlobalHealing, HealingLevel, HealingResult, IAdapterNode } from '../../../lib/omni-space/global-healing';
import { EventStore } from '../../../lib/omni-space/event-store';
/**
 * GlobalHealingService: 萬能心核全域自癒調和服務
 * 將測試通過的 GlobalHealing 引擎與 EventStore 真理溯源機制橋接至伺服器層。
 * 遵循 5T 協議門，確保異質外部資料源與本系統的真理狀態達成最終一致性。
 */
export declare class GlobalHealingService {
    private eventStore;
    private healer;
    private registeredNodesMap;
    constructor(eventStore?: EventStore, level?: HealingLevel);
    /**
     * 獲取當前的真理事件儲存庫 (GPL EventStore)
     */
    getEventStore(): EventStore;
    /**
     * 獲取底層全域調和自癒引擎實例
     */
    getHealer(): GlobalHealing;
    /**
     * 註冊一個外部適配器節點 (如 Notion, AlTable) 到調和網路中
     */
    registerNode(node: IAdapterNode): void;
    /**
     * 清除調和網路中所有已註冊的適配器節點
     */
    clearNodes(): void;
    /**
     * 執行調和網路中所有已註冊節點的全域自癒
     */
    healAll(): Promise<HealingResult>;
    /**
     * 針對單張卡牌的自癒處理 (相容原 healCard 介面)
     * 若卡牌未註冊於網路中，將動態建立臨時內置記憶體適配器節點，對其進行 GPL 真理狀態比對與自癒。
     *
     * @param card 需要自癒調和的卡牌快照
     * @param level 自癒強度等級，預設為自動修復 (LV2_AUTO_HEAL)
     */
    healCard(card: OmniCard, level?: HealingLevel): Promise<HealingResult>;
}
export declare const globalHealingService: GlobalHealingService;
//# sourceMappingURL=GlobalHealingServer.d.ts.map