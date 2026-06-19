/**
 * 💡 Learning Alchemy: Asset Interfaces
 * --------------------------------------------------------------------------------
 * Defines the structure for converting Knowledge Points into Digital Assets.
 * Adheres to the 5T Protocol: Tangible, Traceable, Trackable, Transparent, Trustworthy.
 * 
 * 第一層：5T 邏輯門 (The 5T Logic Gate)
 * [1] Tangible 可感知 - 將抽象永續願景轉化為具體指標成果
 * [2] Traceable 可溯源 - 鏈式日誌包含原始資料來源 (source_origin)
 * [3] Trackable 可追蹤 - 生命週期 Hook 記錄數據流轉路徑
 * [4] Transparent 可透明驗算 - 算法公式公開化，零幻覺驗證 (ISO-14064-1)
 * [5] Trustworthy 不可篡改 - Hash Lock + Object.freeze()
 * 
 * 第二層：4可1不可狀態機 (The 4+1 State Machine)
 * 🟢 可感知 | 🟢 可溯源 | 🟢 可追蹤 | 🟢 可透明驗算 | 🔴 不可篡改
 */

export type AlchemyStage = 'Theory' | 'Example' | 'Practice' | 'Confirmation' | 'Sealing' | 'Finalized';

export type TrustworthyStatus = 'Draft' | 'Sealing' | 'Trustworthy';

/**
 * 💡 奧秘元鑰：學習資產核心結構 (IComponentCore Aligned)
 */
export interface ILearningAsset {
    readonly uuid: string;           // 奧秘永憶主體唯一識別碼
    readonly title: string;          // 知識點名稱
    readonly stage: AlchemyStage;    // 當前煉金階段

    // 4可1不可 狀態檢核
    readonly status: TrustworthyStatus;  // 🔴 狀態：不可篡改 (Hash Locked)

    readonly evidence: {
        tangible_def: string;          // 🟢 理論 Theory (Tangible): 具體化定義
        traceable_ref: string;         // 🟢 範例 Example (Traceable): 來源引用
        trackable_hooks: string[];     // 🟢 實作 Practice (Trackable): 路徑紀錄
        transparent_logic: string;     // 🟢 證實 Confirmation (Transparent): 驗算公式
    };

    readonly hash: string;           // 最終資產雜湊鎖 (Sealing)
    readonly timestamp: number;      // 封印時間戳

    // InfoOne 驗證簽章
    readonly infoOneSignature?: string;
}
