'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import OmniAuthUniversal from '@/components/omni/OmniAuthUniversal';
import { motion } from 'framer-motion';
export default function AuthPage() {
    return (_jsxs("div", { className: "min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 cyber-grid opacity-20 pointer-events-none" }), _jsx("div", { className: "absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" }), _jsx("div", { className: "absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "w-full max-w-md relative z-10", children: _jsx(OmniAuthUniversal, {}) })] }));
}
//# sourceMappingURL=page.js.map