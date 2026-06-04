import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense } from 'react';
import './globals.css';
import ClientLayout from './ClientLayout';
import { AuthProvider } from '../components/AuthProvider';
export const metadata = {
    title: {
        default: 'ESGGO善向永續 | 5T 永續治理系統',
        template: '%s | ESGGO善向永續',
    },
    description: '臺北市中小企業永續治理實證系統 v8.5 · Berkeley Haas × TSISDA · 5T 誠信協議驅動之 ESGGO善向永續',
    keywords: ['ESG', 'GRI', 'TCFD', '永續報告', '台灣', '中小企業', '5T', '誠信協議', 'ESGGO'],
    robots: { index: true, follow: true },
    icons: [{ rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' }],
    openGraph: {
        title: 'ESGGO善向永續 | 5T 永續治理系統',
        description: 'Berkeley Haas × TSISDA 跨界合作 — 5T 誠信協議驅動之 ESGGO善向永續自動化平台',
        siteName: 'ESGGO善向永續',
        locale: 'zh_TW',
        type: 'website',
    },
};
export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};
function LoadingFallback() {
    return (_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F8FAFC' }, children: [_jsxs("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }, children: [_jsx("div", { style: { width: 40, height: 40, borderRadius: '50%', border: '3px solid #003262', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' } }), _jsx("p", { style: { fontSize: 13, color: '#94A3B8', fontFamily: 'system-ui' }, children: "ESGGO\u5584\u5411\u6C38\u7E8C" })] }), _jsx("style", { children: `@keyframes spin { to { transform: rotate(360deg); } }` })] }));
}
export default function RootLayout({ children }) {
    return (_jsxs("html", { lang: "zh-TW", suppressHydrationWarning: true, children: [_jsxs("head", { children: [_jsx("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }), _jsx("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }), _jsx("link", { href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap", rel: "stylesheet" })] }), _jsx("body", { suppressHydrationWarning: true, children: _jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(AuthProvider, { children: _jsx(ClientLayout, { children: children }) }) }) })] }));
}
//# sourceMappingURL=layout.js.map