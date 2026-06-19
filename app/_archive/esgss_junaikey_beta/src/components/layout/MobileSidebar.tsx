import React from 'react';
import { X, Menu } from 'lucide-react';
import { View, Language } from '@/types';
import { SideNavBar } from './SideNavBar';
import { useSwipeGesture, useIsMobile } from '@/hooks/useSwipeGesture';
import '../../styles/responsive.css';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: View;
  onNavigate: (view: View) => void;
  language: Language;
  onToggleLanguage: () => void;
}

/**
 * 移動端側邊欄組件
 * 提供抽屜式側邊欄和手勢支持
 */
export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  currentView,
  onNavigate,
  language,
  onToggleLanguage,
}) => {
  const isMobile = useIsMobile();

  // 手勢支持
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: onClose,
  });

  // 如果不是移動端,不渲染
  if (!isMobile) return null;

  return (
    <>
      {/* 遮罩層 */}
      <div className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose} />

      {/* 側邊欄 */}
      <div
        className={`sidebar-mobile ${isOpen ? 'open' : ''}`}
        onTouchStart={e => swipeHandlers.onTouchStart(e.nativeEvent)}
        onTouchMove={e => swipeHandlers.onTouchMove(e.nativeEvent)}
        onTouchEnd={swipeHandlers.onTouchEnd}
      >
        <SideNavBar
          currentView={currentView}
          onNavigate={view => {
            onNavigate(view);
            onClose(); // 導航後自動關閉
          }}
          language={language}
          onToggleLanguage={onToggleLanguage}
        />
      </div>
    </>
  );
};

/**
 * 移動端菜單按鈕
 */
export const MobileMenuButton: React.FC<{
  onClick: () => void;
  isOpen: boolean;
}> = ({ onClick, isOpen }) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-50 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 md:hidden"
      aria-label={isOpen ? '關閉菜單' : '打開菜單'}
    >
      {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );
};
