import { NextResponse } from 'next/server';
import { createTask, executeSwarmTask, CreateTaskInput } from '@/lib/agent/orchestrator';

export async function POST(request: Request) {
    try {
        let body;
        try {
            body = await request.json();
        } catch (e) {
            body = {};
        }

        const { addTask } = await import('@/lib/agent/store');

        const input: CreateTaskInput = {
            actorId: 'EDITOR_USER',
            taskType: 'report_drafting',
            title: '[SustainWrite] 全域共作報告',
            description: `測試 Swarm 融合`,
            inputRefIds: [],
            skillKey: 'gri_report_draft',
            audienceRole: body.audienceRole || 'board'
        };

        const { task } = createTask(input);
        task.status = 'approved_for_execution';
        task.requiresHumanReview = false;

        await addTask(task);

        // 🟢 Synchronous Execution (等待蜂群與 OmniCore 融合完成)
        const { artifact } = await executeSwarmTask(task.id);

        return NextResponse.json({ success: true, content: artifact?.content });
    } catch (error: unknown) {
        console.error('[Sync API] 錯誤發生震盪:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}