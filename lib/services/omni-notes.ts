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

/**
 * Server Action: 同步「知識/研究」筆記到 Capacities 知識庫
 * @param type 筆記類型 ('knowledge' | 'research')
 * @param content 筆記內容
 */
export async function syncKnowledgeAction(type: 'knowledge' | 'research', content: string) {
    try {
        console.log(`[Server Action] Syncing ${type} to Capacities: ${content}`);
        // Implementation for Capacities API call goes here
        return { success: true };
    } catch (error) {
        console.error('[Server Action] syncKnowledgeAction failed:', error);
        throw new Error('Failed to sync knowledge to Capacities.');
    }
}
