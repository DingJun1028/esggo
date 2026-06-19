'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Scale,
    UserCircle,
    Settings,
    Search,
    Globe,
    Menu,
    X,
    ArrowLeft,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Zap,
    LogOut,
    FileText,
    BookOpen,
    TrendingUp,
    Library
} from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useLanguage } from '@/components/LanguageProvider';
import JunAiKey from '@/components/JunAiKey';
import SentientFeedback from '@/components/SentientFeedback';
import { OmniAgent } from '@/core/OmniAgent';
import NotificationCenter from '@/components/NotificationCenter';
import UserStatusBar from '@/components/UserStatusBar';
import { MangaJourney } from '@/components/omni/education/MangaJourney';

const mainNavIds = [
    { id: 'synthesis_dashboard', icon: LayoutDashboard, href: '/synthesis/dashboard', fallbackLabel: 'ESG Go # 善向永續報告中心' },
    { id: 'report_center', icon: Library, href: '/omni/report-center', fallbackLabel: '永續報告中樞 (Report Center)' },
    { id: 'data_forge', icon: BookOpen, href: '/omni/reports/data-forge', fallbackLabel: '資料煉製所 (Data Forge)' },
    { id: 'verification_sanctum', icon: ShieldCheck, href: '/omni/reports/verification', fallbackLabel: '驗算聖殿 (Sanctum)' },
    { id: 'report_factory', icon: FileText, href: '/omni/reports/factory', fallbackLabel: '報告鑄造廠 (Factory)' },
    { id: 'publication_agora', icon: Globe, href: '/omni/reports/agora', fallbackLabel: '發布廣場 (Agora)' },
    { id: 'bi_analytics', icon: TrendingUp, href: '/omni/bi-analytics', fallbackLabel: '效能中樞 (Performance Hub)' },
    { id: 'insight_think_tank', icon: Sparkles, href: '/omni/reports/insights', fallbackLabel: '洞察智庫 (Think Tank)' },
];

export default function MasterLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { locale, setLocale, t } = useLanguage();
    const [whisper, setWhisper] = useState('');
    const { data: session, status } = useSession();

    const toggleLanguage = () => {
        setLocale(locale === 'en' ? 'zh-TW' : 'en');
    };

    // 📱 Adaptive Viewport Detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) setIsCollapsed(true);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Keep mobile menu closed on path change
    useEffect(() => {
        setIsMobileMenuOpen(false);

        // 🤖 Sentient Whisper Manifestation
        const states = ['IDLE', 'FORGING'];
        const mockAgent = OmniAgent.forgeAgent("Sentinel Alpha", "SENTINEL", "STOIC", {} as any);
        setWhisper(OmniAgent.generateWhisper(mockAgent, states[Math.floor(Math.random() * states.length)]));
    }, [pathname]);

    // 🌊 Get resonant color based on path - Refined for premium light mode
    const getResonantColor = () => {
        if (pathname.includes('governance')) return 'rgba(99, 166, 176, 0.08)';
        if (pathname.includes('impact')) return 'rgba(16, 185, 129, 0.05)';
        if (pathname.includes('eternal')) return 'rgba(234, 179, 8, 0.05)';
        if (pathname.includes('agency')) return 'rgba(59, 130, 246, 0.05)';
        if (pathname.includes('excellence')) return 'rgba(16, 185, 129, 0.06)'; // Emerald resonance
        return 'rgba(99, 166, 176, 0.03)';
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollContainer = document.querySelector('main');
            if (!scrollContainer) return;

            const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
            if (scrollTop + clientHeight >= scrollHeight - 30) {
                setIsScrolledToBottom(true);
            } else {
                setIsScrolledToBottom(false);
            }
        };

        const container = document.querySelector('main');
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [pathname]);

    // Hide chrome on the landing page
    if (pathname === '/') return <>{children}</>;

    const navItems = mainNavIds.map(item => ({
        ...item,
        label: (t.nav && (t.nav as any)[item.id]) || item.fallbackLabel
    }));

    // Logic for "左右換欄" (Floating Category Switcher)
    const currentNavIndex = mainNavIds.findIndex(item => pathname.startsWith(item.href));

    const navigateLanes = (direction: 'left' | 'right') => {
        let nextIndex = currentNavIndex;
        if (direction === 'left') {
            nextIndex = currentNavIndex > 0 ? currentNavIndex - 1 : mainNavIds.length - 1;
        } else {
            nextIndex = currentNavIndex < mainNavIds.length - 1 ? currentNavIndex + 1 : 0;
        }
        router.push(mainNavIds[nextIndex].href);
    };

    return (
        <div className="flex h-[100dvh] font-sans overflow-hidden transition-colors duration-500 bg-[var(--theme-bg)] text-[var(--theme-text-main)]">
            {/* 🌌 Global Resonance Background - Apple Style Subtlety (Refined for Light Mode) */}
            <div
                className="fixed inset-0 pointer-events-none transition-colors duration-1000 z-0"
                style={{
                    background: `radial-gradient(circle at 50% -10%, ${getResonantColor()} 0%, transparent 70%)`
                }}
            />

            {/* <SentientFeedback message={whisper} agentName="Sentinel-01" /> */}

            {/* 🛡️ Sidebar - Desktop (Static) & Mobile (Drawer) */}
            <AnimatePresence>
                {(isMobileMenuOpen || !isMobile) && (
                    <motion.aside
                        initial={isMobile ? { y: "-100%" } : { x: -300 }}
                        animate={{
                            x: 0,
                            y: 0,
                            width: isMobile ? '100vw' : (isCollapsed ? 80 : 260)
                        }}
                        exit={isMobile ? { y: "-100%", opacity: 0 } : { x: -300, opacity: 0 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                        className={`fixed lg:sticky top-0 left-0 z-[60] flex flex-col liquid-glass ${isMobileMenuOpen ? 'w-full m-0 rounded-b-[2.5rem] h-auto pb-4 shadow-2xl backdrop-blur-3xl border-b border-omni-glass-border' : 'hidden lg:flex lg:h-full border-r border-omni-glass-border'}`}
                        style={{ background: 'var(--theme-surface)' }}
                    >
                        <div className="p-6 mb-4 flex items-center justify-between">
                            <AnimatePresence mode="wait">
                                {(!isCollapsed || isMobileMenuOpen) && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="size-10 bg-[var(--theme-primary)] rounded-xl flex items-center justify-center text-white shadow-[0_8px_20px_-4px_rgba(99,166,176,0.4)]">
                                            <LayoutDashboard size={20} />
                                        </div>
                                        <div>
                                            <h1 className="text-omni-text-main text-lg font-black tracking-tight leading-none bg-gradient-to-r from-omni-text-main to-omni-primary bg-clip-text text-transparent">ESG Go</h1>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-omni-primary text-[9px] uppercase tracking-[0.25em] font-black">OmniCenter</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Collapse Toggle (Desktop only) */}
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="hidden lg:block p-2 rounded-xl transition-all text-omni-text-muted hover:text-omni-primary hover:bg-omni-primary-muted"
                            >
                                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                            </button>

                            {/* Close Menu (Mobile only) */}
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="lg:hidden p-2 rounded-xl transition-colors text-omni-text-main hover:bg-omni-surface-2"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={`flex items-center p-3 rounded-2xl group transition-all ${isActive ? 'bg-slate-900 text-white shadow-lg shadow-black/20' : 'text-omni-text-sub hover:bg-omni-primary-muted hover:text-omni-primary'} ${isCollapsed && !isMobileMenuOpen ? 'justify-center' : 'gap-4'}`}
                                    >
                                        <Icon size={20} className={isActive ? 'text-[var(--theme-primary)]' : 'group-hover:text-omni-primary text-omni-text-sub'} />
                                        {(!isCollapsed || isMobileMenuOpen) && (
                                            <span className={`font-bold tracking-tight text-sm truncate whitespace-nowrap ${isActive ? 'text-white' : 'text-inherit'}`}>
                                                {item.label}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 mt-auto border-t border-omni-glass-border">
                            {status === 'authenticated' && session?.user ? (
                                <div className={`flex items-center p-2 rounded-2xl bg-omni-surface-2 ${isCollapsed && !isMobileMenuOpen ? 'justify-center' : 'gap-3'}`}>
                                    {session.user.image ? (
                                        <img 
                                            src={session.user.image} 
                                            alt={session.user.name || ''} 
                                            className="w-9 h-9 rounded-full ring-2 ring-omni-primary/10" 
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                if (fallback) fallback.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div 
                                        className="w-9 h-9 rounded-full bg-omni-primary-muted items-center justify-center text-xs font-bold text-omni-primary"
                                        style={{ display: session.user.image ? 'none' : 'flex' }}
                                    >
                                        {session.user.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    {(!isCollapsed || isMobileMenuOpen) && (
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-bold truncate text-omni-text-main">{session.user.name}</p>
                                            <button
                                                onClick={() => signOut({ callbackUrl: '/' })}
                                                className="text-[10px] uppercase tracking-widest text-omni-primary font-black hover:underline"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => signIn('google', { callbackUrl: '/auth/signin' })}
                                    className={`w-full flex items-center p-3 rounded-2xl bg-omni-text-main text-white hover:opacity-90 transition-opacity ${isCollapsed && !isMobileMenuOpen ? 'justify-center' : 'gap-3'}`}
                                >
                                    <UserCircle size={20} />
                                    {(!isCollapsed || isMobileMenuOpen) && (
                                        <span className="text-sm font-bold">Sign In</span>
                                    )}
                                </button>
                            )}
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-[var(--theme-surface)]/20 backdrop-blur-sm z-[55] lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* 🏔️ Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0">
                <UserStatusBar />
                {/* 🛠️ Top Bar (Responsive) */}
                <header className="h-16 shrink-0 flex items-center justify-between px-4 lg:px-8 backdrop-blur-3xl sticky top-0 z-40 border-b border-omni-glass-border bg-[var(--theme-glass-bg)]">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button / Home Icon */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-xl text-omni-primary bg-omni-primary-muted hover:bg-omni-primary/20 transition-colors"
                        >
                            <Menu size={22} />
                        </button>

                        <AnimatePresence mode="wait">
                            {pathname !== '/' && !['/synthesis/dashboard'].includes(pathname) && (
                                <motion.button
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    onClick={() => router.back()}
                                    className="p-2 px-4 rounded-xl transition-all hover:bg-omni-primary-muted text-omni-text-main border border-omni-glass-border flex items-center gap-2 group z-50 mr-2 bg-omni-surface shadow-sm"
                                    title={t.common?.back || "Back"}
                                >
                                    <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                                    <span className="hidden sm:inline text-xs font-black uppercase tracking-wider">{t.common?.back || "Back"}</span>
                                </motion.button>
                            )}
                        </AnimatePresence>

                        <div className="hidden sm:flex items-center rounded-2xl px-4 py-2 gap-3 transition-all bg-omni-surface-2 border border-omni-glass-border focus-within:ring-2 focus-within:ring-omni-primary/20 focus-within:bg-omni-surface">
                            <Search size={16} className="text-omni-text-muted" />
                            <input type="text" placeholder={t.common.search} className="bg-transparent border-none outline-none text-sm w-32 md:w-64 placeholder-omni-text-muted text-omni-text-main font-medium" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4">
                        <NotificationCenter />

                        <Link href="/settings" className="p-2 rounded-xl transition-all hover:bg-omni-primary-muted text-omni-text-sub hover:text-omni-primary">
                            <Settings size={20} />
                        </Link>
                    </div>
                </header>

                {/* 🧱 Page Content */}
                <main className="flex-1 p-4 lg:p-10 overflow-y-auto overflow-x-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, scale: 0.995 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.995 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* 🌌 Apple Minimalist Bottom Console (Mobile) */}
                {isMobile && (
                    <div className="shrink-0 bg-omni-surface border-t border-omni-glass-border relative z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
                        <div className="h-28 px-4 flex items-center justify-center relative z-10 w-full mb-safe">
                            <nav className="flex items-center justify-between w-full max-w-[420px] px-4 py-2 bg-omni-surface/80 backdrop-blur-3xl rounded-full border border-omni-glass-border shadow-2xl mb-4">
                                <Link
                                    href="/synthesis/dashboard"
                                    className="w-11 h-11 flex items-center justify-center hover:bg-omni-primary-muted rounded-full text-omni-text-main active:scale-90 transition-all group"
                                    aria-label="Dashboard"
                                >
                                    <LayoutDashboard size={20} className={pathname === '/synthesis/dashboard' ? 'text-omni-primary' : ''} />
                                </Link>

                                <button onClick={() => navigateLanes('left')} className="w-11 h-11 flex items-center justify-center hover:bg-omni-primary-muted rounded-full text-omni-text-sub active:scale-95 transition-transform" aria-label="Previous">
                                    <ArrowLeft size={20} />
                                </button>

                                <button onClick={() => window.dispatchEvent(new CustomEvent('toggle-junaikey'))} className="w-14 h-14 bg-omni-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-omni-primary/40 active:scale-90 mx-1 relative" aria-label="JunAiKey" style={{ boxShadow: '0 0 20px rgba(99,166,176,0.5)' }}>
                                    <div className="absolute inset-0 rounded-full bg-omni-primary/30 blur-md animate-pulse" />
                                    <Sparkles size={24} className="relative z-10" />
                                </button>

                                <button onClick={() => navigateLanes('right')} className="w-11 h-11 flex items-center justify-center hover:bg-omni-primary-muted rounded-full text-omni-text-sub active:scale-95 transition-transform" aria-label="Next">
                                    <ArrowRight size={20} />
                                </button>

                                <Link
                                    href="/settings"
                                    className="w-11 h-11 flex items-center justify-center hover:bg-omni-primary-muted rounded-full text-omni-text-main active:scale-90 transition-all group"
                                    aria-label="Settings"
                                >
                                    <Settings size={20} className={pathname === '/settings' ? 'text-omni-primary' : ''} />
                                </Link>
                            </nav>
                        </div>
                    </div>
                )}
            </div>

            {/* 🗝️ Global JunAiKey & 📚 MangaJourney */}
            <JunAiKey hideOrb />
            <MangaJourney />
        </div>
    );
}
