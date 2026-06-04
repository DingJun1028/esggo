'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Plus, Play, CheckCircle, XCircle, FileText, Shield, Activity, RefreshCw, Zap, ChevronRight, Layers, List } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { BrandStatusDot } from '../../components/brand';
import StandardPage from '../../components/brand/StandardPage';
import { SKILL_REGISTRY } from '../../lib/agent/registry';
const TASK_TYPE_META = {
    report_drafting: { label: '報告撰寫', color: '#003262' },
    compliance_review: { label: '合規審查', color: '#8B5CF6' },
    evidence_mapping: { label: '證據映射', color: '#10B981' },
    task_planning: { label: '任務規劃', color: '#3B7EA1' },
};
const TASK_ICONS = {
    report_drafting: _jsx(FileText, { size: 16 }),
    compliance_review: _jsx(Shield, { size: 16 }),
    evidence_mapping: _jsx(Layers, { size: 16 }),
    task_planning: _jsx(List, { size: 16 }),
};
const REVIEW_STATUS_MAP = {
    awaiting_review: { label: '待審核', variant: 'warning' },
    approved: { label: '已核准', variant: 'info' },
    rejected: { label: '已拒絕', variant: 'error' },
    promoted: { label: '已封印', variant: 'success' },
};
export default function OrchestratorPage() {
    const [tasks, setTasks] = useState([]);
    const [executions, setExecutions] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('executions');
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [toast, setToast] = useState(null);
    // Form State
    const [taskType, setTaskType] = useState('report_drafting');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedSkill, setSelectedSkill] = useState(SKILL_REGISTRY[0].skillKey);
    const fetchTasks = async () => {
        setLoading(true);
        try {
            const [tRes, eRes, aRes, auRes] = await Promise.all([
                fetch('/api/agent/tasks'),
                fetch('/api/agent/executions'),
                fetch('/api/agent/artifacts'),
                fetch('/api/audit-log')
            ]);
            const [tData, eData, aData, auData] = await Promise.all([tRes.json(), eRes.json(), aRes.json(), auRes.json()]);
            setTasks(tData.tasks || []);
            const merged = (tData.tasks || []).map((t) => ({
                task: t,
                execution: eData.executions?.find((e) => e.taskId === t.id) || null,
                artifact: aData.artifacts?.find((a) => a.taskId === t.id) || null,
                policy: null
            }));
            setExecutions(merged);
            setAuditLogs(auData.logs || []);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => { fetchTasks(); }, []);
    function showToast(msg, type = 'success') {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    }
    async function handleCreate() {
        if (!title.trim()) {
            showToast('請填寫任務標題', 'error');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/agent/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ actorId: 'user_001', taskType, title, description, skillKey: selectedSkill }),
            });
            const data = await res.json();
            if (!data.ok)
                throw new Error(data.error);
            const rec = { task: data.task, execution: null, artifact: null, policy: data.policy };
            setExecutions(prev => [rec, ...prev]);
            setSelected(rec);
            setTitle('');
            setDescription('');
            setActiveTab('executions');
            showToast('任務建立成功，政策守門已通過');
        }
        catch (e) {
            showToast(e.message, 'error');
        }
        finally {
            setLoading(false);
        }
    }
    async function handleExecute(rec) {
        setLoading(true);
        try {
            const res = await fetch(`/api/agent/tasks/${rec.task.id}/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: rec.task }),
            });
            const data = await res.json();
            if (!data.ok)
                throw new Error(data.error);
            const updated = { ...rec, execution: data.execution, artifact: data.artifact };
            setExecutions(prev => prev.map(r => r.task.id === rec.task.id ? updated : r));
            setSelected(updated);
            showToast('OmniAgent 執行完成，草稿已生成');
        }
        catch (e) {
            showToast(e.message, 'error');
        }
        finally {
            setLoading(false);
        }
    }
    const pageConfig = {
        id: 'omniagent-orchestrator',
        title: 'OmniAgent 調度中心',
        subtitle: 'Swarm Orchestration · 多代理任務並行 · 5T 治理日誌。',
        icon: _jsx(Bot, { size: 32, className: "text-berkeley-blue" }),
        griReference: 'Orchestrator',
        activeT5Tags: ['T3', 'T4', 'T5'],
        isOXModule: true,
        features: { useAuditLog: true },
        primaryActions: [
            { id: 'create', label: '建立代理任務', icon: _jsx(Plus, { size: 16 }), onClick: () => setActiveTab('create') },
            { id: 'refresh', label: '刷新', icon: _jsx(RefreshCw, { size: 16 }), variant: 'secondary', onClick: fetchTasks }
        ],
        kpis: [
            { key: 'active', label: '活躍 Agent', value: '4', icon: _jsx(Bot, { size: 18 }), verified: true },
            { key: 'tasks', label: '累計任務', value: tasks.length.toString(), icon: _jsx(FileText, { size: 18 }) },
            { key: 'uptime', label: '系統負載', value: '1.24', unit: 'load', icon: _jsx(Activity, { size: 18 }) },
        ],
        sections: [
            {
                id: 'nav',
                title: '資源導覽',
                columns: 12,
                component: (_jsx(Tabs, { active: activeTab, onChange: (t) => setActiveTab(t), tabs: [
                        { key: 'create', label: '新增任務', icon: _jsx(Plus, { size: 14 }) },
                        { key: 'executions', label: '執行清單', icon: _jsx(Activity, { size: 14 }) },
                        { key: 'swarm', label: '蜂群看板', icon: _jsx(Bot, { size: 14 }) },
                        { key: 'registry', label: '技能庫', icon: _jsx(Zap, { size: 14 }) },
                        { key: 'audit', label: '治理日誌', icon: _jsx(Shield, { size: 14 }) },
                    ], variant: "pills" }))
            },
            {
                id: 'main-content',
                title: activeTab.toUpperCase(),
                columns: 12,
                component: (_jsxs("div", { className: "min-h-[400px]", children: [activeTab === 'create' && (_jsxs("div", { className: "space-y-10 animate-in fade-in max-w-4xl pt-4", children: [_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: Object.entries(TASK_TYPE_META).map(([type, m]) => (_jsxs("button", { onClick: () => setTaskType(type), className: cn("p-8 rounded-[2.5rem] border-2 transition-all duration-500 text-left group relative overflow-hidden", taskType === type ? 'bg-berkeley-blue/5 border-berkeley-blue shadow-lg' : 'bg-white border-slate-100 hover:border-berkeley-blue/30'), children: [_jsx("div", { className: "mb-6 transition-transform group-hover:scale-110 relative z-10", style: { color: m.color }, children: TASK_ICONS[type] }), _jsx("p", { className: cn("text-xs font-black uppercase tracking-widest relative z-10", taskType === type ? 'text-berkeley-blue' : 'text-slate-400'), children: m.label }), taskType === type && _jsx(motion.div, { layoutId: "bg-pill", className: "absolute inset-0 bg-berkeley-blue/5 z-0" })] }, type))) }), _jsxs("div", { className: "space-y-8", children: [_jsx(Input, { label: "\u4EFB\u52D9\u6A19\u984C (Task Title)", placeholder: "\u4F8B\u5982\uFF1A\u80FD\u6E90\u6578\u64DA\u63D0\u53D6\u4EFB\u52D9", value: title, onChange: e => setTitle(e.target.value) }), _jsxs("div", { className: "space-y-2.5", children: [_jsx("label", { className: "text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "\u4EFB\u52D9\u8AAA\u660E (Description)" }), _jsx("textarea", { className: "w-full bg-slate-50/50 border border-slate-100 rounded-[2rem] p-8 text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-berkeley-blue/5 transition-all min-h-[160px] shadow-inner", value: description, onChange: e => setDescription(e.target.value), placeholder: "\u8ACB\u8F38\u5165\u4EFB\u52D9\u8A73\u7D30\u80CC\u666F\u8207 5T \u8981\u6C42..." })] }), _jsxs(Button, { variant: "primary", className: "w-full h-16 rounded-[2rem] text-base tracking-widest shadow-glass", onClick: handleCreate, isLoading: loading, children: [_jsx(Shield, { size: 20, className: "mr-3" }), " \u555F\u52D5 Policy Guard \u4E26\u5EFA\u7ACB"] })] })] })), activeTab === 'executions' && (_jsx(DataTable, { columns: [
                                { key: 'title', header: '任務標題', render: (_, rec) => _jsx("span", { className: "font-bold text-slate-800", children: rec.task.title }) },
                                { key: 'status', header: '執行狀態', render: (_, rec) => (_jsx(Badge, { variant: rec.artifact ? (REVIEW_STATUS_MAP[rec.artifact.reviewStatus]?.variant || 'verified') : 'draft', children: rec.artifact ? REVIEW_STATUS_MAP[rec.artifact.reviewStatus]?.label : '待執行' })) },
                                { key: 'time', header: '建立時間', render: (_, rec) => _jsx("span", { className: "text-[11px] font-mono text-slate-400 font-bold", children: new Date(rec.task.createdAt).toLocaleString() }) },
                                { key: 'action', header: '', render: (_, rec) => _jsx(Button, { variant: "glass", size: "sm", className: "h-9 px-5 rounded-xl text-[11px] font-bold", onClick: () => setSelected(rec), children: "\u6AA2\u8996\u8A73\u60C5" }) }
                            ], data: executions, searchable: true, searchPlaceholder: "\u641C\u5C0B\u8ABF\u5EA6\u4EFB\u52D9..." })), activeTab === 'swarm' && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-8 h-full", children: ['backlog', 'running', 'review', 'done'].map(lane => (_jsxs("div", { className: "bg-slate-50/30 rounded-[3rem] p-8 border border-slate-100/50 min-h-[600px] flex flex-col shadow-inner", children: [_jsxs("div", { className: "flex items-center justify-between mb-8 px-2", children: [_jsx("p", { className: "text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]", children: lane }), _jsx(Badge, { variant: "primary", className: "h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]", children: executions.filter(r => {
                                                    if (lane === 'backlog')
                                                        return !r.execution;
                                                    if (lane === 'running')
                                                        return r.execution?.status === 'running';
                                                    if (lane === 'review')
                                                        return r.artifact?.reviewStatus === 'awaiting_review';
                                                    return r.artifact?.reviewStatus === 'promoted';
                                                }).length })] }), _jsx("div", { className: "space-y-5 flex-1", children: executions.filter(r => {
                                            if (lane === 'backlog')
                                                return !r.execution;
                                            if (lane === 'running')
                                                return r.execution?.status === 'running';
                                            if (lane === 'review')
                                                return r.artifact?.reviewStatus === 'awaiting_review';
                                            return r.artifact?.reviewStatus === 'promoted';
                                        }).map(r => (_jsxs(motion.div, { layoutId: r.task.id, onClick: () => setSelected(r), className: "bg-white/60 backdrop-blur-md p-6 rounded-[2rem] shadow-glass border border-white/80 cursor-pointer hover:border-berkeley-blue/40 hover:shadow-lg transition-all group", children: [_jsxs("div", { className: "flex items-center justify-between mb-5", children: [_jsx("div", { style: { color: TASK_TYPE_META[r.task.taskType]?.color }, children: TASK_ICONS[r.task.taskType] }), _jsx(BrandStatusDot, { status: r.execution?.status === 'running' ? 'active' : 'inactive', pulse: r.execution?.status === 'running' })] }), _jsx("p", { className: "text-[13px] font-bold text-slate-800 line-clamp-2 leading-snug mb-5", children: r.task.title }), _jsxs("div", { className: "flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pt-4 border-t border-slate-100/50", children: [_jsxs("span", { className: "text-[10px] font-mono text-slate-300 font-bold uppercase", children: ["#", r.task.id.slice(-6)] }), _jsx(ChevronRight, { size: 14, className: "text-berkeley-blue" })] })] }, r.task.id))) })] }, lane))) }))] }))
            }
        ]
    };
    return (_jsxs("div", { className: "relative h-full", children: [_jsx(StandardPage, { config: pageConfig }), _jsx(AnimatePresence, { children: selected && (_jsx(Modal, { open: !!selected, onClose: () => setSelected(null), title: "\u4EFB\u52D9\u57F7\u884C\u8A73\u60C5", size: "xl", subtitle: `Task ID: ${selected.task.id}`, children: _jsxs("div", { className: "space-y-10 py-2", children: [_jsxs("div", { className: "p-10 bg-slate-50/50 rounded-[3rem] border border-slate-100 shadow-inner", children: [_jsx("p", { className: "text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5", children: "\u4EFB\u52D9\u80CC\u666F (Task Context)" }), _jsx("h3", { className: "text-2xl font-black text-berkeley-blue mb-4 tracking-tight", children: selected.task.title }), _jsx("p", { className: "text-[15px] text-slate-600 leading-relaxed font-medium", children: selected.task.description || '無詳細說明' })] }), selected.artifact ? (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-center justify-between px-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("p", { className: "text-[11px] font-black text-slate-400 uppercase tracking-widest", children: ["\u7522\u51FA\u8349\u7A3F (v", selected.artifact.version, ")"] }), _jsx("div", { className: "h-1 w-1 rounded-full bg-slate-300" }), _jsx("p", { className: "text-[10px] font-bold text-berkeley-blue/60 uppercase font-mono", children: selected.artifact.id })] }), _jsxs(Badge, { variant: "verified", className: "px-4 py-1.5 text-[11px]", children: ["AI CONFIDENCE: ", Math.round((selected.artifact.confidence || 0.92) * 100), "%"] })] }), _jsx("div", { className: "p-10 bg-white border border-slate-200 rounded-[3rem] text-[15px] text-slate-700 leading-relaxed font-medium font-mono max-h-[400px] overflow-y-auto shadow-inner scrollbar-hide", children: selected.artifact.content }), _jsxs("div", { className: "flex gap-4 pt-4", children: [_jsx(Button, { variant: "primary", className: "flex-1 h-14 rounded-2xl shadow-glass text-base tracking-widest", children: "\u6838\u51C6\u4E26\u57F7\u884C 5T \u5C01\u5370" }), _jsx(Button, { variant: "glass", className: "flex-1 h-14 rounded-2xl border-slate-200 text-slate-500 hover:text-error hover:border-error/20", children: "\u8981\u6C42\u4FEE\u6B63\u7D30\u7BC0" })] })] })) : (_jsxs(Button, { variant: "primary", className: "w-full h-16 rounded-[2rem] text-lg tracking-[0.2em] shadow-xl", onClick: () => handleExecute(selected), isLoading: loading, children: [_jsx(Play, { size: 24, className: "mr-4", fill: "currentColor" }), " \u555F\u52D5 OmniAgent AI \u57F7\u884C\u5E8F\u5217"] }))] }) })) }), _jsx(AnimatePresence, { children: toast && (_jsx(motion.div, { initial: { opacity: 0, y: 50, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 50, scale: 0.9 }, className: "fixed bottom-12 right-12 z-[10000]", children: _jsxs("div", { className: cn("px-8 py-5 rounded-[2rem] shadow-2xl text-white font-black text-sm flex items-center gap-5 border border-white/20 backdrop-blur-xl", toast.type === 'error' ? 'bg-error' : 'bg-berkeley-blue'), children: [toast.type === 'error' ? _jsx(XCircle, { size: 24 }) : _jsx(CheckCircle, { size: 24, className: "text-california-gold" }), _jsx("span", { className: "tracking-tight", children: toast.msg })] }) })) })] }));
}
//# sourceMappingURL=page.js.map