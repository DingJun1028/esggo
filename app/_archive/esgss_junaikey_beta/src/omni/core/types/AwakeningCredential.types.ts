/**
 * 📜 Awakening Credential Types
 * --------------------------------------------------
 * [Philosophy] 果證 — The crystallized proof of spiritual/knowledge attainment
 * [Mechanism] Verifiable on-chain credentials anchored by SHA-256
 * [Protocol] 5T audit snapshot + rank evaluation
 */

/**
 * 🏅 Awakening Rank Hierarchy
 * Each rank represents a stage of knowledge-asset maturity.
 */
export enum AwakeningRank {
    /** 初心者 — Beginning the journey */
    INITIATE = 'INITIATE',
    /** 精修者 — Deepening practice */
    ADEPT = 'ADEPT',
    /** 宗師 — Mastery achieved */
    MASTER = 'MASTER',
    /** 超越者 — Transcended ordinary limits */
    TRANSCENDED = 'TRANSCENDED',
    /** 無作妙德 — Actionless Sublime Virtue: the highest attainment */
    ACTIONLESS_VIRTUE = 'ACTIONLESS_VIRTUE',
}

/**
 * 📊 5T Audit Snapshot: Frozen state at credential issuance
 */
export interface I5TAuditSnapshot {
    readonly tangible: boolean;
    readonly traceable: boolean;
    readonly trackable: boolean;
    readonly transparent: boolean;
    readonly trustworthy: boolean;
    readonly completionRate: number;   // 0-5 count of passed gates
    readonly auditTimestamp: number;
}

/**
 * 📜 Awakening Credential: The verifiable proof of attainment
 */
export interface IAwakeningCredential {
    readonly credentialId: string;       // Unique credential identifier
    readonly holderUuid: string;         // Owner's InfoOne UUID
    readonly rank: AwakeningRank;        // Achieved rank
    readonly audit: I5TAuditSnapshot;    // 5T state at issuance
    readonly virtueSnapshot: {           // Virtue state at issuance
        readonly intelligence: number;
        readonly benevolence: number;
        readonly integrity: number;
        readonly courage: number;
        readonly temperance: number;
        readonly harmony: number;
    };
    readonly awakeningCount: number;     // Total awakenings at issuance
    readonly sealHash: string;           // SHA-256 seal of credential payload
    readonly issuedAt: number;           // Issuance timestamp
    readonly expiresAt?: number;         // Optional expiry (credentials may be eternal)
}

/**
 * ✅ Credential Verification Result
 */
export interface ICredentialVerification {
    readonly isValid: boolean;
    readonly integrityMatch: boolean;    // Re-computed hash matches sealHash
    readonly isExpired: boolean;
    readonly verifiedAt: number;
    readonly details: string;
}
