import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-auth';
import { upsertEnvironmentalData, sealRecord } from '@/lib/db';

export async function POST(request: NextRequest) {
  // Check API Key
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const payload = await request.json();

    if (!payload || !payload.category || !payload.value) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload. Missing required fields (category, value).' },
        { status: 400 }
      );
    }

    // Identify the system/owner doing the ingest (could be derived from the API Key in a real system)
    const ownerId = 'system_ingestion_api';

    // 1. Process and save the data
    const ingestData = {
      category: payload.category,
      value: payload.value,
      unit: payload.unit || 'unknown',
      source: payload.source || 'external_api',
      timestamp: new Date().toISOString(),
      metadata: payload.metadata || {},
    };

    await upsertEnvironmentalData(ingestData);

    // 2. 5T Integrity Protocol - Seal the record
    const hashLock = await sealRecord(ingestData, ownerId);

    return NextResponse.json({
      success: true,
      message: 'Data successfully ingested and sealed.',
      integrity: {
        hashLock,
        status: 'Trustworthy',
        sealedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[ESGGO_API] Error during data ingestion:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
