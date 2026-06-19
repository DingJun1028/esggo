/**
 * OmniSpace CRM Integration Types
 * 
 * Type definitions for bi-directional sync between InfoOne game system
 * and OmniSpace CRM platform.
 */

// ============================================================================
// Configuration
// ============================================================================

export interface OmniSpaceConfig {
    systemKey: string;
    apiToken: string;
    baseUrl: string;
    webhookSecret?: string;
    syncEnabled: boolean;
    syncIntervalMs: number;
}

// ============================================================================
// CRM Entity Types
// ============================================================================

/**
 * OmniSpace Contact (mapped from game_players)
 */
export interface OmniSpaceContact {
    id?: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    custom_fields: {
        game_level?: number;
        xp?: number;
        environmental_score?: number;
        social_score?: number;
        governance_score?: number;
        innovation_score?: number;
        village_entropy?: number;
    };
    created_at?: string;
    updated_at?: string;
}

/**
 * OmniSpace Badge (mapped from game_achievements)
 */
export interface OmniSpaceBadge {
    id?: string;
    name: string;
    description?: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    contact_id: string;
    earned_at: string;
    metadata?: Record<string, any>;
}

/**
 * OmniSpace Activity (mapped from game_battle_history)
 */
export interface OmniSpaceActivity {
    id?: string;
    type: 'battle' | 'training' | 'quest';
    name: string;
    description?: string;
    contact_id: string;
    result: 'win' | 'loss' | 'draw';
    xp_earned: number;
    rewards?: Record<string, any>;
    created_at: string;
}

/**
 * OmniSpace Asset (mapped from game_card_collections)
 */
export interface OmniSpaceAsset {
    id?: string;
    name: string;
    type: 'strategy' | 'response' | 'event';
    category: 'environmental' | 'social' | 'governance';
    rarity: 'legendary' | 'epic' | 'rare' | 'uncommon' | 'common';
    power: number;
    contact_id: string;
    iso_reference?: string;
    acquired_at: string;
}

/**
 * OmniSpace Document (mapped from evidence_vault)
 */
export interface OmniSpaceDocument {
    id?: string;
    name: string;
    type: 'pdf' | 'image' | 'excel' | 'word';
    size_bytes: number;
    contact_id: string;
    file_hash: string;
    is_locked: boolean;
    verification_status: 'pending' | 'verified' | 'rejected';
    uploaded_at: string;
}

// ============================================================================
// Webhook Types
// ============================================================================

export type OmniSpaceWebhookEvent =
    | 'contact.created'
    | 'contact.updated'
    | 'contact.deleted'
    | 'badge.created'
    | 'activity.created'
    | 'custom_field.updated';

export interface OmniSpaceWebhook {
    event: OmniSpaceWebhookEvent;
    data: any;
    timestamp: string;
    signature?: string;
}

// ============================================================================
// Sync Operation Types
// ============================================================================

export type SyncDirection = 'to_crm' | 'from_crm';
export type SyncStatus = 'success' | 'failed' | 'conflict' | 'pending';
export type SyncEntityType = 'player' | 'achievement' | 'battle' | 'card' | 'evidence';

export interface SyncResult {
    success: boolean;
    omni_space_id?: string;
    error?: string;
    conflict?: boolean;
    conflictData?: ConflictData;
}

export interface ConflictData {
    field: string;
    local_value: any;
    remote_value: any;
    local_updated_at: string;
    remote_updated_at: string;
    resolution: 'local_wins' | 'remote_wins' | 'manual_required';
}

export interface SyncLogEntry {
    id: string;
    entity_type: SyncEntityType;
    entity_id: string;
    omni_space_id?: string;
    sync_direction: SyncDirection;
    sync_status: SyncStatus;
    conflict_data?: ConflictData;
    error_message?: string;
    synced_at: Date;
    created_at: Date;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface OmniSpaceApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
}

export interface BulkSyncRequest {
    entity_type: SyncEntityType;
    entity_ids: string[];
    force?: boolean;  // Force re-sync even if already synced
}

export interface BulkSyncResponse {
    total: number;
    succeeded: number;
    failed: number;
    results: SyncResult[];
}

export interface SyncStatusResponse {
    entity_id: string;
    omni_space_id?: string;
    last_synced_at?: Date;
    sync_status: SyncStatus;
    pending_conflicts?: ConflictData[];
}

// ============================================================================
// Conflict Resolution Types
// ============================================================================

export interface ConflictResolutionStrategy {
    defaultStrategy: 'last_write_wins' | 'manual_review';
    fieldOverrides?: Record<string, 'local_priority' | 'remote_priority' | 'never_sync'>;
}

export const DEFAULT_CONFLICT_STRATEGY: ConflictResolutionStrategy = {
    defaultStrategy: 'last_write_wins',
    fieldOverrides: {
        // Blockchain fields never sync from CRM
        'blockchain_hash': 'never_sync',
        'skill_passport': 'never_sync',

        // Player decisions take priority locally
        'learned_strategies': 'local_priority',
        'decision_patterns': 'local_priority',

        // Admin adjustments in CRM take priority
        'village_entropy': 'remote_priority',
    },
};
