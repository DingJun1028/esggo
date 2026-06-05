import { getOmniTableServerClient } from '@/lib/omni-table/client';
/**
 * 將「任務」筆記同步到 OmniTable 的專案資料表中
 * @param taskContent 任務內容
 */
export async function syncTaskToOmniTable(taskContent) {
    const datasheetId = process.env.OMNITABLE_TASKS_DATASHEET_ID;
    if (!datasheetId) {
        console.warn('[OmniNotes Service] OMNITABLE_TASKS_DATASHEET_ID is not set. Skipping sync.');
        // 在開發環境中，我們可以選擇不拋出錯誤，而是靜默失敗
        return;
    }
    try {
        const client = getOmniTableServerClient();
        await client.createRecords(datasheetId, [
            {
                fields: {
                    // 假設您的 OmniTable 表格中有 'Task Title' 和 'Status' 欄位
                    'Task Title': taskContent,
                    'Status': 'Todo', // 預設狀態
                },
            },
        ]);
    }
    catch (error) {
        console.error(`[OmniNotes Service] Failed to sync task to OmniTable (Datasheet: ${datasheetId}):`, error);
        throw error;
    }
}
//# sourceMappingURL=omni-notes.service.js.map