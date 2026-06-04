'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Terminal, Cpu, Zap, Shield, Globe, Layers, Video, Code, Database, Activity, ChevronRight, Download, MessageSquare, Gauge, Copy, CheckCircle, ArrowUpRight, PlayCircle, Activity as ActivityIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import StandardPage from '../../components/brand/StandardPage';
import { fadeIn } from '../../lib/animations';
const REPO_MODULES = [
    { path: 'omniagent-gateway', desc: 'Node.js 網關 v0.14.0 (支持 VPS 部署)', status: 'Hot' },
    { path: 'vps_adapter', desc: 'Ubuntu 24.04 本地化執行與自動化安裝', status: 'New' },
    { path: 'acp_adapter', desc: 'Zed 編輯器上下文協議適配器', status: 'New' },
    { path: 'agent', desc: 'Auxiliary 輔助客戶端與 Nous 認證', status: 'Stable' },
    { path: 'tools/video_gen', desc: '統一影片生成工具 (Pluggable)', status: 'Hot' },
    { path: 'tinker-atropos', desc: 'RL 強化學習訓練環境子模組', status: 'Research' },
];
const RELEASE_HISTORY = [
    { v: 'v0.14.1', date: 'Today', note: 'ESG Integration: 3 New Skills & Live VPS Fallback' },
    { v: 'v0.14.0', date: '2 days ago', note: 'ACP Registry for Zed & Video Gen' },
    { v: 'v0.13.0', date: 'last week', note: '8 New Locales & Gateway l10n' },
];
const QUICKSTART_STEPS = [
    {
        id: 1,
        title: '1. Install OmniAgent Agent',
        icon: _jsx(Terminal, { size: 18 }),
        color: '#009E9D', // ESG Teal
        description: 'Set up the core OmniAgent CLI and initialize your workspace.',
        command: 'npm install -g @nousresearch/omniagent\nomniagent setup'
    },
    {
        id: 2,
        title: '2. Initialize Google Genkit',
        icon: _jsx(Layers, { size: 18 }),
        color: '#003262', // Berkeley Blue
        description: 'Configure Google Genkit to manage LLM interactions (Gemini 1.5 Pro).',
        command: "import { genkit } from 'genkit';\nimport { googleAI } from '@genkit-ai/googleai';\n\nconst ai = genkit({ plugins: [googleAI()] });",
        isSnippet: true
    },
    {
        id: 3,
        title: '3. ADK Integration (ESG Experts)',
        icon: _jsx(Globe, { size: 18 }),
        color: '#8B5CF6', // ESG Purple
        description: "Register specialized ESG agents using Google's Agent Development Kit.",
        command: "import { createAgent } from '@google/adk';\n\nconst esgResearcher = createAgent({\n  name: 'ESG_Researcher_Agent',\n  role: 'Sustainability Data Analyst'\n});",
        isSnippet: true
    },
    {
        id: 4,
        title: '4. Activate Agent Zero',
        icon: _jsx(Cpu, { size: 18 }),
        color: '#FDB515', // California Gold
        description: 'Enable system-level execution and sub-agent spawning for autonomous ops.',
        command: 'docker run -it -v $(pwd):/workspace agent0ai/agent-zero\n# AgentZ0 will now monitor and execute autonomously.'
    }
];
export default function OmniAgentAgentPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [copied, setCopied] = useState(null);
    const handleCopy = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };
    const pageConfig = {
        id: 'omniagent-agent',
        title: 'OmniAgent Agent 系統 ☤',
        subtitle: '超越單純對話的自主代理：具備閉環學習、記憶固化與跨平台調度的 ESG 治理核心。',
        icon: _jsx(Bot, { size: 32, className: "text-berkeley-blue" }),
        griReference: 'Agent System / oX',
        activeT5Tags: ['T4', 'T5'],
        isOXModule: true,
        features: { useAuditLog: true },
        primaryActions: [
            { id: 'download', label: '下載離線套件', icon: _jsx(Download, { size: 16 }), onClick: () => alert('正在準備離線套件...') },
            { id: 'status', label: '系統狀態', icon: _jsx(Activity, { size: 16 }), variant: 'secondary', onClick: () => alert('Agent Runtime: Online') }
        ],
        kpis: [
            { key: 'uptime', label: 'Uptime', value: '99.98', unit: '%', icon: _jsx(Activity, { size: 18 }) },
            { key: 'latency', label: 'Latency', value: '142', unit: 'ms', icon: _jsx(Gauge, { size: 18 }) },
            { key: 'tps', label: 'Token/sec', value: '85', icon: _jsx(Zap, { size: 18 }), verified: true },
        ],
        sections: [
            {
                id: 'nav',
                title: '功能導覽',
                columns: 12,
                component: (_jsx(Tabs, { active: activeTab, onChange: (id) => setActiveTab(id), tabs: [
                        { key: 'overview', label: '總覽', icon: _jsx(Activity, { size: 14 }) },
                        { key: 'quickstart', label: '快速上手', icon: _jsx(Zap, { size: 14 }) },
                        { key: 'architecture', label: '系統架構', icon: _jsx(Layers, { size: 14 }) },
                        { key: 'tools', label: '工具箱', icon: _jsx(Terminal, { size: 14 }) },
                        { key: 'research', label: '技術研究', icon: _jsx(Database, { size: 14 }) },
                        { key: 'releases', label: '版本紀錄', icon: _jsx(Activity, { size: 14 }) },
                    ], variant: "pills" }))
            },
            {
                id: 'main-view',
                title: activeTab.toUpperCase(),
                columns: 12,
                component: (_jsxs("div", { className: "min-h-[500px]", children: [activeTab === 'overview' && (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in", children: [_jsxs("div", { className: "lg:col-span-8 space-y-8", children: [_jsxs(Card, { className: "p-8 bg-white/60 border-white/80 shadow-glass", children: [_jsxs("div", { className: "flex items-center gap-3 mb-8", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-berkeley-blue/5 text-berkeley-blue flex items-center justify-center", children: _jsx(ActivityIcon, { size: 20 }) }), _jsx("h4", { className: "text-sm font-black text-berkeley-blue uppercase tracking-tight", children: "\u6838\u5FC3\u80FD\u529B (Core Pillars)" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                                                        { icon: _jsx(ActivityIcon, { size: 24 }), t: '閉環學習', d: '透過經驗創造 Skill，並在任務中持續自我優化。' },
                                                        { icon: _jsx(Database, { size: 24 }), t: '方言記憶', d: '具備 FTS5 歷史對話搜尋與 LLM 長期記憶摘要。' },
                                                        { icon: _jsx(Globe, { size: 24 }), t: '20+ 平台閘道', d: '一個進程同時驅動 Telegram, Discord, Slack 等。' },
                                                        { icon: _jsx(Layers, { size: 24 }), t: '七大後端', d: '支持 Docker, SSH, Singularity, Modal 與 Daytona。' },
                                                    ].map(item => (_jsxs("div", { className: "p-6 rounded-2xl border border-slate-100 bg-slate-50/30 hover:border-berkeley-blue/30 transition-all group shadow-sm hover:shadow-md", children: [_jsx("div", { className: "text-berkeley-blue mb-4 group-hover:scale-110 transition-transform", children: item.icon }), _jsx("div", { className: "font-black text-slate-800 text-sm mb-2", children: item.t }), _jsx("div", { className: "text-xs text-slate-500 leading-relaxed font-medium", children: item.d })] }, item.t))) })] }), _jsxs(Card, { className: "p-8 bg-berkeley-blue/5 border-berkeley-blue/10 shadow-sm relative overflow-hidden", children: [_jsxs("div", { className: "flex items-start gap-6 relative z-10", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-berkeley-blue text-california-gold flex items-center justify-center shadow-lg", children: _jsx(Zap, { size: 32, fill: "currentColor" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-black text-berkeley-blue mb-2 uppercase tracking-tight", children: "\u65B0\u7279\u6027: ACP ADAPTER" }), _jsx("p", { className: "text-sm text-slate-600 leading-relaxed font-medium", children: "v0.14.0 \u5F15\u5165\u4E86 Zed \u7DE8\u8F2F\u5668\u7684 ACP \u8A3B\u518A\u5143\u6578\u64DA\uFF0C\u8B93 OmniAgent \u80FD\u76F4\u63A5\u4F5C\u70BA Zed \u7684 AI \u5F8C\u7AEF\uFF0C\u5BE6\u6642\u540C\u6B65\u4EE3\u78BC\u4E0A\u4E0B\u6587\uFF0C\u5BE6\u73FE 5T \u7B49\u7D1A\u7684\u5354\u540C\u958B\u767C\u3002" }), _jsxs(Button, { variant: "glass", size: "sm", className: "mt-5 px-6 rounded-xl text-berkeley-blue font-black border-berkeley-blue/20", children: ["\u67E5\u770B\u958B\u767C\u6587\u6A94 ", _jsx(ArrowUpRight, { size: 16, className: "ml-2" })] })] })] }), _jsx(Bot, { size: 140, className: "absolute -bottom-10 -right-10 text-berkeley-blue/5 rotate-12" })] })] }), _jsxs("div", { className: "lg:col-span-4 space-y-8", children: [_jsxs(Card, { className: "p-8 bg-slate-900 rounded-[3rem] text-white shadow-xl relative overflow-hidden", children: [_jsxs("div", { className: "relative z-10 space-y-6", children: [_jsx("h4", { className: "text-xs font-black uppercase tracking-[0.2em] text-blue-300", children: "\u5FEB\u901F\u90E8\u7F72 (Quick Deploy)" }), _jsxs("div", { className: "p-4 bg-black/40 rounded-2xl font-mono text-[11px] text-emerald-400 border border-white/5 relative group shadow-inner", children: [_jsx("code", { children: "curl -fsSL https://omniagent.ai/install.sh | bash" }), _jsx("button", { className: "absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-white", children: _jsx(Copy, { size: 14 }) })] }), _jsxs("p", { className: "text-[10px] text-blue-100/50 leading-relaxed font-medium", children: ["* \u652F\u6301 Ubuntu, macOS \u8207 WSL2 \u74B0\u5883\u3002", _jsx("br", {}), "* \u81EA\u52D5\u5B89\u88DD Node.js 22, Python 3.11 \u8207\u6240\u9700\u5DE5\u5177\u3002"] }), _jsxs(Button, { variant: "primary", className: "w-full h-12 bg-blue-600 hover:bg-blue-500 border-none shadow-lg rounded-xl font-black", children: [_jsx(Download, { size: 18, className: "mr-3" }), " \u4E0B\u8F09\u96E2\u7DDA\u5957\u4EF6"] })] }), _jsx(Terminal, { size: 120, className: "absolute -bottom-10 -right-10 text-white/5" })] }), _jsxs(Card, { className: "p-8 bg-white/60 border-white/80 shadow-glass", children: [_jsx("h4", { className: "text-xs font-black uppercase tracking-[0.2em] text-berkeley-blue mb-6", children: "\u5BE6\u6642\u6307\u6A19" }), _jsx("div", { className: "space-y-5", children: [
                                                        { label: 'Uptime', value: '99.98%', icon: _jsx(ActivityIcon, { size: 14 }) },
                                                        { label: 'Latency', value: '142ms', icon: _jsx(Gauge, { size: 14 }) },
                                                        { label: 'Token/sec', value: '85', icon: _jsx(Zap, { size: 14 }) },
                                                    ].map(stat => (_jsxs("div", { className: "flex justify-between items-center border-b border-slate-50 pb-4 last:border-0", children: [_jsxs("div", { className: "flex items-center gap-3 text-xs text-slate-500 font-bold uppercase tracking-wider", children: [_jsx("span", { className: "text-berkeley-blue/40", children: stat.icon }), " ", stat.label] }), _jsx("span", { className: "text-sm font-mono font-black text-berkeley-blue", children: stat.value })] }, stat.label))) })] })] })] })), activeTab === 'quickstart' && (_jsx("div", { className: "max-w-5xl mx-auto animate-in fade-in", children: _jsxs(Card, { className: "p-10 bg-white/60 border-white/80 shadow-glass", children: [_jsxs("div", { className: "mb-10 text-center", children: [_jsx("h3", { className: "text-2xl font-black text-berkeley-blue mb-2 tracking-tight", children: "OmniAgent Agent + ESG GO Quickstart" }), _jsx("p", { className: "text-sm text-slate-500 font-medium", children: "\u5F9E\u96F6\u958B\u59CB\u69CB\u5EFA\u60A8\u7684 5T \u8AA0\u4FE1\u4EE3\u7406\u8702\u7FA4" })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-12", children: [_jsx("div", { className: "w-full md:w-64 flex-shrink-0", children: _jsxs("div", { className: "sticky top-6", children: [_jsx("h4", { className: "text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8", children: "Installation Steps" }), _jsx("div", { className: "space-y-10", children: QUICKSTART_STEPS.map((step, idx) => (_jsxs("div", { className: "flex gap-5 group cursor-pointer", onClick: () => document.getElementById(`step-${step.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: "w-10 h-10 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg transition-all group-hover:scale-110", style: { backgroundColor: step.color }, children: step.icon }), idx < QUICKSTART_STEPS.length - 1 && (_jsx("div", { className: "w-0.5 h-12 bg-slate-100 mt-2" }))] }), _jsx("div", { className: "pt-2", children: _jsx("p", { className: "text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-berkeley-blue transition-colors", children: step.title.split('. ')[1] }) })] }, step.id))) })] }) }), _jsx("div", { className: "flex-1 space-y-16", children: QUICKSTART_STEPS.map((step) => (_jsxs("div", { id: `step-${step.id}`, className: "scroll-mt-24", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsxs(Badge, { style: { backgroundColor: step.color }, className: "text-white border-none px-3 py-1 text-[10px]", children: ["STEP ", step.id] }), _jsx("h3", { className: "text-xl font-black text-berkeley-blue tracking-tight", children: step.title.split('. ')[1] })] }), _jsx("p", { className: "text-sm text-slate-500 font-medium leading-relaxed", children: step.description })] }), _jsxs("div", { className: "relative group/code", children: [_jsx("pre", { className: "p-6 bg-slate-900 rounded-[2rem] border border-slate-800 font-mono text-sm overflow-x-auto text-blue-50 leading-relaxed shadow-xl", children: step.isSnippet ? (_jsx("code", { children: step.command.split('\n').map((line, i) => {
                                                                            if (line.startsWith('import') || line.startsWith('const')) {
                                                                                const parts = line.split(' ');
                                                                                return (_jsxs("span", { children: [_jsx("span", { className: "text-blue-400", children: parts[0] }), " ", parts.slice(1).join(' '), '\n'] }, i));
                                                                            }
                                                                            return _jsx("span", { className: "text-slate-300", children: line + '\n' }, i);
                                                                        }) })) : (_jsx("code", { children: step.command.split('\n').map((line, i) => (_jsxs("span", { children: [line.startsWith('#') ? _jsx("span", { className: "text-emerald-500/60 italic", children: line }) : _jsx("span", { className: "text-emerald-400 font-bold", children: line }), '\n'] }, i))) })) }), _jsx("button", { onClick: () => handleCopy(step.id, step.command), className: "absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white/40 hover:text-white transition-all opacity-0 group-hover/code:opacity-100", children: copied === step.id ? _jsx(CheckCircle, { size: 16, className: "text-verified" }) : _jsx(Copy, { size: 16 }) })] }), _jsx("div", { className: "mt-6 flex gap-4", children: !step.isSnippet && (_jsxs(Button, { variant: "glass", size: "sm", className: "h-10 px-5 rounded-xl text-berkeley-blue font-black border-berkeley-blue/20", onClick: () => alert(`執行指令: ${step.command.split('\n')[0]}`), children: [_jsx(PlayCircle, { size: 16, className: "mr-2" }), " \u57F7\u884C\u6307\u4EE4 (Execute)"] })) })] }, step.id))) })] }), _jsxs("div", { className: "mt-16 p-10 bg-berkeley-blue rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl", children: [_jsxs("div", { className: "flex items-center gap-6 relative z-10", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-california-gold shadow-inner border border-white/10", children: _jsx(PlayCircle, { size: 32, fill: "currentColor" }) }), _jsxs("div", { children: [_jsx("h5", { className: "font-black text-lg uppercase tracking-tight", children: "\u6E96\u5099\u597D\u9032\u884C\u5BE6\u6E2C\u4E86\u55CE\uFF1F" }), _jsx("p", { className: "text-sm text-blue-100/70 font-medium", children: "\u9032\u5165\u8ABF\u5EA6\u4E2D\u5FC3\u555F\u52D5\u60A8\u7684\u7B2C\u4E00\u500B 5T \u4EFB\u52D9" })] })] }), _jsxs(Button, { variant: "glass", className: "w-full md:w-auto px-10 h-14 rounded-2xl border-white/20 text-white hover:bg-white/10 font-black relative z-10", onClick: () => window.location.href = '/omniagent-orchestrator', children: ["\u524D\u5F80\u8ABF\u5EA6\u4E2D\u5FC3 ", _jsx(ChevronRight, { size: 20, className: "ml-2" })] }), _jsx(ActivityIcon, { size: 200, className: "absolute -bottom-20 -right-20 text-white/5" })] })] }) })), activeTab === 'architecture' && (_jsxs("div", { className: "space-y-8 animate-in fade-in", children: [_jsx(DataTable, { columns: [
                                        { key: 'path', header: '模組路徑', render: (v) => _jsx("code", { className: "font-black text-berkeley-blue", children: v }) },
                                        { key: 'desc', header: '功能定義' },
                                        { key: 'status', header: '當前狀態', render: (v) => (_jsx(Badge, { variant: v === 'Hot' ? 'error' : v === 'New' ? 'warning' : v === 'Research' ? 'primary' : 'verified', className: "px-3 py-1 font-black tracking-widest uppercase text-[9px]", children: v })) }
                                    ], data: REPO_MODULES }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs(Card, { className: "p-8 bg-white/60 border-white/80 shadow-glass", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-berkeley-blue/5 text-berkeley-blue flex items-center justify-center", children: _jsx(Gauge, { size: 20 }) }), _jsx("h4", { className: "text-sm font-black text-berkeley-blue uppercase tracking-tight", children: "\u7CFB\u7D71\u6D41\u8F49\u5C64 (Runtime)" })] }), _jsx("p", { className: "text-[13px] text-slate-500 leading-relaxed font-medium", children: "\u5E95\u5C64\u57FA\u65BC Node.js 22 \u8207 Python 3.11 \u6DF7\u5408\u67B6\u69CB\uFF0C\u78BA\u4FDD\u4E86\u9AD8\u6548\u7684 I/O \u8655\u7406\u8207\u5F37\u5927\u7684\u6578\u64DA\u904B\u7B97\u80FD\u529B\u3002 \u6240\u6709\u57F7\u884C\u5747\u5728\u53D7\u63A7\u7684 Sandbox \u4E2D\u9032\u884C\uFF0C\u652F\u63F4 5T \u5B8C\u6574\u6027\u7C3D\u7AE0\u3002" })] }), _jsxs(Card, { className: "p-8 bg-white/60 border-white/80 shadow-glass", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-berkeley-blue/5 text-berkeley-blue flex items-center justify-center", children: _jsx(Shield, { size: 20 }) }), _jsx("h4", { className: "text-sm font-black text-berkeley-blue uppercase tracking-tight", children: "\u8A8D\u8B49\u8207\u5B89\u5168" })] }), _jsx("p", { className: "text-[13px] text-slate-500 leading-relaxed font-medium", children: "\u6574\u5408 Nous Research \u8A8D\u8B49\u9AD4\u7CFB\uFF0C\u6BCF\u4E00\u7B46\u6307\u4EE4\u5747\u9644\u5E36 Actor ID \u8207 Policy Guard \u6C7A\u7B56\u96DC\u6E4A\uFF0C \u7B26\u5408 Berkeley Academy \u6700\u56B4\u82DB\u7684\u6CBB\u7406\u6A19\u6E96\u8207 oX \u5B89\u5168\u5354\u8B70\u3002" })] })] })] })), activeTab === 'tools' && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in", children: [_jsxs(Card, { hoverEffect: true, className: "p-8 bg-white/60 border-white/80 shadow-glass group", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500", children: _jsx(Video, { size: 32 }) }), _jsx("h4", { className: "text-lg font-black text-slate-800 mb-3 tracking-tight", children: "video_generate" }), _jsx("p", { className: "text-[13px] text-slate-500 leading-relaxed font-medium", children: "v0.14.0 \u7D71\u4E00\u4E86\u5F71\u7247\u751F\u6210\u63A5\u53E3\uFF0C\u652F\u6301\u591A\u4F9B\u61C9\u5546\u63D2\u4EF6\uFF08\u5982 Luma, Kling\uFF09\uFF0C\u652F\u63F4 ESG \u8996\u89BA\u5316\u7C21\u5831\u751F\u6210\u3002" })] }), _jsxs(Card, { hoverEffect: true, className: "p-8 bg-white/60 border-white/80 shadow-glass group", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500", children: _jsx(Code, { size: 32 }) }), _jsx("h4", { className: "text-lg font-black text-slate-800 mb-3 tracking-tight", children: "agent-browser v0.26" }), _jsx("p", { className: "text-[13px] text-slate-500 leading-relaxed font-medium", children: "\u5F37\u5316\u4E86\u700F\u89BD\u5668\u81EA\u52D5\u5316\u80FD\u529B\uFF0C\u652F\u6301\u9577\u671F\u7A7A\u9592\u5B88\u8B77\u9032\u7A0B\uFF0C\u63D0\u5347\u7DB2\u8DEF\u6578\u64DA\u6293\u53D6\u8207 GRI \u6A19\u7AFF\u6BD4\u5C0D\u6548\u7387\u3002" })] }), _jsxs(Card, { hoverEffect: true, className: "p-8 bg-white/60 border-white/80 shadow-glass group", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500", children: _jsx(Shield, { size: 32 }) }), _jsx("h4", { className: "text-lg font-black text-slate-800 mb-3 tracking-tight", children: "Secure Sandbox" }), _jsx("p", { className: "text-[13px] text-slate-500 leading-relaxed font-medium", children: "\u786C\u5316\u5BB9\u5668\u9694\u96E2\u6280\u8853\uFF0C\u652F\u6301\u552F\u8B80\u6839\u6587\u4EF6\u7CFB\u7D71\u8207\u547D\u540D\u7A7A\u9593\u9694\u96E2\uFF0C\u78BA\u4FDD 5T \u6578\u64DA\u8655\u7406\u904E\u7A0B\u4E0D\u88AB\u5916\u90E8\u6C61\u67D3\u3002" })] })] })), activeTab === 'releases' && (_jsx("div", { className: "animate-in fade-in", children: _jsx(DataTable, { columns: [
                                    { key: 'v', header: '版本', render: (v) => _jsx("span", { className: "font-black text-berkeley-blue", children: v }) },
                                    { key: 'date', header: '更新時間', render: (v) => _jsx("span", { className: "text-slate-400 font-bold text-xs uppercase", children: v }) },
                                    { key: 'note', header: '主要變動', render: (v) => _jsx(Badge, { variant: "verified", className: "px-3 py-1 font-medium", children: v }) }
                                ], data: RELEASE_HISTORY }) }))] }))
            }
        ]
    };
    return (_jsxs("div", { className: "relative h-full", children: [_jsx(StandardPage, { config: pageConfig }), _jsxs(motion.div, { variants: fadeIn, initial: "initial", animate: "animate", className: "mt-12 p-8 bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2.5rem] shadow-glass flex flex-col md:flex-row items-center justify-between gap-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-berkeley-blue/5 text-berkeley-blue flex items-center justify-center", children: _jsx(Bot, { size: 24 }) }), _jsx("span", { className: "text-[11px] font-black text-berkeley-blue uppercase tracking-[0.3em] font-mono", children: "OMNIAGENT-AGENT SYSTEM v0.14.1" })] }), _jsxs("div", { className: "flex gap-8", children: [_jsxs("a", { href: "https://omniagent-agent.nousresearch.com/docs/", target: "_blank", rel: "noreferrer", className: "text-[11px] text-slate-400 font-black hover:text-berkeley-blue flex items-center gap-2 transition-all uppercase tracking-widest", children: [_jsx(Terminal, { size: 14 }), " DOCUMENTATION"] }), _jsxs("a", { href: "https://discord.gg/NousResearch", target: "_blank", rel: "noreferrer", className: "text-[11px] text-slate-400 font-black hover:text-berkeley-blue flex items-center gap-2 transition-all uppercase tracking-widest", children: [_jsx(MessageSquare, { size: 14 }), " DISCORD"] })] })] })] }));
}
//# sourceMappingURL=page.js.map