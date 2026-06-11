'use server';

import { getOmniTableServerClient } from '@/lib/omni-table/client';
import { revalidatePath } from 'next/cache';

export interface TaskRecord {
    id: string;
    title: string;
    status: 'Todo' | 'In Progress' | 'Done';
    assignee?: string;
}

export async function getOmniNotesAction(): Promise<TaskRecord[]> {
    try {
        const client = getOmniTableServerClient();
        const datasheetId = process.env.OMNITABLE_TASKS_DATASHEET_ID;
        if (!datasheetId) return [];

        const rawRecords = await (client.getRecords ? client.getRecords(datasheetId) : (client as any).listRecords(datasheetId));

        const tasks = rawRecords.map((r: any) => ({
            id: r.recordId || r.id || Math.random().toString(),
            title: r.fields['Task Title'] || '未命名任務',
            status: r.fields['Status'] || 'Todo',
            assignee: r.fields['Assignee'] || null,
        }));

        return tasks.reverse(); // 最新任務排最上
    } catch (err) {
        console.error('[OmniNotes Action] 實時連動獲取失敗:', err);
        return [];
    }
}

export async function semanticCreateTaskAction(prompt: string) {
    if (!prompt) return;

    try {
        const client = getOmniTableServerClient();
        const datasheetId = process.env.OMNITABLE_TASKS_DATASHEET_ID;
        if (!datasheetId) return;

        // 簡易語義解析邏輯 (Semantic Parsing Logic)
        let title = prompt;
        let status = 'Todo';

        // 根據自然語言進行意圖特徵萃取
        if (prompt.includes('修復') || prompt.includes('校準') || prompt.includes('更新') || prompt.includes('重整')) {
            title = `[系統校準] ${prompt}`;
            status = 'In Progress'; // 修復類指令直接進入執行共鳴態
        } else if (prompt.includes('緊急') || prompt.includes('立刻') || prompt.includes('馬上')) {
            title = `[高優先級] ${prompt}`;
        } else if (prompt.match(/自動|自癒|熵減/)) {
            title = `[無作妙德] ${prompt}`;
        } else {
            title = `[人類引導] ${prompt}`;
        }

        const records = [{
            fields: { 'Task Title': title, 'Status': status }
        }];

        // 根據 OmniTable API 彈性呼叫
        await (client.createRecords ? client.createRecords(datasheetId, records) : (client as any).createRecord(datasheetId, records[0].fields));
        revalidatePath('/', 'layout');
    } catch (err) {
        console.error('[OmniNotes Action] 語義建立任務失敗:', err);
    }
}

export async function handleRefresh() {
    revalidatePath('/', 'layout'); // 清除全域快取並觸發 RSC 重新渲染
}

export async function markTaskAsDone(taskId: string) {
    try {
        const client = getOmniTableServerClient();
        const datasheetId = process.env.OMNITABLE_TASKS_DATASHEET_ID;
        if (!datasheetId) return;

        // 根據 OmniTable API 設計推測，更新特定的 Record
        const recordsToUpdate = [{
            recordId: taskId,
            fields: { 'Status': 'Done' }
        }];

        if (client.updateRecords) {
            await client.updateRecords(datasheetId, recordsToUpdate);
        } else if ((client as any).updateRecord) {
            await (client as any).updateRecord(datasheetId, taskId, { 'Status': 'Done' });
        }

        revalidatePath('/', 'layout'); // 更新完畢後重新渲染畫面
    } catch (err) {
        console.error(`[OmniNotes] 無法更新任務 ${taskId} 狀態:`, err);
    }
}

export async function assignTaskToAgent(taskId: string, formData: FormData) {
    const agentId = formData.get('agentId') as string;
    if (!agentId) return;

    try {
        const client = getOmniTableServerClient();
        const datasheetId = process.env.OMNITABLE_TASKS_DATASHEET_ID;
        if (!datasheetId) return;

        const recordsToUpdate = [{
            recordId: taskId,
            fields: { 'Assignee': agentId }
        }];

        if (client.updateRecords) {
            await client.updateRecords(datasheetId, recordsToUpdate);
        } else if ((client as any).updateRecord) {
            await (client as any).updateRecord(datasheetId, taskId, { 'Assignee': agentId });
        }

        revalidatePath('/', 'layout'); // 更新完畢後重新渲染畫面
    } catch (err) {
        console.error(`[OmniNotes] 無法指派任務 ${taskId}:`, err);
    }
}
