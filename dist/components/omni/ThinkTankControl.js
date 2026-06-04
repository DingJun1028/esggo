'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Activity, Shield, Radio, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Play, Database, ArrowRight, Loader2, Wifi, WifiOff, } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useOmniAgentStream } from '@/lib/hooks/useOmniAgentStream';
/* ─── Mission Definitions ─── */
const MISSIONS = [
    { id: 'SYNC_OMNIBLUE_OMNITABLE', label: 'OmniBlue → OmniTable', labelZh: '藍碳同步', icon: Database, color: '#06b6d4' },
    { id: 'EVIDENCE_AUDIT', label: 'Evidence Audit', labelZh: '實證驗證', icon: Shield, color: '#10b981' },
    { id: 'PILOT_REPORT', label: 'SustainWrite Pilot', labelZh: '自主撰寫', icon: Brain, color: '#8b5cf6' },
    { id: 'TRANSFER_TO_NCBDB', label: 'NCBDB Migration', labelZh: '資料遷移', icon: ArrowRight, color: '#f59e0b' },
];
/* ─── Sub-components ─── */
function ConnectionBadge({ connected, error, onReconnect }) {
    return (_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border', connected
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'), children: [connected ? _jsx(Wifi, { size: 10 }) : _jsx(WifiOff, { size: 10 }), connected ? 'Live' : 'Offline'] }), !connected && (_jsx("button", { onClick: onReconnect, className: "p-1 rounded hover:bg-white/5 text-slate-400", children: _jsx(RefreshCw, { size: 12 }) }))] }));
}
function MissionCard({ mission, progress, onLaunch, isLoading }) {
    const Icon = mission.icon;
    const status = progress?.status;
    return (_jsx(motion.div, { whileHover: { scale: 1.01 }, className: "relative", children: _jsx(Card, { className: "bg-white/[0.02] border-white/5 backdrop-blur-xl rounded-2xl overflow-hidden group hover:border-white/10 transition-all", children: _jsxs(CardContent, { className: "p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-xl flex items-center justify-center", style: { background: `${mission.color}15`, border: `1px solid ${mission.color}30` }, children: _jsx(Icon, { size: 16, style: { color: mission.color } }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-bold text-white", children: mission.label }), _jsx("p", { className: "text-[9px] text-slate-500", children: mission.labelZh })] })] }), status && (_jsxs(Badge, { variant: "outline", className: cn('text-[8px]', status === 'running' && 'text-cyan-400 border-cyan-500/30', status === 'complete' && 'text-emerald-400 border-emerald-500/30', status === 'error' && 'text-red-400 border-red-500/30'), children: [status === 'running' && _jsx(Loader2, { size: 8, className: "mr-1 animate-spin" }), status === 'complete' && _jsx(CheckCircle2, { size: 8, className: "mr-1" }), status === 'error' && _jsx(XCircle, { size: 8, className: "mr-1" }), status] }))] }), status === 'running' && (_jsx("div", { className: "h-1 bg-white/5 rounded-full overflow-hidden mb-3", children: _jsx(motion.div, { className: "h-full rounded-full", style: { background: mission.color }, animate: { width: ['5%', '70%', '90%'] }, transition: { duration: 8, ease: 'easeInOut' } }) })), progress?.totalProcessed !== undefined && status === 'complete' && (_jsxs("p", { className: "text-[10px] text-emerald-400 mb-3", children: ["\u2713 Processed ", progress.totalProcessed, " items"] })), progress?.error && (_jsxs("p", { className: "text-[10px] text-red-400 mb-3 truncate", children: ["\u26A0 ", progress.error] })), _jsx(Button, { variant: "ghost", size: "sm", onClick: onLaunch, disabled: isLoading || status === 'running', className: "w-full text-[10px] font-bold uppercase tracking-wider border border-white/5 hover:border-white/10 h-8", children: isLoading || status === 'running' ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { size: 10, className: "mr-1.5 animate-spin" }), " Executing..."] })) : (_jsxs(_Fragment, { children: [_jsx(Play, { size: 10, className: "mr-1.5" }), " Launch Mission"] })) })] }) }) }));
}
function EventLog({ events }) {
    const typeColors = {
        MISSION_START: 'text-cyan-400',
        MISSION_COMPLETE: 'text-emerald-400',
        AGENT_TASK: 'text-slate-300',
        AGENT_ERROR: 'text-red-400',
        '5T_SEAL': 'text-amber-400',
        COMMAND_ISSUED: 'text-purple-400',
        SCHEDULE_TRIGGERED: 'text-blue-400',
        SCHEDULE_COMPLETE: 'text-emerald-400',
    };
    const typeIcons = {
        MISSION_START: _jsx(Zap, { size: 10, className: "text-cyan-400" }),
        MISSION_COMPLETE: _jsx(CheckCircle2, { size: 10, className: "text-emerald-400" }),
        AGENT_TASK: _jsx(Activity, { size: 10, className: "text-slate-400" }),
        AGENT_ERROR: _jsx(AlertTriangle, { size: 10, className: "text-red-400" }),
        '5T_SEAL': _jsx(Shield, { size: 10, className: "text-amber-400" }),
        COMMAND_ISSUED: _jsx(Radio, { size: 10, className: "text-purple-400" }),
    };
    return (_jsxs("div", { className: "space-y-2 max-h-[400px] overflow-y-auto pr-1", style: { scrollbarWidth: 'thin' }, children: [_jsx(AnimatePresence, { initial: false, children: events.slice(0, 30).map(evt => (_jsxs(motion.div, { initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0 }, className: "flex gap-3 py-2 border-b border-white/[0.03] last:border-0", children: [_jsx("span", { className: "text-[9px] text-slate-600 font-mono shrink-0 pt-0.5 w-16", children: new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }), _jsx("div", { className: "shrink-0 pt-0.5", children: typeIcons[evt.event] || _jsx(Activity, { size: 10, className: "text-slate-500" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("span", { className: cn('text-[10px] font-bold', typeColors[evt.event] || 'text-slate-400'), children: evt.event }), _jsx("p", { className: "text-[10px] text-slate-500 truncate", children: JSON.stringify(evt.payload).substring(0, 120) })] })] }, evt.id))) }), events.length === 0 && (_jsx("p", { className: "text-[10px] text-slate-600 text-center py-8", children: "Awaiting events from OmniAgent Bus..." }))] }));
}
function HITLReviewPanel({ lastSeal }) {
    const [reviewStatus, setReviewStatus] = useState('pending');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submitReview = useCallback(async (decision) => {
        if (!lastSeal)
            return;
        setIsSubmitting(true);
        try {
            await fetch('/api/omni-agent-api/hitl-review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sealId: lastSeal.id,
                    gate: String(lastSeal.payload.gate || 'T4'),
                    resource: String(lastSeal.payload.chapter || lastSeal.payload.resource || 'N/A'),
                    hash: String(lastSeal.payload.hash || lastSeal.payload.zkp_hash || ''),
                    decision,
                }),
            });
            setReviewStatus(decision);
        }
        catch (err) {
            console.error('HITL review submission failed:', err);
        }
        finally {
            setIsSubmitting(false);
        }
    }, [lastSeal]);
    if (!lastSeal) {
        return (_jsxs("div", { className: "text-center py-8", children: [_jsx(Shield, { size: 24, className: "text-slate-700 mx-auto mb-3" }), _jsx("p", { className: "text-[10px] text-slate-600", children: "No seals pending review" })] }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 rounded-xl bg-amber-500/5 border border-amber-500/10", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Shield, { size: 12, className: "text-amber-400" }), _jsx("span", { className: "text-[10px] font-bold text-amber-400 uppercase tracking-wider", children: "5T Seal Review" })] }), _jsxs("div", { className: "space-y-1.5 text-[10px]", children: [_jsxs("p", { className: "text-slate-300", children: ["Gate: ", _jsx("span", { className: "text-white font-bold", children: String(lastSeal.payload.gate) })] }), _jsxs("p", { className: "text-slate-300", children: ["Resource: ", _jsx("span", { className: "text-white font-bold", children: String(lastSeal.payload.chapter || lastSeal.payload.resource || 'N/A') })] }), _jsxs("p", { className: "text-slate-400 font-mono text-[9px] truncate", children: ["Hash: ", String(lastSeal.payload.hash || lastSeal.payload.zkp_hash || '—')] })] })] }), reviewStatus === 'pending' ? (_jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "primary", size: "sm", onClick: () => submitReview('approved'), disabled: isSubmitting, className: "flex-1 bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold h-8", children: [isSubmitting ? _jsx(Loader2, { size: 10, className: "mr-1 animate-spin" }) : _jsx(CheckCircle2, { size: 10, className: "mr-1" }), "Approve"] }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: () => submitReview('rejected'), disabled: isSubmitting, className: "flex-1 border border-red-500/20 text-red-400 text-[10px] font-bold h-8", children: [isSubmitting ? _jsx(Loader2, { size: 10, className: "mr-1 animate-spin" }) : _jsx(XCircle, { size: 10, className: "mr-1" }), "Reject"] })] })) : (_jsx(Badge, { variant: "outline", className: cn('w-full justify-center py-1.5', reviewStatus === 'approved' ? 'text-emerald-400 border-emerald-500/30' : 'text-red-400 border-red-500/30'), children: reviewStatus === 'approved' ? '✓ Approved & Persisted' : '✗ Rejected & Logged' }))] }));
}
/* ─── Main Component ─── */
export default function ThinkTankControl() {
    const { events, isConnected, connectionError, activeMissions, lastSeal, reconnect, clearEvents } = useOmniAgentStream();
    const [loadingMission, setLoadingMission] = useState(null);
    const launchMission = useCallback(async (missionId) => {
        setLoadingMission(missionId);
        try {
            await fetch('/api/omni-agent-api/command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: missionId }),
            });
        }
        catch (err) {
            console.error('Mission launch failed:', err);
        }
        finally {
            setLoadingMission(null);
        }
    }, []);
    return (_jsxs("div", { className: "min-h-screen bg-[#020617] text-slate-300 font-sans p-6 lg:p-8", children: [_jsxs("header", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)]", children: _jsx(Brain, { size: 22, className: "text-cyan-400" }) }), _jsxs("div", { children: [_jsxs("h1", { className: "text-lg font-black text-white tracking-tight flex items-center gap-2", children: ["\u842C\u80FD\u667A\u5EAB Mission Control", _jsx(Badge, { variant: "outline", className: "bg-cyan-500/5 text-cyan-400 border-cyan-500/30 text-[8px]", children: "LIVE" })] }), _jsx("p", { className: "text-[10px] text-slate-500 uppercase tracking-[0.15em] font-bold mt-0.5", children: "Omnipotent Think Tank \u2022 Real-Time Agent Orchestration" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(ConnectionBadge, { connected: isConnected, error: connectionError, onReconnect: reconnect }), _jsx(Button, { variant: "ghost", size: "sm", onClick: clearEvents, className: "text-[9px] font-bold uppercase border border-white/5 h-7", children: "Clear Log" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6", children: [_jsxs("div", { className: "lg:col-span-4 space-y-4", children: [_jsxs("p", { className: "text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2", children: [_jsx(Zap, { size: 10, className: "text-cyan-400" }), " Mission Launcher"] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3", children: MISSIONS.map(m => (_jsx(MissionCard, { mission: m, progress: activeMissions.find(p => p.mission === m.label || p.mission === m.id.replace(/_/g, ' ').replace('SYNC OMNIBLUE OMNITABLE', 'OmniBlue to OmniTable Sync')), onLaunch: () => launchMission(m.id), isLoading: loadingMission === m.id }, m.id))) })] }), _jsx("div", { className: "lg:col-span-5", children: _jsxs(Card, { className: "bg-black/40 border-white/5 rounded-2xl overflow-hidden h-full", children: [_jsxs("div", { className: "p-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between", children: [_jsxs("p", { className: "text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2", children: [_jsx(Radio, { size: 10, className: "text-cyan-400" }), " OmniAgent Event Stream"] }), _jsxs("span", { className: "text-[9px] text-slate-600", children: [events.length, " events"] })] }), _jsx(CardContent, { className: "p-4", children: _jsx(EventLog, { events: events }) })] }) }), _jsxs("div", { className: "lg:col-span-3 space-y-4", children: [_jsxs(Card, { className: "bg-white/[0.02] border-white/5 rounded-2xl overflow-hidden", children: [_jsx("div", { className: "p-4 bg-white/[0.02] border-b border-white/5", children: _jsxs("p", { className: "text-[9px] font-black text-amber-400 uppercase tracking-[0.2em] flex items-center gap-2", children: [_jsx(Shield, { size: 10 }), " \u5BE9\u67E5\u8056\u6BBF HITL Review"] }) }), _jsx(CardContent, { className: "p-4", children: _jsx(HITLReviewPanel, { lastSeal: lastSeal }) })] }), _jsx(Card, { className: "bg-white/[0.02] border-white/5 rounded-2xl overflow-hidden", children: _jsxs(CardContent, { className: "p-5 space-y-3", children: [_jsxs("p", { className: "text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2", children: [_jsx(Activity, { size: 10, className: "text-emerald-400" }), " System Vitals"] }), [
                                            { label: 'Missions Completed', value: activeMissions.filter(m => m.status === 'complete').length, color: 'text-emerald-400' },
                                            { label: 'Active Missions', value: activeMissions.filter(m => m.status === 'running').length, color: 'text-cyan-400' },
                                            { label: 'Total Events', value: events.length, color: 'text-slate-300' },
                                            { label: '5T Seals', value: events.filter(e => e.event === '5T_SEAL').length, color: 'text-amber-400' },
                                        ].map(s => (_jsxs("div", { className: "flex items-center justify-between py-1.5 border-b border-white/[0.03] last:border-0", children: [_jsx("span", { className: "text-[10px] text-slate-500", children: s.label }), _jsx("span", { className: cn('text-sm font-bold', s.color), children: s.value })] }, s.label)))] }) })] })] })] }));
}
//# sourceMappingURL=ThinkTankControl.js.map