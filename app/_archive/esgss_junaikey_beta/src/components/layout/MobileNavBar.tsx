import React, { useMemo, useState } from 'react';
import { View, Language } from '@/types';
import {
  LayoutGrid,
  Leaf,
  MessageSquare,
  MoreHorizontal,
  X,
  Globe,
  LogOut,
  FileUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { navigationConfig } from '../../../navigation.config';

interface MobileNavBarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  language: Language;
  onToggleLanguage: () => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  currentView,
  onNavigate,
  language,
  onToggleLanguage,
}) => {
  const isZh = language === 'zh-TW';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Primary Mobile Actions (Bottom Bar)
  const primaryActions = [
    { id: View.DASHBOARD, label: 'Dash', icon: LayoutGrid },
    { id: View.MY_ESG, label: 'ESG', icon: Leaf },
    { id: View.CELESTIAL_CHAT, label: 'Chat', icon: MessageSquare },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-slate-950/80 backdrop-blur-xl border-t border-white/10 z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          {primaryActions.map(action => {
            const isActive = currentView === action.id;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? 'text-cyan-400' : 'text-slate-500'
                }`}
              >
                <action.icon
                  className={`w-6 h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : ''}`}
                />
                <span className="text-[10px] font-medium">{action.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => setIsMenuOpen(true)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-500 hover:text-white`}
          >
            <MoreHorizontal className="w-6 h-6" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-slate-900/95 backdrop-blur-md flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white tracking-widest">MENU</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {navigationConfig.map(sector => (
                <div key={sector.title} className="space-y-2">
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-widest px-2 mb-2">
                    {sector.title}
                  </div>
                  {sector.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id as View);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left py-3 px-4 rounded-xl text-sm font-medium tracking-wide border border-transparent transition-all flex items-center gap-3 ${
                        currentView === item.id
                          ? 'bg-white/10 text-white border-white/20'
                          : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      {isZh ? item.zh_label : item.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Protocol Status (3可1不可) */}
            <div className="px-6 py-4 border-t border-white/10 bg-black/20">
              <div className="text-[10px] uppercase text-slate-500 font-bold mb-2 tracking-widest">
                System Protocol
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                  <FileUp className="w-3 h-3" />
                  Traceable
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1 h-1 rounded-full bg-emerald-400"></span> Trackable
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1 h-1 rounded-full bg-emerald-400"></span> Calculable
                </div>
                <div className="flex items-center gap-1 text-purple-400">
                  <span className="w-1 h-1 rounded-full bg-purple-400"></span> Immutable
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/10 grid grid-cols-2 gap-4">
              <button
                onClick={onToggleLanguage}
                className="flex items-center justify-center gap-2 py-3 bg-white/5 rounded-xl text-slate-300"
              >
                <Globe className="w-4 h-4" />
                {language === 'zh-TW' ? 'Languages' : '語言設定'}
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-rose-500/10 text-rose-400 rounded-xl">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
