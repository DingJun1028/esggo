/**
 * GET /api/omni-core/status
 *
 * 回傳 OmniCore 單例狀態，不執行昂貴初始化。
 */

import { getOmniCoreStatus } from '@/lib/omni-core';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(): Promise<Response> {
  try {
    const status = await getOmniCoreStatus();
    return Response.json({ success: true, data: status }, { status: 200 });
  } catch (error) {
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : '取得 OmniCore 狀態失敗' },
      { status: 500 }
    );
  }
}
