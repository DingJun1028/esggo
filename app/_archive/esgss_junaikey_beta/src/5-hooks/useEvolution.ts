/**
 * 自適應演化 Hook
 *
 * 基於奧秘元件定義報告 V1.2 - 自我成長機制
 */

import { useState, useEffect, useTransition } from 'react';
import { EvolutionEngine } from '../ai/EvolutionEngine';

interface EvolutionState {
  hotActions: string[];
  isPending: boolean;
  recommendations: string[];
}

/**
 * 自適應演化 Hook
 *
 * 自動追蹤組件交互,提供熱度排名與優化建議
 */
export function useEvolution(componentId: string): EvolutionState {
  const [hotActions, setHotActions] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // 低優先級更新 (React 18 Concurrent)
    startTransition(() => {
      // 獲取熱度排名
      const actions = EvolutionEngine.getHotActions(componentId, 5);
      setHotActions(actions);

      // 生成優化建議
      const suggestions = generateRecommendations(actions);
      setRecommendations(suggestions);
    });
  }, [componentId]);

  return {
    hotActions,
    isPending,
    recommendations,
  };
}

/**
 * 生成優化建議
 */
function generateRecommendations(hotActions: string[]): string[] {
  const recommendations: string[] = [];

  if (hotActions.length > 0) {
    recommendations.push(`High-frequency action: ${hotActions[0]}`);
  }

  if (hotActions.includes('onAiAnalyze')) {
    recommendations.push('Consider pre-loading AI insights');
  }

  return recommendations;
}
