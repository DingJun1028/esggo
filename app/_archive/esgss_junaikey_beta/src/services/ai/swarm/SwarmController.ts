import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { omniGemini } from '../../OmniGeminiService.js';
import { AgentBase, PersonaConfiguration, WriterAgent, AuditorAgent } from '../../AgentCore.js';
import { SwarmTask, Subtask, SwarmResult, AgentCapability } from './types.js';

/**
 * [SwarmController] The Hive Mind
 * ---------------------------------------------------------
 * Orchestrates multi-agent collaboration to solve complex goals.
 * It decomposes high-level goals into atomic subtasks and assigns them to the most suitable agents.
 */
export class SwarmController {
    private static instance: SwarmController;
    private activeSwarms: Map<string, SwarmTask> = new Map();
    private availableAgents: AgentBase[] = [];

    private constructor() {
        this.initializeAgents();
    }

    public static getInstance(): SwarmController {
        if (!SwarmController.instance) {
            SwarmController.instance = new SwarmController();
        }
        return SwarmController.instance;
    }

    /**
     * Registers available agents in the swarm pool.
     * In a real system, this might be dynamic discovery.
     */
    private initializeAgents() {
        // Register standard specialized agents
        const writer = new WriterAgent();
        (writer as any).persona.capabilities = ['write_report', 'generate_narrative', 'summarize_data'];

        const auditor = new AuditorAgent();
        (auditor as any).persona.capabilities = ['audit_compliance', 'verify_facts', 'check_consistency'];

        // Generic Analyst
        const analyst = new AgentBase({
            id: 'analyst-1',
            name: 'Data Analyst',
            role: 'ESG Data Specialist',
            tone: 'Strict',
            strictness: 8,
            focusArea: 'General',
            capabilities: ['analyze_trends', 'find_anomalies', 'data_interpretation']
        } as PersonaConfiguration);

        this.availableAgents = [writer, auditor, analyst];
        omniLogger.info(LogCategory.SYSTEM, `[SwarmController] Initialized with ${this.availableAgents.length} agents.`);
    }

    /**
     * Starts a new Swarm Mission.
     */
    public async startMission(goal: string): Promise<SwarmTask> {
        const swarmId = `swarm-${Date.now()}`;
        omniLogger.info(LogCategory.AI, `[Swarm] Starting mission: ${goal}`, { swarmId });

        const task: SwarmTask = {
            id: swarmId,
            goal,
            status: 'IN_PROGRESS',
            subtasks: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        this.activeSwarms.set(swarmId, task);

        // Async Execution
        this.executeMission(task).catch(err => {
            omniLogger.error(LogCategory.AI, `[Swarm] Mission failed`, { swarmId, error: err });
            task.status = 'FAILED';
            task.updatedAt = Date.now();
        });

        return task;
    }

    public getStatus(swarmId: string): SwarmTask | undefined {
        return this.activeSwarms.get(swarmId);
    }

    /**
     * Core Execution Logic
     */
    private async executeMission(task: SwarmTask) {
        // 1. Decompose Goal
        task.subtasks = await this.decomposeGoal(task.goal);
        omniLogger.info(LogCategory.AI, `[Swarm] Decomposed into ${task.subtasks.length} subtasks`);

        // 2. Assign & Execute Subtasks sequentially (Dynamic Loop)
        const artifacts: string[] = [];
        let summary = "Mission Report:\n";
        let stepIndex = 0;

        // Use a while loop to allow dynamic injection of subtasks
        while (stepIndex < task.subtasks.length) {
            const subtask = task.subtasks[stepIndex];
            if (!subtask) {
                stepIndex++;
                continue;
            }
            subtask.status = 'IN_PROGRESS';

            // Find best agent
            const agent = this.findBestAgent(subtask);
            if (!agent) {
                subtask.status = 'FAILED';
                subtask.result = "No suitable agent found.";
                omniLogger.warn(LogCategory.AI, `[Swarm] No agent for subtask: ${subtask.description}`);
                stepIndex++;
                continue;
            }

            subtask.assignedAgentId = agent.id;
            omniLogger.info(LogCategory.AI, `[Swarm] Assigning "${subtask.description}" to ${agent.name}`);

            try {
                // Execute
                const response = await agent.chat(
                    `Mission Context: ${task.goal}\nYour Task: ${subtask.description}\nPrevious Results: ${summary}`
                );

                subtask.status = 'COMPLETED';
                subtask.result = response.content;

                // Accumulate results
                summary += `\n[${subtask.description} - ${agent.name}]:\n${response.content}\n---\n`;
                artifacts.push(subtask.id);

                // Collaborative Workflow Logic: Check for Feedback/Rejection
                await this.evaluateStepResult(task, subtask, agent, response.content, stepIndex);

            } catch (error) {
                subtask.status = 'FAILED';
                subtask.result = `Execution Error: ${error}`;
                omniLogger.error(LogCategory.AI, `[Swarm] Subtask failed`, { error });
            }

            // Move to next task (subtasks array might have grown)
            stepIndex++;
        }

        // 3. Finalize Mission
        task.status = 'COMPLETED';
        task.updatedAt = Date.now();
        task.result = {
            summary,
            artifacts,
            metrics: {
                totalDuration: Date.now() - task.createdAt,
                qualityScore: 0.9
            }
        };

        omniLogger.info(LogCategory.AI, `[Swarm] Mission Completed`);
    }

    /**
     * Cooperative Workflow: Evaluates the result of a step to determine if new tasks are needed.
     * Implements "Report & Audit" and "Research & Synthesis" Loops.
     */
    private async evaluateStepResult(task: SwarmTask, currentSubtask: Subtask, agent: AgentBase, result: string, currentIndex: number) {
        const capabilities = (agent as any).persona?.capabilities || [];
        const isAuditor = capabilities.includes('audit_compliance');
        const isWriter = capabilities.includes('write_report');

        // Loop Protection
        if (currentSubtask.retryCount && currentSubtask.retryCount >= 2) {
            omniLogger.warn(LogCategory.AI, `[Swarm] Max retries reached for ${currentSubtask.description}. Proceeding.`);
            return;
        }

        // 1. Report & Audit Loop
        if (isAuditor) {
            const isRejected = result.toUpperCase().includes('REJECT') || result.toUpperCase().includes('REVISE');
            if (isRejected) {
                omniLogger.info(LogCategory.AI, `[Swarm] Auditor rejected. Injecting revision.`);
                task.subtasks.splice(currentIndex + 1, 0,
                    {
                        id: `subtask-revision-${Date.now()}`,
                        description: `Revise work based on feedback: ${result.substring(0, 100)}...`,
                        status: 'PENDING',
                        dependencies: [currentSubtask.id],
                        retryCount: (currentSubtask.retryCount || 0) + 1
                    },
                    {
                        id: `subtask-reaudit-${Date.now()}`,
                        description: `Re-Audit the revised work`,
                        status: 'PENDING',
                        dependencies: [],
                        retryCount: (currentSubtask.retryCount || 0) + 1
                    }
                );
            }
        }

        // 2. Research & Synthesis Loop
        if (isWriter) {
            const needsResearch = result.toUpperCase().includes('NEED_DATA') || result.toUpperCase().includes('MISSING_INFO');
            if (needsResearch) {
                omniLogger.info(LogCategory.AI, `[Swarm] Writer requested more data. Injecting research task.`);
                task.subtasks.splice(currentIndex + 1, 0,
                    {
                        id: `subtask-research-${Date.now()}`,
                        description: `Research missing info: ${result.substring(0, 50)}...`,
                        status: 'PENDING',
                        dependencies: [currentSubtask.id],
                        retryCount: 0
                    },
                    {
                        id: `subtask-resume-write-${Date.now()}`,
                        description: `Complete writing with new research`,
                        status: 'PENDING',
                        dependencies: [],
                        retryCount: (currentSubtask.retryCount || 0) + 1
                    }
                );
            }
        }
    }

    /**
     * Uses Gemini to decompose a high-level goal into structured subtasks.
     */
    private async decomposeGoal(goal: string): Promise<Subtask[]> {
        const prompt = `
            Role: Expert Project Manager (Swarm Orchestrator)
            Goal: "${goal}"
            
            Instruction: Break this goal down into 3-5 atomic, sequential subtasks that specialized agents (Writer, Auditor, Analyst) can perform.
            
            Output Format: JSON Array only.
            [
                { "description": "precise task description", "dependencies": [] }
            ]
        `;

        try {
            const responseText = await omniGemini.chat(prompt, {
                generationConfig: { response_schema: { type: "ARRAY", items: { type: "OBJECT" } } }
            });

            const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
            const rawSubtasks = JSON.parse(cleanJson);

            return rawSubtasks.map((st: any, idx: number) => ({
                id: `subtask-${Date.now()}-${idx}`,
                description: st.description,
                status: 'PENDING',
                dependencies: st.dependencies || [], // Not used in simple planner yet
                retryCount: 0
            }));
        } catch (error) {
            omniLogger.error(LogCategory.AI, `[Swarm] Decomposition failed`, { error });
            // Fallback: Single task
            return [{
                id: `subtask-fallback`,
                description: `Execute entire goal: ${goal}`,
                status: 'PENDING',
                dependencies: [],
                retryCount: 0
            }];
        }
    }

    /**
     * Selects the best agent for a subtask based on capabilities.
     */
    private findBestAgent(subtask: Subtask): AgentBase | null {
        // Simple keyword matching or LLM-based verification
        // Here we use a heuristic based on description keywords matching capability tags

        let bestAgent: AgentBase | null = null;
        let maxMatch = 0;

        for (const agent of this.availableAgents) {
            let matchScore = 0;
            const caps = agent.capabilities;
            const desc = subtask.description.toLowerCase();

            // Heuristic scoring
            if (desc.includes('write') && caps.includes('write_report')) matchScore += 5;
            if (desc.includes('audit') && caps.includes('audit_compliance')) matchScore += 5;
            if (desc.includes('verify') && caps.includes('verify_facts')) matchScore += 5;
            if (desc.includes('analyze') && caps.includes('analyze_trends')) matchScore += 5;

            if (matchScore > maxMatch) {
                maxMatch = matchScore;
                bestAgent = agent;
            }
        }

        // Default to Analyst if no strong match, or just the first agent
        return bestAgent || this.availableAgents[2] || null;
    }

    public getSwarmStatus(swarmId: string): SwarmTask | undefined {
        return this.activeSwarms.get(swarmId);
    }
}

export const swarmController = SwarmController.getInstance();
