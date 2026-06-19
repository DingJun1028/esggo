/**
 * 🧛 OmniAvatarService
 * Minimal version for debugging
 */

import { avatarOrchestrator } from './OmniAvatarOrchestrator.js';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';
import { getSupabase } from '../lib/supabase.js';
import { resonanceAnalytics } from './ResonanceAnalyticsService.js';
import { omniKnowledgeBase, KnowledgeCategory } from './OmniKnowledgeBase.js';

export class OmniAvatarService {
    private static instance: OmniAvatarService;

    private constructor() {
        omniLogger.info(LogCategory.SYSTEM, '🧛 OmniAvatarService Initialized');
    }

    public static getInstance(): OmniAvatarService {
        if (!OmniAvatarService.instance) {
            OmniAvatarService.instance = new OmniAvatarService();
        }
        return OmniAvatarService.instance;
    }

    public async syncPersonaWithSupabase(agentId: string): Promise<void> {
        try {
            const supabase = getSupabase();
            const avatar = await avatarOrchestrator.getActiveAvatar(agentId);
            if (!avatar) {
                omniLogger.warn(LogCategory.SYSTEM, `No active avatar found for agent ${agentId} to sync`);
                return;
            }

            // Fetch resonance metrics as ActiveAvatar doesn't store it directly
            const metrics = await resonanceAnalytics.getComprehensiveMetrics(agentId);

            const { error } = await supabase
                .from('omni_avatars' as any)
                .upsert({
                    agent_id: agentId,
                    persona: avatar.currentPersona,
                    level: avatar.level,
                    experience: avatar.experience,
                    resonance: metrics.internalResonance,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            omniLogger.info(LogCategory.SYSTEM, `Successfully synced persona for agent ${agentId} to Supabase`);
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, `Failed to sync persona for agent ${agentId}`, { error });
        }
    }

    public async getPersonalizedResonance(agentId: string): Promise<number> {
        try {
            const metrics = await resonanceAnalytics.getComprehensiveMetrics(agentId);
            return metrics.internalResonance;
        } catch (error) {
            omniLogger.warn(LogCategory.SYSTEM, `Failed to get personalized resonance for agent ${agentId}, defaulting to 0`, { error });
            return 0;
        }
    }

    public async triggerKnowledgeCrystallization(agentId: string): Promise<void> {
        try {
            const metrics = await resonanceAnalytics.getComprehensiveMetrics(agentId);
            if (metrics.internalResonance > 0.8) {
                const avatar = await avatarOrchestrator.getActiveAvatar(agentId);
                if (avatar) {
                    await omniKnowledgeBase.createKnowledge({
                        title: `Crystallized Essence of ${avatar.currentPersona}`,
                        content: `Insight generated through high resonance (${(metrics.internalResonance * 100).toFixed(2)}%) for ${avatar.currentPersona}.`,
                        category: KnowledgeCategory.INSIGHT,
                        authorId: agentId,
                        tags: ['crystallization', avatar.currentPersona.toLowerCase()]
                    });
                    omniLogger.info(LogCategory.KNOWLEDGE, `Knowledge crystallized for agent ${agentId}`);
                }
            }
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, `Failed to trigger knowledge crystallization for agent ${agentId}`, { error });
        }
    }
}

export const omniAvatarService = OmniAvatarService.getInstance();
