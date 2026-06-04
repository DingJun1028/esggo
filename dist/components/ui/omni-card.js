import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function OmniCardUI({ card, className = '' }) {
    // Map status to specific styles based on Liquid Glass Cyan guidelines
    const statusStyles = {
        todo: 'text-slate-400 border-slate-700/50',
        doing: 'text-[#06b6d4] border-[#06b6d4]/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]',
        done: 'text-[#10b981] border-[#10b981]/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    };
    const statusLabels = {
        todo: '待辦 (Todo)',
        doing: '執行中 (Doing)',
        done: '完成 (Done)',
    };
    return (_jsxs("div", { className: `
        relative overflow-hidden
        rounded-2xl border border-white/10
        bg-[#020617]/40 backdrop-blur-[12px]
        p-6 transition-all duration-300
        hover:border-white/20 hover:bg-[#020617]/60
        group ${className}
      `, style: { zIndex: 1 }, children: [_jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none", style: { zIndex: 2 }, children: _jsx("div", { className: "absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 group-hover:animate-liquid-sweep" }) }), _jsxs("div", { className: "flex justify-between items-start mb-4 relative z-10", children: [_jsx("h3", { className: "text-xl font-bold text-white tracking-wide", children: card.name }), _jsx("span", { className: `px-3 py-1 text-xs font-semibold rounded-full border ${statusStyles[card.status]} bg-[#020617]/50`, children: statusLabels[card.status] })] }), _jsxs("div", { className: "space-y-4 relative z-10", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-white/50 uppercase tracking-wider mb-2 font-mono", children: "Trace UUID" }), _jsx("p", { className: "text-sm text-white/80 font-mono truncate bg-black/20 p-2 rounded border border-white/5", children: card.uuid })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-white/50 uppercase tracking-wider mb-2 font-mono", children: "Attributes" }), _jsx("div", { className: "flex flex-wrap gap-2", children: card.attributes.map((attr, idx) => (_jsx("span", { className: "px-2 py-1 text-xs text-[#06b6d4] bg-[#06b6d4]/10 rounded border border-[#06b6d4]/20", children: attr }, idx))) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-white/50 uppercase tracking-wider mb-2 font-mono", children: "Abilities" }), _jsx("div", { className: "flex flex-wrap gap-2", children: card.abilities.map((ability, idx) => (_jsx("span", { className: "px-2 py-1 text-xs text-[#10b981] bg-[#10b981]/10 rounded border border-[#10b981]/20", children: ability }, idx))) })] }), _jsxs("div", { className: "pt-4 border-t border-white/10 flex justify-between items-center text-xs text-white/40 font-mono", children: [_jsx("span", { children: "5T Protocol Sync" }), _jsx("span", { children: new Date(card.lastUpdated).toLocaleString() })] })] })] }));
}
//# sourceMappingURL=omni-card.js.map