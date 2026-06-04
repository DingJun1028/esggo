import { ai } from '../agents/genkit.ts';
import { memoryStore } from '../memory/memory-store.ts';
export class NegotiationEngine {
    async negotiate(task, agentResults, maxRounds = 3) {
        const rounds = [];
        let consensus = null;
        for (let round = 1; round <= maxRounds; round++) {
            const proposals = agentResults.map(ar => ({
                agent: ar.agent,
                proposal: ar.result
            }));
            const roundData = {
                round,
                proposals,
                timestamp: new Date().toISOString()
            };
            // Calculate consensus using simple voting
            const proposalScores = this.calculateProposalScores(agentResults);
            const winningProposal = this.getWinningProposal(proposalScores);
            if (winningProposal.confidence > 0.8) {
                consensus = winningProposal.value;
                roundData.consensus = consensus;
                rounds.push(roundData);
                break;
            }
            // If no strong consensus, refine proposals
            const refined = await this.refineProposals(task, proposals, round);
            agentResults = refined.map((p, i) => ({
                agent: agentResults[i].agent,
                result: p,
                success: true
            }));
            rounds.push(roundData);
        }
        const finalDecision = consensus !== null
            ? 'CONSENSUS_REACHED'
            : 'NO_CONSENSUS';
        // Record negotiation in memory
        memoryStore.add({
            agentName: 'NegotiationEngine',
            task: `Negotiation: ${task}`,
            context: { rounds: rounds.length, finalDecision },
            result: JSON.stringify({ consensus, rounds }),
            success: true,
            tags: ['negotiation', 'swarm']
        });
        return { consensus, rounds, finalDecision };
    }
    calculateProposalScores(results) {
        const scores = new Map();
        results.forEach(r => {
            if (r.success) {
                const key = JSON.stringify(r.result);
                scores.set(key, (scores.get(key) || 0) + 1);
            }
        });
        return scores;
    }
    getWinningProposal(scores) {
        let bestKey = null;
        let bestScore = 0;
        scores.forEach((score, key) => {
            if (score > bestScore) {
                bestScore = score;
                bestKey = key;
            }
        });
        const total = scores.size || 1;
        const confidence = bestScore / total;
        const value = bestKey ? JSON.parse(bestKey) : null;
        return { value, confidence };
    }
    async refineProposals(task, proposals, round) {
        const prompt = `
 Task: ${task}
 Round: ${round}
 Proposals:
  ${proposals.map((p) => `Agent ${p.agent}: ${JSON.stringify(p.proposal)}`).join('\n')}

 Please refine your proposal based on the above. Return only the refined proposal as JSON.
 `;
        const response = await ai.generate({
            model: 'googleai/gemini-2.0-flash',
            prompt,
            config: { temperature: 0.3 }
        });
        try {
            return [JSON.parse(response.text || '{}')];
        }
        catch {
            return proposals.map(p => p.proposal);
        }
    }
}
export const negotiationEngine = new NegotiationEngine();
//# sourceMappingURL=engine.js.map