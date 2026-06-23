import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-auth';
import { getEnvironmentalData } from '@/lib/db';

interface ApiErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: unknown;
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

const handleApiError = (error: unknown, context: string): NextResponse<ApiErrorResponse> => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[ESGGO_API] ${context}:`, error);
  return NextResponse.json(
    { success: false, error: message, code: 'INTERNAL_ERROR' },
    { status: 500 }
  );
};

export async function GET(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;

    const metrics = await getEnvironmentalData(category);

    return NextResponse.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return handleApiError(error, 'Error fetching metrics');
  }
}
