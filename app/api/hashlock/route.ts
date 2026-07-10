/**
 * POST /api/hashlock — HashLock 生成與驗證 API
 */

import { NextRequest } from 'next/server';
import { jsonResponse, jsonError } from '@/lib/api-utils';
import { FiveTHashLock } from '@/lib/five-t-protocol';

export const dynamic = 'force-dynamic';

// ── Types ─────────────────────────────────────────────────────

interface GenerateBody {
  action: 'generate';
  data: string;
  salt?: string;
}

interface VerifyBody {
  action: 'verify';
  data: string;
  salt: string;
  hashLock: string;
}

interface VerifyTrinityBody {
  action: 'verifyTrinity';
  data: string;
  salt: string;
  hashLock: string;
}

type HashLockBody = GenerateBody | VerifyBody | VerifyTrinityBody;

// ── POST Handler ──────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as HashLockBody;

    if (!body?.action) {
      return jsonError('INVALID_PARAMS', 'Missing required param: action', 400);
    }

    switch (body.action) {
      case 'generate': {
        const { data, salt } = body;
        if (!data) {
          return jsonError('INVALID_PARAMS', 'Missing required param: data', 400);
        }

        const ts = Date.now();
        const hashLock = FiveTHashLock.generate(data, salt || '', ts);
        return jsonResponse({
          hashLock,
          timestamp: ts,
        });
      }

      case 'verify': {
        const { data, salt, hashLock } = body;
        if (!data || !salt || !hashLock) {
          return jsonError('INVALID_PARAMS', 'Missing required params: data, salt, hashLock', 400);
        }

        const valid = FiveTHashLock.verify(data, salt, hashLock);
        return jsonResponse({
          valid,
          hashLock,
        });
      }

      case 'verifyTrinity': {
        const { data, salt, hashLock } = body;
        if (!data || !salt || !hashLock) {
          return jsonError('INVALID_PARAMS', 'Missing required params: data, salt, hashLock', 400);
        }

        const valid = FiveTHashLock.verifyTrinity(data, salt, hashLock);
        return jsonResponse({
          valid,
          hashLock,
          type: 'trinity',
        });
      }

      default:
        return jsonError('INVALID_PARAMS', `Unknown action: ${(body as { action: string }).action}`, 400);
    }
  } catch (error) {
    return jsonError('INTERNAL_ERROR', (error as Error).message);
  }
}

// ── GET Handler ───────────────────────────────────────────────

export async function GET() {
  return jsonResponse({
    service: 'HashLock Service',
    version: '1.0.0',
    actions: ['generate', 'verify', 'verifyTrinity'],
  });
}
