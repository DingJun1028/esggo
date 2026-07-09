// ═══════════════════════════════════════════════════════════════
// POST /api/esg/best-practices - 查詢 MECE 最佳實踐
// ═══════════════════════════════════════════════════════════════

import { NextRequest } from 'next/server';
import {
  getAllPractices,
  getPracticesByPillar,
  validateMECECompleteness,
  validateMECEExclusivity,
} from '@/core/ai/skills/registry';
import type { ESGPillar, PracticeLevel } from '@/core/ai/skills/registry';
import { jsonResponse, jsonError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pillar, category, level, validate } = body;

    // MECE 驗證模式
    if (validate === 'completeness') {
      const result = validateMECECompleteness();
      return jsonResponse(result);
    }

    if (validate === 'exclusivity') {
      const result = validateMECEExclusivity();
      return jsonResponse(result);
    }

    if (validate === 'full') {
      const completeness = validateMECECompleteness();
      const exclusivity = validateMECEExclusivity();
      return jsonResponse({
        completeness,
        exclusivity,
        isValid: completeness.isComplete && exclusivity.isExclusive,
      });
    }

    // 查詢模式
    let practices = getAllPractices();

    if (pillar) {
      practices = getPracticesByPillar(pillar as ESGPillar);
    }

    if (category) {
      practices = practices.filter(p => p.category === category);
    }

    if (level) {
      practices = practices.filter(p => p.level === level as PracticeLevel);
    }

    // 統計
    const stats = {
      total: practices.length,
      byPillar: {
        E: practices.filter(p => p.pillar === 'E').length,
        S: practices.filter(p => p.pillar === 'S').length,
        G: practices.filter(p => p.pillar === 'G').length,
      },
      byLevel: {
        basic: practices.filter(p => p.level === 'basic').length,
        intermediate: practices.filter(p => p.level === 'intermediate').length,
        advanced: practices.filter(p => p.level === 'advanced').length,
      },
    };

    return jsonResponse({ practices, stats });
  } catch {
    return jsonError('INTERNAL_ERROR', 'Failed to query best practices');
  }
}
