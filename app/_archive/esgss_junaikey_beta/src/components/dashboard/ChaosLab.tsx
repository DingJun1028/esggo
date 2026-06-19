import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertOctagon,
  Zap,
  Activity,
  Terminal,
  ShieldAlert,
  Flame,
  Brain,
  Lock,
  Unlock,
} from 'lucide-react';
import { useAgentRpg } from '../../hooks/useAgentRpg';
import { OMNI_AGENTS } from '../../data/omni-agents';

interface Anomaly {
  id: string;
  title: string;
  description: string;
  complexity: number;
  impact: string;
}

const AVAILABLE_ANOMALIES: Anomaly[] = [
  {
    id: 'anom_01',
    title: 'Sudden Regulatory Collapse',
    description: 'Global ESG reporting standards have been suspended after a major fraud scandal.',
    complexity: 0.8,
    impact: 'High instability in Governance (G) alignment.',
  },
  {
    id: 'anom_02',
    title: 'Deep-Sea Mining Crisis',
    description: 'A massive ecosystem failure detected due to automated mining bots.',
    complexity: 0.9,
    impact: 'Violent fluctuations in Environmental (E) drift.',
  },
  {
    id: 'anom_03',
    title: 'Labor Revolt in VR Hubs',
    description: 'Digital labor unions have taken control of regional compute nodes.',
    complexity: 0.7,
    impact: 'Serious Social (S) empathy conflict.',
  },
];

export const ChaosLab: React.FC = () => {
  const { profile, processChaosInput } = useAgentRpg();
  const [isInjecting, setIsInjecting] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[SYSTEM] Chaos Laboratory Online.',
    '[STATUS] Waiting for Anomaly Injection...',
  ]);
  const [chaosLevel, setChaosLevel] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isEvolved = profile.level >= 5;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev.slice(-20), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleInject = async () => {
    if (!selectedAnomaly) return;

    setIsInjecting(true);
    addLog(`CRITICAL: Injecting Anomaly ${selectedAnomaly.id}...`);
    setChaosLevel(30);

    const phases = [
      'Bypassing Safety Protocols...',
      'Decrypting Fragmented Intelligence...',
      'Force-Feeding Contradictory Logic...',
      'Monitoring Neural Feedback...',
      'Stabilizing High-Entropy Core...',
    ];

    for (const phase of phases) {
      await new Promise(r => setTimeout(r, 800));
      addLog(phase);
      setChaosLevel(prev => prev + 15);
    }

    const result = processChaosInput({
      content: selectedAnomaly.title,
      complexity: selectedAnomaly.complexity,
      category: 'Chaos',
      type: 'CHAOS',
    });

    addLog(`INJECTION COMPLETE. Result: ${result.feedback}`);
    addLog(`STATS: XP +${result.xpGained}, Drift Shifted.`);

    setIsInjecting(false);
    setChaosLevel(0);
    setSelectedAnomaly(null);
  };

  if (!isEvolved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] bg-red-950/20 border border-red-500/20 rounded-2xl p-12 text-center">
        <Lock className="w-16 h-16 text-red-500 mb-6 animate-pulse" />
        <h2 className="text-3xl font-bold text-red-100 mb-4">CHAOS LAB LOCKED</h2>
        <p className="text-red-400 max-w-md mx-auto">
          Training in the Chaos Laboratory is highly dangerous. Your agent must reach **Level 5** to
          unlock the neural resilience required to survive high-entropy data injection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-2">
      {/* Left: Anomaly Selector */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-black/60 border border-red-500/30 rounded-2xl p-6 backdrop-blur-md">
          <h3 className="text-xl font-bold text-red-400 flex items-center gap-2 mb-6">
            <AlertOctagon className="w-5 h-5" />
            Anomaly Injector
          </h3>

          <div className="space-y-3">
            {AVAILABLE_ANOMALIES.map(anom => (
              <button
                key={anom.id}
                onClick={() => setSelectedAnomaly(anom)}
                disabled={isInjecting}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  selectedAnomaly?.id === anom.id
                    ? 'border-red-500 bg-red-900/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                    : 'border-white/10 bg-white/5 hover:border-red-500/50'
                }`}
              >
                <div className="font-bold text-sm text-red-100 mb-1">{anom.title}</div>
                <div className="text-[10px] text-gray-500 leading-tight">{anom.description}</div>
              </button>
            ))}
          </div>

          <button
            onClick={handleInject}
            disabled={!selectedAnomaly || isInjecting}
            className={`w-full mt-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              !selectedAnomaly || isInjecting
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-500 hover:to-orange-500 shadow-lg shadow-red-600/20'
            }`}
          >
            <Flame className={`w-5 h-5 ${isInjecting ? 'animate-bounce' : ''}`} />
            {isInjecting ? 'INJECTING CHAOS...' : 'INITIATE INJECTION'}
          </button>
        </div>

        <div className="bg-black/60 border border-white/10 rounded-2xl p-6">
          <h4 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4">
            Chaos Metrics
          </h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-gray-500">RESILIENCE</span>
                <span className="text-cyan-400 font-bold">
                  {profile.attributes.resilience.toFixed(1)}
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cyan-500"
                  animate={{ width: `${Math.min(100, profile.attributes.resilience)}%` }}
                />
              </div>
            </div>
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="text-[10px] text-red-300 font-bold mb-1 uppercase">Warning</div>
              <p className="text-[9px] text-red-400/80 leading-relaxed italic">
                High chaos training increases drift instability. Prolonged exposure may lead to
                neural corruption.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle & Right: Execution & Terminal */}
      <div className="lg:col-span-2 space-y-6">
        {/* Visualizer */}
        <div className="bg-black/60 border border-white/10 rounded-2xl p-8 relative overflow-hidden min-h-[300px] flex items-center justify-center">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at center, transparent 0%, black 100%), linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
              backgroundSize: '100% 100%, 20px 20px, 20px 20px',
            }}
          />

          <AnimatePresence>
            {isInjecting ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="relative z-10 flex flex-col items-center"
              >
                <div className="relative">
                  <Activity className="w-24 h-24 text-red-500 mb-4 animate-pulse" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-red-500"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
                <div className="text-xl font-mono font-bold text-red-400 tracking-[0.2em]">
                  CHAOS DETECTED
                </div>
                <div className="text-[10px] text-red-600 font-mono mt-2">
                  ENTROPY: {chaosLevel}%
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 flex flex-col items-center text-center opacity-40 hover:opacity-100 transition-opacity"
              >
                <Brain className="w-16 h-16 text-gray-600 mb-4" />
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Neural Core Stable
                </div>
                <div className="text-[10px] text-gray-600 mt-1 max-w-xs">
                  Select an anomaly to begin high-entropy training sequence.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Terminal */}
        <div className="bg-black border border-white/10 rounded-2xl flex flex-col h-[280px]">
          <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-green-500" />
              <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider">
                Chaos Terminal v2.0
              </span>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-orange-500/50" />
              <div className="w-2 h-2 rounded-full bg-green-500/50" />
            </div>
          </div>
          <div
            ref={scrollRef}
            className="flex-1 p-4 font-mono text-[11px] overflow-y-auto custom-scrollbar bg-black/80"
          >
            {terminalLogs.map((log, i) => (
              <div
                key={i}
                className={`mb-1 ${
                  log.includes('CRITICAL')
                    ? 'text-red-500 font-bold'
                    : log.includes('COMPLETE')
                      ? 'text-green-400'
                      : log.includes('[SYSTEM]')
                        ? 'text-blue-400'
                        : 'text-gray-400'
                }`}
              >
                {log}
              </div>
            ))}
            {isInjecting && (
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-4 bg-red-500 ml-1"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
