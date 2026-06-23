import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-auth';
import { upsertEnvironmentalData, sealRecord } from '@/lib/db';
import { z } from 'zod';

interface ApiErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: unknown;
}

interface ApiSuccessResponse {
  success: true;
  message: string;
  integrity: {
    hashLock: string;
    status: string;
    sealedAt: string;
  };
}

const handleApiError = (error: unknown, context: string): NextResponse<ApiErrorResponse> => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[ESGGO_API] ${context}:`, error);
  return NextResponse.json(
    { success: false, error: message, code: 'INTERNAL_ERROR' },
    { status: 500 }
  );
};

const IngestSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  value: z.number({ required_error: 'Value is required' }),
  unit: z.string().optional(),
  source: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const payload = await request.json();

    const parseResult = IngestSchema.safeParse(payload);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid payload',
          code: 'VALIDATION_ERROR',
          details: parseResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { category, value, unit, source, metadata } = parseResult.data;

    const ownerId = 'system_ingestion_api';

    const ingestData = {
      category,
      value,
      unit: unit || 'unknown',
      source: source || 'external_api',
      timestamp: new Date().toISOString(),
      metadata: metadata || {},
    };

    try {
      await upsertEnvironmentalData(ingestData);
    } catch (dbError) {
      return handleApiError(dbError, 'Error upserting environmental data');
    }

    let hashLock: string;
    try {
      hashLock = await sealRecord(ingestData, ownerId);
    } catch (sealError) {
      return handleApiError(sealError, 'Error sealing record');
    }

    return NextResponse.json({
      success: true,
      message: 'Data successfully ingested and sealed.',
      integrity: {
        hashLock,
        status: 'Trustworthy',
        sealedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return handleApiError(error, 'Error during data ingestion');
  }
}


