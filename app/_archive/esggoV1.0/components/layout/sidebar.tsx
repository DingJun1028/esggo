"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Menu, User, ChevronRight, LogOut } from "lucide-react";
import { NAVIGATION, NavItem } from "@/lib/config/navigation";
import { useAppContext } from "@/lib/context/app-context";
import { useMemo } from "react";

export function Sidebar() {
  const { activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, lang, setIsDailyBriefingOpen } =
    useAppContext();

  // Group items by category
  const groupedNavigation = useMemo(() => {
    const groups: { [key: string]: NavItem[] } = {};
    NAVIGATION.forEach(item => {
      if (item.hidden) return;
      const cat = item.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, []);

  const categories = Object.keys(groupedNavigation);
  const currentLang = (lang || "zh") as "zh" | "en";

  return (
    <motion.aside
      initial={{ width: 260 }}
      animate={{ width: isSidebarOpen ? 260 : 80 }}
      className="hidden md:flex h-full border-r border-outline-variant/30 bg-background flex-col transition-all duration-300 z-50 relative"
    >
      <div className="p-8 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex flex-col overflow-hidden">
              <Image
                src="https://thumbs4.imagebam.com/e5/b8/6c/ME1B44KB_t.png"
                alt="Omni ESG"
                width={128}
                height={40}
                className="w-32 h-auto mb-1"
              />
              <span className="text-on-surface-variant font-black uppercase tracking-[0.2em] text-[8px] mt-1 whitespace-nowrap">
                Professional ESG Terminal v4.3
              </span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2.5 hover:bg-slate-50 border border-transparent hover:border-black/5 rounded-xl transition-all duration-200 ${!isSidebarOpen ? "mx-auto" : ""}`}
          >
            <Menu className={`w-5 h-5 text-on-surface-variant transition-transform duration-500 ${!isSidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Styled Scrollable Area */}
      <div className="flex-1 overflow-y-auto custom-sidebar-scrollbar px-4 py-2">
        <nav className="space-y-6 pb-12">
          {categories.map((category) => (
            <div key={category} className="space-y-1">
              {isSidebarOpen && (
                <h3 className="px-4 text-[9px] font-black uppercase tracking-[0.4em] text-on-surface-variant/40 mb-2 mt-4">
                  {category}
                </h3>
              )}
              {!isSidebarOpen && <div className="h-px bg-on-surface-variant/5 mx-2 my-4" />}

              {(groupedNavigation[category] || []).map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsDailyBriefingOpen(false);
                    }}
                    title={!isSidebarOpen ? item.label[lang as keyof typeof item.label] : undefined}
                    className={`w-full flex items-center transition-all duration-200 group font-headline uppercase tracking-wider text-[11px] relative ${isSidebarOpen ? "px-4 py-2.5 gap-4 rounded-xl" : "p-3 justify-center mb-1"
                      } ${isActive
                        ? "bg-primary/5 text-primary font-black"
                        : "text-on-surface-variant/70 hover:bg-primary/5 hover:text-on-surface"
                      }`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${isActive ? "text-primary" : "opacity-60 group-hover:opacity-100"}`}
                    />
                    {isSidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="truncate"
                      >
                        {item.label[currentLang as keyof typeof item.label] || ""}
                      </motion.span>
                    )}

                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 w-1 h-5 bg-primary rounded-r-full"
                      />
                    )}

                    {isSidebarOpen && isActive && (
                      <ChevronRight className="w-3 h-3 ml-auto opacity-30" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-outline-variant bg-surface-container/30 backdrop-blur-sm">
        <div className={`flex items-center gap-3 px-4 py-4 mb-2 ${!isSidebarOpen ? "justify-center px-0" : ""}`}>
          <div className="w-10 h-10 rounded-[14px] bg-background flex items-center justify-center font-black text-[11px] text-primary border border-outline-variant/30 shadow-sm">
            {isSidebarOpen ? "DJ" : <User className="w-5 h-5 text-primary/60" />}
          </div>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col overflow-hidden"
            >
              <span className="text-[11px] font-black text-on-surface tracking-tight truncate leading-none mb-1">
                DingJun
              </span>
              <span className="text-[9px] text-on-surface-variant/60 font-black uppercase tracking-widest truncate">
                System Lead
              </span>
            </motion.div>
          )}
        </div>
        {isSidebarOpen && (
          <button className="w-full flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:text-red-500 hover:bg-red-50 rounded-xl transition-all font-black uppercase tracking-[0.2em] text-[10px]">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        )}
      </div>

      <style jsx global>{`
        .custom-sidebar-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-sidebar-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .custom-sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.1);
        }
        .custom-sidebar-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(0,0,0,0.05) transparent;
        }
      `}</style>
    </motion.aside>
  );
}

