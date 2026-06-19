/**
 * 💡 核心演算：ESGss 奧秘卡牌數據契約
 * --------------------------------------------------
 * [來源備註] 參考 JunAiKey 奧秘元件心核規範 v1.0
 * [零幻覺驗證] 透過 Hash Lock 確保 Vibe Coding 過程數據不位移
 */

export interface IComponentCore {
  uuid: string;
  version: string;
  timestamp: string;
}

export interface IESCardCore extends IComponentCore {
  readonly category: 'Character' | 'Location' | 'Contribution' | 'Event' | 'Persona' | 'Skill';
  readonly metadata: {
    title: string;
    subTitle: string;
    visualStyle: string; // 用於 AI 繪圖的一致性 Vibe 描述
  };
  readonly stats: {
    E: number; // 環境影響力
    S: number; // 社會貢獻度
    G: number; // 治理透明度
  };
  readonly logicGate: {
    source_origin: string; // 🟢 可溯源：原始資料路徑或 AI Prompt ID
    lifecycle_hooks: string[]; // 🔵 可追蹤：記錄此卡牌的狀態變更（如：升級、銷毀）
    formula_ref: string; // 🟠 可驗算：引用如 [ISO-14064-1] 或 [GRI-Standard]
  };
  readonly evidence?: {
    calculation_logic: string;
    verification_status: string;
  };
  readonly hash_lock: string; // 🔴 不可篡改：由內容生成的 SHA-256 碼
}
