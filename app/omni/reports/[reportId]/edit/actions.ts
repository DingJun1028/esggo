'use server';

import { validateESGData } from '@/lib/omni-reports/jules-validator';
import { ncbClient } from '@/lib/omni-reports/ncb-client';
import { revalidatePath } from 'next/cache';

/**
 * Server Action: 零幻覺守門員 (Gatekeeper)
 * 任何繞過前端的請求都會在寫入 NCB 前被 9式果因引擎強制攔截。
 */
export async function saveReport(payload: unknown) {
  const result = validateESGData(payload);

  if (!result.success) {
    return {
      success: false,
      status: 'rejected',
      message: result.message,
      errors: result.errors,
    };
  }

  const purified = result.data as Record<string, unknown>;
  try {
    // 寫入前強制壓上 Hash Lock (不可篡改禁區)
    await ncbClient.insertDocument('omni_reports_content', purified);
    revalidatePath('/omni/reports');
    return {
      success: true,
      status: 'saved',
      message: '果因引擎驗算通過！數據與證據鏈已安全寫入 NCB 核心。',
      data: purified,
    };
  } catch (error) {
    return {
      success: false,
      status: 'error',
      message: `資料庫連結異常: ${(error as Error).message}`,
    };
  }
}
