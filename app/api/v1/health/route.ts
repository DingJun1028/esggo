import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  // Check API Key
  const authError = validateApiKey(request);
  if (authError) return authError;

  return NextResponse.json({
    success: true,
    status: 'HEALTHY',
    service: 'ESGGO_API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
}
