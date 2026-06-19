/**
 * 奧秘精靈 (Omni Spirit)
 * --------------------------------------------------
 * [核心] 自主智能代理 (Autonomous Agent)
 * [功能] 靈魂迴圈 (Spirit Loop)、任務執行、自我反思
 * [協議] Trinity Protocol Compatible
 * 
 * @version 1.0.0
 * @date 2026-02-14
 */

import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger.js';
import { junAiKeyClient } from '../api/JunAiKey.Client.js';
import { omniKnowledgeBase } from '../OmniKnowledgeBase.js';

export interface SpiritTask {
    id: string;
    goal: string;
    status: 'pending' | 'active' | 'completed' | 'failed';
    steps: string[];
    currentStepIndex: number;
    result?: string;
}

export class OmniSpirit {
    private static instance: OmniSpirit;
    private isAwake: boolean = false;
    private currentTask: SpiritTask | null = null;
    private thinkInterval: NodeJS.Timeout | null = null;

    private constructor() { }

    public static getInstance(): OmniSpirit {
        if (!OmniSpirit.instance) {
            OmniSpirit.instance = new OmniSpirit();
        }
        return OmniSpirit.instance;
    }

    /**
     * Awaken the Spirit (Start the Agent Loop)
     */
    public awaken(): void {
        if (this.isAwake) return;
        this.isAwake = true;
        omniLogger.info(LogCategory.AI, '✨ OmniSpirit Awakened');

        // Start the "Spirit Loop" - thinking every 5 seconds
        this.thinkInterval = setInterval(() => this.spiritLoop(), 5000);
    }

    public sleep(): void {
        this.isAwake = false;
        if (this.thinkInterval) {
            clearInterval(this.thinkInterval);
            this.thinkInterval = null;
        }
        omniLogger.info(LogCategory.AI, '💤 OmniSpirit Sleeping');
    }

    /**
     * Assign a new task
     */
    public async assignTask(goal: string): Promise<string> {
        const taskId = `task_${Date.now()}`;
        this.currentTask = {
            id: taskId,
            goal,
            status: 'pending',
            steps: [],
            currentStepIndex: 0
        };
        omniLogger.info(LogCategory.AI, `[Spirit] Task Assigned: ${goal}`);

        // Trigger immediate thought
        this.spiritLoop();

        return taskId;
    }

    /**
     * The Core Spirit Loop
     */
    private async spiritLoop() {
        if (!this.isAwake || !this.currentTask || this.currentTask.status === 'completed') return;

        try {
            const task = this.currentTask;

            // Phase 1: Planning
            if (task.status === 'pending') {
                omniLogger.debug(LogCategory.AI, `[Spirit] Planning task: ${task.goal}`);
                task.status = 'active';
                const planPrompt = `
                    Goal: ${task.goal}
                    Create a step-by-step plan to achieve this goal.
                    Return ONLY a JSON array of strings, e.g. ["step 1", "step 2"].
                `;
                const planJson = await junAiKeyClient.queryAI(planPrompt);
                try {
                    // Try to parse JSON, handle potential markdown code blocks
                    const cleanJson = planJson.replace(/```json|```/g, '').trim();
                    task.steps = JSON.parse(cleanJson);
                    omniLogger.info(LogCategory.AI, `[Spirit] Plan created with ${task.steps.length} steps`);
                } catch (e) {
                    omniLogger.warn(LogCategory.AI, '[Spirit] Planning failed to parse JSON, using raw response as single step');
                    task.steps = [task.goal];
                }
            }

            // Phase 2: Execution
            if (task.status === 'active' && task.currentStepIndex < task.steps.length) {
                const currentStep = task.steps[task.currentStepIndex];
                omniLogger.info(LogCategory.AI, `[Spirit] Executing step ${task.currentStepIndex + 1}/${task.steps.length}: ${currentStep}`);

                // Execute step using AI
                // TODO: Integrate specialized tools here
                const result = await junAiKeyClient.queryAI(`Execute this step: ${currentStep}. Return the result.`);

                // Save context/result to memory (KnowledgeBase)
                await omniKnowledgeBase.ingestFromNote({
                    noteId: `spirit_mem_${Date.now()}`,
                    customTags: ['spirit_memory', task.id],
                    category: 'ESG' as any // Temporary cast
                }, {
                    id: `spirit_mem_${Date.now()}`,
                    contextId: 'spirit_loop',
                    content: `Task: ${task.goal}\nStep: ${currentStep}\nResult: ${result}`,
                    tags: ['spirit'],
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                });

                task.currentStepIndex++;
            }

            // Phase 3: Completion
            if (task.currentStepIndex >= task.steps.length) {
                task.status = 'completed';
                task.result = 'Task executed successfully based on steps.';
                omniLogger.info(LogCategory.AI, `[Spirit] Task Completed: ${task.goal}`);
            }

        } catch (error) {
            omniLogger.error(LogCategory.AI, '[Spirit] Error in loop', { error });
            if (this.currentTask) this.currentTask.status = 'failed';
        }
    }
}

export const omniSpirit = OmniSpirit.getInstance();
