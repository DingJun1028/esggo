import { NextResponse } from 'next/server';
import { createTask, executeSwarmTask } from '@/lib/agent/orchestrator';
export async function POST(request) {
    try {
        let body;
        try {
            body = await request.json();
        }
        catch (e) {
            body = {};
        }
        // 動態載入 store 確保任務可成功註冊
        const { addTask } = await import('@/lib/agent/store');
        const input = {
            actorId: 'MANUAL_TESTER',
            taskType: 'compliance_review',
            title: '[手動測試] 財報與碳排同態加總校驗',
            description: '測試 ZKP 與 Healing Guardian 的連動流轉',
            inputRefIds: [],
            skillKey: 'omnicore_compliance_check',
            audienceRole: body.audienceRole || 'auditor'
        };
        const { task } = createTask(input);
        task.status = 'approved_for_execution';
        task.requiresHumanReview = false;
        await addTask(task);
        // 在背景非同步呼叫蜂群指揮官
        executeSwarmTask(task.id).catch(console.error);
        return NextResponse.json({ success: true, taskId: task.id });
    }
    catch (error) {
        console.error('[Trigger API] 錯誤發生震盪:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map