'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line, ComposedChart } from 'recharts';
const defaultData = [
    { year: '2021', actual: 450, target: 450, bau: 450 },
    { year: '2022', actual: 435, target: 430, bau: 465 },
    { year: '2023', actual: 410, target: 410, bau: 480 },
    { year: '2024', actual: 395, target: 385, bau: 500 },
    { year: '2025', target: 360, bau: 520 },
    { year: '2026', target: 330, bau: 540 },
    { year: '2030', target: 220, bau: 600 },
];
export function EnvironmentalTrajectory({ data = defaultData, title = "碳排放減量軌跡 (tCO2e)", unit = "tCO2e" }) {
    return (_jsxs("div", { className: "w-full", style: { background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }, children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { style: { fontSize: 'var(--font-size-sm)', fontWeight: 700, color: '#003262' }, children: title }), _jsxs("span", { style: { fontSize: '10px', color: '#94a3b8', fontWeight: 600 }, children: ["\u55AE\u4F4D: ", unit] })] }), _jsx("div", { style: { width: '100%', height: 'clamp(240px, 40vh, 320px)' }, children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(ComposedChart, { data: data, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "colorActual", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#003262", stopOpacity: 0.1 }), _jsx("stop", { offset: "95%", stopColor: "#003262", stopOpacity: 0 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }), _jsx(XAxis, { dataKey: "year", axisLine: false, tickLine: false, tick: { fontSize: 10, fill: '#64748b' }, dy: 10 }), _jsx(YAxis, { axisLine: false, tickLine: false, tick: { fontSize: 10, fill: '#64748b' } }), _jsx(Tooltip, { contentStyle: { borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' } }), _jsx(Legend, { verticalAlign: "top", align: "right", iconType: "circle", wrapperStyle: { fontSize: '10px', fontWeight: 600, paddingBottom: '20px' } }), _jsx(Line, { type: "monotone", dataKey: "bau", name: "BAU \u8DA8\u52E2 (\u7121\u4F5C\u70BA)", stroke: "#cbd5e1", strokeDasharray: "5 5", dot: false, strokeWidth: 1 }), _jsx(Area, { type: "monotone", dataKey: "target", name: "SBTi \u6E1B\u78B3\u76EE\u6A19", stroke: "#FDB515", fill: "transparent", strokeWidth: 2 }), _jsx(Area, { type: "monotone", dataKey: "actual", name: "\u5BE6\u969B\u6392\u653E\u91CF", stroke: "#003262", fillOpacity: 1, fill: "url(#colorActual)", strokeWidth: 3, dot: { r: 4, fill: '#003262', strokeWidth: 2, stroke: '#fff' }, activeDot: { r: 6 } })] }) }) })] }));
}
//# sourceMappingURL=EnvironmentalTrajectory.js.map