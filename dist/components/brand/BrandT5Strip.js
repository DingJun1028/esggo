'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SACRED_GATES } from '@/src/shared/types';
import { motion } from 'framer-motion';
export default function BrandT5Strip({ items = [
    { code: 'T1', active: true },
    { code: 'T2', active: true },
    { code: 'T3', active: true },
    { code: 'T4', active: true },
    { code: 'T5', active: true },
], compact = false, className = '', animate = true, }) {
    return (_jsx("div", { className: `flex items-center gap-${compact ? '1.5' : '2'} flex-wrap ${className}`, children: items.map((item, idx) => {
            const config = SACRED_GATES[item.code];
            const active = item.active !== false;
            return (_jsxs(motion.div, { initial: animate ? { opacity: 0, scale: 0.8 } : false, animate: animate ? { opacity: 1, scale: 1 } : false, transition: { delay: idx * 0.1 }, className: `
              inline-flex items-center gap-1.5 rounded-2xl font-black transition-all border-2
              ${compact ? 'text-[9px] px-2.5 py-0.5' : 'text-[10px] px-3.5 py-1.5'}
            `, style: {
                    backgroundColor: active ? `${config.color}15` : '#f8fafc',
                    color: active ? config.color : '#cbd5e1',
                    borderColor: active ? `${config.color}30` : '#f1f5f9',
                    boxShadow: active ? `0 0 12px ${config.color}10` : 'none',
                }, children: [_jsx("span", { className: "opacity-40", children: item.code }), _jsx("div", { className: `w-1 h-1 rounded-full ${active ? '' : 'bg-slate-300'}`, style: { backgroundColor: active ? config.color : undefined } }), _jsx("span", { children: config.labelZh }), !compact && _jsx("span", { className: "text-[8px] opacity-40 font-bold ml-0.5", children: config.titleZh.split('(')[1]?.replace(')', '') })] }, item.code));
        }) }));
}
//# sourceMappingURL=BrandT5Strip.js.map