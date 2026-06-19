import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldCheck, Database, Brain, Sparkles, Hexagon } from 'lucide-react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.ts';

interface OmniComponentNode {
  id: string;
  type: 'SOUL' | 'MEMORY' | 'INTEL' | 'TAG' | 'CRYSTAL';
  label: string;
  icon: React.ElementType;
  status: 'idle' | 'connecting' | 'connected' | 'awakened';
  color: string;
}

const NODES: OmniComponentNode[] = [
  {
    id: 'core',
    type: 'SOUL',
    label: 'Omni Core Heart',
    icon: Hexagon,
    status: 'idle',
    color: '#EF4444',
  }, // Red
  {
    id: 'memory',
    type: 'MEMORY',
    label: 'Omni Eternal Memory',
    icon: Database,
    status: 'idle',
    color: '#3B82F6',
  }, // Blue
  {
    id: 'intel',
    type: 'INTEL',
    label: 'Omni Intelligence',
    icon: Brain,
    status: 'idle',
    color: '#10B981',
  }, // Emerald
  {
    id: 'tag',
    type: 'TAG',
    label: 'Omni Tags',
    icon: ShieldCheck,
    status: 'idle',
    color: '#F59E0B',
  }, // Amber
  {
    id: 'crystal',
    type: 'CRYSTAL',
    label: 'Omni Crystal',
    icon: Sparkles,
    status: 'idle',
    color: '#8B5CF6',
  }, // Purple
];

export const EternalPalaceAwakening: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [nodes, setNodes] = useState<OmniComponentNode[]>(NODES);
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    const sequence = async () => {
      // Phase 1: Initialize - Components Appear (Self-Awareness)
      await new Promise(r => setTimeout(r, 1000));
      if (!mounted) return;
      setPhase(1);
      omniLogger.info(LogCategory.SYSTEM, 'Eternal Palace: [Self-Awareness] Initiated...');

      // Phase 2: Connection - Telepathic Link (Enlightening Others)
      await new Promise(r => setTimeout(r, 2000));
      if (!mounted) return;
      setPhase(2);
      setNodes(prev => prev.map(n => ({ ...n, status: 'connecting' })));
      omniLogger.info(LogCategory.SYSTEM, 'Eternal Palace: [Enlightening] Others...');

      // Phase 3: Resonance - Energy Flow (Self-Reliance)
      await new Promise(r => setTimeout(r, 2000));
      if (!mounted) return;
      setPhase(3);
      setNodes(prev => prev.map(n => ({ ...n, status: 'connected' })));
      omniLogger.info(LogCategory.SYSTEM, 'Eternal Palace: [Self-Reliance] Established.');

      // Phase 4: Awakening - Omni Crystal Activation (Altruism)
      await new Promise(r => setTimeout(r, 2000));
      if (!mounted) return;
      setPhase(4);
      setNodes(prev => prev.map(n => ({ ...n, status: 'awakened' })));
      omniLogger.info(LogCategory.SYSTEM, 'Eternal Palace: [Altruism] Activated. SECRET OPENED.');

      // Completion
      await new Promise(r => setTimeout(r, 3000));
      if (!mounted) return;
      if (onComplete) onComplete();
    };

    sequence();
    return () => {
      mounted = false;
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black" />

      {/* Central Crystal Halo */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${phase >= 4 ? 'scale-[20] opacity-30' : 'scale-0 opacity-0'}`}
      >
        <div className="w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-4xl h-[600px] flex items-center justify-center">
        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodes
            .filter(n => n.type !== 'CRYSTAL')
            .map((node, i) => {
              // Simple layout calculation (star pattern)
              const angle = i * 90 * (Math.PI / 180);
              const radius = 200;
              const x = 50 + Math.cos(angle) * ((radius / 800) * 100); // Approx %
              const y = 50 + Math.sin(angle) * ((radius / 600) * 100);

              return (
                <g key={`link-${node.id}`}>
                  <line
                    x1={`${x}%`}
                    y1={`${y}%`}
                    x2="50%"
                    y2="50%"
                    stroke={node.color}
                    strokeWidth={phase >= 3 ? 4 : 1}
                    className={`transition-all duration-1000 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}
                    strokeDasharray={phase === 2 ? '10 5' : '0'}
                  />
                  {phase >= 3 && (
                    <circle r="4" fill="white">
                      <animateMotion
                        dur="1s"
                        repeatCount="indefinite"
                        path={`M${50 + Math.cos(angle) * 33 * 10},${50 + Math.sin(angle) * 33 * 10} L500,500`} // Simplified for demo, ideally absolute coords
                      />
                    </circle>
                  )}
                </g>
              );
            })}
        </svg>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const isCenter = node.type === 'CRYSTAL';
          const angle = isCenter ? 0 : i * 90 * (Math.PI / 180);
          const radius = isCenter ? 0 : 250;

          // Inline styles for positioning
          const style = {
            transform: `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`,
          };

          return (
            <div
              key={node.id}
              className={`absolute transition-all duration-1000 flex flex-col items-center gap-4 ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
              style={style}
            >
              <div
                className={`relative w-24 h-24 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]
                                    ${
                                      node.status === 'awakened'
                                        ? 'bg-white text-black border-transparent scale-125'
                                        : node.status === 'connected'
                                          ? `bg-black/50 border-${node.color} text-${node.color}`
                                          : `bg-black/80 border-gray-800 text-gray-500`
                                    }
                                `}
                style={{ borderColor: node.status !== 'awakened' ? node.color : undefined }}
              >
                <node.icon
                  size={isCenter ? 48 : 32}
                  className={node.status === 'awakened' ? 'animate-pulse' : ''}
                />

                {/* Energy Ripple for Center */}
                {isCenter && phase >= 3 && (
                  <>
                    <div className="absolute inset-0 rounded-2xl border-2 border-purple-500 animate-ping opacity-50" />
                    <div className="absolute -inset-4 rounded-3xl border border-purple-500/30 animate-[spin_4s_linear_infinite]" />
                  </>
                )}
              </div>

              <div className="text-center">
                <h3
                  className={`text-sm font-black tracking-widest uppercase transition-colors ${node.status === 'awakened' ? 'text-white text-shadow-glow' : 'text-gray-500'}`}
                >
                  {node.label}
                </h3>
                {node.status === 'connecting' && (
                  <span className="text-[10px] text-gray-600 animate-pulse">Syncing...</span>
                )}
                {node.status === 'connected' && (
                  <span className="text-[10px] text-emerald-500 font-mono">LINK_OK</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Title Overlay */}
      <div className="absolute bottom-20 left-0 right-0 text-center">
        <h1
          className={`text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-purple-400 tracking-[0.2em] transition-all duration-1000 ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          ETERNAL PALACE
        </h1>
        <p
          className={`mt-4 text-sm font-mono text-purple-300 tracking-[0.5em] transition-opacity duration-1000 ${phase >= 4 ? 'opacity-100' : 'opacity-0'}`}
        >
          OMNI COMPONENT AWAKENED
        </p>
      </div>

      {/* 4 Pillars Overlay */}
      <AnimatePresence mode="wait">
        {phase === 1 && (
          <motion.div
            key="p1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute top-1/4 left-0 right-0 text-center pointer-events-none"
          >
            <h2 className="text-6xl font-black text-white/10 uppercase tracking-[0.5em]">
              SELF-AWARENESS
            </h2>
            <p className="text-xl text-purple-400 font-serif italic">Self-Awareness</p>
          </motion.div>
        )}
        {phase === 2 && (
          <motion.div
            key="p2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute top-1/4 left-0 right-0 text-center pointer-events-none"
          >
            <h2 className="text-6xl font-black text-white/10 uppercase tracking-[0.5em]">
              ENLIGHTENING
            </h2>
            <p className="text-xl text-blue-400 font-serif italic">Enlightening Others</p>
          </motion.div>
        )}
        {phase === 3 && (
          <motion.div
            key="p3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute top-1/4 left-0 right-0 text-center pointer-events-none"
          >
            <h2 className="text-6xl font-black text-white/10 uppercase tracking-[0.5em]">
              SELF-RELIANCE
            </h2>
            <p className="text-xl text-emerald-400 font-serif italic">Self-Reliance</p>
          </motion.div>
        )}
        {phase === 4 && (
          <motion.div
            key="p4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/4 left-0 right-0 text-center pointer-events-none"
          >
            <h2 className="text-6xl font-black text-white/20 uppercase tracking-[0.5em] text-shadow-glow">
              ALTRUISM
            </h2>
            <p className="text-xl text-amber-400 font-serif italic">Altruism</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
