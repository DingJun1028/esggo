'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ScoreRing({ value, max = 100, size = 80, strokeWidth = 7, color, label, sublabel, }) {
    const pct = Math.min(Math.max(value / max, 0), 1);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - pct);
    const autoColor = color || (pct >= 0.8 ? '#22c55e' : pct >= 0.6 ? '#f59e0b' : '#ef4444');
    return (_jsxs("div", { className: "flex flex-col items-center gap-1", children: [_jsxs("div", { className: "relative", style: { width: size, height: size }, children: [_jsxs("svg", { width: size, height: size, style: { transform: 'rotate(-90deg)' }, children: [_jsx("circle", { cx: size / 2, cy: size / 2, r: radius, fill: "none", stroke: "#e5e7eb", strokeWidth: strokeWidth }), _jsx("circle", { cx: size / 2, cy: size / 2, r: radius, fill: "none", stroke: autoColor, strokeWidth: strokeWidth, strokeDasharray: circumference, strokeDashoffset: offset, strokeLinecap: "round", style: { transition: 'stroke-dashoffset 0.6s ease' } })] }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsx("span", { className: "font-extrabold text-[#1a1a2e]", style: { fontSize: size * 0.22 }, children: Math.round(pct * max) }) })] }), label && _jsx("div", { className: "text-[12px] font-semibold text-[#374151]", children: label }), sublabel && _jsx("div", { className: "text-[11px] text-[#9ca3af]", children: sublabel })] }));
}
//# sourceMappingURL=ScoreRing.js.map