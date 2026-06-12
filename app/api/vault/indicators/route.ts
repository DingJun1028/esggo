import { NextRequest, NextResponse } from 'next/server';
import { vaultService } from '../../../../src/server/services/vault.service';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { indicatorIds } = await req.json();

    if (!Array.isArray(indicatorIds)) {
      return NextResponse.json({ error: 'indicatorIds must be an array' }, { status: 400 });
    }

    const data = await vaultService.getIndicatorsByBlueprint(indicatorIds);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Vault Indicators API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vault indicators', details: error.message },
      { status: 500 }
    );
  }
}
