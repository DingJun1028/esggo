/**
 * 🧘 ActionlessVirtueShield: 無作妙德守護層
 * --------------------------------------------------
 * [Philosophy] "Water benefits all things and does not compete" — 上善若水
 * [Mechanism] Passive detection & self-healing without explicit intervention
 * [Protocol] 5T Logic Gate integrity + Virtue balance + Resonance monitoring
 *
 * The Shield does not act; it simply IS. Anomalies resolve through natural
 * alignment, embodying 「無通自通」(Wu-Tong-Zi-Tong: self-communicating without effort).
 */

import type {
    IVirtueShield,
    IVirtueAnomaly,
    IShieldDiagnosis,
    AnomalySeverity,
} from '../../0-domain/contracts/IVirtueShield.ts';
import type { IEvidenceMap, IMeritProfile10 } from '../../0-domain/contracts/IComponentCore.ts';
import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';

const SHIELD_VERSION = 'v1.0.0-Actionless';
const HEALTH_THRESHOLD = 80;
const RESONANCE_MIN = 0.3;
const VIRTUE_DEVIATION_THRESHOLD = 3.0; // Max allowed std-dev among virtues

export class ActionlessVirtueShield implements IVirtueShield {
    /**
     * 🔍 Passive Diagnosis
     * --------------------------------------------------
     * Scans evidence map, virtue profile, and resonance without side effects.
     * Pure function: does not modify any input state.
     */
    public diagnose(
        evidence: IEvidenceMap,
        virtues: IMeritProfile10,
        resonance: number = 1.0
    ): IShieldDiagnosis {
        const anomalies: IVirtueAnomaly[] = [];
        const now = Date.now();

        // ─── 5T Gate Integrity Scan ───
        this.scan5TGate(evidence, anomalies, now);

        // ─── Virtue Balance Scan ───
        this.scanVirtueBalance(virtues, anomalies, now);

        // ─── Resonance Decay Scan ───
        this.scanResonance(resonance, anomalies, now);

        // ─── Calculate Health Score ───
        const healthScore = this.calculateHealthScore(anomalies);
        const isHealthy = healthScore >= HEALTH_THRESHOLD;

        const diagnosis: IShieldDiagnosis = {
            anomalies,
            healthScore,
            isHealthy,
            selfHealSuggestions: anomalies
                .filter(a => a.autoHealable)
                .map(a => `[${a.dimension}] ${a.description}`),
            diagnosedAt: now,
            shieldVersion: SHIELD_VERSION,
        };

        if (!isHealthy) {
            omniLogger.warn(
                LogCategory.VALIDATION,
                `[ActionlessShield] 🧘 Health: ${healthScore}/100 | Anomalies: ${anomalies.length}`
            );
        } else {
            omniLogger.debug(
                LogCategory.VALIDATION,
                `[ActionlessShield] 🧘 All clear. Health: ${healthScore}/100`
            );
        }

        return diagnosis;
    }

    /**
     * 🌿 Self-Heal: Non-destructive repair
     * --------------------------------------------------
     * Attempts to fix auto-healable anomalies by patching missing or decayed fields.
     * Embodies「無為而治」— governing through non-action.
     */
    public selfHeal(target: any, diagnosis: IShieldDiagnosis): number {
        const healable = diagnosis.anomalies.filter(a => a.autoHealable);
        let healed = 0;

        for (const anomaly of healable) {
            try {
                switch (anomaly.dimension) {
                    case 'TRACKABLE':
                        // Restore missing lifecycle hooks array
                        if (target.evidence && !target.evidence.trackable?.lifecycle_hooks) {
                            if (!target.evidence.trackable) {
                                (target.evidence as any).trackable = {};
                            }
                            (target.evidence.trackable as any).lifecycle_hooks = [];
                            (target.evidence.trackable as any).pathway = ['created', 'healed'];
                            healed++;
                            omniLogger.info(LogCategory.SYSTEM, `[ActionlessShield] 🌿 Healed: Trackable lifecycle hooks restored.`);
                        }
                        break;

                    case 'TRACEABLE':
                        // Restore missing source_origin
                        if (target.evidence && !target.evidence.traceable?.source_origin) {
                            if (!target.evidence.traceable) {
                                (target.evidence as any).traceable = {};
                            }
                            (target.evidence.traceable as any).source_origin = 'ActionlessShield/auto-healed';
                            healed++;
                            omniLogger.info(LogCategory.SYSTEM, `[ActionlessShield] 🌿 Healed: Traceable source_origin restored.`);
                        }
                        break;

                    case 'TANGIBLE':
                        // Restore missing tangible structure
                        if (target.evidence && !target.evidence.tangible) {
                            (target.evidence as any).tangible = {
                                metric: 'auto-healed',
                                visual_grade: 'GOLD',
                                glow_intensity: 50,
                                is_crystallized: false,
                            };
                            healed++;
                            omniLogger.info(LogCategory.SYSTEM, `[ActionlessShield] 🌿 Healed: Tangible metrics initialized.`);
                        }
                        break;

                    case 'TRANSPARENT':
                        // Restore missing formula/validation
                        if (target.evidence && !target.evidence.transparent) {
                            (target.evidence as any).transparent = {
                                formula: 'pending-verification',
                                validation_standard: 'ISO-14064-1',
                                logic_source: 'ActionlessShield/auto-healed',
                            };
                            healed++;
                            omniLogger.info(LogCategory.SYSTEM, `[ActionlessShield] 🌿 Healed: Transparent formula initialized.`);
                        }
                        break;

                    case 'RESONANCE':
                        // Emit resonance recovery signal (non-destructive)
                        if (target.broadcastResonance) {
                            target.broadcastResonance('SHIELD_RECOVERY', 0.5);
                            healed++;
                            omniLogger.info(LogCategory.SYSTEM, `[ActionlessShield] 🌿 Healed: Resonance recovery broadcast.`);
                        }
                        break;

                    default:
                        // Non-healable dimensions are silently skipped — Wu Wei
                        break;
                }
            } catch (err) {
                omniLogger.error(LogCategory.SYSTEM, `[ActionlessShield] Self-heal failed for ${anomaly.dimension}`, { error: err });
            }
        }

        if (healed > 0) {
            omniLogger.info(LogCategory.SYSTEM, `[ActionlessShield] 🧘 Self-healed ${healed}/${healable.length} anomalies.`);
        }

        return healed;
    }

    /**
     * ⚡ Quick Health Score
     */
    public getHealthScore(evidence: IEvidenceMap, virtues: IMeritProfile10): number {
        const diagnosis = this.diagnose(evidence, virtues);
        return diagnosis.healthScore;
    }

    // ─── Private Scan Methods ───

    private scan5TGate(evidence: IEvidenceMap, anomalies: IVirtueAnomaly[], now: number): void {
        const gates: Array<{ key: keyof IEvidenceMap; dim: IVirtueAnomaly['dimension']; label: string }> = [
            { key: 'tangible', dim: 'TANGIBLE', label: 'Tangible 可感知' },
            { key: 'traceable', dim: 'TRACEABLE', label: 'Traceable 可溯源' },
            { key: 'trackable', dim: 'TRACKABLE', label: 'Trackable 可追蹤' },
            { key: 'transparent', dim: 'TRANSPARENT', label: 'Transparent 可驗算' },
            { key: 'trustworthy', dim: 'TRUSTWORTHY', label: 'Trustworthy 不可篡改' },
        ];

        for (const gate of gates) {
            if (!evidence[gate.key]) {
                const severity: AnomalySeverity = gate.key === 'trustworthy' ? 'CRITICAL' : 'MEDIUM';
                anomalies.push({
                    dimension: gate.dim,
                    description: `${gate.label} gate is missing from evidence map.`,
                    severity,
                    deviation: 1.0,
                    autoHealable: gate.key !== 'trustworthy', // Trustworthy requires explicit lock()
                    detectedAt: now,
                });
            }
        }
    }

    private scanVirtueBalance(virtues: IMeritProfile10, anomalies: IVirtueAnomaly[], now: number): void {
        const values = [
            virtues.intelligence,
            virtues.benevolence,
            virtues.integrity,
            virtues.courage,
            virtues.temperance,
            virtues.harmony,
        ];

        const mean = values.reduce((s, v) => s + v, 0) / values.length;
        const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);

        if (stdDev > VIRTUE_DEVIATION_THRESHOLD) {
            anomalies.push({
                dimension: 'VIRTUE_BALANCE',
                description: `Virtue imbalance detected (σ=${stdDev.toFixed(2)}). Six virtues are significantly skewed.`,
                severity: stdDev > 4.0 ? 'HIGH' : 'MEDIUM',
                deviation: Math.min(1.0, stdDev / 5.0),
                autoHealable: false, // Virtue balance requires conscious cultivation
                detectedAt: now,
            });
        }
    }

    private scanResonance(resonance: number, anomalies: IVirtueAnomaly[], now: number): void {
        if (resonance < RESONANCE_MIN) {
            anomalies.push({
                dimension: 'RESONANCE',
                description: `Resonance decay detected (Rs=${resonance.toFixed(2)}). Below safety threshold ${RESONANCE_MIN}.`,
                severity: resonance < 0.1 ? 'CRITICAL' : 'HIGH',
                deviation: 1.0 - resonance,
                autoHealable: true,
                detectedAt: now,
            });
        }
    }

    private calculateHealthScore(anomalies: IVirtueAnomaly[]): number {
        if (anomalies.length === 0) return 100;

        const penalties: Record<AnomalySeverity, number> = {
            LOW: 3,
            MEDIUM: 8,
            HIGH: 15,
            CRITICAL: 25,
        };

        const totalPenalty = anomalies.reduce((sum, a) => sum + penalties[a.severity], 0);
        return Math.max(0, 100 - totalPenalty);
    }
}

/** Singleton export for system-wide passive guardian */
export const actionlessVirtueShield = new ActionlessVirtueShield();
