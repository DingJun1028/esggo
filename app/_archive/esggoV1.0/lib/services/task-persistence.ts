import fs from "fs";
import path from "path";

const TASKS_FILE_PATH = path.join(process.cwd(), "lib/data/tasks.json");

export interface Task {
    id: string;
    title: string;
    description: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    assigneeId: string | null;
}

/**
 * TaskPersistenceService
 * Manages the global state of tasks within the ESG GO platform.
 */
export class TaskPersistenceService {
    private static instance: TaskPersistenceService;

    private constructor() {
        this.ensureFileExists();
    }

    public static getInstance(): TaskPersistenceService {
        if (!TaskPersistenceService.instance) {
            TaskPersistenceService.instance = new TaskPersistenceService();
        }
        return TaskPersistenceService.instance;
    }

    private ensureFileExists() {
        const dir = path.dirname(TASKS_FILE_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        if (!fs.existsSync(TASKS_FILE_PATH)) {
            fs.writeFileSync(TASKS_FILE_PATH, JSON.stringify({
                tasks: [
                    { id: "t1", title: "GRI 2021 框架對齊校正", description: "針對過往三年的永續報告書進行 GRI 2021 的完整語意對齊。", status: "TODO", assigneeId: null },
                    { id: "t2", title: "供應鏈 Scope 3 數據稽核", description: "驗證來自一級供應商的碳排放數據準確性與存證紀錄。", status: "TODO", assigneeId: null },
                    { id: "t3", title: "Dr. Thoth 語言模型微調", description: "優化 AI 報告生成引擎在繁體中文永續專業術語上的表現。", status: "TODO", assigneeId: null },
                ]
            }, null, 2));
        }
    }

    public getTasks(): Task[] {
        try {
            const data = fs.readFileSync(TASKS_FILE_PATH, "utf-8");
            return JSON.parse(data).tasks;
        } catch (error) {
            console.error("Failed to load tasks:", error);
            return [];
        }
    }

    public saveTasks(tasks: Task[]) {
        fs.writeFileSync(TASKS_FILE_PATH, JSON.stringify({ tasks }, null, 2));
    }

    public updateTask(taskId: string, updates: Partial<Task>) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            const current = tasks[index];
            if (current) {
                tasks[index] = { ...current, ...updates };
                this.saveTasks(tasks);
            }
        }
    }

    /**
     * Get the count of active tasks for each member
     */
    public getMemberWorkloads(): Record<string, number> {
        const tasks = this.getTasks();
        const workloads: Record<string, number> = {};
        tasks.forEach(task => {
            if (task.assigneeId && task.status !== "DONE") {
                workloads[task.assigneeId] = (workloads[task.assigneeId] || 0) + 1;
            }
        });
        return workloads;
    }
}
