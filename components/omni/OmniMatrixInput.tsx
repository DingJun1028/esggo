'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, BrainCircuit, Activity, Bot, Database, Zap } from 'lucide-react';

const SIX_FORMS = [
  { id: 'awaken', label: '覺', desc: 'Awaken', icon: <Sparkles size={14} /> },
  { id: 'deconstruct', label: '解', desc: 'Deconstruct', icon: <BrainCircuit size={14} /> },
  { id: 'strategize', label: '策', desc: 'Strategize', icon: <Activity size={14} /> },
  { id: 'execute', label: '貫', desc: 'Execute', icon: <Bot size={14} /> },
  { id: 'feedback', label: '迴', desc: 'Feedback', icon: <Zap size={14} /> },
  { id: 'forge', label: '鍛', desc: 'Forge', icon: <Database size={14} /> }
];

export default function OmniMatrixInput({ collapsed = false }: { collapsed?: boolean }) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [activeForm, setActiveForm] = useState(0);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === 'running') return;

    setStatus('running');
    setActiveForm(0);
    setResult(null);

    // Simulate form transitions for visual effect
    const interval = setInterval(() => {
      setActiveForm(prev => (prev < 5 ? prev + 1 : prev));
    }, 800);

    try {
      const res = await fetch('/api/omni-matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawCommand: input,
          expectedDoD: "任務已解析並輸出結果"
        })
      });
      const data = await res.json();
      
      clearInterval(interval);
      setActiveForm(5); // Reach Forge phase

      if (data.success) {
        setStatus('success');
        setResult(data.data);
      } else {
        setStatus('error');
        setResult(data.error);
      }
    } catch (err: any) {
      clearInterval(interval);
      setStatus('error');
      setResult(err.message);
    }
  };

  if (collapsed) {
    return (
      <button 
        className="w-full py-2 flex justify-center items-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20"
        title="OmniMatrix 終始矩陣"
      >
        <Sparkles size={16} />
      </button>
    );
  }

  return (
    <div className="w-full bg-[#020617]/50 rounded-xl border border-cyan-500/20 overflow-hidden">
      {/* Matrix Header */}
      <div className="px-3 py-2 flex items-center justify-between bg-cyan-500/10 border-b border-cyan-500/20">
        <div className="flex items-center gap-2 text-cyan-400">
          <Sparkles size={14} />
          <span className="text-xs font-bold tracking-widest uppercase">OmniMatrix 終始矩陣</span>
        </div>
      </div>

      {/* Six Forms Visualizer (Only visible when running) */}
      <AnimatePresence>
        {status === 'running' && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex justify-between px-3 py-3 border-b border-white/5 bg-black/40"
          >
            {SIX_FORMS.map((form, idx) => {
              const isActive = idx === activeForm;
              const isPast = idx < activeForm;
              return (
                <div key={form.id} className="flex flex-col items-center gap-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive ? 'bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.8)] scale-110' :
                    isPast ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' :
                    'bg-white/5 text-slate-500 border border-white/10'
                  }`}>
                    {isActive ? <div className="animate-spin-slow">{form.icon}</div> : form.icon}
                  </div>
                  <span className={`text-[9px] font-bold ${isActive ? 'text-cyan-400' : isPast ? 'text-cyan-600' : 'text-slate-600'}`}>
                    {form.label}
                  </span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-2 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入混亂意圖，矩陣為您解構..."
          className="w-full bg-black/30 border border-white/10 rounded-lg py-2 pl-3 pr-10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
          disabled={status === 'running'}
        />
        <button
          type="submit"
          disabled={status === 'running' || !input.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-cyan-400 disabled:opacity-50 transition-colors"
        >
          <Send size={14} />
        </button>
      </form>

      {/* Result Display */}
      <AnimatePresence>
        {(status === 'success' || status === 'error') && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-3 py-2 text-xs border-t ${
              status === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold">{status === 'success' ? '✅ 矩陣執行完成' : '⚠️ 矩陣異常'}</span>
              <button onClick={() => setStatus('idle')} className="text-xs hover:text-white">清除</button>
            </div>
            {status === 'success' && result?.strategy && (
              <div className="mt-1 p-1.5 bg-black/40 rounded border border-white/5 space-y-1">
                <div><span className="text-slate-500">代理:</span> {result.strategy.assignedAgent}</div>
                <div><span className="text-slate-500">信心:</span> {(result.strategy.confidence * 100).toFixed(0)}%</div>
                <div><span className="text-slate-500">行動:</span> {result.strategy.actionGraph?.length || 0} 步</div>
              </div>
            )}
            {status === 'error' && (
              <div className="mt-1 opacity-80">{result}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
