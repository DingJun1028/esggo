"use client";

import React from "react";
import { Layers, Droplets } from "lucide-react";
import { useThemeStore } from "../../lib/theme-store";
import { cn } from "../../lib/utils";
import BrandButton from "../brand/BrandButton";

export default function OmniThemeSwitcher() {
  const { omniTheme, setOmniTheme } = useThemeStore();
  const isOmniCore = omniTheme === "omnicore";

  return (
    <div
      className={cn(
        "flex items-center p-1 rounded-xl border transition-all",
        "bg-slate-100 border-slate-200"
      )}
    >
      <BrandButton
        variant="ghost"
        size="sm"
        onClick={() => setOmniTheme("v2")}
        className={cn(
          "px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all",
          !isOmniCore
            ? "bg-white text-slate-800 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        <Layers size={14} />
        <span>V2 實用</span>
      </BrandButton>

      <BrandButton
        variant="ghost"
        size="sm"
        onClick={() => setOmniTheme("omnicore")}
        className={cn(
          "px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all",
          isOmniCore
            ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
            : "text-slate-500 hover:text-cyan-600/70"
        )}
      >
        <Droplets size={14} className={isOmniCore ? "animate-pulse" : ""} />
        <span>OmniCore</span>
      </BrandButton>
    </div>
  );
}
