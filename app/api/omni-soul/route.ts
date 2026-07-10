// ═══════════════════════════════════════════════════════════════
// POST /api/omni-soul — OmniSoul 系統端點
// ═══════════════════════════════════════════════════════════════

import { jsonResponse, jsonError } from '@/lib/api-utils';
import { createOmniSoul, getOmniSoul } from '@/agents/omni-soul';
import { initSoul } from '@/agents/omni-soul-auto-seed';

export const dynamic = 'force-dynamic';

// ── Types ──────────────────────────────────────────────────

interface SoulOption {
  id: string;
  description: string;
}

interface SoulDecideContext {
  intent: string;
  options: SoulOption[];
}

interface AwakenAction {
  action: 'awaken';
  targetState: string;
}

interface DecideAction {
  action: 'decide';
  intent: string;
  options: SoulOption[];
}

interface ReflectAction {
  action: 'reflect';
}

interface ParseIntentAction {
  action: 'parseIntent';
  intent: string;
}

type SoulAction = AwakenAction | DecideAction | ReflectAction | ParseIntentAction;

// ── GET Handler ─────────────────────────────────────────────
export async function GET() {
  try {
    let soul = getOmniSoul();

    if (!soul) {
      await initSoul();
      soul = createOmniSoul();
    }

    const state = soul.getState();

    return jsonResponse({
      name: state.name,
      state: state.state,
      alignment: state.alignment,
      recentDecisions: state.recentDecisions?.length ?? 0,
    });
  } catch (error) {
    return jsonError('INTERNAL_ERROR', (error as Error).message);
  }
}

// ── POST Handler ────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SoulAction;

    if (!body?.action) {
      return jsonError('INVALID_PARAMS', 'Missing required param: action', 400);
    }

    let soul = getOmniSoul();
    if (!soul) {
      await initSoul();
      soul = createOmniSoul();
    }

    switch (body.action) {
      case 'awaken': {
        const { targetState } = body;
        if (!targetState) {
          return jsonError('INVALID_PARAMS', 'Missing required param: targetState', 400);
        }
        await soul.awaken(targetState);
        return jsonResponse({ status: 'awakened', state: soul.getState() });
      }

      case 'decide': {
        const { intent, options } = body;
        if (!intent || !options?.length) {
          return jsonError('INVALID_PARAMS', 'Missing required params: intent, options', 400);
        }
        const context: SoulDecideContext = { intent, options };
        const decision = await soul.decide(context);
        return jsonResponse({ decision, state: soul.getState() });
      }

      case 'reflect': {
        const reflection = await soul.reflect();
        return jsonResponse({ reflection, state: soul.getState() });
      }

      case 'parseIntent': {
        const { intent } = body;
        if (!intent) {
          return jsonError('INVALID_PARAMS', 'Missing required param: intent', 400);
        }
        const parsed = await soul.parseIntent(intent);
        return jsonResponse({ parsed });
      }

      default:
        return jsonError('INVALID_PARAMS', `Unknown action: ${(body as { action: string }).action}`, 400);
    }
  } catch (error) {
    return jsonError('INTERNAL_ERROR', (error as Error).message);
  }
}
