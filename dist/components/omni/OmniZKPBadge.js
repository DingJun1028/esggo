'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useColorDropStream } from '@/lib/hooks/useColorDropStream';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
export function OmniZKPBadge() {
    const { events, isLive, getVisualState } = useColorDropStream();
    const latestEvent = events.length > 0 ? events[events.length - 1] : null;
    const visualState = getVisualState(latestEvent?.event_type || '');
    return (_jsxs(motion.div, { className: `relative overflow-hidden rounded-full px-4 py-2 flex items-center gap-3 backdrop-blur-md border ${visualState.borderColor}`, style: { backgroundColor: visualState.bgColor, boxShadow: visualState.glowColor }, initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsxs("div", { className: "relative flex h-3 w-3", children: [isLive && (_jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" })), _jsx("span", { className: `relative inline-flex rounded-full h-3 w-3 ${isLive ? 'bg-cyan-500' : 'bg-gray-500'}` })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-xs font-bold text-white tracking-wider uppercase", children: visualState.label }), _jsx(AnimatePresence, { mode: "popLayout", children: latestEvent && (_jsxs(motion.span, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 10 }, className: "text-[10px] text-cyan-200/80 font-mono", children: ["ZKP: ", latestEvent.payload?.zkp_hash?.substring(0, 16), "..."] }, latestEvent.id)) })] }), _jsx("div", { className: "ml-2", children: latestEvent?.event_type === 'qkp:healing:required' ? (_jsx(ShieldAlert, { className: "w-5 h-5 text-amber-400" })) : (_jsx(ShieldCheck, { className: `w-5 h-5 ${isLive ? 'text-cyan-400' : 'text-gray-400'}` })) })] }));
}
//# sourceMappingURL=OmniZKPBadge.js.map