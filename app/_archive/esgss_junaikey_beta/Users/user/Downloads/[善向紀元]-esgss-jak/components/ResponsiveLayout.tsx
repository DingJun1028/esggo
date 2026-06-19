import React, { useState, useEffect } from 'react';
import { View, Language, ThemeMode, Permission } from '../types';
import {
  Home, Bot, Network, GraduationCap,
  ChevronRight, Zap, Command,
  Globe, DollarSign, Database,
  Settings, Binary, ListTodo, StickyNote, Target,
  Crown, Wallet, Users, Sun, Moon, Laptop, FileCode, Sparkles,
  Shield, Eye, Brain, Menu, X, Bell, Search
} from 'lucide-react';
import { AiAssistant } from './AiAssistant';
import { CommandPalette } from './CommandPalette';
import { useCompany } from './providers/CompanyProvider';
import { useTheme } from '../contexts/ThemeContext';
import { usePermissions } from '../hooks/usePermissions';
import { useResponsiveLayout } from '../hooks/useResponsive';

interface ResponsiveLayoutProps {
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

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  currentView,
  onNavigate,
  children,
  language,
  onToggleLanguage
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { userName, level, goodwillBalance } = useCompany();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { hasPermission } = usePermissions();
  const { layout, isMobile, isTablet, isDesktop } = useResponsiveLayout();

  const isZh = language === 'zh-TW';

  // 在移動端自動關閉側邊欄
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      const timer = setTimeout(() => setIsSidebarOpen(false), 100);
      return () => clearTimeout(timer);
    }
  }, [currentView, isMobile]);

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

  // 篩選導航項目
  const filteredSectors = navSectors.map(sector => ({
    ...sector,
    items: sector.items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
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

  const handleNavigation = (viewId: string | View) => {
    onNavigate(viewId);
    // 在移動端導航後關閉側邊欄
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="sidebar-layout min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* 移動端遮罩 */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 響應式側邊欄 */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''} ${isMobile ? 'md:hidden' : ''}`}>
        {/* 側邊欄頭部 */}
        <div className="flex items-center justify-center p-4 border-b border-slate-200">
          <LogoIcon className="w-8 h-8" />
          {!isMobile && (
            <span className="ml-3 text-lg font-bold text-slate-800">
              ESG 宇宙
            </span>
          )}
        </div>

        {/* 搜尋框 - 僅在展開時顯示 */}
        {isSidebarOpen && !isMobile && (
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={isZh ? '搜尋功能...' : 'Search features...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {/* 導航菜單 */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {filteredSectors.map((sector, idx) => (
            <div key={idx} className="mb-6">
              {isSidebarOpen && !isMobile && (
                <div className="text-xs font-bold text-slate-500 mb-3 px-3 uppercase tracking-wider">
                  {sector.title}
                </div>
              )}
              {sector.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center mb-1 transition-all duration-200 rounded-lg relative group ${
                    currentView === item.id
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  style={{
                    padding: isMobile ? '12px 16px' : '8px 12px',
                    justifyContent: isSidebarOpen || isMobile ? 'flex-start' : 'center'
                  }}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${
                    currentView === item.id ? 'text-indigo-600' : 'group-hover:scale-110'
                  }`} />
                  {(isSidebarOpen || isMobile) && (
                    <span className="ml-3 text-sm font-medium truncate">
                      {item.label}
                    </span>
                  )}
                  {currentView === item.id && (
                    <div className="absolute right-2 w-2 h-2 rounded-full bg-indigo-600" />
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* 側邊欄底部 */}
        <div className="border-t border-slate-200 p-2">
          {/* 主題切換 */}
          <button
            onClick={nextTheme}
            className="w-full flex items-center p-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
            style={{ justifyContent: isSidebarOpen || isMobile ? 'flex-start' : 'center' }}
          >
            {themeIcons[theme]}
            {(isSidebarOpen || isMobile) && (
              <span className="ml-3 text-sm font-medium">
                {getThemeLabel(theme)}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* 主內容區 */}
      <main className="main-content flex-1 flex flex-col min-w-0">
        {/* 響應式頂部導航 */}
        <header className="top-nav sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between h-16">
            {/* 左側：漢堡菜單和標題 */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="menu-toggle p-2 mr-4 text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
                aria-label={isZh ? '開關選單' : 'Toggle menu'}
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-indigo-600 animate-pulse" />
                <span className="text-sm font-semibold text-slate-800">
                  ESG 智慧平台 v2.0
                </span>
              </div>
            </div>

            {/* 右側：操作按鈕和用戶信息 */}
            <div className="flex items-center gap-3">
              {/* 搜尋按鈕 - 僅在桌面上顯示 */}
              {!isMobile && (
                <button
                  onClick={() => setIsCommandOpen(true)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label={isZh ? '全域搜尋' : 'Global search'}
                >
                  <Command className="w-5 h-5" />
                </button>
              )}

              {/* 通知按鈕 */}
              <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* 用戶資訊 */}
              <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-300">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${level}`}
                    className="w-full h-full object-cover"
                    alt={isZh ? '用戶頭像' : 'User avatar'}
                  />
                </div>
                {!isMobile && (
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-slate-900">{userName}</div>
                    <div className="text-xs text-slate-500">
                      LV.{level} • {goodwillBalance.toLocaleString()} GWC
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* 主要內容區域 */}
        <div className="flex-1 relative overflow-auto">
          {/* 動態背景效果 */}
          {resolvedTheme === 'cosmic' && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            </div>
          )}

          <div className="relative z-10 p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto">
              {children}
            </div>
          </div>
        </div>

        {/* 響應式底部導航 (僅在移動端顯示) */}
        {isMobile && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-bottom">
            <div className="flex justify-around items-center h-16">
              {[
                { id: View.MY_ESG, icon: Home, label: isZh ? '首頁' : 'Home' },
                { id: View.DASHBOARD, icon: Target, label: isZh ? '儀表板' : 'Dashboard' },
                { id: View.CARD_GAME_ARENA_NEW, icon: Sparkles, label: isZh ? '競技場' : 'Arena' },
                { id: View.SETTINGS, icon: Settings, label: isZh ? '設定' : 'Settings' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 transition-colors ${
                    currentView === item.id
                      ? 'text-indigo-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <item.icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        )}

        {/* 響應式底部邊距 (為移動端底部導航留出空間) */}
        {isMobile && <div className="h-16" />}
      </main>

      {/* AI 助手和命令面板 */}
      <AiAssistant language={language} onNavigate={onNavigate} currentView={currentView} />
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigate={onNavigate}
        language={language}
        toggleLanguage={onToggleLanguage}
      />
    </div>
  );
};