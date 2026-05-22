import { NextRequest, NextResponse } from 'next/server';
import { buildComponent, engraveToSingleTable, verifyRecord, flattenToRecord } from '@/lib/vault-omni';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      formula,
      isoStandard,
      evidence,
      sourceOrigin,
      actorId,
      griReference,
      uuid,
      version,
    } = body;

    if (!formula || !sourceOrigin) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: formula, sourceOrigin' },
        { status: 400 }
      );
    }

    const component = buildComponent({
      uuid,
      formula,
      isoStandard,
      evidence,
      sourceOrigin,
      actorId,
      griReference,
      version,
    });

    const result = await engraveToSingleTable(component);

    // Also verify immediately after write
    const record = flattenToRecord(component, 'CORE');
    const verification = verifyRecord(record);

    return NextResponse.json({
      success: true,
      data: {
        uuid: component.identity.uuid,
        hashLock: component.identity.hashLock,
        dimension: 'CORE',
        timestamp: component.trace.timestamp,
        version: component.identity.version,
        verification,
        vaultResult: result,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}