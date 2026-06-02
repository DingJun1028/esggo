'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Bot, Database, ShieldCheck, Zap, Library } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OmniCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  // 監聽快捷鍵：Cmd+K 或 Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 預設的系統核心指令清單
  const commands = [
    { id: '1', title: '進入 5T 編輯器 (Vault)', icon: <Database size={16} />, action: () => router.push('/editor') },
    { 
      id: '2', 
      title: '觸發全域資料同步 (DLQ Replay / Blue.cc)', 
      icon: <Zap size={16} />, 
      action: async () => {
        try {
          const res = await fetch('/api/omni-sync', { method: 'POST' });
          const json = await res.json();
          if (json.success) {
            alert(`✅ 全域同步完畢！\n${json.message}`);
          } else {
            alert(`⚠️ 同步失敗: ${json.error}`);
          }
        } catch(e: any) {
          alert('⚠️ 連線異常: ' + e.message);
        }
      }
    },
    { 
      id: '3', 
      title: '檢查系統 5T 防禦狀態', 
      icon: <ShieldCheck size={16} />, 
      action: async () => {
        try {
          const res = await fetch('/api/vault/audit');
          const json = await res.json();
          if (json.success) {
            alert(`🛡️ 5T 防禦狀態：${json.defenseState}\n\n總封裝密碼學紀錄：${json.metrics.totalSealedRecords} 筆\n已驗證 ZKP 紀錄：${json.metrics.verifiedZkpRecords} 筆\n\n狀態：${json.message}`);
          } else {
            alert(`⚠️ 系統防禦檢測異常: ${json.error}`);
          }
        } catch(e: any) {
          alert('⚠️ 連線異常: ' + e.message);
        }
      }
    },
    { 
      id: '4', 
      title: '搜尋企業智庫 (Enterprise RAG)', 
      icon: <Library size={16} />, 
      action: async () => {
        if (!search.trim()) {
          alert('請先在搜尋框輸入要查詢的 ESG 知識或關鍵字！');
          return;
        }
        try {
          // 發送至剛剛建好的 RAG API
          const res = await fetch('/api/omni-agent/rag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: search, topK: 5 })
          });
          const json = await res.json();
          
          if (json.success) {
            console.log('[Enterprise RAG] Results:', json.data.results);
            alert(`✅ 智庫檢索完成！\n已針對 "${search}" 找到 ${json.data.results.length} 筆高度相關的向量/文本資料。\n(完整資料請見 Browser Console)`);
          } else {
            alert('⚠️ 智庫檢索失敗: ' + (json.error || 'Unknown Error'));
          }
        } catch (e: any) {
          alert('⚠️ 連線異常: ' + e.message);
        }
      } 
    },
    { 
      id: '5', 
      title: '喚醒 OmniAgent Oracle', 
      icon: <Bot size={16} />, 
      action: () => {
        window.dispatchEvent(new CustomEvent('omni-agent-toggle', { detail: { open: true } }));
      } 
    },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景模糊遮罩 (Liquid Glass) - 加深以凸顯主體 */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 面板主體 - 強化 Liquid Glass 2.0 漸層與邊框反光 (深色版) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[10000]"
          >
            <div className="relative mx-4 sm:mx-0">
              {/* 背景環境光 */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-cyan-500/20 rounded-[2rem] blur-xl opacity-70"></div>
              
              <div className="relative bg-[#020617]/70 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 ring-1 ring-white/5 rounded-3xl overflow-hidden flex flex-col">
                
                {/* 頂部漸層裝飾 */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 opacity-80" />
                
                {/* 搜尋輸入區塊 */}
                <div className="flex items-center px-6 py-5 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                <Search size={22} className="text-cyan-400/50 mr-4" />
                <input
                  type="text"
                  autoFocus
                  placeholder="輸入指令或搜尋 (e.g. 封印、同步、跳轉)..."
                  className="flex-1 bg-transparent border-none outline-none text-white text-xl placeholder:text-slate-500 font-medium tracking-wide"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                  <Command size={14} className="text-slate-400" />
                  <span className="text-xs font-semibold text-slate-400">K</span>
                </div>
              </div>

              {/* 搜尋結果區塊 */}
              <div className="max-h-[55vh] overflow-y-auto p-3 no-scrollbar relative">
                {/* 內部高亮倒影 */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-cyan-500/10 blur-2xl rounded-full pointer-events-none" />
                
                {filteredCommands.length > 0 ? (
                  <div className="space-y-1">
                    <div className="px-4 py-2 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                      Omni Actions / 快速動作
                    </div>
                    {filteredCommands.map((cmd) => (
                      <button
                        key={cmd.id}
                        onClick={() => {
                          cmd.action();
                          setIsOpen(false);
                          setSearch('');
                        }}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-cyan-500/10 hover:shadow-sm text-left transition-all duration-200 group relative overflow-hidden"
                      >
                        {/* Hover 光源 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-all duration-300 shadow-sm z-10">
                          {cmd.icon}
                        </div>
                        <span className="text-sm font-semibold text-slate-300 group-hover:text-cyan-300 transition-colors">
                          {cmd.title}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-16 flex flex-col items-center justify-center text-slate-500 gap-4">
                    <Bot size={48} className="text-slate-600" />
                    <p className="text-sm font-medium text-slate-400">找不到本地指令，是否要將「{search}」傳送給 AI 核心分析？</p>
                    <button className="mt-2 px-6 py-2.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-sm font-bold shadow-md hover:bg-cyan-500/30 hover:shadow-lg transition-all">
                      呼叫 OmniAgent 運算
                    </button>
                  </div>
                )}
              </div>
              
              {/* 底部 Footer */}
              <div className="px-6 py-3.5 bg-black/20 backdrop-blur-md border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Press <kbd className="font-sans px-1.5 py-0.5 bg-white/5 border border-white/10 rounded shadow-sm text-slate-400">ESC</kbd> to close</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  <span className="text-[10px] font-black text-cyan-500/80 tracking-widest uppercase">ESGGO Omnicore V8.5</span>
                </div>
              </div>
            </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
