// components/OmniOverviewMenu.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { cn } from '../lib/utils';
import { SaaS_NAVIGATION, IT_OPS_NAVIGATION } from '../config/navigation';
import { useTheme } from '../contexts/ThemeContext';
import { IconMapper } from '../app/AppShellV2'; // Assuming IconMapper is exported from AppShellV2

interface OmniOverviewMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const OmniOverviewMenu: React.FC<OmniOverviewMenuProps> = ({ isOpen, onClose }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const allNavGroups = [...SaaS_NAVIGATION, ...IT_OPS_NAVIGATION];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={cn(
              "relative w-full max-w-lg max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl",
              isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200"
            )}
            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
          >
            <div className={cn(
              "flex items-center justify-between p-6 border-b",
              isDark ? "border-white/10" : "border-slate-200"
            )}>
              <h2 className={cn(
                "text-2xl font-black tracking-tight",
                isDark ? "text-white" : "text-slate-800"
              )}>全觀 (All Features)</h2>
              <button
                onClick={onClose}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  isDark ? "hover:bg-white/10 text-white" : "hover:bg-slate-100 text-slate-600"
                )}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto no-scrollbar grid grid-cols-2 gap-4">
              {allNavGroups.map((group) => (
                <div key={group.groupId} className="pb-4">
                  <h3 className={cn(
                    "text-[11px] font-black uppercase tracking-widest mb-3",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}>
                    {group.groupTitle}
                  </h3>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <Link key={item.id} href={item.path} onClick={onClose}>
                        <div className={cn(
                          "flex items-center gap-3 p-3 rounded-xl transition-colors",
                          isDark ? "hover:bg-white/5 text-slate-200" : "hover:bg-slate-50 text-slate-700"
                        )}>
                          <div className={cn(
                            "flex-shrink-0",
                            isDark ? "text-cyan-400" : "text-[#003262]"
                          )}>
                            {IconMapper[item.icon] || <LayoutDashboard size={20} />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold tracking-tight">{item.title}</span>
                            <span className="text-[9px] opacity-60 uppercase">{item.sub}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OmniOverviewMenu;
