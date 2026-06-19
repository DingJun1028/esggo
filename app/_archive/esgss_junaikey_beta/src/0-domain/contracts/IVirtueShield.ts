/**
 * 🧘 IVirtueShield: Actionless Virtue Shield Contract
 * --------------------------------------------------
 * [Philosophy] 無作妙德 — Actionless Sublime Virtue
 * [Mechanism] Passive detection & self-healing, embodying "Wu-Tong-Zi-Tong" (無通自通)
 * [Protocol] 5T Logic Gate integrity scanning + virtue balance monitoring
 */

/** Severity levels for detected anomalies */
export type AnomalySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/** Dimension where anomaly was detected */
export type AnomalyDimension =
    | 'TANGIBLE'
    | 'TRACEABLE'
    | 'TRACKABLE'
    | 'TRANSPARENT'
    | 'TRUSTWORTHY'
    | 'VIRTUE_BALANCE'
    | 'RESONANCE';

/**
 * 🔍 Virtue Anomaly: A single detected deviation
 */
export interface IVirtueAnomaly {
    readonly dimension: AnomalyDimension;
    readonly description: string;
    readonly severity: AnomalySeverity;
    readonly deviation: number;       // 0-1 normalized deviation from norm
    readonly autoHealable: boolean;   // Can the shield self-repair this?
    readonly detectedAt: number;      // Timestamp
}

/**
 * 📋 Shield Diagnosis: Complete health report
 */
export interface IShieldDiagnosis {
    readonly anomalies: IVirtueAnomaly[];
    readonly healthScore: number;         // 0-100
    readonly isHealthy: boolean;          // healthScore >= 80
    readonly selfHealSuggestions: string[];
    readonly diagnosedAt: number;
    readonly shieldVersion: string;
}

/**
 * 🧘 Virtue Shield Interface
 * Passive guardian that scans, diagnoses, and self-heals without explicit invocation.
 */
export interface IVirtueShield {
    /** Passive scan: detects all anomalies without modifying state */
    diagnose(evidence: any, virtues: any, resonance?: number): IShieldDiagnosis;

    /** Self-healing: attempts to repair auto-healable anomalies */
    selfHeal(target: any, diagnosis: IShieldDiagnosis): number; // Returns count of healed items

    /** Quick health check */
    getHealthScore(evidence: any, virtues: any): number;
}
