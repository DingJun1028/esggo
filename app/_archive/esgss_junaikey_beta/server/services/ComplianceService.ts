import { ambientDataService, AmbientMeasurement } from './AmbientDataService.js';
import { omniLogger, LogCategory } from './omni/infrastructure/logging/OmniLogger.js';
import { EventEmitter } from 'events';
import crypto from 'crypto';
import { type IComponentCore } from './OmniComponentCore.js';

export interface ComplianceRule {
    id: string;
    description: string;
    sensorType: string;
    threshold: number;
    operator: '>' | '<' | '>=' | '<=';
}

export interface ComplianceRequirement {
    id: string;
    code: string;
    title: string;
    description: string;
    category: 'E' | 'S' | 'G';
}

/**
 * Phase 46: Autonomous Compliance Service
 * Enforces the "Sentient Constitution" by monitoring real-time data against ESG rules.
 */
export class ComplianceService extends EventEmitter {
    private rules: ComplianceRule[] = [
        {
            id: 'RULE-CARBON-MAX',
            description: 'Carbon Emission Upper Bound',
            sensorType: 'CarbonEmission',
            threshold: 100, // kgCO2e per pulse
            operator: '<='
        },
        {
            id: 'RULE-RESONANCE-MIN',
            description: 'Minimum Social Resonance',
            sensorType: 'SocialSentiment',
            threshold: 0.3,
            operator: '>='
        }
    ];

    private static REQUIREMENTS: ComplianceRequirement[] = [
        {
            id: 'req_1',
            code: 'ISO 14064-1:5.1',
            title: 'Organizational boundaries',
            description: 'Establish and document the organizational boundaries of the entity.',
            category: 'E'
        },
        {
            id: 'req_2',
            code: 'GRI 305-1',
            title: 'Direct (Scope 1) GHG emissions',
            description: 'Report direct greenhouse gas emissions in metric tons of CO2 equivalent.',
            category: 'E'
        },
        {
            id: 'req_3',
            code: 'SASB EM-EP-110a.1',
            title: 'Gross global Scope 1 emissions',
            description: 'Gross global Scope 1 emissions, percentage covered under emissions-limiting regulations.',
            category: 'E'
        },
        {
            id: 'req_4',
            code: 'TCFD Metrics & Targets (a)',
            title: 'GHG Emissions (Scope 1, 2, 3)',
            description: 'Disclose Scope 1, Scope 2, and, if appropriate, Scope 3 greenhouse gas (GHG) emissions, and the related risks.',
            category: 'E'
        }
    ];

    constructor() {
        super();
        this.startMonitoring();
        omniLogger.info(LogCategory.SECURITY, `[SYSTEM] Compliance Intelligence Activated: Sentient Constitution Loaded.`);
    }

    private startMonitoring() {
        ambientDataService.on('measurement', (m: AmbientMeasurement) => {
            this.checkCompliance(m);
        });
    }

    private checkCompliance(m: AmbientMeasurement) {
        const relevantRules = this.rules.filter(r => r.sensorType === m.type);

        for (const rule of relevantRules) {
            let isViolated = false;
            switch (rule.operator) {
                case '<=': isViolated = m.value > rule.threshold; break;
                case '>=': isViolated = m.value < rule.threshold; break;
                case '<': isViolated = m.value >= rule.threshold; break;
                case '>': isViolated = m.value <= rule.threshold; break;
            }

            if (isViolated) {
                const traceId = crypto.randomUUID();

                // Refactor to v10.1 5T Core Object
                const core: IComponentCore = {
                    uuid: traceId,
                    version: '10.1.0-sentient',
                    timestamp: Date.now(),
                    status: 'Violated',
                    evidence: {
                        tangible: {
                            metric: `${rule.description} Breach`,
                            verified_at: Date.now(),
                            visual_grade: 'PLATINUM' // Using allowed union type from IEvidenceMap if needed, but visual_grade is actually 'GOLD' | 'PLATINUM' | 'SOVEREIGN'
                        },
                        traceable: {
                            source_origin: `ComplianceService: ${m.sensorId}`,
                            verification_links: [`/vault/violations/${rule.id}/${traceId}.log`]
                        },
                        trustworthy: {
                            hash_lock: crypto.createHash('sha256').update(JSON.stringify({
                                ruleId: rule.id,
                                value: m.value,
                                threshold: rule.threshold
                            })).digest('hex'),
                            is_frozen: true
                        }
                    }
                };

                const violation = {
                    ruleId: rule.id,
                    description: rule.description,
                    value: m.value,
                    threshold: rule.threshold,
                    sensorId: m.sensorId,
                    timestamp: Date.now(),
                    core // 5T standard core for audit
                };

                omniLogger.error(LogCategory.SECURITY, `[SYSTEM] [Compliance-Violation] ${rule.id}: ${m.value} exceeds ${rule.threshold} on ${m.sensorId}`, {
                    traceId,
                    version: core.version
                });
                this.emit('violation', violation);
            }
        }
    }

    public getRules(): ComplianceRule[] {
        return this.rules;
    }

    public getAllRequirements(): ComplianceRequirement[] {
        return ComplianceService.REQUIREMENTS;
    }
}

export const complianceService = new ComplianceService();
