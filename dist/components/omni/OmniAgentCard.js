import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Database, Zap } from 'lucide-react';
export default function OmniAgentCard({ id, name, role, rarity = 'verified', imageUrl = '/assets/agents/placeholder.webp', // Default fallback
fiveTStatus = [true, true, true, false, false], confidenceScore = 95, skills = ['Data Parsing', 'ZKP Validation'], jsonSchema = '{\n  "version": "1.0",\n  "status": "active"\n}' }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    // Colors based on rarity
    const rarityColors = {
        verified: 'from-emerald-500/20 to-cyan-500/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
        awakened: 'from-purple-600/30 to-amber-500/30 border-purple-500/60 shadow-[0_0_20px_rgba(139,92,246,0.6)]',
        experimental: 'from-amber-500/20 to-orange-500/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
    };
    const rarityText = {
        verified: 'text-emerald-400',
        awakened: 'text-purple-400',
        experimental: 'text-amber-400'
    };
    const handleMouseMove = (e) => {
        if (isFlipped)
            return;
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        // Calculate rotation (-10 to 10 degrees)
        const rotX = -((y - centerY) / centerY) * 10;
        const rotY = ((x - centerX) / centerX) * 10;
        setRotateX(rotX);
        setRotateY(rotY);
    };
    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };
    const flipCard = () => {
        setIsFlipped(!isFlipped);
        setRotateX(0);
        setRotateY(0);
    };
    return (_jsx("div", { className: "relative w-80 h-[28rem] perspective-1000 group", children: _jsxs(motion.div, { className: "w-full h-full relative preserve-3d cursor-pointer", animate: {
                rotateY: isFlipped ? 180 : rotateY,
                rotateX: isFlipped ? 0 : rotateX
            }, transition: { type: 'spring', stiffness: 300, damping: 20 }, onClick: flipCard, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave, children: [_jsxs("div", { className: `absolute inset-0 backface-hidden rounded-[2rem] border-white/10 backdrop-blur-3xl bg-slate-950/40 overflow-hidden flex flex-col justify-end bg-gradient-to-b ${rarityColors[rarity]} transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]`, children: [_jsx("div", { className: "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent z-30" }), _jsx("div", { className: "absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 rounded-tl-[2rem]" }), _jsx("div", { className: "absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-[2rem]" }), _jsx("div", { className: "absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 rounded-bl-[2rem]" }), _jsx("div", { className: "absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 rounded-br-[2rem]" }), _jsxs("div", { className: "absolute inset-0 z-10 flex justify-center items-end pb-24 pointer-events-none", children: [_jsx("div", { className: `absolute bottom-12 w-48 h-48 rounded-full blur-3xl opacity-50 bg-cyan-500` }), _jsx(motion.img, { src: imageUrl, alt: name, className: "relative z-10 w-full h-[120%] object-cover object-bottom transition-transform duration-500 group-hover:-translate-y-4" })] }), _jsxs("div", { className: "relative z-20 bg-slate-900/80 backdrop-blur-md border-t border-white/10 p-4 h-1/3 flex flex-col justify-between", children: [_jsx("div", { children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-white tracking-wider", children: name }), _jsx("p", { className: `text-xs font-medium uppercase tracking-widest ${rarityText[rarity]}`, children: role })] }), _jsxs("div", { className: "flex flex-col items-end", children: [_jsxs("span", { className: `text-xs font-mono font-bold ${confidenceScore >= 85 ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]' : 'text-amber-400'}`, children: [confidenceScore, "%"] }), _jsx("span", { className: "text-[10px] text-slate-400", children: "Confidence" })] })] }) }), _jsxs("div", { className: "flex items-center justify-between mt-2 pt-2 border-t border-white/10", children: [_jsx("span", { className: "text-xs text-slate-400 font-mono", children: "5T SYNC" }), _jsx("div", { className: "flex space-x-1.5", children: fiveTStatus.map((status, index) => {
                                                const labels = ['真', '善', '美', '信', '通'];
                                                return (_jsxs("div", { className: "flex flex-col items-center group/tooltip relative", children: [_jsx("div", { className: `w-2.5 h-2.5 rounded-full ${status ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-slate-700'}` }), _jsx("span", { className: "absolute -top-6 text-[10px] opacity-0 group-hover/tooltip:opacity-100 transition-opacity bg-slate-800 px-1 rounded text-white", children: labels[index] })] }, index));
                                            }) })] })] })] }), _jsxs("div", { className: `absolute inset-0 backface-hidden rounded-[2rem] border-white/10 backdrop-blur-3xl bg-slate-950/40 overflow-hidden flex flex-col p-6 bg-gradient-to-b ${rarityColors[rarity]} shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]`, style: { transform: 'rotateY(180deg)' }, children: [_jsx("div", { className: "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent z-30" }), _jsxs("div", { className: "flex items-center space-x-2 mb-4", children: [_jsx(Database, { className: "w-5 h-5 text-cyan-400" }), _jsx("h3", { className: "text-sm font-bold text-white uppercase tracking-widest", children: "Memory & Schema" })] }), _jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar mb-4", children: [_jsxs("div", { className: "mb-4", children: [_jsxs("h4", { className: "text-xs text-slate-400 mb-2 font-mono flex items-center", children: [_jsx(Zap, { className: "w-3 h-3 mr-1" }), " CORE SKILLS"] }), _jsx("div", { className: "flex flex-wrap gap-2", children: skills.map((skill, idx) => (_jsx("span", { className: "text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300", children: skill }, idx))) })] }), _jsxs("div", { children: [_jsxs("h4", { className: "text-xs text-slate-400 mb-2 font-mono flex items-center", children: [_jsx(Fingerprint, { className: "w-3 h-3 mr-1" }), " JSON SPEC"] }), _jsx("pre", { className: "text-[10px] text-emerald-400 font-mono bg-slate-900/50 p-2 rounded border border-white/5 whitespace-pre-wrap", children: jsonSchema })] })] }), _jsx("div", { className: "pt-3 border-t border-white/10 text-center", children: _jsx("span", { className: "text-[10px] text-slate-500 font-mono animate-pulse", children: "CLICK TO RETURN" }) })] })] }) }));
}
//# sourceMappingURL=OmniAgentCard.js.map