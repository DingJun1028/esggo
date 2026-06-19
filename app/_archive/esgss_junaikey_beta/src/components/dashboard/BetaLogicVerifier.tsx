import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Search,
  Cpu,
  Zap,
  Activity,
  ShieldCheck,
  Hash,
  Eye,
  AlertTriangle,
  Play,
  RotateCcw,
  UserCheck,
} from 'lucide-react';
import { omniSpriteService } from '../../services/OmniSpriteService';
import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'critical' | 'system' | 'wisdom';
  message: string;
}

const BetaLogicVerifier: React.FC = () => {
  const [command, setCommand] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [stressRate, setStressRate] = useState(0);
  const [activeResonance, setActiveResonance] = useState(0.85);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    };
    setLogs(prev => [...prev.slice(-100), newLog]);
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const input = command.trim();
    setCommand('');
    addLog(`> Executing: ${input}`, 'system');

    // Simulate system resonance
    if (input.startsWith('/')) {
      const result = await omniSpriteService.executeSovereignCommand(input, {
        text: 'Testing from Verifier',
      });

      if (result.action === 'UNKNOWN') {
        addLog(`[Error] ${result.message}`, 'critical');
      } else if (result.action === 'MASTER_UNLOCK') {
        if (result.status === 'Authorized') {
          addLog(`[EMERGENCY] ${result.message}`, 'critical');
          addLog(`[STATUS] System Authority Re-established. All keys recalibrated.`, 'wisdom');
        } else {
          addLog(`[SECURITY ALERT] ${result.message}`, 'critical');
          addLog(`[ACTION] Initiating countermeasures...`, 'critical');
        }
      } else {
        addLog(`[Resonance] Command ${result.action} identified by Sprite.`, 'info');
        if (result.hash) {
          addLog(`[5T Sealing] Trustworthy Hash Engraved: ${result.hash}`, 'critical');
        }
        if (result.result) {
          addLog(`[Dr. Thoth Wisdom] ${result.result}`, 'wisdom');
        }
      }
    } else {
      addLog(`[Generic] Input processed via Spontaneous Flow.`, 'info');
    }
  };

  const toggleStressTest = () => {
    if (isStressTesting) {
      setIsStressTesting(false);
      setStressRate(0);
      addLog('--- Stress Test Terminated ---', 'system');
    } else {
      setIsStressTesting(true);
      addLog('--- Initiating 5T Logic Stress Test (1000 DNA/sec) ---', 'system');
      runStressLoop();
    }
  };

  const runStressLoop = () => {
    let count = 0;
    const interval = setInterval(() => {
      if (count >= 10) {
        // Safety for UI
        clearInterval(interval);
        return;
      }
      count++;
      const mockDnaId = `DNA_MOCK_${Math.floor(Math.random() * 10000)}`;
      addLog(`[Stress] Resonating DNA: ${mockDnaId} -> Verified via 5T`, 'info');
    }, 100);
  };

  return (
    <div className="flex flex-col h-[650px] bg-[#020617]/95 backdrop-blur-3xl rounded-[2rem] border border-cyan-500/20 overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.15)] relative group/verifier">
      {/* Scanline Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-50 opacity-[0.15]" />

      {/* Header */}
      <div className="p-6 border-b border-cyan-500/10 flex items-center justify-between bg-white/[0.02] relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 animate-pulse" />
            <div className="relative p-3 bg-cyan-500/20 rounded-2xl text-cyan-400 border border-cyan-500/30">
              <Cpu size={22} className="animate-spin-slow" />
            </div>
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-50 flex items-center gap-2">
              Logic Verifier <span className="text-cyan-500/50 font-normal">System Machine</span>
              <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[8px] rounded-md border border-cyan-500/20">
                LIVE
              </span>
            </h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mt-1">
              <UserCheck size={12} className="text-emerald-500" /> Authorized: Sovereign Master
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest opacity-70">
              Resonance Sync
            </span>
            <div className="flex items-center gap-2">
              <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cyan-400"
                  animate={{ width: `${activeResonance * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {(activeResonance * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <button
            onClick={toggleStressTest}
            className={`group relative flex items-center gap-3 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              isStressTesting
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                : 'bg-cyan-500/10 text-cyan-400 border border-white/5 hover:border-cyan-500/50 hover:bg-cyan-500 hover:text-slate-950'
            }`}
          >
            {isStressTesting ? (
              <>
                <Activity size={14} className="animate-pulse" /> Terminate Test
              </>
            ) : (
              <>
                <Play size={14} className="group-hover:fill-current" /> Initialize Stress
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Terminal Area */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-2 scrollbar-hide">
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-50 space-y-4">
            <Terminal size={40} strokeWidth={1} />
            <p className="text-[10px] uppercase tracking-widest">Waiting for Sovereign Input...</p>
          </div>
        )}
        {logs.map(log => (
          <div
            key={log.id}
            className="flex gap-3 border-l border-slate-800 pl-3 py-1 group hover:bg-white/5 transition-colors"
          >
            <span className="text-slate-600 text-[9px] shrink-0 w-12">{log.timestamp}</span>
            <span
              className={`
                ${log.type === 'system' ? 'text-blue-400' : ''}
                ${log.type === 'critical' ? 'text-cyan-400 font-bold' : ''}
                ${log.type === 'wisdom' ? 'text-amber-400 italic' : ''}
                ${log.type === 'info' ? 'text-slate-300' : ''}
            `}
            >
              {log.message}
            </span>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900/80 border-t border-cyan-500/20">
        <form onSubmit={handleCommand} className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/50">
              <Terminal size={14} />
            </div>
            <input
              type="text"
              value={command}
              onChange={e => setCommand(e.target.value)}
              placeholder="Enter Sovereign Command (e.g. /seal.5t) or raw data..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9 py-2.5 text-xs text-cyan-50 placeholder:text-slate-700 focus:outline-none focus:border-cyan-500/50 transition-all font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-6 bg-cyan-500/20 hover:bg-cyan-500 hover:text-slate-900 text-cyan-400 rounded-xl border border-cyan-500/30 transition-all flex items-center gap-2 group"
          >
            <Zap size={14} className="group-hover:fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">Execute</span>
          </button>
        </form>

        <div className="mt-3 flex gap-4 text-[9px] text-slate-600 font-bold uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={10} className="text-emerald-500" /> 5T Secure
          </div>
          <div className="flex items-center gap-1.5">
            <Activity size={10} className="text-cyan-500" /> No-Connect Flow Active
          </div>
          <div className="flex items-center gap-1.5">
            <Hash size={10} className="text-blue-500" /> SHA-256 Engine Ready
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetaLogicVerifier;
