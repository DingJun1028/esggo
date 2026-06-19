import React, { useRef, useState, useEffect } from 'react';
import { View, Language } from '@/types';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import {
  LayoutGrid,
  Leaf,
  Globe,
  Settings,
  Activity,
  User,
  Microscope,
  Brain,
  Calendar,
  CheckSquare,
  Layers,
  MessageSquare,
} from 'lucide-react';

interface MobileHorizontalNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
  language: Language;
  onOpenSidebar?: () => void;
}

export const MobileHorizontalNav: React.FC<MobileHorizontalNavProps> = ({
  currentView,
  onNavigate,
  language,
  onOpenSidebar,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isZh = language === 'zh-TW';

  const menuItems = [
    // 核心功能
    { id: View.DASHBOARD, label: isZh ? '首頁' : 'Home', icon: LayoutGrid },
    { id: View.MY_ESG, label: isZh ? '永續概覽' : 'ESG Overview', icon: Leaf },

    // 專業模組
    { id: View.DIAGNOSTICS, label: isZh ? '永續診療室' : 'Clinic', icon: Activity },
    { id: View.STRATEGY, label: isZh ? '永續戰情室' : 'War Room', icon: Brain },
    { id: View.NEWS, label: isZh ? '資訊補給站' : 'News', icon: Globe },

    // 管理中心
    { id: View.TALENT_PASSPORT, label: isZh ? '用戶護照' : 'Passport', icon: User },
    { id: View.ADMIN_PANEL, label: isZh ? '奧秘後台' : 'Admin', icon: Settings },
    { id: View.BENTO_BOX_DASHBOARD, label: isZh ? '自動化儀表板' : 'Dashboard', icon: LayoutGrid },
    { id: View.DEV_PORTAL, label: isZh ? '開發者入口' : 'Dev', icon: Microscope },
    { id: View.EVIDENCE_VAULT, label: isZh ? '佐證庫' : 'Vault', icon: Layers },

    // Omni 系統
    { id: View.OMNI_CALENDAR, label: isZh ? '時空樞紐' : 'Calendar', icon: Calendar },
    { id: View.OMNI_TASKS, label: isZh ? '任務矩陣' : 'Tasks', icon: CheckSquare },
    { id: View.OMNI_PROJECTS, label: isZh ? '專案看板' : 'Projects', icon: Layers },
    { id: View.OMNI_AGENT, label: isZh ? 'AI 代理' : 'Agent', icon: Globe },
    { id: View.CELESTIAL_CHAT, label: isZh ? '智慧對話' : 'Chat', icon: MessageSquare },

    // 其他功能
    { id: View.TALENT, label: isZh ? '全人教育' : 'Education', icon: User },
    { id: View.AVATAR, label: isZh ? 'AI 分身' : 'Avatar', icon: Brain },
  ];

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
    return undefined;
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
      {/* 液態玻璃效果背景 */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(103,232,249,0.05),transparent_50%)] pointer-events-none" />

      <div className="relative flex items-center px-2 py-3">
        {/* 漢堡選單按鈕 */}
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg mr-1 bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all duration-300"
            aria-label="打開選單"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* 左箭頭 */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 ${
            canScrollLeft
              ? 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
          aria-label="向左滑動"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* 橫向滑動選單容器 */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto scrollbar-hide mx-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div className="flex gap-2 px-1">
            {menuItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 min-w-[72px] ${
                    isActive
                      ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 shadow-[0_0_20px_rgba(103,232,249,0.3)]'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 transition-all duration-300 ${
                      isActive
                        ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.8)]'
                        : 'text-white/60'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-light tracking-wide transition-all duration-300 whitespace-nowrap ${
                      isActive ? 'text-white font-medium' : 'text-white/60'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="w-1 h-1 rounded-full bg-cyan-300 animate-pulse shadow-[0_0_8px_rgba(103,232,249,0.8)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 右箭頭 */}
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 ${
            canScrollRight
              ? 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
          aria-label="向右滑動"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 底部光暈效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
    </div>
  );
};
