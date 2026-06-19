import { IOmniAtom } from './omni-types';
import { omniLogger, LogCategory } from './omniLogger';

/**
 * 🛠️ ISkillPackage: Represents a modular skill an agent can equip.
 */
export interface ISkillPackage {
    id: string; // e.g., 'skill_data_synth'
    name: string;
    description: string;
    energyCost: number; // For future RPG mechanics

    /**
     * Executes the skill logic.
     * @param payload The input data the skill operates on.
     * @param context Contextual atoms or system state.
     */
    execute(payload: any, context?: any): Promise<any>;
}

/**
 * 📚 SkillRegistry: Central catalog of all available agent skills.
 */
export class SkillRegistry {
    private static skills: Map<string, ISkillPackage> = new Map();

    /**
     * Registers a new skill into the system.
     */
    public static register(skill: ISkillPackage) {
        this.skills.set(skill.id, skill);
        omniLogger.info(LogCategory.SYSTEM, `SkillRegistry: Skill [${skill.name}] registered.`);
    }

    /**
     * Retrieves a skill by ID.
     */
    public static getSkill(id: string): ISkillPackage | undefined {
        return this.skills.get(id);
    }

    /**
     * Lists all available skills.
     */
    public static listAll(): ISkillPackage[] {
        return Array.from(this.skills.values());
    }
}

// ============================================================================
// 🔮 Standard Skills Implementations
// ============================================================================

/**
 * 📊 Skill: Data Synthesizer
 * Condenses complex raw ESG data into structured metrics.
 */
export const Skill_DataSynthesizer: ISkillPackage = {
    id: 'skill_data_synth',
    name: 'Data Synthesizer',
    description: 'Condenses raw ESG narrative into structured, quantifiable indicators.',
    energyCost: 10,
    execute: async (payload: { rawText: string }) => {
        omniLogger.info(LogCategory.AI, `Executing Skill [Data Synthesizer]...`);
        // In a real scenario, this would call Gemini. Here we mock the synthesis.
        return {
            synthesized: true,
            extractedMetrics: ['GRI-302-1', 'SASB-EM-130a.1'],
            confidence: 0.88
        };
    }
};

/**
 * ⚠️ Skill: Risk Predictor
 * Analyzes organizational data to forecast future vulnerabilities.
 */
export const Skill_RiskPredictor: ISkillPackage = {
    id: 'skill_risk_predictor',
    name: 'Predictive Risk Analyst',
    description: 'Projects current trajectories into future compliance risk scenarios.',
    energyCost: 25,
    execute: async (payload: { atoms: IOmniAtom<any>[] }) => {
        omniLogger.info(LogCategory.AI, `Executing Skill [Risk Predictor]...`);
        const riskScore = Math.random() * 100;
        return {
            forecastedRisk: riskScore,
            warning: riskScore > 70 ? 'High vulnerability detected in Supply Chain (Scope 3).' : 'System resilient.',
            horizon: '5 Years'
        };
    }
};

/**
 * 🛡️ Skill: Resilience Aura
 * A supportive skill that temporarily boosts the 5T integrity score of an atom.
 */
export const Skill_ResilienceAura: ISkillPackage = {
    id: 'skill_resilience_aura',
    name: 'Resilience Aura',
    description: 'Temporarily boosts the 5T verification priority of targeted data atoms.',
    energyCost: 50,
    execute: async (payload: { atom: IOmniAtom<any> }) => {
        omniLogger.info(LogCategory.AI, `Executing Skill [Resilience Aura]...`);
        const boostedAtom = {
            ...payload.atom,
            tags: [...(payload.atom.tags || []), { id: 'AURA_BOOSTED', type: 'system' }]
        };
        return {
            success: true,
            atom: boostedAtom,
            message: 'Aura applied. atom resonance increased.'
        };
    }
};

// Auto-register standard skills
SkillRegistry.register(Skill_DataSynthesizer);
SkillRegistry.register(Skill_RiskPredictor);
SkillRegistry.register(Skill_ResilienceAura);
