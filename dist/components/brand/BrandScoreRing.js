'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function BrandScoreRing({ score, max = 100, size = 80, strokeWidth = 8, label, color = '#003262' }) {
    const r = (size - strokeWidth) / 2;
    const c = Math.PI * 2 * r;
    const pct = Math.min(100, Math.max(0, (score / max) * 100));
    const dash = (pct / 100) * c;
    return (_jsxs("div", { className: "flex flex-col items-center gap-1", children: [_jsxs("div", { className: "relative", style: { width: size, height: size }, children: [_jsxs("svg", { width: size, height: size, className: "-rotate-90", children: [_jsx("circle", { cx: size / 2, cy: size / 2, r: r, fill: "none", stroke: "#e2e8f0", strokeWidth: strokeWidth }), _jsx("circle", { cx: size / 2, cy: size / 2, r: r, fill: "none", stroke: color, strokeWidth: strokeWidth, strokeDasharray: `${dash} ${c - dash}`, strokeLinecap: "round", style: { transition: 'stroke-dasharray 0.5s ease' } })] }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("span", { className: "text-base font-bold", style: { color }, children: [score, _jsxs("span", { className: "text-[10px] text-slate-400", children: ["/", max] })] }) })] }), label && _jsx("p", { className: "text-xs text-slate-500 text-center", children: label })] }));
}
//# sourceMappingURL=BrandScoreRing.js.map