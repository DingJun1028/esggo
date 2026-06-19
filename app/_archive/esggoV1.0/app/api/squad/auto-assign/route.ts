import { NextResponse } from "next/server";
import { squadAutoAssignFlow } from "@/lib/genkit";
import { SquadAuditService } from "@/lib/services/squad-audit";
import { TaskPersistenceService } from "@/lib/services/task-persistence";

export async function POST(request: Request) {
    const auditService = SquadAuditService.getInstance();
    const taskService = TaskPersistenceService.getInstance();
    try {
        const body = await request.json();
        const { task, members } = body;

        const workloads = taskService.getMemberWorkloads();
        const enrichedMembers = members.map((m: any) => ({
            ...m,
            currentWorkload: workloads[m.id] || 0
        }));

        const result = await squadAutoAssignFlow({ task, members: enrichedMembers });

        // Log the AI assignment to the immutable vault
        await auditService.logEvent("TASK_ASSIGN_AI", "Genkit_Orchestrator", {
            taskId: task.id,
            assignedMemberId: result.assignedMemberId,
            confidenceScore: result.confidenceScore,
            reason: result.reason
        });

        return NextResponse.json({
            success: true,
            assignment: result
        });
    } catch (error: any) {
        console.error("AI Assignment error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "AI logic failure"
        }, { status: 500 });
    }
}
