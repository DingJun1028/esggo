'use server';

import { getOmniTableServerClient } from '@/lib/omni-table/client';
import { revalidatePath } from 'next/cache';

/**
 * 伺服器動作：刪除 OmniTable 紀錄並重新整理指定頁面
 */
export async function deleteOmniTableRecord(datasheetId: string, recordId: string, currentPath: string) {
    try {
        const client = getOmniTableServerClient();
        // 調用 SDK 的刪除方法 (陣列形式)
        await client.deleteRecords(datasheetId, [recordId]);
        // 刪除成功後，清除快取並觸發重新渲染
        revalidatePath(currentPath);
    } catch (error) {
        console.error('刪除 OmniTable 紀錄失敗:', error);
        throw new Error('無法刪除資料，請聯絡系統管理員。');
    }
}