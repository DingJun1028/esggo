"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '../../components/omni/UI/ThemeToggle';
import AuthMenu from '../../components/omni/UI/AuthMenu';
import { ToastProvider } from '../../components/omni/liquid-glass/ToastProvider';
import NotificationCenter from '../../components/NotificationCenter';
import { MangaJourney } from '../../components/omni/education/MangaJourney';

import {
    Home,
    FileText,
    BarChart2,
    Bot,
    Users,
    Layers,
    BookOpen,
    Sparkles
} from 'lucide-react';

const NAV_LINKS = [
    { href: "/omni", label: "Hub", icon: <Home size={18} /> },
    { href: "/omni/reports", label: "永續報告", icon: <FileText size={18} /> },
    // { href: "/omni/bi-analytics", label: "BI 分析", icon: <BarChart2 size={18} /> },
    // { href: "/omni/agentic-twin", label: "Agentic Twin", icon: <Bot size={18} /> },
    // { href: "/omni/impact-village", label: "善向村", icon: <Users size={18} /> },
    // { href: "/omni/cards", label: "萬能卡牌", icon: <Layers size={18} /> },
    { href: "/omni/resource-center", label: "資源中心", icon: <BookOpen size={18} />, highlight: false },
    { href: "/omni/jules", label: "Jules AI", icon: <Sparkles size={18} />, highlight: true },
];

export default function OmniUniverseLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <ToastProvider>
            <div className="min-h-screen bg-omni-bg text-omni-text-main overflow-x-hidden relative selection:bg-omni-primary/30">

                {/* 背景大氣效果 */}
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-omni-primary/10 blur-[120px] animate-float opacity-70" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-omni-primary/5 blur-[150px] animate-float opacity-50" style={{ animationDelay: '2s' }} />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
                </div>

                <div className="relative z-10 flex flex-col min-h-screen">

                    {/* ── Header ── */}
                    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-omni-bg/40 border-b border-omni-glass-border">
                        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">

                            {/* Logo */}
                            <Link href="/omni" className="flex items-center gap-2.5 flex-none">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-omni-primary to-blue-400 shadow-[0_0_15px_var(--theme-primary)]" />
                                <div className="flex flex-col leading-tight">
                                    <span className="text-base sm:text-lg font-mono font-medium tracking-wide text-omni-text-main">
                                        ESG GO <span className="text-omni-primary font-bold">善向永續報告中心</span>
                                    </span>
                                    <span className="hidden sm:block text-[0.6rem] text-omni-text-muted tracking-widest">
                                        OmniOne × JunAiKey
                                    </span>
                                </div>
                            </Link>

                            {/* 桌機導覽 */}
                            <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-omni-text-muted">
                                {NAV_LINKS.map(l => (
                                    <Link key={l.href + l.label} href={l.href}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 hover:bg-omni-primary/5 hover:text-omni-primary ${l.highlight ? "text-omni-primary font-bold bg-omni-primary/10 shadow-sm" : "text-omni-text-muted"}`}>
                                        <span className="opacity-70">{l.icon}</span>
                                        <span className="tracking-tight">{l.label}</span>
                                    </Link>
                                ))}
                            </nav>

                            {/* 右側控制 */}
                            <div className="flex items-center gap-2 sm:gap-4">
                                <NotificationCenter />
                                <AuthMenu />
                                <ThemeToggle />
                                <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-omni-primary/60">
                                    <span>[STABILIZED]</span>
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                                </div>
                                {/* 漢堡選單按鈕 (手機) */}
                                <button
                                    onClick={() => setMobileOpen(v => !v)}
                                    className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg border border-omni-glass-border bg-omni-glass-bg"
                                    aria-label="開啟選單"
                                >
                                    <span className={`block w-5 h-0.5 bg-omni-text-main transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
                                    <span className={`block w-5 h-0.5 bg-omni-text-main transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
                                    <span className={`block w-5 h-0.5 bg-omni-text-main transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                                </button>
                            </div>
                        </div>

                        {/* 行動端下拉選單 */}
                        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? "max-h-96" : "max-h-0"}`}>
                            <nav className="px-4 pb-4 flex flex-col gap-1 border-t border-omni-glass-border pt-3">
                                {NAV_LINKS.map(l => (
                                    <Link key={l.href + l.label} href={l.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-omni-primary/10 ${l.highlight ? "text-omni-primary font-bold bg-omni-primary/5" : "text-omni-text-muted hover:text-omni-primary"}`}>
                                        <span className="opacity-70">{l.icon}</span>
                                        <span className="text-sm font-medium tracking-tight">{l.label}</span>
                                    </Link>
                                ))}
                                {/* 行動端 status */}
                                <div className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-omni-primary/50 mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <span>SYSTEM STABILIZED</span>
                                </div>
                            </nav>
                        </div>
                    </header>

                    {/* 頁面內容 */}
                    <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 flex flex-col">
                        {children}
                    </main>

                    <MangaJourney />
                </div>
            </div>
        </ToastProvider>
    );
}
