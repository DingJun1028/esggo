import React, { useEffect, useState } from 'react';
import { OmniEsgCell } from '@/omni/interaction/visuals/OmniEsgCell';
import { useAppStore } from '@/store/useAppStore';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { SkillExecutionEngine } from '@/services/SkillExecutionEngine';
import { IComponentCore } from '@/types/core';
import { Sparkles, ShieldAlert, Cpu, Zap } from 'lucide-react';
import { SystemLogConsole } from './SystemLogConsole.tsx';

interface TacticalDashboardProps {
  onOpenNote?: (id: string) => void;
}

// Temporary "Agent" core for the UI to execute skills
const dashboardAgent: IComponentCore = {
  uuid: 'ui-dashboard-core',
  version: '7.0.0',
  timestamp: Date.now(),
  formula: 'ISO-14001',
  impactMetric: 'UI_OPERATIONAL',
  label: 'TacticalDashboard',
  status: 'Trustworthy',
  lock: () => { },
  meridian: 'INWARD_REN',
  virtues: {
    intelligence: 8,
    benevolence: 8,
    integrity: 10,
    courage: 7,
    temperance: 7,
    harmony: 9,
  },
  evidence: {
    traceable: {
      source_origin: 'UI_MOCK',
      verification_links: [],
    },
    trackable: {
      lifecycle_hooks: [],
      pathway: ['UI', 'Dashboard'],
    },
    transparent: {
      formula: 'Dashboard_Integration',
      validation_standard: 'UI-Standard',
    },
    trustworthy: {
      hash_lock: '0x0-locked',
      is_frozen: true,
    },
  },
  data: { subject: 'Dashboard Operational Status' },
};

const UI_STRINGS = {
  executing: 'EXECUTING PROTOCOL...',
  initialize: 'INITIALIZE PROTOCOL',
  status: 'STATUS: OPERATIONAL',
  grid: 'GRID: SYNCED',
  ai: 'AI: SERAPHIM',
  sysDiag: 'Sys Diag',
  powerReroute: 'Power Re-route',
};

export const TacticalDashboard = ({ onOpenNote }: TacticalDashboardProps) => {
  const { userProfile } = useAppStore();
  const [isConsulting, setIsConsulting] = useState(false);

  useEffect(() => {
    // Initial greeting log
    omniLogger.info(LogCategory.SYSTEM, 'Tactical Command Center Initialized', {
      source_origin: 'Dashboard',
    });
  }, []);

  const handleConsult = async () => {
    if (isConsulting) return;
    setIsConsulting(true);
    try {
      await SkillExecutionEngine.getInstance().executeSkill(
        's_seraphim_advisor',
        dashboardAgent,
        { context: 'TacticalDashboard' },
        ['s_seraphim_advisor'] // Mock unlocked
      );
    } catch (e) {
      omniLogger.error(LogCategory.SYSTEM, 'Failed to execute Seraphim Advisor', { error: e });
    } finally {
      setIsConsulting(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in p-4 lg:p-0">
      {/* 1. HUD Header (Glass Panel) */}
      <header className="relative bg-void-light/30 border border-white/5 rounded-2xl p-6 backdrop-blur-md overflow-hidden">
        {/* Decorative HUD Lines */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary-emerald" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary-emerald" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end relative z-10">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-widest uppercase flex items-center gap-3">
              Tactical Command
              <div className="w-2 h-2 rounded-full bg-primary-emerald animate-pulse" />
            </h1>
            <p className="text-primary-emerald text-sm font-mono mt-1 flex items-center gap-4">
              <span>{UI_STRINGS.status}</span>
              <span className="text-primary flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> ENTROPY: 0.05%
              </span>
              <span className="text-titanium-dim">
                CMDR: {userProfile ? userProfile.name : 'UNAUTHENTICATED'}
              </span>
            </p>
          </div>

          <div className="mt-4 lg:mt-0 flex gap-2">
            <div className="px-3 py-1 rounded bg-primary-emerald/10 border border-primary-emerald/30 text-[10px] text-primary-emerald font-mono">
              {UI_STRINGS.grid}
            </div>
            <div className="px-3 py-1 rounded bg-primary/10 border border-primary/30 text-[10px] text-primary font-mono">
              {UI_STRINGS.ai}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Grid Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
        {/* Left Col: ESG Metrics (8 cols) */}
        <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
          {/* Holographic Card Wrapper */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-emerald to-cyber-blue opacity-20 blur transition duration-500 group-hover:opacity-40" />
            <div className="relative bg-void-light border border-white/10 rounded-xl p-1 h-full">
              <OmniEsgCell
                id="c1"
                label="Carbon Scope 1"
                value={1250.4}
                unit="tCO2e"
                trend={{ value: 5.2, direction: 'down' }}
                onOpenNote={onOpenNote}
              />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 opacity-20 blur transition duration-500 group-hover:opacity-40" />
            <div className="relative bg-void-light border border-white/10 rounded-xl p-1 h-full">
              <OmniEsgCell
                id="c2"
                label="Carbon Scope 2"
                value={890.2}
                unit="tCO2e"
                trend={{ value: 2.1, direction: 'up' }}
                onOpenNote={onOpenNote}
              />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur transition duration-500 group-hover:opacity-40" />
            <div className="relative bg-void-light border border-white/10 rounded-xl p-1 h-full">
              <OmniEsgCell
                id="e1"
                label="Grid Energy"
                value={15000}
                unit="kWh"
                onOpenNote={onOpenNote}
              />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-rose-500 opacity-20 blur transition duration-500 group-hover:opacity-40" />
            <div className="relative bg-void-light border border-white/10 rounded-xl p-1 h-full">
              <OmniEsgCell
                id="s1"
                label="Social SROI"
                value={4.2}
                unit="Ratio"
                trend={{ value: 12, direction: 'up' }}
                onOpenNote={onOpenNote}
              />
            </div>
          </div>
        </div>

        {/* Right Col: AI & Tools (4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Seraphim Advisor Card (Golden Glow) */}
          <div className="relative overflow-hidden rounded-2xl bg-void-light border border-primary/30 p-6 flex flex-col items-center text-center shadow-neon-gold">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
            <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center animate-float">
              <Sparkles
                className={`w-8 h-8 text-primary ${isConsulting ? 'animate-spin-slow' : ''}`}
              />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Seraphim Advisor</h3>
            <p className="text-xs text-titanium-dim mb-6 leading-relaxed">
              AI Diagnostics detect a <span className="text-cyber-alert">Scope 2 anomaly</span> in
              Sector 4. Optimization strategy (GAP_FILLING) is ready for deployment.
            </p>
            <button
              type="button"
              onClick={handleConsult}
              disabled={isConsulting}
              className={`w-full py-3 bg-primary/10 hover:bg-primary/20 border border-primary/50 text-primary font-bold rounded-lg uppercase tracking-wider text-xs transition-all ${isConsulting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isConsulting ? UI_STRINGS.executing : UI_STRINGS.initialize}
            </button>
          </div>

          {/* Quick Actions Matrix */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="p-4 rounded-xl bg-void-light border border-white/5 hover:border-white/20 flex flex-col items-center gap-2 group transition-all"
              onClick={() =>
                omniLogger.info(LogCategory.SYSTEM, 'System Diagnostic Started', {
                  source_origin: 'UI',
                })
              }
            >
              <Cpu className="w-6 h-6 text-cyber-blue group-hover:scale-110 transition-transform" />
              <span className="text-[10px] text-titanium-dim uppercase">{UI_STRINGS.sysDiag}</span>
            </button>
            <button
              type="button"
              className="p-4 rounded-xl bg-void-light border border-white/5 hover:border-white/20 flex flex-col items-center gap-2 group transition-all"
              onClick={() =>
                omniLogger.warn(LogCategory.SYSTEM, 'Power Re-route Initiated', {
                  source_origin: 'UI',
                })
              }
            >
              <Zap className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-[10px] text-titanium-dim uppercase">
                {UI_STRINGS.powerReroute}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Live System Feed (Console Style) */}
      <SystemLogConsole />
    </div>
  );
};
