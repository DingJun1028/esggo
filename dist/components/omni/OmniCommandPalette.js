'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Bot, Database, ShieldCheck, Zap, Library } from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function OmniCommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const router = useRouter();
    // 監聽快捷鍵：Cmd+K 或 Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e) => {
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
        { id: '1', title: '進入 5T 編輯器 (Vault)', icon: _jsx(Database, { size: 16 }), action: () => router.push('/editor') },
        {
            id: '2',
            title: '觸發全域資料同步 (DLQ Replay / Blue.cc)',
            icon: _jsx(Zap, { size: 16 }),
            action: async () => {
                try {
                    const res = await fetch('/api/omni-sync', { method: 'POST' });
                    const json = await res.json();
                    if (json.success) {
                        alert(`✅ 全域同步完畢！\n${json.message}`);
                    }
                    else {
                        alert(`⚠️ 同步失敗: ${json.error}`);
                    }
                }
                catch (e) {
                    alert('⚠️ 連線異常: ' + e.message);
                }
            }
        },
        {
            id: '3',
            title: '檢查系統 5T 防禦狀態',
            icon: _jsx(ShieldCheck, { size: 16 }),
            action: async () => {
                try {
                    const res = await fetch('/api/vault/audit');
                    const json = await res.json();
                    if (json.success) {
                        alert(`🛡️ 5T 防禦狀態：${json.defenseState}\n\n總封裝密碼學紀錄：${json.metrics.totalSealedRecords} 筆\n已驗證 ZKP 紀錄：${json.metrics.verifiedZkpRecords} 筆\n\n狀態：${json.message}`);
                    }
                    else {
                        alert(`⚠️ 系統防禦檢測異常: ${json.error}`);
                    }
                }
                catch (e) {
                    alert('⚠️ 連線異常: ' + e.message);
                }
            }
        },
        {
            id: '4',
            title: '搜尋企業智庫 (Enterprise RAG)',
            icon: _jsx(Library, { size: 16 }),
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
                    }
                    else {
                        alert('⚠️ 智庫檢索失敗: ' + (json.error || 'Unknown Error'));
                    }
                }
                catch (e) {
                    alert('⚠️ 連線異常: ' + e.message);
                }
            }
        },
        {
            id: '5',
            title: '喚醒 OmniAgent Oracle',
            icon: _jsx(Bot, { size: 16 }),
            action: () => {
                window.dispatchEvent(new CustomEvent('omni-agent-toggle', { detail: { open: true } }));
            }
        },
    ];
    const filteredCommands = commands.filter(cmd => cmd.title.toLowerCase().includes(search.toLowerCase()));
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-md", onClick: () => setIsOpen(false) }), _jsx(motion.div, { initial: { opacity: 0, scale: 0.95, y: -20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: -20 }, transition: { type: 'spring', damping: 25, stiffness: 300 }, className: "fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[10000]", children: _jsxs("div", { className: "relative mx-4 sm:mx-0", children: [_jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-cyan-500/20 rounded-[2rem] blur-xl opacity-70" }), _jsxs("div", { className: "relative bg-[#020617]/70 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 ring-1 ring-white/5 rounded-3xl overflow-hidden flex flex-col", children: [_jsx("div", { className: "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 opacity-80" }), _jsxs("div", { className: "flex items-center px-6 py-5 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent", children: [_jsx(Search, { size: 22, className: "text-cyan-400/50 mr-4" }), _jsx("input", { type: "text", autoFocus: true, placeholder: "\u8F38\u5165\u6307\u4EE4\u6216\u641C\u5C0B (e.g. \u5C01\u5370\u3001\u540C\u6B65\u3001\u8DF3\u8F49)...", className: "flex-1 bg-transparent border-none outline-none text-white text-xl placeholder:text-slate-500 font-medium tracking-wide", value: search, onChange: (e) => setSearch(e.target.value) }), _jsxs("div", { className: "flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md border border-white/10", children: [_jsx(Command, { size: 14, className: "text-slate-400" }), _jsx("span", { className: "text-xs font-semibold text-slate-400", children: "K" })] })] }), _jsxs("div", { className: "max-h-[55vh] overflow-y-auto p-3 no-scrollbar relative", children: [_jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-cyan-500/10 blur-2xl rounded-full pointer-events-none" }), filteredCommands.length > 0 ? (_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "px-4 py-2 text-[11px] font-black text-slate-500 uppercase tracking-widest", children: "Omni Actions / \u5FEB\u901F\u52D5\u4F5C" }), filteredCommands.map((cmd) => (_jsxs("button", { onClick: () => {
                                                            cmd.action();
                                                            setIsOpen(false);
                                                            setSearch('');
                                                        }, className: "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-cyan-500/10 hover:shadow-sm text-left transition-all duration-200 group relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }), _jsx("div", { className: "relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-all duration-300 shadow-sm z-10", children: cmd.icon }), _jsx("span", { className: "text-sm font-semibold text-slate-300 group-hover:text-cyan-300 transition-colors", children: cmd.title })] }, cmd.id)))] })) : (_jsxs("div", { className: "px-4 py-16 flex flex-col items-center justify-center text-slate-500 gap-4", children: [_jsx(Bot, { size: 48, className: "text-slate-600" }), _jsxs("p", { className: "text-sm font-medium text-slate-400", children: ["\u627E\u4E0D\u5230\u672C\u5730\u6307\u4EE4\uFF0C\u662F\u5426\u8981\u5C07\u300C", search, "\u300D\u50B3\u9001\u7D66 AI \u6838\u5FC3\u5206\u6790\uFF1F"] }), _jsx("button", { className: "mt-2 px-6 py-2.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-sm font-bold shadow-md hover:bg-cyan-500/30 hover:shadow-lg transition-all", children: "\u547C\u53EB OmniAgent \u904B\u7B97" })] }))] }), _jsxs("div", { className: "px-6 py-3.5 bg-black/20 backdrop-blur-md border-t border-white/5 flex items-center justify-between", children: [_jsxs("span", { className: "text-[11px] text-slate-500 font-medium", children: ["Press ", _jsx("kbd", { className: "font-sans px-1.5 py-0.5 bg-white/5 border border-white/10 rounded shadow-sm text-slate-400", children: "ESC" }), " to close"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" }), _jsx("span", { className: "text-[10px] font-black text-cyan-500/80 tracking-widest uppercase", children: "ESGGO Omnicore V8.5" })] })] })] })] }) })] })) }));
}
//# sourceMappingURL=OmniCommandPalette.js.map