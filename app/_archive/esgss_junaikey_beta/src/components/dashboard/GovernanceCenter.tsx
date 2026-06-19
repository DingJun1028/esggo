import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  ScrollArea,
  Progress,
} from '@/components/ui';
import {
  Vote,
  Users,
  Zap,
  Scale,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Activity,
} from 'lucide-react';
import { governanceService, GovernanceProposal } from '@/services/GovernanceService';
import { ethicalGuardianService } from '@/services/EthicalGuardianService';
import { agentService } from '@/services/agentService';
import { type Agent } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

export const GovernanceCenter: React.FC = () => {
  const [proposals, setProposals] = useState<GovernanceProposal[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    setProposals(governanceService.getProposals());
    const unsubscribe = governanceService.subscribe(setProposals);

    agentService.getAgents().then(setAgents);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleCreateProposal = () => {
    const categories: any[] = ['ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE', 'TECHNICAL'];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];

    governanceService.createProposal({
      creatorId: 'System_Swarm',
      title: `Sentient Directive: ${randomCat}`,
      description: `Omni-Swarm automated proposal for ${randomCat} optimization.`,
      category: randomCat,
      quorum: 500,
      impactScore: 85,
    });
  };

  const handleVote = async (propId: string, support: boolean) => {
    if (agents.length > 0) {
      const votingAgent = agents[Math.floor(Math.random() * agents.length)];
      if (!votingAgent) return;

      // Perform Ethical Audit before voting
      omniLogger.info(LogCategory.GOVERNANCE, `[UI] Requesting ethical clearance for vote on ${propId}`);

      try {
        const audit = await ethicalGuardianService.auditAction(
          votingAgent.id,
          `VOTE_${support ? 'FOR' : 'AGAINST'}_${propId}`,
          {}
        );

        if (audit.status !== 'BREACH') {
          governanceService.castVote(propId, votingAgent, support);
        } else {
          omniLogger.warn(LogCategory.GOVERNANCE, `[UI] Vote blocked by Ethical Guardian: ${audit.feedback}`);
        }
      } catch (err) {
        omniLogger.error(LogCategory.GOVERNANCE, `[UI] Ethical Audit failed during vote`, err);
        // Fallback: allow vote in emergency? For now, we wait for service response.
      }
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-700">
      {/* GOVERNANCE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3 text-white tracking-tighter">
            <Scale className="w-8 h-8 text-primary" />
            ETH-GOV: NEURAL DAO
          </h1>
          <p className="text-slate-400 font-mono text-sm">
            Decentralized Agent Governance & Swarm Consensus
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleCreateProposal}
            className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20"
          >
            <Activity className="w-4 h-4 mr-2" />
            Simulate Pulse Proposal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PROPOSALS LIST */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-300 flex items-center gap-2">
            <Vote className="w-5 h-5 text-cyan-400" />
            Active Strategic Proposals
          </h2>

          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {proposals.length === 0 ? (
                <div className="p-20 text-center bg-slate-900/40 rounded-3xl border border-dashed border-white/5 text-slate-500">
                  No active proposals in the current epoch.
                </div>
              ) : (
                proposals.map(prop => (
                  <Card
                    key={prop.id}
                    className="bg-slate-950/60 border-white/5 hover:border-primary/30 transition-all duration-500 group"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge
                          className={`${prop.category === 'ENVIRONMENTAL'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : prop.category === 'SOCIAL'
                              ? 'bg-pink-500/10 text-pink-400 border-pink-500/20'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}
                        >
                          {prop.category}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] opacity-60">
                          {prop.status}
                        </Badge>
                        {prop.hyperspaceSealed && (
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/40 animate-pulse ml-2">
                            💠 HYPERSPACE SEALED
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl mt-2 text-white group-hover:text-primary transition-colors">
                        {prop.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {prop.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-xs mb-1 font-mono">
                          <span className="text-emerald-400">FOR: {prop.votesFor} Power</span>
                          <span className="text-rose-400">AGAINST: {prop.votesAgainst} Power</span>
                        </div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden flex">
                          <div
                            className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000"
                            style={{
                              width: `${(prop.votesFor / (prop.votesFor + prop.votesAgainst + 1)) * 100}%`,
                            }}
                          />
                          <div
                            className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)] transition-all duration-1000"
                            style={{
                              width: `${(prop.votesAgainst / (prop.votesFor + prop.votesAgainst + 1)) * 100}%`,
                            }}
                          />
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            className={`flex-1 rounded-xl transition-all duration-500 ${prop.hyperspaceSealed
                                ? 'border-cyan-500/50 bg-cyan-500/5 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                : 'border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400'
                              }`}
                            onClick={() => handleVote(prop.id, true)}
                            disabled={prop.status !== 'ACTIVE'}
                          >
                            {prop.hyperspaceSealed ? 'Resonant Consensus' : 'Consensus Yes'}
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 rounded-xl border-rose-500/20 hover:bg-rose-500/10 text-rose-400"
                            onClick={() => handleVote(prop.id, false)}
                            disabled={prop.status !== 'ACTIVE'}
                          >
                            Dissent No
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* SWARM SYNC PANEL */}
        <div className="space-y-6">
          <Card className="bg-slate-950/80 border-primary/20 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-primary" />
                Omni-Swarm Sync
              </CardTitle>
              <CardDescription>Real-time neural frequency resonance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="flex flex-col items-center py-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-900" />
                  <div
                    className="absolute inset-0 rounded-full border-4 border-primary animate-[pulse_2s_infinite]"
                    style={{ opacity: 0.8 }}
                  />
                  <div className="text-4xl font-black text-white">
                    88
                    <span className="text-sm font-normal text-slate-500">%</span>
                  </div>
                </div>
                <div className="mt-4 text-xs font-mono text-primary uppercase tracking-widest">
                  Resonance Frequency
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Synced Agents</span>
                  <span className="text-white font-bold">{agents.length} Units</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Hypercube Nodes</span>
                  <span className="text-cyan-400 font-black">
                    {agents.reduce((acc, a) => acc + (a.evolutionProfile?.tesseractNodes || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Amplified Swarm Power</span>
                  <span className="text-primary font-black">
                    +{((agents.reduce((acc, a) => acc + (a.evolutionProfile?.tesseractNodes || 0), 0) * 0.5) * 10).toFixed(1)} PW
                  </span>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1 uppercase tracking-tighter">
                    Dimensional Alignment
                  </div>
                  <Progress value={92} className="h-1.5" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GOVERNANCE STATS */}
          <Card className="bg-black/40 border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400 uppercase tracking-widest font-bold">
                DAO Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">System Integrity</div>
                  <div className="text-sm font-bold text-white">OPTIMIZED</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Proposal Quorum</div>
                  <div className="text-sm font-bold text-white">51% WEIGHTED</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
