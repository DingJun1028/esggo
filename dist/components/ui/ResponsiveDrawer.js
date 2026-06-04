'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
const sizeClasses = {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
};
export default function ResponsiveDrawer({ isOpen, onClose, children, title, side = 'left', size = 'md', overlayClassName, }) {
    const drawerRef = useRef(null);
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = '';
        }
    }, [isOpen]);
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: cn('fixed inset-0 bg-black/20 backdrop-blur-sm z-50', overlayClassName), onClick: onClose }), _jsxs(motion.aside, { ref: drawerRef, initial: { x: side === 'left' ? '-100%' : '100%' }, animate: { x: 0 }, exit: { x: side === 'left' ? '-100%' : '100%' }, transition: { type: 'spring', damping: 25, stiffness: 200 }, className: cn('fixed top-0 bottom-0 z-50 h-full bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl', side === 'left' ? 'left-0' : 'right-0', sizeClasses[size]), "aria-label": title || 'Navigation drawer', role: "dialog", children: [title && (_jsxs("header", { className: "flex items-center justify-between p-4 border-b border-white/10", children: [_jsx("h2", { className: "text-lg font-bold text-slate-800", children: title }), _jsx("button", { onClick: onClose, className: "p-2 rounded-lg hover:bg-white/20 transition-colors", "aria-label": "Close drawer", children: _jsx(X, { size: 20 }) })] })), _jsx("div", { className: "p-4 overflow-y-auto h-full", children: children })] })] })) }));
}
//# sourceMappingURL=ResponsiveDrawer.js.map