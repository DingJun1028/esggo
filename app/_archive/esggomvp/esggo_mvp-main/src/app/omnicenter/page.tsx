'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';

export default function OmniCenter() {
  const { t, locale } = useLanguage();

  const categories = [
    {
      id: 'strategy-center',
      title: locale === 'zh-TW' ? "AI 策略中心" : "AI Strategy Center",
      description: locale === 'zh-TW' ? "AI 驅動的數據洞察與決策邏輯，引導全域成長。" : "AI-driven data insights and decision logic.",
      icon: '🧠',
      href: '/cognitive/strategy-center',
      protocol: 'Traceable',
    },
    {
      id: 'daily-briefing',
      title: locale === 'zh-TW' ? "每日 ESG 簡報" : "Daily ESG Briefing",
      description: locale === 'zh-TW' ? "每日精選全球永續發展動態，培養直覺能力。" : "Daily curated intelligence for elite sustainability.",
      icon: '📰',
      href: '/cognitive/daily-briefing',
      protocol: 'Transparent',
    },
    {
      id: 'health-check',
      title: locale === 'zh-TW' ? "企業健康檢查" : "Enterprise Health Check",
      description: locale === 'zh-TW' ? "系統性診斷企業風險，掌握 Scope 1-3 方法學。" : "Systemic diagnostic for organizational resilience.",
      icon: '💎',
      href: '/excellence/health-check',
      protocol: 'Trackable',
    },
    {
      id: 'green-finance',
      title: locale === 'zh-TW' ? "綠色融資助手" : "Green Finance Assistant",
      description: locale === 'zh-TW' ? "連結資本市場與綠色金融工具，優化融資結構。" : "Connect with sustainable capital markets.",
      icon: '💰',
      href: '/excellence/green-finance',
      protocol: 'Tangible',
    },
    {
      id: 'governance',
      title: t.categories.governance,
      description: t.nav.governance === '治理合規' ? '符合 GRI/SASB 標準，建立不可篡改的誠信護照。' : 'Compliant with GRI/SASB standards.',
      icon: '🏛️',
      href: '/governance/report-forge',
      protocol: 'Trustworthy',
    },
    {
      id: 'agency',
      title: t.categories.agency,
      description: t.nav.agency === '智能代理' ? '自主任務代理調度，優化自動化業務流程。' : 'Autonomous task agency scheduling.',
      icon: '🛡️',
      href: '/agency',
      protocol: 'Transcendent',
    },
    {
      id: 'bi-analytics',
      title: locale === 'zh-TW' ? "BI 全域效能矩陣" : "BI Performance Matrix",
      description: locale === 'zh-TW' ? "高階商業智慧與營運中樞，整合全局情報與預測。" : "Advanced BI and operational hub with predictive insights.",
      icon: '📊',
      href: '/omni/bi-analytics',
      protocol: 'Tangible',
    },
    {
      id: 'report-center',
      title: locale === 'zh-TW' ? "永續報告中樞" : "Report Library",
      description: locale === 'zh-TW' ? "ESG Go 永續報告中心，統一管理超過 200 種資產。" : "Unified management for over 200 report assets.",
      icon: '🏛️',
      href: '/omni/report-center',
      protocol: 'Transparent',
    }
  ];

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* 🌌 Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1600px] mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0"
      >
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-[-0.04em] text-[var(--primary)] mb-2">OmniCenter</h1>
          <p className="text-[var(--theme-text-muted)] text-sm font-medium tracking-tight">{t.nav.dashboard === '儀表板' ? '萬能中心：全域服務導航' : 'Universal Center: Global Service Navigation'}</p>
        </div>
        <Link href="/" className="text-xs text-[var(--sidebar-text)] hover:text-[var(--primary)] transition-colors tracking-widest uppercase font-bold">
          {t.common.backToOrigin}
        </Link>
      </motion.header>

      {/* 📦 3-Panel Knowledge Matrix Layout */}
      <main className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* Left Panel: 自然共鳴律 (Philosophy Integration) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden xl:flex flex-col p-8 liquid-glass rounded-3xl theme-sidebar border-[var(--card-border)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/5 to-transparent pointer-events-none" />
          <h3 className="text-[var(--sidebar-text)] text-xs tracking-[0.3em] font-black uppercase mb-8">Philosophy (L)</h3>

          <div className="flex-1 flex flex-col justify-center gap-6">
            <h2 className="text-3xl font-black text-[var(--foreground)] leading-tight">自然共鳴律</h2>
            <div className="w-12 h-1 bg-[var(--primary)] opacity-50" />

            <ul className="space-y-4 text-sm text-[var(--sidebar-text)] font-medium">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)]">✤</span>
                道法自然 (Align with Nature)
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)]">✤</span>
                系統毅然 (Systematic Resilience)
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)]">✤</span>
                上善若水 (Sentient Aqua)
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)]">✤</span>
                善向永續 (Sustainability First)
              </li>
            </ul>
          </div>
          <div className="mt-8 text-[10px] text-[var(--primary)] uppercase tracking-widest font-mono opacity-60">
            [Ti-Code: Resonance_Protocol]
          </div>
        </motion.div>

        {/* Center Core: 5T Protocol & Earth Hologram & Services Grid */}
        <div className="xl:col-span-2 flex flex-col gap-6">

          {/* Omni-Sprite System Hologram Core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="liquid-glass rounded-3xl p-8 theme-sidebar border-[var(--card-border)] relative overflow-hidden flex flex-col items-center justify-center min-h-[320px]"
          >
            {/* Hologram Effects */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <div className="w-80 h-80 rounded-full border border-[var(--primary)] opacity-20 animate-spin-slow absolute blur-[1px]" />
              <div className="w-64 h-64 rounded-full border border-[var(--accent)] opacity-10 animate-spin-slow absolute blur-[2px]" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
              <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_60%)] opacity-10 animate-pulse" />
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] bg-center" />
            </div>

            <div className="z-10 text-center flex flex-col items-center">
              <div className="px-3 py-1 bg-[var(--sidebar-hover-bg)] text-[var(--primary)] text-[10px] uppercase tracking-widest font-black rounded-full mb-4 border border-[var(--card-border)]">
                Omni-Sprite System
              </div>
              <h2 className="text-4xl font-black text-[var(--foreground)] mb-6 tracking-[-0.03em]">5T Protocol Core</h2>

              <div className="flex flex-wrap justify-center gap-3 max-w-lg">
                {['Traceable', 'Trackable', 'Transparent', 'Trustworthy', 'Tangible'].map(p => (
                  <div key={p} className="px-5 py-2.5 rounded-2xl bg-[var(--card-bg)] border border-omni-glass-border shadow-sm text-xs font-black text-[var(--theme-text-main)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all cursor-default">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Link href={cat.href} className="block h-full">
                  <LiquidGlassContainer
                    className="group relative h-full p-8 transition-all duration-300 hover:border-omni-primary/50 shadow-lg hover:shadow-omni-primary/10 flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-6 shrink-0">
                      <div className="text-4xl group-hover:scale-110 transition-transform duration-500 bg-omni-surface-2 p-3 rounded-2xl border border-omni-glass-border shadow-inner">
                        {cat.icon}
                      </div>
                      {cat.protocol && (
                        <div className="px-3 py-1 bg-omni-primary/10 border border-omni-primary/30 rounded-full text-[10px] font-black uppercase tracking-widest text-omni-primary">
                          {cat.protocol}
                        </div>
                      )}
                    </div>

                    <h2 className="text-2xl font-black mb-3 text-omni-text-main group-hover:text-omni-primary transition-colors tracking-tight">
                      {cat.title}
                    </h2>
                    <p className="text-omni-text-muted text-sm leading-relaxed mb-8 flex-grow font-medium">
                      {cat.description}
                    </p>

                    <div className="flex justify-between items-center mt-auto pt-6 border-t border-omni-glass-border">
                      <div className="atom-agent-badge flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-omni-primary">
                        <div className="size-2 rounded-full bg-omni-primary animate-pulse" />
                        {t.common.active}
                      </div>
                      <div className="text-[10px] font-bold text-omni-text-muted group-hover:text-omni-primary transition-colors">
                        ENTER_MODULE →
                      </div>
                    </div>
                  </LiquidGlassContainer>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Panel: 誠信閉環律 (Philosophy Integration) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden xl:flex flex-col p-8 liquid-glass rounded-3xl theme-sidebar border-[var(--card-border)] relative overflow-hidden text-right"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/5 to-transparent pointer-events-none" />
          <h3 className="text-[var(--sidebar-text)] text-xs tracking-[0.3em] font-black uppercase mb-8">Philosophy (R)</h3>

          <div className="flex-1 flex flex-col justify-center items-end gap-6">
            <h2 className="text-3xl font-black text-[var(--foreground)] leading-tight">誠信閉環律</h2>
            <div className="w-12 h-1 bg-[var(--accent)] opacity-50" />

            <ul className="space-y-4 text-sm text-[var(--sidebar-text)] font-medium flex flex-col items-end">
              <li className="flex items-start gap-3 justify-end flex-row-reverse">
                <span className="text-[var(--accent)]">✤</span>
                以終為始 (Begin with Output)
              </li>
              <li className="flex items-start gap-3 justify-end flex-row-reverse">
                <span className="text-[var(--accent)]">✤</span>
                始終如一 (Absolute Consistency)
              </li>
              <li className="flex items-start gap-3 justify-end flex-row-reverse">
                <span className="text-[var(--accent)]">✤</span>
                無始無終 (Infinite Loop)
              </li>
              <li className="flex items-start gap-3 justify-end flex-row-reverse">
                <span className="text-[var(--accent)]">✤</span>
                善向永續 (Sustainability Forever)
              </li>
            </ul>
          </div>
          <div className="mt-8 text-[10px] text-[var(--accent)] uppercase tracking-widest font-mono opacity-60">
            [Ti-Code: Integrity_Loop]
          </div>
        </motion.div>

      </main>

      {/* 🚀 Status Footer */}
      <footer className="max-w-[1600px] mx-auto mt-8 md:mt-16 pt-8 border-t border-[var(--card-border)] flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-4 sm:gap-0 text-[10px] text-[var(--sidebar-text)] tracking-[0.2em] uppercase font-bold">
        <div className="flex flex-wrap gap-4 md:gap-8">
          <span>{t.common.status}: <span className="text-green-500">Transcended</span></span>
          <span>Core: JunAiKey Beta</span>
        </div>
        <span>© 2026 InfoOne All-in-One</span>
      </footer>
    </div>
  );
}
