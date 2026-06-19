import { describe, it, expect, vi } from 'vitest';
import { evolutionManager } from "./lib/services/evolution-manager";
import { useEvolutionStore } from "./lib/stores/evolution-store";

describe('Phase 11: AI Skill Tree & Evolution System', () => {
    it('should award XP to designated agent and collective', async () => {
        const state = useEvolutionStore.getState();
        const initialSkill = state.skills.find(s => s.agent === 'Expert Module');
        const initialCollective = state.skills.find(s => s.category === 'collective');

        await evolutionManager.processTaskCompletion({
            agentName: "Expert Module",
            taskComplexity: 1.0,
            resultQuality: 1.0
        });

        const newState = useEvolutionStore.getState();
        const updatedSkill = newState.skills.find(s => s.agent === 'Expert Module');
        const updatedCollective = newState.skills.find(s => s.category === 'collective');

        expect(updatedSkill?.xp).toBeGreaterThan(initialSkill?.xp || 0);
        expect(updatedCollective?.xp).toBeGreaterThan(initialCollective?.xp || 0);
    });

    it('should unlock skills when requested', () => {
        const skillId = 'module-supply';
        evolutionManager.checkUnlockEligibility(skillId);
        useEvolutionStore.getState().unlockSkill(skillId);

        const newState = useEvolutionStore.getState();
        const skill = newState.skills.find(s => s.id === skillId);
        expect(skill?.unlocked).toBe(true);
    });
});
