"use client";

import { Sparkles, LayoutDashboard, Compass, Bot, Library } from "lucide-react";
import { useAppContext } from "@/lib/context/app-context";

export function MobileNav() {
  const { activeTab, setActiveTab, lang, setIsOmniOpen, setIsDailyBriefingOpen } = useAppContext();

  const MOBILE_NAV_ITEMS = [
    { id: "daily-briefing", label: { zh: "首頁", en: "Home" }, icon: LayoutDashboard },
    { id: "sustainability-report-center", label: { zh: "報告", en: "Reports" }, icon: Compass },
    { id: "omni-ai", label: { zh: "報告中心", en: "Report Center" }, icon: Sparkles },
    { id: "junaikey", label: { zh: "智能", en: "AI" }, icon: Bot },
  ];

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-stitch-bg/95 backdrop-blur-md border-b border-stitch-border z-50 pt-safe shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Mobile Logo Trigger */}
        <button
          onClick={() => setIsDailyBriefingOpen(true)}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-stitch-border bg-stitch-bg relative">
            <div className="w-full h-full bg-[url('https://thumbs4.imagebam.com/e5/b8/6c/ME1B44KB_t.png')] bg-cover bg-center" />
          </div>
          <span className="font-bold text-sm tracking-tight text-stitch-text">ESG GO</span>
        </button>

        <div className="flex items-center h-full">
          <div className="grid grid-cols-4 h-full px-1">
            {MOBILE_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "Omni") {
                      setIsOmniOpen(true);
                    } else {
                      setActiveTab(item.id);
                      if (setIsDailyBriefingOpen) setIsDailyBriefingOpen(false);
                    }
                  }}
                  className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? "text-stitch-teal-start" : "text-stitch-muted hover:text-stitch-text"
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 mb-1 ${isActive ? "text-stitch-teal-start" : ""}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={`text-[10px] whitespace-nowrap ${isActive ? "font-bold" : "font-medium"}`}>
                    {item.label[lang as keyof typeof item.label] || item.label.zh}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

