// Core Principles for OmniAgent (通原則核心)
export enum Principle {
  Truth = 'Truth', // 溯源鏈格
  Goodness = 'Goodness', // 零幻覺演算
  Beauty = 'Beauty', // 液態 UI 魂刻
  Trust = 'Trust', // 永續熵減
}

export interface PrincipleInfo {
  description: string;
  impact?: number;
}

export const Principles: Record<Principle, PrincipleInfo> = {
  [Principle.Truth]: {
    description: '確保每筆資料不可篡改，使用 Hash Lock 與原始碼鎖定',
    impact: 10,
  },
  [Principle.Goodness]: {
    description: '公開透明演算，標註 ISO 與公式來源，消除 AI 幻覺',
    impact: 8,
  },
  [Principle.Beauty]: {
    description: '液態玻璃 UI 以視覺回饋呈現數據健康度，提升可用性',
    impact: 6,
  },
  [Principle.Trust]: {
    description: '週期性自動修復與 Refactoring，降低熵值，保證系統永續',
    impact: 9,
  },
};

/**
 * 取得某原則的描述
 */
export function getPrincipleDescription(p: Principle): string {
  return Principles[p].description;
}

/**
 * 匹配 URN 或比例 0-1 的值，若超出則返回 null
 */
export function clampFactor(value: number): number | null {
  if (value < 0 || value > 1) return null;
  return value;
}

/**
 * 檢查是否所有必備部件已實作
 */
export function validateCorePresence(core: unknown): core is { uuid: string; hash_lock: string } {
  return (core as any)?.uuid !== undefined && (core as any)?.hash_lock !== undefined;
}

export default { Principle, Principles, getPrincipleDescription, clampFactor, validateCorePresence };
