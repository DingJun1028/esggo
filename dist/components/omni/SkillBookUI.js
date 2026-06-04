'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, Layers, Zap } from 'lucide-react';
export default function SkillBookUI() {
    const [shards, setShards] = useState([]);
    const [ultimate, setUltimate] = useState(null);
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
        }
        catch (err) {
            console.error('Extract error:', err);
        }
        finally {
            setIsExtracting(false);
        }
    };
    // 觸發奧義領悟
    const handleSynthesize = async () => {
        if (shards.length < 2)
            return;
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
        }
        catch (err) {
            console.error('Synthesize error:', err);
        }
        finally {
            setIsSynthesizing(false);
        }
    };
    return (_jsxs("div", { className: "w-full max-w-4xl mx-auto p-6 bg-[#020617] rounded-2xl border border-cyan-900/50 shadow-2xl relative overflow-hidden font-sans", children: [_jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyan-600/20 blur-[100px] pointer-events-none" }), _jsxs("div", { className: "relative z-10 flex flex-col gap-6", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-cyan-500/20 pb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(BookOpen, { className: "w-8 h-8 text-cyan-400" }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent", children: "\u7121\u6709\u6280\u85DD \u00B7 \u8A18\u61B6\u788E\u7247\u4E4B\u66F8" }), _jsx("p", { className: "text-xs text-cyan-500/80 mt-1", children: "\u6536\u96C6\u5C0D\u8A71\u6B98\u5F71\uFF0C\u51DD\u7DF4\u70BA\u6280\u8853\u5967\u7FA9\u3002 (\u6536\u96C6 2 \u7247\u4EE5\u4E0A\u5373\u53EF\u9818\u609F)" })] })] }), _jsxs("button", { onClick: handleExtractShard, disabled: isExtracting, className: "px-4 py-2 bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-700/50 rounded-lg text-sm text-cyan-300 transition-all flex items-center gap-2", children: [isExtracting ? _jsx(Sparkles, { className: "w-4 h-4 animate-spin" }) : _jsx(Layers, { className: "w-4 h-4" }), "\u64F7\u53D6\u8A18\u61B6\u788E\u7247"] })] }), _jsxs("div", { className: "w-full border border-cyan-800/40 rounded-xl bg-black/40 backdrop-blur-md overflow-hidden relative", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" }), _jsxs("table", { className: "w-full text-left border-collapse relative z-10", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-cyan-950/40 border-b border-cyan-800/40 text-xs text-cyan-500 uppercase tracking-widest font-mono", children: [_jsx("th", { className: "p-3 font-semibold", children: "5T Status" }), _jsx("th", { className: "p-3 font-semibold", children: "Shard Origin" }), _jsx("th", { className: "p-3 font-semibold", children: "Tags & Dimension" }), _jsx("th", { className: "p-3 font-semibold text-right", children: "ZKP Hash Lock" })] }) }), _jsx("tbody", { children: _jsx(AnimatePresence, { children: shards.map((shard, idx) => (_jsxs(motion.tr, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: idx * 0.1 }, className: "border-b border-cyan-800/20 hover:bg-cyan-900/20 transition-colors group", children: [_jsx("td", { className: "p-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "relative flex h-3 w-3", children: [_jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }), _jsx("span", { className: "relative inline-flex rounded-full h-3 w-3 bg-emerald-500" })] }), _jsx("span", { className: "text-[10px] text-emerald-400 font-bold tracking-widest", children: "VERIFIED" })] }) }), _jsxs("td", { className: "p-3", children: [_jsx("h3", { className: "text-sm font-semibold text-cyan-100 group-hover:text-cyan-300 transition-colors", children: shard.title }), _jsx("p", { className: "text-xs text-slate-500 max-w-[250px] truncate", children: shard.description })] }), _jsx("td", { className: "p-3", children: _jsx("div", { className: "flex flex-wrap gap-1", children: shard.tags.map(tag => (_jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-cyan-900/40 text-cyan-300 border border-cyan-800/50", children: tag }, tag))) }) }), _jsx("td", { className: "p-3 text-right", children: _jsxs("div", { className: "text-[10px] font-mono text-slate-500 group-hover:text-emerald-400 transition-colors bg-black/50 px-2 py-1 rounded inline-block border border-white/5", children: ["0x", shard.id.replace(/-/g, '').substring(0, 16), "..."] }) })] }, shard.id))) }) })] }), shards.length === 0 && (_jsx("div", { className: "w-full text-center py-12 text-slate-500 border-t border-dashed border-cyan-800/40", children: _jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsx(Layers, { className: "w-8 h-8 text-cyan-800/50" }), _jsx("span", { className: "text-sm", children: "\u5C1A\u672A\u8403\u53D6\u4EFB\u4F55\u8A18\u61B6\u788E\u7247\uFF0C\u9EDE\u64CA\u53F3\u4E0A\u89D2\u6309\u9215\u5F9E\u5C0D\u8A71\u4E2D\u64F7\u53D6 (5T \u5354\u8B70\u7B49\u5F85\u4E2D)" })] }) }))] }), _jsx("div", { className: "flex justify-center pt-4", children: _jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: handleSynthesize, disabled: shards.length < 2 || isSynthesizing || !!ultimate, className: `px-8 py-3 rounded-full flex items-center gap-2 font-semibold shadow-lg transition-all ${shards.length >= 2 && !ultimate
                                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`, children: [isSynthesizing ? (_jsx(Sparkles, { className: "w-5 h-5 animate-spin" })) : (_jsx(Zap, { className: "w-5 h-5" })), "\u9818\u609F\u5B8C\u6574\u6280\u80FD\u5967\u7FA9"] }) }), _jsx(AnimatePresence, { children: ultimate && (_jsxs(motion.div, { initial: { opacity: 0, y: 30, height: 0 }, animate: { opacity: 1, y: 0, height: 'auto' }, className: "mt-6 p-6 rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 to-slate-900/60 backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] overflow-hidden relative", children: [_jsx("div", { className: "absolute top-0 right-0 p-4 opacity-10", children: _jsx(Zap, { className: "w-32 h-32 text-emerald-400" }) }), _jsxs("div", { className: "relative z-10", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsxs("span", { className: "px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-widest", children: ["Level: ", ultimate.masteryLevel] }), _jsx("h3", { className: "text-2xl font-bold text-emerald-100", children: ultimate.skillName })] }), _jsx("p", { className: "text-sm text-slate-300 italic mb-6 pl-4 border-l-2 border-emerald-500/50", children: ultimate.synthesis }), _jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "text-xs font-bold text-emerald-400 uppercase tracking-widest", children: "\u6838\u5FC3\u5FC3\u6CD5 (Core Principles)" }), _jsx("ul", { className: "space-y-2", children: ultimate.corePrinciples.map((principle, idx) => (_jsxs("li", { className: "flex items-start gap-2 text-sm text-slate-300", children: [_jsx(Sparkles, { className: "w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" }), _jsx("span", { children: principle })] }, idx))) })] })] })] })) })] })] }));
}
//# sourceMappingURL=SkillBookUI.js.map