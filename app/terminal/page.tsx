'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Zap, Bot, Database, Shield, Globe, Cpu, X, Maximize2, 
  Trash2, ChevronRight, Hash, Lock, Activity, Command, 
  Search, RefreshCw, Send, Sparkles, Server, Network
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { BrandStatusDot, BrandBadge, BrandButton } from '../../components/brand';

interface TerminalLine {
  type: 'cmd' | 'out' | 'err' | 'info' | 'success' | 'trace';
  content: string;
  timestamp: string;
}

export default function HermesTerminalPage() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'info', content: '>>> OMNIHERMES oX | AGENT OS v2.1.0-ALPHA', timestamp: new Date().toLocaleTimeString() },
    { type: 'info', content: '>>> 5T INTEGRITY KERNEL: ONLINE', timestamp: new Date().toLocaleTimeString() },
    { type: 'info', content: '>>> TYPE "HELP" FOR COMMAND MANIFEST.', timestamp: new Date().toLocaleTimeString() },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const addLine = (type: TerminalLine['type'], content: string) => {
    setLines(prev => [...prev, { type, content, timestamp: new Date().toLocaleTimeString() }]);
  };

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    addLine('cmd', trimmed);
    setInput('');
    setIsProcessing(true);

    const [action, ...args] = trimmed.split(' ').filter(Boolean);
    const actionLower = action.toLowerCase();

    // Local Logic Flow
    await new Promise(r => setTimeout(r, 600));

    switch (actionLower) {
      case 'help':
        addLine('out', 'Available Command Manifest:');
        addLine('out', '  AGENT LIST    - List all active Swarm agents');
        addLine('out', '  AGENT EXEC    - Execute a Genkit trace (Usage: agent exec [task_id])');
        addLine('out', '  5T SEAL       - Generate a cryptographic Master Seal');
        addLine('out', '  BLUE STATUS   - Monitor BlueCC H100 cluster load');
        addLine('out', '  TRACE VIEW    - View real-time AI reasoning chain');
        addLine('out', '  CLEAR         - Flush terminal buffer');
        addLine('out', '  EXIT          - Exit to Sovereign Dashboard');
        break;

      case 'agent':
        if (args[0] === 'list') {
          addLine('success', 'Active Agents Found:');
          addLine('out', '  - [ID: hermes-researcher] Status: STANDBY');
          addLine('out', '  - [ID: hermes-auditor]    Status: ACTIVE (Task: Alchemy_Scan)');
          addLine('out', '  - [ID: hermes-planner]    Status: SLEEP');
        } else if (args[0] === 'exec') {
          addLine('info', `>>> Initializing Genkit Trace for Task: ${args[1] || 'default'}...`);
          await new Promise(r => setTimeout(r, 1500));
          addLine('trace', '[Trace] Thinking... identifying metric gaps in GRI 305-1');
          await new Promise(r => setTimeout(r, 1000));
          addLine('trace', '[Trace] Calling Search Tool (Vault_Omni)...');
          await new Promise(r => setTimeout(r, 800));
          addLine('success', 'Execution Complete. Artifact Art_v1 created.');
        } else {
          addLine('err', 'Invalid Agent Sub-command. Try "list" or "exec".');
        }
        break;

      case '5t':
        if (args[0] === 'seal') {
          addLine('info', '>>> Initiating 5T Multi-factor Hashing...');
          await new Promise(r => setTimeout(r, 1200));
          const mockHash = `sha256:ox_${Math.random().toString(36).substring(7)}`;
          addLine('success', `Master Seal Generated: ${mockHash}`);
          addLine('info', 'Record pushed to 萬能聖碑 (Vault Omni).');
        } else {
          addLine('err', 'Usage: 5t seal');
        }
        break;

      case 'blue':
        addLine('info', '>>> Querying BlueCC Hybrid Plane...');
        await new Promise(r => setTimeout(r, 1000));
        addLine('out', 'Cluster Status: HEALTHY');
        addLine('out', 'H100 Node 01-04: 65% Load');
        addLine('out', 'VRAM Usage: 42.1 / 80 GB');
        break;

      case 'clear':
        setLines([]);
        break;

      case 'exit':
        window.location.href = '/';
        break;

      default:
        addLine('err', `Command "${actionLower}" not recognized by oX Kernel.`);
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-10 flex flex-col font-mono selection:bg-[#FDB515]/30">
      {/* Top Chrome */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Terminal size={20} />
          </div>
          <div>
            <h1 className="text-white text-lg font-black tracking-tighter uppercase">Hermes Agent OS</h1>
            <p className="text-[#94a3b8] text-[10px] font-bold uppercase tracking-[0.3em]">oX Pro-Dev Console</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 px-6 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
           <div className="flex items-center gap-2">
              <BrandStatusDot status="active" pulse />
              <span className="text-[10px] text-white font-black uppercase">Kernel Online</span>
           </div>
           <div className="h-4 w-px bg-white/10" />
           <div className="flex items-center gap-2">
              <Activity size={14} className="text-emerald-400" />
              <span className="text-[10px] text-white font-black uppercase">Load: 1.42</span>
           </div>
        </div>
      </header>

      {/* Terminal Main Window */}
      <main className="flex-1 bg-[#010409] rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col overflow-hidden relative group">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 blur-[120px] pointer-events-none" />

        {/* Window Header */}
        <div className="h-10 px-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
           <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
           </div>
           <div className="flex items-center gap-3">
              <Hash size={12} className="text-[#FDB515]" />
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">session: ox-742-gamma</span>
           </div>
        </div>

        {/* Console Output */}
        <div 
          ref={scrollRef}
          className="flex-1 p-8 overflow-y-auto space-y-2 no-scrollbar scroll-smooth"
        >
          {lines.map((l, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4 group/line"
            >
              <span className="text-white/10 text-[9px] w-16 flex-shrink-0 mt-1">{l.timestamp}</span>
              <div className={cn(
                "text-xs leading-relaxed break-all",
                l.type === 'cmd' ? "text-white font-black" :
                l.type === 'err' ? "text-red-400" :
                l.type === 'success' ? "text-emerald-400" :
                l.type === 'info' ? "text-blue-400" :
                l.type === 'trace' ? "text-purple-400 italic" : "text-[#cbd5e1]"
              )}>
                {l.type === 'cmd' && <span className="text-blue-500 mr-2">$</span>}
                {l.content}
              </div>
            </motion.div>
          ))}
          
          {/* Active Input Line */}
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5">
            <span className="text-blue-500 font-black text-sm">$</span>
            <input 
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-white text-sm font-bold caret-blue-500"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCommand(input)}
              placeholder={isProcessing ? "Executing..." : "Enter command..."}
              disabled={isProcessing}
              spellCheck={false}
              autoComplete="off"
            />
            {isProcessing && <RefreshCw size={14} className="text-blue-500 animate-spin mr-4" />}
          </div>
        </div>

        {/* Floating AI Helper */}
        <div className="absolute bottom-10 right-10 flex flex-col items-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="p-4 bg-blue-600 rounded-3xl shadow-2xl text-[10px] text-white font-black uppercase tracking-widest max-w-[200px] border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                 <Zap size={12} className="text-[#FDB515]" />
                 <span>Hermes Suggestion</span>
              </div>
              <p className="leading-relaxed text-blue-100/80 lowercase italic font-normal">
                Try "agent list" to see available workers or "5t seal" to secure current buffer.
              </p>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-[#003262] flex items-center justify-center text-[#FDB515] shadow-extreme">
              <Bot size={24} />
           </div>
        </div>
      </main>

      {/* Keyboard Shortcuts Footer */}
      <footer className="mt-6 flex items-center justify-center gap-10">
         {[
           { k: 'ALT + C', label: 'Clear' },
           { k: 'TAB', label: 'Autocomplete' },
           { k: 'ESC', label: 'Exit' },
           { k: 'CMD + K', label: 'Search History' },
         ].map(s => (
           <div key={s.k} className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] text-white/40">{s.k}</kbd>
              <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">{s.label}</span>
           </div>
         ))}
      </footer>
    </div>
  );
}
