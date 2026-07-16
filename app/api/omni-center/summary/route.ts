/**
 * GET /api/omni-center/summary
 *
 * 回傳 OmniCenter dashboard 需要的摘要數字。
 * 目前優先接 storage-service；若無真實來源，保留合理的 fallback。
 */

import { jsonResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(): Promise<Response> {
  try {
    const storageModule = await import('@/lib/storage-service');
    const getStorageService = storageModule.getStorageService;
    const store = getStorageService();

    let caseCount: number | null = null;
    let griIndicatorCount: number | null = null;

    if (typeof store.getAppSummary === 'function') {
      const summary = await store.getAppSummary();
      const raw = summary as Record<string, unknown>;
      caseCount =
        typeof raw.caseCount === 'number'
          ? raw.caseCount
          : typeof raw.cases === 'number'
            ? raw.cases
            : null;
      griIndicatorCount =
        typeof raw.griIndicatorCount === 'number'
          ? raw.griIndicatorCount
          : typeof raw.griCount === 'number'
            ? raw.griCount
            : null;
    }

    return jsonResponse({
      success: true,
      data: {
        caseCount: caseCount ?? 47,
        griIndicatorCount: griIndicatorCount ?? 142,
        updatedAt: Date.now(),
        fallback: caseCount == null || griIndicatorCount == null,
      },
    });
  } catch {
    return jsonResponse({
      success: true,
      data: {
        caseCount: 47,
        griIndicatorCount: 142,
        updatedAt: Date.now(),
        fallback: true,
      },
    });
  }
}
