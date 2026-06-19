/**
 * 🧠 JunAiKey Skills Service
 * 
 * The central nervous system for "Skills" - modular capabilities that can be triggered
 * via Natural Language (AI) or direct execution.
 * 
 * Replaces the legacy "Boost.Space Sync" with a more generic "Skill" architecture.
 * 
 * @module JunAiKeySkillsService
 */

import { supabase } from '../db/supabaseClient.js';
import axios, { AxiosInstance } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import OmniNoteService from './OmniNoteService.js';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface SkillDefinition {
    name: string;
    description: string;
    parameters: {
        [key: string]: {
            type: 'string' | 'number' | 'boolean';
            description: string;
            required: boolean;
        };
    };
    handler: (params: any) => Promise<SkillResult>;
}

export interface SkillResult {
    success: boolean;
    data?: any;
    message?: string;
    error?: string;
}

// OmniSpace Config (Skill Backend / 奧秘空間配置)
interface OmniSpaceConfig {
    systemKey: string;
    apiToken: string;
    baseUrl: string;
    syncEnabled: boolean;
}

const CONFIG: OmniSpaceConfig = {
    systemKey: process.env.OMNI_SPACE_SYSTEM_KEY || '',
    apiToken: process.env.OMNI_SPACE_API_KEY || '',
    baseUrl: process.env.OMNI_SPACE_BASE_URL || 'https://api.omni.space/v1',
    syncEnabled: process.env.OMNI_SPACE_SYNC_ENABLED === 'true',
};

// ============================================================================
// Service Implementation
// ============================================================================

export class JunAiKeySkillsService {
    private static instance: JunAiKeySkillsService;
    private skillRegistry: Map<string, SkillDefinition> = new Map();
    private apiClient: AxiosInstance;

    private constructor() {
        this.apiClient = axios.create({
            baseURL: CONFIG.baseUrl,
            headers: {
                'Authorization': `Bearer ${CONFIG.apiToken}`,
                'Content-Type': 'application/json',
                'X-System-Key': CONFIG.systemKey,
            },
            timeout: 30000,
        });

        this.registerCoreSkills();
    }

    public static getInstance(): JunAiKeySkillsService {
        if (!JunAiKeySkillsService.instance) {
            JunAiKeySkillsService.instance = new JunAiKeySkillsService();
        }
        return JunAiKeySkillsService.instance;
    }

    /**
     * Register a new skill capability
     */
    public registerSkill(skill: SkillDefinition) {
        this.skillRegistry.set(skill.name, skill);
        console.log(`[JunAiKey] Registered Skill: ${skill.name}`);
    }

    /**
     * Get all registered skills (for AI context)
     */
    public getRegistry(): SkillDefinition[] {
        return Array.from(this.skillRegistry.values());
    }

    /**
     * Execute a skill by name
     */
    public async executeSkill(name: string, params: any): Promise<SkillResult> {
        const skill = this.skillRegistry.get(name);
        if (!skill) {
            return {
                success: false,
                error: `Skill '${name}' not found. Available skills: ${Array.from(this.skillRegistry.keys()).join(', ')}`
            };
        }

        console.log(`[JunAiKey] Executing Skill: ${name}`, params);

        try {
            // Validate required params (basic check)
            for (const [paramName, paramDef] of Object.entries(skill.parameters)) {
                if (paramDef.required && params[paramName] === undefined) {
                    throw new Error(`Missing required parameter: ${paramName}`);
                }
            }

            return await skill.handler(params);
        } catch (error: any) {
            console.error(`[JunAiKey] Skill Execution Failed: ${name}`, error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ========================================================================
    // Internal Helper: Boost.Space Client Wrappers
    // ========================================================================

    private async boostSpacePost(endpoint: string, data: any): Promise<any> {
        if (!CONFIG.syncEnabled) throw new Error('Sync to Boost.Space is disabled in config.');
        const response = await this.apiClient.post(endpoint, data);
        return response.data;
    }

    // ========================================================================
    // Core Skills Registration
    // ========================================================================

    private registerCoreSkills() {
        // --- Skill: Sync Player Profile ---
        this.registerSkill({
            name: 'sync_player_profile',
            description: 'Synchronize a player\'s local profile data to the external CRM (Boost.Space).',
            parameters: {
                player_id: { type: 'string', description: 'The UUID of the player to sync', required: true }
            },
            handler: async (params) => {
                const { player_id } = params;

                // 1. Fetch Player
                const { data: player, error } = await supabase
                    .from('game_players')
                    .select('*')
                    .eq('id', player_id)
                    .single();

                if (error || !player) throw new Error('Player not found');

                // 2. Prepare Data
                const contactData = {
                    first_name: player.player_name.split(' ')[0] || player.player_name,
                    last_name: player.player_name.split(' ').slice(1).join(' ') || '',
                    custom_fields: {
                        game_level: player.level,
                        xp: player.xp,
                        // Add other fields as needed
                    }
                };

                // 3. Execute Sync (Create/Update)
                // Simplified logic for this skills version - normally handle ID check
                let resultId;
                if (player.boost_space_id) {
                    await this.apiClient.put(`/contacts/${player.boost_space_id}`, contactData);
                    resultId = player.boost_space_id;
                } else {
                    const res = await this.boostSpacePost('/contacts', contactData);
                    resultId = res.id;
                    await supabase.from('game_players').update({ boost_space_id: resultId }).eq('id', player_id);
                }

                return { success: true, message: `Player ${player.player_name} synced to CRM.`, data: { crm_id: resultId } };
            }
        });

        // --- Skill: Sync Achievement ---
        this.registerSkill({
            name: 'sync_achievement',
            description: 'Sync a specific unlocked achievement to the CRM as a Badge.',
            parameters: {
                achievement_id: { type: 'string', description: 'UUID of the achievement', required: true }
            },
            handler: async (params) => {
                const { achievement_id } = params;
                const { data: ach } = await supabase
                    .from('game_achievements')
                    .select('*, game_players(boost_space_id)')
                    .eq('id', achievement_id)
                    .single();

                if (!ach) throw new Error('Achievement not found');
                // @ts-ignore
                if (!ach.game_players?.boost_space_id) throw new Error('Player not linked to CRM yet');

                const badgeData = {
                    name: ach.achievement_name,
                    tier: ach.achievement_tier,
                    // @ts-ignore
                    contact_id: ach.game_players.boost_space_id,
                    earned_at: ach.updated_at
                };

                const res = await this.boostSpacePost('/badges', badgeData);

                // Update local record
                await supabase
                    .from('game_achievements')
                    .update({ boost_space_badge_id: res.id })
                    .eq('id', achievement_id);

                return { success: true, message: `Achievement synced as Badge.`, data: { badge_id: res.id } };
            }
        });

        // --- Skill: Generative Insight (Demo) ---
        this.registerSkill({
            name: 'generate_esg_insight',
            description: 'Generate a quick ESG insight for a specific domain using internal logic.',
            parameters: {
                domain: { type: 'string', description: 'Domain: Environmental, Social, or Governance', required: true }
            },
            handler: async (params) => {
                // Mock logic for demo
                const insights = [
                    "Reducing digital carbon footprint by 10% improves overall score by 5 points.",
                    "Community engagement metrics allow for predictive social risk modeling.",
                    "Transparent governance protocols increase stakeholder trust by 25%."
                ];
                const randomInsight = insights[Math.floor(Math.random() * insights.length)];
                return { success: true, message: `Insight Generated for ${params.domain}`, data: { insight: randomInsight } };
            }
        });

        // --- Skill: OmniNote Creation ---
        this.registerSkill({
            name: 'create_note',
            description: 'Create a new OmniNote (Knowledge Asset) with tags and auto-resonance.',
            parameters: {
                user_id: { type: 'string', description: 'Owner UUID', required: true },
                title: { type: 'string', description: 'Note Title', required: true },
                content: { type: 'string', description: 'Note Content', required: true },
                tags: { type: 'string', description: 'Comma-separated tags', required: false }
            },
            handler: async (params) => {
                const { user_id, title, content, tags } = params;
                const tagArray = tags ? tags.split(',').map((t: string) => t.trim()) : [];

                const note = await OmniNoteService.createNote(user_id, title, content, tagArray);

                return {
                    success: true,
                    message: `Note "${title}" created and resonated.`,
                    data: { note_id: note.uuid, resonance: note.resonance }
                };
            }
        });

        // --- Skill: Spontaneous Resonance ---
        this.registerSkill({
            name: 'find_resonance',
            description: 'Find spontaneously linked notes/assets based on a source note.',
            parameters: {
                user_id: { type: 'string', description: 'Owner UUID', required: true },
                note_id: { type: 'string', description: 'Source Note UUID', required: true }
            },
            handler: async (params) => {
                const { user_id, note_id } = params;
                const links = await OmniNoteService.findResonance(user_id, note_id);

                return {
                    success: true,
                    message: `Found ${links.length} resonant links.`,
                    data: { links }
                };
            }
        });
    }
}
