'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, FileText, ExternalLink, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSustainWriteStore } from '../store/useSustainWriteStore';
import { cn } from '../lib/utils';

export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const companyId = useSustainWriteStore(state => state.companyId);
    const searchRef = useRef<HTMLDivElement>(null);

    // 監聽快捷鍵 (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // 執行搜尋
    const handleSearch = async (val: string) => {
        setQuery(val);
        if (val.length < 2) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/ai/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: val, companyId })
            });
            const data = await res.json();
            if (data.success) {
                setResults(data.results);
            }
        } catch (error) {
            console.error('[Search] Failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* 觸發按鈕 (放在 Header 等位置) */}
            <button
                onClick={() => setIsOpen(true)}
                className="group flex items-center gap-3 px-4 py-2 bg-slate-100/50 hover:bg-white border border-slate-200 rounded-xl transition-all shadow-sm active:scale-95"
            >
                <Search size={16} className="text-slate-400 group-hover:text-cyan-600 transition-colors" />
                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                    搜尋企業智庫...
                </span>
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-black text-slate-400">
                    <Command size={10} /> K
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
                        {/* 背景遮罩 */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />

                        {/* 搜尋視窗 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="relative w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col"
                            ref={searchRef}
                        >
                            {/* Input 區塊 */}
                            <div className="flex items-center px-6 py-5 border-b border-slate-100">
                                <Search className="text-cyan-600 mr-4" size={24} />
                                <input
                                    autoFocus
                                    placeholder="輸入關鍵字檢索 ESG 知識..."
                                    className="flex-1 bg-transparent text-lg font-bold text-slate-800 outline-none"
                                    value={query}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                {isLoading ? (
                                    <Loader2 className="animate-spin text-slate-400" size={20} />
                                ) : (
                                    <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-slate-600 transition-colors">
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            {/* 結果區塊 */}
                            <div className="flex-1 max-h-[450px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                {results.length > 0 ? (
                                    <div className="space-y-2">
                                        <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">最相關的智庫片段</p>
                                        {results.map((res, i) => (
                                            <div 
                                                key={i} 
                                                className="group p-5 rounded-2xl border border-slate-50 hover:border-cyan-100 hover:bg-white hover:shadow-md transition-all cursor-default"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2 px-2 py-0.5 bg-cyan-50 text-cyan-600 rounded-md border border-cyan-100">
                                                        <FileText size={12} />
                                                        <span className="text-[10px] font-black">{res.title}</span>
                                                    </div>
                                                    <button className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-cyan-600 transition-all">
                                                        <ExternalLink size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-medium text-slate-600 leading-relaxed line-clamp-3">
                                                    {res.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : query.length >= 2 ? (
                                    <div className="py-20 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                            <Search className="text-slate-200" size={32} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-400">未找到相關知識片段</p>
                                        <p className="text-xs text-slate-300 mt-1">嘗試更換關鍵字或上傳更多 PDF 智庫</p>
                                    </div>
                                ) : (
                                    <div className="py-20 text-center opacity-50">
                                        <Command className="mx-auto mb-4 text-slate-200" size={48} />
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                            Start typing to search corporate intelligence
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                                    <div className="flex items-center gap-1"><Command size={10} /> + K 打開搜尋</div>
                                    <div className="flex items-center gap-1"><span className="px-1 py-0.5 bg-white border rounded">Esc</span> 關閉</div>
                                </div>
                                <div className="text-[10px] font-black text-cyan-600 uppercase tracking-tighter italic">
                                    Powered by OmniCore RAG
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
