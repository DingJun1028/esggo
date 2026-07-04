// ═══════════════════════════════════════════════════════════════
// POST /api/esg/skills - 列出所有可用 ESG 技能
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { getAllSkills } from '@/core/ai/skills/registry';

export async function POST() {
  try {
    const skills = getAllSkills().map(skill => skill.getInfo());

    return NextResponse.json({
      success: true,
      data: {
        skills,
        total: skills.length,
        pillars: {
          E: skills.filter(s => s.taskType.includes('carbon') || s.taskType.includes('tcfd') || s.taskType.includes('sdg')).length,
          S: skills.filter(s => s.taskType.includes('stakeholder') || s.taskType.includes('compliance')).length,
          G: skills.filter(s => s.taskType.includes('gri') || s.taskType.includes('materiality')).length,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to list skills' },
      { status: 500 }
    );
  }
}
