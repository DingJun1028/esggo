/**
 * POST /api/omni-core/initialize
 *
 * 執行 OmniCore 昂貴初始化。
 * 建議由前端明確觸發，不要在首屏靜默呼叫。
 */

import { NextRequest } from 'next/server';
import { initializeOmniCore } from '@/lib/omni-core';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(): Promise<Response> {
  try {
    const status = await initializeOmniCore();
    return Response.json({ success: true, data: status }, { status: 200 });
  } catch (error) {
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : '初始化 OmniCore 失敗' },
      { status: 500 }
    );
  }
}
