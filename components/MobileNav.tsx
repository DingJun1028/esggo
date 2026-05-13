'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  PenLine,
  Leaf,
  ClipboardList,
  Send,
  TrendingUp,
  GraduationCap,
  Users,
  Shield,
  BarChart3,
  BookOpen,
  ChevronUp,
  Layers3,
} from 'lucide-react';

const primaryItems = [
  { href: '/',           icon: LayoutDashboard, label: '控制台' },
  { href: '/editor',     icon: PenLine,         label: '撰寫' },
  { href: '/environmental', icon: Leaf,          label: '環境' },
  { href: '/audit-log',  icon: ClipboardList,   label: '審計' },
  { href: '/publish',    icon: Send,            label: '發布' },
];

const quickItems = [
  { href: '/roadmap', icon: TrendingUp, label: '路線圖' },
  { href: '/academy', icon: GraduationCap, label: '學院' },
  { href: '/social', icon: Users, label: '社會' },
  { href: '/governance', icon: Shield, label: '治理' },
  { href: '/intelligence', icon: BarChart3, label: '商情' },
  { href: '/reading-room', icon: BookOpen, label: '閱覽' },
];

const allShortcutItems = [
  ...primaryItems,
  ...quickItems,
  { href: '/materiality', icon: Layers3, label: '重大性' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [openAll, setOpenAll] = useState(false);

  return (
    <>
      {openAll && (
        <div
          onClick={() => setOpenAll(false)}
          onKeyDown={(e) => {
            const isSpace = e.key === ' ';
            if (isSpace || e.key === 'Enter' || e.key === 'Escape') {
              e.preventDefault();
              setOpenAll(false);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="關閉快捷功能面板"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.24)',
            zIndex: 130,
          }}
        />
      )}

      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--border-0)',
          zIndex: 140,
          boxShadow: '0 -4px 20px rgba(0,50,98,0.08)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            padding: '8px 10px 6px',
            overflowX: 'auto',
            borderBottom: '1px solid var(--border-0)',
          }}
        >
          {quickItems.map(({ href, icon: Icon, label }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 10px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                  textDecoration: 'none',
                  fontSize: 11,
                  fontWeight: 600,
                  color: active ? 'var(--berkeley-blue)' : 'var(--text-secondary)',
                  background: active ? 'var(--founders-rock-light)' : 'var(--surface-1)',
                  border: active ? '1px solid var(--founders-rock-border)' : '1px solid var(--border-0)',
                }}
              >
                <Icon size={13} />
                {label}
              </Link>
            );
          })}
          <button
            onClick={() => setOpenAll(prev => !prev)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              border: '1px solid var(--border-1)',
              background: '#fff',
              borderRadius: 999,
              padding: '6px 10px',
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--berkeley-blue)',
              flexShrink: 0,
              cursor: 'pointer',
            }}
            aria-expanded={openAll}
            aria-label="開啟全部快捷功能"
          >
            全部
            <ChevronUp
              size={13}
              style={{
                transform: openAll ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform var(--dur-fast) var(--ease-out)',
              }}
            />
          </button>
        </div>

        {openAll && (
          <div style={{ padding: '10px 10px 8px', borderBottom: '1px solid var(--border-0)', background: '#fff' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: 0.2 }}>全部快捷功能</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
              {allShortcutItems.map(({ href, icon: Icon, label }) => {
                const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpenAll(false)}
                    style={{
                      textDecoration: 'none',
                      border: active ? '1px solid var(--founders-rock-border)' : '1px solid var(--border-0)',
                      borderRadius: 10,
                      padding: '9px 6px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      color: active ? 'var(--berkeley-blue)' : 'var(--text-secondary)',
                      background: active ? 'var(--founders-rock-light)' : '#fff',
                    }}
                  >
                    <Icon size={15} />
                    <span style={{ fontSize: 10, fontWeight: 600 }}>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'flex' }}>
          {primaryItems.map(({ href, icon: Icon, label }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  position: 'relative',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '9px 4px',
                  textDecoration: 'none',
                  color: active ? 'var(--berkeley-blue)' : 'var(--text-muted)',
                  transition: 'color var(--dur-fast) var(--ease-out)',
                  gap: 3,
                }}
              >
                <Icon size={20} />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: active ? 700 : 400,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {label}
                </span>
                {active && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      width: 20,
                      height: 2,
                      background: 'var(--berkeley-blue)',
                      borderRadius: '2px 2px 0 0',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
