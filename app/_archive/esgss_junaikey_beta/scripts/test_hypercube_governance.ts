import { governanceDAO } from '../src/services/GovernanceDAO';
import { Agent } from '../src/types/agency';

async function testGovernance() {
    console.log('🏛️ Starting Hypercube Governance Verification...');

    const mockAgent: Agent = {
        id: 'agent_001',
        name: 'Test Sentinel',
        level: 5,
        dna: { intelligence: 15, resilience: 10, creativity: 10, empathy: 10, precision: 10, speed: 10 },
        meritProfile: {
            integrity: 10,
            benevolence: 8,
            intelligence: 9,
            courage: 7,
            temperance: 8,
            harmony: 9
        }
    } as any;

    try {
        const proposals = await governanceDAO.getProposals();
        const propId = proposals[0].id;

        console.log(`🗳️ Casting vote for proposal ${propId}...`);
        await governanceDAO.vote(propId, true);

        const updatedProposals = await governanceDAO.getProposals();
        const updatedProp = updatedProposals.find(p => p.id === propId);

        console.log(`📊 Updated Votes: For=${updatedProp?.votesFor}, Against=${updatedProp?.votesAgainst}`);

        if (updatedProp && updatedProp.votesFor > 150) { // Base was 150
            console.log('✨ [PASSED] Weighted voting recorded correctly.');
        } else {
            throw new Error('Vote weight not correctly applied.');
        }

    } catch (error) {
        console.error('❌ [FAILED] Governance test failed:', error);
        process.exit(1);
    }
}

testGovernance();
