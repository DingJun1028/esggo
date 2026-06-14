import { NextResponse } from 'next/server';
import { HealingGuardian } from '@/lib/healing-guardian';

export async function POST(req: Request) {
  try {
    const { targetId, table } = await req.json();

    if (!targetId || !table) {
      return NextResponse.json(
        { success: false, message: 'Missing targetId or table' },
        { status: 400 }
      );
    }

    console.log(`[Healing API] Triggering self-healing for: ${targetId} on table ${table}`);
    const report = await HealingGuardian.executeOmniHealing(targetId, table);

    return NextResponse.json({
      success: true,
      message: 'Healing Protocol executed successfully',
      report,
    });
  } catch (error: any) {
    console.error('[HealingGuardian API] Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
