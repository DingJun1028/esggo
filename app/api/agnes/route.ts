import { agnesApi } from '@/lib/agnes-api';
import { jsonResponse, jsonError } from '@/lib/api-utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { input, context } = body;

    if (!input) {
      return jsonError('INVALID_PARAMS', '缺少必要參數: input');
    }

    const result = await agnesApi.processRequest(input, context);

    return jsonResponse(result);
  } catch (error) {
    console.error('[AGNES_API] Error processing request:', error);
    return jsonError('INTERNAL_ERROR', (error as Error).message);
  }
}

export async function GET() {
  try {
    const metrics = await agnesApi.getMetrics();
    return jsonResponse(metrics);
  } catch (error) {
    return jsonError('INTERNAL_ERROR', (error as Error).message);
  }
}
