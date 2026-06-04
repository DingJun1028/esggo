import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
const T_LABELS = ['Truth', 'Goodness', 'Beauty', 'Trust', 'Transferful'];
export default function Protocol5TStrip({ status, className = '', showLabels = false }) {
    const completedCount = status.filter(Boolean).length;
    const progress = (completedCount / 5) * 100;
    return (_jsxs("div", { className: `flex flex-col gap-2 ${className}`, children: [_jsxs("div", { className: "flex justify-between items-center text-xs font-medium text-slate-400", children: [_jsx("span", { className: "flex items-center gap-2", children: _jsx("span", { className: "text-cyan-400", children: "5T Protocol" }) }), _jsxs("span", { children: [completedCount, " / 5"] })] }), _jsx("div", { className: "relative h-2 w-full bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-700/50", children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: `${progress}%` }, transition: { duration: 1, ease: "easeOut" }, className: "absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" }) }), showLabels && (_jsx("div", { className: "flex justify-between mt-1", children: status.map((isVerified, index) => (_jsxs("div", { className: "flex flex-col items-center gap-1 group", children: [_jsx("div", { className: `w-2 h-2 rounded-full transition-all duration-300 ${isVerified
                                ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                                : 'bg-slate-700'}` }), _jsx("span", { className: `text-[10px] uppercase tracking-wider transition-colors duration-300 ${isVerified ? 'text-cyan-300' : 'text-slate-600 group-hover:text-slate-400'}`, children: T_LABELS[index] })] }, index))) }))] }));
}
//# sourceMappingURL=Protocol5TStrip.js.map