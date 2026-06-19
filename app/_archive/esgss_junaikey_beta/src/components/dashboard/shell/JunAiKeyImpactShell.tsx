import React, { ReactNode, useEffect, useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Maximize2, Minimize2, MoreHorizontal, Globe } from 'lucide-react';
import { ArjunaAssembly } from '../quadrants/ArjunaAssembly';
import { GovernancePeak } from '../quadrants/GovernancePeak';
import { DeepAudit } from '../quadrants/DeepAudit';
import { ItkEconomy } from '../quadrants/ItkEconomy';
import { ESGReportGenFull } from '../../compliance/ESGReportGenFull';
import { LegionModule } from '../../intelligence/LegionModule';
import { IpmsModule } from '../../operations/IpmsModule';
import { DashboardTour } from './DashboardTour';
import { OmniAdminPanel } from '../../admin/OmniAdminPanel';

// Utility function for className merging (inline to avoid missing dependency)
const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ');

interface ShellQuadrantProps {
  title: string;
  position: 'nw' | 'ne' | 'sw' | 'se' | 'center';
  children: ReactNode;
  className?: string;
}

/**
 * 區塊容器 (Quadrant Container)
 * 帶有機械/HUD 風格的邊框
 */
const ShellQuadrant: React.FC<ShellQuadrantProps> = ({ title, position, children, className }) => {
  return (
    <div
      className={cn(
        'relative flex flex-col bg-slate-900/40 backdrop-blur-md border border-cyan-500/30 rounded-lg overflow-hidden transition-all duration-500 hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] group',
        className
      )}
    >
      {/* HUD Corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500/80 rounded-tl-sm" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-500/80 rounded-tr-sm" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-500/80 rounded-bl-sm" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500/80 rounded-br-sm" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-transparent">
        <h3 className="text-cyan-400 font-bold tracking-wider text-sm uppercase flex items-center gap-2">
          {title}
        </h3>
        <div className="flex gap-2 text-cyan-500/60">
          <MoreHorizontal className="w-4 h-4 cursor-pointer hover:text-cyan-400" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #22d3ee 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        {children}
      </div>
    </div>
  );
};

interface JunAiKeyImpactShellProps {
  children?: ReactNode; // Optional custom overlays
}

/**
 * JunAiKey Impact Shell (Fixed System)
 * 1:1 復刻 ImpactNexus 428 的固定佈局系統
 */
export const JunAiKeyImpactShell: React.FC<JunAiKeyImpactShellProps> = ({ children }) => {
  const { language } = useLanguage();
  const isZh = language === 'zh-TW';

  /* State for View Modes */
  const [viewMode, setViewMode] = useState<'dashboard' | 'report' | 'legion' | 'ipms' | 'admin'>(
    'dashboard'
  );

  // Tour State
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('junaikey_tour_seen');
    if (!hasSeenTour) {
      setShowTour(true);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-[#020617] text-white overflow-hidden p-4 md:p-8 flex items-center justify-center font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#020617] to-[#020617] pointer-events-none" />

      {/* Curved Screen Container */}
      <div
        className="relative w-full h-full max-w-[1920px] max-h-[1080px] transition-transform duration-700"
        style={{
          perspective: '2000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Main Shell Body (The curved surface) */}
        <div
          className="w-full h-full grid grid-cols-12 grid-rows-12 gap-4 p-6 bg-black/40 border-[3px] border-slate-700/50 rounded-[4rem] shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] backdrop-blur-sm relative overflow-hidden"
          style={{
            transform: 'rotateX(1deg)', // Slight curve effect
            boxShadow: '0 0 50px rgba(34, 211, 238, 0.1), inset 0 0 100px rgba(0,0,0,0.8)',
          }}
        >
          {/* Scanlines Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[2] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />

          {/* Header Bar */}
          <div className="col-span-12 row-span-1 flex justify-between items-center px-8 z-10 border-b border-white/5 pb-2">
            <div className="flex items-center gap-4">
              <div className="w-3 h-12 bg-cyan-500 rounded-sm animate-pulse" />
              <h1 className="text-2xl font-black tracking-[0.2em] text-cyan-100 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                {isZh ? 'JUNAIKEY 影響力護盾' : 'JUNAIKEY IMPACT SHELL'}
              </h1>
              {/* View Mode Indicator */}
              <div className="px-3 py-1 bg-white/10 rounded text-xs font-mono text-cyan-400 border border-cyan-500/30">
                MODE: {viewMode.toUpperCase()}
              </div>
            </div>
            <div className="text-xs font-mono text-cyan-500/60 uppercase tracking-widest flex items-center gap-4">
              <span>
                System Status: <span className="text-emerald-400 animate-pulse">OPTIMAL</span>
              </span>
              <span>SECURE CONNECTION</span>
            </div>
          </div>

          {/* === CONTENT AREA BASED ON MECE CATEGORIES === */}
          {/* 1. MONITOR (Overview): The Fixed 5-Zone Shell */}
          {viewMode === 'dashboard' ? (
            <>
              {/* North-West: Arjuna Assembly */}
              <ShellQuadrant
                title={isZh ? '阿周那集會' : 'ARJUNA ASSEMBLY'}
                position="nw"
                className="col-span-3 row-span-5 z-10"
              >
                <ArjunaAssembly />
              </ShellQuadrant>

              {/* Center Core: Globe & Score */}
              <div className="col-span-6 row-span-8 z-10 relative flex flex-col items-center justify-center">
                {/* Global G-Score Halo */}
                <div
                  className="relative mb-8 group cursor-pointer"
                  onClick={() => setViewMode('report')}
                >
                  <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full group-hover:bg-emerald-500/30 transition-all" />
                  <div className="relative w-48 h-48 rounded-full border-4 border-emerald-500/30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
                    <span className="text-6xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                      89.2
                    </span>
                    <span className="text-xs font-bold text-emerald-400 mt-1 tracking-widest">
                      GLOBAL G-SCORE
                    </span>
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400 text-xs font-bold whitespace-nowrap">
                    Click for Full Report
                  </div>
                </div>

                {/* 3D Globe Placeholder */}
                <div className="relative w-[500px] h-[300px] flex items-center justify-center">
                  <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-3xl" />
                  <div className="relative w-[300px] h-[300px] flex items-center justify-center animate-pulse-slow">
                    <Globe size={240} className="text-cyan-500/20" strokeWidth={0.5} />
                  </div>
                  <div className="absolute top-1/2 left-1/4 w-32 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan" />
                  {/* Connection Lines (Fake) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path
                      d="M 150 150 Q 250 50 350 150"
                      fill="none"
                      stroke="#d946ef"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="animate-dash"
                    />
                    <circle cx="150" cy="150" r="3" fill="#d946ef" />
                    <text x="140" y="170" fill="white" fontSize="10" fontWeight="bold">
                      TAIWAN
                    </text>
                    <circle cx="350" cy="150" r="3" fill="#d946ef" />
                    <text x="340" y="170" fill="white" fontSize="10" fontWeight="bold">
                      INDIA
                    </text>
                  </svg>
                </div>
              </div>

              {/* North-East: Governance Peak */}
              <ShellQuadrant
                title={isZh ? '治理巔峰' : 'GOVERNANCE PEAK'}
                position="ne"
                className="col-span-3 row-span-5 z-10"
              >
                <GovernancePeak />
              </ShellQuadrant>

              {/* South-West: Deep Audit */}
              <ShellQuadrant
                title={isZh ? '深度審計' : 'DEEP AUDIT'}
                position="sw"
                className="col-span-3 row-span-5 row-start-7 z-10"
              >
                <DeepAudit />
              </ShellQuadrant>

              {/* South-East: ITK Economy */}
              <ShellQuadrant
                title={isZh ? 'ITK 經濟' : 'ITK ECONOMY'}
                position="se"
                className="col-span-3 row-span-5 row-start-7 z-10"
              >
                <ItkEconomy />
              </ShellQuadrant>
            </>
          ) : (
            <div className="col-span-12 row-span-12 row-start-2 flex flex-col relative rounded-3xl overflow-hidden border border-white/10 bg-black/60 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
              {/* Close/Back Button */}
              <button
                onClick={() => setViewMode('dashboard')}
                className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/10 hover:border-white/30"
              >
                <Minimize2 className="w-5 h-5" />
              </button>

              {/* 4. COMPLIANCE (Reporting) */}
              {viewMode === 'report' && <ESGReportGenFull />}

              {/* 3. INTELLIGENCE (Legion) */}
              {viewMode === 'legion' && <LegionModule availableAgents={[]} />}

              {/* 2. OPERATIONS (IPMS) */}
              {viewMode === 'ipms' && <IpmsModule />}

              {/* 5. ADMIN (God Mode) */}
              {viewMode === 'admin' && <OmniAdminPanel />}
            </div>
          )}

          {/* Left Rail: Navigation Bay (MECE Optimized) */}
          <button
            onClick={() => setViewMode('legion')}
            className={`px-4 py-1.5 rounded-sm transition-all uppercase tracking-wider relative group ${viewMode === 'legion' ? 'bg-purple-500 text-white font-bold' : 'hover:bg-white/10 hover:text-purple-400'}`}
          >
            {isZh ? '3. 智慧' : '3. INTELLIGENCE'}
            {viewMode === 'legion' && (
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-purple-300" />
            )}
          </button>

          {/* 4. COMPLIANCE */}
          <button
            onClick={() => setViewMode('report')}
            className={`px-4 py-1.5 rounded-sm transition-all uppercase tracking-wider relative group ${viewMode === 'report' ? 'bg-emerald-500 text-black font-bold' : 'hover:bg-white/10 hover:text-emerald-400'}`}
          >
            <span className="flex items-center gap-2">
              {isZh ? '4. 合規' : '4. COMPLIANCE'}
              {/* Notification Dot */}
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            </span>
            {viewMode === 'report' && (
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-emerald-300" />
            )}
          </button>

          {/* 5. ADMIN (Special) */}
          <button
            onClick={() => setViewMode('admin')}
            className={`px-4 py-1.5 rounded-sm transition-all uppercase tracking-wider relative group ${viewMode === 'admin' ? 'bg-red-500 text-white font-bold' : 'hover:bg-white/10 hover:text-red-400'}`}
          >
            <span className="flex items-center gap-2">{isZh ? '🔐 管理' : '🔐 ADMIN'}</span>
            {viewMode === 'admin' && (
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-red-300" />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div>MECE PROTOCOL: ACTIVE</div>
        </div>
      </div>

      {/* Contextual Tour Overlay */}
      {showTour && (
        <DashboardTour
          onComplete={() => {
            setShowTour(false);
            localStorage.setItem('junaikey_tour_seen', 'true');
          }}
        />
      )}
    </div>
  );
};
