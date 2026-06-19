import { NextResponse } from 'next/server';
import { GLOBAL_ARTIFACTS } from '@/lib/agent/store';

export async function GET() {
  return NextResponse.json({ 
    artifacts: GLOBAL_ARTIFACTS, 
    total: GLOBAL_ARTIFACTS.length, 
    ok: true 
  });
}
