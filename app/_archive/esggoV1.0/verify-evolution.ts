import { evolutionManager } from "./lib/services/evolution-manager";
import { useEvolutionStore } from "./lib/stores/evolution-store";

async function testEvolution() {
    console.log("=== Phase 11 AI Evolution Verification ===");

    const initialSkills = useEvolutionStore.getState().skills;
    const initialSupplyChainSkill = initialSkills.find(s => s.id === 'module-supply');
    console.log("Initial Supply Chain XP:", initialSupplyChainSkill?.xp);

    // 1. Simulate Task Completion for "Expert Module"
    console.log("Simulating task completion for Expert Module...");
    await evolutionManager.processTaskCompletion({
        agentName: "Expert Module",
        taskComplexity: 1.0,
        resultQuality: 1.0
    });

    // 2. Check Updated State
    const updatedSkills = useEvolutionStore.getState().skills;
    const updatedSupplyChainSkill = updatedSkills.find(s => s.id === 'module-supply');
    console.log("Updated Supply Chain XP:", updatedSupplyChainSkill?.xp);

    if ((updatedSupplyChainSkill?.xp || 0) > (initialSupplyChainSkill?.xp || 0)) {
        console.log("SUCCESS: XP Awarded correctly.");
    } else {
        console.log("FAILURE: XP not awarded.");
    }

    // 3. Test Collective XP award
    const initialCollective = initialSkills.find(s => s.category === 'collective');
    const updatedCollective = updatedSkills.find(s => s.category === 'collective');
    if ((updatedCollective?.xp || 0) > (initialCollective?.xp || 0)) {
        console.log("SUCCESS: Collective XP awarded.");
    }
}

testEvolution().catch(console.error);
