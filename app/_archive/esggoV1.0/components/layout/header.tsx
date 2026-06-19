"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  Search,
  Bell,
  FileText,
  Activity,
  BookOpen,
  Coins,
  Gem,
  Settings,
  X,
  LogOut,
  LogIn,
  User as UserIcon,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NAVIGATION } from "@/lib/config/navigation";
import { useAppContext } from "@/lib/context/app-context";
import { useAuth } from "@/components/context/auth-context";
import { cn } from "@/lib/utils";
import { useLocalStorage, setLocalStorageItem } from "@/hooks/use-local-storage";
import { useHydratedEternalMemory, useEternalMemory } from "@/hooks/use-eternal-memory-store";

export function Header() {
  const {
    activeTab,
    lang,
    setLang,
    showNotifications,
    setShowNotifications,
    dataIntegrityPoints,
    complianceTokens,
  } = useAppContext();
  const { user, loginWithGoogle, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  // 🌌 從萬能之心提取記憶與法則操作能力
  const heroName = useHydratedEternalMemory((state) => state.heroName, "Unknown");
  const { engrave, telepathize, undo, redo, _past, _future } = useEternalMemory();

  return (
    <header className="h-16 border-b border-outline-variant bg-white/80 backdrop-blur-md flex items-center justify-between px-8 z-40 sticky top-0">
      <div className="flex items-center gap-6">
        <h1 className="text-sm font-black text-on-surface font-headline uppercase tracking-widest">
          {NAVIGATION.find((n) => n.id === activeTab)?.label?.[lang as keyof typeof NAVIGATION[0]["label"]] || ""}
        </h1>
        <Badge
          variant="optimal"
          className="flex items-center gap-1.5 bg-black/5 text-black border-black/10 font-headline uppercase text-[9px] tracking-tighter"
        >
          <span className="w-1 h-1 rounded-full bg-black" />
          {lang === "zh" ? "專業引擎上線" : "PROFESSIONAL ENGINE ONLINE"}
        </Badge>
        {/* 顯示從萬能之心提取的英雄名稱 */}
        <Badge variant="outline" className="hidden md:flex ml-2 font-headline tracking-widest text-[9px] uppercase border-primary/20 text-primary bg-primary/5">
          {lang === "zh" ? `歡迎歸來, ${heroName}` : `WELCOME, ${heroName} `}
        </Badge>
      </div>

      <div className="flex items-center gap-6">
        {/* Currency Display - Minimalist High Contrast */}
        <div className="hidden lg:flex items-center gap-4 mr-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-full group cursor-help transition-all hover:ring-1 hover:ring-black/20" title={lang === "zh" ? "數據存證積分" : "DATA INTEGRITY POINTS"}>
            <ShieldCheck className="w-3.5 h-3.5 text-black/60" />
            <span className="text-[11px] font-black text-on-surface font-headline tracking-tight">
              {(dataIntegrityPoints || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-full group cursor-help transition-all hover:ring-1 hover:ring-black/20" title={lang === "zh" ? "合規令牌" : "COMPLIANCE TOKENS"}>
            <Cpu className="w-3.5 h-3.5 text-black/60" />
            <span className="text-[11px] font-black text-on-surface font-headline tracking-tight">
              {(complianceTokens || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* 萬能之心控制台：時光倒流與身分切換 (僅供開發/展示用) */}
        <div className="hidden xl:flex items-center gap-2 border-r border-outline-variant/30 pr-6 mr-2">
          <button
            onClick={() => engrave("heroName", `ESG_Pioneer_${Math.floor(Math.random() * 100)}`)}
            className="px-2 py-1 text-[9px] font-black tracking-widest uppercase bg-primary/5 text-primary hover:bg-primary/10 rounded transition-colors"
          >
            {lang === "zh" ? "切換身分" : "SWAP PERSONA"}
          </button>
          <button
            onClick={undo}
            disabled={(_past || []).length === 0}
            className="px-2 py-1 text-[9px] bg-primary/5 text-primary disabled:opacity-30 rounded hover:bg-primary/10 transition-colors"
          >
            ⏪ UNDO
          </button>
          <button
            onClick={redo}
            disabled={(_future || []).length === 0}
            className="px-2 py-1 text-[9px] bg-primary/5 text-primary disabled:opacity-30 rounded hover:bg-primary/10 transition-colors"
          >
            ⏩ REDO
          </button>
        </div>

        <button
          onClick={() => {
            const cycle: Record<string, "zh" | "en" | "ja"> = { zh: "en", en: "ja", ja: "zh" };
            setLang(cycle[lang] || "zh");
          }}
          aria-label="Toggle Language"
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-surface-container rounded-lg transition-all text-on-surface-variant text-[10px] font-black font-headline uppercase tracking-widest border border-outline-variant/50"
        >
          <Globe className="w-3.5 h-3.5" />
          {lang === "zh" ? "繁體中文" : lang === "en" ? "ENGLISH" : "日本語"}
        </button>

        <div className="relative hidden xl:block">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
          <input
            type="text"
            placeholder={lang === "zh" ? "搜尋標的..." : "SEARCH..."}
            className="bg-surface-container border border-outline-variant/30 rounded-lg pl-10 pr-4 py-1.5 text-[11px] text-on-surface font-black font-headline placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-black/30 w-48 transition-all"
            suppressHydrationWarning
          />
        </div>



        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Toggle Notifications"
            className="p-2 hover:bg-surface-container rounded-lg transition-all relative group"
          >
            <Bell className="w-4 h-4 text-on-surface-variant group-hover:text-black transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error rounded-full ring-2 ring-white" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 mt-4 w-72 bg-white rounded-lg shadow-minimal border border-outline-variant z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container/30">
                  <h3 className="font-black text-on-surface text-[11px] font-headline uppercase tracking-wider">
                    {lang === "zh" ? "專業引擎通知" : "Professional Engine Alerts"}
                  </h3>
                  <Badge className="bg-black/10 text-black border-none text-[9px] font-black px-1.5 py-0.5">
                    3
                  </Badge>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {[
                    {
                      title: lang === "zh" ? "Omni 查證聲明" : "Omni Statement",
                      desc: lang === "zh" ? "ISO 14064-1 數據已核實" : "ISO 14064-1 Data Verified",
                      time: "10M",
                      icon: FileText,
                      color: "text-black",
                      bg: "bg-black/5",
                    },
                    {
                      title: lang === "zh" ? "Omni 數據偏離" : "Omni Variance",
                      desc: lang === "zh" ? "檢測到範疇三數據異常" : "Scope 3 Variance Detected",
                      time: "1H",
                      icon: Activity,
                      color: "text-error",
                      bg: "bg-error/5",
                    },
                  ].map((notif, i) => (
                    <div
                      key={i}
                      className="p-4 border-b border-outline-variant hover:bg-surface-container transition-colors cursor-pointer flex gap-3"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${notif.bg}`}>
                        <notif.icon className={`w-3.5 h-3.5 ${notif.color}`} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[11px] font-black text-on-surface font-headline uppercase truncate">
                          {notif.title}
                        </p>
                        <p className="text-[10px] text-on-surface-variant truncate whitespace-normal line-clamp-1 mt-0.5">
                          {notif.desc}
                        </p>
                        <p className="text-[9px] text-on-surface-variant/40 font-black font-headline mt-1 tracking-widest">
                          {notif.time} {lang === "zh" ? "前" : "AGO"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center bg-surface-container/50 hover:bg-surface-container cursor-pointer transition-colors group">
                  <span className="text-[9px] font-black text-on-surface-variant group-hover:text-black font-headline uppercase tracking-widest transition-colors">
                    {lang === "zh" ? "查看全部日誌" : "REVIEW ALL LOGS"}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>


    </header>
  );
}
