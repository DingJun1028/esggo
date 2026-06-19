/**
 * OmniAgent - 奧秘圓通智能代理服務
 * 
 * 提供統一的人工智能代理層，能夠理解自然語言請求、
 * 智能分解任務、並協調多個 Omni 服務完成複雜操作。
 * 
 * @version 2.0.0 (Trinity Compatible)
 * @date 2026-02-14
 */

import { omniLogger, LogCategory, LogLevel } from '../../src/omni/infrastructure/logging/OmniLogger.js';
import { createOmniRequest, createOmniGateway, OmniGateway, OmniServiceType, OmniRequest, OmniResponse } from './OmniGateway.js';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type AgentCapability =
    | 'NLP_UNDERSTANDING'
    | 'TASK_DECOMPOSITION'
    | 'SERVICE_ORCHESTRATION'
    | 'CONTEXT_MANAGEMENT'
    | 'LEARNING'
    | 'CREATIVE_GENERATION'
    | 'ANALYSIS'
    | 'AUTOMATION';

export interface AgentTask {
    id: string;
    description: string;
    steps: AgentStep[];
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    context: Record<string, unknown>;
    createdAt: number;
    updatedAt: number;
}

export interface AgentStep {
    id: string;
    name: string;
    service: OmniServiceType;
    action: string;
    params: Record<string, unknown>;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    result?: unknown;
    error?: string;
    order: number;
}

export interface AgentSession {
    id: string;
    userId: string;
    tasks: Map<string, AgentTask>;
    context: Record<string, unknown>;
    createdAt: number;
    lastActivity: number;
}

export interface NaturalLanguageRequest {
    text: string;
    userId?: string;
    sessionId?: string;
    context?: Record<string, unknown>;
    intent?: string;
    entities?: Record<string, unknown>;
}

export interface AgentResponse {
    success: boolean;
    task?: AgentTask;
    result?: unknown;
    suggestion?: string;
    error?: string;
    metadata: {
        requestId: string;
        sessionId: string;
        intent: string;
        confidence: number;
        processingTime: number;
    };
}

// ============================================================================
// Intent Recognizer
// ============================================================================

export class IntentRecognizer {
    private static patterns: Map<string, RegExp[]> = new Map();

    private constructor() {
        this.initializePatterns();
    }

    static getInstance(): IntentRecognizer {
        return new IntentRecognizer();
    }

    private initializePatterns(): void {
        // CRM intents
        IntentRecognizer.patterns.set('CREATE_CONTACT', [
            /add\s+(?:a\s+)?contact/i,
            /new\s+contact/i,
            /create\s+(?:a\s+)?contact/i,
            /save\s+(?:this\s+)?(person|contact)/i
        ]);

        IntentRecognizer.patterns.set('CREATE_DEAL', [
            /new\s+deal/i,
            /create\s+(?:a\s+)?deal/i,
            /add\s+(?:a\s+)?opportunity/i,
            /sales\s+(?:opportunity|lead)/i
        ]);

        IntentRecognizer.patterns.set('BUSINESS_DEVELOPMENT', [
            /business\s+development/i,
            /bd\s+(?:for|analysis)/i,
            /find\s+(?:potential\s+)?partner/i,
            /market\s+(?:research|analysis)/i
        ]);

        // Table intents
        IntentRecognizer.patterns.set('GENERATE_TABLE', [
            /create\s+(?:a\s+)?table/i,
            /generate\s+(?:a\s+)?table/i,
            /make\s+(?:a\s+)?spreadsheet/i
        ]);

        IntentRecognizer.patterns.set('GENERATE_CHART', [
            /create\s+(?:a\s+)?chart/i,
            /generate\s+(?:a\s+)?chart/i,
            /show\s+(?:me\s+)?(graph|visualization|diagram)/i
        ]);

        IntentRecognizer.patterns.set('GENERATE_DASHBOARD', [
            /create\s+(?:a\s+)?dashboard/i,
            /generate\s+(?:a\s+)?dashboard/i,
            /show\s+(?:me\s+)?overview/i
        ]);

        // Note intents
        IntentRecognizer.patterns.set('CREATE_NOTE', [
            /create\s+(?:a\s+)?note/i,
            /add\s+(?:a\s+)?note/i,
            /write\s+(?:a\s+)?note/i,
            /take\s+(?:a\s+)?note/i
        ]);

        // Analysis intents
        IntentRecognizer.patterns.set('ANALYZE', [
            /analyze/i,
            /analysis/i,
            /review/i,
            /evaluate/i
        ]);

        // General intents
        IntentRecognizer.patterns.set('HELP', [
            /help/i,
            /what\s+can\s+you\s+do/i,
            /assist/i,
            /support/i
        ]);

        omniLogger.info(LogCategory.AI, '[OmniAgent] Intent patterns initialized');
    }

    recognize(text: string): { intent: string; confidence: number; entities: Record<string, unknown> } {
        const normalizedText = text.toLowerCase().trim();
        let bestMatch: { intent: string; confidence: number } | null = null;

        for (const [intent, patterns] of IntentRecognizer.patterns) {
            for (const pattern of patterns) {
                if (pattern.test(normalizedText)) {
                    const confidence = 0.5 + (Math.random() * 0.3); // 0.5-0.8 base confidence

                    if (!bestMatch || confidence > bestMatch.confidence) {
                        bestMatch = { intent, confidence };
                    }
                }
            }
        }

        // Extract entities
        const entities = this.extractEntities(normalizedText);

        return {
            intent: bestMatch?.intent || 'UNKNOWN',
            confidence: bestMatch?.confidence || 0.3,
            entities
        };
    }

    private extractEntities(text: string): Record<string, unknown> {
        const entities: Record<string, unknown> = {};

        // Extract email patterns
        const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/g);
        if (emailMatch) {
            entities.email = emailMatch[0];
        }

        // Extract company names (simple heuristic)
        const companyMatch = text.match(/(?:from|at|company)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g);
        if (companyMatch) {
            entities.company = companyMatch[0].replace(/(?:from|at|company)\s+/i, '');
        }

        // Extract currency amounts
        const amountMatch = text.match(/\$[\d,]+(?:\.\d+)?|\d+(?:,\d{3})*(?:\.\d+)?\s*(?:USD|EUR|TWD)/gi);
        if (amountMatch) {
            entities.amount = amountMatch[0];
        }

        // Extract names (capitalized words)
        const nameMatch = text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/g);
        if (nameMatch) {
            entities.personName = nameMatch[0];
        }

        return entities;
    }
}

// ============================================================================
// Task Decomposer
// ============================================================================

export class TaskDecomposer {
    private static instance: TaskDecomposer;

    private constructor() { }

    static getInstance(): TaskDecomposer {
        if (!TaskDecomposer.instance) {
            TaskDecomposer.instance = new TaskDecomposer();
        }
        return TaskDecomposer.instance;
    }

    decompose(intent: string, entities: Record<string, unknown>, context: Record<string, unknown>): AgentStep[] {
        omniLogger.info(LogCategory.AI, `[OmniAgent] Decomposing task: ${intent}`, { entities });

        const steps: AgentStep[] = [];

        switch (intent) {
            case 'CREATE_CONTACT':
                steps.push(this.createContactSteps(entities));
                break;
            case 'CREATE_DEAL':
                steps.push(this.createDealSteps(entities));
                break;
            case 'BUSINESS_DEVELOPMENT':
                steps.push(...this.createBDSteps(entities));
                break;
            case 'GENERATE_TABLE':
            case 'GENERATE_CHART':
            case 'GENERATE_DASHBOARD':
                steps.push(this.createGenerationSteps(intent, entities));
                break;
            case 'CREATE_NOTE':
                steps.push(this.createNoteSteps(entities));
                break;
            case 'ANALYZE':
                steps.push(...this.createAnalysisSteps(entities));
                break;
            default:
                steps.push({
                    id: uuidv4(),
                    name: 'General Request',
                    service: 'UNKNOWN',
                    action: 'process',
                    params: { intent, entities, context },
                    status: 'PENDING',
                    order: 1
                });
        }

        return steps;
    }

    private createContactSteps(entities: Record<string, unknown>): AgentStep {
        return {
            id: uuidv4(),
            name: 'Create Contact',
            service: 'CRM',
            action: 'contacts',
            params: {
                operation: 'create',
                prompt: entities.personName
                    ? `Add ${entities.personName} from ${entities.company || 'unknown company'}`
                    : 'Add a new contact',
                email: entities.email
            },
            status: 'PENDING',
            order: 1
        };
    }

    private createDealSteps(entities: Record<string, unknown>): AgentStep {
        return {
            id: uuidv4(),
            name: 'Create Deal',
            service: 'CRM',
            action: 'deals',
            params: {
                operation: 'create',
                prompt: `Create a deal ${entities.amount ? `for ${entities.amount}` : ''}`,
                value: entities.amount
            },
            status: 'PENDING',
            order: 1
        };
    }

    private createBDSteps(entities: Record<string, unknown>): AgentStep[] {
        return [
            {
                id: uuidv4(),
                name: 'Research Target',
                service: 'CRM',
                action: 'bd',
                params: {
                    operation: 'research',
                    company: entities.company || 'target company',
                    industry: 'ESG'
                },
                status: 'PENDING',
                order: 1
            },
            {
                id: uuidv4(),
                name: 'Generate Strategy',
                service: 'CRM',
                action: 'bd',
                params: {
                    operation: 'strategy',
                    company: entities.company || 'target company'
                },
                status: 'PENDING',
                order: 2
            }
        ];
    }

    private createGenerationSteps(intent: string, entities: Record<string, unknown>): AgentStep {
        const typeMap: Record<string, 'chart' | 'table' | 'dashboard' | 'database'> = {
            'GENERATE_CHART': 'chart',
            'GENERATE_TABLE': 'table',
            'GENERATE_DASHBOARD': 'dashboard'
        };

        return {
            id: uuidv4(),
            name: `Generate ${intent.replace('GENERATE_', '').toLowerCase()}`,
            service: 'TABLE',
            action: 'generate',
            params: {
                type: typeMap[intent] || 'table',
                prompt: entities.context || 'Generate requested content'
            },
            status: 'PENDING',
            order: 1
        };
    }

    private createNoteSteps(entities: Record<string, unknown>): AgentStep {
        return {
            id: uuidv4(),
            name: 'Create Note',
            service: 'NOTE',
            action: 'notes',
            params: {
                operation: 'create',
                content: entities.content || 'New note'
            },
            status: 'PENDING',
            order: 1
        };
    }

    private createAnalysisSteps(entities: Record<string, unknown>): AgentStep[] {
        return [
            {
                id: uuidv4(),
                name: 'Gather Data',
                service: 'ANALYTICS',
                action: 'gather',
                params: { scope: entities.scope || 'all' },
                status: 'PENDING',
                order: 1
            },
            {
                id: uuidv4(),
                name: 'Analyze',
                service: 'ANALYTICS',
                action: 'analyze',
                params: { type: entities.type || 'general' },
                status: 'PENDING',
                order: 2
            }
        ];
    }
}

// ============================================================================
// Main Agent Class
// ============================================================================

export class OmniAgent {
    private static instance: OmniAgent;
    private gateway: OmniGateway;
    private sessions: Map<string, AgentSession> = new Map();
    private intentRecognizer: IntentRecognizer;
    private taskDecomposer: TaskDecomposer;
    private isInitialized = false;

    private constructor() {
        this.gateway = createOmniGateway();
        this.intentRecognizer = IntentRecognizer.getInstance();
        this.taskDecomposer = TaskDecomposer.getInstance();
    }

    static getInstance(): OmniAgent {
        if (!OmniAgent.instance) {
            OmniAgent.instance = new OmniAgent();
        }
        return OmniAgent.instance;
    }

    async initialize(): Promise<void> {
        if (this.isInitialized) {
            omniLogger.warn(LogCategory.AI, '[OmniAgent] Already initialized');
            return;
        }

        omniLogger.info(LogCategory.AI, '[OmniAgent] Initializing Omni Agent...');

        await this.gateway.initialize();
        this.isInitialized = true;

        omniLogger.info(LogCategory.AI, '[OmniAgent] Omni Agent initialized successfully');
    }

    async processNaturalLanguage(request: NaturalLanguageRequest): Promise<AgentResponse> {
        const startTime = Date.now();
        const requestId = uuidv4();
        const sessionId = request.sessionId || uuidv4();

        omniLogger.info(LogCategory.AI, `[OmniAgent] Processing natural language request`, {
            text: request.text.substring(0, 100),
            userId: request.userId
        });

        try {
            // Ensure initialization
            if (!this.isInitialized) {
                await this.initialize();
            }

            // Step 1: Intent Recognition
            const { intent, confidence, entities } = this.intentRecognizer.recognize(request.text);

            omniLogger.info(LogCategory.AI, `[OmniAgent] Intent recognized: ${intent}`, { confidence });

            // Step 2: Create or retrieve session
            const session = this.getOrCreateSession(sessionId, request.userId || 'anonymous');

            // Step 3: Decompose into steps
            const steps = this.taskDecomposer.decompose(intent, {
                ...entities,
                ...request.context
            }, session.context);

            // Step 4: Create task
            const task: AgentTask = {
                id: uuidv4(),
                description: request.text,
                steps,
                status: 'IN_PROGRESS',
                context: request.context || {},
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            session.tasks.set(task.id, task);

            // Step 5: Execute steps
            const result = await this.executeTask(task);

            // Update session context
            session.lastActivity = Date.now();
            session.context = {
                ...session.context,
                lastIntent: intent,
                lastEntities: entities
            };

            const processingTime = Date.now() - startTime;

            omniLogger.info(LogCategory.AI, `[OmniAgent] Task completed in ${processingTime}ms`, {
                taskId: task.id,
                success: result.success
            });

            return {
                success: result.success,
                task,
                result: result.data,
                suggestion: this.generateSuggestion(intent),
                metadata: {
                    requestId,
                    sessionId,
                    intent,
                    confidence,
                    processingTime
                }
            };

        } catch (error) {
            omniLogger.error(LogCategory.AI, '[OmniAgent] Processing failed', { error });

            return {
                success: false,
                error: (error as Error).message,
                metadata: {
                    requestId,
                    sessionId,
                    intent: 'ERROR',
                    confidence: 0,
                    processingTime: Date.now() - startTime
                }
            };
        }
    }

    private async executeTask(task: AgentTask): Promise<{ success: boolean; data?: unknown }> {
        const results: unknown[] = [];

        for (const step of task.steps) {
            step.status = 'IN_PROGRESS';
            omniLogger.info(LogCategory.AI, `[OmniAgent] Executing step: ${step.name}`);

            try {
                // Trinity Encapsulation: The createOmniRequest now returns a Trinity-compliant structure
                const request = createOmniRequest(
                    step.service,
                    step.action,
                    step.params,
                    { sessionId: task.id }
                );

                const response = await this.gateway.processRequest(request);

                if (response.success) {
                    step.status = 'COMPLETED';
                    step.result = response.data;
                    results.push(response.data);
                } else {
                    step.status = 'FAILED';
                    step.error = response.error?.message || 'Unknown error';
                    task.status = 'FAILED';

                    omniLogger.warn(LogCategory.AI, `[OmniAgent] Step failed: ${step.name}`, {
                        error: step.error
                    });

                    return { success: false, data: results };
                }

            } catch (error) {
                step.status = 'FAILED';
                step.error = (error as Error).message;
                task.status = 'FAILED';

                omniLogger.error(LogCategory.AI, `[OmniAgent] Step execution error`, { error });

                return { success: false, data: results };
            }
        }

        task.status = 'COMPLETED';
        task.updatedAt = Date.now();

        return { success: true, data: results };
    }

    private getOrCreateSession(sessionId: string, userId: string): AgentSession {
        let session = this.sessions.get(sessionId);

        if (!session) {
            session = {
                id: sessionId,
                userId,
                tasks: new Map(),
                context: {},
                createdAt: Date.now(),
                lastActivity: Date.now()
            };
            this.sessions.set(sessionId, session);
            omniLogger.info(LogCategory.AI, `[OmniAgent] Session created: ${sessionId}`);
        }

        return session;
    }

    private generateSuggestion(intent: string): string | undefined {
        const suggestions: Record<string, string> = {
            'CREATE_CONTACT': 'Would you like to add more details to this contact, such as phone number or notes?',
            'CREATE_DEAL': 'Would you like to set a follow-up task for this deal?',
            'BUSINESS_DEVELOPMENT': 'Would you like me to generate a detailed partnership proposal?',
            'GENERATE_TABLE': 'Would you like me to create a chart visualization of this data?',
            'GENERATE_CHART': 'Would you like to save this chart to a dashboard?',
            'CREATE_NOTE': 'Would you like to share this note with your team?',
            'ANALYZE': 'Would you like a detailed report on the findings?'
        };

        return suggestions[intent];
    }

    async getSession(sessionId: string): Promise<AgentSession | null> {
        return this.sessions.get(sessionId) || null;
    }

    async getActiveTasks(userId: string): Promise<AgentTask[]> {
        const tasks: AgentTask[] = [];

        for (const session of this.sessions.values()) {
            if (session.userId === userId) {
                for (const task of session.tasks.values()) {
                    if (task.status === 'IN_PROGRESS') {
                        tasks.push(task);
                    }
                }
            }
        }

        return tasks;
    }

    async cancelTask(taskId: string): Promise<boolean> {
        for (const session of this.sessions.values()) {
            const task = session.tasks.get(taskId);
            if (task) {
                task.status = 'CANCELLED';
                task.updatedAt = Date.now();
                omniLogger.info(LogCategory.AI, `[OmniAgent] Task cancelled: ${taskId}`);
                return true;
            }
        }
        return false;
    }
}

// ============================================================================
// Export Factory Function
// ============================================================================

export function createOmniAgent(): OmniAgent {
    return OmniAgent.getInstance();
}

export function createNaturalLanguageRequest(
    text: string,
    userId?: string,
    context?: Record<string, unknown>
): NaturalLanguageRequest {
    return {
        text,
        userId,
        context
    };
}

// ============================================================================
// Default Export
// ============================================================================

export default {
    Agent: OmniAgent,
    IntentRecognizer,
    TaskDecomposer,
    createOmniAgent,
    createNaturalLanguageRequest
};
