// ============================================================
// Tag Pair API — 萬能標籤配對（含本地 Gemma 4 autoPair）
// app/api/tags/pair/route.ts
// ============================================================
import { NextRequest } from 'next/server';
import { jsonResponse, jsonError } from '@/lib/api-utils';
import { createOmniTagPair, autoPair } from '@/core/tags/universal-tag-service';

// POST /api/tags/pair
//  body: { mode: 'omni', anchorLabel, evidenceLabel?, entityType, entityId, omniType? }
//    或 { mode: 'auto', entityType, entityId, content, prompt? }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body?.mode === 'omni') {
      const { anchorLabel, evidenceLabel, entityType, entityId, omniType } = body;
      if (!anchorLabel || !entityType || !entityId) {
        return jsonError('INVALID_PARAMS', 'anchorLabel, entityType, entityId required', 400);
      }
      const result = await createOmniTagPair({ anchorLabel, evidenceLabel, entityType, entityId, omniType });
      return jsonResponse(result, 201);
    }

    if (body?.mode === 'auto') {
      const { entityType, entityId, content, prompt } = body;
      if (!entityType || !entityId || !content) {
        return jsonError('INVALID_PARAMS', 'entityType, entityId, content required', 400);
      }
      const result = await autoPair({ entityType, entityId, content, prompt });
      return jsonResponse(result, 200);
    }

    return jsonError('INVALID_PARAMS', 'mode must be "omni" or "auto"', 400);
  } catch (e) {
    console.error('[tag-pair] POST error:', e);
    return jsonError('INTERNAL_ERROR', 'Failed to create tag pair', 500);
  }
}
