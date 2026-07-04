// ═══════════════════════════════════════════════════════════════
// POST /api/esg/skills/:taskType - 執行指定 ESG 技能
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getSkill } from '@/core/ai/skills/registry';
import { inferTaskType, routeModel, type SkillContext } from '@/core/ai/model-router';

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
      return NextResponse.json(
        { success: false, error: `Unknown task type: ${taskType}` },
        { status: 404 }
      );
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
      return NextResponse.json(
        { success: false, error: 'Invalid input: company or data required' },
        { status: 400 }
      );
    }

    // 4. 生成提示詞
    const systemPrompt = skill.systemPrompt(ctx);
    const userPrompt = skill.userPrompt(ctx);

    // 5. 獲取最佳模型路由
    const routing = routeModel(taskType);

    return NextResponse.json({
      success: true,
      data: {
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
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to execute skill' },
      { status: 500 }
    );
  }
}
