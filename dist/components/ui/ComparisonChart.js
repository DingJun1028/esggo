import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BrandCard } from '@/components/brand';
import { Activity } from 'lucide-react';
export function ComparisonChart({ resultA, resultB }) {
    const data = [
        {
            name: '碳排放 (噸)',
            原始: resultA.originalValues.carbonEmissions,
            情境A: resultA.projectedValues.carbonEmissions,
            情境B: resultB.projectedValues.carbonEmissions,
        },
        {
            name: '能源消耗 (kWh)',
            原始: resultA.originalValues.energyUsage,
            情境A: resultA.projectedValues.energyUsage,
            情境B: resultB.projectedValues.energyUsage,
        },
    ];
    return (_jsxs(BrandCard, { padding: "lg", className: "w-full h-[400px] border-slate-200 dark:border-white/10 bg-white/60 dark:bg-[#020617]/40 shadow-xl mt-8", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(Activity, { size: 20, className: "text-cyan-400" }), _jsx("h3", { className: "text-lg font-black uppercase tracking-widest text-white", children: "\u540C\u6B65\u7B56\u7565\u6BD4\u8F03\u5206\u6790" })] }), _jsx(ResponsiveContainer, { width: "100%", height: "80%", children: _jsxs(BarChart, { data: data, margin: { top: 20, right: 30, left: 20, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#ffffff20" }), _jsx(XAxis, { dataKey: "name", stroke: "#ffffff80" }), _jsx(YAxis, { stroke: "#ffffff80" }), _jsx(Tooltip, { contentStyle: { backgroundColor: '#020617', borderColor: '#ffffff20', color: '#fff' }, itemStyle: { color: '#fff' } }), _jsx(Legend, { wrapperStyle: { paddingTop: '20px' } }), _jsx(Bar, { dataKey: "\u539F\u59CB", fill: "#475569", radius: [4, 4, 0, 0] }), _jsx(Bar, { dataKey: "\u60C5\u5883A", fill: "#6366f1", radius: [4, 4, 0, 0] }), _jsx(Bar, { dataKey: "\u60C5\u5883B", fill: "#10b981", radius: [4, 4, 0, 0] })] }) })] }));
}
//# sourceMappingURL=ComparisonChart.js.map