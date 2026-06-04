'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Leaf, ArrowUpRight, AlertCircle, Zap, Shield, Globe } from 'lucide-react';
import { BrandCard, BrandButton, BrandInput, BrandBadge } from '../../../components/brand';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isDemoMode } from '../../../lib/firebase';
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // State for dynamically loaded providers
    const [providers, setProviders] = useState(null);
    const [providersLoading, setProvidersLoading] = useState(true);
    const leafClicksRef = useRef(0);
    const timeoutRef = useRef(null);
    const router = useRouter();
    // Fetch available authentication providers from NCB Proxy on mount
    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const res = await fetch('/api/auth-providers');
                if (res.ok) {
                    const data = await res.json();
                    setProviders(data);
                }
                else {
                    console.warn('Failed to fetch auth providers, falling back to default email login.');
                    setProviders({ email: true }); // Fallback
                }
            }
            catch (err) {
                console.error('Error fetching auth providers:', err);
                setProviders({ email: true });
            }
            finally {
                setProvidersLoading(false);
            }
        };
        fetchProviders();
    }, []);
    const handleLeafClick = () => {
        leafClicksRef.current += 1;
        if (leafClicksRef.current >= 3) {
            router.push('/terminal');
            leafClicksRef.current = 0;
            if (timeoutRef.current)
                clearTimeout(timeoutRef.current);
        }
        else {
            if (timeoutRef.current)
                clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                leafClicksRef.current = 0;
            }, 2000);
        }
    };
    async function handleLogin(e) {
        if (e)
            e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (!email || !password)
                throw new Error('請輸入電子郵件與密碼 (Email & Password required)');
            if (isDemoMode) {
                console.log('[Auth] Demo Mode Active. Developer Bypass.');
                localStorage.setItem('omni_user', JSON.stringify({ email, id: 'demo_user', role: 'admin', company_id: 'default' }));
                router.push('/dashboard');
                return;
            }
            // NoCodeBackend Auth Proxy Call
            const res = await fetch('/api/auth/sign-in/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || data.error || '登入失敗 (Login Failed)');
            }
            // Optionally store public info in local storage (session token is secure in cookie)
            localStorage.setItem('omni_user', JSON.stringify({
                email: data.user.email,
                id: data.user.id,
                name: data.user.name,
                role: 'authenticated'
            }));
            router.push('/dashboard');
        }
        catch (err) {
            const message = err instanceof Error ? err.message : '連線錯誤 (Connection Error)';
            setError(message);
        }
        finally {
            setLoading(false);
        }
    }
    async function handleDemoLogin() {
        setLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        localStorage.setItem('omni_user', JSON.stringify({ email: 'admin@esggo.com', id: 'dev_admin', role: 'admin', company_id: 'default' }));
        router.push('/dashboard');
    }
    async function handleGoogleLogin() {
        // NCB Social Login flow: 
        // Typically involves redirecting to the provider URL which sets cookies and returns.
        // Assuming /api/auth/sign-in/google proxy handles the redirect or provides URL.
        setLoading(true);
        setError(null);
        try {
            // For now, redirecting to a generic unimplemented endpoint until Google is fully set up in NCB.
            // window.location.href = '/api/auth/sign-in/google';
            setError('Google 登入尚未完全配置，請聯絡管理員 (Google Auth not fully configured)');
        }
        catch (err) {
            setError('Google 登入失敗');
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("div", { className: "min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#F8FAFC]", children: [_jsxs("div", { className: "absolute inset-0 pointer-events-none z-0", children: [_jsx("div", { className: "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[120px]" }), _jsx("div", { className: "absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#FDB515]/5 blur-[150px]" })] }), _jsxs("div", { className: "relative z-10 w-full max-w-[440px] px-6 py-12 fade-in", children: [_jsxs("div", { className: "flex flex-col items-center mb-10 text-center", children: [_jsxs("div", { onClick: handleLeafClick, className: "w-20 h-20 rounded-[32px] bg-[#003262] flex items-center justify-center shadow-2xl shadow-blue-900/20 mb-6 relative group overflow-hidden cursor-pointer active:scale-95 transition-all", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }), _jsx(Leaf, { size: 40, color: "#FDB515", className: "relative z-10" })] }), _jsx("h1", { className: "text-4xl font-black text-[#003262] mb-2 tracking-tighter uppercase", children: "ESG GO" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(BrandBadge, { variant: "gold", size: "xs", className: "font-black px-3", children: "NCB_AUTH" }), _jsx("span", { className: "text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]", children: "OmniAgent Engine" })] })] }), _jsxs(BrandCard, { padding: "lg", className: "bg-white/90 backdrop-blur-[40px] border-white shadow-extreme rounded-[48px] p-10", children: [_jsxs("div", { className: "mb-10 text-center", children: [_jsx("h2", { className: "text-2xl font-black text-[#003262] tracking-tight", children: "\u8EAB\u5206\u9A57\u8B49\u4E2D\u5FC3" }), _jsx("p", { className: "text-slate-400 text-xs font-medium uppercase tracking-widest mt-1", children: "Sovereign Identity Access" })] }), error && (_jsxs("div", { className: "mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600 text-xs font-bold", children: [_jsx(AlertCircle, { size: 16, className: "mt-0.5 shrink-0" }), _jsx("p", { children: error })] })), isDemoMode && (_jsxs("div", { className: "mb-8 p-5 bg-blue-50 border border-blue-200 rounded-[32px] flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Shield, { size: 18, className: "text-blue-600 shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-blue-800 text-[11px] font-black uppercase tracking-wider", children: "Developer_Channel_Active" }), _jsx("p", { className: "text-blue-700/70 text-[10px] font-bold leading-relaxed mt-1", children: "\u958B\u767C\u8005\u6E2C\u8A66\u6A21\u5F0F\u5DF2\u555F\u52D5\u3002\u60A8\u53EF\u4EE5\u76F4\u63A5\u4F7F\u7528\u5FEB\u901F\u5B58\u53D6\u9032\u5165\u5E73\u53F0\u7BA1\u7406\u4ECB\u9762\u3002" })] })] }), _jsxs(BrandButton, { variant: "primary", fullWidth: true, size: "sm", onClick: handleDemoLogin, className: "bg-blue-600 hover:bg-blue-700 text-white h-12 text-xs font-black rounded-2xl shadow-lg shadow-blue-500/20", loading: loading, children: [_jsx(Zap, { size: 14, className: "mr-2" }), " \u5FEB\u901F\u9032\u5165\u958B\u767C\u8005\u63A7\u5236\u53F0"] })] })), providersLoading ? (_jsx("div", { className: "flex justify-center items-center h-40", children: _jsx("div", { className: "w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" }) })) : (_jsxs(_Fragment, { children: [providers?.email !== false && (_jsxs("form", { onSubmit: handleLogin, className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2", children: "Enterprise Email" }), _jsx(BrandInput, { type: "email", placeholder: "name@company.com", value: email, onChange: e => setEmail(e.target.value), className: "bg-slate-50 border-slate-100 text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-[#003262] focus:ring-8 focus:ring-blue-500/5 h-14 rounded-2xl transition-all font-bold", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center px-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "Access Key" }), _jsx(Link, { href: "#", className: "text-[10px] text-[#3B7EA1] font-black hover:underline", children: "Forgot_Password?" })] }), _jsx(BrandInput, { type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: e => setPassword(e.target.value), className: "bg-slate-50 border-slate-100 text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-[#003262] focus:ring-8 focus:ring-blue-500/5 h-14 rounded-2xl transition-all font-bold", required: true })] }), _jsxs("div", { className: "pt-4 space-y-4", children: [_jsxs(BrandButton, { variant: "primary", fullWidth: true, size: "lg", className: "bg-[#003262] h-14 text-sm font-black shadow-xl shadow-blue-900/20 rounded-2xl group", loading: loading, children: ["\u555F\u52D5\u4E3B\u6B0A\u9023\u7DDA ", _jsx(ArrowUpRight, { size: 18, className: "ml-2 group-hover:translate-x-1 transition-transform" })] }), _jsx("div", { className: "text-center", children: _jsxs("p", { className: "text-[11px] font-bold text-slate-400", children: ["\u5C1A\u672A\u64C1\u6709\u5E33\u865F\uFF1F ", _jsx(Link, { href: "#", className: "text-[#3B7EA1] font-black hover:text-[#003262] transition-colors underline underline-offset-4", children: "\u7ACB\u5373\u8A3B\u518A\u6210\u70BA\u6210\u54E1" })] }) })] })] })), (providers?.google?.enabled || false) && (_jsxs("div", { className: "mt-10 pt-10 border-t border-slate-50 space-y-6", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-slate-50" }) }), _jsx("div", { className: "relative flex justify-center text-[10px] uppercase font-black text-slate-300 tracking-[0.3em]", children: _jsx("span", { className: "bg-white px-4", children: "Trusted_Providers" }) })] }), _jsx("div", { className: "grid grid-cols-1 gap-3", children: _jsxs(BrandButton, { variant: "outline", onClick: handleGoogleLogin, className: "border-slate-100 text-slate-600 hover:bg-slate-50 h-14 text-xs font-black bg-white rounded-2xl shadow-sm flex items-center justify-center gap-3 group", children: [_jsx(Globe, { size: 18, className: "text-slate-300 group-hover:text-blue-500 transition-colors" }), " Continue_with_Google"] }) })] }))] }))] }), _jsxs("p", { className: "mt-10 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed", children: ["\u00A9 ", new Date().getFullYear(), " ESG GO Enterprise Hub ", _jsx("br", {}), "Berkeley \u00D7 TSISDA Digital Sovereignty Partner"] })] })] }));
}
//# sourceMappingURL=page.js.map