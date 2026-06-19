/**
 * 🖥️ Omni Impact Dashboard (L3 Interface)
 * --------------------------------------------------
 * [Core] The Unified "Face" of the Omni System.
 * [Feature] High Density, Bi-Directional Sync, Constitutional Verification.
 */

import React from 'react';
import { Target, Leaf, Globe, TrendingUp, ShieldCheck, Activity, Zap } from 'lucide-react';
import { useImpactProject } from '@/store/useImpactProject'; // Assuming this store exists from legacy
import { OMNI_DECREE, verifyOmniLink } from '@/omni/core/OmniConstitution';
import { useOmniResonance } from '@store/index';
import { FunnelChart } from './charts/FunnelChart';
import { GanttChart } from './charts/GanttChart';
import { useEffect, useState } from 'react';

export const OmniImpactDashboard: React.FC = () => {
  const { projects } = useImpactProject();
  const { resonance, entropy } = useOmniResonance();
  const linkStatus = verifyOmniLink();

  const [funnelData, setFunnelData] = useState<any[]>([]);
  const [ganttData, setGanttData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [funnelRes, ganttRes] = await Promise.all([
          fetch('/api/visualizer/funnel'),
          fetch('/api/visualizer/gantt')
        ]);

        if (funnelRes.ok) {
          const data = await funnelRes.json();
          setFunnelData(data.data);
        }

        if (ganttRes.ok) {
          const data = await ganttRes.json();
          setGanttData(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch visualizer data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 p-6 max-w-[1600px] mx-auto">
      {/* 1. Constitutional Header */}
      <header className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-6 h-6 text-celestial-gold animate-pulse" />
            <h1 className="text-3xl font-bold text-white tracking-tight">{OMNI_DECREE.title}</h1>
            <span className="px-2 py-0.5 rounded text-[10px] bg-celestial-gold/20 text-celestial-gold border border-celestial-gold/50">
              {OMNI_DECREE.id} // ACTIVE
            </span>
          </div>
          <p className="text-slate-400 text-sm flex items-center gap-2">
            Principle: <span className="text-white font-mono">{OMNI_DECREE.principle}</span>
          </p>
        </div>

        {/* Protocol Status */}
        <div className="flex gap-4 text-xs font-mono">
          <div className="flex flex-col items-end">
            <span className="text-slate-500">MIND_TO_CODE</span>
            <span className="text-celestial-emerald">{linkStatus.sync.MIND_TO_CODE}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-slate-500">RESONANCE</span>
            <span className={resonance > 0.8 ? 'text-celestial-gold' : 'text-celestial-blue'}>
              {(resonance * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </header>

      {/* 2. High Density Grid (The Matrix) */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Impact Initiatives (Legacy Projects Refactored) */}
        <div className="col-span-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-celestial-blue" />
              Active Initiatives
            </h2>
            <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3 py-1.5 rounded text-xs transition-all">
              + Initialize Vector
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Demo High Density Card */}
            <div className="group relative p-5 rounded-xl bg-slate-900/40 border border-white/5 hover:border-celestial-gold/30 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-celestial-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-celestial-emerald" />
                    <span className="text-xs font-bold text-celestial-emerald tracking-wider">
                      ECO-01
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-celestial-emerald/10 text-[10px] text-celestial-emerald">
                    OPTIMIZING
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1 group-hover:text-celestial-gold transition-colors">
                  Solar Supply Chain Audit
                </h3>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                  Verifying supplier renewable energy certificates across Tier 1 partners.
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Completion</span>
                    <span>75%</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-celestial-emerald w-[75%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mapped Projects */}
            {projects.map(project => (
              <div
                key={project.id}
                className="group relative p-5 rounded-xl bg-slate-900/40 border border-white/5 hover:border-celestial-blue/30 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-slate-400">
                      {project.category.substring(0, 8).toUpperCase()}
                    </span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-1">{project.name}</h3>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified by OmniKey</span>
                </div>
              </div>
            ))}
          </div>

          {/* Strategic Visualization Row */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="h-[400px]">
              <FunnelChart
                data={funnelData.length > 0 ? funnelData : undefined}
                title="Evidence Certification Pipeline"
              />
            </div>
            <div className="h-[400px]">
              <GanttChart
                tasks={ganttData.length > 0 ? ganttData : undefined}
                title="Ecosystem Roadmap"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Omni Resonance & Entropy Visualization */}
        <div className="col-span-4 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-celestial-gold" />
            System Entropy
          </h2>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-sm">
            <div className="flex justify-between items-end mb-4">
              <span className="text-sm text-slate-400">Current Entropy ($\Delta$)</span>
              <span className="text-2xl font-mono text-white">{entropy.toFixed(3)}</span>
            </div>
            {/* Entropy Visualization Bar */}
            <div className="h-32 flex items-end justify-between gap-1 pb-2 border-b border-white/5">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-full bg-celestial-purple/20 rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${Math.random() * 80 + 20}%`,
                    opacity: 1 - i * 0.1,
                  }}
                />
              ))}
            </div>
            <div className="mt-3 flex justify-between text-xs text-slate-500">
              <span>HISTORY</span>
              <span>REAL-TIME</span>
            </div>
          </div>

          {/* ITK Value Stream */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-celestial-gold/5 to-transparent border border-celestial-gold/20">
            <h3 className="text-sm font-bold text-celestial-gold mb-3">ITK Value Generation</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white">Recent Refactor</span>
                <span className="text-celestial-gold font-mono">+5 ITK</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white">Entropy Reduction</span>
                <span className="text-celestial-gold font-mono">+12 ITK</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white">Logic Decoupling</span>
                <span className="text-celestial-gold font-mono">+8 ITK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
