'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hammer, Database, Layers, ArrowRight, Info, Plus, CheckCircle, Clock, AlertCircle, Zap } from 'lucide-react';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { getAllReports } from '@/core/ncb/report-actions';
import { IReportMetadata } from '@/core/types/omni-types';
import { hep } from '@/core/OmniHypercube';
import { ResonanceGuide } from '@/components/omni/education/ResonanceGuide';
import { OmniEsgCell } from '@/components/omni/cards/OmniEsgCell';
import { ServiceJourneyComic } from '@/components/omni/ServiceJourneyComic';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const modules = [
  {
    id: 'carbon',
    title: '碳足跡感測器',
    sub: 'Scope 1 直接排放 — IoT 數據採集',
    icon: <Database size={22} />,
    color: 'from-blue-500/20',
    href: '/omni/reports/data-forge/edit',
    status: 'active',
  },
  {
    id: 'energy',
    title: '能源採購台帳',
    sub: 'Scope 2 能源間接排放 — 綠電合約管理',
    icon: <Layers size={22} />,
    color: 'from-emerald-500/20',
    href: '/omni/reports/data-forge/edit',
    status: 'active',
  },
  {
    id: 'supply',
    title: '供應鏈雷達',
    sub: 'Scope 3 價值鏈排放 — 供應商數據同步',
    icon: <Layers size={22} />,
    color: 'from-amber-500/20',
    href: '/omni/reports/data-forge/edit',
    status: 'beta',
  },
  {
    id: 'water',
    title: '水資源稽核',
    sub: 'GRI 303 — 用水量、水質監控',
    icon: <Database size={22} />,
    color: 'from-cyan-500/20',
    href: '/omni/reports/data-forge/edit',
    status: 'coming',
  },
  {
    id: 'social',
    title: '社會責任台帳',
    sub: 'GRI 401 — 員工、社區、人權數據',
    icon: <Layers size={22} />,
    color: 'from-purple-500/20',
    href: '/omni/reports/data-forge/edit',
    status: 'coming',
  },
  {
    id: 'governance',
    title: '治理合規記錄',
    sub: 'GRI 205 — 反腐敗、董事會資訊',
    icon: <Database size={22} />,
    color: 'from-rose-500/20',
    href: '/omni/reports/data-forge/edit',
    status: 'coming',
  },
];

const statusConfig: Record<string, { label: string; icon: React.ReactNode; class: string }> = {
  active: { label: '可使用', icon: <CheckCircle size={12} />, class: 'bg-green-500/15 text-green-600 border-green-500/30' },
  beta: { label: 'Beta', icon: <Clock size={12} />, class: 'bg-amber-500/15 text-amber-600 border-amber-500/30' },
  coming: { label: '即將上線', icon: <AlertCircle size={12} />, class: 'bg-omni-text-muted/10 text-omni-text-muted border-omni-glass-border' },
};

export default function DataForgePage() {
  const [reports, setReports] = useState<IReportMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllReports().then((data) => {
      setReports(data);
      setIsLoading(false);
    });
  }, []);

  const draftCount = reports.filter(r => r.status === 'Draft').length;
  const publishedCount = reports.filter(r => r.status === 'Published').length;

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [theme, setTheme] = useState<'aqua' | 'aqua-light'>('aqua-light');

  return (
    <div className={cn("min-h-screen transition-colors duration-500", theme === 'aqua-light' ? 'theme-aqua-light bg-omni-bg' : 'theme-aqua bg-omni-bg')}>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-10">
        <ResonanceGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} phase="FORGE" />

        {/* Theme Toggle for Demo */}
        <div className="flex justify-end">
          <button
            onClick={() => setTheme(prev => prev === 'aqua' ? 'aqua-light' : 'aqua')}
            className="px-4 py-2 rounded-full border border-omni-glass-border text-xs font-bold text-omni-primary hover:bg-omni-primary/10 transition-colors"
          >
            Switch to {theme === 'aqua' ? 'Light' : 'Dark'} Mode
          </button>
        </div>
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="size-12 bg-omni-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-omni-primary/30">
                <Hammer size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-omni-text-main">
                  資料煉製所 <span className="text-omni-primary">(Data Forge)</span>
                </h1>
                <p className="text-omni-text-sub mt-0.5">數據從哪來？怎麼採集？確保「原料」的多元性與完整性。</p>
              </div>
            </div>
          </div>
          <Link href="/omni/reports/data-forge/edit">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-omni-primary text-white rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-omni-primary/20"
            >
              <Plus size={20} /> 新增煉製模組
            </motion.button>
          </Link>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '已建立資產', value: isLoading ? '…' : reports.length, color: 'text-omni-primary' },
            { label: '草稿中', value: isLoading ? '…' : draftCount, color: 'text-amber-500' },
            { label: '已發布', value: isLoading ? '…' : publishedCount, color: 'text-green-500' },
          ].map((s, i) => (
            <LiquidGlassContainer key={i} className="p-4 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] font-bold text-omni-text-muted uppercase tracking-widest mt-1">{s.label}</p>
            </LiquidGlassContainer>
          ))}
        </div>

        {/* 4D Space-Time & Teaching Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-omni-primary/5 border border-omni-primary/20 rounded-3xl p-8 flex items-start gap-6 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-sm font-black text-omni-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                <Zap size={16} className="animate-pulse" /> 服務即教學：UUID-DF-MANIFEST
              </h3>
              <p className="text-omni-text-main text-sm leading-relaxed max-w-2xl">
                這裡是數據的起點。我們將來自 IoT、供應鏈與台帳的原始行為，透過 **OmniSpaceTime (XYZ+W)** 4D 錨定，煉製為具備 5T 協議價值的「知識資產」。
                每一筆數據原子都將被賦予唯一的時空印記。透過**「任脈」**的數據吞吐與**「督脈」**的全局共鳴，達成虛實合一。
              </p>
              <div className="mt-6 flex gap-4">
                <div className="px-3 py-1 rounded-full bg-omni-primary text-white text-[9px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(99,166,176,0.3)]">
                  REN & DU MERIDIANS ACTIVE
                </div>
                <div className="px-3 py-1 rounded-full border border-omni-primary/30 text-omni-primary text-[9px] font-black uppercase tracking-widest">
                  5T_ATOMIC_FORGE
                </div>
              </div>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-omni-primary/10 to-transparent pointer-events-none" />
            <Database size={120} className="absolute -right-8 -bottom-8 text-omni-primary opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>

          <LiquidGlassContainer
            className="p-6 bg-omni-surface-2 border border-omni-primary/20 flex flex-col justify-center overflow-hidden relative group/guide transition-all ring-1 ring-transparent hover:ring-omni-primary/40 shadow-[0_0_15px_rgba(99,166,176,0.05)] hover:shadow-[0_0_20px_rgba(99,166,176,0.2)] animate-pulse hover:animate-none"
            onClick={() => setIsGuideOpen(true)}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="text-[10px] font-black text-omni-text-muted uppercase tracking-widest">Real-time Hypercube Feed (HEP)</div>
              <Info size={14} className="text-omni-primary opacity-0 group-hover/guide:opacity-100 transition-opacity" />
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-omni-text-sub">REN_DATA_FLOW</span>
                <span className="text-omni-primary font-black">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-omni-text-sub">DU_GOV_SYNC</span>
                <span className="text-emerald-400 font-black">SYNCED</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-omni-glass-border">
                <span className="text-omni-text-main font-bold">RESONANCE</span>
                <span className="text-omni-accent font-black text-sm">45 / 100</span>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 size-24 bg-omni-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-2 right-4 text-[8px] font-black text-omni-primary/60 uppercase tracking-widest opacity-0 group-hover/guide:opacity-100 transition-opacity">
              Click to Unlock Ren & Du Matrix
            </div>
          </LiquidGlassContainer>
        </div>

        {/* 4-Panel Comic: Service Journey */}
        <ServiceJourneyComic />

        {/* Module Grid */}
        <section>
          <h2 className="text-lg font-black text-omni-text-main mb-6">煉製模組選擇器 (Forge Module Selector)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((item, idx) => (
              <OmniEsgCell
                key={item.id}
                id={item.id}
                mode="card"
                label={item.title}
                value={item.status === 'active' ? 'READY' : 'PENDING'}
                subValue={item.sub}
                category={idx % 3 === 0 ? 'environmental' : idx % 3 === 1 ? 'social' : 'governance'}
                className={cn(item.status === 'coming' && 'opacity-60 grayscale')}
                sentientState={{
                  entropy: 0.1 + (idx * 0.05),
                  harmony: 0.9 - (idx * 0.05),
                  resonance: 85 - (idx * 5),
                  phase: 'FORGE'
                }}
                onClick={item.status === 'coming' ? undefined : () => window.location.href = item.href}
              />
            ))}
          </div>
        </section>

        {/* Recent drafts */}
        {reports.length > 0 && (
          <section>
            <h2 className="text-lg font-black text-omni-text-main mb-6">待完成草稿</h2>
            <div className="space-y-3">
              {reports.filter(r => r.status === 'Draft').map((r) => (
                <OmniEsgCell
                  key={r.uuid}
                  id={r.uuid}
                  mode="list"
                  label={r.name}
                  value={r.status}
                  subValue={`${r.domain} · ${r.uuid.slice(0, 8)}`}
                  category="environmental"
                  sentientState={{
                    entropy: 0.2,
                    harmony: 0.8,
                    resonance: 75,
                    phase: 'FORGE'
                  }}
                  onClick={() => window.location.href = `/omni/reports/${r.uuid}`}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
