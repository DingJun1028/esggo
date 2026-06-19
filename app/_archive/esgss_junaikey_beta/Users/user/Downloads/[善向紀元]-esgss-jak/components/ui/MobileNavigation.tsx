import React, { useState } from 'react';
import { View } from '../../types';
import { useBreakpoint, useTouchDevice } from '../../src/utils/responsive';
import { cn } from '../../src/utils/responsive';
import {
  Home,
  BarChart3,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  User,
  ChevronRight
} from 'lucide-react';

interface MobileNavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
  language: 'zh-TW' | 'en-US';
  userName?: string;
  userLevel?: number;
  notificationCount?: number;
}

// 移動端底部導航
export const MobileBottomNav: React.FC<MobileNavigationProps> = ({
  currentView,
  onNavigate,
  language,
  userName = 'User',
  userLevel = 1,
  notificationCount = 0
}) => {
  const isZh = language === 'zh-TW';

  const navItems = [
    {
      id: View.MY_ESG,
      icon: Home,
      label: isZh ? '首頁' : 'Home',
      active: currentView === View.MY_ESG
    },
    {
      id: View.RESEARCH_HUB,
      icon: Search,
      label: isZh ? '搜尋' : 'Search',
      active: currentView === View.RESEARCH_HUB
    },
    {
      id: View.ANALYTICS,
      icon: BarChart3,
      label: isZh ? '分析' : 'Analytics',
      active: currentView === View.ANALYTICS
    },
    {
      id: View.SETTINGS,
      icon: Settings,
      label: isZh ? '設定' : 'Settings',
      active: currentView === View.SETTINGS
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-white/10">
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              'flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px]',
              item.active
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            )}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// 移動端側滑選單
export const MobileDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}> = ({ isOpen, onClose, children, title }) => {
  return (
    <>
      {/* 遮罩 */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* 側滑選單 */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-slate-900 border-l border-white/10 z-50',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* 標題欄 */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* 內容 */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

// 移動端頂部工具欄
export const MobileToolbar: React.FC<{
  title: string;
  onOpenMenu?: () => void;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  notificationCount?: number;
}> = ({
  title,
  onOpenMenu,
  onOpenSearch,
  onOpenNotifications,
  onOpenProfile,
  notificationCount = 0
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 safe-area-top">
      <div className="flex items-center justify-between">
        {/* 左側：選單按鈕 */}
        <button
          onClick={onOpenMenu}
          className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* 中間：標題 */}
        <h1 className="text-lg font-bold text-white truncate flex-1 text-center -ml-8">
          {title}
        </h1>

        {/* 右側：操作按鈕 */}
        <div className="flex items-center gap-1">
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="p-2 text-white/60 hover:text-white transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
          )}

          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

// 響應式頁面容器
export const ResponsivePageContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}> = ({ children, className, padding = 'md' }) => {
  const { isMobile } = useBreakpoint();

  const paddingClasses = {
    none: 'p-0',
    sm: isMobile ? 'p-4' : 'p-6',
    md: isMobile ? 'p-4 pb-20' : 'p-6', // 移動端底部留出導航空間
    lg: isMobile ? 'p-6 pb-24' : 'p-8'
  };

  return (
    <div className={cn('w-full min-h-full', paddingClasses[padding], className)}>
      {children}
    </div>
  );
};

// 移動端卡片組件
export const MobileCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
}> = ({ children, className, onClick, padding = 'md', showArrow = false }) => {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl',
        'transition-all duration-200',
        paddingClasses[padding],
        onClick && 'cursor-pointer active:scale-95 hover:bg-white/10',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {children}
        </div>
        {showArrow && onClick && (
          <ChevronRight className="w-5 h-5 text-white/40 ml-2" />
        )}
      </div>
    </div>
  );
};

// 移動端分頁指示器
export const MobilePagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 bg-white/5 rounded-lg text-white/60 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
      >
        上一頁
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                pageNum === currentPage
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              )}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 bg-white/5 rounded-lg text-white/60 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
      >
        下一頁
      </button>
    </div>
  );
};