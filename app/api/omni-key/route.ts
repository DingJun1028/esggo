// @ts-nocheck
import { NextResponse } from 'next/server';
import { createOmniKey, verifyOmniKey, listOmniKeys, revokeOmniKey } from '@/lib/omni-key';

// POST /api/omni-key/create
export async function POST_create(req: Request) {
  return createOmniKey(req);
}

// POST /api/omni-key/verify
export async function POST_verify(req: Request) {
  return verifyOmniKey(req);
}

// GET /api/omni-key/list?owner=xxx
export async function GET_list(req: Request) {
  return listOmniKeys(req);
}

// POST /api/omni-key/revoke
export async function POST_revoke(req: Request) {
  return revokeOmniKey(req);
}
