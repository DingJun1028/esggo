import React, { useMemo, useState } from 'react';
import { View, Language } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

import {
  LayoutGrid,
  Leaf,
  Globe,
  Settings,
  LogOut,
  MessageSquare,
  Calendar,
  CheckSquare,
  Layers,
  Activity,
  User,
  Microscope,
  Brain,
  Search,
  Clock,
  Star,
  Lock,
  ScanText,
  Box,
} from 'lucide-react';
import { FoundersSeal } from '@/components/identity/FoundersSeal';
import { SidebarSearch } from './SidebarSearch';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { useNavigationHistory } from '@/hooks/useNavigationHistory';
import { useFavorites } from '@/hooks/useFavorites';
import { useNotificationBadges } from '@/hooks/useNotificationBadges';
import '../../styles/sidebar-animations.css';
import '../../styles/responsive.css';
import { hasServiceAccess } from '@/constants/serviceInventory';
import { ServiceModule, SubscriptionTier } from '@/types/core';
import { navigationConfig as defaultNavigationConfig, allNavItems, NavSection } from '@/navigation.config';

const MAX_FAVORITES = 5;

interface SideNavBarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  language: Language;
  onToggleLanguage: () => void;
  userTier?: SubscriptionTier;
  hasFoundersSeal?: boolean;
  navConfig?: NavSection[];
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  currentView,
  onNavigate,
  language,
  onToggleLanguage,
  userTier = SubscriptionTier.FREE,
  hasFoundersSeal = false,
  navConfig = defaultNavigationConfig,
}) => {
  const { t } = useLanguage();
  const isZh = language === 'zh-TW';
  const [showSearch, setShowSearch] = useState(false);

  const { addToHistory } = useNavigationHistory();
  const { favorites } = useFavorites();

  const handleNavigate = (view: View) => {
    onNavigate(view);
    addToHistory(view);
  };

  useKeyboardNavigation([
    {
      key: 'k',
      ctrl: true,
      meta: true,
      handler: () => setShowSearch(true),
      description: '打開搜索',
    },
    {
      key: 'Escape',
      handler: () => {
        setShowSearch(false);
      },
      description: '關閉面板',
    },
  ]);

  // Use config from navigation.config.ts
  const menuItems = useMemo(() => {
    // Map config items to the structure expected by the render loop
    // But wait, the existing code expects a flat 'menuItems' array for rendering favorites and core/advanced sections manually
    // The existing code manual slices 'menuItems'.
    // Let's simpler: Use the 'allNavItems' flat list for search and lookup,
    // and use 'navigationConfig' to render sections if we were doing a full refactor.
    // However, to minimize UI change breakage, I will reconstruct the flat 'menuItems' list
    // that the component logic expects, but sourced from 'navigationConfig'.
    // Actually, let's just use the 'allNavItems' which is already flat.
    // But we need to filter/map to add 'module' if it's missing in config (config has strict types?)
    // Let's assume the render logic below slices 'menuItems'.
    // The previous 'menuItems' array had 14+ items.
    // Slice(0, 8) was Core, Slice(8) was Omni Hub.
    // Let's just define them here to match the exact visual layout expected, OR better yet,
    // render based on the new 'navigationConfig' SECTIONS which is cleaner!
    // But to be safe and quick for "Verification", I will render based on the SECTIONS in navigationConfig.
    return allNavItems;
  }, []);

  return (
    <>
      {showSearch && (
        <SidebarSearch
          items={allNavItems.map(item => ({
            id: item.id,
            label: item.label,
            keywords: [item.label],
          }))}
          onSelect={handleNavigate}
          onClose={() => setShowSearch(false)}
        />
      )}

      <aside className="w-72 bg-slate-900/40 backdrop-blur-xl border-r border-white/5 flex-col transition-all duration-500 relative z-20 hidden md:flex h-full shadow-[5px_0_30px_rgba(0,0,0,0.3)]">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-64 bg-emerald-500/5 blur-[80px] pointer-events-none" />

        <div className="p-8 flex items-center gap-4 relative z-10 group cursor-default">
          <div className="w-12 h-12 relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500" />
            <div className="relative w-full h-full bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-md group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">💎</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-400">
                ESGss
              </h1>
              {hasFoundersSeal && <FoundersSeal language={language} className="scale-75 -ml-1" />}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[10px] text-blue-300/80 font-mono tracking-wider">
                v7.0.0-SENTIENT
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 relative z-10 overflow-hidden">
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setShowSearch(true)}
              className="w-full flex items-center gap-3 px-5 py-3.5 mb-6 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-blue-500/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 group"
            >
              <Search className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
              <span className="text-sm font-medium tracking-wide">
                {t('ui.search.placeholder')}
              </span>

              <div className="ml-auto flex items-center gap-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 bg-black/20 text-slate-500">
                  ⌘
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 bg-black/20 text-slate-500">
                  K
                </span>
              </div>
            </button>

            {favorites.length > 0 && (
              <div className="mb-6">
                <div className="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest px-6 mb-3 flex items-center gap-2">
                  <Star className="w-3 h-3" />
                  {t('dashboard.overview')}
                </div>

                <div className="space-y-1">
                  {favorites.slice(0, MAX_FAVORITES).map(favId => {
                    const item = menuItems.find(m => m.id === favId);
                    if (!item) return null;
                    const isActive = currentView === item.id;
                    return (
                      <div key={item.id} className="relative group/item px-2">
                        <button
                          onClick={() => handleNavigate(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden group-hover/item:translate-x-1 ${isActive
                            ? 'text-white bg-gradient-to-r from-blue-600/20 to-indigo-600/10 border border-blue-500/30'
                            : 'text-slate-400 border border-transparent hover:text-white hover:bg-white/5'
                            }`}
                        >
                          {item.icon && (
                            <item.icon
                              className={`w-4 h-4 ${isActive ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'group-hover/item:text-blue-300'}`}
                            />
                          )}
                          <span className="text-sm font-medium tracking-wide truncate">
                            {item.label}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-8 mt-4">
              {/* Render Sections dynamically from navigationConfig */}
              {navConfig.map(sector => (
                <div key={sector.title} className="mb-6">
                  <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-6 mb-4">
                    {t(sector.title as any)}
                  </div>

                  <div className="space-y-1">
                    {sector.items.map((item: any) => {
                      const isActive = currentView === item.id;
                      const hasAccess = hasServiceAccess(item.id, userTier);

                      return (
                        <div key={item.id} className="relative group/item px-2">
                          <button
                            onClick={() => hasAccess && handleNavigate(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 group relative overflow-hidden ${!hasAccess ? 'opacity-40 grayscale cursor-not-allowed' : isActive ? 'text-white border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)] bg-blue-500/5' : 'text-slate-400 border border-transparent hover:text-white hover:bg-white/5 hover:border-white/5'}`}
                          >
                            <item.icon
                              className={`relative z-10 w-4 h-4 transition-transform duration-500 group-hover:scale-110 ${isActive && hasAccess ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'group-hover/item:text-slate-200'}`}
                            />
                            <div className="flex flex-col relative z-10 items-start">
                              <span
                                className={`text-sm font-medium tracking-wide ${isActive && hasAccess ? 'translate-x-1 text-white' : ''}`}
                              >
                                {t(item.label as any)}
                              </span>

                            </div>
                            {!hasAccess && <Lock className="ml-auto w-3 h-3 text-slate-500" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav >
        </div >

        <div className="p-6 mt-auto border-t border-white/5 space-y-3 relative z-10 bg-slate-900/40 backdrop-blur-md">
          <button
            onClick={onToggleLanguage}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/5 text-xs font-medium tracking-widest text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-300 hover:shadow-lg"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'zh-TW' ? 'ENGLISH' : '繁體中文'}</span>
          </button>

          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/10 text-xs font-medium tracking-widest text-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all duration-300">
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('ui.logout')}</span>
          </button>

        </div>
      </aside >

      <div className="sidebar-overlay md:hidden" />
    </>
  );
};
