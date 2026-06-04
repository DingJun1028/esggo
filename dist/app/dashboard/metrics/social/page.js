'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { Users, Heart, GraduationCap, TrendingUp, Briefcase, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/db/supabase';
export default function SocialMetricsPage() {
    const [metrics, setMetrics] = useState({
        retentionRate: 92.4,
        trainingHours: 4520,
        hseIncidents: 0,
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            try {
                const { data, error } = await supabase
                    .from('esg_records')
                    .select('metric_value')
                    .eq('category', 'S')
                    .order('timestamp', { ascending: false })
                    .limit(1)
                    .single();
                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching social metrics:', error);
                }
                else if (data && data.metric_value && isMounted) {
                    const m = data.metric_value;
                    setMetrics(prev => ({
                        retentionRate: m.retention_rate ?? prev.retentionRate,
                        trainingHours: m.training_hours ?? prev.trainingHours,
                        hseIncidents: m.hse_incidents ?? prev.hseIncidents,
                    }));
                }
            }
            catch (err) {
                console.error('Unexpected error fetching social metrics:', err);
            }
            finally {
                if (isMounted)
                    setLoading(false);
            }
        }
        // Subscribe to realtime changes
        const channel = supabase
            .channel('schema-db-changes-social')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'esg_records', filter: 'category=eq.S' }, payload => {
            const m = payload.new.metric_value;
            if (m && isMounted) {
                setMetrics(prev => ({
                    retentionRate: m.retention_rate ?? prev.retentionRate,
                    trainingHours: m.training_hours ?? prev.trainingHours,
                    hseIncidents: m.hse_incidents ?? prev.hseIncidents,
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
    return (_jsx("div", { className: "min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30", children: _jsxs("div", { className: "max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [_jsx("header", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative", children: _jsx(Users, { className: "text-purple-400 relative z-10", size: 28 }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx(UniversalBadge, { variant: "default", size: "sm", icon: _jsx(Heart, { size: 12 }), className: "bg-purple-500/20 text-purple-300 border-purple-500/30", children: "S-Metrics" }), _jsx("span", { className: "text-xs font-mono text-slate-500 uppercase tracking-widest", children: "SOC-001" }), loading && _jsx(Loader2, { className: "w-3 h-3 text-purple-500 animate-spin" })] }), _jsx("h1", { className: "text-3xl md:text-4xl font-black text-white tracking-tight", children: "\u793E\u6703\u6307\u6A19 (Social)" }), _jsx("p", { className: "text-slate-400 font-mono text-sm tracking-widest uppercase mt-2", children: "Labor Practices & Community Impact" })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsxs(UniversalCard, { variant: "glass", className: "p-6 transition-all duration-300 hover:border-pink-500/30", children: [_jsxs("h3", { className: "font-bold text-slate-300 flex items-center gap-2 mb-4", children: [_jsx(Heart, { size: 18, className: "text-pink-400" }), " \u54E1\u5DE5\u7559\u4EFB\u7387"] }), _jsxs("div", { className: "text-3xl font-black text-white mb-2", children: [metrics.retentionRate.toFixed(1), "%"] }), _jsxs("p", { className: "text-sm text-slate-400 border-t border-white/5 pt-2 flex items-center gap-1", children: [_jsx(TrendingUp, { size: 14, className: "text-emerald-500" }), " \u8F03\u4E0A\u5B63\u63D0\u5347 1.2%"] })] }), _jsxs(UniversalCard, { variant: "glass", className: "p-6 transition-all duration-300 hover:border-purple-500/30", children: [_jsxs("h3", { className: "font-bold text-slate-300 flex items-center gap-2 mb-4", children: [_jsx(GraduationCap, { size: 18, className: "text-purple-400" }), " \u57F9\u8A13\u7E3D\u6642\u6578"] }), _jsxs("div", { className: "text-3xl font-black text-white mb-2", children: [metrics.trainingHours.toLocaleString(), " \u5C0F\u6642"] }), _jsx("p", { className: "text-sm text-slate-400 border-t border-white/5 pt-2", children: "\u9054\u6A19: \u5E73\u5747\u6BCF\u4EBA 24 \u5C0F\u6642" })] }), _jsxs(UniversalCard, { variant: "glass", className: "p-6 transition-all duration-300 hover:border-blue-500/30", children: [_jsxs("h3", { className: "font-bold text-slate-300 flex items-center gap-2 mb-4", children: [_jsx(Briefcase, { size: 18, className: "text-blue-400" }), " \u8077\u5B89\u885B\u4E8B\u4EF6"] }), _jsxs("div", { className: "text-3xl font-black text-white mb-2", children: [metrics.hseIncidents, " \u4EF6"] }), _jsx("p", { className: "text-sm text-slate-400 border-t border-white/5 pt-2", children: "\u72C0\u614B: \u96F6\u5931\u80FD\u50B7\u5BB3" })] })] })] }) }));
}
//# sourceMappingURL=page.js.map