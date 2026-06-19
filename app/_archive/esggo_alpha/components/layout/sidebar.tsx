import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/components/layout/firebase-provider";
import {
  LayoutDashboard,
  FileText,
  Database,
  ShieldCheck,
  Lock,
  ChevronRight,
  Sparkles,
  Menu,
  X,
  LogOut,
  PenLine,
  User,
  Search,
  MessageSquareText,
  Globe,
  Zap,
  LineChart,
  BookOpen,
} from "lucide-react";
import { useAppContext } from "@/lib/context/app-context";
import { SYSTEM_VIEWS } from "@/lib/constants";
import { useState } from "react";
import { translations } from "@/lib/i18n";
import { Languages } from "lucide-react";

const NAV_ITEMS = [
  { id: SYSTEM_VIEWS.DASHBOARD, label: "智核", icon: LayoutDashboard, path: "/dashboard" },
  { id: SYSTEM_VIEWS.SUSTAIN_WRITE, label: "永續撰寫", icon: PenLine, path: "/sustain-write" },
  { id: SYSTEM_VIEWS.OMNI_SRC, label: "數據源", icon: FileText, path: "/omni-src" },
  { id: SYSTEM_VIEWS.NCBDB, label: "數據庫", icon: Database, path: "/ncbdb" },
  { id: SYSTEM_VIEWS.ESG_KPI, label: "永續 KPI", icon: LineChart, path: "/esg-kpi" },
  { id: SYSTEM_VIEWS.PROFILE, label: "個資檔案", icon: User, path: "/profile" },
  { id: SYSTEM_VIEWS.INTELLIGENCE, label: "商情中心", icon: Globe, path: "/intelligence" },
];

export function Sidebar() {
  const { activeView, setIsSpiritOpen, language, toggleLanguage } = useAppContext();
  const pathname = usePathname();
  const t = translations[language];
  const { user, logout, isOnline } = useAuth();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center gap-3 mb-10 px-2 cursor-pointer hover:opacity-80 transition-opacity active:scale-[0.98]"
        onClick={() => setIsSpiritOpen(true)}
        role="button"
        aria-label={t.sidebarView.openSpirit}
      >
        <div className="relative">
          <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center shadow-xl shadow-slate-200 relative z-10 overflow-hidden ring-2 ring-emerald-500/10">
            <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent" />
          </div>
        </div>
        <div>
          <div className="text-xl font-black tracking-tight leading-none text-[#1A1C1E]">
            ESG <span className="text-emerald-600">GO</span>
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5 opacity-80">InfoOne v8.2 // 2025-26</div>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {[
          { id: SYSTEM_VIEWS.DASHBOARD, label: t.nav.dashboard, icon: LayoutDashboard, path: "/dashboard" },
          { id: SYSTEM_VIEWS.ESG_KPI, label: t.nav.kpiDashboard, icon: LineChart, path: "/esg-kpi" },
          { id: SYSTEM_VIEWS.SUSTAIN_WRITE, label: t.nav.write, icon: PenLine, path: "/sustain-write" },
          { id: SYSTEM_VIEWS.OMNI_SRC, label: t.nav.data, icon: FileText, path: "/omni-src" },
          { id: SYSTEM_VIEWS.NCBDB, label: t.nav.settings, icon: Database, path: "/ncbdb" },
          { id: SYSTEM_VIEWS.COMPLIANCE, label: t.nav.compliance, icon: ShieldCheck, path: "/compliance" },
          { id: SYSTEM_VIEWS.INTELLIGENCE, label: t.nav.intelligence, icon: Globe, path: "/intelligence" },
          { id: SYSTEM_VIEWS.ADVISORY, label: t.nav.advisory, icon: Zap, path: "/advisory" },
          { id: SYSTEM_VIEWS.OMNI_SEARCH, label: t.nav.search, icon: Search, path: "/omni-search" },
          { id: SYSTEM_VIEWS.LEARNING_CENTER, label: t.nav.learningCenter, icon: BookOpen, path: "/learning-center" },
          { id: SYSTEM_VIEWS.PROFILE, label: t.nav.profile, icon: User, path: "/profile" },
        ].map((item) => (
          <Link
            key={item.id}
            href={item.path}
            onClick={() => {
              if (isMobile) setIsOpen(false);
            }}
            aria-label={`導航至 ${item.label}`}
            aria-current={pathname === item.path ? "page" : undefined}
            className={cn(
              "w-full flex items-center justify-between p-3.5 rounded-2xl transition-all group",
              pathname === item.path
                ? "bg-emerald-50 text-emerald-900"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn("w-5 h-5", pathname === item.path ? "text-emerald-600" : "group-hover:text-slate-900")} aria-hidden="true" />
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
            </div>
            {pathname === item.path && <ChevronRight className="w-4 h-4" aria-hidden="true" />}
          </Link>
        ))}

        {/* Consolidated Vault Link */}
        <Link
          href="/vault"
          onClick={() => {
            if (isMobile) setIsOpen(false);
          }}
          className={cn(
            "w-full flex items-center justify-between p-3 rounded-xl transition-all group border border-slate-100 mt-4",
            pathname === "/vault"
              ? "bg-gradient-to-r from-[#009E9D] to-[#219EBC] text-white"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          )}
        >
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 opacity-50" />
            <span className="text-xs font-bold tracking-tight">{t.nav.vault}</span>
          </div>
        </Link>
      </nav>

      <div className="mt-auto space-y-4 pt-6 border-t border-slate-100">
        {/* User Profile */}
        <div className="flex items-center gap-3 px-2">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || "User"} className="w-10 h-10 rounded-full border-2 border-[#009E9D]/30" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#009E9D] font-black">
              {user?.displayName?.charAt(0) || "U"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">{user?.displayName}</div>
            <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
          </div>
          <button
            onClick={() => logout()}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative group/lang">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold leading-tight">
              {t.sidebarView.systemLanguage}
            </div>
            <button
              onClick={toggleLanguage}
              className="p-1.5 bg-white border border-slate-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
              title="Switch Language"
            >
              <Languages className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className={cn("text-[10px] font-black tracking-wider uppercase", language === 'zh' ? "text-emerald-600" : "text-slate-300")}>英標繁博</span>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <span className={cn("text-[10px] font-black tracking-wider uppercase", language === 'en' ? "text-emerald-600" : "text-slate-300")}>英標英文</span>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-4 border border-white/10 relative overflow-hidden group/gov shadow-xl">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/gov:opacity-20 transition-opacity">
              <ShieldCheck className="w-12 h-12 text-emerald-400" />
            </div>
            <div className="relative z-10">
              <div className="text-[9px] text-emerald-400 font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> {t.sidebarView.governanceActive}
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[8px] font-bold text-white/40 mb-1">
                    <span>5T PROTOCOL</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white tracking-tight">{t.sidebarView.systemIntegrityLocked}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 z-50 px-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
            onClick={() => setIsSpiritOpen(true)}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-[#009E9D] rounded-lg flex items-center justify-center relative z-10 shadow-lg shadow-[#009E9D]/30">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="absolute -inset-1 bg-[#009E9D]/30 blur-md rounded-full animate-pulse z-0" />
            </div>
            <span className="font-black tracking-tighter text-slate-900 ml-1">ESG GO</span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-600 active:scale-95 transition-transform"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-40 bg-white p-6 pt-24 overflow-y-auto">
            <NavContent />
          </div>
        )}

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-100 z-50 flex items-center justify-around px-2">
          {[
            { ...NAV_ITEMS[0], path: "/dashboard" }, // Dashboard
            { ...NAV_ITEMS[1], path: "/sustain-write" }, // SustainWrite
            { id: SYSTEM_VIEWS.PROFILE, label: "個資檔案", icon: User, path: "/profile" },
          ].map((item) => (
            <Link
              key={item?.id}
              href={item?.path || "/dashboard"}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 transition-all w-16 h-full",
                pathname === item?.path ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-bold tracking-tight">{item?.label}</span>
            </Link>
          ))}
        </nav>
      </>
    );
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-100 h-screen fixed left-0 top-0 text-slate-900 p-6 flex flex-col z-40">
      <NavContent />
    </aside>
  );
}
