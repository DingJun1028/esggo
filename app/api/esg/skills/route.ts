// ═══════════════════════════════════════════════════════════════
// POST /api/esg/skills - 列出所有可用 ESG 技能
// ═══════════════════════════════════════════════════════════════

import { jsonResponse, jsonError } from '@/lib/api-utils';
import { getAllSkills } from '@/core/ai/skills/registry';

export async function POST() {
  try {
    const skills = getAllSkills().map(skill => skill.getInfo());

    return jsonResponse({
      skills,
      total: skills.length,
      pillars: {
        E: skills.filter(s => s.taskType.includes('carbon') || s.taskType.includes('tcfd') || s.taskType.includes('sdg')).length,
        S: skills.filter(s => s.taskType.includes('stakeholder') || s.taskType.includes('compliance')).length,
        G: skills.filter(s => s.taskType.includes('gri') || s.taskType.includes('materiality')).length,
      },
    });
  } catch {
    return jsonError('INTERNAL_ERROR', 'Failed to list skills');
  }
}
