'use client';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import LoginButton from '@/components/LoginButton';
import { useEffect, useState } from 'react';

const NAV_MODULES = [
  {
    href: '/omni-center',
    icon: '◎',
    title: '萬能中心',
    subtitle: 'OmniCore Center',
    desc: 'ZKP 知識封印 · L-Hub 蜂群 · Trinity 覺醒',
    color: 'from-cyan-500/20 to-blue-500/10',
    accent: '#63a6b0',
    badge: '5T LIVE',
  },
  {
    href: '/sustain-write/v5',
    icon: '📊',
    title: 'ESG 報告產生器',
    subtitle: 'Sustain Write v5.0',
    desc: 'GRI 600+ 指標 · AI 自動合規 · PDF 封存',
    color: 'from-emerald-500/20 to-green-500/10',
    accent: '#52C41A',
    badge: 'v5.0',
  },
  {
    href: '/sustain-center',
    icon: '🌱',
    title: '萬能永續中心',
    subtitle: 'Sustain Center ∞ Evolution',
    desc: 'ESG 儀表板 · 碳排驗算 · 永續發展無限進化',
    color: 'from-teal-500/20 to-emerald-500/10',
    accent: '#38b2ac',
    badge: 'EVOLUTION',
  },
  {
    href: '/village',
    icon: '🏡',
    title: '村莊治理',
    subtitle: 'Village Governance',
    desc: '二次方投票 · 任務看板 · 社群協作',
    color: 'from-purple-500/20 to-violet-500/10',
    accent: '#a78bfa',
    badge: 'DAO',
  },
  {
    href: '/wiki',
    icon: '📚',
    title: '知識庫',
    subtitle: 'OmniWiki',
    desc: 'ESG 法規查詢 · GRI/TCFD/CSRD 解析',
    color: 'from-amber-500/20 to-orange-500/10',
    accent: '#ffd700',
    badge: 'KI',
  },
  {
    href: '/omni-agent',
    icon: '🤖',
    title: 'AI 代理控制台',
    subtitle: 'OmniAgent Console',
    desc: 'CelestialFlow 監控 · 自癒協議 · 代理蜂群',
    color: 'from-rose-500/20 to-pink-500/10',
    accent: '#f87171',
    badge: 'GNOSIS',
  },
  {
    href: '/resources',
    icon: '📦',
    title: '系統資源總覽',
    subtitle: 'Platform Resources',
    desc: '功能模組 · AI 模型 · 基礎設施 · 資源 inventory',
    color: 'from-amber-500/20 to-yellow-500/10',
    accent: '#D4AF37',
    badge: 'SYS',
  },
];

const FIVE_T = [
  { symbol: 'T¹', label: 'Traceable', zh: '可溯源', color: '#63a6b0' },
  { symbol: 'T²', label: 'Transparent', zh: '可驗算', color: '#52C41A' },
  { symbol: 'T³', label: 'Tangible', zh: '可感知', color: '#ffd700' },
  { symbol: 'T⁴', label: 'Trustworthy', zh: '不可篡改', color: '#a78bfa' },
  { symbol: 'T⁵', label: 'Trackable', zh: '可追蹤', color: '#38b2ac' },
];

// ⚡ Bolt Optimization: Extracted clock into isolated component to prevent full HomePage re-renders every 1s
function LiveClock() {
  const [now, setNow] = useState('');
  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleString('zh-TW', { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>🕐 {now}</span>;
}

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b2e 50%, #071420 100%)',
        fontFamily: "'Inter', 'PingFang TC', 'Microsoft JhengHei', sans-serif",
        color: '#e2e8f0',
        overflowX: 'hidden',
      }}
      >
      {/* ── 頂部狀態列 ── */}
      <header
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(99, 166, 176, 0.2)',
          padding: '12px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ fontSize: 14, color: '#63a6b0', fontWeight: 600, letterSpacing: '0.04em' }}>
          ESGGO 永續發展無限進化
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontSize: 13,
            color: '#94a3b8',
          }}
        >
          <LiveClock />
          <span style={{ color: '#63a6b0' }}>
            {loading ? '驗證中...' : user ? `✅ ${user.email}` : '⭕ 未登入'}
          </span>
          <span style={{ color: '#ffd700', fontWeight: 700 }}>Gemini 2.5 Flash</span>
          <LoginButton user={user ?? null} />
        </div>
      </header>

      {/* ── Hero 區塊 ── */}
      <section
        style={{
          textAlign: 'center',
          padding: '80px 32px 60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 背景光暈 */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(99,166,176,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'inline-block',
            background: 'linear-gradient(90deg, #63a6b0, #ffd700, #63a6b0)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: 'clamp(42px, 6vw, 72px)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: 16,
            animation: 'shimmer 3s linear infinite',
          }}
        >
          ESGGO 永續發展無限進化
        </div>
        <p
          style={{
            fontSize: 18,
            color: '#94a3b8',
            maxWidth: 520,
            margin: '0 auto 12px',
            lineHeight: 1.7,
          }}
        >
          善向永續 · 全通之心 · 無作妙德
        </p>
        <p style={{ fontSize: 14, color: '#64748b', maxWidth: 480, margin: '0 auto 40px' }}>
          以 5T 協議驅動的萬能 (Omni) ESG 治理平台 — 從碳排計算到永續報告，全程 AI
          賦能、可驗算、不可篡改。
        </p>

        {/* 5T 指示器 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {FIVE_T.map((t) => (
            <div
              key={t.symbol}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${t.color}40`,
                borderRadius: 12,
                padding: '8px 16px',
                minWidth: 80,
                transition: 'transform 0.2s, border-color 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLDivElement).style.borderColor = t.color;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.borderColor = `${t.color}40`;
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 900, color: t.color }}>{t.symbol}</span>
              <span style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{t.zh}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 模組導航卡片 ── */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px 80px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {NAV_MODULES.map((mod) => (
          <Link key={mod.href} href={mod.href} style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)`,
                backdropFilter: 'blur(16px)',
                border: `1px solid rgba(255,255,255,0.08)`,
                borderRadius: 20,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
                height: '100%',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(-4px)';
                el.style.borderColor = `${mod.accent}60`;
                el.style.boxShadow = `0 12px 40px ${mod.accent}20`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(0)';
                el.style.borderColor = 'rgba(255,255,255,0.08)';
                el.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: 36 }}>{mod.icon}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: mod.accent,
                    background: `${mod.accent}18`,
                    border: `1px solid ${mod.accent}40`,
                    borderRadius: 6,
                    padding: '2px 8px',
                  }}
                >
                  {mod.badge}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', marginBottom: 2 }}>
                  {mod.title}
                </div>
                <div style={{ fontSize: 12, color: mod.accent, fontWeight: 500 }}>
                  {mod.subtitle}
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                {mod.desc}
              </p>
              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 13, color: mod.accent, fontWeight: 600 }}>進入模組</span>
                <span style={{ color: mod.accent, fontSize: 14 }}>→</span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* ── 底部系統狀態 ── */}
      <footer
        style={{
          borderTop: '1px solid rgba(99,166,176,0.15)',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          color: '#475569',
          fontSize: 12,
        }}
      >
        <span>⚡ OmniCore ♾️ ESGGO v5.1 · TRANSCENDED · 5T Protocol Active ♾️</span>
        <span style={{ color: '#63a6b0' }}>上善若水，善向永續。知識即資產，服務即教學。</span>
        <span>GCP CloudRun · Firebase Firestore · Gemini 2.5 Flash</span>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes statusPulse {
          0% { background: #52C41A; box-shadow: 0 0 12px #52C41A; }
          50% { background: #38a169; box-shadow: none; }
          100% { background: #52C41A; box-shadow: 0 0 12px #52C41A; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,166,176,0.3); border-radius: 3px; }
      `}</style>
    </main>
  );
}
