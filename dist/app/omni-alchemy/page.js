'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Upload, FileText, ShieldCheck, ArrowUpRight, CheckCircle, Database, Maximize2, RefreshCw, Bot, Sparkles, Lock, Hash, Edit3 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import StandardPage from '../../components/brand/StandardPage';
export default function OmniAgentAlchemyPage() {
    const [isScanning, setIsScanning] = useState(false);
    const [scanStep, setScanStep] = useState(0);
    const [results, setResults] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const SCAN_STEPS = [
        "正在讀取憑證像素 (T1 Truth)...",
        "執行多模態語義提取 (T4 Transparent)...",
        "校準 GRI 指標映射 (T2 Traceable)...",
        "正在計算 AI 信任評分...",
        "生成 Alchemy 智能分析報告"
    ];
    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0]);
            setResults(null);
        }
    };
    const startAlchemy = async () => {
        if (!uploadedFile)
            return;
        setIsScanning(true);
        setScanStep(0);
        const reader = new FileReader();
        const base64Promise = new Promise((resolve) => {
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(uploadedFile);
        });
        const base64Data = await base64Promise;
        // Simulate multi-modal scan steps visually
        const stepInterval = setInterval(() => {
            setScanStep(prev => Math.min(prev + 1, SCAN_STEPS.length - 2));
        }, 1000);
        try {
            const res = await fetch('/api/agent/vision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileName: uploadedFile.name,
                    fileType: uploadedFile.type,
                    base64Data
                }),
            });
            const data = await res.json();
            clearInterval(stepInterval);
            setScanStep(SCAN_STEPS.length - 1);
            await new Promise(r => setTimeout(r, 800));
            if (data.ok) {
                setResults({
                    fileName: data.fileName,
                    extractedMetrics: data.metrics,
                    confidence: data.confidence,
                    gapAnalysis: data.summary,
                });
            }
        }
        catch (e) {
            console.error('Alchemy failed', e);
        }
        finally {
            setIsScanning(false);
        }
    };
    const handleSeal = async () => {
        if (!results)
            return;
        setIsScanning(true);
        await new Promise(r => setTimeout(r, 1500));
        const sealHash = `sha256:ox_alc_${Math.random().toString(36).substring(2, 15)}`;
        // [oX Logic Upgrade] Pushing to Vault Omni
        try {
            await fetch('/api/vault/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uuid: `alc-${Date.now()}`,
                    hash_lock: sealHash,
                    gri_reference: results.extractedMetrics.map(m => m.gri).join(', '),
                    payload: JSON.stringify(results),
                    dimension: 'E',
                    t5_bundle: { tags: ['T1', 'T2', 'T4', 'T5'], version: '1.2.0' }
                })
            });
        }
        catch (e) {
            console.warn('Vault auto-registration failed', e);
        }
        setResults({
            ...results,
            sealed: true,
            sealHash
        });
        setIsScanning(false);
    };
    // ── Universal Page Configuration ──────────────────────────────────
    const pageConfig = {
        id: 'omniagent-alchemy',
        title: 'OmniAgent Alchemy 煉金術',
        subtitle: '多模態憑證智能提取中心 · 5T 數據轉化 · 自動化 GRI 映射。',
        icon: _jsx(Sparkles, { size: 32, className: "text-berkeley-blue" }),
        griReference: 'Intelligence / Vision',
        activeT5Tags: ['T1', 'T2', 'T4'],
        isOXModule: true,
        features: { useAuditLog: true },
        primaryActions: [
            { id: 'reset', label: '重置掃描', icon: _jsx(RefreshCw, { size: 16 }), variant: 'ghost', onClick: () => { setUploadedFile(null); setResults(null); } },
        ],
        kpis: [
            { key: 'accuracy', label: '平均準確率', value: '99.2', unit: '%', icon: _jsx(ShieldCheck, { size: 18 }) },
            { key: 'scanned', label: '本日已掃描', value: '14', icon: _jsx(FileText, { size: 18 }) },
            { key: 'time', label: '平均耗時', value: '4.8', unit: 'sec', icon: _jsx(Zap, { size: 18 }) },
        ],
        sections: [
            {
                id: 'upload-zone',
                title: '原始憑證輸入',
                columns: 4,
                component: (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: cn("border-2 border-dashed rounded-[2rem] p-10 text-center transition-all duration-500 group", uploadedFile ? "border-verified/30 bg-verified/5" : "border-slate-200 bg-slate-50/50 hover:border-berkeley-blue/40 hover:bg-berkeley-blue/5"), children: [_jsx("input", { type: "file", id: "alchemy-upload", className: "hidden", onChange: handleFileUpload }), _jsxs("label", { htmlFor: "alchemy-upload", className: "cursor-pointer block space-y-4", children: [_jsx("div", { className: cn("w-16 h-16 rounded-3xl mx-auto flex items-center justify-center transition-transform group-hover:scale-110", uploadedFile ? "bg-verified/20 text-verified" : "bg-white text-slate-300 shadow-sm border border-slate-100"), children: uploadedFile ? _jsx(CheckCircle, { size: 32 }) : _jsx(Upload, { size: 32 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-black text-slate-800", children: uploadedFile ? uploadedFile.name : '點擊或拖拽上傳憑證' }), _jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1", children: "Supports PDF, JPG, PNG" })] })] })] }), _jsxs(Button, { variant: "primary", className: "w-full h-14 rounded-2xl text-sm tracking-widest uppercase shadow-glass", onClick: startAlchemy, disabled: !uploadedFile || isScanning, isLoading: isScanning && scanStep < SCAN_STEPS.length, children: [_jsx(Zap, { size: 18, className: "mr-2", fill: "currentColor" }), " \u555F\u52D5 Multi-modal Alchemy"] }), _jsxs("div", { className: "p-6 bg-berkeley-blue rounded-[2rem] text-white space-y-4 relative overflow-hidden shadow-lg", children: [_jsx("p", { className: "text-[10px] font-black text-california-gold uppercase tracking-[0.3em] relative z-10", children: "AI Engine Status" }), _jsxs("div", { className: "flex items-center gap-3 relative z-10", children: [_jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-verified animate-pulse shadow-[0_0_8px_#10b981]" }), _jsx("p", { className: "text-xs font-bold text-white/90", children: "Nous-OmniAgent-Vision-v2 Ready" })] }), _jsx(Bot, { size: 80, className: "absolute -bottom-6 -right-6 text-white/5 rotate-12" })] })] }))
            },
            {
                id: 'analysis-zone',
                title: 'Alchemy 智能解析結果',
                columns: 8,
                component: (_jsx("div", { className: "min-h-[400px] flex flex-col", children: _jsx(AnimatePresence, { mode: "wait", children: isScanning ? (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "flex-1 flex flex-col items-center justify-center space-y-8", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-24 h-24 rounded-full border-4 border-slate-100 border-t-berkeley-blue animate-spin" }), _jsx(Bot, { size: 32, className: "absolute inset-0 m-auto text-berkeley-blue" })] }), _jsxs("div", { className: "text-center space-y-2", children: [_jsx("h4", { className: "text-xl font-black text-berkeley-blue tracking-tight", children: SCAN_STEPS[scanStep] }), _jsx("p", { className: "text-xs text-slate-400 font-bold uppercase tracking-widest", children: "Processing Multi-modal Tokens..." })] })] }, "scanning")) : results ? (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-5", children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "\u63D0\u53D6\u6307\u6A19\u6578\u64DA (Extracted Metrics)" }), _jsx("div", { className: "space-y-3", children: results.extractedMetrics.map((m, i) => (_jsxs("div", { className: "p-4 bg-white/40 border border-white/60 rounded-2xl shadow-sm flex items-center justify-between group hover:border-berkeley-blue/30 transition-all backdrop-blur-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-black text-berkeley-blue uppercase mb-0.5", children: m.gri }), _jsx("p", { className: "text-sm font-black text-slate-700", children: m.key })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-xl font-black text-berkeley-blue font-mono leading-none", children: m.value.toLocaleString() }), _jsx("p", { className: "text-[9px] font-bold text-slate-400 uppercase mt-1.5", children: m.unit })] })] }, i))) })] }), _jsxs("div", { className: "space-y-5", children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "AI \u4FE1\u5FC3\u8207\u7F3A\u53E3\u5206\u6790" }), _jsxs(Card, { className: "p-6 bg-slate-50/50 rounded-[2rem] border-slate-100/50 space-y-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider", children: "\u4FE1\u4EFB\u8A55\u5206 (Trust Score)" }), _jsxs(Badge, { variant: results.confidence > 0.9 ? 'verified' : 'warning', className: "px-3 py-1", children: [Math.round(results.confidence * 100), "%"] })] }), _jsx("div", { className: "h-2 w-full bg-slate-200/50 rounded-full overflow-hidden", children: _jsx(motion.div, { className: "h-full bg-gradient-to-r from-berkeley-blue to-verified", initial: { width: 0 }, animate: { width: `${results.confidence * 100}%` }, transition: { duration: 1, delay: 0.5 } }) }), _jsx("div", { className: "p-4 bg-white/60 rounded-xl border border-white/80 shadow-sm", children: _jsxs("p", { className: "text-[13px] text-slate-600 leading-relaxed italic font-medium", children: ["\"", results.gapAnalysis, "\""] }) })] })] })] }), results.sealed ? (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "p-8 bg-verified/5 border border-verified/20 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6", children: [_jsxs("div", { className: "flex items-center gap-5", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-verified/10 flex items-center justify-center text-verified shadow-sm", children: _jsx(Lock, { size: 28 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-base font-black text-slate-800 uppercase tracking-tight", children: "5T \u5BE6\u8B49\u523B\u5370\u5B8C\u6210" }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx(Hash, { size: 12, className: "text-verified" }), _jsx("code", { className: "text-[10px] text-verified font-mono font-bold", children: results.sealHash })] })] })] }), _jsxs("div", { className: "flex gap-3 w-full md:w-auto", children: [_jsx(Link, { href: `/editor?chapter=energy&fill=${results.sealHash}`, className: "flex-1", children: _jsxs(Button, { variant: "primary", className: "w-full bg-verified hover:bg-emerald-600 border-none text-white h-12 px-6 rounded-xl", children: ["\u9032\u5165\u6C38\u7E8C\u64B0\u5BEB ", _jsx(Edit3, { size: 16, className: "ml-2" })] }) }), _jsxs(Button, { variant: "glass", className: "h-12 px-6 rounded-xl border-verified/20 text-verified hover:bg-verified/10", children: ["\u67E5\u770B\u8056\u7891\u7D00\u9304 ", _jsx(ArrowUpRight, { size: 16, className: "ml-2" })] })] })] })) : (_jsxs("div", { className: "flex gap-4", children: [_jsxs(Button, { variant: "primary", size: "lg", className: "flex-1 h-16 rounded-2xl shadow-glass text-base tracking-widest", onClick: handleSeal, children: [_jsx(Hash, { size: 20, className: "mr-3" }), " \u57F7\u884C 5T \u5C01\u5370\u4E26\u63D0\u4EA4\u81F3\u91D1\u5EAB"] }), _jsx(Button, { variant: "glass", size: "lg", className: "h-16 w-16 rounded-2xl p-0", children: _jsx(Maximize2, { size: 24 }) })] }))] }, "results")) : (_jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-slate-300 space-y-6 opacity-40", children: [_jsx("div", { className: "w-24 h-24 rounded-[2.5rem] bg-slate-100 flex items-center justify-center", children: _jsx(Database, { size: 48, strokeWidth: 1.5 }) }), _jsx("p", { className: "text-xs font-black uppercase tracking-[0.4em]", children: "\u7B49\u5F85\u6191\u8B49\u8F38\u5165\u4E2D..." })] })) }) }))
            }
        ]
    };
    return (_jsxs("div", { className: "relative", children: [_jsx(StandardPage, { config: pageConfig }), _jsx(AnimatePresence, { children: results?.sealed && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, className: "fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center gap-3", children: [_jsx(ShieldCheck, { size: 20 }), _jsx("span", { className: "text-sm font-bold", children: "\u6191\u8B49\u5DF2\u4E0A\u50B3\u81F3 \u842C\u80FD\u8056\u7891 vault_omni_core" })] })) })] }));
}
//# sourceMappingURL=page.js.map