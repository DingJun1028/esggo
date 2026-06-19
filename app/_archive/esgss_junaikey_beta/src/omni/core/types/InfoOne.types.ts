import { OmniTag, OmniComponent } from './OmniCore.types';
import { ITransparentFormula } from './Evidence.types';

/**
 * 💡 5T 協議狀態指標 / 5T Protocol Status Indicators
 */
export enum Protocol5T {
    TANGIBLE = 'Tangible',       // 🟢 可感知 (美)
    TRACEABLE = 'Traceable',     // 🟢 可溯源 (真)
    TRACKABLE = 'Trackable',     // 🟢 可追蹤 (真)
    TRANSPARENT = 'Transparent', // 🟢 可透明 (善)
    TRUSTWORTHY = 'Trustworthy', // 🔴 不可篡改 (信)
}

export enum TrinityComponentState {
    READY = 'READY',
    RUNNING = 'RUNNING',
    SUSPENDED = 'SUSPENDED',
    TERMINATED = 'TERMINATED'
}

export enum TrinityTagType {
    KNOWLEDGE = 'KNOWLEDGE',
    COMPONENT = 'COMPONENT',
    IDENTITY = 'IDENTITY',
    SYSTEM = 'SYSTEM'
}

/**
 * 📚 奧秘智庫條目 / Omni Knowledge Base Entry (OmniKB)
 */
export interface IOmniKB {
    readonly id: string;
    readonly content: string;
    readonly sourceOrigin: string;    // [Traceable] 來源起點 (原始標註)
    readonly evidenceId?: string;      // [Traceable] 證據佐證庫 ID (用於連回原始單據/截圖)
    readonly formula?: string | ITransparentFormula; // [Transparent] 算法公式 (支持結構化展示)
    readonly tags: Protocol5T[];      // 5T 協議狀態
    readonly hashLock: string;        // [Trustworthy] SHA-256 鎖定
}

/**
 * 🏷️ 奧秘標籤擴展 / Omni Tag (Identity Pillar)
 */
export interface IOmniTag extends Omit<OmniTag, 'type'> {
    readonly type: TrinityTagType;
    readonly protocol: Protocol5T[];  // 強化 5T 協議支持
    readonly signature: string;       // 數位簽章，確保真實性
    readonly verification_links?: string[]; // [Traceable] 驗證連結 (e.g. 鏈上存證, 原始單據)
}

/**
 * 📦 奧秘元件心核 / Omni Component Core (Visual Pillar)
 */
export interface IOmniComponent extends Omit<OmniComponent, 'state'> {
    readonly state: TrinityComponentState;
    readonly impactMetric: string;    // [Tangible] 具體影響力指標
    readonly lifecyclePath: string[]; // [Trackable] 生命週期路徑
}

/**
 * 🏛️ InfoOne 三位一體 / InfoOne Trinity
 * --------------------------------------------------
 * [TC] 將元件、智庫與標籤結合成不可分割的單一主體。
 * [EN] Unifies Component, KB, and Tag into an indivisible Trinity.
 */
export interface IInfoOneTrinity {
    readonly uuid: string;            // 全域唯一識標
    readonly version: string;         // 涅槃版本號
    readonly timestamp: number;       // 刻印時間戳

    /** 三位一體成員 / Trinity Members */
    component: IOmniComponent;        // 動能 (Visual/Force)
    knowledge: IOmniKB;               // 智能 (Knowledge/Wisdom)
    identity: IOmniTag;               // 位格 (Identity/Name)

    /** 🔴 不可篡改封印 / Trustworthy Seal */
    lock(): void;
    isLocked(): boolean;
}

/**
 * 🔄 三位一體數據包 / Trinity Payload
 */
export type InfoOnePayload = {
    trinity?: IInfoOneTrinity;
    component?: IOmniComponent;
    knowledge?: IOmniKB;
    identity?: IOmniTag;
    checksum: string;
};

/**
 * 🏹 三位一體相容介面 / Trinity Compliant Interface
 * [TC] 確保物件具備轉化為三位一體的能力。
 */
export interface ITrinityCompliant {
    /** 轉化為三位一體結構 / Transform to Trinity Structure */
    toTrinity(): IInfoOneTrinity;
}

/**
 * 🏛️ 三位一體服務介面 / Trinity Service Interface
 * [TC] 奧秘服務的標準行為，統一產出三位一體資產。
 */
export interface ITrinityService {
    /** 獲取指定資源的 Trinity 視角 */
    getTrinity(id: string): Promise<IInfoOneTrinity>;

    /** 獲取所有相關 Trinity 資產 */
    getAllTrinities?(): Promise<IInfoOneTrinity[]>;
}
