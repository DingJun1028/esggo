'use client';

import React from 'react';
import { BookOpen, CheckCircle, ScrollText, Link as LinkIcon, Unlink, ArrowRightLeft, Server, Laptop } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OmniCodexViewer({ isVpsBound, toggleVpsBindingAction }: { isVpsBound: boolean, toggleVpsBindingAction: () => void }) {
  return (
    <div className="relative bg-[#020617]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mt-8 overflow-hidden group w-full">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
          <BookOpen className="text-cyan-400" />
          自主通典 (OmniCore Codex)
        </h2>
        <span className="text-xs text-cyan-400 font-mono border border-cyan-400/30 px-2 py-1 rounded bg-cyan-400/10">TRANSCENDED</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 relative z-10">
        <div className="flex-1 bg-black/40 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <ScrollText size={18} className="text-indigo-400" />
            <h3 className="font-bold text-white text-sm">最新發行架構：MECE 極限性能進化矩陣</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            本系統已正式將「16 條 MECE 極限進化法則」編譯為 TypeScript 強型別契約，並與 OmniAgentBus 及 Karma Protocol 達成無縫閉環。所有代理任務與自我修復（Spontaneous Virtue）皆受此中樞即時監控。
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle size={14} className="text-emerald-400" /> <span>OmniAgentBus 事件廣播同步率 100%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle size={14} className="text-emerald-400" /> <span>Karma Protocol 自動果因推演與 5T 封存</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle size={14} className="text-emerald-400" /> <span>Gap Analysis 短板自動化探測上線</span>
            </div>
          </div>
        </div>

        {/* 終始矩陣 (End-to-Start Matrix) */}
        <div className="flex-1 bg-black/40 border border-white/5 p-4 rounded-xl relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <Server size={18} className="text-emerald-400" />
            <h3 className="font-bold text-white text-sm">以終為始：終始矩陣 (Matrix Sync)</h3>
          </div>
          
          <div className="flex items-center justify-between mt-8 relative px-4">
            {/* 本地端 [始] */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <span className="text-2xl font-black">始</span>
              </div>
              <div className="text-center mt-2">
                <p className="text-xs font-bold text-white uppercase tracking-wider">ESGGO Local Base</p>
                <p className="text-[10px] text-slate-500 font-mono">127.0.0.1:3001</p>
              </div>
            </div>

            {/* 雙向同步光束 */}
            <div className="flex-1 flex flex-col items-center justify-center relative px-4 z-0">
              {isVpsBound ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="w-full flex flex-col items-center"
                >
                  <div className="relative w-full h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="absolute inset-y-0 w-1/3 bg-emerald-400/80 blur-[2px]"
                      animate={{ left: ['-50%', '150%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div 
                      className="absolute inset-y-0 w-1/3 bg-cyan-400/80 blur-[2px]"
                      animate={{ right: ['-50%', '150%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <div className="mt-2 text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <ArrowRightLeft size={12} /> 雙向同步中 (Bidirectional Sync)
                  </div>
                </motion.div>
              ) : (
                <div className="w-full border-t border-dashed border-slate-600/50 mt-1">
                  <div className="text-center mt-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    未連線 (Disconnected)
                  </div>
                </div>
              )}
            </div>

            {/* VPS端 [終] */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl font-black transition-all duration-500 ${isVpsBound ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-800/30 border-slate-700/50 text-slate-500'}`}>
                終
              </div>
              <div className="text-center mt-2">
                <p className={`text-xs font-bold uppercase tracking-wider ${isVpsBound ? 'text-white' : 'text-slate-500'}`}>OmniAgent Gateway</p>
                <p className="text-[10px] text-slate-500 font-mono">161.118.248.180:8642</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button 
              onClick={toggleVpsBindingAction}
              className={`flex items-center gap-2 px-6 py-2 rounded-full border text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                isVpsBound 
                  ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
              }`}
            >
              {isVpsBound ? <Unlink size={14} /> : <LinkIcon size={14} />}
              <span>{isVpsBound ? '解綁 終始矩陣 (Unbind)' : '啟動 終始連線 (Bind VPS)'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
