"use client";

import { motion } from "motion/react";
import { useAppContext } from "@/lib/context/app-context";
import { useAuth } from "@/components/context/auth-context";
import { NAVIGATION } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";
import { LogOut, Settings, Package2, Search } from "lucide-react";
import Image from "next/image";

export function OmniNavigationRail() {
    const { activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, setIsDailyBriefingOpen, lang, user, fdcUser } = useAppContext();
    const { logout } = useAuth();

    return (
        <motion.aside
            initial={{ width: 260 }}
            animate={{ width: isSidebarOpen ? 260 : 84 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full bg-white border-r border-outline-variant flex flex-col z-[60] shadow-minimal overflow-hidden"
        >
            {/* Brand Section */}
            <div className="p-8 pb-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-teal-start/5 rounded-lg border border-primary-teal-start/10">
                        <Package2 className="w-6 h-6 text-primary-teal-start" />
                    </div>
                    {isSidebarOpen && (
                        <div className="flex flex-col">
                            <span className="text-lg font-headline font-bold text-on-surface tracking-tighter uppercase">
                                ESG GO
                            </span>
                            <span className="text-[9px] font-black text-primary-teal-start uppercase tracking-[0.3em] -mt-1">
                                v1.0 Friendly Edition
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto hide-scrollbar">
                {NAVIGATION.filter(item => !item.hidden).map((item) => {
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
                                "w-full flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-300 group relative",
                                isActive
                                    ? "bg-surface-container text-primary-teal-start border border-black/5"
                                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50",
                                !isSidebarOpen && "justify-center px-0"
                            )}
                        >
                            <div className={cn(
                                "transition-transform duration-500",
                                isActive ? "scale-110" : "group-hover:scale-110"
                            )}>
                                <Icon className="w-5 h-5" />
                            </div>

                            {isSidebarOpen && (
                                <span className={cn(
                                    "text-[11px] font-headline font-bold uppercase tracking-widest",
                                    isActive ? "text-on-surface" : "text-on-surface-variant"
                                )}>
                                    {item.label[lang] || item.label.en}
                                </span>
                            )}

                            {isActive && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute left-0 w-1 h-6 bg-primary-teal-start rounded-r-full"
                                />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer Section */}
            <div className="p-4 mt-auto border-t border-outline-variant bg-surface-container/30">
                <div className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-outline-variant hover:bg-white transition-all cursor-pointer group",
                    !isSidebarOpen && "justify-center"
                )}>
                    <div className="w-8 h-8 rounded-lg bg-on-surface text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        {fdcUser?.displayName?.[0] || user?.displayName?.[0] || user?.email?.[0] || "G"}
                    </div>
                    {isSidebarOpen && (
                        <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-bold text-on-surface truncate uppercase">
                                {fdcUser?.displayName || user?.displayName || user?.email?.split('@')[0] || "Guest Node"}
                            </span>
                            <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-tighter">
                                {user ? "System Lead" : "Limited Access"}
                            </span>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex flex-col gap-1">
                    <button
                        onClick={logout}
                        className={cn(
                            "flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:text-error transition-colors",
                            !isSidebarOpen && "justify-center"
                        )}
                    >
                        <LogOut className="w-4 h-4" />
                        {isSidebarOpen && <span className="text-[10px] font-bold uppercase tracking-widest font-headline">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Sidebar Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="absolute bottom-6 -right-3 w-6 h-6 bg-white border border-outline-variant rounded-full flex items-center justify-center shadow-minimal hover:scale-110 transition-transform z-10"
            >
                <div className={cn("w-1 h-3 transition-all", isSidebarOpen ? "bg-primary-teal-start" : "bg-on-surface-variant")} />
            </button>
        </motion.aside>
    );
}
