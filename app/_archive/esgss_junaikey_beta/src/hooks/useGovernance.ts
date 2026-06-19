import { useState, useCallback, useEffect } from 'react';
import { GovernanceCore, GovernanceProposal } from '../services/GovernanceCore';
import { useAgentRpg } from './useAgentRpg';
import { useSovereignSession } from './useSovereignSession';
import { OMNI_AGENTS } from '../data/omni-agents';

export const useGovernance = () => {
  const { profile } = useAgentRpg();
  const { isResonant } = useSovereignSession();
  const [proposals, setProposals] = useState<GovernanceProposal[]>(() => {
    const saved = localStorage.getItem('omni_governance_proposals');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('omni_governance_proposals', JSON.stringify(proposals));
  }, [proposals]);

  const createProposal = useCallback(
    (title: string, description: string, targetActionId: string) => {
      const newProposal: GovernanceProposal = {
        id: `PROP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        title,
        description,
        targetActionId,
        status: 'ACTIVE',
        votesFor: 0,
        votesAgainst: 0,
        quorum: 50,
        expiresAt: Date.now() + 3600000 * 24, // 24 hours
        consensusHistory: [],
      };
      setProposals(prev => [newProposal, ...prev]);
      return newProposal;
    },
    []
  );

  const castVote = useCallback(
    (proposalId: string, vote: 'FOR' | 'AGAINST', agentId?: string) => {
      setProposals(prev =>
        prev.map(p => {
          if (p.id !== proposalId || p.status !== 'ACTIVE') return p;

          // If no agentId provided, use current profile, else simulate an OMNI agent
          const votingAgent = agentId ? OMNI_AGENTS.find(a => a.id === agentId) : profile;
          const influence = GovernanceCore.calculateInfluence(votingAgent, isResonant ? 1.5 : 1.0);

          const updatedHistory = [
            ...p.consensusHistory,
            { agentId: agentId || 'UserAgent', influence, vote },
          ];
          const updatedVotesFor = vote === 'FOR' ? p.votesFor + influence : p.votesFor;
          const updatedVotesAgainst =
            vote === 'AGAINST' ? p.votesAgainst + influence : p.votesAgainst;

          const newStatus = GovernanceCore.checkConsensus({
            ...p,
            votesFor: updatedVotesFor,
            votesAgainst: updatedVotesAgainst,
            consensusHistory: updatedHistory,
          });

          return {
            ...p,
            votesFor: updatedVotesFor,
            votesAgainst: updatedVotesAgainst,
            consensusHistory: updatedHistory,
            status: newStatus,
          };
        })
      );
    },
    [profile, isResonant]
  );

  const executeProposal = useCallback((proposalId: string) => {
    setProposals(prev =>
      prev.map(p => {
        if (p.id === proposalId && p.status === 'PASSED') {
          return { ...p, status: 'EXECUTED' };
        }
        return p;
      })
    );
  }, []);

  return {
    proposals,
    createProposal,
    castVote,
    executeProposal,
  };
};
