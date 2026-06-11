import { ai } from '../agents/genkit.ts';
import { memoryStore } from '../memory/memory-store.ts';

export interface NegotiationRound {
   round: number;
   proposals: { agent: string; proposal: unknown }[];
   consensus?: unknown;
   timestamp: string;
 }

export class NegotiationEngine {
   async negotiate(
     task: string,
     agentResults: { agent: string; result: unknown; success: boolean }[],
     maxRounds = 3
   ): Promise<{
     consensus: unknown;
     rounds: NegotiationRound[];
     finalDecision: string;
   }> {
    const rounds: NegotiationRound[] = [];
    let consensus = null;

    for (let round = 1; round <= maxRounds; round++) {
      const proposals = agentResults.map(ar => ({
        agent: ar.agent,
        proposal: ar.result
      }));

      const roundData: NegotiationRound = {
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

   private calculateProposalScores(
     results: { agent: string; result: unknown; success: boolean }[]
   ): Map<string, number> {
     const scores = new Map<string, number>();
     
     results.forEach(r => {
       if (r.success) {
         const key = JSON.stringify(r.result);
         scores.set(key, (scores.get(key) || 0) + 1);
       }
     });

     return scores;
   }

   private getWinningProposal(scores: Map<string, number>) {
     let bestKey: string | null = null;
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

   private async refineProposals(
     task: string,
     proposals: { agent: string; proposal: unknown }[],
     round: number
   ): Promise<unknown[]> {
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
     } catch {
       return proposals.map(p => p.proposal);
     }
   }
}

export const negotiationEngine = new NegotiationEngine();
