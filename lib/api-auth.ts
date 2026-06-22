import { NextRequest, NextResponse } from 'next/server';

/**
 * Validates the API key from the request headers.
 * Expected Header: x-api-key
 *
 * Returns an error NextResponse if invalid, or null if valid.
 */
export function validateApiKey(request: NextRequest): NextResponse | null {
  // In a real production system, this could be validated against a database of issued keys.
  // For the initial ESGGO_API, we check against an environment variable.
  const expectedApiKey = process.env.ESGGO_EXTERNAL_API_KEY || 'esggo_dev_api_key_2026';

  const providedKey = request.headers.get('x-api-key');

  if (!providedKey) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Missing x-api-key header' },
      { status: 401 }
    );
  }

  if (providedKey !== expectedApiKey) {
    return NextResponse.json({ error: 'Forbidden', message: 'Invalid API key' }, { status: 403 });
  }

  return null;
}
