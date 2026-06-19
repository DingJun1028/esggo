/**
 * TaskMatrixService.ts
 * [📊核心] 任務矩陣生成器 - 將「缺失」轉化為「資產」
 */

import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger.js';
import { IComplianceGap } from '../../types/esg/report-hub.js';
import { v4 as uuidv4 } from 'uuid';

export interface IActionTask {
    id: string;
    title: string;
    gap_reference: string;
    assigned_role: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    deadline: number;
}

export class TaskMatrixService {
    private tasks: Map<string, IActionTask[]> = new Map();

    /**
     * 根據合規缺口自動生成任務矩陣
     */
    public async generateTaskMatrix(reportId: string, gaps: IComplianceGap[]): Promise<IActionTask[]> {
        omniLogger.info(LogCategory.BUSINESS, `[Matrix] Generating tasks for ${reportId} based on ${gaps.length} gaps...`);

        const actionTasks: IActionTask[] = gaps.map(gap => ({
            id: uuidv4(),
            title: `補全指標: ${gap.indicator_id} - ${gap.description}`,
            gap_reference: gap.indicator_id,
            assigned_role: 'Data Specialist',
            status: 'TODO',
            deadline: Date.now() + (7 * 24 * 60 * 60 * 1000) // 1 week
        }));

        this.tasks.set(reportId, actionTasks);
        return actionTasks;
    }

    /**
     * 自動回填邏輯：當任務完成時，通常會觸發報告對應章節的重新生成
     */
    public async onTaskCompleted(reportId: string, taskId: string) {
        const reportTasks = this.tasks.get(reportId);
        if (reportTasks) {
            const task = reportTasks.find(t => t.id === taskId);
            if (task) {
                task.status = 'DONE';
                omniLogger.info(LogCategory.BUSINESS, `[Matrix] Task ${taskId} completed. Ready for report backfill.`);
            }
        }
    }
}

export const taskMatrixService = new TaskMatrixService();
