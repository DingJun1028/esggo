import { NextResponse } from 'next/server';
import { GLOBAL_EXECUTIONS } from '@/lib/agent/store';

export async function GET() {
  return NextResponse.json({ 
    executions: GLOBAL_EXECUTIONS, 
    total: GLOBAL_EXECUTIONS.length, 
    ok: true 
  });
}
