'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Plus,
  ArrowRight,
  ShieldCheck,
  Database,
  Zap,
  LayoutGrid,
  History
} from 'lucide-react';
import { ReportCard } from '@/components/omni/liquid-glass/ReportCard';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { TrustBadgeGroup } from '@/components/omni/verification/TrustBadgeGroup';
import { getAllReports } from '@/core/ncb/report-actions';
import { IReportMetadata } from '@/core/types/omni-types';
import { hep } from '@/core/OmniHypercube';
import { ResonanceGuide } from '@/components/omni/education/ResonanceGuide';
import { Info } from 'lucide-react';
import Link from 'next/link';
import { OmniComicStrip, ComicPanel } from '@/components/omni/cards/OmniComicStrip';

/**
 * 🛰️ Sustainability Reports Dashboard (永續報告總控台)
 * 展示現有報告資產之 5T 狀態、統計數據與動態入口。
 * 貫徹「知識即資產」的總覽介面。
 */
export default function ReportsPage() {
  const [reports, setReports] = useState<IReportMetadata[]>([]);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllReports();
        setReports(data || []);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };
    fetchData();
  }, []);

  const comicPanels: [ComicPanel, ComicPanel, ComicPanel, ComicPanel] = [
    { id: '1', title: '散落的數據', description: '各部門 ESG 數據散落，難以整合且缺乏公信力，容易遭到漂綠質疑。', color: 'danger' },
    { id: '2', title: '萬能煉製', description: '透過資料煉製室，將龐雜數據收集並轉換為標準化的原子數據。', color: 'primary' },
    { id: '3', title: '5T 查驗', description: '所有數據經過嚴謹的 5T 協議驗算與 Hash 鎖定，確保不可篡改。', color: 'accent' },
    { id: '4', title: '永續資產', description: '最終產出具高度信賴的永續報告資產，化無形價值為實質競爭力。', color: 'success' }
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-10">
      {/* 🔮 Resonance Guide Modal */}
      <ResonanceGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} phase="EVOLVE" />

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-[#1D1D1F] flex items-center gap-4">
            永續資產總控台 <span className="bg-omni-primary/10 text-omni-primary text-sm px-3 py-1 rounded-full font-mono">V1.1</span>
          </h1>
          <p className="text-omni-text-sub mt-4 max-w-2xl text-lg leading-relaxed">
            數據、見證與轉化的核心樞紐。在這裡，每一筆 ESG 數據都將通過 5T 協議轉化為企業的永續資產。
          </p>
        </div>

        <Link href="/omni/reports/data-forge/edit">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-omni-primary text-white rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-omni-primary/20"
          >
            <Plus size={20} /> 煉製新資產
          </motion.button>
        </Link>
      </header>

      {/* 📖 漫畫教學導引 */}
      <div className="max-w-7xl mx-auto">
        <OmniComicStrip panels={comicPanels} />
      </div>

      {/* 📊 Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '總資產數', value: reports.length, icon: Database, color: 'text-blue-500' },
          { label: '已封印 (Hash Locked)', value: reports.filter(r => r.status === 'Published').length, icon: ShieldCheck, color: 'text-green-500' },
          { label: '5T 覆蓋率', value: '88%', icon: Zap, color: 'text-amber-500' },
          { label: '仁督共鳴', value: reports.length > 0 ? hep.getResonanceScore(reports[0] as any) : 0, icon: BarChart3, color: 'text-omni-primary' },
        ].map((stat, idx) => (
          <LiquidGlassContainer
            key={idx}
            className={`p-4 flex items-center gap-4 ${stat.label === '仁督共鳴' ? 'ring-1 ring-omni-primary/30 shadow-[0_0_15px_rgba(99,166,176,0.15)] animate-pulse hover:bg-omni-primary/10' : ''}`}
            onClick={stat.label === '仁督共鳴' ? () => setIsGuideOpen(true) : undefined}
          >
            <div className={`size-10 rounded-xl bg-opacity-10 flex items-center justify-center ${stat.color.replace('text', 'bg')}`}>
              <stat.icon size={22} className={stat.color} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-omni-text-muted uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-black text-omni-text-main">
                {stat.label === '仁督共鳴' ? (
                  <span className="flex items-center gap-1">
                    {stat.value} <span className="text-[10px] opacity-50">HEP</span>
                  </span>
                ) : stat.value}
              </p>
            </div>
          </LiquidGlassContainer>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-omni-text-main flex items-center gap-2">
              <History size={20} className="text-omni-primary" /> 最近煉製資產
            </h3>
            <Link href="#" className="text-sm font-bold text-omni-primary hover:underline">查看全部</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.length > 0 ? (
              reports.map((report) => (
                <div key={report.uuid} className="omni-card group hover:bg-white hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 border-none ring-1 ring-black/5">
                  <div className="flex justify-between items-start mb-6">
                    <div className="px-3 py-1 rounded-lg bg-omni-primary/5 text-omni-primary font-bold text-[10px] uppercase tracking-wider">
                      {report.domain}
                    </div>
                    <div className={`px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider ${report.status === 'Published' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>
                      {report.status}
                    </div>
                  </div>
                  <h4 className="text-xl font-black text-[#1D1D1F] mb-2 group-hover:text-omni-primary transition-colors">{report.name}</h4>
                  <p className="text-sm text-omni-text-sub line-clamp-2 mb-8 leading-relaxed">{report.description}</p>

                  <div className="pt-4 border-t border-omni-glass-border flex flex-col gap-3">
                    <TrustBadgeGroup
                      size="sm"
                      showLabel={false}
                      status={{
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: report.status === 'Published'
                      }}
                    />
                    <div className="text-[9px] font-mono text-omni-text-muted truncate">
                      UUID: {report.uuid}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="md:col-span-2 py-12 flex flex-col items-center justify-center bg-black/5 rounded-3xl border border-dashed border-omni-glass-border">
                <Database size={48} className="text-omni-text-muted opacity-20 mb-4" />
                <p className="text-omni-text-sub font-bold">尚無已煉製之資產</p>
                <Link href="/omni/reports/data-forge/edit" className="mt-4 text-sm text-omni-primary font-black underline">立即開始第一筆煉製</Link>
              </div>
            )}
          </div>
        </div>

        {/* 5 Chambers Navigation */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-lg font-black text-omni-text-main flex items-center gap-2">
            <LayoutGrid size={20} className="text-omni-primary" /> 永續 5 室 (5 Chambers)
          </h3>
          <div className="space-y-3">
            {[
              { label: '資料煉製室 (Data Forge)', sub: '數據採集與 5T 原子化', href: '/omni/reports/data-forge', color: 'from-blue-500/20', tag: 'Traceable' },
              { label: '驗算誠信室 (Verification)', sub: '公式透明與琥珀封存', href: '/omni/reports/verification', color: 'from-purple-500/20', tag: 'Transparent' },
              { label: '報告編寫室 (Foundry)', sub: 'AI 敘事與感知鍛造', href: '/omni/reports/factory', color: 'from-emerald-500/20', tag: 'Tasteful' },
              { label: '共享發布室 (Agora)', sub: '多維分發與溝通', href: '/omni/reports/agora', color: 'from-amber-500/20', tag: 'Transcendent' },
              { label: '策略演化室 (Think Tank)', sub: '洞察分析與策略演化', href: '/omni/reports/insight-think-tank', color: 'from-omni-primary/20', tag: 'Trustworthy' },
            ].map((link, idx) => (
              <Link key={idx} href={link.href} className="block group">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${link.color} to-transparent border border-omni-glass-border group-hover:border-omni-primary/50 transition-all relative overflow-hidden`}>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-omni-text-main group-hover:text-omni-primary transition-colors text-sm">{link.label}</h4>
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-white/50 text-omni-text-muted uppercase">{link.tag}</span>
                      </div>
                      <p className="text-[10px] text-omni-text-sub">{link.sub}</p>
                    </div>
                    <ArrowRight size={18} className="text-omni-text-muted group-hover:text-omni-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="absolute -right-2 -bottom-2 text-[40px] font-black text-black/5 pointer-events-none select-none italic">
                    {idx + 1}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="p-6 bg-omni-primary text-white rounded-3xl relative overflow-hidden shadow-xl shadow-omni-primary/20 group">
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-2 flex items-center gap-2">服務即教學 <Zap size={18} className="animate-pulse" /></h4>
              <p className="text-xs opacity-90 leading-relaxed">
                在 InfoOne，每次資產煉製都是一次 ESG 技能修煉。完成五室全路徑，解鎖 **v9.0 永續導師** 認證。
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <ShieldCheck size={80} className="absolute -bottom-4 -right-4 opacity-10 rotate-12 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}