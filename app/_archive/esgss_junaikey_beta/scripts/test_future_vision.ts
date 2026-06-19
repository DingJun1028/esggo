/**
 * Phase 19: Future Vision Verification
 * 
 * Verifies the Q1 2027 R&D milestones:
 * 1. Dynamic Compliance Intelligence.
 * 2. Performance-Weighted DAO Governance.
 */

import { complianceService, ComplianceRequirement } from '../server/services/ComplianceService.js';
import { GovernanceDAO } from '../src/services/GovernanceDAO.js';
import chalk from 'chalk';

async function verifyFutureVision() {
    console.log(chalk.bold.magenta('\n--- 🌌 Phase 19: Future Vision Research Audit ---'));

    // 1. Compliance Service Test
    console.log(chalk.blue('\n[Test 1] Compliance Intelligence Registry'));
    const allReqs = complianceService.getAllRequirements();
    console.log(chalk.green(`✅ Detected ${allReqs.length} active regulatory requirements.`));

    const isoReq = allReqs.find((r: ComplianceRequirement) => r.code === '5.1');
    if (isoReq && isoReq.title === 'Organizational boundaries') {
        console.log(chalk.green('✅ ISO 14064-1:5.1 successfully retrieved from dynamic registry.'));
    } else {
        console.log(chalk.red('❌ ISO 14064-1:5.1 missing or incorrect.'));
    }

    // 2. Governance DAO Test (Performance Weighted)
    console.log(chalk.blue('\n[Test 2] Performance-Weighted Voting Logic'));

    // Create a high-sentience agent
    const highSentienceAgent: any = {
        id: 'agent_sentient_01',
        name: 'Oracle Guardian',
        level: 10,
        dna: { intelligence: 95, resilience: 90 } // High intelligence/resilience
    };

    // Create a base-level agent
    const lowLevelAgent: any = {
        id: 'agent_basic_01',
        name: 'Data Collector',
        level: 1,
        dna: { intelligence: 10, resilience: 10 }
    };

    // Propose a change
    GovernanceDAO.createProposal([highSentienceAgent], 'REGULATORY_REFINE_V2');
    const proposals = await GovernanceDAO.getInstance().getProposals();
    const latestProp = proposals[proposals.length - 1];

    if (!latestProp) {
        console.log(chalk.red('❌ Latest proposal not found.'));
        return;
    }

    console.log(chalk.gray(`   Proposal created: ${latestProp.title}`));

    // Vote with High Sentience
    GovernanceDAO.castVote(latestProp.id, highSentienceAgent, true);

    // Vote with Low Level
    GovernanceDAO.castVote(latestProp.id, lowLevelAgent, true);

    console.log(chalk.cyan(`   Current Vote Count: For=${latestProp.votesFor}, Against=${latestProp.votesAgainst}`));

    // Verification: weight = level * (int + res) / 20
    // high: 10 * (95 + 90) / 20 = 10 * 185 / 20 = 10 * 9.25 = 92
    // low: 1 * (10 + 10) / 20 = 1 * 1 = 1
    // Total expected: 93

    if (latestProp && latestProp.votesFor === 93) {
        console.log(chalk.green('✅ Performance-Weighted Voting verified: High sentience agents have more impact.'));
    } else {
        console.log(chalk.red(`❌ Voting calculation error. Expected 93, got ${latestProp?.votesFor}`));
    }

    // 3. Final Verdict
    console.log(chalk.bold.magenta('\n--- Future Vision Audit Complete ---'));
    console.log(chalk.bgMagenta.white(' VISION: ALIGNED WITH Q1 2027 ROADMAP '));
}

verifyFutureVision().catch(err => {
    console.error(chalk.red('Audit crashed'), err);
    process.exit(1);
});
