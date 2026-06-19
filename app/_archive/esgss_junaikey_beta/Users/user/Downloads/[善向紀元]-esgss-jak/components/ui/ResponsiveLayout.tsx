import React, { useState } from 'react';
import { View, Language } from '../../types';
import {
  ChevronRight, Command,
} from 'lucide-react';
import { useBreakpoint, useTouchDevice, responsivePatterns } from '../../src/utils/responsive';
import { cn } from '../../src/utils/responsive';

interface ResponsiveLayoutProps {
  currentView: View;
  onNavigate: (view: View) => void;
  children: React.ReactNode;
  language: Language;
  onToggleLanguage: () => void;
  isLoggedIn?: boolean;
  userName?: string;
  userLevel?: number;
  userAvatar?: string;
  onOpenCommand?: () => void;
  onToggleTheme?: () => void;
  themeLabel?: string;
}

// 響應式側邊導航組件
const ResponsiveSidebar: React.FC<{
  isCollapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}> = ({ isCollapsed, onToggle, children, isMobile, isOpen, onClose }) => {
  const sidebarClasses = isMobile
    ? cn(
        'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )
    : cn(
        'relative h-full transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      );

  return (
    <>
      {/* 移動端遮罩 */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full bg-slate-900/95 backdrop-blur-xl border-r border-white/10">
          {children}

          {/* 收起按鈕 - 桌面端 */}
          {!isMobile && (
            <button
              onClick={onToggle}
              className="absolute -right-3 top-8 w-6 h-6 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className={cn(
                'w-3 h-3 text-white/60 transition-transform',
                isCollapsed ? '' : 'rotate-180'
              )} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

// 響應式頂部導航
const ResponsiveHeader: React.FC<{
  children: React.ReactNode;
  isMobile?: boolean;
  onOpenSidebar?: () => void;
  onOpenCommand?: () => void;
}> = ({ children, isMobile, onOpenSidebar, onOpenCommand }) => {
  return (
    <header className="h-14 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 shrink-0 z-40">
      {/* 移動端漢堡選單 */}
      {isMobile && (
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
        >
          <div className="w-5 h-5 flex flex-col justify-center">
            <span className="block w-full h-0.5 bg-current mb-1"></span>
            <span className="block w-full h-0.5 bg-current mb-1"></span>
            <span className="block w-full h-0.5 bg-current"></span>
          </div>
        </button>
      )}

      <div className="flex items-center gap-4 lg:gap-8 flex-1 lg:flex-initial">
        {children}
      </div>

      {/* 命令面板按鈕 */}
      <button
        onClick={onOpenCommand}
        className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-white/60 hover:text-white shadow-sm transition-all hover:bg-white/10"
      >
        <Command className="w-4 h-4" />
      </button>
    </header>
  );
};

// 響應式佈局主組件
export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  currentView,
  onNavigate,
  children,
  language,
  onToggleLanguage,
  isLoggedIn = true,
  userName = 'User',
  userLevel = 1,
  userAvatar,
  onOpenCommand,
  onToggleTheme,
  themeLabel = 'Theme'
}) => {
  const { isMobile, isTablet } = useBreakpoint();
  const isTouchDevice = useTouchDevice();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  // 在移動端自動收起側邊欄
  React.useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(true);
    }
  }, [isMobile]);

  const handleNavigate = (view: View) => {
    onNavigate(view);
    // 在移動端導航後關閉側邊欄
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-900 text-white overflow-hidden">
      {/* 側邊導航 */}
      <ResponsiveSidebar
        isCollapsed={isSidebarCollapsed && !isMobile}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-center border-b border-white/10">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ESG</span>
          </div>
        </div>

        {/* 導航項目 - 這裡可以放置實際的導航項目 */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          {/* 將現有的導航邏輯放在這裡 */}
          <div className="space-y-2">
            {/* 示例導航項目 */}
            <button
              onClick={() => handleNavigate(View.MY_ESG)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all',
                currentView === View.MY_ESG
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <div className="w-5 h-5 bg-blue-500 rounded"></div>
              {!isSidebarCollapsed && <span className="text-sm">Dashboard</span>}
            </button>
            {/* 添加更多導航項目 */}
          </div>
        </nav>

        {/* 底部操作 */}
        <div className="p-3 border-t border-white/10 space-y-2">
          {/* 語言切換 */}
          <button
            onClick={onToggleLanguage}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="text-xs">{language === 'zh-TW' ? '中' : 'EN'}</span>
          </button>

          {/* 主題切換 */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <span className="text-xs">{themeLabel}</span>
            </button>
          )}
        </div>
      </ResponsiveSidebar>

      {/* 主內容區 */}
      <div className={cn(
        'flex-1 flex flex-col min-w-0 transition-all duration-300',
        isMobile ? 'ml-0' : (isSidebarCollapsed ? 'ml-16' : 'ml-64')
      )}>
        {/* 頂部導航 */}
        <ResponsiveHeader
          isMobile={isMobile}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenCommand={onOpenCommand}
        >
          {/* 頁面標題和用戶信息 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                ESG v16.1
              </span>
            </div>
          </div>

          {/* 用戶信息 */}
          {isLoggedIn && (
            <div className="flex items-center gap-3 p-1 pr-3 bg-white/5 border border-white/10 rounded-xl shadow-sm">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                {userAvatar ? (
                  <img src={userAvatar} className="w-full h-full object-cover" alt="Avatar" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-white truncate">{userName}</div>
                <div className="text-[10px] text-white/60">LV.{userLevel}</div>
              </div>
            </div>
          )}
        </ResponsiveHeader>

        {/* 主內容 */}
        <main className="flex-1 relative overflow-hidden">
          {/* 背景效果 */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-50"></div>

          {/* 內容容器 */}
          <div className="relative z-10 h-full p-4 lg:p-6">
            <div className="max-w-7xl mx-auto h-full">
              {children}
            </div>
          </div>
        </main>

        {/* 底部狀態欄 */}
        <footer className="h-8 border-t border-white/10 bg-slate-900/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-4 text-[10px] font-mono text-white/60 uppercase tracking-widest">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#10b981]"></div>
              KERNEL_STABLE
            </div>
            <span className="hidden sm:inline">RES: {isMobile ? 'MOBILE' : isTablet ? 'TABLET' : 'DESKTOP'}</span>
          </div>
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">
            © 2026 JUNAIKEY_OMNI_OS
          </div>
        </footer>
      </div>
    </div>
  );
};

// 響應式卡片組件
export const ResponsiveCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}> = ({ children, className, onClick, hover = true, padding = 'md' }) => {
  const paddingClasses = {
    sm: 'p-3 lg:p-4',
    md: 'p-4 lg:p-6',
    lg: 'p-6 lg:p-8'
  };

  return (
    <div
      className={cn(
        'bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg lg:rounded-xl transition-all duration-200',
        paddingClasses[padding],
        hover && 'hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// 響應式網格組件
export const ResponsiveGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}> = ({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md'
}) => {
  const gapClasses = {
    sm: 'gap-3 lg:gap-4',
    md: 'gap-4 lg:gap-6',
    lg: 'gap-6 lg:gap-8'
  };

  const colClasses = `grid-cols-${cols.mobile || 1} sm:grid-cols-${cols.tablet || 2} lg:grid-cols-${cols.desktop || 3}`;

  return (
    <div className={cn('grid', colClasses, gapClasses[gap], className)}>
      {children}
    </div>
  );
};