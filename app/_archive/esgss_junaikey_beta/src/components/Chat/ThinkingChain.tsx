import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, BrainCircuit, Layers, Activity } from 'lucide-react';

interface ThinkingChainProps {
  analysis?: string;
  reasoning?: string;
  swarmPlan?: string[];
  isSwarm?: boolean;
}

const ThinkingChain: React.FC<ThinkingChainProps> = ({
  analysis,
  reasoning,
  swarmPlan,
  isSwarm,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!analysis && !reasoning && !swarmPlan) return null;

  return (
    <div className="w-full max-w-2xl my-2 border border-blue-500/20 rounded-lg bg-black/40 backdrop-blur-sm overflow-hidden font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-xs uppercase tracking-wider text-blue-400 hover:bg-blue-500/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isSwarm ? (
            <Activity className="w-4 h-4 text-purple-400" />
          ) : (
            <BrainCircuit className="w-4 h-4" />
          )}
          <span>{isSwarm ? 'Swarm Intelligence Active' : 'Thought Process'}</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-blue-500/20"
          >
            <div className="p-4 space-y-4 text-sm text-gray-300">
              {/* Analysis Section */}
              {analysis && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-blue-300 font-semibold text-xs">
                    <Layers className="w-3 h-3" />
                    ANALYSIS (INTENT)
                  </div>
                  <p className="pl-5 leading-relaxed text-gray-400 italic">"{analysis}"</p>
                </div>
              )}

              {/* Reasoning Section */}
              {reasoning && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs">
                    <BrainCircuit className="w-3 h-3" />
                    REASONING CHAIN
                  </div>
                  <div className="pl-5 prose prose-invert prose-sm max-w-none text-gray-300">
                    {/* Simple formatting for reasoning steps */}
                    {reasoning.split('\n').map((line, i) => (
                      <p key={i} className="mb-1">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Swarm Plan Section */}
              {swarmPlan && swarmPlan.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-yellow-300 font-semibold text-xs">
                    <Activity className="w-3 h-3" />
                    SWARM EXECUTION PLAN
                  </div>
                  <div className="pl-5 space-y-2">
                    {swarmPlan.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThinkingChain;
