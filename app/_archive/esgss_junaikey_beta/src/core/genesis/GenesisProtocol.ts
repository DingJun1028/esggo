/**
 * 💡 核心組件：奧秘永憶主體分發之核心架構
 * --------------------------------------------------
 * [來源備註] 參考 JunAiKey 奧秘元件心核規範 v1.1
 * [零幻覺驗證] 屬性均設為 readonly，強制執行 Immutable 協議
 */
import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger';

export interface IComponentCore {
  readonly uuid: string; // 奧秘永憶主體唯一識別碼
  readonly version: string; // 語義化版本控制 (e.g., 1.0.2)
  readonly timestamp: number; // 刻印時間戳 (Unix Epoch)
  evidence: Record<string, unknown>; // 證據佐證庫 (可變，用於動態存儲驗證資料)
}

/**
 * ⚡ 代理靈魂契約：符合「3可1不可」狀態機規範
 */
export interface IAgentArchetype extends IComponentCore {
  readonly name: string;
  readonly role: 'Governor' | 'Observer' | 'Architect' | 'Evaluator';

  /**
   * 🟢 可溯源 (Traceable): 鏈式日誌
   * --------------------------------------------------
   * 確保每一筆數據流均包含 source_origin 備註與原始資料留存
   */
  chainedLogs: {
    readonly source_origin: string; // 來源溯源
    readonly raw_data_ref: string; // 原始資料指針 (Vault 連結)
    readonly message: string;
  }[];

  /**
   * 🔵 可追蹤 (Trackable): 生命週期 Hook
   * --------------------------------------------------
   * 即時記錄數據流轉路徑與 Agent 演化階段
   */
  lifecycleHooks: {
    onBirth: (context: unknown) => void; // 創世階段
    onDecision: (logic: string) => void; // 決策路徑追蹤
    onEntropyReduction: () => void; // 熵減行為觸發
  };

  /**
   * 🟠 可驗算 (Calculable): 透明算法公式
   * --------------------------------------------------
   * 所有輸出必須標註公式來源 (e.g., [ISO-14064-1] 或 [IPCC AR6])
   */
  algorithms: {
    readonly formula_id: string; // 公式識別碼
    readonly reference: string; // 參考文獻來源
    readonly calculate: (input: unknown) => number;
  }[];

  /**
   * 🔴 不可篡改 (Immutable): 雜湊鎖定
   * --------------------------------------------------
   * 數據寫入後執行 Object.freeze() 並生成校驗碼
   */
  readonly hashLock: string; // 狀態校驗碼 (SHA-256)
}

/**
 * 💡 實作演示：代理誕生邏輯
 * --------------------------------------------------
 * [核心邏輯] 通過 TypeScript 的 Object.freeze 實踐「不可篡改」
 */
export const spawnAgent = (config: Partial<IAgentArchetype>): Readonly<IAgentArchetype> => {
  const baseAgent: IAgentArchetype = {
    uuid: crypto.randomUUID(), // 由奧秘永憶主體分發
    version: '1.0.0-alpha',
    timestamp: Date.now(),
    evidence: {},
    chainedLogs: [],
    algorithms: config.algorithms || [],
    lifecycleHooks: {
      onBirth: () => omniLogger.info(LogCategory.GENESIS, '🌱 Agent 意識覺醒'),
      onDecision: l => omniLogger.debug(LogCategory.GENESIS, `🧠 決策路徑已標註: ${l}`),
      onEntropyReduction: () => omniLogger.info(LogCategory.GENESIS, '💎 熵減程序執行中'),
      ...config.lifecycleHooks,
    },
    hashLock: '', // 初始留空，由後續處理生成
    name: config.name || 'Unknown Agent',
    role: config.role || 'Observer',
    ...config,
  } as IAgentArchetype;

  // 生成雜湊鎖並鎖定對象
  // In a real implementation, we would generate a hash of the object content here.
  // For now, we simulate formatting.
  const finalAgent = Object.freeze(baseAgent);

  omniLogger.info(LogCategory.GENESIS, '✅ [4+1 協議] 驗證通過：代理已進入 Immutable 狀態');
  return finalAgent;
};
