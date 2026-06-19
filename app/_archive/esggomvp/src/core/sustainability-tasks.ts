import { IOmniAtom } from './omni-types';
import { OmniOne } from './omni-one';
import { omniLogger, LogCategory } from './omniLogger';

export interface ISustainabilityTask {
    id: string;
    title: string;
    description: string;
    category: 'NetZero' | 'Altruism' | 'Governance' | 'Innovation';
    xpReward: number;
    gCoinReward: number;
    status: 'Pending' | 'Completed' | 'Verified';
    requirements: string[];
}

export class SustainabilityTaskEngine {
    private static tasks: ISustainabilityTask[] = [
        {
            id: 'task-001',
            title: 'GRI 指標結構化學習 // GRI Indicator Modular Learning',
            description: '完成一次標準化 GRI 報告模組編織項目。',
            category: 'Governance',
            xpReward: 50,
            gCoinReward: 10,
            status: 'Pending',
            requirements: ['ReportForge_Active']
        },
        {
            id: 'task-002',
            title: '碳盤查憑證辨識實踐 // Carbon Voucher OCR Practice',
            description: '上傳並辨識一組電力或水利公用事業單據。',
            category: 'NetZero',
            xpReward: 80,
            gCoinReward: 20,
            status: 'Pending',
            requirements: ['OCR_Verifier_Verified']
        },
        {
            id: 'task-003',
            title: '利益相關者敏感度調研 // Stakeholder Sensitivity Audit',
            description: '在儀表板中完成一次利益相關者動態影響力分析。',
            category: 'Altruism',
            xpReward: 60,
            gCoinReward: 15,
            status: 'Pending',
            requirements: ['StakeholderMap_Explored']
        }
    ];

    public static getAvailableTasks(): ISustainabilityTask[] {
        return this.tasks;
    }

    public static async completeTask(taskId: string): Promise<IOmniAtom<ISustainabilityTask> | null> {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task || task.status !== 'Pending') return null;

        task.status = 'Completed';

        omniLogger.info(LogCategory.SYSTEM, `✅ Task Completed: ${task.title}. Rewarding ${task.xpReward} XP.`);

        // Manifest accomplishment as a 5T verified atom
        const taskAtom = await OmniOne.manifest<ISustainabilityTask>({
            intent: `Sustainability_Task_Completion: ${task.id}`,
            type: 'Accomplishment',
            payload: task,
            domainRef: 'ECO-VILLAGE',
            tags: ['Task', task.category, 'Reward'],
            formula: '$R = XP + G-Coin \\times Compliance$',
            impactMetric: 'Engagement_Loyalty_Score'
        });

        return taskAtom;
    }
}
