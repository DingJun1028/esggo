'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Bot,
  BarChart3,
  FileText,
  Zap,
  ArrowRight,
  Leaf,
  Droplets,
  Users,
  TrendingUp,
  Globe,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import OmniKpiCard from '@/components/omni/OmniKpiCard';
import Protocol5TStrip from '@/components/omni/Protocol5TStrip';

/* ─── Data ─── */
const KPI_DATA = [
  {
    title: '碳排放量',
    value: '1,284',
    unit: 'tCO₂e',
    trend: -5.2,
    trendLabel: 'vs last quarter',
    fiveTStatus: [true, true, true, true, true] as [boolean, boolean, boolean, boolean, boolean],
    dataSource: 'EPA Database',
  },
  {
    title: '治理評分',
    value: '92',
    unit: '/100',
    trend: 3.1,
    trendLabel: 'vs last audit',
    fiveTStatus: [true, true, true, true, false] as [boolean, boolean, boolean, boolean, boolean],
    dataSource: 'Internal Audit',
  },
  {
    title: '供應鏈合規',
    value: '87',
    unit: '%',
    trend: -1.8,
    trendLabel: 'vs last month',
    fiveTStatus: [true, true, true, false, false] as [boolean, boolean, boolean, boolean, boolean],
    dataSource: 'SCM System',
  },
  {
    title: '水資源效率',
    value: '98.5',
    unit: '%',
    trend: 2.4,
    trendLabel: 'vs last year',
    fiveTStatus: [true, true, true, true, true] as [boolean, boolean, boolean, boolean, boolean],
    dataSource: 'Water Management',
  },
];

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: '5T 誠信協議',
    desc: 'Tangible · Traceable · Trackable · Transparent · Trustworthy',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
  },
  {
    icon: Lock,
    title: 'ZKP + SHA-256 數位封印',
    desc: '零知識證明 + 雜湊鏈不可篡改',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    icon: Bot,
    title: 'Omni-Agent 智能調度',
    desc: '多代理人協作自動化管理',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
  },
  {
    icon: BarChart3,
    title: '即時數據儀表板',
    desc: 'RWD 雙向同步 TypeScript',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    icon: FileText,
    title: 'AI 永續報告撰寫',
    desc: '全息編織自動生成 GRI 報告',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
  },
  {
    icon: Zap,
    title: '區塊鏈溯源',
    desc: '端到端供應鏈透明化',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
];

const QUICK_LINKS = [
  { href: '/dashboard', label: '儀表板', icon: BarChart3, color: 'from-cyan-500 to-blue-600' },
  { href: '/vault', label: '證據保管庫', icon: Lock, color: 'from-emerald-500 to-teal-600' },
  {
    href: '/dashboard/audit',
    label: '稽核驗證',
    icon: ShieldCheck,
    color: 'from-indigo-500 to-purple-600',
  },
  { href: '/intelligence', label: '商情中心', icon: Globe, color: 'from-amber-500 to-orange-600' },
  { href: '/agents', label: '萬能代理', icon: Bot, color: 'from-rose-500 to-pink-600' },
  {
    href: '/sustain-write',
    label: '永續撰寫',
    icon: FileText,
    color: 'from-violet-500 to-indigo-600',
  },
];

/* ─── Components ─── */
function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={cn('text-xl md:text-2xl font-black text-[#003262] tracking-tight mb-6', className)}
    >
      {children}
    </h2>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-100/30 rounded-full" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-100/20 rounded-full" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
                System Online
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-[#003262] tracking-tight leading-tight mb-4">
              ESGGO
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                善向永續系統
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
              臺北市中小企業永續治理實證系統
              <br className="hidden md:block" />
              Berkeley Haas × TSISDA · 5T 誠信協議驅動
            </p>

            {/* 5T Strip */}
            <div className="max-w-sm mx-auto mb-10">
              <Protocol5TStrip status={[true, true, true, true, true]} showLabels />
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#003262] text-white font-bold rounded-xl hover:bg-[#002244] transition-colors shadow-lg shadow-blue-900/20"
              >
                進入系統
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/sustain-write"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#003262] font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <Sparkles size={18} className="text-amber-500" />
                開始撰寫
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── KPI Overview ─── */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        <SectionTitle>
          <span className="flex items-center gap-2">
            <TrendingUp size={24} className="text-cyan-500" />
            永續數據概覽
          </span>
        </SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {KPI_DATA.map((kpi, i) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <OmniKpiCard {...kpi} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Platform Highlights ─── */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        <SectionTitle>
          <span className="flex items-center gap-2">
            <Sparkles size={24} className="text-amber-500" />
            平台亮點
          </span>
        </SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {HIGHLIGHTS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className={cn(
                'p-6 rounded-2xl border bg-white hover:shadow-lg transition-all duration-300 group cursor-default',
                item.border
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                  item.bg
                )}
              >
                <item.icon size={24} className={item.color} />
              </div>
              <h3 className="text-base font-bold text-[#003262] mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Quick Links ─── */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        <SectionTitle>快速入口</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {QUICK_LINKS.map((link, i) => (
            <Link key={link.href} href={link.href}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white',
                    link.color
                  )}
                >
                  <link.icon size={22} />
                </div>
                <span className="text-sm font-bold text-[#003262] group-hover:text-cyan-600 transition-colors">
                  {link.label}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-100 bg-white mt-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#003262] flex items-center justify-center">
                <Leaf size={16} className="text-[#FDB515]" />
              </div>
              <span className="text-sm font-bold text-[#003262]">ESGGO 善向永續</span>
            </div>
            <p className="text-xs text-slate-400">
              v8.5.2-Alpha · Berkeley Haas × TSISDA · 5T 誠信協議驅動
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
