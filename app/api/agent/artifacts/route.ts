import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    artifacts: [], 
    total: 0, 
    ok: true 
  });
}
