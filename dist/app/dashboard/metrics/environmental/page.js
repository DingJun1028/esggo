'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { Leaf, Wind, Recycle, TrendingDown, Zap, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/db/supabase';
export default function EnvironmentalMetricsPage() {
    const [metrics, setMetrics] = useState({
        carbonEmissions: 1520.4,
        energyConsumption: 42500,
        recyclingRate: 85.5,
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            try {
                const { data, error } = await supabase
                    .from('esg_records')
                    .select('metric_value')
                    .eq('category', 'E')
                    .order('timestamp', { ascending: false })
                    .limit(1)
                    .single();
                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching environmental metrics:', error);
                }
                else if (data && data.metric_value && isMounted) {
                    const m = data.metric_value;
                    setMetrics(prev => ({
                        carbonEmissions: m.carbon_emissions ?? prev.carbonEmissions,
                        energyConsumption: m.energy_consumption ?? prev.energyConsumption,
                        recyclingRate: m.recycling_rate ?? prev.recyclingRate,
                    }));
                }
            }
            catch (err) {
                console.error('Unexpected error fetching environmental metrics:', err);
            }
            finally {
                if (isMounted)
                    setLoading(false);
            }
        }
        // Subscribe to realtime changes
        const channel = supabase
            .channel('schema-db-changes-environmental')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'esg_records', filter: 'category=eq.E' }, payload => {
            const m = payload.new.metric_value;
            if (m && isMounted) {
                setMetrics(prev => ({
                    carbonEmissions: m.carbon_emissions ?? prev.carbonEmissions,
                    energyConsumption: m.energy_consumption ?? prev.energyConsumption,
                    recyclingRate: m.recycling_rate ?? prev.recyclingRate,
                }));
            }
        })
            .subscribe();
        fetchData();
        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, []);
    return (_jsx("div", { className: "min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30", children: _jsxs("div", { className: "max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [_jsx("header", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative", children: _jsx(Leaf, { className: "text-emerald-400 relative z-10", size: 28 }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx(UniversalBadge, { variant: "default", size: "sm", icon: _jsx(Leaf, { size: 12 }), className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", children: "E-Metrics" }), _jsx("span", { className: "text-xs font-mono text-slate-500 uppercase tracking-widest", children: "ENV-001" }), loading && _jsx(Loader2, { className: "w-3 h-3 text-emerald-500 animate-spin" })] }), _jsx("h1", { className: "text-3xl md:text-4xl font-black text-white tracking-tight", children: "\u74B0\u5883\u6307\u6A19 (Environmental)" }), _jsx("p", { className: "text-slate-400 font-mono text-sm tracking-widest uppercase mt-2", children: "Climate Action & Resource Management" })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsxs(UniversalCard, { variant: "glass", className: "p-6 transition-all duration-300 hover:border-emerald-500/30", children: [_jsxs("h3", { className: "font-bold text-slate-300 flex items-center gap-2 mb-4", children: [_jsx(Wind, { size: 18, className: "text-emerald-400" }), " \u78B3\u6392\u653E\u91CF (Scope 1+2)"] }), _jsxs("div", { className: "text-3xl font-black text-white mb-2", children: [metrics.carbonEmissions.toLocaleString(), " ", _jsx("span", { className: "text-lg font-normal text-slate-500", children: "tCO\u2082e" })] }), _jsxs("p", { className: "text-sm text-slate-400 border-t border-white/5 pt-2 flex items-center gap-1", children: [_jsx(TrendingDown, { size: 14, className: "text-emerald-500" }), " \u8F03\u53BB\u5E74\u540C\u671F\u4E0B\u964D 5.4%"] })] }), _jsxs(UniversalCard, { variant: "glass", className: "p-6 transition-all duration-300 hover:border-teal-500/30", children: [_jsxs("h3", { className: "font-bold text-slate-300 flex items-center gap-2 mb-4", children: [_jsx(Zap, { size: 18, className: "text-teal-400" }), " \u7E3D\u80FD\u6E90\u6D88\u8017"] }), _jsxs("div", { className: "text-3xl font-black text-white mb-2", children: [metrics.energyConsumption.toLocaleString(), " ", _jsx("span", { className: "text-lg font-normal text-slate-500", children: "kWh" })] }), _jsx("p", { className: "text-sm text-slate-400 border-t border-white/5 pt-2", children: "\u72C0\u614B: \u7DA0\u96FB\u4F54\u6BD4 42%" })] }), _jsxs(UniversalCard, { variant: "glass", className: "p-6 transition-all duration-300 hover:border-green-500/30", children: [_jsxs("h3", { className: "font-bold text-slate-300 flex items-center gap-2 mb-4", children: [_jsx(Recycle, { size: 18, className: "text-green-400" }), " \u5EE2\u68C4\u7269\u56DE\u6536\u7387"] }), _jsxs("div", { className: "text-3xl font-black text-white mb-2", children: [metrics.recyclingRate.toFixed(1), "%"] }), _jsx("p", { className: "text-sm text-slate-400 border-t border-white/5 pt-2", children: "\u76EE\u6A19: 2026\u5E74\u9054 90%" })] })] })] }) }));
}
//# sourceMappingURL=page.js.map