import { InfoNodeAttrs } from '../types';

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

/**
 * 🌿 碳資產演化邏輯 (Carbon Asset Evolution Logic)
 * --------------------------------------------------
 * 此邏輯引擎負責將「原始排放數據 (Raw Emission Data)」
 * 通過 ISO-14064 標準公式（模擬），演化為具備價值的「碳信用資產 (Carbon Credit Asset)」。
 *
 * [功能]
 * 1. 驗證輸入數據的完整性 (Tangible Check)。
 * 2. 計算碳排放量 (CO2e)。
 * 3. 評估碳資產價值等級 (Gold/Platinum)。
 */
export const CarbonEvolutionLogic = async (attrs: InfoNodeAttrs): Promise<InfoNodeAttrs> => {
  omniLogger.info(LogCategory.SYSTEM, '[CarbonEvolutionLogic]    🏭 [Omni-Logic] 啟動碳資產演化程序...');

  // 1. 提取原始數據
  const rawData = attrs.data as { type: string; amount: number; unit: string };

  // 防呆檢查
  if (!rawData || !rawData.amount) {
    throw new Error('❌ [演化失敗] 原始數據缺失，無法計算。');
  }

  // 2. 演化計算 (模擬 ISO-14064 係數)
  // 假設係數: 1度電 = 0.5 kg CO2e
  const emissionFactor = 0.5;
  const calculatedEmission = rawData.amount * emissionFactor;

  omniLogger.info(LogCategory.SYSTEM, '[CarbonEvolutionLogic] Info', { data: `      - 輸入: ${rawData.amount} ${rawData.unit}` });
  omniLogger.info(LogCategory.SYSTEM, '[CarbonEvolutionLogic] Info', { data: `      - 係數: ${emissionFactor}` });
  omniLogger.info(LogCategory.SYSTEM, '[CarbonEvolutionLogic] Info', { data: `      - 結果: ${calculatedEmission} kg CO2e` });

  // 3. 價值判斷 (Reasoning)
  let grade = 'STANDARD';
  if (calculatedEmission < 1000) {
    grade = 'PLATINUM'; // 低排放，高價值
  } else if (calculatedEmission < 5000) {
    grade = 'GOLD';
  }

  // 4. 返回演化後的新屬性
  return {
    ...attrs, // 保留原始屬性
    type: 'CarbonCredit',
    assetValue: {
      amount: calculatedEmission,
      unit: 'kgCO2e',
      grade,
      certifiedBy: 'Omni-Carbon-Engine-v1',
    },
    description: `已轉化為 ${grade} 級碳資產，總量 ${calculatedEmission} kgCO2e`,
    evolutionTimestamp: Date.now(),
  };
};
