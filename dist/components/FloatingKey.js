import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// components/FloatingKey.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid'; // 假設使用 uuid 庫
const FloatingKey = () => {
    const [core] = useState({
        uuid: uuidv4(),
        version: "1.0.0",
        timestamp: Date.now(),
        evidence: []
    });
    const [isOpen, setIsOpen] = useState(false);
    // Hash Lock 與 Object.freeze 模擬
    const getHashSignature = () => {
        const data = JSON.stringify(core);
        return btoa(data).substring(0, 16); // 簡化版 Hash
    };
    return (_jsxs(_Fragment, { children: [_jsx(motion.button, { whileHover: { scale: 1.1, rotate: 5 }, whileTap: { scale: 0.9 }, className: "fixed bottom-8 right-8 w-16 h-16 rounded-full bg-blue-500/30 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center text-white z-50", onClick: () => setIsOpen(!isOpen), children: "\u269B\uFE0F" }), _jsx(AnimatePresence, { children: isOpen && (_jsxs(motion.div, { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 50 }, className: "fixed bottom-28 right-8 w-80 p-6 rounded-2xl bg-slate-900/80 backdrop-blur-2xl border border-blue-500/30 shadow-2xl z-50 text-xs text-blue-100 font-mono", children: [_jsx("h3", { className: "text-sm font-bold mb-2", children: "OmniAgent \u5FC3\u6838\u72C0\u614B" }), _jsxs("div", { className: "space-y-1", children: [_jsxs("p", { children: ["UUID: ", core.uuid.slice(0, 8), "..."] }), _jsxs("p", { children: ["Hash: ", getHashSignature()] }), _jsxs("p", { children: ["Status: ", _jsx("span", { className: "text-green-400", children: "Object.frozen" })] })] })] })) })] }));
};
export default FloatingKey;
//# sourceMappingURL=FloatingKey.js.map