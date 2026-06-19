import { InfoNodeAttrs } from '../types';

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

/**
 * 📉 落差分析演化邏輯 (Gap Analysis Evolution Logic)
 * --------------------------------------------------
 * 此邏輯引擎負責分析「績效指標 (KPIs)」與「目標 (Targets)」之間的落差，
 * 並演化出具體的「策略行動建議 (Strategic Initiative)」。
 *
 * [功能]
 * 1. 計算達成率 (Achievement Rate)。
 * 2. 識別關鍵落差 (Critical Gap)。
 * 3. 生成策略建議 (Strategy Generation)。
 */
export const GapEvolutionLogic = async (attrs: InfoNodeAttrs): Promise<InfoNodeAttrs> => {
  omniLogger.info(LogCategory.SYSTEM, '[GapEvolutionLogic]    📉 [Omni-Logic] 啟動落差分析演化程序...');

  // 1. 提取原始數據
  const rawData = attrs.data as { kpi: string; actual: number; target: number };

  if (!rawData || typeof rawData.actual !== 'number') {
    throw new Error('❌ [演化失敗] KPI 數據不完整。');
  }

  // 2. 落差計算
  const gap = rawData.target - rawData.actual;
  const achievementRate = (rawData.actual / rawData.target) * 100;

  omniLogger.info(LogCategory.SYSTEM, '[GapEvolutionLogic] Info', { data: `      - 指標: ${rawData.kpi}` });
  omniLogger.info(LogCategory.SYSTEM, '[GapEvolutionLogic] Info', { data: `      - 落差: ${gap} (達成率: ${achievementRate.toFixed(1)}%)` });

  // 3. 策略生成 (Reasoning)
  let strategy = '';
  let priority = 'LOW';

  if (achievementRate < 50) {
    priority = 'CRITICAL';
    strategy = '立即啟動緊急應變小組 (Emergency Response Team)';
  } else if (achievementRate < 80) {
    priority = 'HIGH';
    strategy = '優化流程並增加資源投入 (Process Optimization)';
  } else {
    priority = 'NORMAL';
    strategy = '維持現有運營並監控 (Sustain & Monitor)';
  }

  // 4. 返回演化後的新屬性 (成為一個 "Strategy" 元素)
  return {
    ...attrs,
    type: 'StrategicInitiative',
    strategyContent: {
      gap,
      priority,
      suggestedAction: strategy,
      generatedBy: 'Omni-Gap-Engine-v1',
    },
    description: `[${priority}] 針對 ${rawData.kpi} 的策略建議: ${strategy}`,
    evolutionTimestamp: Date.now(),
  };
};
