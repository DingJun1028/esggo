
import React, { useState } from 'react';
import { View, Language, ThemeMode, Permission } from '../types';
import {
  Home, Bot, Network, GraduationCap,
  ChevronRight, Zap, Command,
  Globe, DollarSign, Database,
  Settings, Binary, ListTodo, StickyNote, Target,
  Crown, Wallet, Users, Sun, Moon, Laptop, FileCode, Sparkles,
  Shield, Eye, Brain
} from 'lucide-react';
import { AiAssistant } from './AiAssistant';
import { CommandPalette } from './CommandPalette';
import { useCompany } from './providers/CompanyProvider';
import { useTheme } from '../contexts/ThemeContext';
import { usePermissions } from '../hooks/usePermissions';

interface LayoutProps {
  currentView: View;
  onNavigate: (view: string | View) => void;
  children: React.ReactNode;
  language: Language;
  onToggleLanguage: () => void;
}

export const LogoIcon = ({ className }: { className?: string }) => (
  <div className={`flex items-center justify-center overflow-hidden rounded-md transition-all duration-500 ${className}`}>
    <img src="https://thumbs4.imagebam.com/a0/c1/da/ME18W0T0_t.PNG" alt="Logo" className="w-full h-full object-contain dark:invert-0 invert" />
  </div>
);

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children, language, onToggleLanguage }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const { userName, level, goodwillBalance } = useCompany();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { hasPermission } = usePermissions();
  const isZh = language === 'zh-TW';

  const allNavItems = [
    // CORE sector with permissions
    { sector: 'CORE', id: 'genesis_prime_os', icon: Shield, label: isZh ? '創世紀 OS' : 'Genesis OS', permission: Permission.VIEW_GENESIS_PRIME_OS },
    { sector: 'CORE', id: 'omni_context_engine', icon: Network, label: isZh ? '脈絡引擎' : 'Context Engine', permission: Permission.VIEW_OMNI_CONTEXT_ENGINE },
    { sector: 'CORE', id: 'omni_sovereign_governance', icon: Crown, label: isZh ? '主權治理' : 'Sovereign Gov', permission: Permission.VIEW_OMNI_SOVEREIGN_GOVERNANCE },
    { sector: 'CORE', id: 'foundational_intelligence', icon: Brain, label: isZh ? '基礎智慧' : 'Intelligence', permission: Permission.VIEW_FOUNDATIONAL_INTELLIGENCE },
    // CMD sector
    { sector: 'CMD', id: View.MY_ESG, icon: Home, label: isZh ? '北極星' : 'Cockpit', permission: Permission.VIEW_MY_ESG },
    { sector: 'CMD', id: View.HYPERCUBE_LAB, icon: Binary, label: isZh ? 'AI 實驗室' : 'AI Lab', permission: Permission.VIEW_UNIVERSAL_AGENT },
    { sector: 'CMD', id: View.CARD_GAME_ARENA_NEW, icon: Target, label: isZh ? 'ESG競技場' : 'ESG Arena', permission: Permission.VIEW_DASHBOARD },
    { sector: 'CMD', id: View.CARD_ARENA, icon: Sparkles, label: isZh ? '萬能卡牌' : 'Omni Cards', permission: Permission.VIEW_DASHBOARD },
    { sector: 'CMD', id: View.FINANCE, icon: DollarSign, label: isZh ? '財務' : 'Finance', permission: Permission.VIEW_DASHBOARD },
    { sector: 'CMD', id: View.CARBON_WALLET, icon: Wallet, label: isZh ? '碳錢包' : 'Wallet', permission: Permission.VIEW_DASHBOARD },
    { sector: 'CMD', id: View.BUSINESS_INTEL, icon: Globe, label: isZh ? 'AMICE' : 'AMICE', permission: Permission.VIEW_RESEARCH_HUB },
    { sector: 'CMD', id: View.RESEARCH_HUB, icon: Database, label: isZh ? 'RAG' : 'RAG', permission: Permission.VIEW_RESEARCH_HUB },
    { sector: 'CMD', id: View.UNIVERSAL_NOTES, icon: StickyNote, label: isZh ? '筆記' : 'Notes', permission: Permission.VIEW_DASHBOARD },
    { sector: 'CMD', id: View.AGENT_TASKS, icon: ListTodo, label: isZh ? '任務' : 'Tasks', permission: Permission.VIEW_DASHBOARD },
    // SYS sector
    { sector: 'CMD', id: View.ACADEMY, icon: GraduationCap, label: isZh ? '學院' : 'Academy', permission: Permission.VIEW_DASHBOARD },
    { sector: 'CMD', id: View.TECHNICAL_DOCS, icon: FileCode, label: isZh ? '聖典' : 'Docs', permission: Permission.VIEW_DASHBOARD },
    { sector: 'SYS', id: View.ADMIN_PANEL, icon: Crown, label: isZh ? '管理端' : 'Admin', permission: Permission.ADMIN_ACCESS },
    { sector: 'SYS', id: View.SETTINGS, icon: Settings, label: isZh ? '設定' : 'Config', permission: Permission.VIEW_DASHBOARD },
  ];

  // Filter items based on permissions
  const filteredNavItems = allNavItems.filter(item => hasPermission(item.permission));

  // Group by sector
  const navSectors = ['CORE', 'CMD', 'SYS'].map(sectorTitle => ({
    title: sectorTitle,
    items: filteredNavItems.filter(item => item.sector === sectorTitle)
  })).filter(sector => sector.items.length > 0);

  const themeIcons = {
      light: <Sun className="w-4 h-4 text-amber-500" />,
      dark: <Moon className="w-4 h-4 text-blue-400" />,
      cosmic: <Sparkles className="w-4 h-4 text-purple-400" />,
      system: <Laptop className="w-4 h-4 text-slate-500" />
  };

  const nextTheme = () => {
      const modes: ThemeMode[] = ['cosmic', 'light', 'dark', 'system'];
      const nextIndex = (modes.indexOf(theme) + 1) % modes.length;
      setTheme(modes[nextIndex]);
  };

  const getThemeLabel = (t: ThemeMode) => {
      switch(t) {
          case 'cosmic': return isZh ? '宇宙' : 'Cosmic';
          case 'light': return isZh ? '白晝' : 'Day';
          case 'dark': return isZh ? '黑夜' : 'Night';
          case 'system': return isZh ? '系統' : 'Auto';
      }
  };

  return (
    <div className="flex h-screen w-screen bg-app-bg text-app-text overflow-hidden select-none font-sans transition-colors duration-700">
        {/* 側邊導航 */}
        <aside className={`flex flex-col flex-shrink-0 transition-all duration-500 border-r border-app-border 
            ${resolvedTheme === 'light' ? 'bg-white shadow-xl' : 'bg-app-surface backdrop-blur-3xl'} 
            z-[160] ${isSidebarCollapsed ? 'w-[64px]' : 'w-[200px]'}`}
        >
            <div className="h-14 flex items-center justify-center border-b border-app-border">
                <LogoIcon className="w-7 h-7" />
            </div>
            <nav className="flex-1 overflow-y-auto no-scrollbar py-6">
                {navSectors.map((sector, idx) => (
                    <div key={idx} className="mb-6 px-3">
                        {!isSidebarCollapsed && <div className="text-[8px] font-black text-app-subtext mb-2 pl-2 tracking-widest">{sector.title}</div>}
                        {sector.items.map(item => (
                            <button 
                                key={item.id} 
                                onClick={() => onNavigate(item.id)} 
                                className={`w-full flex items-center mb-1 transition-all duration-300 p-2.5 rounded-xl relative group 
                                    ${currentView === item.id 
                                        ? 'bg-app-accent/10 text-app-text' 
                                        : 'text-app-subtext hover:bg-app-surface hover:text-app-text'}`}
                            >
                                <item.icon className={`w-5 h-5 shrink-0 ${currentView === item.id ? 'text-app-accent' : 'group-hover:scale-110'}`} />
                                {!isSidebarCollapsed && <span className="ml-4 text-xs font-bold uppercase truncate tracking-widest">{item.label}</span>}
                                {currentView === item.id && <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-app-accent shadow-[0_0_10px_var(--accent-color)]" />}
                            </button>
                        ))}
                    </div>
                ))}
            </nav>
            
            <button onClick={nextTheme} className="m-3 h-12 flex items-center justify-center rounded-xl bg-app-surface border border-app-border text-app-subtext hover:text-app-accent transition-all group relative overflow-hidden">
                {themeIcons[theme]}
                {!isSidebarCollapsed && <span className="ml-4 text-[10px] font-black uppercase tracking-widest">{getThemeLabel(theme)}</span>}
                <div className="absolute inset-0 bg-app-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="h-12 border-t border-app-border flex items-center justify-center text-app-subtext hover:text-app-text transition-all">
                <ChevronRight className={`w-4 h-4 transition-transform ${!isSidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
        </aside>

        {/* 主內容區 */}
        <main className="flex-1 flex flex-col min-w-0 bg-app-bg relative transition-colors duration-500">
            <header className="h-14 border-b border-app-border bg-app-bg/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-[150]">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 px-3 py-1 bg-app-surface border border-app-border rounded-lg">
                        <Zap className="w-3.5 h-3.5 text-app-accent animate-pulse" />
                        <span className="text-[9px] font-black text-app-subtext uppercase tracking-widest">v16.1_{resolvedTheme.toUpperCase()}</span>
                    </div>
                    <div className="flex gap-6 font-mono">
                        <div className="flex flex-col">
                            <span className="text-[7px] text-app-subtext uppercase font-black tracking-tighter">Resonance_LV</span>
                            <span className="text-xs font-bold text-app-text">LV.{level}</span>
                        </div>
                        <div className="flex flex-col border-l border-app-border pl-6">
                            <span className="text-[7px] text-app-subtext uppercase font-black tracking-tighter">Balance_GWC</span>
                            <span className="text-xs font-bold text-celestial-gold">{goodwillBalance.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={() => setIsCommandOpen(true)} className="p-2.5 bg-app-surface rounded-xl border border-app-border text-app-subtext hover:text-app-text shadow-sm transition-all">
                        <Command className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3 p-1 pr-3 bg-app-surface border border-app-border rounded-xl shadow-sm">
                        <div className="w-7 h-7 rounded-lg overflow-hidden border border-app-border">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${level}`} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className="text-[10px] font-black text-app-text uppercase">{userName}</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 relative overflow-hidden bg-app-bg transition-colors duration-500">
                {/* Dynamic Background Effects based on Theme */}
                {resolvedTheme === 'cosmic' && (
                    <div className="absolute inset-0 transition-opacity duration-1000 opacity-100">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.15)_0%,rgba(2,6,23,1)_100%)] pointer-events-none" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                    </div>
                )}
                
                {resolvedTheme === 'light' && (
                    <div className="absolute inset-0 transition-opacity duration-1000 opacity-100">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                    </div>
                )}

                {resolvedTheme === 'dark' && (
                    <div className="absolute inset-0 transition-opacity duration-1000 opacity-100">
                         {/* Standard dark mode background, simpler than cosmic */}
                         <div className="absolute inset-0 bg-slate-900" />
                    </div>
                )}
                
                <div className="relative z-10 h-full p-6 flex flex-col">
                    <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col min-h-0">
                        {children}
                    </div>
                </div>
            </div>

            <footer className="h-6 border-t border-app-border bg-app-surface backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-[50]">
                <div className="flex items-center gap-4 text-[8px] font-mono text-app-subtext uppercase tracking-widest">
                    <div className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" /> KERNEL_STABLE</div>
                    <span>THEME: {getThemeLabel(theme).toUpperCase()}</span>
                </div>
                <div className="text-[8px] font-mono text-app-subtext uppercase tracking-tighter">© 2026 JUNAIKEY_OMNI_OS</div>
            </footer>
        </main>

        <AiAssistant language={language} onNavigate={onNavigate} currentView={currentView} />
        <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} onNavigate={onNavigate} language={language} toggleLanguage={onToggleLanguage} />
    </div>
  );
};
