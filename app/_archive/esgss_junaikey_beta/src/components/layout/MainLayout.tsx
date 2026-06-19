import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { motion, AnimatePresence } from 'framer-motion';
import { OmniGenieAssistant } from '../Report/OmniGenieAssistant';

interface MainLayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (viewId: any) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, activeView, onViewChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#020617] text-slate-200">
      {/* Global Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={(vid) => {
          onViewChange(vid);
          setIsSidebarOpen(false); // Close on mobile navigation
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Global Header */}
        <Header onMobileMenuClick={() => setIsSidebarOpen(true)} />

        {/* Perspective Viewport */}
        <main className="flex-1 overflow-hidden relative">
          {/* Background Ambience FX */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-900/5 rounded-full blur-[100px] -ml-40 -mb-40" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-full w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Global Floating Spirit Assistant */}
        <OmniGenieAssistant />

        {/* Subtle Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[60] bg-[length:100%_2px,3px_100%]" />
      </div>
    </div>
  );
};
