'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BrandCard, BrandCardHeader, BrandBadge } from '../brand';
import { BarChart2 } from 'lucide-react';
import { listScrapedArticles } from '@dataconnect/generated';
import { dataConnect } from '@/lib/firebase';
import { format, subDays, parseISO, isSameDay } from 'date-fns';
export default function DataVisualizer() {
    const [distributionData, setDistributionData] = useState([]);
    const [trendData, setTrendData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalArticles, setTotalArticles] = useState(0);
    const [highRisk, setHighRisk] = useState(0);
    useEffect(() => {
        async function loadData() {
            if (!dataConnect) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await listScrapedArticles(dataConnect);
                const articles = response.data.scrapedArticles;
                setTotalArticles(articles.length);
                setHighRisk(articles.filter((a) => a.impactLevel === 'high').length);
                // Process Distribution
                const categoryCounts = {};
                articles.forEach((a) => {
                    const cat = a.category || '其它';
                    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
                });
                const colors = ['#003262', '#FDB515', '#3b7ea1', '#22c55e', '#64748b'];
                const distData = Object.entries(categoryCounts).map(([name, value], i) => ({
                    name,
                    value,
                    color: colors[i % colors.length]
                }));
                setDistributionData(distData.length ? distData : [{ name: '無資料', value: 1, color: '#e2e8f0' }]);
                // Process Trend Data (last 7 days)
                const today = new Date();
                const dates = Array.from({ length: 7 }).map((_, i) => subDays(today, 6 - i));
                const trend = dates.map(date => {
                    const matching = articles.filter((a) => {
                        if (!a.publishedAt)
                            return false;
                        try {
                            return isSameDay(parseISO(a.publishedAt), date);
                        }
                        catch {
                            return false;
                        }
                    });
                    return {
                        date: format(date, 'MM/dd'),
                        articles: matching.length,
                        alerts: matching.filter((a) => a.impactLevel === 'high').length
                    };
                });
                setTrendData(trend);
            }
            catch (e) {
                console.error("Failed to load articles", e);
                setError(e.message || "未能載入資料。請檢查資料庫連線或網路狀態。");
            }
            finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs(BrandCard, { className: "h-[400px] flex flex-col", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx(BrandCardHeader, { title: "\u60C5\u5831\u4F86\u6E90\u5206\u4F48", subtitle: "Intelligence Distribution by Category" }), _jsx(BarChart2, { className: "text-[#003262]/20", size: 24 })] }), _jsx("div", { className: "flex-1 min-h-0 w-full relative", children: isLoading ? (_jsx("div", { className: "flex items-center justify-center h-full text-slate-400 font-medium", children: "Loading data..." })) : error ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center px-4", children: [_jsx("span", { className: "text-red-500 font-bold mb-1", children: "\u5716\u8868\u8F09\u5165\u5931\u6557" }), _jsx("span", { className: "text-xs text-slate-500", children: error })] })) : totalArticles === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center px-4", children: [_jsx("span", { className: "text-slate-600 font-bold mb-1", children: "\u76EE\u524D\u7121\u8CC7\u6599" }), _jsx("span", { className: "text-xs text-slate-400", children: "\u8ACB\u57F7\u884C Omni-Scraper \u7372\u53D6\u6700\u65B0\u60C5\u5831" })] })) : (_jsxs(_Fragment, { children: [_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: distributionData, cx: "50%", cy: "50%", innerRadius: 80, outerRadius: 120, paddingAngle: 5, dataKey: "value", stroke: "none", children: distributionData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, { contentStyle: { borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }, itemStyle: { fontSize: '13px', fontWeight: 'bold' } }), _jsx(Legend, { verticalAlign: "bottom", height: 36, iconType: "circle", wrapperStyle: { fontSize: '12px', fontWeight: 'bold', color: '#64748b' } })] }) }), _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8", children: [_jsx("span", { className: "text-3xl font-black text-[#003262]", children: distributionData.length > 0 && distributionData[0].name !== '無資料' ? '100%' : '0%' }), _jsx("span", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest", children: "\u6DB5\u84CB\u7387" })] })] })) })] }), _jsxs(BrandCard, { className: "h-[400px] flex flex-col", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx(BrandCardHeader, { title: "\u81EA\u52D5\u63A1\u96C6\u8DA8\u52E2", subtitle: "Omni-Scraper Daily Activity" }), _jsx(BrandBadge, { variant: "gold", size: "xs", children: "Live" })] }), _jsx("div", { className: "flex-1 min-h-0 w-full", children: isLoading ? (_jsx("div", { className: "flex items-center justify-center h-full text-slate-400 font-medium", children: "Loading data..." })) : error ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center px-4", children: [_jsx("span", { className: "text-red-500 font-bold mb-1", children: "\u5716\u8868\u8F09\u5165\u5931\u6557" }), _jsx("span", { className: "text-xs text-slate-500", children: error })] })) : totalArticles === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center px-4", children: [_jsx("span", { className: "text-slate-600 font-bold mb-1", children: "\u76EE\u524D\u7121\u8DA8\u52E2\u8CC7\u6599" }), _jsx("span", { className: "text-xs text-slate-400", children: "\u8ACB\u57F7\u884C Omni-Scraper \u7372\u53D6\u6700\u65B0\u60C5\u5831" })] })) : (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: trendData, margin: { top: 20, right: 20, left: -20, bottom: 0 }, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "colorArticles", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#003262", stopOpacity: 0.2 }), _jsx("stop", { offset: "95%", stopColor: "#003262", stopOpacity: 0 })] }), _jsxs("linearGradient", { id: "colorAlerts", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#ef4444", stopOpacity: 0.2 }), _jsx("stop", { offset: "95%", stopColor: "#ef4444", stopOpacity: 0 })] })] }), _jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }), _jsx(XAxis, { dataKey: "date", axisLine: false, tickLine: false, tick: { fontSize: 11, fill: '#94a3b8', fontWeight: 600 }, dy: 10 }), _jsx(YAxis, { axisLine: false, tickLine: false, tick: { fontSize: 11, fill: '#94a3b8', fontWeight: 600 } }), _jsx(Tooltip, { contentStyle: { borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }, labelStyle: { fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' } }), _jsx(Legend, { verticalAlign: "top", align: "right", iconType: "circle", wrapperStyle: { fontSize: '11px', fontWeight: 600, paddingBottom: '20px' } }), _jsx(Area, { type: "monotone", dataKey: "articles", name: "\u63A1\u96C6\u60C5\u5831\u6578", stroke: "#003262", strokeWidth: 3, fill: "url(#colorArticles)", activeDot: { r: 6, strokeWidth: 0 } }), _jsx(Area, { type: "monotone", dataKey: "alerts", name: "\u98A8\u96AA\u9810\u8B66\u6578", stroke: "#ef4444", strokeWidth: 2, fill: "url(#colorAlerts)", activeDot: { r: 5, strokeWidth: 0 } })] }) })) })] }), _jsx("div", { className: "lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4", children: [
                    { label: '採集總數', value: totalArticles.toString(), trend: 'Live', color: 'text-[#003262]' },
                    { label: '高衝擊風險', value: highRisk.toString(), trend: 'Live', color: 'text-red-500' },
                    { label: '涵蓋標準來源', value: '18', trend: '0%', color: 'text-[#FDB515]' },
                    { label: 'Omni 成功率', value: '99.8%', trend: '+0.2%', color: 'text-emerald-500' },
                ].map((kpi, i) => (_jsxs("div", { className: "bg-white border border-slate-100 rounded-2xl p-5 shadow-sm", children: [_jsx("p", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest mb-2", children: kpi.label }), _jsxs("div", { className: "flex items-end justify-between", children: [_jsx("span", { className: `text-3xl font-black ${kpi.color} leading-none`, children: kpi.value }), _jsx("span", { className: "text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full", children: kpi.trend })] })] }, i))) })] }));
}
//# sourceMappingURL=DataVisualizer.js.map