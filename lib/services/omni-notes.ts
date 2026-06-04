'use server';

import { syncTaskToOmniTable } from '@/lib/services/omni-notes.service';

/**
 * Server Action: 同步「任務」筆記到 OmniTable
 * @param taskContent 筆記內容
 */
export async function syncTaskAction(taskContent: string) {
    try {
        await syncTaskToOmniTable(taskContent);
    } catch (error) {
        console.error('[Server Action] syncTaskAction failed:', error);
        throw new Error('Failed to sync task to OmniTable.');
    }
}