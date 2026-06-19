/**
 * 🔄 OmniSync Service (Unified Sync Framework)
 * --------------------------------------------------
 * [功能] OmniInfoOne ↔ External Systems (e.g. CRM, Boost.Space) 雙向同步服務
 * [本質] 建立在 5T Protocol 基礎上的智慧同步心核
 */

import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import { supabase } from '../db/supabaseClient.js';
import {
    OmniSpaceConfig as OmniSyncConfig,
    OmniSpaceContact as OmniSyncContact,
    OmniSpaceBadge as OmniSyncBadge,
    OmniSpaceActivity as OmniSyncActivity,
    OmniSpaceAsset as OmniSyncAsset,
    OmniSpaceDocument as OmniSyncDocument,
    SyncResult,
    SyncLogEntry,
    ConflictData,
} from '../../src/types/esg-go/omni-sync.types.js';

import { DEFAULT_CONFLICT_STRATEGY } from '../../src/types/esg-go/omni-sync.types.js';
import { omniLogger, LogCategory } from '../../src/omni/infrastructure/logging/OmniLogger.js';
import { omniCircleService } from './OmniCircleService.js';

// ============================================================================
// Configuration
// ============================================================================

const CONFIG: OmniSyncConfig = {
    systemKey: process.env.OMNI_SYNC_SYSTEM_KEY || process.env.BOOST_SPACE_SYSTEM_KEY || '',
    apiToken: process.env.OMNI_SYNC_API_KEY || process.env.BOOST_SPACE_API_KEY || '',
    baseUrl: process.env.OMNI_SYNC_BASE_URL || process.env.BOOST_SPACE_BASE_URL || 'https://api.boost.space/v1',
    webhookSecret: process.env.OMNI_SYNC_WEBHOOK_SECRET || process.env.BOOST_SPACE_WEBHOOK_SECRET || '',
    syncEnabled: process.env.OMNI_SYNC_ENABLED === 'true' || process.env.BOOST_SPACE_SYNC_ENABLED === 'true',
    syncIntervalMs: parseInt(process.env.OMNI_SYNC_INTERVAL_MS || process.env.BOOST_SPACE_SYNC_INTERVAL_MS || '3600000'),
};

// ============================================================================
// OmniSync API Client
// ============================================================================

class OmniSyncApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: `${CONFIG.baseUrl}`,
            headers: {
                'Authorization': `Bearer ${CONFIG.apiToken}`,
                'Content-Type': 'application/json',
                'X-System-Key': CONFIG.systemKey,
            },
            timeout: 30000,
        });
    }

    // ========== Contacts ==========

    async createContact(contact: OmniSyncContact): Promise<string> {
        const response = await this.client.post('/contacts', contact);
        return response.data.id;
    }

    async updateContact(id: string, contact: Partial<OmniSyncContact>): Promise<void> {
        await this.client.put(`/contacts/${id}`, contact);
    }

    async getContact(id: string): Promise<OmniSyncContact> {
        const response = await this.client.get(`/contacts/${id}`);
        return response.data;
    }

    async deleteContact(id: string): Promise<void> {
        await this.client.delete(`/contacts/${id}`);
    }

    // ========== Badges ==========

    async createBadge(badge: OmniSyncBadge): Promise<string> {
        const response = await this.client.post('/badges', badge);
        return response.data.id;
    }

    // ========== Activities ==========

    async createActivity(activity: OmniSyncActivity): Promise<string> {
        const response = await this.client.post('/activities', activity);
        return response.data.id;
    }

    // ========== Assets ==========

    async createAsset(asset: OmniSyncAsset): Promise<string> {
        const response = await this.client.post('/assets', asset);
        return response.data.id;
    }

    // ========== Documents ==========

    async createDocument(document: OmniSyncDocument): Promise<string> {
        const response = await this.client.post('/documents', document);
        return response.data.id;
    }
}

// ============================================================================
// Sync Service
// ============================================================================

export class OmniSyncService {
    private static apiClient = new OmniSyncApiClient();

    /**
     * 🔔 Sync Event Hook (Circle Aggregation)
     */
    private static async onSyncEvent(entity: string, id: string): Promise<void> {
        omniLogger.info(LogCategory.SYSTEM, `[OmniSync] Event triggered for ${entity}:${id}. Informing OmniCircle...`);
        try {
            await omniCircleService.sync();
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, `[OmniSync] Failed to trigger OmniCircle sync`, { error });
        }
    }

    // ========== Player → Contact Sync ==========

    /**
     * Sync player profile to OmniSync Contact
     */
    static async syncPlayerToContact(playerId: string): Promise<SyncResult> {
        if (!CONFIG.syncEnabled) {
            return { success: false, error: 'Sync disabled' };
        }

        try {
            // 1. Fetch player data
            const { data: player, error: fetchError } = await supabase
                .from('game_players')
                .select('*')
                .eq('id', playerId)
                .single();

            if (fetchError || !player) {
                throw new Error('Player not found');
            }

            // 2. Map to Contact format
            const contact: OmniSyncContact = {
                first_name: player.player_name.split(' ')[0] || player.player_name,
                last_name: player.player_name.split(' ').slice(1).join(' ') || '',
                custom_fields: {
                    game_level: player.level,
                    xp: player.xp,
                    environmental_score: player.environmental_affinity,
                    social_score: player.social_affinity,
                    governance_score: player.governance_affinity,
                    innovation_score: player.innovation_affinity,
                    village_entropy: parseFloat(player.village_entropy || '0'),
                },
            };

            // 3. Create or update in CRM
            let omniSpaceId: string;

            if (player.boost_space_id) {
                // Update existing
                await this.apiClient.updateContact(player.boost_space_id, contact);
                omniSpaceId = player.boost_space_id;
            } else {
                // Create new
                omniSpaceId = await this.apiClient.createContact(contact);

                // Save boost_space_id back to player
                await supabase
                    .from('game_players')
                    .update({
                        boost_space_id: omniSpaceId,
                        boost_space_sync_status: 'synced',
                        boost_space_last_sync: new Date().toISOString(),
                    })
                    .eq('id', playerId);
            }

            // 4. Log sync
            await this.logSync({
                entity_type: 'player',
                entity_id: playerId,
                omni_space_id: omniSpaceId,
                sync_direction: 'to_crm',
                sync_status: 'success',
            });

            // 5. Trigger Circle Aggregation
            await OmniSyncService.onSyncEvent('player', playerId);

            return { success: true, omni_space_id: omniSpaceId };
        } catch (error: any) {
            // Log failed sync
            await this.logSync({
                entity_type: 'player',
                entity_id: playerId,
                sync_direction: 'to_crm',
                sync_status: 'failed',
                error_message: error.message,
            });

            return { success: false, error: error.message };
        }
    }

    /**
     * Sync Contact update back to player
     */
    static async syncContactToPlayer(contactId: string): Promise<SyncResult> {
        if (!CONFIG.syncEnabled) {
            return { success: false, error: 'Sync disabled' };
        }

        try {
            // 1. Fetch from CRM
            const contact = await this.apiClient.getContact(contactId);

            // 2. Find matching player
            const { data: player } = await supabase
                .from('game_players')
                .select('*')
                .eq('boost_space_id', contactId)
                .single();

            if (!player) {
                throw new Error('Player not found for contact');
            }

            // 3. Conflict detection
            const localUpdatedAt = new Date(player.updated_at);
            const remoteUpdatedAt = new Date(contact.updated_at || new Date());

            const conflicts: ConflictData[] = [];

            // Check for field conflicts
            const fieldsToCheck = ['level', 'xp', 'village_entropy'] as const;
            for (const field of fieldsToCheck) {
                const localValue = player[field];
                const remoteValue = contact.custom_fields?.[`game_${field}` as keyof typeof contact.custom_fields] || contact.custom_fields?.[field as keyof typeof contact.custom_fields];

                if (localValue !== remoteValue && remoteValue !== undefined) {
                    const strategy = (DEFAULT_CONFLICT_STRATEGY.fieldOverrides?.[field as keyof typeof DEFAULT_CONFLICT_STRATEGY.fieldOverrides] ||
                        DEFAULT_CONFLICT_STRATEGY.defaultStrategy) as any;

                    if (strategy === 'never_sync') {
                        continue; // Skip this field
                    }

                    conflicts.push({
                        field,
                        local_value: localValue,
                        remote_value: remoteValue,
                        local_updated_at: localUpdatedAt.toISOString(),
                        remote_updated_at: remoteUpdatedAt.toISOString(),
                        resolution: localUpdatedAt > remoteUpdatedAt ? 'local_wins' : 'remote_wins',
                    });
                }
            }

            // 4. If conflicts detected, log and handle
            if (conflicts.length > 0) {
                await this.logSync({
                    entity_type: 'player',
                    entity_id: player.id,
                    omni_space_id: contactId,
                    sync_direction: 'from_crm',
                    sync_status: 'conflict',
                    conflict_data: conflicts[0],
                });

                return { success: false, conflict: true, conflictData: conflicts[0] };
            }

            // 5. Update player (no conflicts)
            const updates: any = {
                player_name: `${contact.first_name} ${contact.last_name}`.trim(),
                boost_space_last_sync: new Date().toISOString(),
            };

            if (contact.custom_fields?.game_level) updates.level = contact.custom_fields.game_level;
            if (contact.custom_fields?.xp) updates.xp = contact.custom_fields.xp;

            await supabase
                .from('game_players')
                .update(updates)
                .eq('id', player.id);

            // 6. Log success
            await this.logSync({
                entity_type: 'player',
                entity_id: player.id,
                omni_space_id: contactId,
                sync_direction: 'from_crm',
                sync_status: 'success',
            });

            // 7. Trigger Circle Aggregation
            await OmniSyncService.onSyncEvent('player', player.id);

            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Sync achievement to OmniSpace Badge
     */
    static async syncAchievementToBadge(achievementId: string): Promise<SyncResult> {
        if (!CONFIG.syncEnabled) {
            return { success: false, error: 'Sync disabled' };
        }

        try {
            const { data: achievement } = await supabase
                .from('game_achievements')
                .select(`
          *,
          game_players!inner(boost_space_id)
        `)
                .eq('id', achievementId)
                .single();

            if (!achievement || !achievement.game_players?.boost_space_id) {
                throw new Error('Achievement or player contact not found');
            }

            // Only sync if unlocked
            if (!achievement.is_unlocked) {
                return { success: false, error: 'Achievement not unlocked yet' };
            }

            const badge: OmniSyncBadge = {
                name: achievement.achievement_name,
                tier: achievement.achievement_tier,
                contact_id: achievement.game_players.boost_space_id,
                earned_at: achievement.updated_at,
            };

            const omniSpaceId = await this.apiClient.createBadge(badge);

            // Update achievement
            await supabase
                .from('game_achievements')
                .update({ boost_space_badge_id: omniSpaceId })
                .eq('id', achievementId);

            await this.logSync({
                entity_type: 'achievement',
                entity_id: achievementId,
                omni_space_id: omniSpaceId,
                sync_direction: 'to_crm',
                sync_status: 'success',
            });

            // Trigger Circle Aggregation
            await OmniSyncService.onSyncEvent('achievement', achievementId);

            return { success: true, omni_space_id: omniSpaceId };
        } catch (error: any) {
            await this.logSync({
                entity_type: 'achievement',
                entity_id: achievementId,
                sync_direction: 'to_crm',
                sync_status: 'failed',
                error_message: error.message,
            });

            return { success: false, error: error.message };
        }
    }

    /**
     * Sync battle to OmniSpace Activity
     */
    static async syncBattleToActivity(battleId: string): Promise<SyncResult> {
        if (!CONFIG.syncEnabled) {
            return { success: false, error: 'Sync disabled' };
        }

        try {
            const { data: battle } = await supabase
                .from('game_battle_history')
                .select(`
          *,
          game_players!inner(boost_space_id)
        `)
                .eq('id', battleId)
                .single();

            if (!battle || !battle.game_players?.boost_space_id) {
                throw new Error('Battle or player contact not found');
            }

            const activity: OmniSyncActivity = {
                type: 'battle',
                name: `Battle vs ${battle.enemy_name}`,
                description: `${battle.battle_type} battle`,
                contact_id: battle.game_players.boost_space_id,
                result: battle.result,
                xp_earned: battle.xp_earned,
                rewards: battle.cards_earned,
                created_at: battle.created_at,
            };

            const omniSpaceId = await this.apiClient.createActivity(activity);

            await supabase
                .from('game_battle_history')
                .update({ boost_space_activity_id: omniSpaceId })
                .eq('id', battleId);

            await this.logSync({
                entity_type: 'battle',
                entity_id: battleId,
                omni_space_id: omniSpaceId,
                sync_direction: 'to_crm',
                sync_status: 'success',
            });

            // Trigger Circle Aggregation
            await OmniSyncService.onSyncEvent('battle', battleId);

            return { success: true, omni_space_id: omniSpaceId };
        } catch (error: any) {
            await this.logSync({
                entity_type: 'battle',
                entity_id: battleId,
                sync_direction: 'to_crm',
                sync_status: 'failed',
                error_message: error.message,
            });

            return { success: false, error: error.message };
        }
    }

    private static async logSync(entry: Partial<SyncLogEntry>): Promise<void> {
        await supabase.from('omni_sync_log').insert({
            entity_type: entry.entity_type,
            entity_id: entry.entity_id,
            omni_space_id: entry.omni_space_id,
            sync_direction: entry.sync_direction,
            sync_status: entry.sync_status,
            conflict_data: entry.conflict_data,
            error_message: entry.error_message,
        });
    }

    /**
     * Sync card to OmniSpace Asset
     */
    static async syncCardToAsset(cardId: string): Promise<SyncResult> {
        if (!CONFIG.syncEnabled) {
            return { success: false, error: 'Sync disabled' };
        }

        try {
            const { data: card } = await supabase
                .from('game_card_collections')
                .select(`
          *,
          game_players!inner(boost_space_id)
        `)
                .eq('id', cardId)
                .single();

            if (!card || !card.game_players?.boost_space_id) {
                throw new Error('Card or player contact not found');
            }

            const asset: OmniSyncAsset = {
                name: card.card_name,
                type: card.card_type,
                category: card.category,
                rarity: card.rarity,
                power: card.power,
                contact_id: card.game_players.boost_space_id,
                iso_reference: card.iso_reference,
                acquired_at: card.acquired_at,
            };

            const omniSpaceId = await this.apiClient.createAsset(asset);

            // Update card
            await supabase
                .from('game_card_collections')
                .update({ boost_space_asset_id: omniSpaceId })
                .eq('id', cardId);

            await this.logSync({
                entity_type: 'card',
                entity_id: cardId,
                omni_space_id: omniSpaceId,
                sync_direction: 'to_crm',
                sync_status: 'success',
            });

            // Trigger Circle Aggregation
            await OmniSyncService.onSyncEvent('card', cardId);

            return { success: true, omni_space_id: omniSpaceId };
        } catch (error: any) {
            await this.logSync({
                entity_type: 'card',
                entity_id: cardId,
                sync_direction: 'to_crm',
                sync_status: 'failed',
                error_message: error.message,
            });

            return { success: false, error: error.message };
        }
    }

    /**
     * Sync evidence to OmniSpace Document
     */
    static async syncEvidenceToDocument(evidenceId: string): Promise<SyncResult> {
        if (!CONFIG.syncEnabled) {
            return { success: false, error: 'Sync disabled' };
        }

        try {
            const { data: evidence } = await supabase
                .from('evidence_vault')
                .select('*')
                .eq('id', evidenceId)
                .single();

            if (!evidence) {
                throw new Error('Evidence not found');
            }

            // Get player's boost_space_id via user_id
            const { data: player } = await supabase
                .from('game_players')
                .select('boost_space_id')
                .eq('user_id', evidence.user_id)
                .single();

            if (!player?.boost_space_id) {
                throw new Error('Player contact not found for evidence owner');
            }

            const document: OmniSyncDocument = {
                name: evidence.file_name,
                type: evidence.file_type,
                size_bytes: evidence.file_size,
                contact_id: player.boost_space_id,
                file_hash: evidence.file_hash,
                is_locked: evidence.is_locked,
                verification_status: evidence.verification_status,
                uploaded_at: evidence.created_at,
            };

            const omniSpaceId = await this.apiClient.createDocument(document);

            // Update evidence
            await supabase
                .from('evidence_vault')
                .update({ boost_space_document_id: omniSpaceId })
                .eq('id', evidenceId);

            await this.logSync({
                entity_type: 'evidence',
                entity_id: evidenceId,
                omni_space_id: omniSpaceId,
                sync_direction: 'to_crm',
                sync_status: 'success',
            });

            // Trigger Circle Aggregation
            await OmniSyncService.onSyncEvent('evidence', evidenceId);

            return { success: true, omni_space_id: omniSpaceId };
        } catch (error: any) {
            await this.logSync({
                entity_type: 'evidence',
                entity_id: evidenceId,
                sync_direction: 'to_crm',
                sync_status: 'failed',
                error_message: error.message,
            });

            return { success: false, error: error.message };
        }
    }


    // ========== Bulk Operations ==========

    static async bulkSyncPlayers(playerIds: string[]): Promise<SyncResult[]> {
        const results: SyncResult[] = [];

        for (const playerId of playerIds) {
            const result = await this.syncPlayerToContact(playerId);
            results.push(result);
        }

        return results;
    }

    static async bulkSyncCards(cardIds: string[]): Promise<SyncResult[]> {
        const results: SyncResult[] = [];

        for (const cardId of cardIds) {
            const result = await this.syncCardToAsset(cardId);
            results.push(result);
        }

        return results;
    }

    static async bulkSyncEvidence(evidenceIds: string[]): Promise<SyncResult[]> {
        const results: SyncResult[] = [];

        for (const evidenceId of evidenceIds) {
            const result = await this.syncEvidenceToDocument(evidenceId);
            results.push(result);
        }

        return results;
    }
    // ========== Sheduler & Sync Cycle ==========

    private static isSyncing = false;
    private static syncInterval: NodeJS.Timeout | null = null;

    static startScheduler() {
        if (!CONFIG.syncEnabled) {
            console.log('[OmniSync] Sync is disabled via configuration.');
            return;
        }

        if (this.syncInterval) {
            console.log('[OmniSync] Scheduler already running.');
            return;
        }

        console.log(`[OmniSync] Starting scheduler with interval: ${CONFIG.syncIntervalMs}ms`);

        // Initial run
        this.runSyncCycle();

        // Schedule periodic runs
        this.syncInterval = setInterval(() => {
            this.runSyncCycle();
        }, CONFIG.syncIntervalMs);
    }

    static stopScheduler() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
            console.log('[OmniSync] Scheduler stopped.');
        }
    }

    static async runSyncCycle() {
        if (this.isSyncing) {
            console.log('[OmniSync] Sync cycle already in progress, skipping.');
            return;
        }

        this.isSyncing = true;
        console.log('[OmniSync] Starting sync cycle...');

        try {
            await this.syncEverything();
            console.log('[OmniSync] Sync cycle completed successfully.');
        } catch (error) {
            console.error('[OmniSync] Sync cycle failed:', error);
        } finally {
            this.isSyncing = false;
        }
    }

    /**
     * Verify incoming webhook signature from OmniSpace CRM
     * @param payload Request body as string
     * @param signature Signature from X-Omni-Space-Signature header
     */
    static verifyWebhookSignature(payload: string, signature: string): boolean {
        if (!CONFIG.webhookSecret) {
            console.warn('[OmniSync] Webhook secret not configured. Skipping signature verification.');
            return true;
        }

        if (!signature) return false;

        try {
            const hmac = crypto.createHmac('sha256', CONFIG.webhookSecret);
            const digest = hmac.update(payload).digest('hex');

            return crypto.timingSafeEqual(
                Buffer.from(digest, 'hex'),
                Buffer.from(signature, 'hex')
            );
        } catch (error) {
            console.error('[OmniSync] Signature verification error:', error);
            return false;
        }
    }

    static async syncEverything() {
        // 1. Sync Players (Dirty Check)
        // Find players updated since last sync, or never synced
        const { data: players } = await supabase
            .from('game_players')
            .select('id, updated_at, omni_space_last_sync')
            .or('omni_space_last_sync.is.null,omni_space_last_sync.lt.updated_at')
            .limit(50);

        if (players && players.length > 0) {
            console.log(`[OmniSync] Found ${players.length} dirty players to sync.`);
            await this.bulkSyncPlayers(players.map((p: any) => p.id));
        }

        // 2. Sync Evidence (Dirty Check)
        const { data: evidence } = await supabase
            .from('evidence_vault')
            .select('id')
            .eq('status', 'active')
            .is('omni_space_document_id', null)
            .limit(50);

        if (evidence && evidence.length > 0) {
            console.log(`[OmniSync] Found ${evidence.length} unsynced evidence to sync.`);
            await this.bulkSyncEvidence(evidence.map((e: any) => e.id));
        }

        // 3. Sync Cards (Dirty Check)
        const { data: cards } = await supabase
            .from('game_card_collections')
            .select('id')
            .is('omni_space_asset_id', null)
            .limit(50);

        if (cards && cards.length > 0) {
            console.log(`[OmniSync] Found ${cards.length} unsynced cards to sync.`);
            await this.bulkSyncCards(cards.map((c: any) => c.id));
        }
    }
}
