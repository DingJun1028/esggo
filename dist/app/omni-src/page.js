'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FileText, Zap, BarChart3, CheckCircle, AlertTriangle, Download, RefreshCw, BookOpen, Shield, Leaf, Users, TrendingUp, Search, Eye, Globe, Award, Target, Calendar, ChevronDown, ChevronUp, Layers, Activity } from 'lucide-react';
const GRI_CHAPTERS = [
    { id: 1, code: 'GRI 2', title: '一般揭露', pages: 45, status: 'ready', coverage: 92 },
    { id: 2, code: 'GRI 3', title: '重大主題', pages: 28, status: 'ready', coverage: 88 },
    { id: 3, code: 'GRI 201', title: '經濟績效', pages: 32, status: 'ready', coverage: 85 },
    { id: 4, code: 'GRI 202', title: '市場地位', pages: 18, status: 'in_progress', coverage: 72 },
    { id: 5, code: 'GRI 203', title: '間接經濟衝擊', pages: 22, status: 'ready', coverage: 90 },
    { id: 6, code: 'GRI 301', title: '原物料', pages: 25, status: 'ready', coverage: 87 },
    { id: 7, code: 'GRI 302', title: '能源', pages: 38, status: 'ready', coverage: 95 },
    { id: 8, code: 'GRI 303', title: '水資源', pages: 30, status: 'ready', coverage: 83 },
    { id: 9, code: 'GRI 304', title: '生物多樣性', pages: 20, status: 'in_progress', coverage: 65 },
    { id: 10, code: 'GRI 305', title: '排放', pages: 42, status: 'ready', coverage: 96 },
    { id: 11, code: 'GRI 306', title: '廢棄物', pages: 28, status: 'ready', coverage: 89 },
    { id: 12, code: 'GRI 401', title: '就業', pages: 35, status: 'ready', coverage: 91 },
    { id: 13, code: 'GRI 403', title: '職業安全衛生', pages: 40, status: 'ready', coverage: 94 },
    { id: 14, code: 'GRI 404', title: '訓練與教育', pages: 25, status: 'in_progress', coverage: 78 },
    { id: 15, code: 'GRI 405', title: '多元化與平等機會', pages: 22, status: 'ready', coverage: 86 },
    { id: 16, code: 'GRI 413', title: '當地社區', pages: 20, status: 'in_progress', coverage: 70 },
    { id: 17, code: 'GRI 418', title: '客戶隱私', pages: 18, status: 'ready', coverage: 82 },
];
const FRAMEWORKS = [
    { id: 'gri', name: 'GRI 2021', color: '#003262', icon: Globe, coverage: 94, indicators: 97 },
    { id: 'sasb', name: 'SASB 2.0', color: '#3b7ea1', icon: BarChart3, coverage: 78, indicators: 45 },
    { id: 'tcfd', name: 'TCFD', color: '#b9d9eb', icon: TrendingUp, coverage: 85, indicators: 11 },
    { id: 'ifrs_s1', name: 'IFRS S1', color: '#FDB515', icon: Shield, coverage: 72, indicators: 24 },
    { id: 'ifrs_s2', name: 'IFRS S2', color: '#00a651', icon: Leaf, coverage: 68, indicators: 32 },
    { id: 'sdg', name: 'SDGs', color: '#e74c3c', icon: Target, coverage: 81, indicators: 17 },
];
const COMPLIANCE_SCHEDULE = [
    { stage: 1, title: '資料盤點期', deadline: '2025-09-30', status: 'completed', desc: '完成 97 項 ESG 指標資料收集' },
    { stage: 2, title: '初稿撰寫期', deadline: '2025-11-15', status: 'completed', desc: '完成各章節內容初稿' },
    { stage: 3, title: '內部審查期', deadline: '2025-12-31', status: 'current', desc: '董事會及各部門審閱確認' },
    { stage: 4, title: '第三方確信', deadline: '2026-02-28', status: 'pending', desc: 'KPMG/PWC 等機構查證' },
    { stage: 5, title: '主管機關申報', deadline: '2026-04-30', status: 'pending', desc: '依金管會規定正式申報' },
    { stage: 6, title: '公開揭露', deadline: '2026-05-31', status: 'pending', desc: '官網及公開平台發布' },
];
const DEFECTS = [
    { id: 1, type: 'critical', title: 'GRI 305-1 範疇一排放計算基礎年未說明', gri: 'GRI 305-1', risk: '高', status: 'open' },
    { id: 2, type: 'critical', title: 'TCFD 情境分析缺乏 1.5°C 路徑評估', gri: 'TCFD', risk: '高', status: 'open' },
    { id: 3, type: 'warning', title: 'GRI 2-7 員工分類方法未與國際標準對齊', gri: 'GRI 2-7', risk: '中', status: 'fixing' },
    { id: 4, type: 'warning', title: 'GRI 403 職業安全疾病率定義不一致', gri: 'GRI 403-2', risk: '中', status: 'fixing' },
    { id: 5, type: 'info', title: 'GRI 204 供應商本地採購比例定義需細化', gri: 'GRI 204-1', risk: '低', status: 'review' },
    { id: 6, type: 'info', title: 'SASB 員工薪酬中位數未揭露', gri: 'SASB HC-101', risk: '低', status: 'review' },
    { id: 7, type: 'info', title: 'SDG 貢獻說明缺乏量化指標連結', gri: 'SDGs', risk: '低', status: 'pending' },
];
const BENCHMARKS = [
    { company: '台積電 TSMC', score: 98, rank: 1, highlight: 'GRI 完整度、氣候目標設定最佳實踐' },
    { company: '台達電', score: 96, rank: 2, highlight: '供應鏈管理、碳排抵銷策略標竿' },
    { company: '富邦金控', score: 94, rank: 3, highlight: '社會責任投資、利害關係人溝通標竿' },
    { company: '中鋼', score: 91, rank: 4, highlight: '環境管理體系、ISO 14064 最佳實踐' },
    { company: '您的企業', score: 78, rank: null, highlight: '對標分析中 — 缺口集中於 E 類指標', isSelf: true },
];
const AI_TOOLS = [
    { id: 'benchmark', icon: BarChart3, title: '標竿分析', desc: '與產業前 5 大標竿企業對比', color: '#003262' },
    { id: 'narrative', icon: FileText, title: '智能敘事生成', desc: 'SPIRIT Persona 三視角 AI 織稿', color: '#3b7ea1' },
    { id: 'validation', icon: Shield, title: '數據合成驗證', desc: 'ZKP 零幻覺跨表格數據核驗', color: '#22c55e' },
    { id: 'compliance', icon: CheckCircle, title: '多準則合規檢查', desc: '6 大框架 97 指標自動比對', color: '#FDB515' },
    { id: 'assembly', icon: Layers, title: '報告組裝引擎', desc: 'A4 版面自動排版 1000+ 頁', color: '#8b5cf6' },
];
export default function OmniSRCPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [selectedChapters, setSelectedChapters] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [defectFilter, setDefectFilter] = useState('all');
    const [expandedDefect, setExpandedDefect] = useState(null);
    const [generationLog, setGenerationLog] = useState([]);
    const [activeFramework, setActiveFramework] = useState('gri');
    const totalPages = GRI_CHAPTERS.reduce((s, c) => s + c.pages, 0);
    const avgCoverage = Math.round(GRI_CHAPTERS.reduce((s, c) => s + c.coverage, 0) / GRI_CHAPTERS.length);
    const readyChapters = GRI_CHAPTERS.filter(c => c.status === 'ready').length;
    const startGeneration = () => {
        setGenerating(true);
        setProgress(0);
        setGenerationLog([]);
        const logs = [
            '⚡ 啟動萬能報告中心 (Omni-SRC)...',
            '📊 載入 97 項 ESG 指標定義庫...',
            '🔍 執行標竿分析 — 對標台積電、台達電...',
            '🤖 SPIRIT AI 織稿引擎啟動 (合規守衛模式)...',
            '✍️ 生成 GRI 2 一般揭露章節 (45頁)...',
            '✍️ 生成 GRI 305 排放章節 (42頁)...',
            '✍️ 生成 GRI 403 職安衛章節 (40頁)...',
            '🛡️ ZKP 數據合成驗證中...',
            '📐 A4 版面自動排版引擎啟動...',
            '🔏 5T Hash Lock 封印中...',
            '✅ 報告生成完成！共 1,247 頁',
        ];
        let i = 0;
        const interval = setInterval(() => {
            if (i < logs.length) {
                setGenerationLog(prev => [...prev, logs[i]]);
                setProgress(Math.round(((i + 1) / logs.length) * 100));
                i++;
            }
            else {
                clearInterval(interval);
                setGenerating(false);
            }
        }, 600);
    };
    const toggleChapter = (id) => {
        setSelectedChapters(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    };
    const filteredDefects = DEFECTS.filter(d => {
        if (defectFilter !== 'all' && d.type !== defectFilter)
            return false;
        if (searchQuery && !d.title.toLowerCase().includes(searchQuery.toLowerCase()))
            return false;
        return true;
    });
    const defectColors = {
        critical: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
    };
    const tabs = [
        { id: 'overview', label: '報告總覽', icon: Activity },
        { id: 'chapters', label: '章節管理', icon: BookOpen },
        { id: 'compliance', label: '合規時程', icon: Calendar },
        { id: 'defects', label: '缺失偵測', icon: AlertTriangle },
        { id: 'benchmark', label: '標竿分析', icon: Award },
        { id: 'generate', label: 'AI 生成', icon: Zap },
    ];
    return (_jsxs("div", { className: "page-container", children: [_jsxs("div", { style: {
                    background: 'linear-gradient(135deg, #003262 0%, #1a4f8a 60%, #3b7ea1 100%)',
                    borderRadius: '16px',
                    padding: '32px',
                    marginBottom: '24px',
                    color: '#fff',
                    position: 'relative',
                    overflow: 'hidden',
                }, children: [_jsx("div", { style: {
                            position: 'absolute', top: 0, right: 0, width: '300px', height: '100%',
                            background: 'radial-gradient(ellipse at right, rgba(253,181,21,0.15) 0%, transparent 70%)',
                            pointerEvents: 'none',
                        } }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }, children: [_jsx("div", { style: {
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    background: 'rgba(253,181,21,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }, children: _jsx(FileText, { size: 24, color: "#FDB515" }) }), _jsxs("div", { children: [_jsx("h1", { style: { fontSize: '24px', fontWeight: 700, margin: 0 }, children: "\u842C\u80FD\u5831\u544A\u4E2D\u5FC3 Omni-SRC" }), _jsx("p", { style: { fontSize: '14px', opacity: 0.8, margin: 0 }, children: "AI \u7E54\u7A3F \u00B7 1000+ \u9801\u570B\u969B\u7D1A\u6C38\u7E8C\u5831\u544A\u66F8 \u00B7 2 \u5C0F\u6642\u5B8C\u6210" })] })] }), _jsx("div", { style: { display: 'flex', gap: '24px', flexWrap: 'wrap' }, children: [
                            { label: '報告頁數', value: `${totalPages}+`, sub: '預計頁數' },
                            { label: '平均覆蓋率', value: `${avgCoverage}%`, sub: 'GRI 覆蓋率' },
                            { label: '就緒章節', value: `${readyChapters}/${GRI_CHAPTERS.length}`, sub: '可生成章節' },
                            { label: 'AI 速度', value: '< 2h', sub: '完整報告生成' },
                        ].map(stat => (_jsxs("div", { style: {
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '10px', padding: '12px 20px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                minWidth: '120px',
                            }, children: [_jsx("div", { style: { fontSize: '22px', fontWeight: 700, color: '#FDB515' }, children: stat.value }), _jsx("div", { style: { fontSize: '11px', opacity: 0.7 }, children: stat.sub })] }, stat.label))) })] }), _jsx("div", { style: {
                    display: 'flex', gap: '4px', marginBottom: '24px',
                    background: 'var(--bg-secondary)', borderRadius: '12px', padding: '6px',
                    overflowX: 'auto',
                }, children: tabs.map(tab => {
                    const Icon = tab.icon;
                    return (_jsxs("button", { onClick: () => setActiveTab(tab.id), style: {
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap',
                            background: activeTab === tab.id ? '#003262' : 'transparent',
                            color: activeTab === tab.id ? '#FDB515' : 'var(--text-secondary)',
                            transition: 'all 0.2s',
                        }, children: [_jsx(Icon, { size: 15 }), tab.label] }, tab.id));
                }) }), activeTab === 'overview' && (_jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }, children: [_jsx("div", { style: { gridColumn: '1 / -1' }, children: _jsxs("div", { className: "card", children: [_jsx("h3", { style: { fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', fontSize: '15px' }, children: "\u516D\u5927\u6846\u67B6\u5408\u898F\u8986\u84CB\u7387" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }, children: FRAMEWORKS.map(fw => {
                                        const Icon = fw.icon;
                                        return (_jsxs("div", { onClick: () => setActiveFramework(fw.id), style: {
                                                padding: '16px', borderRadius: '12px', cursor: 'pointer',
                                                border: `2px solid ${activeFramework === fw.id ? fw.color : 'var(--border-color)'}`,
                                                background: activeFramework === fw.id ? `${fw.color}10` : 'var(--bg-secondary)',
                                                transition: 'all 0.2s',
                                            }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }, children: [_jsx(Icon, { size: 16, color: fw.color }), _jsx("span", { style: { fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }, children: fw.name })] }), _jsxs("div", { style: { fontSize: '24px', fontWeight: 700, color: fw.color }, children: [fw.coverage, "%"] }), _jsx("div", { style: { height: '4px', background: 'var(--border-color)', borderRadius: '2px', marginTop: '8px' }, children: _jsx("div", { style: { height: '100%', width: `${fw.coverage}%`, background: fw.color, borderRadius: '2px', transition: 'width 0.6s' } }) }), _jsxs("div", { style: { fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }, children: [fw.indicators, " \u9805\u6307\u6A19"] })] }, fw.id));
                                    }) })] }) }), _jsxs("div", { className: "card", children: [_jsx("h3", { style: { fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', fontSize: '15px' }, children: "\u4E94\u5927 AI \u5DE5\u5177\u7BB1" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '10px' }, children: AI_TOOLS.map(tool => {
                                    const Icon = tool.icon;
                                    return (_jsxs("div", { style: {
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            padding: '12px', borderRadius: '10px', background: 'var(--bg-secondary)',
                                            border: '1px solid var(--border-color)',
                                        }, children: [_jsx("div", { style: {
                                                    width: '36px', height: '36px', borderRadius: '8px',
                                                    background: `${tool.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0,
                                                }, children: _jsx(Icon, { size: 16, color: tool.color }) }), _jsxs("div", { children: [_jsx("div", { style: { fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }, children: tool.title }), _jsx("div", { style: { fontSize: '11px', color: 'var(--text-secondary)' }, children: tool.desc })] })] }, tool.id));
                                }) })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { style: { fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', fontSize: '15px' }, children: "\u5831\u544A\u66F8\u7D50\u69CB\u9810\u89BD" }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: [[
                                        { section: '扉頁 & 目錄', pages: 8, color: '#003262' },
                                        { section: '公司概述', pages: 24, color: '#3b7ea1' },
                                        { section: '治理架構 (GRI 2)', pages: 45, color: '#003262' },
                                        { section: '環境績效 (E)', pages: 185, color: '#22c55e' },
                                        { section: '社會影響 (S)', pages: 165, color: '#f59e0b' },
                                        { section: '公司治理 (G)', pages: 98, color: '#8b5cf6' },
                                        { section: '附錄 & 索引', pages: 42, color: '#6b7280' },
                                    ].map(item => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '10px' }, children: [_jsx("div", { style: { width: '10px', height: '10px', borderRadius: '50%', background: item.color, flexShrink: 0 } }), _jsx("div", { style: { flex: 1, fontSize: '12px', color: 'var(--text-primary)' }, children: item.section }), _jsxs("div", { style: { fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }, children: [item.pages, "\u9801"] }), _jsx("div", { style: {
                                                    width: '60px', height: '4px', background: 'var(--border-color)', borderRadius: '2px',
                                                }, children: _jsx("div", { style: { height: '100%', width: `${Math.min(100, (item.pages / 200) * 100)}%`, background: item.color, borderRadius: '2px' } }) })] }, item.section))), _jsxs("div", { style: {
                                            marginTop: '8px', padding: '10px', background: '#003262', borderRadius: '8px',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        }, children: [_jsx("span", { style: { color: '#fff', fontWeight: 600, fontSize: '13px' }, children: "\u5408\u8A08\u9801\u6578" }), _jsx("span", { style: { color: '#FDB515', fontWeight: 700, fontSize: '16px' }, children: "567+ \u9801" })] })] })] })] })), activeTab === 'chapters' && (_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }, children: [_jsxs("div", { style: { position: 'relative' }, children: [_jsx(Search, { size: 14, style: { position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' } }), _jsx("input", { placeholder: "\u641C\u5C0B\u7AE0\u7BC0...", value: searchQuery, onChange: e => setSearchQuery(e.target.value), style: {
                                            padding: '8px 12px 8px 32px', borderRadius: '8px',
                                            border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                                            fontSize: '13px', color: 'var(--text-primary)', width: '220px',
                                        } })] }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx("button", { onClick: () => setSelectedChapters(GRI_CHAPTERS.map(c => c.id)), style: {
                                            padding: '8px 16px', borderRadius: '8px', border: '1px solid #003262',
                                            background: 'transparent', color: '#003262', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                                        }, children: "\u5168\u9078" }), _jsx("button", { onClick: () => setSelectedChapters([]), style: {
                                            padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)',
                                            background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px',
                                        }, children: "\u6E05\u9664" })] })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }, children: GRI_CHAPTERS.filter(c => !searchQuery || c.title.includes(searchQuery) || c.code.includes(searchQuery)).map(chapter => (_jsxs("div", { onClick: () => toggleChapter(chapter.id), style: {
                                padding: '16px', borderRadius: '12px', cursor: 'pointer',
                                border: `2px solid ${selectedChapters.includes(chapter.id) ? '#003262' : 'var(--border-color)'}`,
                                background: selectedChapters.includes(chapter.id) ? '#003262' + '08' : 'var(--bg-card)',
                                transition: 'all 0.2s',
                            }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontWeight: 700, fontSize: '13px', color: '#003262' }, children: chapter.code }), _jsx("div", { style: { fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }, children: chapter.title })] }), _jsx("div", { style: {
                                                width: '22px', height: '22px', borderRadius: '50%',
                                                border: `2px solid ${selectedChapters.includes(chapter.id) ? '#003262' : 'var(--border-color)'}`,
                                                background: selectedChapters.includes(chapter.id) ? '#003262' : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0,
                                            }, children: selectedChapters.includes(chapter.id) && _jsx(CheckCircle, { size: 12, color: "#FDB515" }) })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }, children: [_jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx("span", { style: {
                                                        padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                                                        background: chapter.status === 'ready' ? '#22c55e20' : '#f59e0b20',
                                                        color: chapter.status === 'ready' ? '#22c55e' : '#f59e0b',
                                                    }, children: chapter.status === 'ready' ? '就緒' : '進行中' }), _jsxs("span", { style: { fontSize: '11px', color: 'var(--text-secondary)' }, children: [chapter.pages, "\u9801"] })] }), _jsxs("div", { style: { fontSize: '12px', fontWeight: 700, color: chapter.coverage >= 85 ? '#22c55e' : '#f59e0b' }, children: [chapter.coverage, "%"] })] }), _jsx("div", { style: { height: '3px', background: 'var(--border-color)', borderRadius: '99px', marginTop: '8px' }, children: _jsx("div", { style: {
                                            height: '100%', borderRadius: '99px',
                                            width: `${chapter.coverage}%`,
                                            background: chapter.coverage >= 85 ? '#22c55e' : '#f59e0b',
                                            transition: 'width 0.5s',
                                        } }) })] }, chapter.id))) }), selectedChapters.length > 0 && (_jsxs("div", { style: {
                            position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
                            background: '#003262', color: '#fff', padding: '14px 28px', borderRadius: '99px',
                            display: 'flex', alignItems: 'center', gap: '12px', zIndex: 100,
                            boxShadow: '0 8px 32px rgba(0,50,98,0.4)',
                        }, children: [_jsx(CheckCircle, { size: 16, color: "#FDB515" }), _jsxs("span", { style: { fontWeight: 600 }, children: ["\u5DF2\u9078 ", selectedChapters.length, " \u7AE0\u7BC0"] }), _jsx("button", { onClick: () => setActiveTab('generate'), style: {
                                    padding: '6px 16px', borderRadius: '99px', border: 'none',
                                    background: '#FDB515', color: '#003262', cursor: 'pointer', fontWeight: 700, fontSize: '13px',
                                }, children: "AI \u751F\u6210 \u2192" })] }))] })), activeTab === 'compliance' && (_jsx("div", { style: { display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '800px' }, children: _jsxs("div", { className: "card", children: [_jsx("h3", { style: { fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', fontSize: '15px' }, children: "\u516D\u968E\u6BB5\u7533\u5831\u6642\u7A0B\u8FFD\u8E64\u5668" }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx("div", { style: {
                                        position: 'absolute', left: '28px', top: '0', bottom: '0', width: '2px',
                                        background: 'var(--border-color)',
                                    } }), COMPLIANCE_SCHEDULE.map((stage, idx) => (_jsxs("div", { style: {
                                        display: 'flex', gap: '20px', marginBottom: '28px', position: 'relative',
                                    }, children: [_jsx("div", { style: {
                                                width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: stage.status === 'completed' ? '#003262'
                                                    : stage.status === 'current' ? '#FDB515'
                                                        : 'var(--bg-secondary)',
                                                border: `2px solid ${stage.status === 'completed' ? '#003262'
                                                    : stage.status === 'current' ? '#FDB515'
                                                        : 'var(--border-color)'}`,
                                                fontWeight: 700, fontSize: '16px', zIndex: 1,
                                                color: stage.status === 'completed' ? '#FDB515'
                                                    : stage.status === 'current' ? '#003262'
                                                        : 'var(--text-secondary)',
                                            }, children: stage.status === 'completed' ? _jsx(CheckCircle, { size: 22 }) : stage.stage }), _jsxs("div", { style: { flex: 1, paddingTop: '4px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }, children: [_jsxs("div", { style: { fontWeight: 700, color: 'var(--text-primary)', fontSize: '15px' }, children: ["\u7B2C ", stage.stage, " \u968E\u6BB5\uFF1A", stage.title] }), _jsx("span", { style: {
                                                                padding: '2px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                                                                background: stage.status === 'completed' ? '#22c55e20'
                                                                    : stage.status === 'current' ? '#FDB51520'
                                                                        : '#6b728020',
                                                                color: stage.status === 'completed' ? '#22c55e'
                                                                    : stage.status === 'current' ? '#b8860b'
                                                                        : '#6b7280',
                                                            }, children: stage.status === 'completed' ? '已完成' : stage.status === 'current' ? '進行中' : '待執行' })] }), _jsx("div", { style: { fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }, children: stage.desc }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }, children: [_jsx(Calendar, { size: 12, color: "#003262" }), _jsxs("span", { style: { color: '#003262', fontWeight: 600 }, children: ["\u622A\u6B62\u65E5\u671F\uFF1A", stage.deadline] })] })] })] }, stage.stage)))] })] }) })), activeTab === 'defects' && (_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }, children: [_jsxs("div", { style: { position: 'relative', flex: 1, minWidth: '200px' }, children: [_jsx(Search, { size: 14, style: { position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' } }), _jsx("input", { placeholder: "\u641C\u5C0B\u7F3A\u5931\u9805\u76EE...", value: searchQuery, onChange: e => setSearchQuery(e.target.value), style: {
                                            width: '100%', padding: '8px 12px 8px 32px', borderRadius: '8px',
                                            border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                                            fontSize: '13px', color: 'var(--text-primary)', boxSizing: 'border-box',
                                        } })] }), ['all', 'critical', 'warning', 'info'].map(f => (_jsxs("button", { onClick: () => setDefectFilter(f), style: {
                                    padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)',
                                    background: defectFilter === f ? '#003262' : 'var(--bg-secondary)',
                                    color: defectFilter === f ? '#FDB515' : 'var(--text-secondary)',
                                    cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                                }, children: [f === 'all' ? '全部' : f === 'critical' ? '高風險' : f === 'warning' ? '中風險' : '低風險', _jsx("span", { style: { marginLeft: '6px', background: 'rgba(255,255,255,0.2)', padding: '1px 6px', borderRadius: '99px' }, children: f === 'all' ? DEFECTS.length : DEFECTS.filter(d => d.type === f).length })] }, f)))] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '10px' }, children: filteredDefects.map(defect => {
                            const color = defectColors[defect.type];
                            return (_jsxs("div", { style: {
                                    borderRadius: '12px', border: `1px solid ${color}30`,
                                    background: 'var(--bg-card)', overflow: 'hidden',
                                }, children: [_jsxs("div", { onClick: () => setExpandedDefect(expandedDefect === defect.id ? null : defect.id), style: {
                                            display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', cursor: 'pointer',
                                        }, children: [_jsx("div", { style: {
                                                    width: '8px', height: '8px', borderRadius: '50%',
                                                    background: color, flexShrink: 0,
                                                } }), _jsx("div", { style: { flex: 1, fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }, children: defect.title }), _jsx("span", { style: {
                                                    padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                                                    background: color + '20', color, flexShrink: 0,
                                                }, children: defect.gri }), _jsx("span", { style: {
                                                    padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                                                    background: defect.status === 'open' ? '#ef444420' : defect.status === 'fixing' ? '#f59e0b20' : '#6b728020',
                                                    color: defect.status === 'open' ? '#ef4444' : defect.status === 'fixing' ? '#f59e0b' : '#6b7280',
                                                    flexShrink: 0,
                                                }, children: defect.status === 'open' ? '待處理' : defect.status === 'fixing' ? '修正中' : '審閱中' }), expandedDefect === defect.id ? _jsx(ChevronUp, { size: 16 }) : _jsx(ChevronDown, { size: 16 })] }), expandedDefect === defect.id && (_jsx("div", { style: {
                                            padding: '0 16px 16px', borderTop: `1px solid ${color}20`,
                                            background: color + '05',
                                        }, children: _jsxs("div", { style: { padding: '12px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }, children: "\u98A8\u96AA\u7B49\u7D1A" }), _jsxs("div", { style: { fontSize: '14px', fontWeight: 600, color }, children: ["\u26A0\uFE0F ", defect.risk, "\u98A8\u96AA"] })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }, children: "\u5C0D\u61C9\u6A19\u6E96" }), _jsx("div", { style: { fontSize: '14px', fontWeight: 600, color: '#003262' }, children: defect.gri })] }), _jsxs("div", { style: { gridColumn: '1 / -1' }, children: [_jsx("div", { style: { fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }, children: "AI \u4FEE\u6B63\u5EFA\u8B70" }), _jsxs("div", { style: {
                                                                padding: '10px 12px', borderRadius: '8px',
                                                                background: 'var(--bg-secondary)', fontSize: '13px', color: 'var(--text-primary)',
                                                            }, children: ["\u5EFA\u8B70\u53C3\u7167 ", defect.gri, " \u6E96\u5247\u7B2C 3.2 \u7AE0\u7BC0\uFF0C\u88DC\u5145\u57FA\u790E\u5E74\u4EFD\u8AAA\u660E\u3001\u8A08\u7B97\u65B9\u6CD5\u8AD6\u53CA\u7B2C\u4E09\u65B9\u67E5\u8B49\u8072\u660E\u66F8\uFF0C \u78BA\u4FDD\u6578\u64DA\u5B8C\u6574\u6027\u7B26\u5408\u570B\u969B\u78BA\u4FE1\u6A19\u6E96 ISSA 5000 \u8981\u6C42\u3002"] })] }), _jsx("button", { style: {
                                                        padding: '8px 16px', borderRadius: '8px', border: 'none',
                                                        background: '#003262', color: '#FDB515', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                                                    }, children: "AI \u81EA\u52D5\u4FEE\u6B63" }), _jsx("button", { style: {
                                                        padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)',
                                                        background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px',
                                                    }, children: "\u6A19\u8A18\u5DF2\u77E5\u6089" })] }) }))] }, defect.id));
                        }) })] })), activeTab === 'benchmark' && (_jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }, children: _jsx("div", { style: { gridColumn: '1 / -1' }, children: _jsxs("div", { className: "card", children: [_jsx("h3", { style: { fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', fontSize: '15px' }, children: "\u7522\u696D\u6A19\u7AFF\u5C0D\u6BD4\u5206\u6790 (\u53F0\u7063 ESG \u524D\u56DB\u5927)" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '12px' }, children: BENCHMARKS.map((company, idx) => (_jsxs("div", { style: {
                                        display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 16px',
                                        borderRadius: '10px', background: company.isSelf ? '#FDB51510' : 'var(--bg-secondary)',
                                        border: `1px solid ${company.isSelf ? '#FDB515' : 'var(--border-color)'}`,
                                    }, children: [_jsx("div", { style: {
                                                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                                                background: company.isSelf ? '#FDB515' : company.rank === 1 ? '#FFD700' : company.rank === 2 ? '#C0C0C0' : '#CD7F32',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 700, fontSize: '14px', color: company.isSelf ? '#003262' : '#fff',
                                            }, children: company.isSelf ? '我' : company.rank }), _jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [_jsx("div", { style: { fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }, children: company.company }), _jsx("div", { style: { fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }, children: company.highlight })] }), _jsxs("div", { style: { textAlign: 'right', flexShrink: 0 }, children: [_jsx("div", { style: { fontSize: '20px', fontWeight: 700, color: company.isSelf ? '#FDB515' : '#003262' }, children: company.score }), _jsx("div", { style: { fontSize: '11px', color: 'var(--text-secondary)' }, children: "ESG \u8A55\u5206" })] }), _jsx("div", { style: { width: '80px', flexShrink: 0 }, children: _jsx("div", { style: { height: '6px', background: 'var(--border-color)', borderRadius: '3px' }, children: _jsx("div", { style: {
                                                        height: '100%', width: `${company.score}%`, borderRadius: '3px',
                                                        background: company.isSelf ? '#FDB515' : '#003262', transition: 'width 0.8s',
                                                    } }) }) })] }, company.company))) }), _jsxs("div", { style: {
                                    marginTop: '16px', padding: '14px', borderRadius: '10px',
                                    background: '#003262', color: '#fff',
                                }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }, children: [_jsx(TrendingUp, { size: 16, color: "#FDB515" }), _jsx("span", { style: { fontWeight: 700 }, children: "AI \u5DEE\u8DDD\u5206\u6790\u5831\u544A" })] }), _jsxs("div", { style: { fontSize: '13px', opacity: 0.85, lineHeight: 1.6 }, children: ["\u60A8\u7684\u4F01\u696D\u76EE\u524D ESG \u8A55\u5206\u70BA ", _jsx("strong", { style: { color: '#FDB515' }, children: "78\u5206" }), "\uFF0C\u8207\u7522\u696D\u6A19\u7AFF\u53F0\u7A4D\u96FB (98\u5206) \u5DEE\u8DDD\u7D04", _jsx("strong", { style: { color: '#FDB515' }, children: " 20\u5206" }), "\u3002\u4E3B\u8981\u7F3A\u53E3\u96C6\u4E2D\u5728\uFF1A \u74B0\u5883\u6307\u6A19 E \u8986\u84CB\u7387\u504F\u4F4E (-15%)\u3001\u6C23\u5019\u8CA1\u52D9\u98A8\u96AA\u63ED\u9732 (TCFD) \u4E0D\u5B8C\u6574\u3001 \u4F9B\u61C9\u93C8\u6C38\u7E8C\u627F\u8AFE\u66F8\u7C3D\u7F72\u6BD4\u4F8B\u4E0D\u8DB3\u3002\u5EFA\u8B70\u512A\u5148\u88DC\u5F37 GRI 305\u3001GRI 308 \u53CA TCFD \u7AE0\u7BC0\u3002"] })] })] }) }) })), activeTab === 'generate' && (_jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }, children: [_jsxs("div", { className: "card", children: [_jsx("h3", { style: { fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', fontSize: '15px' }, children: "AI \u5831\u544A\u751F\u6210\u8A2D\u5B9A" }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '16px' }, children: [_jsxs("div", { children: [_jsx("label", { style: { fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }, children: "\u9078\u64C7 AI \u4EBA\u683C (SPIRIT Persona)" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }, children: [
                                                    { id: 'compliance', label: '合規守衛', color: '#003262', icon: Shield },
                                                    { id: 'harmony', label: '共榮引導', color: '#22c55e', icon: Users },
                                                    { id: 'innovation', label: '創新先行', color: '#8b5cf6', icon: Zap },
                                                ].map(persona => {
                                                    const Icon = persona.icon;
                                                    return (_jsxs("button", { style: {
                                                            padding: '10px 8px', borderRadius: '8px', border: `2px solid ${persona.color}`,
                                                            background: `${persona.color}10`, cursor: 'pointer',
                                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                                                        }, children: [_jsx(Icon, { size: 16, color: persona.color }), _jsx("span", { style: { fontSize: '11px', fontWeight: 600, color: persona.color }, children: persona.label })] }, persona.id));
                                                }) })] }), _jsxs("div", { children: [_jsx("label", { style: { fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }, children: "\u5831\u544A\u8A9E\u8A00" }), _jsxs("select", { style: {
                                                    width: '100%', padding: '10px 12px', borderRadius: '8px',
                                                    border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                                                    fontSize: '13px', color: 'var(--text-primary)', boxSizing: 'border-box',
                                                }, children: [_jsx("option", { children: "\u7E41\u9AD4\u4E2D\u6587" }), _jsx("option", { children: "English" }), _jsx("option", { children: "\u7E41\u4E2D + English \u96D9\u8A9E" })] })] }), _jsxs("div", { children: [_jsxs("label", { style: { fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }, children: ["\u5DF2\u9078\u7AE0\u7BC0\uFF1A", selectedChapters.length > 0 ? selectedChapters.length : '全部', " \u7AE0\u7BC0"] }), _jsx("div", { style: {
                                                    padding: '10px 12px', borderRadius: '8px', background: 'var(--bg-secondary)',
                                                    border: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-secondary)',
                                                }, children: selectedChapters.length > 0
                                                    ? `GRI ${selectedChapters.join(', GRI ')} 等 ${selectedChapters.length} 章節`
                                                    : '全部 17 章節 (推薦完整生成)' })] }), _jsxs("button", { onClick: startGeneration, disabled: generating, style: {
                                            padding: '14px 24px', borderRadius: '10px', border: 'none',
                                            background: generating ? '#6b7280' : 'linear-gradient(135deg, #003262, #3b7ea1)',
                                            color: '#FDB515', cursor: generating ? 'not-allowed' : 'pointer',
                                            fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                            transition: 'all 0.2s',
                                        }, children: [generating ? _jsx(RefreshCw, { size: 18, style: { animation: 'spin 1s linear infinite' } }) : _jsx(Zap, { size: 18 }), generating ? `生成中 (${progress}%)...` : '⚡ 啟動 AI 生成引擎'] })] })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { style: { fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', fontSize: '15px' }, children: "AI \u751F\u6210\u65E5\u8A8C" }), generating && (_jsxs("div", { style: { marginBottom: '12px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }, children: [_jsx("span", { style: { fontSize: '12px', color: 'var(--text-secondary)' }, children: "\u751F\u6210\u9032\u5EA6" }), _jsxs("span", { style: { fontSize: '12px', fontWeight: 700, color: '#003262' }, children: [progress, "%"] })] }), _jsx("div", { style: { height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px' }, children: _jsx("div", { style: {
                                                height: '100%', width: `${progress}%`, borderRadius: '3px',
                                                background: 'linear-gradient(90deg, #003262, #FDB515)', transition: 'width 0.4s',
                                            } }) })] })), _jsx("div", { style: {
                                    minHeight: '200px', maxHeight: '320px', overflowY: 'auto',
                                    background: '#0a0a0a', borderRadius: '8px', padding: '12px',
                                    fontFamily: 'monospace', fontSize: '12px',
                                }, children: generationLog.length === 0 ? (_jsx("div", { style: { color: '#6b7280', textAlign: 'center', padding: '40px 0' }, children: "\u7B49\u5F85\u555F\u52D5 AI \u751F\u6210\u5F15\u64CE..." })) : (generationLog.map((log, idx) => (_jsxs("div", { style: { color: '#22c55e', marginBottom: '4px', lineHeight: 1.5 }, children: [_jsxs("span", { style: { color: '#6b7280', marginRight: '8px' }, children: ["[", String(idx + 1).padStart(2, '0'), "]"] }), log] }, idx)))) }), !generating && generationLog.length > 0 && (_jsxs("div", { style: { marginTop: '12px', display: 'flex', gap: '8px' }, children: [_jsxs("button", { style: {
                                            flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                                            background: '#003262', color: '#FDB515', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                        }, children: [_jsx(Download, { size: 14 }), " \u4E0B\u8F09 PDF \u5831\u544A"] }), _jsxs("button", { style: {
                                            flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)',
                                            background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                        }, children: [_jsx(Eye, { size: 14 }), " \u9810\u89BD\u5831\u544A"] })] }))] })] })), _jsx("style", { children: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      ` })] }));
}
//# sourceMappingURL=page.js.map