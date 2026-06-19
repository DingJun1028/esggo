import { omniGemini } from '../OmniGeminiService';
import { OmniTask } from '../../core/types';
import { omniLogger, LogCategory } from '@/services/omniLogger';

export interface RecommendationItem {
    id: string;
    action: string;
    rationale: string;
    impactScore: number; // 1-10
    route?: string; // Optional navigation target
    type: 'task_completion' | 'learning' | 'optimization' | 'system_health';
}

export class SmartRecommendationService {
    private static instance: SmartRecommendationService;

    private constructor() { }

    public static getInstance(): SmartRecommendationService {
        if (!SmartRecommendationService.instance) {
            SmartRecommendationService.instance = new SmartRecommendationService();
        }
        return SmartRecommendationService.instance;
    }

    /**
     * Generates the "Next Best Action" based on current context.
     */
    public async generateRecommendations(
        tasks: OmniTask[],
        currentView: string
    ): Promise<RecommendationItem[]> {
        const incompleteTasks = tasks.filter(t => t.status !== 'DONE');
        const highPriorityTasks = incompleteTasks.filter(t => t.priority === 'HIGH' || t.priority === 'CRITICAL');

        // Context summary for the AI
        const contextSummary = {
            totalTasks: tasks.length,
            incompleteCount: incompleteTasks.length,
            highPriorityCount: highPriorityTasks.length,
            currentView,
            recentTasks: incompleteTasks.slice(0, 5).map(t => ({ title: t.title, priority: t.priority })),
        };

        const prompt = `
      Role: Sentient ESG Assistant (Smart Recommendation Engine)
      Context: The user is currently viewing "${currentView}".
      System State: ${JSON.stringify(contextSummary)}
      
      Task: Analyze the user's workload and system state. Recommend exactly 3 distinct "Next Best Actions" to maximize impact or efficient progress.
      
      Output Format: Return valid JSON array of objects with keys: "action" (short verb phrase), "rationale" (why this is important now), "impactScore" (1-10 number), "type" (task_completion/learning/optimization/system_health).
      
      Example:
      [
        { "action": "Complete Carbon Scope 1", "rationale": "High priority task pending for 2 days.", "impactScore": 9, "type": "task_completion" }
      ]
      
      Constraints:
      - Adhere to "Trinity Standard": Recommend based on Overview (Essence), Detail (Metrics), and Extension (Evolution).
      - Prioritize "Trustworthiness" (5T Protocol) and "Service as Teaching" (Learning moments).
      - Be concise and actionable.
    `;

        try {
            const responseText = await omniGemini.chat(prompt, {
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                    response_schema: { type: "ARRAY", items: { type: "OBJECT" } } // Hint for JSON
                }
            });

            // Parse JSON from response (handling potential markdown code blocks)
            const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
            const rawRecommendations = JSON.parse(cleanJson);

            // Map to typed objects and add IDs
            const recommendations: RecommendationItem[] = rawRecommendations.map((rec: any, index: number) => ({
                id: `rec-${Date.now()}-${index}`,
                action: rec.action,
                rationale: rec.rationale,
                impactScore: rec.impactScore,
                type: rec.type,
                // Simple routing logic (can be expanded)
                route: this.inferRoute(rec.action, rec.type),
            }));

            return recommendations;

        } catch (error) {
            omniLogger.error(LogCategory.AI, 'Failed to generate recommendations', error);
            // Fallback recommendations if AI fails
            return this.getFallbackRecommendations(incompleteTasks);
        }
    }

    private inferRoute(action: string, type: string): string | undefined {
        const lowerAction = action.toLowerCase();
        if (type === 'learning') return '/academy';
        if (lowerAction.includes('carbon')) return '/esg/environmental/carbon-inventory';
        if (lowerAction.includes('audit') || lowerAction.includes('review')) return '/dev/audit';
        if (lowerAction.includes('profile') || lowerAction.includes('identity')) return '/cmd/talent-passport';
        return undefined;
    }

    private getFallbackRecommendations(incompleteTasks: OmniTask[]): RecommendationItem[] {
        const fallback: RecommendationItem[] = [];

        // 1. Suggest highest priority task
        const topTask = incompleteTasks.find(t => t.priority === 'CRITICAL' || t.priority === 'HIGH');
        if (topTask) {
            fallback.push({
                id: 'fallback-1',
                action: `Complete: ${topTask.title}`,
                rationale: 'This is a high priority item requiring attention.',
                impactScore: 8,
                type: 'task_completion'
            });
        } else {
            fallback.push({
                id: 'fallback-1',
                action: 'Review Dashboard Metrics',
                rationale: 'Keep track of your ESG performance periodically.',
                impactScore: 5,
                type: 'optimization',
                route: '/dashboard'
            });
        }

        // 2. Suggest learning
        fallback.push({
            id: 'fallback-2',
            action: 'Explore ESG Academy',
            rationale: 'Continuous learning is key to sustainability leadership.',
            impactScore: 7,
            type: 'learning',
            route: '/sys/academy'
        });

        // 3. System check
        fallback.push({
            id: 'fallback-3',
            action: 'Check System Health',
            rationale: 'Ensure all modules are operating within normal parameters.',
            impactScore: 6,
            type: 'system_health',
            route: '/sys/health-check'
        });

        return fallback;
    }
}

export const smartRecommendationService = SmartRecommendationService.getInstance();
