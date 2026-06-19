import { NextResponse } from 'next/server';
import { omniAgentBus } from '@/lib/agents/omni-agent-bus';

/**
 * GET /api/system/bus-health
 * Returns OmniAgentBus health status, skill metrics, and event statistics.
 */
export async function GET() {
  try {
    const health = omniAgentBus.getHealth();
    const skills = omniAgentBus.listSkills().map((skill) => {
      const metrics = omniAgentBus.getSkillMetrics(skill.id);
      return {
        id: skill.id,
        name: skill.name,
        trigger: skill.trigger,
        autonomy: skill.autonomy || false,
        metrics: metrics || null,
      };
    });

    return NextResponse.json({
      success: true,
      health,
      skills,
      hookCount: omniAgentBus.hookCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
