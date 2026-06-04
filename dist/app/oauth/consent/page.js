'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { ShieldCheck, Lock, Activity, Bot, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
function ConsentContent() {
    const searchParams = useSearchParams();
    const consentId = searchParams?.get('consent');
    const [status, setStatus] = useState('pending');
    const [errorMsg, setErrorMsg] = useState('');
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    useEffect(() => {
        if (!consentId) {
            setStatus('error');
            setErrorMsg('缺少授權標識符 (consent_id)。');
        }
    }, [consentId]);
    const handleApprove = async () => {
        if (!consentId)
            return;
        setStatus('approving');
        try {
            // 在實際生產環境中，這裡會呼叫 Supabase 的 /auth/v1/oauth/consent 端點
            // 這裡示範如何透過 Supabase JS Client 處理同意邏輯 (需確認 Supabase 具體支援方式，通常是透過 redirect)
            const { data, error } = await supabase.auth.getSession();
            if (error || !data.session) {
                throw new Error('未授權的存取，請先登入。');
            }
            // 由於 Supabase OAuth 2.1 處於早期階段，一般是導向至一個特定的處理 API 或使用 auth.signInWithOAuth 附帶參數
            // 這裡模擬成功邏輯，實務上你需要將同意結果送回 Supabase Authorization Endpoint
            const response = await fetch('/api/oauth/consent/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ consent_id: consentId, user_id: data.session.user.id })
            });
            if (!response.ok) {
                throw new Error('授權批准失敗。');
            }
            setStatus('success');
            setTimeout(() => {
                // 重導回請求方，或者關閉視窗
                window.close();
            }, 3000);
        }
        catch (err) {
            setStatus('error');
            setErrorMsg(err instanceof Error ? err.message : '發生未知錯誤');
        }
    };
    const handleDeny = () => {
        setStatus('error');
        setErrorMsg('您已拒絕授權。');
        setTimeout(() => {
            window.close();
        }, 2000);
    };
    return (_jsxs("div", { className: "min-h-screen bg-void-stark text-white flex flex-col items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-void-stark to-void-stark pointer-events-none" }), _jsx(motion.div, { initial: { opacity: 0, y: 20, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, className: "max-w-md w-full relative z-10", children: _jsxs(UniversalCard, { variant: "glow", className: "p-8 md:p-10 border-cyan-500/30", children: [_jsxs("div", { className: "flex flex-col items-center text-center space-y-6", children: [_jsxs("div", { className: "flex justify-center mb-4 relative", children: [_jsx("div", { className: "absolute inset-0 bg-cyan-core/20 blur-xl rounded-full" }), _jsx("div", { className: "w-20 h-20 bg-void-stark border-2 border-cyan-500/50 rounded-[2rem] flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(6,182,212,0.3)]", children: _jsx(ShieldCheck, { size: 40, className: "text-cyan-core" }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(UniversalBadge, { variant: "success", className: "mb-2", children: "OAuth 2.1 \u6388\u6B0A" }), _jsx("h1", { className: "text-2xl font-black tracking-tight", children: "\u6388\u6B0A\u5B58\u53D6\u8ACB\u6C42" }), _jsxs("p", { className: "text-sm text-white/60 leading-relaxed", children: [_jsx("strong", { className: "text-white", children: "OmniAgent (MCP)" }), " \u60F3\u8981\u5B58\u53D6\u60A8\u7684 ESGGO \u5E33\u865F\u8207 5T \u6CBB\u7406\u6578\u64DA\u3002"] })] }), status === 'pending' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-3", children: [_jsx("h3", { className: "text-[10px] font-black uppercase text-white/40 tracking-widest", children: "\u8981\u6C42\u6B0A\u9650\u7BC4\u570D (Scopes)" }), _jsxs("ul", { className: "space-y-3", children: [_jsxs("li", { className: "flex items-start gap-3", children: [_jsx(Lock, { size: 16, className: "text-emerald-400 shrink-0" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-white/90", children: "\u8B80\u5BEB Evidence Vault" }), _jsx("p", { className: "text-[10px] text-white/50 mt-0.5", children: "\u5141\u8A31\u8B80\u53D6\u8207\u5275\u5EFA 5T \u5BE6\u8B49\u3002" })] })] }), _jsxs("li", { className: "flex items-start gap-3", children: [_jsx(Activity, { size: 16, className: "text-cyan-400 shrink-0" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-white/90", children: "\u5BEB\u5165 Audit Logs" }), _jsx("p", { className: "text-[10px] text-white/50 mt-0.5", children: "\u5141\u8A31\u4EE3\u8868\u60A8\u5BEB\u5165\u4E0D\u53EF\u7BE1\u6539\u7684\u7A3D\u6838\u65E5\u8A8C\u3002" })] })] })] })] }), _jsxs("div", { className: "flex gap-4 w-full pt-4", children: [_jsx(UniversalButton, { variant: "secondary", onClick: handleDeny, className: "flex-1 py-4", children: "\u62D2\u7D55" }), _jsx(UniversalButton, { variant: "primary", onClick: handleApprove, className: "flex-1 py-4", children: "\u5141\u8A31\u5B58\u53D6" })] })] })), status === 'approving' && (_jsxs("div", { className: "py-12 space-y-4 flex flex-col items-center", children: [_jsx(Bot, { size: 48, className: "text-cyan-core animate-bounce" }), _jsx("p", { className: "text-sm font-bold text-white/80", children: "\u6B63\u5728\u5EFA\u7ACB\u52A0\u5BC6\u6388\u6B0A\u901A\u9053..." }), _jsx("div", { className: "w-48 h-1 bg-white/10 rounded-full overflow-hidden", children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: '100%' }, transition: { duration: 2, ease: "linear" }, className: "h-full bg-cyan-core" }) })] })), status === 'success' && (_jsxs("div", { className: "py-12 space-y-4 flex flex-col items-center", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]", children: _jsx(ShieldCheck, { size: 32 }) }), _jsx("h3", { className: "text-xl font-bold text-emerald-400", children: "\u6388\u6B0A\u6210\u529F" }), _jsxs("p", { className: "text-xs text-white/50", children: ["OmniAgent \u5DF2\u6210\u529F\u8207\u60A8\u7684\u8EAB\u4EFD\u7D81\u5B9A\u3002", _jsx("br", {}), "\u6B64\u8996\u7A97\u5C07\u81EA\u52D5\u95DC\u9589\u3002"] })] })), status === 'error' && (_jsxs("div", { className: "py-12 space-y-4 flex flex-col items-center", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.4)]", children: _jsx(XCircle, { size: 32 }) }), _jsx("h3", { className: "text-xl font-bold text-rose-400", children: "\u6388\u6B0A\u5931\u6557" }), _jsx("p", { className: "text-xs text-rose-300/70", children: errorMsg }), _jsx(UniversalButton, { variant: "secondary", onClick: () => window.close(), className: "mt-4", children: "\u95DC\u9589\u8996\u7A97" })] }))] }), _jsx("div", { className: "mt-8 text-center border-t border-white/5 pt-4", children: _jsx("p", { className: "text-[9px] text-white/20 uppercase tracking-widest font-mono", children: "Secured by Supabase Row Level Security" }) })] }) })] }));
}
export default function OAuthConsentPage() {
    return (_jsx(Suspense, { fallback: _jsx("div", { className: "min-h-screen bg-void-stark flex items-center justify-center text-white/50 font-mono text-sm", children: "Loading Sacred Auth Protocol..." }), children: _jsx(ConsentContent, {}) }));
}
//# sourceMappingURL=page.js.map