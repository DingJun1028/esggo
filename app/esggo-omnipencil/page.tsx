'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Sun, 
  Moon, 
  Lock, 
  Terminal, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  RefreshCw, 
  Zap, 
  HelpCircle,
  Database,
  Fingerprint,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

export default function OmniPencilDashboard() {
  const { mode, setMode, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Local interaction states
  const [activeTrace, setActiveTrace] = useState<string | null>(null);
  const [formulaModal, setFormulaModal] = useState<{title: string, formula: string, explanation: string} | null>(null);
  const [metricMultiplier, setMetricMultiplier] = useState(1.0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [customLogs, setCustomLogs] = useState<string[]>([
    ">> SYSTEM INITIALIZED",
    ">> OMNI-WEAVE TRACING READY",
    ">> SECURE LEDGER CONNECTION STANDBY"
  ]);

  useEffect(() => {
    setMounted(true);
    // Add real-time fluctuation to feel alive
    const interval = setInterval(() => {
      setMetricMultiplier(prev => {
        const delta = (Math.random() - 0.5) * 0.002;
        return Math.max(0.99, Math.min(1.01, prev + delta));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19] text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <Activity className="w-8 h-8 text-[#22D3EE] animate-pulse" />
          <p className="font-mono text-xs tracking-widest uppercase">Loading Omni-Weave Grid...</p>
        </div>
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  const triggerTrace = (cardName: string, lines: string[]) => {
    setActiveTrace(cardName);
    setIsSyncing(true);
    setCustomLogs(prev => [
      `>> [TRACE REQUEST] INSTIGATING DIRECT AUDIT FOR: ${cardName.toUpperCase()}`,
      ...lines,
      `>> AUDIT COMPLETED ON-CHAIN | SECURE INTEGRITY VERIFIED`,
      ...prev.slice(0, 5)
    ]);
    setTimeout(() => {
      setIsSyncing(false);
    }, 800);
  };

  const showFormula = (title: string, formula: string, explanation: string) => {
    setFormulaModal({ title, formula, explanation });
  };

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden transition-colors duration-500 font-sans select-none",
      isDark ? "bg-[#0B0F19] text-gray-100" : "bg-[#F4F7FA] text-gray-900"
    )}>
      
      {/* Liquid Glass Radial Glow Background Spheres */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Cyan Glow */}
        <div className={cn(
          "absolute top-[120px] left-[100px] w-[500px] h-[500px] rounded-full blur-[100px] transition-opacity duration-1000",
          isDark ? "bg-[#22D3EE]/10 opacity-100" : "bg-[#22D3EE]/10 opacity-70"
        )} />
        {/* Purple Glow */}
        <div className={cn(
          "absolute top-[250px] right-[100px] w-[600px] h-[600px] rounded-full blur-[120px] transition-opacity duration-1000",
          isDark ? "bg-[#C084FC]/8 opacity-100" : "bg-[#C084FC]/6 opacity-60"
        )} />
        {/* Emerald Glow */}
        <div className={cn(
          "absolute bottom-[100px] left-[50%] -translate-x-1/2 w-[400px] h-[400px] rounded-full blur-[90px] transition-opacity duration-1000",
          isDark ? "bg-[#34D399]/6 opacity-100" : "bg-[#34D399]/5 opacity-50"
        )} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto min-h-screen flex flex-col">
        
        {/* Header */}
        <header className={cn(
          "w-full h-[72px] px-10 flex items-center justify-between border-b transition-colors duration-500",
          isDark ? "border-gray-800/40 bg-[#0B0F19]/50 backdrop-blur-md" : "border-gray-200/60 bg-white/40 backdrop-blur-md"
        )}>
          {/* Logo Group */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className={cn(
                "absolute inset-[-4px] rounded-full blur-[8px] animate-pulse-slow transition-colors duration-500",
                isDark ? "bg-[#22D3EE]/20" : "bg-[#0891B2]/10"
              )} />
              <Activity className={cn("w-5.5 h-5.5 transition-colors duration-500 relative z-10", isDark ? "text-[#22D3EE]" : "text-[#0891B2]")} />
            </div>
            <span className={cn("font-bold text-lg tracking-wider transition-colors duration-500", isDark ? "text-[#F9FAFB]" : "text-[#111827]")}>
              ESGGO
            </span>
            
            {/* Weave Badge */}
            <div className={cn(
              "px-2 py-1 rounded-md text-[9px] font-bold font-mono tracking-widest transition-all duration-500 ml-1.5",
              isDark ? "bg-[#22D3EE]/10 text-[#22D3EE] shadow-[0_0_10px_rgba(34,211,238,0.05)]" : "bg-[#22D3EE]/10 text-[#0891B2]"
            )}>
              OMNI-WEAVE ARCHITECTURE
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <span className={cn(
              "text-xs font-semibold tracking-wider cursor-pointer transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:rounded-full",
              isDark ? "text-[#F9FAFB] after:bg-[#22D3EE]" : "text-[#111827] after:bg-[#0891B2]"
            )}>
              Dashboard
            </span>
            {['Weave Engine', 'Formula Lab', 'Audit Ledger'].map((link) => (
              <span 
                key={link} 
                onClick={() => {
                  setCustomLogs(prev => [`>> [NAV] Navigating to simulated ${link} workspace...`, ...prev.slice(0, 5)]);
                }}
                className={cn(
                  "text-xs font-medium tracking-wider cursor-pointer hover:scale-102 transition-all duration-300",
                  isDark ? "text-[#9CA3AF] hover:text-[#F9FAFB]" : "text-[#4B5563] hover:text-[#111827]"
                )}
              >
                {link}
              </span>
            ))}
          </nav>

          {/* Controls Group */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle */}
            <div className={cn(
              "flex items-center p-1 rounded-full border transition-all duration-500 cursor-pointer relative shadow-inner",
              isDark ? "bg-[#111827]/75 border-gray-800/40" : "bg-white/80 border-gray-200/60"
            )}>
              <button 
                onClick={() => setMode('light')}
                className={cn(
                  "flex items-center justify-center p-1.5 rounded-full transition-all duration-300",
                  !isDark 
                    ? "bg-[#FCFBF7] text-[#0891B2] shadow-sm" 
                    : "text-gray-400 hover:text-gray-200"
                )}
                title="Light Mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              
              <button 
                onClick={() => setMode('dark')}
                className={cn(
                  "flex items-center justify-center p-1.5 rounded-full transition-all duration-300",
                  isDark 
                    ? "bg-[#22D3EE]/10 text-[#22D3EE] shadow-sm" 
                    : "text-gray-400 hover:text-[#0891B2]"
                )}
                title="Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Secure Badge */}
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-bold font-mono tracking-wider transition-all duration-500 shadow-sm",
              isDark 
                ? "bg-[#22D3EE]/5 border-[#22D3EE]/20 text-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.02)]" 
                : "bg-[#22D3EE]/5 border-[#22D3EE]/20 text-[#0891B2]"
            )}>
              <div className={cn(
                "w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-500",
                isDark ? "bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" : "bg-[#0891B2]"
              )} />
              NODE SECURE
            </div>
          </div>
        </header>

        {/* Bento Grid Content */}
        <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 relative z-10">
          
          {/* Welcome & Live Console Bar */}
          <div className={cn(
            "w-full rounded-2xl p-4 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-500",
            isDark 
              ? "bg-[#111827]/60 border-gray-800/40 backdrop-blur-md shadow-glass" 
              : "bg-white/70 border-gray-200/50 backdrop-blur-md shadow-glass"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-xl flex items-center justify-center transition-colors duration-500",
                isDark ? "bg-[#22D3EE]/10" : "bg-[#0891B2]/5"
              )}>
                <Cpu className={cn("w-5 h-5", isDark ? "text-[#22D3EE]" : "text-[#0891B2]")} />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-wide">5T TRUST COMPLIANCE WORKSPACE</h1>
                <p className={cn("text-[10px] font-mono tracking-wider mt-0.5", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                  TENANT: <span className="text-[#22D3EE] font-bold">ESGGO-CORE</span> | TRUST NODE: SECURE_LEDGER_BLOCK_#2026
                </p>
              </div>
            </div>

            {/* Simulated Live Console logs */}
            <div className={cn(
              "flex-1 max-w-xl h-10 px-3 py-2 rounded-lg border font-mono text-[10px] overflow-hidden flex items-center justify-between gap-2 transition-all duration-500",
              isDark ? "bg-[#020617] border-gray-800/60 text-[#22D3EE]" : "bg-gray-100 border-gray-200 text-[#0891B2]"
            )}>
              <div className="flex items-center gap-2 overflow-hidden w-full">
                <Terminal className="w-3.5 h-3.5 shrink-0 opacity-70 animate-pulse" />
                <span className="truncate scroll-smooth">{customLogs[0]}</span>
              </div>
              <div className="shrink-0 flex items-center gap-1.5">
                <span className={cn(
                  "w-1 h-1 rounded-full",
                  isSyncing ? "bg-amber-400 animate-ping" : "bg-emerald-400 animate-pulse"
                )} />
                <span className="text-[8px] text-gray-400 select-none uppercase tracking-widest font-sans font-bold">
                  {isSyncing ? "Tracing..." : "Live_Grid"}
                </span>
              </div>
            </div>
          </div>

          {/* Bento Columns Containers */}
          <div className="grid grid-cols-1 xl:grid-cols-[440px_1fr_420px] gap-6 items-start">
            
            {/* COLUMN 1: Scope Modules (440px) */}
            <div className="flex flex-col gap-6 w-full">
              
              {/* Card 1: Scope 1 Emissions */}
              <div className={cn(
                "rounded-2xl border transition-all duration-500 flex flex-col overflow-hidden backdrop-blur-md shadow-glass",
                isDark 
                  ? "bg-[#111827]/75 border-gray-800/40 hover:border-gray-700/60" 
                  : "bg-white/80 border-gray-200/60 hover:border-gray-300/80"
              )}>
                {/* OmniCard Header */}
                <div className="p-[18px] flex items-center justify-between border-b border-gray-800/10 dark:border-gray-700/10">
                  <div className="flex flex-col gap-0.5">
                    <span className={cn("text-[15px] font-bold tracking-wide transition-colors duration-500", isDark ? "text-[#F9FAFB]" : "text-[#111827]")}>
                      Scope 1 Emissions
                    </span>
                    <span className={cn("text-[11px] transition-colors duration-500", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                      Direct stationary combustion ledger
                    </span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="px-2 py-1 rounded-full bg-emerald-500/10 flex items-center gap-1.5 border border-emerald-500/15">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-500 tracking-wider">
                      AUDITED
                    </span>
                  </div>
                </div>

                {/* OmniCard Body */}
                <div className="p-[18px] flex flex-col gap-4">
                  {/* Metric Display */}
                  <div className="flex items-baseline gap-1.5">
                    <span className={cn("text-[28px] font-black tracking-tight leading-none transition-colors duration-500", isDark ? "text-[#F9FAFB]" : "text-[#111827]")}>
                      {(4210.8 * metricMultiplier).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    </span>
                    <span className={cn("text-xs font-semibold tracking-wider transition-colors duration-500", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                      tCO2e
                    </span>
                  </div>

                  {/* Embedded Formula Panel (Component Jjcsc) */}
                  <div 
                    onClick={() => showFormula(
                      "Scope 1 Combustion Rule", 
                      "Scope 1 = ∑ (Fuel_gln × 10.21 kg/gal)", 
                      "Evaluated using EPA 2026 Direct Combustion Factors. This calculates the greenhouse gas weight output directly based on verified volumetric generator fuel logs in US Gallons."
                    )}
                    className={cn(
                      "p-3 rounded-xl border flex flex-col gap-1.5 transition-all duration-300 cursor-pointer group hover:scale-[1.01]",
                      isDark 
                        ? "bg-[#020617]/90 border-gray-800/60 hover:border-emerald-500/30" 
                        : "bg-[#FCFBF7] border-gray-200/80 hover:border-emerald-600/30 shadow-sm"
                    )}
                  >
                    <span className={cn("text-[10px] font-bold tracking-wider transition-colors duration-500", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                      CALCULATION RULE
                    </span>
                    <span className={cn(
                      "font-mono text-[11px] font-semibold tracking-wide transition-colors duration-500 truncate",
                      isDark ? "text-[#34D399]" : "text-[#15803D]"
                    )}>
                      Scope 1 = ∑ (Fuel_gln × 10.21 kg/gal)
                    </span>
                    <span className={cn("text-[10px] flex items-center gap-1 transition-colors duration-500", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                      <span className="text-emerald-500 text-xs leading-none">✓</span> Validated: EPA 2026 Emission Factors
                    </span>
                  </div>
                </div>

                {/* OmniCard Footer */}
                <div className="p-[18px] pt-0 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => triggerTrace("Scope 1 Emissions", [
                        ">> INGESTING: STATIONARY GENERATOR COMBUSTION METERS",
                        "↳ HASH: 0x8F9C7D2E...A4B1 | INTEGRITY VERIFIED (EPA-2026)",
                        ">> SYSTEM: LEDGER SYNC STABLE"
                      ])}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-[9px] font-bold font-mono tracking-wider transition-all duration-300 cursor-pointer active:scale-95",
                        isDark 
                          ? "bg-[#0F172A] hover:bg-[#1E293B] text-[#22D3EE] hover:text-cyan-300" 
                          : "bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0891B2] hover:text-[#0369A1]"
                      )}
                    >
                      TRACE
                    </button>
                    <button 
                      onClick={() => showFormula(
                        "Scope 1 Combustion Rule", 
                        "Scope 1 = ∑ (Fuel_gln × 10.21 kg/gal)", 
                        "Evaluated using EPA 2026 Direct Combustion Factors. This calculates the greenhouse gas weight output directly based on verified volumetric generator fuel logs in US Gallons."
                      )}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg border text-[9px] font-bold tracking-wider transition-all duration-300 cursor-pointer active:scale-95",
                        isDark 
                          ? "bg-[#020617] border-gray-800/60 hover:bg-[#0B0F19] text-[#34D399]" 
                          : "bg-[#FCFBF7] border-gray-200/80 hover:bg-gray-50 text-[#15803D]"
                      )}
                    >
                      ƒ FORMULA
                    </button>
                  </div>
                  
                  {/* Lock Indicator (Disabled) */}
                  <div className="text-gray-400 dark:text-gray-600 opacity-30 cursor-not-allowed">
                    <Lock className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Card 2: Scope 2 Locked Card */}
              <div className={cn(
                "rounded-2xl border transition-all duration-500 flex flex-col overflow-hidden backdrop-blur-md shadow-glass relative",
                isDark 
                  ? "bg-[#111827]/75 border-[#06B6D4]/50 hover:border-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.03)]" 
                  : "bg-white/80 border-[#0891B2]/60 hover:border-[#0891B2] shadow-[0_4px_20px_rgba(8,145,178,0.06)]"
              )}>
                {/* Glowing locked corner banner */}
                <div className={cn(
                  "absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden"
                )}>
                  <div className={cn(
                    "absolute top-[-5px] right-[-32px] w-[90px] h-6 rotate-45 flex items-center justify-center text-[7.5px] font-black tracking-widest text-white shadow-sm",
                    isDark ? "bg-[#06B6D4]" : "bg-[#0891B2]"
                  )}>
                    MUTABLE
                  </div>
                </div>

                {/* OmniCard Header */}
                <div className="p-[18px] flex items-center justify-between border-b border-gray-800/10 dark:border-gray-700/10">
                  <div className="flex flex-col gap-0.5">
                    <span className={cn("text-[15px] font-bold tracking-wide transition-colors duration-500", isDark ? "text-[#F9FAFB]" : "text-[#111827]")}>
                      Scope 2 Location-Based
                    </span>
                    <span className={cn("text-[11px] transition-colors duration-500", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                      Indirect grid electricity purchase
                    </span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={cn(
                    "px-2 py-1 rounded-full flex items-center gap-1.5 border transition-all duration-500",
                    isDark 
                      ? "bg-[#22D3EE]/10 border-[#22D3EE]/20" 
                      : "bg-[#22D3EE]/10 border-[#22D3EE]/20"
                  )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full transition-colors duration-500", isDark ? "bg-[#22D3EE]" : "bg-[#0891B2]")} />
                    <span className={cn("text-[9px] font-black tracking-wider transition-colors duration-500", isDark ? "text-[#22D3EE]" : "text-[#0891B2]")}>
                      LOCKED
                    </span>
                  </div>
                </div>

                {/* OmniCard Body */}
                <div className="p-[18px] flex flex-col gap-4">
                  {/* Metric Display */}
                  <div className="flex items-baseline gap-1.5">
                    <span className={cn("text-[28px] font-black tracking-tight leading-none transition-colors duration-500", isDark ? "text-[#F9FAFB]" : "text-[#111827]")}>
                      {(1845.2 * metricMultiplier).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    </span>
                    <span className={cn("text-xs font-semibold tracking-wider transition-colors duration-500", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                      MWh
                    </span>
                  </div>

                  {/* Embedded Trace Panel (Component u2TV1) */}
                  <div 
                    onClick={() => triggerTrace("Scope 2 Location-Based", [
                      ">> [GRID-WEAVE] INGESTING ISO-NE REALTIME DATALINK",
                      "↳ AUTH HASH: 0x2A1BD834 | METERS SYNCED SUCCESSFULLY",
                      ">> SECURE IMMUTABLE CRYPTO-PROOF REPLICATED"
                    ])}
                    className={cn(
                      "p-3 rounded-xl flex flex-col gap-1.5 transition-all duration-300 cursor-pointer border group hover:scale-[1.01]",
                      isDark 
                        ? "bg-[#0F172A] border-gray-800/60 hover:border-[#22D3EE]/30" 
                        : "bg-[#E0F2FE]/60 border-sky-100 hover:border-sky-300"
                    )}
                  >
                    <span className={cn(
                      "font-mono text-[9.5px] font-bold tracking-wider transition-colors duration-500",
                      isDark ? "text-[#22D3EE]" : "text-[#0891B2]"
                    )}>
                      &gt;&gt; [GRID-WEAVE] INGESTED ISO-NE DATALINK
                    </span>
                    <span className={cn("font-mono text-[9px] transition-colors duration-500 truncate", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                      &nbsp;&nbsp;&nbsp;↳ SIGN: 0x2A1B...D834 | BLK: #104291
                    </span>
                    <span className={cn(
                      "font-mono text-[9.5px] font-bold tracking-wider transition-colors duration-500",
                      isDark ? "text-[#22D3EE]" : "text-[#0891B2]"
                    )}>
                      &gt;&gt; CRYPTOGRAPHIC SEAL IMMUTABLE
                    </span>
                  </div>
                </div>

                {/* OmniCard Footer */}
                <div className="p-[18px] pt-0 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => triggerTrace("Scope 2 Grid Electricity", [
                        ">> DETECTING: GRID ELECTRICITY METER EMISSION TELEMETRY",
                        "↳ HASH: 0x2A1B51F9...E10B | LEDGER ANCHORED (ISO-NE)",
                        ">> BLOCKS: 5/5 CRYPTO-SEALS INTEGRATED"
                      ])}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-[9px] font-bold font-mono tracking-wider transition-all duration-300 cursor-pointer active:scale-95",
                        isDark 
                          ? "bg-[#0F172A] hover:bg-[#1E293B] text-[#22D3EE] hover:text-cyan-300" 
                          : "bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0891B2] hover:text-[#0369A1]"
                      )}
                    >
                      TRACE
                    </button>
                    <button 
                      onClick={() => showFormula(
                        "Scope 2 Electricity Rule", 
                        "Scope 2 = Purchased_Electricity (MWh) × Grid_EF", 
                        "Under Location-Based guidelines, indirect carbon outputs are compiled directly by multiplying electricity consumption metrics from utility feeds with EPA eGRID subregion output emission factors."
                      )}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg border text-[9px] font-bold tracking-wider transition-all duration-300 cursor-pointer active:scale-95",
                        isDark 
                          ? "bg-[#020617] border-gray-800/60 hover:bg-[#0B0F19] text-[#34D399]" 
                          : "bg-[#FCFBF7] border-gray-200/80 hover:bg-gray-50 text-[#15803D]"
                      )}
                    >
                      ƒ FORMULA
                    </button>
                  </div>
                  
                  {/* Lock Indicator (Active) */}
                  <div className={cn("transition-colors duration-500", isDark ? "text-[#22D3EE]" : "text-[#0891B2]")}>
                    <Lock className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                </div>
              </div>

            </div>

            {/* COLUMN 2: Central Orchestration (480px / Flex) */}
            <div className="flex flex-col gap-6 w-full">
              
              {/* Card 3: Weave Engine Card */}
              <div className={cn(
                "rounded-2xl border transition-all duration-500 flex flex-col overflow-hidden backdrop-blur-md shadow-glass",
                isDark 
                  ? "bg-[#111827]/75 border-gray-800/40 hover:border-gray-700/60" 
                  : "bg-white/80 border-gray-200/60 hover:border-gray-300/80"
              )}>
                {/* OmniCard Header */}
                <div className="p-[18px] flex items-center justify-between border-b border-gray-800/10 dark:border-gray-700/10">
                  <div className="flex flex-col gap-0.5">
                    <span className={cn("text-[15px] font-bold tracking-wide transition-colors duration-500", isDark ? "text-[#F9FAFB]" : "text-[#111827]")}>
                      Omni-Weave Trace Engine
                    </span>
                    <span className={cn("text-[11px] transition-colors duration-500", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                      Real-time ledger orchestration & tracing
                    </span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="px-2 py-1 rounded-full bg-cyan-500/10 flex items-center gap-1.5 border border-cyan-500/15">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-ping" />
                    <span className={cn("text-[9px] font-black tracking-wider transition-colors duration-500", isDark ? "text-[#22D3EE]" : "text-[#0891B2]")}>
                      LIVE GRID
                    </span>
                  </div>
                </div>

                {/* OmniCard Body */}
                <div className="p-[18px] flex flex-col gap-4.5">
                  
                  {/* Weave Diagram Layout */}
                  <div className={cn(
                    "w-full rounded-xl p-3 border flex items-center justify-between transition-all duration-500 shadow-inner",
                    isDark ? "bg-[#111827]/60 border-gray-800/60" : "bg-gray-50 border-gray-200"
                  )}>
                    {/* Ingest Node */}
                    <div className={cn(
                      "px-3 py-1.5 rounded-lg border font-mono text-[9px] font-black tracking-widest transition-all duration-300 hover:scale-105 cursor-pointer",
                      isDark 
                        ? "bg-[#22D3EE]/5 border-[#22D3EE] text-[#22D3EE] shadow-[0_0_10px_rgba(34,211,238,0.08)]" 
                        : "bg-[#22D3EE]/5 border-[#0891B2] text-[#0891B2]"
                    )}>
                      INGEST
                    </div>

                    <div className={cn("font-bold text-[10px] animate-pulse-slow transition-colors duration-500", isDark ? "text-gray-600" : "text-gray-300")}>
                      ──▶
                    </div>

                    {/* Weave Node (Active Core) */}
                    <div className={cn(
                      "px-3 py-1.5 rounded-lg font-mono text-[9px] font-black tracking-widest text-white transition-all duration-300 hover:scale-105 cursor-pointer shadow-md",
                      isDark ? "bg-[#22D3EE] text-[#0F172A] shadow-cyan-500/10" : "bg-[#0891B2] text-white shadow-cyan-600/10"
                    )}>
                      WEAVE
                    </div>

                    <div className={cn("font-bold text-[10px] animate-pulse-slow transition-colors duration-500", isDark ? "text-gray-600" : "text-gray-300")}>
                      ──▶
                    </div>

                    {/* Ledger Node */}
                    <div className={cn(
                      "px-3 py-1.5 rounded-lg border font-mono text-[9px] font-black tracking-widest transition-all duration-300 hover:scale-105 cursor-pointer",
                      isDark 
                        ? "bg-[#0F172A] border-[#06B6D4]/50 text-[#22D3EE]" 
                        : "bg-white border-[#0891B2]/40 text-[#0891B2]"
                    )}>
                      LEDGER
                    </div>
                  </div>

                  {/* Weave Trace Panel (reused component u2TV1) */}
                  <div className={cn(
                    "p-3 rounded-xl border flex flex-col gap-1.5 transition-all duration-500 shadow-sm",
                    isDark 
                      ? "bg-[#0F172A] border-gray-800/60" 
                      : "bg-[#E0F2FE]/70 border-sky-100"
                  )}>
                    <span className={cn(
                      "font-mono text-[9.5px] font-bold tracking-wider transition-colors duration-500",
                      isDark ? "text-[#22D3EE]" : "text-[#0891B2]"
                    )}>
                      &gt;&gt; [WEAVE-CORE] BLOCKCHAIN PROOFS COMPILED
                    </span>
                    <span className={cn("font-mono text-[9px] transition-colors duration-500", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                      &nbsp;&nbsp;&nbsp;↳ EVIDENCE DIRECTORY INTEGRITY VERIFIED (100%)
                    </span>
                    <span className={cn(
                      "font-mono text-[9.5px] font-bold tracking-wider transition-colors duration-500",
                      isDark ? "text-[#22D3EE]" : "text-[#0891B2]"
                    )}>
                      &gt;&gt; BLOCK SEAL CREATED: HASH_0x78E9A...C
                    </span>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center justify-between text-[10px] font-mono tracking-wider">
                    <span className={cn("transition-colors duration-500", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                      SYNC FREQ: REALTIME (5s)
                    </span>
                    <span className={cn("font-bold transition-colors duration-500", isDark ? "text-[#22D3EE]" : "text-[#0891B2]")}>
                      LATENCY: 42ms
                    </span>
                  </div>
                </div>

                {/* OmniCard Footer */}
                <div className="p-[18px] pt-0 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => triggerTrace("Weave Engine Core", [
                        ">> INITIALIZING: MULTI-THREAD SECURE GRAPH VALIDATION",
                        "↳ SYNCING INGEST/WEAVE STATE TO LEDGER BLOCKCHAIN",
                        ">> VERIFIED: INTEGRITY COMPLIANT (SHA-256 SEALS)"
                      ])}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-[9px] font-bold font-mono tracking-wider transition-all duration-300 cursor-pointer active:scale-95",
                        isDark 
                          ? "bg-[#0F172A] hover:bg-[#1E293B] text-[#22D3EE] hover:text-cyan-300" 
                          : "bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0891B2] hover:text-[#0369A1]"
                      )}
                    >
                      TRACE
                    </button>
                    <button 
                      onClick={() => showFormula(
                        "Omni-Weave Routing Consensus", 
                        "Orchestration State = Φ(In_Data) ^ ∇(Sec_Proof)", 
                        "Enforces direct ledger verification loops across distributed data suppliers before appending records to the tamperproof cold ledger archives."
                      )}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg border text-[9px] font-bold tracking-wider transition-all duration-300 cursor-pointer active:scale-95",
                        isDark 
                          ? "bg-[#020617] border-gray-800/60 hover:bg-[#0B0F19] text-[#34D399]" 
                          : "bg-[#FCFBF7] border-gray-200/80 hover:bg-gray-50 text-[#15803D]"
                      )}
                    >
                      ƒ FORMULA
                    </button>
                  </div>
                  
                  {/* Lock Indicator (Disabled) */}
                  <div className="text-gray-400 dark:text-gray-600 opacity-30 cursor-not-allowed">
                    <Lock className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Card 4: Formula Hub Card */}
              <div className={cn(
                "rounded-2xl border transition-all duration-500 flex flex-col overflow-hidden backdrop-blur-md shadow-glass",
                isDark 
                  ? "bg-[#111827]/75 border-gray-800/40 hover:border-gray-700/60" 
                  : "bg-white/80 border-gray-200/60 hover:border-gray-300/80"
              )}>
                {/* OmniCard Header */}
                <div className="p-[18px] flex items-center justify-between border-b border-gray-800/10 dark:border-gray-700/10">
                  <div className="flex flex-col gap-0.5">
                    <span className={cn("text-[15px] font-bold tracking-wide transition-colors duration-500", isDark ? "text-[#F9FAFB]" : "text-[#111827]")}>
                      Formula Registry Hub
                    </span>
                    <span className={cn("text-[11px] transition-colors duration-500", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                      Mathematical consensus calculations
                    </span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="px-2 py-1 rounded-full bg-emerald-500/10 flex items-center gap-1.5 border border-emerald-500/15">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-500 tracking-wider">
                      CONSENSUS
                    </span>
                  </div>
                </div>

                {/* OmniCard Body */}
                <div className="p-[18px] flex flex-col gap-4">
                  {/* Embedded Formula (reused component Jjcsc) */}
                  <div 
                    onClick={() => showFormula(
                      "Scope 3.1 Supply Chain Rule", 
                      "Scope 3.1 = Purchased Goods × Supplier EF", 
                      "Enables direct alignment with global GHG Protocol Scope 3 Category 1 standards. Supplier-specific emission factors are cross-referenced with vendor ESG certificates."
                    )}
                    className={cn(
                      "p-3 rounded-xl border flex flex-col gap-1.5 transition-all duration-300 cursor-pointer group hover:scale-[1.01]",
                      isDark 
                        ? "bg-[#020617]/90 border-gray-800/60 hover:border-emerald-500/30" 
                        : "bg-[#FCFBF7] border-gray-200/80 hover:border-emerald-600/30 shadow-sm"
                    )}
                  >
                    <span className={cn("text-[10px] font-bold tracking-wider transition-colors duration-500", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                      CALCULATION RULE
                    </span>
                    <span className={cn(
                      "font-mono text-[11px] font-semibold tracking-wide transition-colors duration-500 truncate",
                      isDark ? "text-[#34D399]" : "text-[#15803D]"
                    )}>
                      Scope 3.1 = Purchased Goods × Supplier EF
                    </span>
                    <span className={cn("text-[10px] flex items-center gap-1 transition-colors duration-500", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                      <span className="text-emerald-500 text-xs leading-none">✓</span> Alignment: GHG Protocol Standard V4
                    </span>
                  </div>

                  {/* Compliance Progress bar */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className={cn("transition-colors duration-500", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                        Auditor Alignment Consensus
                      </span>
                      <span className={cn("font-black transition-colors duration-500", isDark ? "text-[#22D3EE]" : "text-[#0891B2]")}>
                        100%
                      </span>
                    </div>
                    {/* Progress Bar background */}
                    <div className={cn(
                      "w-full h-1.5 rounded-full relative overflow-hidden transition-colors duration-500",
                      isDark ? "bg-gray-800" : "bg-gray-200"
                    )}>
                      <div 
                        className={cn(
                          "absolute top-0 left-0 h-full rounded-full transition-colors duration-500 shadow-[0_0_8px_rgba(34,211,238,0.4)]",
                          isDark ? "bg-[#22D3EE] w-full" : "bg-[#0891B2] w-full"
                        )} 
                      />
                    </div>
                  </div>
                </div>

                {/* OmniCard Footer */}
                <div className="p-[18px] pt-0 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => triggerTrace("Formula Consensus Hub", [
                        ">> LOADING REGISTERED SYSTEM FORMULAS",
                        "↳ COMPILING MATH PARSER GRAPH (VALIDATED ISO-14064)",
                        ">> ALIGNED: ALL AUDITORS CONSENSUS CONFIRMED"
                      ])}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-[9px] font-bold font-mono tracking-wider transition-all duration-300 cursor-pointer active:scale-95",
                        isDark 
                          ? "bg-[#0F172A] hover:bg-[#1E293B] text-[#22D3EE] hover:text-cyan-300" 
                          : "bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0891B2] hover:text-[#0369A1]"
                      )}
                    >
                      TRACE
                    </button>
                    <button 
                      onClick={() => showFormula(
                        "Scope 3.1 Supply Chain Rule", 
                        "Scope 3.1 = Purchased Goods × Supplier EF", 
                        "Enables direct alignment with global GHG Protocol Scope 3 Category 1 standards. Supplier-specific emission factors are cross-referenced with vendor ESG certificates."
                      )}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg border text-[9px] font-bold tracking-wider transition-all duration-300 cursor-pointer active:scale-95",
                        isDark 
                          ? "bg-[#020617] border-gray-800/60 hover:bg-[#0B0F19] text-[#34D399]" 
                          : "bg-[#FCFBF7] border-gray-200/80 hover:bg-gray-50 text-[#15803D]"
                      )}
                    >
                      ƒ FORMULA
                    </button>
                  </div>
                  
                  {/* Lock Indicator (Disabled) */}
                  <div className="text-gray-400 dark:text-gray-600 opacity-30 cursor-not-allowed">
                    <Lock className="w-3 h-3" />
                  </div>
                </div>
              </div>

            </div>

            {/* COLUMN 3: Verification & Integrity Index (420px) */}
            <div className="flex flex-col gap-6 w-full">
              
              {/* Card 5: Cold Crystal Vault Card */}
              <div className={cn(
                "rounded-2xl border transition-all duration-500 flex flex-col overflow-hidden backdrop-blur-md shadow-glass relative",
                isDark 
                  ? "bg-[#111827]/75 border-[#06B6D4]/50 hover:border-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.03)]" 
                  : "bg-white/80 border-[#0891B2]/60 hover:border-[#0891B2] shadow-[0_4px_20px_rgba(8,145,178,0.06)]"
              )}>
                {/* Glowing sealed corner banner */}
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                  <div className={cn(
                    "absolute top-[-5px] right-[-32px] w-[90px] h-6 rotate-45 flex items-center justify-center text-[7.5px] font-black tracking-widest text-white shadow-sm",
                    isDark ? "bg-[#06B6D4]" : "bg-[#0891B2]"
                  )}>
                    SEALED
                  </div>
                </div>

                {/* OmniCard Header */}
                <div className="p-[18px] flex items-center justify-between border-b border-gray-800/10 dark:border-gray-700/10">
                  <div className="flex flex-col gap-0.5">
                    <span className={cn("text-[15px] font-bold tracking-wide transition-colors duration-500", isDark ? "text-[#F9FAFB]" : "text-[#111827]")}>
                      Cold Crystal Vault
                    </span>
                    <span className={cn("text-[11px] transition-colors duration-500", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                      IPFS & Zero-Knowledge secured ledgers
                    </span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="px-2 py-1 rounded-full bg-cyan-500/10 flex items-center gap-1.5 border border-cyan-500/15">
                    <div className={cn("w-1.5 h-1.5 rounded-full transition-colors duration-500", isDark ? "bg-[#22D3EE]" : "bg-[#0891B2]")} />
                    <span className={cn("text-[9px] font-black tracking-wider transition-colors duration-500", isDark ? "text-[#22D3EE]" : "text-[#0891B2]")}>
                      SEALED
                    </span>
                  </div>
                </div>

                {/* OmniCard Body */}
                <div className="p-[18px] flex flex-col gap-4">
                  
                  {/* ZKP Info Block */}
                  <div className={cn(
                    "p-[12px] rounded-lg border flex flex-col gap-1.5 transition-colors duration-500 shadow-sm",
                    isDark ? "bg-[#020617] border-[#06B6D4]/40" : "bg-sky-50/50 border-[#0891B2]/25"
                  )}>
                    <span className={cn("text-[11px] font-bold tracking-wider transition-colors duration-500", isDark ? "text-[#22D3EE]" : "text-[#0891B2]")}>
                      ZKP PROOF STATE:
                    </span>
                    <span className={cn("text-[11px] font-mono tracking-wide transition-colors duration-500", isDark ? "text-[#F9FAFB]" : "text-[#111827]")}>
                      0x3F8B...E1D2_SEAL
                    </span>
                    <span className={cn("text-[10px] leading-relaxed transition-colors duration-500", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                      Cold-storage replication block synchronized successfully.
                    </span>
                  </div>

                  {/* Stat Grid Row */}
                  <div className="flex items-center justify-between text-[10px] font-mono tracking-wider">
                    <span className={cn("font-bold transition-colors duration-500", isDark ? "text-[#22D3EE]" : "text-[#0891B2]")}>
                      SHIELD STAT: MAX
                    </span>
                    <span className={cn("transition-colors duration-500", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                      BLOCK: #2,940,102
                    </span>
                  </div>
                </div>

                {/* OmniCard Footer */}
                <div className="p-[18px] pt-0 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => triggerTrace("Cold Crystal Vault", [
                        ">> ACCELERATING CRYPTOGRAPHIC SHIELD",
                        "↳ IPFS ROOT CIDS VERIFIED AGAINST LOCAL BLOCK",
                        ">> STATUS: SEAL CONFIRMED IN MUTABLE STATE"
                      ])}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-[9px] font-bold font-mono tracking-wider transition-all duration-300 cursor-pointer active:scale-95",
                        isDark 
                          ? "bg-[#0F172A] hover:bg-[#1E293B] text-[#22D3EE] hover:text-cyan-300" 
                          : "bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0891B2] hover:text-[#0369A1]"
                      )}
                    >
                      TRACE
                    </button>
                    <button 
                      onClick={() => showFormula(
                        "Zero-Knowledge Snark Constraint", 
                        "Proof Core = HASH(State) * G(Curve25519)", 
                        "Validates dataset values without disclosing underlying raw client financial logs or secret utility meters."
                      )}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg border text-[9px] font-bold tracking-wider transition-all duration-300 cursor-pointer active:scale-95",
                        isDark 
                          ? "bg-[#020617] border-gray-800/60 hover:bg-[#0B0F19] text-[#34D399]" 
                          : "bg-[#FCFBF7] border-gray-200/80 hover:bg-gray-50 text-[#15803D]"
                      )}
                    >
                      ƒ FORMULA
                    </button>
                  </div>
                  
                  {/* Lock Indicator (Active) */}
                  <div className={cn("transition-colors duration-500", isDark ? "text-[#22D3EE]" : "text-[#0891B2]")}>
                    <Lock className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Card 6: Audit Progress Card */}
              <div className={cn(
                "rounded-2xl border transition-all duration-500 flex flex-col overflow-hidden backdrop-blur-md shadow-glass",
                isDark 
                  ? "bg-[#111827]/75 border-gray-800/40 hover:border-gray-700/60" 
                  : "bg-white/80 border-gray-200/60 hover:border-gray-300/80"
              )}>
                {/* OmniCard Header */}
                <div className="p-[18px] flex items-center justify-between border-b border-gray-800/10 dark:border-gray-700/10">
                  <div className="flex flex-col gap-0.5">
                    <span className={cn("text-[15px] font-bold tracking-wide transition-colors duration-500", isDark ? "text-[#F9FAFB]" : "text-[#111827]")}>
                      Platform Integrity Index
                    </span>
                    <span className={cn("text-[11px] transition-colors duration-500", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                      Consolidated trust scoring & progress
                    </span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="px-2 py-1 rounded-full bg-emerald-500/10 flex items-center gap-1.5 border border-emerald-500/15">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-500 tracking-wider">
                      SECURE
                    </span>
                  </div>
                </div>

                {/* OmniCard Body */}
                <div className="p-[18px] flex flex-col gap-4">
                  {/* Integrity Value Display */}
                  <div className="flex items-baseline gap-2.5">
                    <span className={cn("text-[32px] font-black tracking-tight leading-none transition-colors duration-500", isDark ? "text-[#F9FAFB]" : "text-[#111827]")}>
                      99.98%
                    </span>
                    <span className={cn("text-[11px] font-bold tracking-wide transition-colors duration-500", isDark ? "text-[#22D3EE]" : "text-[#0891B2]")}>
                      INTEGRITY RATE
                    </span>
                  </div>

                  {/* Audit Checklist (Vertical Layout) */}
                  <div className="flex flex-col gap-2.5">
                    {/* Item 1 */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={cn("transition-colors duration-500", isDark ? "text-[#F9FAFB]" : "text-[#111827]")}>
                        Scope 1 Direct Stationary
                      </span>
                      <span className={cn("font-bold font-mono transition-colors duration-500", isDark ? "text-[#22D3EE]" : "text-[#0891B2]")}>
                        ✓ VERIFIED
                      </span>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={cn("transition-colors duration-500", isDark ? "text-[#F9FAFB]" : "text-[#111827]")}>
                        Scope 2 Grid Purchased
                      </span>
                      <span className={cn("font-bold font-mono transition-colors duration-500", isDark ? "text-[#22D3EE]" : "text-[#0891B2]")}>
                        ✓ VERIFIED
                      </span>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={cn("transition-colors duration-500", isDark ? "text-[#F9FAFB]" : "text-[#111827]")}>
                        Scope 3 Supplier Survey
                      </span>
                      <span className={cn("font-bold font-mono transition-colors duration-500", isDark ? "text-[#9CA3AF]" : "text-[#4B5563]")}>
                        ⟳ COMPILED
                      </span>
                    </div>
                  </div>
                </div>

                {/* OmniCard Footer */}
                <div className="p-[18px] pt-0 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => triggerTrace("Platform Integrity Index", [
                        ">> COMPILED SCORE REPORT GENERATED SUCCESSFULLY",
                        "↳ TOTAL PASSED PROTOCOLS: 21 / 22 COMPLIANT STATUS",
                        ">> LEDGER VERIFICATION COMPLETED (99.98% COHERENCE)"
                      ])}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-[9px] font-bold font-mono tracking-wider transition-all duration-300 cursor-pointer active:scale-95",
                        isDark 
                          ? "bg-[#0F172A] hover:bg-[#1E293B] text-[#22D3EE] hover:text-cyan-300" 
                          : "bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0891B2] hover:text-[#0369A1]"
                      )}
                    >
                      TRACE
                    </button>
                    <button 
                      onClick={() => showFormula(
                        "Platform Integrity Weighting Formula", 
                        "Index = (Audited_KPIs / Total_Required) * 100", 
                        "Computes consolidated reliability weight by compiling validated items across direct combustion, utility metrics, and third party supplier compliance."
                      )}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg border text-[9px] font-bold tracking-wider transition-all duration-300 cursor-pointer active:scale-95",
                        isDark 
                          ? "bg-[#020617] border-gray-800/60 hover:bg-[#0B0F19] text-[#34D399]" 
                          : "bg-[#FCFBF7] border-gray-200/80 hover:bg-gray-50 text-[#15803D]"
                      )}
                    >
                      ƒ FORMULA
                    </button>
                  </div>
                  
                  {/* Lock Indicator (Disabled) */}
                  <div className="text-gray-400 dark:text-gray-600 opacity-30 cursor-not-allowed">
                    <Lock className="w-3 h-3" />
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Interactive Cryptographic Trace Logs Drawer (Interactive Feature) */}
          <div className={cn(
            "w-full rounded-2xl border p-5 transition-all duration-500",
            isDark 
              ? "bg-[#111827]/70 border-gray-800/40 backdrop-blur-md shadow-glass" 
              : "bg-white/70 border-gray-200/50 backdrop-blur-md shadow-glass"
          )}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/10 dark:border-gray-700/10">
              <div className="flex items-center gap-2">
                <Terminal className={cn("w-4 h-4 animate-pulse", isDark ? "text-[#22D3EE]" : "text-[#0891B2]")} />
                <h3 className="text-xs font-bold font-mono tracking-wider">OMNI-WEAVE DIRECTORY CRYPTO-TRACES</h3>
              </div>
              
              {activeTrace && (
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-mono font-bold", isDark ? "text-[#22D3EE]" : "text-[#0891B2]")}>
                    ACTIVE INSPECTION: {activeTrace.toUpperCase()}
                  </span>
                  <button 
                    onClick={() => setActiveTrace(null)}
                    className="text-xs px-2 py-0.5 rounded bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 font-bold"
                  >
                    CLEAR
                  </button>
                </div>
              )}
            </div>

            <div className={cn(
              "p-4 rounded-xl font-mono text-[11px] leading-relaxed flex flex-col gap-2 max-h-[160px] overflow-y-auto transition-colors duration-500",
              isDark ? "bg-[#020617] text-gray-300" : "bg-gray-50 text-gray-800 border border-gray-200/50"
            )}>
              {activeTrace ? (
                <>
                  <p className={cn("font-bold animate-pulse-slow", isDark ? "text-[#22D3EE]" : "text-[#0891B2]")}>
                    &gt;&gt; [DEEP DIAGNOSTIC INSPECTION: {activeTrace.toUpperCase()}]
                  </p>
                  <p className="text-gray-400 dark:text-gray-500">TIMESTAMP: {new Date().toISOString()}</p>
                  <p>&gt;&gt; SECURE ENCLAVE SIGNATURE: ECDSA_secp256k1_0x9A2F8D4E1C2B</p>
                  <p>&gt;&gt; BLOCK INDEX: #2,940,102 | CONCORDANCE RATE: 100% SUCCESS</p>
                  <p>&gt;&gt; AUDIT STATE: 5T_COMPLIANT_SECURE_REPLICA</p>
                  <p className="text-[#34D399] dark:text-[#34D399] font-bold">&gt;&gt; VERIFIED BY MULTI-AGENT SWARM CONSENSUS ORACLE.</p>
                </>
              ) : (
                customLogs.map((log, index) => (
                  <p key={index} className={cn(
                    index === 0 && "font-semibold text-gray-100 dark:text-gray-900"
                  )}>
                    {log}
                  </p>
                ))
              )}
            </div>
          </div>

        </main>

        {/* Footer */}
        <footer className={cn(
          "w-full h-14 px-10 border-t flex items-center justify-between text-[10px] font-mono tracking-wider transition-colors duration-500",
          isDark ? "border-gray-800/40 text-gray-500 bg-[#0B0F19]/20" : "border-gray-200/50 text-gray-400 bg-white/20"
        )}>
          <span>© 2026 ESGGO PLATFORM · 5T CRYPTOGRAPHIC TRUST SYSTEM</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-cyan-400 transition-colors cursor-pointer">PRIVACY ENCLAVE</span>
            <span>·</span>
            <span className="hover:text-cyan-400 transition-colors cursor-pointer">BLOCK EXPLORER</span>
          </div>
        </footer>

      </div>

      {/* Formula Detail Overlay Modal */}
      {formulaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className={cn(
            "w-full max-w-lg rounded-2xl border p-6 flex flex-col gap-4 shadow-2xl transition-all duration-500 transform scale-100",
            isDark ? "bg-[#111827] border-gray-800 text-gray-100" : "bg-white border-gray-200 text-gray-900"
          )}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-800/10 dark:border-gray-700/10">
              <h4 className="font-bold text-sm tracking-wide flex items-center gap-2">
                <FileCheck className={cn("w-4.5 h-4.5", isDark ? "text-[#34D399]" : "text-[#15803D]")} />
                {formulaModal.title}
              </h4>
              <button 
                onClick={() => setFormulaModal(null)}
                className="text-gray-400 hover:text-gray-200 text-lg font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-500/10 transition-all"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <span className={cn("text-xs font-bold", isDark ? "text-gray-400" : "text-gray-500")}>
                Consensus Mathematical Expression:
              </span>
              <div className={cn(
                "p-3.5 rounded-xl font-mono text-sm border font-semibold select-all transition-colors duration-500 shadow-inner text-center",
                isDark ? "bg-[#020617] border-gray-800/60 text-[#34D399]" : "bg-gray-50 border-gray-200 text-[#15803D]"
              )}>
                {formulaModal.formula}
              </div>

              <span className={cn("text-xs font-bold mt-2", isDark ? "text-gray-400" : "text-gray-500")}>
                Scope Verification Method:
              </span>
              <p className={cn("text-xs leading-relaxed transition-colors duration-500", isDark ? "text-gray-300" : "text-gray-700")}>
                {formulaModal.explanation}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-800/10 dark:border-gray-700/10">
              <button 
                onClick={() => {
                  setCustomLogs(prev => [`>> [FORMULA_ACTION] Copied formula expression to secure clipboard.`, ...prev.slice(0, 5)]);
                  alert('Formula copied to enclave memory!');
                  setFormulaModal(null);
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300",
                  isDark ? "bg-[#22D3EE] hover:bg-[#06B6D4] text-[#0F172A]" : "bg-[#0891B2] hover:bg-[#0369A1] text-white"
                )}
              >
                Copy Formula
              </button>
              <button 
                onClick={() => setFormulaModal(null)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300",
                  isDark ? "bg-transparent border-gray-800 hover:bg-gray-800 text-gray-300" : "bg-transparent border-gray-200 hover:bg-gray-100 text-gray-600"
                )}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
