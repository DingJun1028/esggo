"use client";

import { useAppContext } from "@/lib/context/app-context";
import { NAVIGATION } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export function MobileBottomNav() {
    const { activeTab, setActiveTab, setIsDailyBriefingOpen, lang } = useAppContext();

    // Show only the most important nav items on mobile (max 5)
    const mobileNavItems = NAVIGATION.filter(item => !item.hidden).slice(0, 5);

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[70] bg-white/95 backdrop-blur-xl border-t border-outline-variant md:hidden">
            <div className="flex items-center justify-around px-2 py-2 pb-safe">
                {mobileNavItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsDailyBriefingOpen(false);
                            }}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 relative min-w-0 flex-1",
                                isActive
                                    ? "text-primary-teal-start"
                                    : "text-on-surface-variant"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-nav-bg"
                                    className="absolute inset-0 bg-primary-teal-start/10 rounded-xl"
                                />
                            )}
                            <Icon className={cn("w-5 h-5 relative z-10", isActive && "scale-110")} />
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest relative z-10 truncate max-w-full",
                                isActive ? "text-primary-teal-start" : "text-on-surface-variant/60"
                            )}>
                                {item.label[lang] || item.label.en}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
