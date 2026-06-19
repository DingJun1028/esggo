import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { View, Language } from '@/types';
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
} from 'lucide-react';
import { SideNavBar } from './layout/SideNavBar';
import { MobileNavBar } from './layout/MobileNavBar';
import { MobileHorizontalNav } from './layout/MobileHorizontalNav';
import { MobileSidebar, MobileMenuButton } from './layout/MobileSidebar';
import { OmniToolSuite } from './tools/OmniToolSuite';
import { ThemeSwitcher } from './ui/ThemeSwitcher';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
  language: Language;
  onToggleLanguage: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  onNavigate,
  language,
  onToggleLanguage,
}) => {
  const isZh = language === 'zh-TW';
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const menuItems = useMemo(
    () => [
      // 1. Dashboard (Core)
      { id: View.DASHBOARD, label: isZh ? '總體儀表板' : 'Global Dashboard', icon: LayoutGrid },
      // 2. ESG Overview (Core)
      { id: View.MY_ESG, label: isZh ? '永續概覽' : 'ESG Overview', icon: Leaf },
      // 3. Dr. Thoth (Intelligence)
      { id: View.DR_THOTH, label: isZh ? '壽司博士專區' : 'Dr. Thoth', icon: Brain },
      // 4. Temporal Nexus (Omni)
      { id: View.OMNI_CALENDAR, label: isZh ? '時空樞紐' : 'Temporal Nexus', icon: Calendar },
      // 5. Task Matrix (Omni)
      { id: View.OMNI_TASKS, label: isZh ? '任務矩陣' : 'Task Matrix', icon: CheckSquare },
      // 6. Project Board (Omni)
      { id: View.OMNI_PROJECTS, label: isZh ? '專案看板' : 'Project Board', icon: Layers },
      // 7. Agent Hub (Intelligence)
      { id: View.OMNI_AGENT, label: isZh ? 'AI 代理中心' : 'Agent Hub', icon: Globe },
      // 8. Celestial Chat (Intelligence)
      { id: View.CELESTIAL_CHAT, label: isZh ? '智慧對話' : 'Celestial Chat', icon: MessageSquare },
      // 9. Talent Passport (Domains)
      { id: View.TALENT, label: isZh ? '人才護照' : 'Talent Passport', icon: User },
      // 10. Settings (System)
      { id: View.SETTINGS, label: isZh ? '系統設定' : 'Settings', icon: Settings },
    ],
    [isZh]
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 overflow-hidden font-sans">
      <MobileNavBar
        currentView={currentView}
        onNavigate={onNavigate}
        language={language}
        onToggleLanguage={onToggleLanguage}
      />

      {/* 手機端側邊欄 (Drawer) */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        currentView={currentView}
        onNavigate={onNavigate}
        language={language}
        onToggleLanguage={onToggleLanguage}
      />

      {/* 手機端橫向滑動選單 */}
      <MobileHorizontalNav
        currentView={currentView}
        onNavigate={onNavigate}
        language={language}
        onOpenSidebar={() => setIsMobileSidebarOpen(true)}
      />

      <SideNavBar
        currentView={currentView}
        onNavigate={onNavigate}
        language={language}
        onToggleLanguage={onToggleLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden pt-16 md:pt-0">
        {/* Global Background Particles - Decentralized Feel */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px]" />
          {/* Subtle Scan Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/5 to-transparent animate-scan-vertical opacity-30" />
        </div>

        <div className="absolute top-4 right-4 z-50 md:right-8 md:top-8 hidden md:block">
          <ThemeSwitcher />
        </div>

        <div className="relative z-10 h-full overflow-auto custom-scrollbar p-2 md:p-8">
          <div className="max-w-[1600px] mx-auto min-h-full bg-white/5 backdrop-blur-2xl rounded-[24px] md:rounded-[48px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden p-4 md:p-8 relative group">
            {/* 內容區域光學反射層 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-[24px] md:rounded-[48px] group-hover:opacity-80 transition-opacity" />
            <div className="relative z-10 pb-20 md:pb-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Omni-Tools Overlay */}
      <OmniToolSuite />
    </div>
  );
};
