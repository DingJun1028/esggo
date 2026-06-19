/**
 * 💡 InfoOneCore: The 5T DNA Protocol
 * --------------------------------------------------
 * 1. Tangible (可感知): impactMetric, visualFeedback
 * 2. Traceable (可溯源): uuid, source_origin
 * 3. Trackable (可追蹤): lifecycle_hooks
 * 4. Transparent (可透明): formula, validation_logic
 * 5. Trustworthy (不可篡改): hash_lock, status
 */

export enum TruthStatus {
    TANGIBLE = "Tangible",
    TRACEABLE = "Traceable",
    TRACKABLE = "Trackable",
    TRANSPARENT = "Transparent",
    TRUSTWORTHY = "Trustworthy"
}

export interface IInfoOneDNA {
    /** [Traceable] Idempotent identity. UUIDv5 suggested. */
    readonly uuid: string;

    /** [Traceable] Immutable source of truth (URL, File Path, API endpoint). */
    readonly source_origin: string;

    /** [Trackable] Creation timestamp. */
    readonly timestamp: number;

    /** [Trustworthy] SHA-256 integrity seal. */
    readonly hash_lock: string;

    /** [Trustworthy] Current state in the 5T lifecycle. */
    readonly status: TruthStatus;

    /** [Transparent] Mathematical or logical formula used for derivation. */
    readonly formula?: string;

    /** [Tangible] Human-readable impact or visual indicator. */
    readonly impact_metric?: string;

    /** [Tangible] The actual data or content being protected. */
    readonly content: string;

    /** [Trackable] History of transitions. */
    readonly lifecycle_history: ILifecycleEvent[];
}

export interface ILifecycleEvent {
    timestamp: number;
    action: string;
    actor: string; // The service or user who performed the action
    notes?: string;
}

/**
 * Global Metadata for all components following the Sacred Covenant.
 */
export interface IComponentCore extends IInfoOneDNA {
    /** 
     * [Trustworthy] Final seal execution. 
     * Once locked, the object MUST be frozen and unmodifiable.
     */
    lock(): void;

    /**
     * [Transparent] Verify the integrity of the object.
     */
    verify(): boolean;
}
