/**
 * 精準數值平衡系統
 * Precision Balance System
 *
 * 所有增幅/削減從 0.1-0.5 小幅度開始，確保系統永續發展
 */
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger';

// ============================================================================
// 數值常數定義
// ============================================================================

/**
 * 基礎增幅範圍
 */
export const AMPLIFICATION_RANGE = {
  MIN: 0.001, // 最小增幅 0.1%
  MAX: 0.005, // 最大增幅 0.5%
  STEP: 0.0001, // 步進 0.01%
} as const;

/**
 * 詞條稀有度對應增幅
 */
export const AFFIX_AMPLIFICATION = {
  common: {
    min: 0.001, // 0.1%
    max: 0.002, // 0.2%
  },
  uncommon: {
    min: 0.002, // 0.2%
    max: 0.003, // 0.3%
  },
  rare: {
    min: 0.003, // 0.3%
    max: 0.004, // 0.4%
  },
  epic: {
    min: 0.004, // 0.4%
    max: 0.005, // 0.5%
  },
  legendary: {
    min: 0.005, // 0.5%
    max: 0.008, // 0.8%
  },
  mythic: {
    min: 0.008, // 0.8%
    max: 0.01, // 1.0%
  },
} as const;

/**
 * 屬性加成上限
 */
export const ATTRIBUTE_CAP = {
  single: 0.2, // 單一屬性最大 20%
  total: 0.5, // 總屬性最大 50%
} as const;

// ============================================================================
// 精準計算函數
// ============================================================================

/**
 * 計算詞條增幅
 */
export function calculateAffixAmplification(
  rarity: keyof typeof AFFIX_AMPLIFICATION,
  level: number = 1
): number {
  const range = AFFIX_AMPLIFICATION[rarity];
  const baseValue = range.min;
  const increment = (range.max - range.min) / 10; // 10 levels

  const value = baseValue + increment * (level - 1);

  // 精確到小數點後 4 位
  return Math.round(value * 10000) / 10000;
}

/**
 * 計算裝備加成
 */
export function calculateEquipmentBonus(
  baseValue: number,
  level: number,
  rarity: keyof typeof AFFIX_AMPLIFICATION
): number {
  const rarityMultiplier = {
    common: 1.0,
    uncommon: 1.1,
    rare: 1.2,
    epic: 1.3,
    legendary: 1.5,
    mythic: 2.0,
  }[rarity];

  // 基礎值 * (1 + 等級增幅) * 稀有度倍率
  const levelBonus = level * 0.001; // 每級 0.1%
  const totalBonus = baseValue * (1 + levelBonus) * rarityMultiplier;

  return Math.round(totalBonus * 10000) / 10000;
}

/**
 * 計算技能效果
 */
export function calculateSkillEffect(
  baseEffect: number,
  skillLevel: number,
  affixes: Array<{ amplification: number }>,
  attributes: { intelligence: number; wisdom: number }
): number {
  // 1. 基礎效果
  let effect = baseEffect;

  // 2. 技能等級加成 (每級 0.2%)
  const levelBonus = skillLevel * 0.002;
  effect *= 1 + levelBonus;

  // 3. 詞條加成
  const affixBonus = affixes.reduce((sum, affix) => sum + affix.amplification, 0);
  effect *= 1 + affixBonus;

  // 4. 屬性加成 (智力 + 智慧) / 1000
  const attributeBonus = (attributes.intelligence + attributes.wisdom) / 1000;
  effect *= 1 + attributeBonus;

  // 精確到小數點後 4 位
  return Math.round(effect * 10000) / 10000;
}

/**
 * 計算總屬性加成
 */
export function calculateTotalAttributeBonus(
  bonuses: Array<{ attribute: string; value: number; type: 'flat' | 'percentage' }>
): Record<string, number> {
  const result: Record<string, number> = {};

  bonuses.forEach(bonus => {
    if (!result[bonus.attribute]) {
      result[bonus.attribute] = 0;
    }

    if (bonus.type === 'flat') {
      result[bonus.attribute] = (result[bonus.attribute] || 0) + bonus.value;
    } else {
      // percentage 轉換為小數
      result[bonus.attribute] = (result[bonus.attribute] || 0) + bonus.value / 100;
    }
  });

  // 檢查上限
  Object.keys(result).forEach(attr => {
    const val = result[attr];
    if (val !== undefined && val > ATTRIBUTE_CAP.single) {
      omniLogger.warn(
        LogCategory.FINANCE,
        `[Balance] ⚠️  屬性 ${attr} 超過上限，已限制為 ${ATTRIBUTE_CAP.single}`
      );
      result[attr] = ATTRIBUTE_CAP.single;
    }
  });

  return result;
}

/**
 * 驗證數值平衡
 */
export function validateBalance(value: number, context: string): boolean {
  if (value < 0) {
    omniLogger.error(LogCategory.FINANCE, `[Balance] ❌ ${context}: 數值不能為負數`);
    return false;
  }

  if (value > 1.0) {
    omniLogger.warn(LogCategory.FINANCE, `[Balance] ⚠️  ${context}: 數值過大 (${value})`);
    return false;
  }

  // 檢查精度
  const parts = value.toString().split('.');
  const precision = parts.length > 1 ? (parts[1]?.length ?? 0) : 0;
  if (precision > 4) {
    omniLogger.warn(LogCategory.FINANCE, `[Balance] ⚠️  ${context}: 精度過高，建議限制在 4 位小數`);
  }

  return true;
}

// ============================================================================
// 平衡報告
// ============================================================================

import {
  type AIPartner,
  type Skill,
  type Equipment,
  type SkillAffix,
  Rarity,
} from '../../shared/types';
export interface BalanceReport {
  totalAmplification: number;
  breakdown: {
    affixes: number;
    equipment: number;
    talents: number;
    attributes: number;
  };
  warnings: string[];
  isBalanced: boolean;
}

/**
 * 生成平衡報告
 */
export function generateBalanceReport(
  affixBonuses: number[],
  equipmentBonuses: number[],
  talentBonuses: number[],
  attributeBonuses: number[]
): BalanceReport {
  const breakdown = {
    affixes: affixBonuses.reduce((sum, v) => sum + v, 0),
    equipment: equipmentBonuses.reduce((sum, v) => sum + v, 0),
    talents: talentBonuses.reduce((sum, v) => sum + v, 0),
    attributes: attributeBonuses.reduce((sum, v) => sum + v, 0),
  };

  const totalAmplification = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
  const warnings: string[] = [];

  // 檢查平衡性
  if (totalAmplification > ATTRIBUTE_CAP.total) {
    warnings.push(
      `總增幅 ${(totalAmplification * 100).toFixed(2)}% 超過上限 ${ATTRIBUTE_CAP.total * 100}%`
    );
  }

  if (breakdown.affixes > 0.2) {
    warnings.push(`詞條增幅過高: ${(breakdown.affixes * 100).toFixed(2)}%`);
  }

  const isBalanced = warnings.length === 0;

  return {
    totalAmplification: Math.round(totalAmplification * 10000) / 10000,
    breakdown,
    warnings,
    isBalanced,
  };
}

// ============================================================================
// 範例使用
// ============================================================================

/**
 * 範例：計算完整技能效果
 */
export function exampleSkillCalculation() {
  omniLogger.info(LogCategory.FINANCE, '\n📊 精準數值計算範例\n');

  // 1. 詞條增幅
  const affixes = [
    { rarity: 'rare' as const, level: 3 },
    { rarity: 'epic' as const, level: 5 },
  ];

  const affixAmplifications = affixes.map(a => calculateAffixAmplification(a.rarity, a.level));

  omniLogger.info(LogCategory.FINANCE, '詞條增幅:');
  affixAmplifications.forEach((amp, i) => {
    const afx = affixes[i];
    if (afx) {
      omniLogger.info(
        LogCategory.FINANCE,
        `  ${i + 1}. ${afx.rarity} Lv.${afx.level}: ${(amp * 100).toFixed(2)}%`
      );
    }
  });

  // 2. 技能效果
  const skillEffect = calculateSkillEffect(
    100, // 基礎效果
    5, // 技能等級
    affixAmplifications.map(a => ({ amplification: a })),
    { intelligence: 50, wisdom: 60 }
  );

  omniLogger.info(LogCategory.FINANCE, `\n最終技能效果: ${skillEffect.toFixed(4)}`);

  // 3. 平衡報告
  const report = generateBalanceReport(
    affixAmplifications,
    [0.003, 0.004],
    [0.002, 0.003],
    [0.011]
  );

  omniLogger.info(LogCategory.FINANCE, '\n平衡報告:');
  omniLogger.info(
    LogCategory.FINANCE,
    `  總增幅: ${(report.totalAmplification * 100).toFixed(2)}%`
  );
  omniLogger.info(LogCategory.FINANCE, `  詞條: ${(report.breakdown.affixes * 100).toFixed(2)}%`);
  omniLogger.info(LogCategory.FINANCE, `  裝備: ${(report.breakdown.equipment * 100).toFixed(2)}%`);
  omniLogger.info(LogCategory.FINANCE, `  天賦: ${(report.breakdown.talents * 100).toFixed(2)}%`);
  omniLogger.info(
    LogCategory.FINANCE,
    `  屬性: ${(report.breakdown.attributes * 100).toFixed(2)}%`
  );
  omniLogger.info(
    LogCategory.FINANCE,
    `  平衡狀態: ${report.isBalanced ? '✅ 正常' : '⚠️  需要調整'}`
  );

  if (report.warnings.length > 0) {
    omniLogger.warn(LogCategory.SYSTEM, '\n警告:');
    report.warnings.forEach(w => omniLogger.info(LogCategory.FINANCE, `  - ${w}`));
  }
}
