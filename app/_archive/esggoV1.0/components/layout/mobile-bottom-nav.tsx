"use client";

import { NAVIGATION } from "@/lib/config/navigation";
import { useAppContext } from "@/lib/context/app-context";
import { motion } from "framer-motion";

export function MobileBottomNav() {
  const { activeTab, setActiveTab, lang, setIsDailyBriefingOpen } = useAppContext();

  // Select 4 key items for the bottom navigation and simplify their labels to 2 characters
  const navItems = NAVIGATION.filter((item) =>
    ["sovereign-dashboard", "daily-briefing", "omni-ai", "strategy-war-room"].includes(item.id)
  ).map(item => {
    let shortZh = item.label.zh;
    let shortEn = item.label.en;
    if (item.id === "sovereign-dashboard") { shortZh = "主權"; shortEn = "Hub"; }
    if (item.id === "daily-briefing") { shortZh = "情報"; shortEn = "Brief"; }
    if (item.id === "omni-ai") { shortZh = "萬能"; shortEn = "Omni"; }
    if (item.id === "strategy-war-room") { shortZh = "戰情"; shortEn = "WarRoom"; }
    return { ...item, label: { zh: shortZh, en: shortEn } };
  });

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-50">
      <div className="bg-background/80 backdrop-blur-3xl border border-outline-variant/30 shadow-massive rounded-[32px] px-2 py-2 flex items-center justify-around relative overflow-hidden group">
        {/* Top Prism Shimmer Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (setIsDailyBriefingOpen) setIsDailyBriefingOpen(false);
              }}
              className="relative flex flex-col items-center justify-center py-2 px-3 flex-1 transition-all duration-300 active:scale-95"
            >
              <div className={`relative p-2 rounded-2xl transition-all duration-500 ${isActive
                ? "text-primary bg-primary/10 shadow-sm animate-none"
                : "text-on-surface-variant/40 hover:text-primary transition-colors"
                }`}>
                <Icon
                  className="w-5 h-5 relative z-10"
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-primary/5 rounded-2xl blur-md"
                  />
                )}
              </div>
              <span className={`text-[9px] mt-1 tracking-tighter transition-all duration-300 ${isActive
                ? "font-black text-primary scale-105"
                : "font-bold text-on-surface-variant/40"
                }`}>
                {item.label?.[lang as keyof typeof item.label] || item.label?.zh || ""}
              </span>

              {isActive && (
                <motion.div
                  layoutId="active-nav-dot"
                  className="absolute -bottom-0.5 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(0,51,37,0.4)]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
