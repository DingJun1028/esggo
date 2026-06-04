'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * SlackGatewayCard
 * ─────────────────────────────────────────────────────
 * Dashboard 用的 Slack OmniAgent 整合狀態卡片。
 * 功能：
 *   - 顯示 Slack Gateway 連線狀態（有無 Token）
 *   - 一鍵手動推播 5T 報告至指定 Slack 頻道
 *   - 顯示最近推播記錄
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, CheckCircle, AlertCircle, Loader2, Hash } from 'lucide-react';
import { BrandCard, BrandBadge, BrandStatusDot } from '@/components/brand';
export function SlackGatewayCard({ className = '' }) {
    const [isConfigured, setIsConfigured] = useState(null);
    const [isPushing, setIsPushing] = useState(false);
    const [companyName, setCompanyName] = useState('ESG GO 示範企業');
    const [pushLog, setPushLog] = useState([]);
    const [lastResult, setLastResult] = useState(null);
    // 檢查 Slack Gateway 是否已設定
    useEffect(() => {
        fetch('/api/slack/status')
            .then(r => r.json())
            .then(d => setIsConfigured(d.configured ?? false))
            .catch(() => setIsConfigured(false));
    }, []);
    const handlePush5T = async () => {
        if (isPushing)
            return;
        setIsPushing(true);
        setLastResult(null);
        try {
            const res = await fetch('/api/slack/push5t', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyName }),
            });
            const data = await res.json();
            const ok = res.ok && data.ok;
            setLastResult(ok ? 'success' : 'failed');
            setPushLog(prev => [{
                    id: `LOG-${Date.now()}`,
                    company: companyName,
                    score: data.overallScore ?? 0,
                    channel: data.channel ?? '#esggo',
                    time: new Date().toLocaleTimeString('zh-TW'),
                    status: (ok ? 'success' : 'failed'),
                }, ...prev].slice(0, 5));
        }
        catch {
            setLastResult('failed');
        }
        finally {
            setIsPushing(false);
            setTimeout(() => setLastResult(null), 3000);
        }
    };
    const configStatus = isConfigured === null
        ? 'checking'
        : isConfigured ? 'online' : 'offline';
    return (_jsxs(BrandCard, { className: `p-6 flex flex-col gap-5 ${className}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-[#4A154B]/30 border border-[#4A154B]/50 flex items-center justify-center", children: _jsx(MessageSquare, { size: 18, className: "text-[#E01E5A]" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-black text-white tracking-wider", children: "Slack OmniAgent" }), _jsx("p", { className: "text-xs text-slate-500 font-mono", children: "Gateway \u6574\u5408\u9598\u9053" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [configStatus === 'checking' && (_jsx(Loader2, { size: 14, className: "text-slate-500 animate-spin" })), configStatus === 'online' && (_jsxs(BrandBadge, { variant: "success", className: "text-xs", children: [_jsx(BrandStatusDot, { status: "active", pulse: true, size: "sm" }), "\u5DF2\u9023\u7DDA"] })), configStatus === 'offline' && (_jsxs(BrandBadge, { variant: "warning", className: "text-xs", children: [_jsx("span", { className: "w-1.5 h-1.5 bg-amber-500 rounded-full inline-block mr-1" }), "\u672A\u8A2D\u5B9A"] }))] })] }), configStatus === 'offline' && (_jsxs("div", { className: "rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-300 leading-relaxed", children: [_jsx("p", { className: "font-bold mb-1", children: "\u2699\uFE0F \u9700\u8981\u8A2D\u5B9A Slack Token" }), _jsxs("p", { className: "text-amber-400/70", children: ["\u5728 ", _jsx("code", { className: "bg-black/30 px-1 rounded", children: ".env" }), " \u4E2D\u52A0\u5165\uFF1A"] }), _jsx("pre", { className: "mt-2 text-emerald-400 bg-black/30 rounded-lg p-2 font-mono overflow-x-auto", children: `SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
SLACK_ALLOWED_USERS=U...
SLACK_HOME_CHANNEL=C...` })] })), configStatus === 'online' && (_jsx("div", { className: "space-y-3", children: _jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Hash, { size: 13, className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" }), _jsx("input", { type: "text", value: companyName, onChange: e => setCompanyName(e.target.value), placeholder: "\u4F01\u696D\u540D\u7A31...", className: "w-full bg-black/30 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 transition-colors" })] }), _jsxs("button", { onClick: handlePush5T, disabled: isPushing || !companyName.trim(), className: "flex items-center gap-2 px-4 py-2 bg-[#4A154B]/60 hover:bg-[#4A154B]/80 border border-[#E01E5A]/30 hover:border-[#E01E5A]/60 text-white text-sm font-bold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed", children: [isPushing
                                    ? _jsx(Loader2, { size: 14, className: "animate-spin" })
                                    : lastResult === 'success'
                                        ? _jsx(CheckCircle, { size: 14, className: "text-emerald-400" })
                                        : lastResult === 'failed'
                                            ? _jsx(AlertCircle, { size: 14, className: "text-red-400" })
                                            : _jsx(Send, { size: 14 }), "\u63A8\u64AD 5T"] })] }) })), _jsx(AnimatePresence, { children: pushLog.length > 0 && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "space-y-1.5", children: [_jsx("p", { className: "text-xs text-slate-500 font-mono uppercase tracking-widest mb-2", children: "Recent Pushes" }), pushLog.map(log => (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, className: "flex items-center justify-between text-xs bg-black/20 rounded-lg px-3 py-2 border border-white/5", children: [_jsxs("div", { className: "flex items-center gap-2 overflow-hidden", children: [log.status === 'success'
                                            ? _jsx(CheckCircle, { size: 12, className: "text-emerald-400 shrink-0" })
                                            : _jsx(AlertCircle, { size: 12, className: "text-red-400 shrink-0" }), _jsx("span", { className: "text-slate-300 truncate", children: log.company }), _jsxs("span", { className: "text-cyan-400 font-mono font-bold shrink-0", children: [log.score, "\u5206"] })] }), _jsx("span", { className: "text-slate-600 shrink-0 ml-2", children: log.time })] }, log.id)))] })) }), _jsxs("div", { className: "border-t border-white/5 pt-4 flex flex-wrap gap-2", children: [['/esg-five-t', '/esg-status', '/esg-alert', '/omni'].map(cmd => (_jsx("span", { className: "text-xs font-mono text-slate-500 bg-black/20 px-2 py-1 rounded border border-white/5", children: cmd }, cmd))), _jsx("span", { className: "text-xs text-slate-600 ml-auto self-center", children: "Slash Commands" })] })] }));
}
//# sourceMappingURL=SlackGatewayCard.js.map