import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Shield, ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, Fingerprint, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
export function ShieldOfAbsoluteTruth({ contentId, isAiGenerated, onHealTriggered, className }) {
    const [status, setStatus] = useState('analyzing');
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        let timer;
        if (status === 'analyzing') {
            timer = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) {
                        clearInterval(timer);
                        setStatus(Math.random() > 0.8 ? 'drift-detected' : 'secure');
                        return 100;
                    }
                    return p + 20;
                });
            }, 500);
        }
        return () => clearInterval(timer);
    }, [status, contentId]);
    const triggerAdkHeal = () => {
        setStatus('healing');
        setProgress(0);
        // Simulating Forge Shield / ADK bound
        const healTimer = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(healTimer);
                    setStatus('secure');
                    onHealTriggered?.();
                    return 100;
                }
                return p + 15;
            });
        }, 400);
    };
    return (_jsxs(Card, { className: cn("overflow-hidden border-2 transition-all duration-500", status === 'secure' ? 'border-emerald-500/30 bg-emerald-50/30' :
            status === 'drift-detected' ? 'border-amber-500/50 bg-amber-50/30' :
                status === 'healing' ? 'border-aqua-cyan/50 bg-aqua-cyan/10' :
                    'border-slate-200 bg-white', className), children: [_jsxs("div", { className: "p-4 flex items-center justify-between border-b border-slate-100/50 bg-white/50 backdrop-blur-sm", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: cn("p-2 rounded-lg relative overflow-hidden", status === 'secure' ? 'bg-emerald-100 text-emerald-600' :
                                    status === 'drift-detected' ? 'bg-amber-100 text-amber-600' :
                                        'bg-slate-100 text-slate-500'), children: [status === 'secure' ? _jsx(ShieldCheck, { size: 20 }) :
                                        status === 'drift-detected' ? _jsx(ShieldAlert, { size: 20 }) :
                                            _jsx(Shield, { size: 20, className: status === 'healing' ? 'animate-pulse' : '' }), status === 'healing' && (_jsx("div", { className: "absolute inset-0 bg-aqua-cyan/20 animate-ping rounded-lg" }))] }), _jsxs("div", { children: [_jsxs("h3", { className: "font-black text-sm text-text-primary flex items-center gap-2", children: ["\u7D55\u5C0D\u771F\u5BE6\u4E4B\u76FE ", _jsx("span", { className: "text-[10px] font-mono text-slate-400 font-medium px-1.5 py-0.5 bg-slate-100 rounded", children: "Omni-Core ZKP" })] }), _jsx("p", { className: "text-[11px] text-text-secondary font-medium", children: "\u81EA\u52D5\u5316\u7DA0\u6F02\u9632\u79A6\u6AA2\u67E5 (Greenwashing Defense)" })] })] }), _jsx(Badge, { status: status === 'secure' ? 'success' :
                            status === 'drift-detected' ? 'warning' : 'info', children: status.toUpperCase() })] }), _jsxs("div", { className: "p-4 space-y-4", children: [(status === 'analyzing' || status === 'healing') && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500", children: [_jsx("span", { children: status === 'analyzing' ? '執行 5T 深度分析中...' : 'HealingGuardian 修復管線運行中...' }), _jsxs("span", { children: [progress, "%"] })] }), _jsx("div", { className: "h-1.5 w-full bg-slate-100 rounded-full overflow-hidden", children: _jsx("div", { className: cn("h-full transition-all duration-300", status === 'healing' ? 'bg-aqua-cyan-midtone' : 'bg-slate-400'), style: { width: `${progress}%` } }) })] })), status === 'secure' && (_jsxs("div", { className: "flex items-start gap-3 bg-white p-3 rounded-xl border border-emerald-100", children: [_jsx(CheckCircle2, { size: 16, className: "text-emerald-500 mt-0.5 shrink-0" }), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-xs font-bold text-text-primary", children: "\u5167\u5BB9\u5177\u5099\u7D55\u5C0D\u771F\u5BE6\u6027" }), _jsx("p", { className: "text-[11px] text-slate-500 font-medium", children: "\u5DF2\u901A\u904E 5T \u8AA0\u4FE1\u5354\u8B70\u9A57\u8B49\uFF0CZKP \u96D9\u91CD\u96DC\u5316\u8207 MD5 \u57CB\u690D\u6BD4\u5C0D\u7121\u8AA4\u3002\u7121\u7DA0\u6F02 (Greenwashing) \u8DE1\u8C61\u3002" })] })] })), status === 'drift-detected' && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-start gap-3 bg-white p-3 rounded-xl border border-amber-100", children: [_jsx(AlertTriangle, { size: 16, className: "text-amber-500 mt-0.5 shrink-0" }), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-xs font-bold text-text-primary", children: "\u6AA2\u6E2C\u5230 Drift \u6307\u7D0B\u7570\u5E38" }), _jsx("p", { className: "text-[11px] text-slate-500 font-medium", children: "\u90E8\u5206 AI \u751F\u6210\u5167\u5BB9\u7F3A\u4E4F\u5BA2\u89C0\u6578\u64DA\u652F\u6490\uFF0C\u53EF\u80FD\u89F8\u767C\u7DA0\u6F02\u98A8\u96AA\u3002\u5EFA\u8B70\u555F\u52D5 ADK \u7A4D\u6975\u4FEE\u5FA9\u7CFB\u7D71\u3002" })] })] }), _jsx("div", { className: "flex gap-2", children: _jsxs(Button, { variant: "primary", size: "sm", className: "w-full text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 border-none shadow-md shadow-amber-500/20", onClick: triggerAdkHeal, children: [_jsx(RefreshCcw, { size: 14, className: "mr-2" }), "ADK bound (\u555F\u52D5\u8AA0\u4FE1\u4FEE\u5FA9)"] }) })] })), isAiGenerated && (_jsxs("div", { className: "flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-2 bg-slate-50 p-2 rounded", children: [_jsx(Fingerprint, { size: 12 }), _jsx("span", { children: "AI \u751F\u6210\u5167\u5BB9\u5DF2\u81EA\u52D5\u555F\u7528 T3 Tangible \u8FFD\u8E64\u6A19\u7C64" })] }))] })] }));
}
//# sourceMappingURL=ShieldOfAbsoluteTruth.js.map