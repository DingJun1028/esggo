import { OmniCard } from '@/src/shared/types';
import { EventStore } from './event-store';
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
    id: string;
    cardUuid: string;
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
    compareWithGPL(): Promise<Map<string, {
        truth: OmniCard | null;
        snapshot: OmniCard;
        node: IAdapterNode;
    }>>;
    applyHealing(): Promise<HealingResult>;
}
/**
 * GlobalHealing: 萬能心核全域自愈調和器
 * 核心機制遵循 5T 協議門，在資料分歧時進行自動化自愈
 */
export declare class GlobalHealing implements IGlobalHealing {
    private adapterNodes;
    private eventStore;
    private healingLevel;
    constructor(eventStore: EventStore, healingLevel?: HealingLevel);
    /**
     * 註冊一個適配器節點到調和網路中
     */
    registerNode(node: IAdapterNode): void;
    /**
     * 清除已註冊的節點 (測試隔離輔助)
     */
    clearNodes(): void;
    /**
     * 1. 全局掃描：遍歷所有適配器節點，提取當下的卡牌快照 (Tangible)
     */
    scanAllEntities(): Promise<Map<string, OmniCard>>;
    /**
     * 2. 溯源校驗：讀取 GPL 的事件流，重建該卡牌的「真理狀態」(Truth State)，與終端進行比對 (Traceable)
     */
    compareWithGPL(): Promise<Map<string, {
        truth: OmniCard | null;
        snapshot: OmniCard;
        node: IAdapterNode;
    }>>;
    /**
     * 3. 差異撫平 (Healing)：若終端數據偏離真理狀態，強制呼叫適配器修復，確保資料一致 (Transparent)
     */
    applyHealing(): Promise<HealingResult>;
}
//# sourceMappingURL=global-healing.d.ts.map