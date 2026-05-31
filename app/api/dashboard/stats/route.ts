import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/db';

export const runtime = 'edge';

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
