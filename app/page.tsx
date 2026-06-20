'use client';

import React from 'react';
import Link from 'next/link';
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
  MessageSquare,
  Star,
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
    desc: 'Truth · Goodness · Beauty · Trust · Transferful',
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
  { href: '/dashboard/audit', label: '稽核驗證', icon: ShieldCheck, color: 'from-indigo-500 to-purple-600' },
  { href: '/intelligence', label: '商情中心', icon: Globe, color: 'from-amber-500 to-orange-600' },
  { href: '/agents', label: '萬能代理', icon: Bot, color: 'from-rose-500 to-pink-600' },
  { href: '/sustain-write', label: '永續撰寫', icon: FileText, color: 'from-violet-500 to-indigo-600' },
];

/* ─── Main Page ─── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-100/30 rounded-full" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-100/20 rounded-full" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-12">
          <div className="text-center max-w-3xl mx-auto">
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

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
              {[
                { label: 'AI 輔助分析', value: '98.5%', icon: '🤖', sub: '準確率' },
                { label: '節省時間', value: '70%', icon: '⏱️', sub: 'vs 傳統方式' },
                { label: '降低成本', value: '97%', icon: '💰', sub: 'vs 外包' },
                { label: '報告生成', value: '15 min', icon: '⚡', sub: '一鍵完成' },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="text-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm"
                >
                  <span className="text-lg">{metric.icon}</span>
                  <p className="text-lg font-black text-[#003262] mt-1">{metric.value}</p>
                  <p className="text-[9px] text-slate-400 font-medium">{metric.label}</p>
                  <p className="text-[8px] text-slate-300">{metric.sub}</p>
                </div>
              ))}
            </div>

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
          </div>
        </div>
      </section>

      {/* ─── KPI Overview ─── */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        <h2 className="text-xl md:text-2xl font-black text-[#003262] tracking-tight mb-6 flex items-center gap-2">
          <TrendingUp size={24} className="text-cyan-500" />
          永續數據概覽
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {KPI_DATA.map((kpi) => (
            <OmniKpiCard key={kpi.title} {...kpi} />
          ))}
        </div>
      </section>

      {/* ─── Platform Highlights ─── */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        <h2 className="text-xl md:text-2xl font-black text-[#003262] tracking-tight mb-6 flex items-center gap-2">
          <Sparkles size={24} className="text-amber-500" />
          平台亮點
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
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
            </div>
          ))}
        </div>
      </section>

      {/* ─── User Testimonials ─── */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        <h2 className="text-xl md:text-2xl font-black text-[#003262] tracking-tight mb-6 flex items-center gap-2">
          <MessageSquare size={24} className="text-amber-500" />
          用戶怎麼說
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              quote: '這真的幫我省了 2 週！',
              author: '王顧問',
              role: '永續顧問',
              avatar: '📊',
              rating: 5,
              highlight: '節省 2 週',
            },
            {
              quote: '原來 ESG 可以這麼智能！AI 幫我找到了從未注意到的碳排熱點。',
              author: '林永續',
              role: '某製造業 CSO',
              avatar: '🌱',
              rating: 5,
              highlight: '智能洞察',
            },
            {
              quote: '15 分鐘完成過去 3 個月的工作，而且品質更好！',
              author: '陳廠長',
              role: '製造業廠長',
              avatar: '🏭',
              rating: 5,
              highlight: '15 分鐘',
            },
            {
              quote: '這個證明太值錢了！投資人看到 ZKP 證明後，立刻決定投資我們。',
              author: '李技術長',
              role: '某科技公司 CTO',
              avatar: '🔐',
              rating: 5,
              highlight: '獲得投資',
            },
          ].map((testimonial, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all relative overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full">
                  {testimonial.highlight}
                </span>
              </div>
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-base text-slate-700 leading-relaxed mb-4 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                <span className="text-2xl">{testimonial.avatar}</span>
                <div>
                  <p className="text-sm font-bold text-[#003262]">{testimonial.author}</p>
                  <p className="text-[10px] text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Quick Links ─── */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        <h2 className="text-xl md:text-2xl font-black text-[#003262] tracking-tight mb-6">
          快速入口
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {QUICK_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 group cursor-pointer">
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
              </div>
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
            <p className="text-[10px] text-slate-300 font-mono">
              Build: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || process.env.NEXT_PUBLIC_APP_VERSION || 'local'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
