// ═══════════════════════════════════════════════════════════════
// POST /api/esg/skills/:taskType - 執行指定 ESG 技能
// ═══════════════════════════════════════════════════════════════

import { NextRequest } from 'next/server';
import { getSkill } from '@/core/ai/skills/registry';
import type { SkillContext } from '@/core/ai/skills/registry';
import { routeModel } from '@/core/ai/model-router';
import { jsonResponse, jsonError } from '@/lib/api-utils';

interface RouteContext {
  params: Promise<{ taskType: string }>;
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { taskType } = await params;
    const body = await request.json();

    // 1. 獲取技能
    const skill = getSkill(taskType);
    if (!skill) {
      return jsonError('SKILL_NOT_FOUND', `Unknown task type: ${taskType}`);
    }

    // 2. 建立上下文
    const ctx: SkillContext = {
      company: body.company,
      year: body.year,
      language: body.language || 'zh-TW',
      data: body.data,
    };

    // 3. 驗證輸入
    if (!skill.validate(ctx)) {
      return jsonError('INVALID_PARAMS', 'Invalid input: company or data required');
    }

    // 4. 生成提示詞
    const systemPrompt = skill.systemPrompt(ctx);
    const userPrompt = skill.userPrompt(ctx);

    // 5. 獲取最佳模型路由
    const routing = routeModel(taskType);

    return jsonResponse({
      skillId: skill.id,
      skillName: skill.name,
      taskType,
      routing: {
        primary: `${routing.primary.provider}/${routing.primary.model}`,
        fallback1: `${routing.fallback1.provider}/${routing.fallback1.model}`,
        fallback2: `${routing.fallback2.provider}/${routing.fallback2.model}`,
        strategy: routing.strategy,
      },
      prompts: {
        system: systemPrompt,
        user: userPrompt,
      },
      context: ctx,
    });
  } catch {
    return jsonError('INTERNAL_ERROR', 'Failed to execute skill');
  }
}
