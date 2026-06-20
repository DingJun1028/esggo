// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Bot,
  BarChart3,
  FileText,
  Zap,
  ArrowRight,
  TrendingUp,
  Sparkles,
  MessageSquare,
  Star,
  Leaf,
  Globe,
  Play,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';
import { FiveTStrip } from '@/components/ui/v2/FiveTStrip';

/* ─── Data ─── */
const KPI_DATA = [
  {
    title: '碳排放量',
    value: '1,284',
    unit: 'tCO₂e',
    trend: -5.2,
    trendLabel: 'vs last quarter',
    fiveTStatus: [true, true, true, true, true],
    dataSource: 'EPA Database',
  },
  {
    title: '治理評分',
    value: '92',
    unit: '/100',
    trend: 3.1,
    trendLabel: 'vs last audit',
    fiveTStatus: [true, true, true, true, false],
    dataSource: 'Internal Audit',
  },
  {
    title: '供應鏈合規',
    value: '87',
    unit: '%',
    trend: -1.8,
    trendLabel: 'vs last month',
    fiveTStatus: [true, true, true, false, false],
    dataSource: 'SCM System',
  },
  {
    title: '水資源效率',
    value: '98.5',
    unit: '%',
    trend: 2.4,
    trendLabel: 'vs last year',
    fiveTStatus: [true, true, true, true, true],
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
  },
  {
    icon: Lock,
    title: 'ZKP + SHA-256 數位封印',
    desc: '零知識證明 + 雜湊鏈不可篡改',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Bot,
    title: 'Omni-Agent 智能調度',
    desc: '多代理人協作自動化管理',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    icon: BarChart3,
    title: '即時數據儀表板',
    desc: 'RWD 雙向同步 TypeScript',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: FileText,
    title: 'AI 永續報告撰寫',
    desc: '全息編織自動生成 GRI 報告',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    icon: Zap,
    title: '區塊鏈溯源',
    desc: '端到端供應鏈透明化',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
];

const QUICK_LINKS = [
  { href: '/dashboard', label: '儀表板', icon: BarChart3 },
  { href: '/vault', label: '證據保管庫', icon: Lock },
  { href: '/dashboard/audit', label: '稽核驗證', icon: ShieldCheck },
  { href: '/intelligence', label: '商情中心', icon: Globe },
  { href: '/agents', label: '萬能代理', icon: Bot },
  { href: '/sustain-write', label: '永續撰寫', icon: FileText },
];

const TESTIMONIALS = [
  {
    quote: '這真的幫我省了 2 週！',
    author: '王顧問',
    role: '永續顧問',
    avatar: '📊',
    highlight: '節省 2 週',
  },
  {
    quote: '原來 ESG 可以這麼智能！AI 幫我找到了從未注意到的碳排熱點。',
    author: '林永續',
    role: '某製造業 CSO',
    avatar: '🌱',
    highlight: '智能洞察',
  },
  {
    quote: '15 分鐘完成過去 3 個月的工作，而且品質更好！',
    author: '陳廠長',
    role: '製造業廠長',
    avatar: '🏭',
    highlight: '15 分鐘',
  },
  {
    quote: '這個證明太值錢了！投資人看到 ZKP 證明後，立刻決定投資我們。',
    author: '李技術長',
    role: '某科技公司 CTO',
    avatar: '🔐',
    highlight: '獲得投資',
  },
];

/* ─── Main Page ─── */
export default function LandingPage() {
  const [liveStats, setLiveStats] = useState({ agents: 0, memories: 0, verified: 0 });
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    // Fetch live stats
    fetch('/api/system/health')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d)
          setLiveStats({
            agents: d.activeAgents || 7,
            memories: d.codexEntries || 32,
            verified: d.verifiedCount || 156,
          });
      })
      .catch(() => {});
  }, []);
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ─── Hero ─── */}
      <section aria-label="main content" className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">
              System Online
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tight leading-tight mb-4">
            ESGGO
            <span className="block text-neutral-900">善向永續系統</span>
          </h1>

          <p className="text-base md:text-lg text-neutral-500 max-w-xl mx-auto mb-10 leading-relaxed">
            臺北市中小企業永續治理實證系統
            <br className="hidden md:block" />
            Berkeley Haas × TSISDA · 5T 誠信協議驅動
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-10">
            {[
              { label: 'AI 輔助分析', value: '98.5%', sub: '準確率' },
              { label: '節省時間', value: '70%', sub: 'vs 傳統方式' },
              { label: '降低成本', value: '97%', sub: 'vs 外包' },
              { label: '報告生成', value: '15 min', sub: '一鍵完成' },
            ].map((m) => (
              <Card key={m.label} variant="default" padding="sm" hover>
                <p className="text-2xl font-black text-neutral-900">{m.value}</p>
                <p className="text-xs text-neutral-500 mt-1">{m.label}</p>
                <p className="text-[10px] text-neutral-400">{m.sub}</p>
              </Card>
            ))}
          </div>

          {/* 5T Strip */}
          <div className="max-w-sm mx-auto mb-8">
            <FiveTStrip status={[true, true, true, true, true]} showLabels />
          </div>

          {/* Live Stats */}
          <div className="flex items-center justify-center gap-6 mb-8">
            {[
              { label: '活躍代理', value: liveStats.agents, icon: Bot },
              { label: '記憶碎片', value: liveStats.memories, icon: Sparkles },
              { label: '已驗證', value: liveStats.verified, icon: ShieldCheck },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5 text-xs text-neutral-500">
                <stat.icon size={10} />
                <span className="font-mono font-bold text-neutral-700">{stat.value}</span>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard">
              <Button size="lg">
                進入系統
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/sustain-write">
              <Button variant="secondary" size="lg">
                <Sparkles size={18} className="text-amber-500" />
                開始撰寫
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── KPI Overview ─── */}
      <section aria-label="main content" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-cyan-500" />
          永續數據概覽
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_DATA.map((kpi) => (
            <Card key={kpi.title} variant="default" padding="md" hover>
              <CardHeader>
                <CardTitle>{kpi.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-black text-neutral-900">
                  {kpi.value}
                  <span className="text-sm font-medium text-neutral-400 ml-1">{kpi.unit}</span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={kpi.trend > 0 ? 'success' : 'error'} size="sm">
                    {kpi.trend > 0 ? '↑' : '↓'} {Math.abs(kpi.trend)}%
                  </Badge>
                  <span className="text-xs text-neutral-400">{kpi.trendLabel}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Platform Highlights ─── */}
      <section aria-label="main content" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <Sparkles size={20} className="text-amber-500" />
          平台亮點
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HIGHLIGHTS.map((item) => (
            <Card key={item.title} variant="outlined" padding="md" hover>
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
                  item.bg
                )}
              >
                <item.icon size={20} className={item.color} />
              </div>
              <h3 className="text-sm font-bold text-neutral-900 mb-1">{item.title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section aria-label="main content" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <MessageSquare size={20} className="text-amber-500" />
          用戶怎麼說
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <Card key={i} variant="default" padding="md" hover>
              <div className="flex items-center gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={12} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed mb-4 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
                <span className="text-xl">{t.avatar}</span>
                <div>
                  <p className="text-sm font-bold text-neutral-900">{t.author}</p>
                  <p className="text-[10px] text-neutral-400">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Quick Links ─── */}
      <section aria-label="main content" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">快速入口</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card variant="default" padding="sm" hover className="text-center">
                <link.icon size={20} className="text-neutral-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-neutral-700">{link.label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
                <Leaf size={16} className="text-amber-400" />
              </div>
              <span className="text-sm font-bold text-neutral-900">ESGGO 善向永續</span>
            </div>
            <p className="text-xs text-neutral-400">
              v8.5.2-Alpha · Berkeley Haas × TSISDA · 5T 誠信協議驅動
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
