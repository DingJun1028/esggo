"use client";

import { useAppContext } from "@/lib/context/app-context";
import { NAVIGATION } from "@/lib/config/navigation";
import { Search, Bell, Settings, Share2, Download, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/components/context/auth-context";

export function OmniHeader() {
    const { activeTab, lang, user } = useAppContext();
    const { logout } = useAuth();
    const currentNav = NAVIGATION.find((n) => n.id === activeTab);

    return (
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-outline-variant flex items-center justify-between px-8 sticky top-0 z-[50]">
            {/* Left Section: Breadcrumb / Title */}
            <div className="flex items-center gap-6">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-primary-teal-start uppercase tracking-[0.2em]">
                            ESG GO v1.0
                        </span>
                        <span className="text-[10px] text-on-surface-variant/40">/</span>
                        <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">
                            {currentNav?.label[lang] || "Operations"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Center Section: Search */}
            <div className="flex-1 max-w-md mx-12">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40 group-focus-within:text-primary-teal-start transition-colors" />
                    <input
                        type="text"
                        placeholder="搜尋功能與資料..."
                        className="w-full bg-surface-container border-none rounded-lg pl-10 pr-4 py-2 text-[11px] font-bold text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary-teal-start/20 transition-all uppercase tracking-widest"
                    />
                </div>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 pr-4 border-r border-outline-variant">
                    <button className="p-2 hover:bg-surface-container rounded-lg transition-colors relative">
                        <Bell className="w-4 h-4 text-on-surface-variant" />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary-teal-start rounded-full border border-white" />
                    </button>
                    <button className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                        <Settings className="w-4 h-4 text-on-surface-variant" />
                    </button>

                    {/* User Profile & Logout */}
                    <div className="flex items-center gap-3 ml-2 pl-4 border-l border-outline-variant">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-on-surface truncate max-w-[120px]">
                                {user?.displayName || user?.email?.split('@')[0] || "Omni User"}
                            </span>
                            <span className="text-[9px] font-bold text-primary-teal-start uppercase tracking-tighter">
                                系統管理者
                            </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary-teal-start/10 flex items-center justify-center border border-primary-teal-start/20 overflow-hidden">
                            {user?.photoURL ? (
                                <Image
                                    src={user.photoURL}
                                    alt="User"
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <UserIcon className="w-4 h-4 text-primary-teal-start" />
                            )}
                        </div>
                        <button
                            onClick={() => logout()}
                            className="p-2 hover:bg-red-50 text-on-surface-variant hover:text-red-500 rounded-lg transition-colors"
                            title="登出 / Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <button className="flex items-center gap-2 bg-on-surface text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] hover:bg-on-surface/90 active:scale-95 transition-all shadow-minimal">
                    <Download className="w-3.5 h-3.5" />
                    導出報告 / Export Report
                </button>
            </div>
        </header>
    );
}
