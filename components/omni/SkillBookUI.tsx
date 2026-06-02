'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, Layers, Zap } from 'lucide-react';
import { MemoryShard, SkillUltimate } from '@/lib/agent/memory-shards';

export default function SkillBookUI() {
  const [shards, setShards] = useState<MemoryShard[]>([]);
  const [ultimate, setUltimate] = useState<SkillUltimate | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // 模擬觸發：將最近的一段對話轉化為碎片
  const handleExtractShard = async () => {
    setIsExtracting(true);
    try {
      const mockLog = `
User: "我需要將 OmniTable 加上 ZKP 封印，並且與 Supabase 直接連線"
Agent: "好的，我為您覆寫了 app/api/omni-table/route.ts，使用了 fetch 直接進行 REST 操作，並整合了 generateZkpSeal 單向鏈式加密，同時具備 5T 協議的 Transparent (Zod Schema) 與 Trustworthy (迴圈防禦閘門)。"
      `;
      
      const res = await fetch('/api/agent/memory-shards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'extract_shard', conversationLog: mockLog })
      });
      const data = await res.json();
      if (data.success && data.shard) {
        setShards(prev => [...prev, data.shard]);
      }
    } catch (err) {
      console.error('Extract error:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  // 觸發奧義領悟
  const handleSynthesize = async () => {
    if (shards.length < 2) return;
    setIsSynthesizing(true);
    try {
      const res = await fetch('/api/agent/memory-shards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'synthesize_ultimate', shards })
      });
      const data = await res.json();
      if (data.success && data.ultimate) {
        setUltimate(data.ultimate);
      }
    } catch (err) {
      console.error('Synthesize error:', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-[#020617] rounded-2xl border border-cyan-900/50 shadow-2xl relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyan-600/20 blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                無有技藝 · 記憶碎片之書
              </h2>
              <p className="text-xs text-cyan-500/80 mt-1">
                收集對話殘影，凝練為技術奧義。 (收集 2 片以上即可領悟)
              </p>
            </div>
          </div>
          <button 
            onClick={handleExtractShard}
            disabled={isExtracting}
            className="px-4 py-2 bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-700/50 rounded-lg text-sm text-cyan-300 transition-all flex items-center gap-2"
          >
            {isExtracting ? <Sparkles className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
            擷取記憶碎片
          </button>
        </div>

        {/* OmniTable (5T ZKP Audited Data Grid) */}
        <div className="w-full border border-cyan-800/40 rounded-xl bg-black/40 backdrop-blur-md overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />
          <table className="w-full text-left border-collapse relative z-10">
            <thead>
              <tr className="bg-cyan-950/40 border-b border-cyan-800/40 text-xs text-cyan-500 uppercase tracking-widest font-mono">
                <th className="p-3 font-semibold">5T Status</th>
                <th className="p-3 font-semibold">Shard Origin</th>
                <th className="p-3 font-semibold">Tags & Dimension</th>
                <th className="p-3 font-semibold text-right">ZKP Hash Lock</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {shards.map((shard, idx) => (
                  <motion.tr 
                    key={shard.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="border-b border-cyan-800/20 hover:bg-cyan-900/20 transition-colors group"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold tracking-widest">VERIFIED</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <h3 className="text-sm font-semibold text-cyan-100 group-hover:text-cyan-300 transition-colors">{shard.title}</h3>
                      <p className="text-xs text-slate-500 max-w-[250px] truncate">{shard.description}</p>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {shard.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-900/40 text-cyan-300 border border-cyan-800/50">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="text-[10px] font-mono text-slate-500 group-hover:text-emerald-400 transition-colors bg-black/50 px-2 py-1 rounded inline-block border border-white/5">
                        0x{shard.id.replace(/-/g, '').substring(0, 16)}...
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {shards.length === 0 && (
            <div className="w-full text-center py-12 text-slate-500 border-t border-dashed border-cyan-800/40">
              <div className="flex flex-col items-center gap-3">
                <Layers className="w-8 h-8 text-cyan-800/50" />
                <span className="text-sm">尚未萃取任何記憶碎片，點擊右上角按鈕從對話中擷取 (5T 協議等待中)</span>
              </div>
            </div>
          )}
        </div>

        {/* Synthesis Action */}
        <div className="flex justify-center pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSynthesize}
            disabled={shards.length < 2 || isSynthesizing || !!ultimate}
            className={`px-8 py-3 rounded-full flex items-center gap-2 font-semibold shadow-lg transition-all ${
              shards.length >= 2 && !ultimate
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isSynthesizing ? (
              <Sparkles className="w-5 h-5 animate-spin" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
            領悟完整技能奧義
          </motion.button>
        </div>

        {/* Ultimate Skill Display */}
        <AnimatePresence>
          {ultimate && (
            <motion.div 
              initial={{ opacity: 0, y: 30, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              className="mt-6 p-6 rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 to-slate-900/60 backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="w-32 h-32 text-emerald-400" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-widest">
                    Level: {ultimate.masteryLevel}
                  </span>
                  <h3 className="text-2xl font-bold text-emerald-100">{ultimate.skillName}</h3>
                </div>
                
                <p className="text-sm text-slate-300 italic mb-6 pl-4 border-l-2 border-emerald-500/50">
                  {ultimate.synthesis}
                </p>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">核心心法 (Core Principles)</h4>
                  <ul className="space-y-2">
                    {ultimate.corePrinciples.map((principle, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <Sparkles className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{principle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
