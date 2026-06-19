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
import { OmniMangaTutorial } from '@/components/omni/UI/OmniMangaTutorial';

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

const REPORTS_MANGA_PANELS = [
  {
    id: 1,
    src: '/assets/manga/reports-panel-1.png',
    title: '資料攝入',
    description: '將分散的 ESG 數據、文件與 OCR 識別內容餵入萬能煉製漏斗。',
    pill: 'INGEST'
  },
  {
    id: 2,
    src: '/assets/manga/reports-panel-2.png',
    title: '智能處理',
    description: 'AI 靈魂驅動數據結構化，建立具備 5T 溯源能力的原子資產。',
    pill: 'PROCESS'
  },
  {
    id: 3,
    src: '/assets/manga/reports-panel-3.png',
    title: '誠信鍛造',
    description: '透過 5T 協議進行嚴謹驗算與 Hash 鎖定，產出不可篡改的報告。',
    pill: 'FORGE'
  },
  {
    id: 4,
    src: '/assets/manga/reports-panel-4.png',
    title: '共享發布',
    description: '將永續實績發布至共享大廳，達成利益相關者的價值共鳴。',
    pill: 'PUBLISH'
  }
];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-10">
      {/* 🔮 Resonance Guide Modal */}
      <ResonanceGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} phase="EVOLVE" />

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-[-0.05em] text-[var(--theme-text-main)] flex items-center gap-4">
            永續資產總控台 <span className="bg-omni-primary/10 text-omni-primary text-xs px-3 py-1 rounded-full font-mono tracking-normal">V1.1</span>
          </h1>
          <p className="text-[var(--theme-text-muted)] mt-5 max-w-2xl text-lg font-medium leading-relaxed tracking-tight">
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

      {/* 📖 漫畫教學導引 - Global Manifestation */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <OmniMangaTutorial 
          title="永續五室：報告煉製流程" 
          subtitle="The Alchemy of Trustworthy Reports" 
          panels={REPORTS_MANGA_PANELS} 
        />
      </div>

      {/* 📊 Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '總資產數', value: reports.length, icon: Database, color: 'text-[#63a6b0]' },
          { label: '已封印 (Hash Locked)', value: reports.filter(r => r.status === 'Published').length, icon: ShieldCheck, color: 'text-[#63a6b0]' },
          { label: '5T 覆蓋率', value: '88%', icon: Zap, color: 'text-amber-500' },
          { label: '仁督共鳴', value: reports.length > 0 ? hep.getResonanceScore(reports[0] as any) : 0, icon: BarChart3, color: 'text-[#63a6b0]' },
        ].map((stat, idx) => (
          <LiquidGlassContainer
            key={idx}
            className={`p-6 flex items-center gap-4 ${stat.label === '仁督共鳴' ? 'ring-1 ring-omni-primary/30 shadow-lg shadow-omni-primary/10 animate-pulse hover:bg-omni-primary/5 transition-all duration-500' : ''}`}
            onClick={stat.label === '仁督共鳴' ? () => setIsGuideOpen(true) : undefined}
          >
            <div className={`size-12 rounded-2xl bg-omni-primary/10 flex items-center justify-center shadow-inner`}>
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
              <History size={20} className="text-[#63a6b0]" /> 最近煉製資產
            </h3>
            <Link href="#" className="text-sm font-bold text-[#63a6b0] hover:underline">查看全部</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.length > 0 ? (
              reports.map((report) => (
                <ReportCard
                  key={report.uuid}
                  uuid={report.uuid.slice(0, 8)}
                  title={report.name}
                  subtitle={report.domain}
                  version="1.0"
                  status={report.status as any}
                  icon={Database}
                  category={report.domain || 'N/A'}
                  standardRef={report.description}
                  onClick={() => console.log(`Opening report ${report.uuid}`)}
                />
              ))
            ) : (
              <div className="md:col-span-2 py-12 flex flex-col items-center justify-center bg-[#63a6b0]/5 rounded-3xl border border-dashed border-[#63a6b0]/20">
                <Database size={48} className="text-[#63a6b0]/20 mb-4" />
                <p className="text-omni-text-sub font-bold">尚無已煉製之資產</p>
                <Link href="/omni/reports/data-forge/edit" className="mt-4 text-sm text-[#63a6b0] font-black underline">立即開始第一筆煉製</Link>
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