import { NextResponse } from "next/server";
import { TaskPersistenceService } from "@/lib/services/task-persistence";

export async function GET() {
    const taskService = TaskPersistenceService.getInstance();
    try {
        const tasks = taskService.getTasks();
        const workloads = taskService.getMemberWorkloads();
        return NextResponse.json({
            success: true,
            tasks,
            workloads
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch tasks" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const taskService = TaskPersistenceService.getInstance();
    try {
        const body = await request.json();
        const { tasks } = body;
        if (!Array.isArray(tasks)) {
            return NextResponse.json({ success: false, error: "Invalid task data" }, { status: 400 });
        }
        taskService.saveTasks(tasks);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to save tasks" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const taskService = TaskPersistenceService.getInstance();
    try {
        const body = await request.json();
        const { taskId, updates } = body;
        if (!taskId || !updates) {
            return NextResponse.json({ success: false, error: "Missing taskId or updates" }, { status: 400 });
        }
        taskService.updateTask(taskId, updates);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to update task" }, { status: 500 });
    }
}
