'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Zap, Bot, Database, Shield, Globe, Cpu, X, Maximize2, 
  Trash2, ChevronRight, Hash, Lock, Activity, Command, 
  Search, RefreshCw, Send, Sparkles, Server, Network
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BrandStatusDot } from '../../components/brand';
import { fadeIn, staggerContainer } from '../../lib/animations';

interface TerminalLine {
  type: 'cmd' | 'out' | 'err' | 'info' | 'success' | 'trace';
  content: string;
  timestamp: string;
}

export default function OmniAgentTerminalPage() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'info', content: '>>> OMNIAGENT oX | AGENT OS v2.1.0-ALPHA', timestamp: new Date().toLocaleTimeString() },
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
          addLine('out', '  - [ID: omniagent-researcher] Status: STANDBY');
          addLine('out', '  - [ID: omniagent-auditor]    Status: ACTIVE (Task: Alchemy_Scan)');
          addLine('out', '  - [ID: omniagent-planner]    Status: SLEEP');
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
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-10 flex flex-col font-mono selection:bg-california-gold/30">
      {/* Top Chrome */}
      <motion.header 
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="mb-8 flex items-center justify-between"
      >
        <motion.div variants={fadeIn} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-berkeley-blue flex items-center justify-center text-california-gold shadow-lg">
            <Terminal size={24} />
          </div>
          <div>
            <h1 className="text-berkeley-blue text-xl font-black tracking-tighter uppercase">OmniAgent Agent OS</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">oX Pro-Dev Console • v2.1.0</p>
          </div>
        </motion.div>
        
        <motion.div variants={fadeIn} className="hidden md:flex items-center gap-8 px-6 py-2.5 bg-white/60 rounded-2xl border border-white/60 backdrop-blur-xl shadow-glass">
           <div className="flex items-center gap-2">
              <BrandStatusDot status="active" pulse />
              <span className="text-[10px] text-berkeley-blue font-black uppercase">Kernel Online</span>
           </div>
           <div className="h-4 w-px bg-slate-200" />
           <div className="flex items-center gap-2">
              <Activity size={14} className="text-verified" />
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Load: 1.42</span>
           </div>
        </motion.div>
      </motion.header>

      {/* Terminal Main Window */}
      <motion.main 
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="flex-1 bg-white/60 backdrop-blur-2xl rounded-[3rem] border border-white/80 shadow-glass flex flex-col overflow-hidden relative group"
      >
        {/* Glow Effects (Subtle) */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-berkeley-blue/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-california-gold/5 blur-[100px] pointer-events-none" />

        {/* Window Header */}
        <div className="h-12 px-8 bg-slate-100/30 border-b border-slate-200/50 flex items-center justify-between">
           <div className="flex gap-2.5">
              <div className="w-3 h-3 rounded-full bg-error/20 border border-error/30" />
              <div className="w-3 h-3 rounded-full bg-warning/20 border border-warning/30" />
              <div className="w-3 h-3 rounded-full bg-verified/20 border border-verified/30" />
           </div>
           <div className="flex items-center gap-3">
              <Hash size={12} className="text-california-gold" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">session: ox-742-gamma</span>
           </div>
        </div>

        {/* Console Output */}
        <div 
          ref={scrollRef}
          className="flex-1 p-10 overflow-y-auto space-y-3 no-scrollbar scroll-smooth"
        >
          {lines.map((l, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-6 group/line"
            >
              <span className="text-slate-300 text-[10px] w-20 flex-shrink-0 mt-1 font-medium">{l.timestamp}</span>
              <div className={cn(
                "text-[13px] leading-relaxed break-all font-medium",
                l.type === 'cmd' ? "text-berkeley-blue font-bold" :
                l.type === 'err' ? "text-error" :
                l.type === 'success' ? "text-verified font-bold" :
                l.type === 'info' ? "text-berkeley-blue/70" :
                l.type === 'trace' ? "text-purple-600 italic opacity-80" : "text-slate-600"
              )}>
                {l.type === 'cmd' && <span className="text-california-gold font-black mr-2">❯</span>}
                {l.content}
              </div>
            </motion.div>
          ))}
          
          {/* Active Input Line */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-100">
            <span className="text-california-gold font-black text-lg">❯</span>
            <input 
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-berkeley-blue text-sm font-bold caret-berkeley-blue placeholder:text-slate-300"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCommand(input)}
              placeholder={isProcessing ? "EXECUTION IN PROGRESS..." : "ENTER COMMAND..."}
              disabled={isProcessing}
              spellCheck={false}
              autoComplete="off"
            />
            {isProcessing && <RefreshCw size={16} className="text-berkeley-blue animate-spin mr-4" />}
          </div>
        </div>

        {/* Floating AI Helper */}
        <div className="absolute bottom-10 right-10 flex flex-col items-end gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
           <div className="p-6 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-glass border border-white/60 text-[11px] text-berkeley-blue font-bold uppercase tracking-widest max-w-[240px]">
              <div className="flex items-center gap-2 mb-3 text-california-gold">
                 <Zap size={14} fill="currentColor" />
                 <span className="text-berkeley-blue">OmniAgent Oracle</span>
              </div>
              <p className="leading-relaxed text-slate-500 lowercase italic font-medium normal-case">
                Try <span className="text-berkeley-blue font-black">"agent list"</span> to see active workers or <span className="text-berkeley-blue font-black">"5t seal"</span> to anchor current data.
              </p>
           </div>
           <div className="w-14 h-14 rounded-2xl bg-berkeley-blue flex items-center justify-center text-california-gold shadow-lg hover:scale-110 transition-transform cursor-pointer">
              <Bot size={28} />
           </div>
        </div>
      </motion.main>

      {/* Keyboard Shortcuts Footer */}
      <motion.footer 
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="mt-8 flex items-center justify-center gap-12"
      >
         {[
           { k: 'ALT + C', label: 'Clear' },
           { k: 'TAB', label: 'Autocomplete' },
           { k: 'ESC', label: 'Exit' },
           { k: 'CMD + K', label: 'Search History' },
         ].map(s => (
           <div key={s.k} className="flex items-center gap-3 group cursor-help">
              <kbd className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-500 font-bold shadow-sm group-hover:border-berkeley-blue/30 transition-colors">{s.k}</kbd>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] group-hover:text-berkeley-blue transition-colors">{s.label}</span>
           </div>
         ))}
      </motion.footer>
    </div>
  );
}
