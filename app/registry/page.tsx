// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Database, Sparkles, BrainCircuit, Activity, Server } from 'lucide-react';
import { AtomicCard } from '@/lib/design-system/AtomicCard';
import { AtomicBadge } from '@/lib/design-system/AtomicBadge';
import { AtomicButton } from '@/lib/design-system/AtomicButton';
import { useThemeStore } from '@/lib/theme-store';

export default function RegistryDashboard() {
  const { omniTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState<'registry' | 'memory'>('registry');
  const [components, setComponents] = useState<any[]>([]);
  const [shards, setShards] = useState<any[]>([]);
  const [ultimates, setUltimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistry = async () => {
    try {
      const res = await fetch('/api/atomic/registry');
      if (res.ok) {
        const data = await res.json();
        setComponents(data.registry || []);
      }
    } catch (e) {
      console.error('Failed to fetch registry', e);
    }
  };

  const fetchMemory = async () => {
    try {
      const resShards = await fetch('/api/agent/memory-shards?type=shards');
      const resUltimates = await fetch('/api/agent/memory-shards?type=ultimates');

      if (resShards.ok) {
        const data = await resShards.json();
        setShards(data.shards || []);
      }
      if (resUltimates.ok) {
        const data = await resUltimates.json();
        setUltimates(data.ultimates || []);
      }
    } catch (e) {
      console.error('Failed to fetch memory', e);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchRegistry(), fetchMemory()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-700 p-6 md:p-12 font-sans ${'bg-[#F8FAFC] text-slate-800 selection:bg-cyan-500/30'}`}
    >
      <header
        className={`max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-6 mb-8 ${'border-slate-200'}`}
      >
        <div>
          <h1
            className={`text-2xl font-bold tracking-widest flex items-center gap-3 uppercase font-mono ${'text-slate-900'}`}
          >
            <Server className={`w-8 h-8 ${'text-slate-700'}`} /> OmniCore Vault
          </h1>
          <p className={`text-sm mt-2 font-mono ${'text-slate-500'}`}>
            Real-time telemetry of synced assets on Supabase
          </p>
        </div>

        <div className={`flex p-1 rounded-lg border ${'bg-white border-slate-200 shadow-sm'}`}>
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-4 py-2 rounded flex items-center gap-2 text-sm font-bold font-mono transition-colors ${
              activeTab === 'registry'
                ? 'bg-[#06b6d4]/20 text-[#06b6d4]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" /> Atomic Registry
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`px-4 py-2 rounded flex items-center gap-2 text-sm font-bold font-mono transition-colors ${
              activeTab === 'memory'
                ? 'bg-[#10b981]/20 text-[#10b981]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BrainCircuit className="w-4 h-4" /> Eternal Memory
          </button>
        </div>
      </header>

      <main role="main" className="max-w-6xl mx-auto">
        {loading ? (
          <div className="h-64 flex flex-col justify-center items-center gap-4">
            <Activity className="w-8 h-8 text-[#06b6d4] animate-pulse" />
            <span className="font-mono text-sm text-slate-400">
              Syncing with Supabase Quantum Layer...
            </span>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in- duration-700">
            {activeTab === 'registry' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg text-[#06b6d4] font-mono tracking-widest flex items-center gap-2">
                    <Database className="w-5 h-5" /> Synced Components ({components.length})
                  </h2>
                  <AtomicButton
                    variant="outline"
                    onClick={fetchRegistry}
                    className="border-[#06b6d4]/30 text-[#06b6d4]"
                  >
                    Refresh Registry
                  </AtomicButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {components.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500 font-mono">
                      No atomic components synced yet.
                    </div>
                  ) : (
                    components.map((atom, idx) => (
                      <AtomicCard
                        key={idx}
                        glassIntensity="medium"
                        hoverEffect="glow"
                        padding="md"
                        className={`flex flex-col gap-4 ${
                          omniTheme === 'v2' ? 'bg-white border-slate-200 shadow-sm' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span
                            className={`font-bold font-mono flex items-center gap-2 text-sm ${'text-slate-800'}`}
                          >
                            <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                            {atom.atom_id || atom.atomId}
                          </span>
                          <AtomicBadge
                            variant={
                              atom.status === 'Trustworthy' || atom.core?.status === 'Trustworthy'
                                ? 'verified'
                                : 'warning'
                            }
                          >
                            {atom.status || atom.core?.status || 'Experimental'}
                          </AtomicBadge>
                        </div>
                        <div
                          className={`space-y-2 text-xs font-mono p-3 rounded border ${'text-slate-600 bg-slate-50 border-slate-200'}`}
                        >
                          <div className="flex justify-between">
                            <span className={'text-slate-400'}>TYPE</span>
                            <span className={'text-slate-700'}>{atom.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={'text-slate-400'}>VERSION</span>
                            <span className={'text-slate-700'}>{atom.version}</span>
                          </div>
                          <div
                            className={`pt-2 mt-2 border-t flex flex-col gap-1 ${'border-slate-200'}`}
                          >
                            <span className={'text-slate-400'}>INTENT</span>
                            <span
                              className={`truncate ${'text-slate-700'}`}
                              title={atom.intent || atom.reference?.intent}
                            >
                              {atom.intent || atom.reference?.intent}
                            </span>
                          </div>
                        </div>
                      </AtomicCard>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'memory' && (
              <div className="space-y-12">
                {/* Ultimates */}
                <div className="space-y-6">
                  <h2 className="text-lg text-[#10b981] font-mono tracking-widest flex items-center gap-2 border-b border-slate-200 pb-4">
                    <Sparkles className="w-5 h-5" /> Skill Ultimates ({ultimates.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ultimates.length === 0 ? (
                      <div className="col-span-full text-center py-6 text-slate-500 font-mono">
                        No ultimates synthesized yet.
                      </div>
                    ) : (
                      ultimates.map((u, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-xl border border-[#10b981]/30 bg-neutral-100 from-[#10b981]/10 to-transparent"
                        >
                          <h3 className="text-lg font-bold text-white mb-2">
                            {u.skill_name || u.skillName}
                          </h3>
                          <p className="text-sm text-slate-300 mb-4">{u.synthesis}</p>
                          <AtomicBadge
                            variant="outline"
                            className="border-[#10b981]/50 text-[#10b981]"
                          >
                            Mastery: {u.mastery_level || u.masteryLevel}
                          </AtomicBadge>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Shards */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                    <h2 className="text-lg text-amber-500 font-mono tracking-widest flex items-center gap-2">
                      <Database className="w-5 h-5" /> Memory Shards ({shards.length})
                    </h2>
                    <AtomicButton
                      variant="outline"
                      onClick={async () => {
                        setLoading(true);
                        try {
                          await fetch('/api/agent/memory-shards/extract-logs', { method: 'POST' });
                          await fetchMemory();
                        } catch (e) {
                          console.error(e);
                        }
                        setLoading(false);
                      }}
                      className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10 text-xs"
                    >
                      Extract from Logs
                    </AtomicButton>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shards.length === 0 ? (
                      <div className="col-span-full text-center py-6 text-slate-500 font-mono">
                        No memory shards extracted yet.
                      </div>
                    ) : (
                      shards.map((s, idx) => (
                        <AtomicCard key={idx} glassIntensity="low" padding="md">
                          <h4
                            className="text-sm font-bold text-amber-400 mb-2 truncate"
                            title={s.title}
                          >
                            {s.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-3 mb-4">
                            {s.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {(s.tags || []).map((t: string, i: number) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-slate-200 text-slate-300"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        </AtomicCard>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
