import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ARVOStage, type ARVOResult } from '../types/omniCore';
import {
  ChevronDown,
  ChevronRight,
  BrainCircuit,
  Layers,
  Activity,
  Search,
  CheckCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ThinkingChainProps {
  analysis?: string;
  reasoning?: string;
  swarmPlan?: string[];
  isSwarm?: boolean;
  arvoStages?: ARVOResult[];
}

const ThinkingChain: React.FC<ThinkingChainProps> = ({
  analysis,
  reasoning,
  swarmPlan,
  isSwarm,
  arvoStages,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (
    !analysis &&
    !reasoning &&
    (!swarmPlan || swarmPlan.length === 0) &&
    (!arvoStages || arvoStages.length === 0)
  )
    return null;

  const getStageIcon = (stage: ARVOStage) => {
    switch (stage) {
      case ARVOStage.ANALYZE:
        return <Search className="w-4 h-4 text-blue-400" />;
      case ARVOStage.REASON:
        return <BrainCircuit className="w-4 h-4 text-purple-400" />;
      case ARVOStage.VERIFY:
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case ARVOStage.ORCHESTRATE:
        return <Zap className="w-4 h-4 text-amber-400" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  const getStageTitle = (stage: ARVOStage) => {
    switch (stage) {
      case ARVOStage.ANALYZE:
        return 'Analyze (Intent & Extraction)';
      case ARVOStage.REASON:
        return 'Reason (Inference & RAG)';
      case ARVOStage.VERIFY:
        return 'Verify (Fact Alignment)';
      case ARVOStage.ORCHESTRATE:
        return 'Orchestrate (Insight Synthesis)';
      default:
        return String(stage);
    }
  };

  return (
    <div className="w-full max-w-2xl my-2 border border-blue-500/20 rounded-lg bg-black/40 backdrop-blur-sm overflow-hidden font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-xs uppercase tracking-wider text-blue-400 hover:bg-blue-500/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          {arvoStages && arvoStages.length > 0 ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
          ) : isSwarm ? (
            <Activity className="w-4 h-4 text-purple-400" />
          ) : (
            <BrainCircuit className="w-4 h-4" />
          )}
          <span>
            {arvoStages && arvoStages.length > 0
              ? 'ARVO AI Reasoning Active'
              : isSwarm
                ? 'Swarm Intelligence Active'
                : 'Thought Process'}
          </span>
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
              {/* ARVO Stages Visualization */}
              {arvoStages && arvoStages.length > 0 && (
                <div className="space-y-4 border-l border-blue-500/10 ml-2 pl-4">
                  {arvoStages.map((stageResult, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative"
                    >
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500/30 border border-blue-400/50 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-1">
                        {getStageIcon(stageResult.stage)}
                        <span
                          className={
                            stageResult.confidence > 0.8 ? 'text-emerald-400' : 'text-blue-400'
                          }
                        >
                          {getStageTitle(stageResult.stage)}
                        </span>
                        {stageResult.confidence > 0 && (
                          <span className="ml-auto text-white/40 font-mono">
                            {Math.round(stageResult.confidence * 100)}%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed italic">
                        {stageResult.content}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Legacy fallback - Analysis Section */}
              {analysis && !arvoStages && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-blue-300 font-semibold text-xs">
                    <Layers className="w-3 h-3" />
                    ANALYSIS (INTENT)
                  </div>
                  <p className="pl-5 leading-relaxed text-gray-400 italic">"{analysis}"</p>
                </div>
              )}

              {/* Legacy fallback - Reasoning Section */}
              {reasoning && !arvoStages && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs">
                    <BrainCircuit className="w-3 h-3" />
                    REASONING CHAIN
                  </div>
                  <div className="pl-5 prose prose-invert prose-sm max-w-none text-gray-300">
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
