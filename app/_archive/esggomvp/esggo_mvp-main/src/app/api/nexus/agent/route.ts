/**
 * 🔮 OmniNexus AI Agent REST Adapter
 * ===================================
 * Lightweight REST adapter for AI agents without MCP SDK
 * Works with any AI agent (Claude, GPT, Gemini, etc.)
 * 
 * No external dependencies required!
 */

import { NextRequest, NextResponse } from 'next/server';
import { OmniNexus } from '@/core/omni-nexus';
import { apiRateLimiter, aiChatLimiter } from '@/lib/rate-limit';

const nexus = OmniNexus.getInstance({ enableCache: true });

const TOOL_DESCRIPTIONS: Record<string, { description: string; params: Record<string, any> }> = {
  omni_manifest_asset: {
    description: 'Create a 5T-compliant ESG atom',
    params: { intent: 'string', payload: 'object' }
  },
  omni_analyze_trend: {
    description: 'Analyze ESG market trends',
    params: { prompt: 'string' }
  },
  omni_verify_carbon: {
    description: 'Verify carbon emissions (Scope 1/2/3)',
    params: { scope: '1|2|3', data: 'object' }
  },
  omni_forge_gri_report: {
    description: 'Generate GRI report',
    params: { title: 'string', indicators: 'array' }
  },
  omni_seal_5t_proof: {
    description: 'Seal 5T proof',
    params: { atomId: 'string', proof: 'string' }
  },
  omni_ask_jules: {
    description: 'Ask Google Jules AI',
    params: { prompt: 'string', context: 'object?' }
  },
  omni_sequential_thinking: {
    description: 'Sequential thinking',
    params: { thoughtNumber: 'number', totalThoughts: 'number', thought: 'string' }
  },
  omni_track_carbon: {
    description: 'Track carbon emissions',
    params: { scope: '1|2|3', value: 'number', unit: 'string' }
  },
  omni_cognitive_chat: {
    description: 'AI chat about ESG',
    params: { message: 'string', context: 'object?' }
  },
  omni_daily_gnosis: {
    description: 'Get daily ESG insight',
    params: {}
  },
  omni_governance_verify: {
    description: 'Verify data integrity',
    params: { proofId: 'string' }
  },
  omni_forge_agent: {
    description: 'Create ESG agent',
    params: { name: 'string', traits: 'array' }
  },
  omni_get_status: {
    description: 'Get system status',
    params: {}
  }
};

const OPERATION_MAP: Record<string, string> = {
  omni_manifest_asset: 'manifest_asset',
  omni_analyze_trend: 'analyze_trend',
  omni_verify_carbon: 'verify_carbon',
  omni_forge_gri_report: 'forge_gri_report',
  omni_seal_5t_proof: 'seal_5t_proof',
  omni_ask_jules: 'ask_jules',
  omni_sequential_thinking: 'sequential_thinking',
  omni_track_carbon: 'excellence.track_carbon',
  omni_cognitive_chat: 'cognitive.chat',
  omni_daily_gnosis: 'cognitive.daily_gnosis',
  omni_governance_verify: 'governance.verify_integrity',
  omni_forge_agent: 'agency.forge_agent',
  omni_get_status: 'eternal.get_status',
  trinity_awaken: 'trinity.awaken',
  trinity_status: 'trinity.status',
  trinity_passive_skills: 'trinity.passive_skills'
};

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? '127.0.0.1';

    // 1. Global API Rate Limit Check
    const globalLimit = await apiRateLimiter.limit(ip);
    if (!globalLimit.success) {
      return NextResponse.json({ error: "Rate limit exceeded (Global)" }, { status: 429 });
    }

    const body = await req.json();
    const { tool, arguments: args } = body;

    if (!tool) {
      return NextResponse.json(
        { error: "Missing 'tool' parameter. Use /api/nexus/agent?tool=omni_manifest_asset" },
        { status: 400 }
      );
    }

    // 2. AI Chat Specific Limit Check
    if (tool === 'omni_cognitive_chat' || tool === 'omni_ask_jules') {
      const chatLimit = await aiChatLimiter.limit(ip);
      if (!chatLimit.success) {
        return NextResponse.json({ error: "Rate limit exceeded (AI Chat)" }, { status: 429 });
      }
    }

    const operation = OPERATION_MAP[tool];
    if (!operation) {
      return NextResponse.json(
        {
          error: `Unknown tool: ${tool}`,
          available_tools: Object.keys(TOOL_DESCRIPTIONS)
        },
        { status: 400 }
      );
    }

    const result = await nexus.dispatch(operation, args || {});

    return NextResponse.json({
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (action === 'tools') {
    return NextResponse.json({
      tools: Object.entries(TOOL_DESCRIPTIONS).map(([name, info]) => ({
        name,
        ...info
      }))
    });
  }

  if (action === 'schema') {
    return NextResponse.json({
      schema: {
        name: 'omni-nexus',
        version: '10.1.0',
        description: 'ESG AI Agent Gateway',
        tools: TOOL_DESCRIPTIONS
      }
    });
  }

  return NextResponse.json({
    service: 'OmniNexus AI Agent Adapter',
    version: '10.1.0',
    endpoints: {
      POST: '/api/nexus/agent (tool: string, arguments: object)',
      GET: '/api/nexus/agent?action=tools | schema'
    },
    tools_count: Object.keys(TOOL_DESCRIPTIONS).length
  });
}
