'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { initAnalytics } from '../lib/firebase';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { SaaSProvider } from '../hooks/useSaaS';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import { ToastProvider, ToastContainer } from '../components/ui';
import { OmniAgentPulse } from '../components/omni/OmniAgentPulse';
function SystemHealthBanner() {
    const { systemStatus } = useAuth();
    if (systemStatus === 'online')
        return null;
    return (_jsxs("div", { className: cn("flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border", systemStatus === 'offline' ? "bg-red-50 border-red-100 text-red-600" : "bg-amber-50 border-amber-100 text-amber-600"), children: [_jsx(AlertCircle, { size: 10, className: systemStatus === 'offline' ? "animate-pulse" : "" }), systemStatus === 'offline' ? "System_Offline" : "Auth_Sync_Degraded"] }));
}
function TenantSwitcher() {
    const { companyId } = useAuth();
    return (_jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl shadow-sm group cursor-pointer hover:bg-white transition-all", children: [_jsx("div", { className: "w-5 h-5 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-sm", children: companyId.charAt(0).toUpperCase() }), _jsx("span", { className: "text-[10px] font-black text-slate-500 uppercase tracking-wider group-hover:text-blue-600", children: companyId }), _jsx(ChevronDown, { size: 10, className: "text-slate-300" })] }));
}
import AppShellV2 from './AppShellV2';
function AppContent({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, isAuthenticated } = useAuth();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        initAnalytics();
    }, []);
    // Auth Guard
    useEffect(() => {
        if (!mounted || loading)
            return;
        if (isAuthenticated === false && pathname !== '/auth/login' && pathname !== '/terminal' && pathname !== '/') {
            router.replace('/auth/login');
        }
        else if (isAuthenticated === true && pathname === '/auth/login') {
            router.replace('/dashboard');
        }
    }, [mounted, isAuthenticated, loading, pathname, router]);
    if (!mounted)
        return null;
    // 1. Public Routes
    if (pathname === '/auth/login' || pathname === '/terminal' || pathname === '/') {
        return _jsxs(_Fragment, { children: [_jsx(ToastContainer, {}), _jsx(OmniAgentPulse, {}), children] });
    }
    // 2. Loading State
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-[#F8FAFD]", children: _jsxs("div", { className: "relative w-12 h-12", children: [_jsx("div", { className: "absolute inset-0 w-full h-full border-4 border-blue-100 rounded-2xl" }), _jsx("div", { className: "absolute inset-0 w-full h-full border-4 border-blue-600 border-t-transparent rounded-2xl animate-spin" })] }) }));
    }
    // 3. Protected Shell
    if (isAuthenticated) {
        return (_jsxs(AppShellV2, { children: [children, _jsx(ToastContainer, {}), _jsx(OmniAgentPulse, {})] }));
    }
    return null;
}
import { ThemeProvider } from '../contexts/ThemeContext';
import { TRPCProvider } from '../src/client/providers/TRPCProvider';
export default function ClientLayout({ children }) {
    return (_jsx(Suspense, { fallback: null, children: _jsx(TRPCProvider, { children: _jsx(ThemeProvider, { children: _jsx(ErrorBoundary, { children: _jsx(ToastProvider, { children: _jsx(AuthProvider, { children: _jsx(SaaSProvider, { children: _jsx(AppContent, { children: children }) }) }) }) }) }) }) }));
}
//# sourceMappingURL=ClientLayout.js.map