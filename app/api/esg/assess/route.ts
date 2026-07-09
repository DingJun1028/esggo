// ═══════════════════════════════════════════════════════════════
// POST /api/esg/assess - ESG 評估並計算分數
//
// 最佳實踐: 使用 @esggo/errors 統一錯誤回應
// ═══════════════════════════════════════════════════════════════

import { NextRequest } from 'next/server';
import {
  getAllPractices,
  calculateOverallScore,
} from '@/core/ai/skills/registry';
import type { PracticeAssessment } from '@/core/ai/skills/registry';
import { jsonResponse, jsonError, validateParams } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, assessments } = body;

    // Validate required fields using unified validator
    const paramValidation = validateParams({ company });
    if (!paramValidation.valid) {
      return jsonError('INVALID_PARAMS', `缺少必要參數: ${paramValidation.missing}`);
    }

    // 如果沒有提供評估，使用預設模板
    const allPractices = getAllPractices();
    const assessmentList: PracticeAssessment[] = assessments || allPractices.map(p => ({
      practiceId: p.id,
      status: 'not_started' as const,
      score: 0,
      evidence: [],
      gaps: [`${p.name} 尚未實施`],
      recommendations: [`開始實施 ${p.name}`],
    }));

    // 計算總體評分
    const result = calculateOverallScore(assessmentList);

    // 產生改善計畫
    const actionPlan = allPractices
      .filter(practice => {
        const assessment = assessmentList.find(a => a.practiceId === practice.id);
        return !assessment || assessment.score < 80;
      })
      .slice(0, 10) // 取前 10 項最需改善的
      .map(practice => ({
        practiceId: practice.id,
        name: practice.name,
        pillar: practice.pillar,
        level: practice.level,
        priority: practice.level === 'basic' ? 'high' : practice.level === 'intermediate' ? 'medium' : 'low',
      }));

    return jsonResponse({
      company,
      overallScore: result.totalScore,
      pillarScores: result.pillarScores,
      levelBreakdown: result.levelBreakdown,
      recommendations: result.recommendations,
      actionPlan,
      totalPractices: allPractices.length,
      assessedPractices: assessmentList.length,
    });
  } catch {
    return jsonError('INTERNAL_ERROR', 'ESG 評估失敗');
  }
}
