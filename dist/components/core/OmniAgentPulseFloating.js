'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, X, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';
import BrandStatusDot from '../brand/BrandStatusDot';
export default function OmniAgentPulseFloating({ logoPosition }) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const [isVisible, setIsVisible] = useState(true);
    const [currentSize, setCurrentSize] = useState('md');
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isMinimized, setIsMinimized] = useState(false);
    const pulseRef = useRef(null);
    const [initialPulseRect, setInitialPulseRect] = useState(null);
    useEffect(() => {
        // Load state from localStorage on mount
        const savedVisibility = localStorage.getItem('omniagent_pulse_visible');
        if (savedVisibility !== null)
            setIsVisible(JSON.parse(savedVisibility));
        const savedSize = localStorage.getItem('omniagent_pulse_size');
        if (savedSize)
            setCurrentSize(savedSize);
        const savedPosition = localStorage.getItem('omniagent_pulse_position');
        if (savedPosition)
            setPosition(JSON.parse(savedPosition));
        const savedMinimized = localStorage.getItem('omniagent_pulse_minimized');
        if (savedMinimized !== null)
            setIsMinimized(JSON.parse(savedMinimized));
    }, []);
    useEffect(() => {
        localStorage.setItem('omniagent_pulse_visible', JSON.stringify(isVisible));
    }, [isVisible]);
    useEffect(() => {
        localStorage.setItem('omniagent_pulse_size', currentSize);
    }, [currentSize]);
    useEffect(() => {
        localStorage.setItem('omniagent_pulse_position', JSON.stringify(position));
    }, [position]);
    useEffect(() => {
        localStorage.setItem('omniagent_pulse_minimized', JSON.stringify(isMinimized));
    }, [isMinimized]);
    // Measure initial position of the pulse component for delta calculation
    useEffect(() => {
        const measureInitialPulsePosition = () => {
            if (pulseRef.current) {
                setInitialPulseRect(pulseRef.current.getBoundingClientRect());
            }
        };
        measureInitialPulsePosition(); // Measure on mount
        window.addEventListener('resize', measureInitialPulsePosition); // Re-measure on resize
        return () => window.removeEventListener('resize', measureInitialPulsePosition);
    }, []);
    const handleDragEnd = (_, info) => {
        // Only update position if not minimized
        if (!isMinimized) {
            const newPosition = { x: info.offset.x + position.x, y: info.offset.y + position.y };
            setPosition(newPosition);
        }
    };
    const toggleVisibility = () => {
        // When close button is pressed, minimize instead of fully hiding
        setIsMinimized(true);
    };
    const cycleSize = () => {
        if (currentSize === 'sm')
            setCurrentSize('md');
        else if (currentSize === 'md')
            setCurrentSize('lg');
        else
            setCurrentSize('sm');
    };
    if (!isVisible && !isMinimized)
        return null; // Only fully disappear if both not visible and not minimized
    // Calculate minimizedTarget dynamically using logoPosition and initialPulseRect
    const calculatedMinimizedTarget = useMemo(() => {
        if (!logoPosition || !initialPulseRect) {
            // Fallback or wait if positions are not available yet
            return { x: 0, y: 0, scale: 0.3 }; // Default to no movement, just scale
        }
        // Calculate center of logo
        const logoCenterX = logoPosition.x + logoPosition.width / 2;
        const logoCenterY = logoPosition.y + logoPosition.height / 2;
        // Calculate center of initial (non-minimized) OmniAgent Pulse in viewport coordinates
        // The initialPulseRect provides the rect of the component when it first renders at bottom-12 right-12 with x:0, y:0
        const initialPulseCenterX = initialPulseRect.x + initialPulseRect.width / 2;
        const initialPulseCenterY = initialPulseRect.y + initialPulseRect.height / 2;
        // Calculate the required translation (delta) to move current center to logo center
        const translateX = logoCenterX - initialPulseCenterX;
        const translateY = logoCenterY - initialPulseCenterY;
        return {
            x: translateX,
            y: translateY,
            scale: 0.3, // Scale down to 30%
        };
    }, [logoPosition, initialPulseRect]); // Recalculate if these change
    const sizeClasses = {
        sm: "px-4 py-2 text-sm gap-3",
        md: "px-8 py-4 text-base gap-5",
        lg: "px-10 py-5 text-lg gap-6",
    };
    const dotIconSize = {
        sm: 18,
        md: 24,
        lg: 30,
    };
    return (_jsx(motion.div, { ref: pulseRef, drag: !isMinimized, dragMomentum: false, onDragEnd: handleDragEnd, animate: isMinimized ? calculatedMinimizedTarget : { x: position.x, y: position.y, scale: 1 }, transition: { type: "spring", stiffness: 100, damping: 20 }, className: cn("hidden md:flex fixed z-[60] group", isMinimized ? "cursor-pointer" : "bottom-12 right-12"), onTap: () => { if (isMinimized)
            setIsMinimized(false); }, children: _jsxs(motion.div, { whileHover: { scale: 1.05, y: -5 }, className: cn("rounded-[2.5rem] border backdrop-blur-3xl shadow-2xl flex items-center transition-all duration-500", sizeClasses[currentSize], isDark
                ? "bg-[#003262]/60 border-[#FDB515]/30 shadow-[#FDB515]/5"
                : "bg-white/80 border-[#003262]/20 shadow-xl", isMinimized && "p-0 rounded-full w-10 h-10 flex items-center justify-center" // Styles for minimized state
            ), children: [isMinimized ? (_jsx(Bot, { size: 24, className: isDark ? "text-[#FDB515]" : "text-[#003262]" })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: cn("p-3 rounded-2xl transition-colors", isDark ? "bg-[#FDB515]/10 text-[#FDB515]" : "bg-[#003262] text-white shadow-lg"), children: _jsx(Bot, { size: dotIconSize[currentSize], className: "group-hover:rotate-12 transition-transform" }) }), _jsx("div", { className: "absolute -top-1 -right-1", children: _jsx(BrandStatusDot, { status: "active", pulse: true, sizeClassName: currentSize === 'sm' ? 'w-3 h-3' :
                                            currentSize === 'md' ? 'w-4 h-4' :
                                                'w-5 h-5', borderClassName: "border-2 border-white", shadowClassName: "shadow-[0_0_10px_#10b981]", colorClassName: "bg-emerald-500", dotOnly: true }) })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: cn("font-black uppercase tracking-[0.25em]", currentSize === 'sm' ? "text-[9px]" : currentSize === 'md' ? "text-[11px]" : "text-xs", isDark ? "text-[#FDB515]" : "text-[#003262]"), children: "OmniAgent Pulse" }), _jsxs("div", { className: "flex items-center gap-3 mt-1.5", children: [_jsx("div", { className: "h-1.5 w-32 bg-slate-200/20 rounded-full overflow-hidden", children: _jsx(motion.div, { animate: { width: '92.4%' }, className: "h-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" }) }), _jsx("span", { className: "text-[10px] font-mono font-black opacity-60", children: "92.4%" })] })] })] })), !isMinimized && ( // Hide controls when minimized
                _jsxs("div", { className: "absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx("button", { onClick: cycleSize, className: "bg-slate-700/50 hover:bg-slate-600/70 p-1 rounded-full text-white", children: currentSize === 'lg' ? _jsx(Minimize2, { size: 16 }) : _jsx(Maximize2, { size: 16 }) }), _jsx("button", { onClick: toggleVisibility, className: "bg-red-500/80 hover:bg-red-600/90 p-1 rounded-full text-white", children: _jsx(X, { size: 16 }) })] }))] }) }));
}
//# sourceMappingURL=OmniAgentPulseFloating.js.map