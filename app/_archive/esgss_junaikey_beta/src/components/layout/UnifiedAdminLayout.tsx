import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { motion, AnimatePresence } from 'framer-motion';
import { OmniGenieAssistant } from '../Report/OmniGenieAssistant';
import { NavSection } from '@/navigation.config';

interface UnifiedAdminLayoutProps {
    children: React.ReactNode;
    activeView: string;
    onViewChange: (viewId: string) => void;
    navConfig?: NavSection[]; // Allow custom navigation configuration
    user?: any;
    onLogout?: () => void;
}

export const UnifiedAdminLayout: React.FC<UnifiedAdminLayoutProps> = ({
    children,
    activeView,
    onViewChange,
    navConfig,
    user,
    onLogout
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#020617] text-slate-200 font-sans">
            {/* 
         Unified Sidebar 
         - Uses the wrapper Sidebar component which handles Auth & Language internally
         - Accepts custom navConfig for flexibility
      */}
            <Sidebar
                activeView={activeView}
                onViewChange={(vid) => {
                    onViewChange(vid);
                    setIsSidebarOpen(false);
                }}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                navConfig={navConfig}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Global Header */}
                <Header
                    onMobileMenuClick={() => setIsSidebarOpen(true)}
                    user={user}
                    onLogout={onLogout}
                />

                {/* Content Viewport */}
                <main className="flex-1 overflow-hidden relative bg-slate-950/30">
                    {/* Background Ambient Effects */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {/* Subtler gradient orbs for admin focus */}
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -mr-80 -mt-80 opacity-60" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-900/5 rounded-full blur-[120px] -ml-60 -mb-60 opacity-60" />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="h-full w-full overflow-y-auto overflow-x-hidden p-4 md:p-6"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* Omni Genie Assistant - Always present in Admin Layout */}
                <OmniGenieAssistant />

                {/* Scanline Overlay - Optional, keeping for consistency but made very subtle */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[60] bg-[length:100%_2px,3px_100%]" />
            </div>
        </div>
    );
};
