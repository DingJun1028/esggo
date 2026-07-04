// ═══════════════════════════════════════════════════════════════
// POST /api/esg/best-practices - 查詢 MECE 最佳實踐
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import {
  getAllPractices,
  getPracticesByPillar,
  getPracticesByCategory,
  getPracticesByLevel,
  validateMECECompleteness,
  validateMECEExclusivity,
} from '@/core/ai/skills/registry';
import type { ESGPillar, PracticeLevel } from '@/core/ai/skills/registry';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pillar, category, level, validate } = body;

    // MECE 驗證模式
    if (validate === 'completeness') {
      const result = validateMECECompleteness();
      return NextResponse.json({ success: true, data: result });
    }

    if (validate === 'exclusivity') {
      const result = validateMECEExclusivity();
      return NextResponse.json({ success: true, data: result });
    }

    if (validate === 'full') {
      const completeness = validateMECECompleteness();
      const exclusivity = validateMECEExclusivity();
      return NextResponse.json({
        success: true,
        data: {
          completeness,
          exclusivity,
          isValid: completeness.isComplete && exclusivity.isExclusive,
        },
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

    return NextResponse.json({
      success: true,
      data: { practices, stats },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to query best practices' },
      { status: 500 }
    );
  }
}
