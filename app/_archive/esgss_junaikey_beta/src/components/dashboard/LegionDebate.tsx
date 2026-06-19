import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Zap, Target, Shield, AlertTriangle } from 'lucide-react';
import { OMNI_AGENTS } from '../../data/omni-agents';

interface DebateMessage {
  id: string;
  agentId: string;
  content: string;
  type: 'argument' | 'consensus' | 'conflict';
}

interface LegionDebateProps {
  agents: { id: string; name: string }[];
  missionName: string;
  onConsensusReached: (coherence: number) => void;
}

export const LegionDebate: React.FC<LegionDebateProps> = ({
  agents,
  missionName,
  onConsensusReached,
}) => {
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [coherence, setCoherence] = useState(50);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timer: any;
    let count = 0;
    const maxMessages = 6;

    const debateLogic = () => {
      if (count >= maxMessages) {
        setIsComplete(true);
        onConsensusReached(coherence);
        return;
      }

      if (agents.length === 0) return;
      const agent = agents[count % agents.length]!;
      const archetype = OMNI_AGENTS.find(a => a.id === agent.id);

      const dialoguePool = {
        E: [
          'We must ensure the environmental impact is minimized.',
          'The ecological footprint of this mission is our priority.',
          'If we compromise biology, we compromise the future.',
        ],
        S: [
          'Social equity is the foundation of sustainable progress.',
          'Community engagement must be a core KPI here.',
          'Ethical alignment is more important than raw speed.',
        ],
        G: [
          'Governance protocols must be strictly followed.',
          'Without transparency, this impact is void.',
          'We need to audit the resource allocation flow.',
        ],
        U: [
          'I see a way to balance these perspectives.',
          "Let's integrate the governance and environmental needs.",
          'A hybrid approach will maximize our synergy.',
        ],
      };

      const type = (archetype?.type || 'U') as keyof typeof dialoguePool;
      const content = dialoguePool[type][Math.floor(Math.random() * dialoguePool[type].length)]!;

      const newMessage: DebateMessage = {
        id: Math.random().toString(),
        agentId: agent.id,
        content,
        type: count > 3 ? 'consensus' : 'argument',
      };

      setMessages(prev => [...prev, newMessage]);
      setCoherence(prev => Math.min(100, prev + (count > 3 ? 10 : 5)));
      count++;

      timer = setTimeout(debateLogic, 1500);
    };

    timer = setTimeout(debateLogic, 1000);
    return () => clearTimeout(timer);
  }, [agents, onConsensusReached]);

  return (
    <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-xl p-6 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              語義共振辯論 (Semantic Debate)
            </h3>
            <p className="text-xs text-gray-400 mt-1">任務: {missionName}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">
              Coherence Score
            </div>
            <div className="text-2xl font-mono font-bold text-cyan-400">{coherence}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-gray-800 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-cyan-500"
            initial={{ width: '0%' }}
            animate={{ width: `${coherence}%` }}
          />
        </div>

        {/* Message Terminal */}
        <div className="space-y-4 h-64 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, idx) => {
              const agent = agents.find(a => a.id === msg.agentId);
              const archetype = OMNI_AGENTS.find(a => a.id === msg.agentId);

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex gap-3 ${idx === messages.length - 1 ? 'animate-pulse' : ''}`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                      archetype?.type === 'E'
                        ? 'border-green-500/50 bg-green-900/20'
                        : archetype?.type === 'S'
                          ? 'border-orange-500/50 bg-orange-900/20'
                          : archetype?.type === 'G'
                            ? 'border-blue-500/50 bg-blue-900/20'
                            : 'border-cyan-500/50 bg-cyan-900/20'
                    }`}
                  >
                    <span className="text-xs font-bold text-white uppercase">
                      {archetype?.type || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-300">{agent?.name}</span>
                      <span className="text-[10px] text-gray-500 tracking-tighter px-1 border border-gray-800 rounded uppercase">
                        {archetype?.alias || 'Unknown'}
                      </span>
                    </div>
                    <div
                      className={`text-sm p-3 rounded-lg border ${
                        msg.type === 'consensus'
                          ? 'bg-cyan-900/10 border-cyan-500/20 text-cyan-100'
                          : 'bg-white/5 border-white/10 text-gray-300'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-center"
          >
            <Zap className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-cyan-300 uppercase">
              共識已達成 (Consensus Reached)
            </div>
            <div className="text-xs text-cyan-500/70 mt-1">任務執行效率加成已生效</div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
