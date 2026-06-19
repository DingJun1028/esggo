import { NextRequest, NextResponse } from 'next/server';
import { buildComponent, engraveToSingleTable, verifyRecord, flattenToRecord } from '@/lib/vault-omni';

/**
 * POST /api/vault-omni/engrave
 * 聖碑刻印：執行 5T 封印並寫入 Single Table。
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      formula,
      impactMetric,
      sourceOrigin,
      uuid,
      version,
      evidenceData
    } = body;

    if (!formula || !sourceOrigin) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: formula, sourceOrigin' },
        { status: 400 }
      );
    }

    // 1. 建立萬能元件心核 (SSOT)
    const component = buildComponent({
      uuid,
      formula,
      impactMetric,
      sourceOrigin,
      version,
      evidenceData
    });

    // 2. 執行聖碑刻印 (Engrave)
    const result = await engraveToSingleTable(component);

    // 3. 即時誠信校驗 (T4)
    const verification = await verifyRecord(component.uuid);

    return NextResponse.json({
      success: true,
      data: {
        uuid: component.uuid,
        hash_lock: component.hash_lock,
        dimension: 'CORE',
        timestamp: component.timestamp,
        version: component.version,
        verification: {
          is_valid: verification,
          method: 'SHA256_LOCAL'
        },
        vault_result: result,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
