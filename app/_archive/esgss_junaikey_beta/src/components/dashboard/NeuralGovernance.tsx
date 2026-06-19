import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gavel,
  MessageSquare,
  Users,
  CheckCircle,
  XCircle,
  Info,
  Plus,
  Clock,
  Target,
  Zap,
  Scale,
} from 'lucide-react';
import { useGovernance } from '../../hooks/useGovernance';
import { useActionExecutor } from '../../hooks/useActionExecutor';
import { OMNI_AGENTS } from '../../data/omni-agents';

export const NeuralGovernance: React.FC = () => {
  const { proposals, createProposal, castVote, executeProposal } = useGovernance();
  const { actions, runAction } = useActionExecutor();
  const [isForgeOpen, setIsForgeOpen] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    actionId: 'EMO_REPORT',
  });

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    createProposal(newProposal.title, newProposal.description, newProposal.actionId);
    setIsForgeOpen(false);
    setNewProposal({ title: '', description: '', actionId: 'EMO_REPORT' });
  };

  const handleExecute = (proposalId: string, actionId: string) => {
    // High security actions now execute via governance signatures
    runAction(actionId, ['GOV_CONSENSUS_AUTHORITY']);
    executeProposal(proposalId);
  };

  // Auto-simulate other agents voting when a new proposal is added
  useEffect(() => {
    const activeProposals = proposals.filter(
      p => p.status === 'ACTIVE' && p.consensusHistory.length < 5
    );
    let timer: any;

    if (activeProposals.length > 0) {
      timer = setTimeout(() => {
        const p = activeProposals[0]!;
        const randomAgent = OMNI_AGENTS[Math.floor(Math.random() * OMNI_AGENTS.length)]!;
        if (!p.consensusHistory.find(h => h.agentId === randomAgent.id)) {
          castVote(p.id, Math.random() > 0.3 ? 'FOR' : 'AGAINST', randomAgent.id);
        }
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [proposals, castVote]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-2">
      {/* Left Col: Proposals List */}
      <div className="lg:col-span-8 flex flex-col space-y-6">
        <div className="bg-black/60 border border-gold-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/40 text-orange-400">
                <Gavel className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-tighter">
                  神經治理議會 (Neural Governance)
                </h3>
                <p className="text-[10px] text-orange-500/70 font-mono">
                  DECENTRALIZED_CONSENSUS_v3.3
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsForgeOpen(true)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/40 text-gray-300 text-xs font-bold transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Submit Proposal
            </button>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
            <AnimatePresence initial={false}>
              {proposals.length === 0 ? (
                <div className="py-20 text-center text-gray-600 italic text-sm">
                  No active governance proposals detected
                </div>
              ) : (
                proposals.map(prop => (
                  <motion.div
                    key={prop.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-2xl border transition-all ${
                      prop.status === 'ACTIVE'
                        ? 'bg-white/5 border-white/10 hover:border-white/20'
                        : prop.status === 'PASSED'
                          ? 'bg-green-500/5 border-green-500/20'
                          : prop.status === 'FAILED'
                            ? 'bg-red-500/5 border-red-500/20'
                            : 'bg-black/40 border-white/5 opacity-70'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                              prop.status === 'ACTIVE'
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : prop.status === 'PASSED'
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-gray-500/20 text-gray-400'
                            }`}
                          >
                            {prop.status}
                          </span>
                          <span className="text-[10px] text-gray-600 font-mono">{prop.id}</span>
                        </div>
                        <h4 className="text-sm font-black text-white">{prop.title}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] text-gray-500 uppercase font-black mb-1">
                          Target Action
                        </div>
                        <div className="text-[10px] text-cyan-500 font-mono">
                          {prop.targetActionId}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-500 mb-6 leading-relaxed">
                      {prop.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      {/* Voting Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                          <span className="text-green-500">For: {prop.votesFor}</span>
                          <span className="text-red-500">Against: {prop.votesAgainst}</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                          <div
                            className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all duration-1000"
                            style={{
                              width: `${(prop.votesFor / (prop.votesFor + prop.votesAgainst || 1)) * 100}%`,
                            }}
                          />
                          <div
                            className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all duration-1000"
                            style={{
                              width: `${(prop.votesAgainst / (prop.votesFor + prop.votesAgainst || 1)) * 100}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-[8px] text-gray-600 font-mono">
                          <span>QUORUM: {prop.quorum}</span>
                          <span>
                            TIME LEFT:{' '}
                            {Math.max(0, Math.floor((prop.expiresAt - Date.now()) / 3600000))}H
                          </span>
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div className="flex justify-end gap-3">
                        {prop.status === 'ACTIVE' && (
                          <>
                            <button
                              onClick={() => castVote(prop.id, 'FOR')}
                              className="flex-1 py-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/30 text-[10px] font-black uppercase hover:bg-green-500/20 transition-all"
                            >
                              Vote For
                            </button>
                            <button
                              onClick={() => castVote(prop.id, 'AGAINST')}
                              className="flex-1 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-black uppercase hover:bg-red-500/20 transition-all"
                            >
                              Vote Against
                            </button>
                          </>
                        )}
                        {prop.status === 'PASSED' && (
                          <button
                            onClick={() => handleExecute(prop.id, prop.targetActionId)}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black uppercase text-[11px] shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                          >
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            Execute Authorized Directive
                          </button>
                        )}
                        {prop.status === 'EXECUTED' && (
                          <div className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-600 font-black uppercase text-[11px] text-center flex items-center justify-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Directive Fulfilled
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Col: Consensus Arguments & Forge */}
      <div className="lg:col-span-4 space-y-6">
        {/* Voting Influence Radar */}
        <div className="bg-black/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6">
            <Scale className="w-4 h-4 text-orange-400" />
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
              權重影響力 (Influence)
            </h3>
          </div>
          <div className="space-y-4">
            {OMNI_AGENTS.slice(0, 5).map(agent => (
              <div key={agent.id} className="flex items-center justify-between">
                <div className="text-[10px] font-bold text-gray-300">{agent.name}</div>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500"
                      style={{ width: `${agent.id.length * 5}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-orange-400 font-mono">
                    {agent.id.length * 2}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proposal Forge Modal/Panel */}
        <AnimatePresence>
          {isForgeOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-orange-600/10 border-2 border-orange-500/50 rounded-2xl p-6 relative overflow-hidden"
            >
              <button
                onClick={() => setIsForgeOpen(false)}
                className="absolute top-4 right-4 text-orange-500 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <Target className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-tight">
                  New System Proposal
                </h3>
              </div>
              <form onSubmit={handleCreateProposal} className="space-y-4">
                <input
                  type="text"
                  placeholder="Proposal Title"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 outline-none"
                  value={newProposal.title}
                  onChange={e => setNewProposal({ ...newProposal, title: e.target.value })}
                />
                <textarea
                  placeholder="Proposed adjustment details..."
                  required
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 outline-none resize-none"
                  value={newProposal.description}
                  onChange={e => setNewProposal({ ...newProposal, description: e.target.value })}
                />
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase font-black">
                    Linked Infrastructure Action
                  </label>
                  <select
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-orange-500 outline-none"
                    value={newProposal.actionId}
                    onChange={e => setNewProposal({ ...newProposal, actionId: e.target.value })}
                  >
                    {actions.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-orange-500 text-white font-black uppercase text-xs tracking-widest hover:bg-orange-400 transition-all shadow-lg shadow-orange-500/20"
                >
                  Initiate Consensus Cycle
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
