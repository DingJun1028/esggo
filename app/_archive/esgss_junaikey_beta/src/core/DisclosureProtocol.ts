/**
 * 💡 奧秘核心：揭示皆是 (Disclosure Protocol)
 * --------------------------------------------------
 * [核心哲學] 隱藏即熵增，揭示即真理。
 * [執行標準] 強制執行 5T Sentinel 驗證，確保每一行輸出皆有據可查。
 */

import type { IComponentCore } from '../types/core/index.ts';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.ts';

export const discloseTruth = <T>(data: T, component: IComponentCore): T => {
  const { evidence } = component;

  // 1. [T1, T2, T5] 若證據不全，拒絕「存在」
  if (!evidence.traceable?.source_origin || !evidence.trustworthy?.hash_lock || (evidence.trackable?.lifecycle_hooks?.length || 0) === 0) {
    const errorMsg = '🚫 違反 5T 哨兵協議：數據缺乏溯源、蹤跡或信實鎖定。';
    omniLogger.error(LogCategory.SYSTEM, errorMsg, { evidence });
    throw new Error(errorMsg);
  }

  // 2. [T3] 可驗算揭示 (Log the revelation for Transparency)
  omniLogger.info(LogCategory.SYSTEM, `[5T 揭示聖典] 狀態: 已揭示 (Revealed)`, {
    uuid: component.uuid,
    source: evidence.traceable?.source_origin,
    formula: evidence.transparent?.formula,
    timestamp: component.timestamp,
  });

  // 3. [T5] Trustworthy: 透過 Object.freeze 達成「皆是」的永恆狀態
  return Object.freeze(data);
};
