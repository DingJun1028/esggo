'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Brain, Library, ExternalLink, Zap, Network, ChevronRight } from 'lucide-react';

export default function ThinkTankPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    
    // 清空舊結果，營造重新搜尋的動態
    setResults([]);

    try {
      const res = await fetch('/api/omni-agent/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, topK: 5 })
      });
      const json = await res.json();

      if (json.success && json.data?.results) {
        setResults(json.data.results);
      } else {
        setError(json.error || '無法檢索智庫資料。');
      }
    } catch (err: any) {
      setError(err.message || '連線智庫發生異常。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      {/* 標題與簡介 */}
      <div className="mb-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-6"
        >
          <Brain size={16} />
          <span className="text-xs font-bold tracking-widest uppercase">OmniMemory Sanctuary</span>
        </motion.div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-cyan-300 mb-4 tracking-tight">
          萬能智庫檢索中心
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
          透過 OmniMatrix 與 RAG 技術，直接對 ESGGO 永續知識庫進行高維度語意搜索。無論是 GRI 準則、過往的架構決策 (ADR) 或是碳盤查規範，皆能瞬間召回。
        </p>
      </div>

      {/* 搜尋列 */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative max-w-3xl mx-auto mb-12"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-70"></div>
        <form 
          onSubmit={handleSearch}
          className="relative bg-[#020617]/70 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center p-2 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        >
          <div className="pl-4 pr-2 text-cyan-400/50">
            <Search size={24} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="請問 GRI 305-1 該如何計算？或查詢過往 5T 協議規範..."
            className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-slate-500 font-medium tracking-wide py-3"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 disabled:opacity-50 text-cyan-300 border border-cyan-500/30 rounded-xl font-bold tracking-wider transition-all flex items-center gap-2"
          >
            {loading ? (
              <>
                <Zap size={18} className="animate-pulse" />
                <span>檢索中...</span>
              </>
            ) : (
              <>
                <span>啟動檢索</span>
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* 檢索狀態指示器 */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 gap-6"
          >
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 border-t-2 border-cyan-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-r-2 border-indigo-500 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
              <Network size={32} className="text-cyan-400 animate-pulse" />
            </div>
            <div className="text-cyan-400 font-medium tracking-widest text-sm animate-pulse">
              OMNINEXUS 正在遍歷知識節點...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 錯誤訊息 */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center font-medium"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 搜尋結果 */}
      <AnimatePresence>
        {!loading && searched && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
              <Library size={20} className="text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-200">
                檢索結果 <span className="text-cyan-400 text-sm ml-2">({results.length} 筆關聯節點)</span>
              </h2>
            </div>
            
            <div className="grid gap-4">
              {results.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-[#020617]/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:bg-white/5 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl"></div>
                  
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-wider rounded border border-cyan-500/20">
                          {item.metadata?.domain || 'Knowledge Node'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          信心指數: {((item.score || 0.9) * 100).toFixed(1)}%
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-200 mb-3 group-hover:text-cyan-300 transition-colors">
                        {item.metadata?.title || '未命名知識節點'}
                      </h3>
                      
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {item.content?.length > 200 ? item.content.substring(0, 200) + '...' : item.content}
                      </p>
                    </div>
                    
                    <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors shrink-0">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {!loading && searched && results.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-slate-500"
          >
            <Library size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">智庫中未找到與此查詢高度相關的記憶資產。</p>
            <p className="text-sm mt-2">嘗試使用不同的關鍵字，或交由 OmniAgent 進行推理。</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
