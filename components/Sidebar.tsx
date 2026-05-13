'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, PenLine, Fingerprint, BarChart3, Leaf, Users, Shield,
  AlertTriangle, FileCheck, ClipboardList, BookOpen, TrendingUp, Send,
  MessageSquare, Globe, Building2, CheckSquare, Link2, GraduationCap,
  UserCheck, Bot, Activity, Database, Stethoscope, Layers, Briefcase,
  HeartHandshake, FileText, Landmark, Heart, ChevronLeft, ChevronRight,
  Zap
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  sub?: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'CORE',
    items: [
      { href: '/',              label: '控制台',      sub: 'Dashboard',     icon: LayoutDashboard },
      { href: '/editor',        label: '永續撰寫',    sub: 'SustainWrite',  icon: PenLine,        badge: 'AI' },
      { href: '/digital-twin',  label: '數位分身',    sub: 'Digital Twin',  icon: Fingerprint },
      { href: '/health-check',  label: '企業健檢',    sub: 'Health Check',  icon: Stethoscope },
      { href: '/advisory',      label: '專家諮詢',    sub: 'Advisory',      icon: MessageSquare },
      { href: '/intelligence',  label: '商情中心',    sub: 'Intelligence',  icon: BarChart3 },
    ]
  },
  {
    title: 'E · S · G',
    items: [
      { href: '/environmental', label: '環境指揮',    sub: 'Environmental', icon: Leaf },
      { href: '/social',        label: '社會影響',    sub: 'Social',        icon: Users },
      { href: '/governance',    label: '公司治理',    sub: 'Governance',    icon: Shield },
    ]
  },
  {
    title: 'GOVERNANCE',
    items: [
      { href: '/materiality',   label: '重大性矩陣',  sub: 'Materiality',   icon: AlertTriangle },
      { href: '/audit-log',     label: '審計日誌',    sub: 'Audit Log',     icon: ClipboardList },
      { href: '/vault',         label: '證據金庫',    sub: 'Evidence Vault',icon: Database },
    ]
  },
  {
    title: 'INSIGHTS',
    items: [
      { href: '/roadmap',       label: '淨零路線圖',  sub: 'Net-Zero',      icon: TrendingUp },
      { href: '/publish',       label: '報告發布',    sub: 'Publish',       icon: Send },
      { href: '/reading-room',  label: '永續閱覽室',  sub: 'Reading Room',  icon: BookOpen },
      { href: '/library',       label: '永續智庫',    sub: 'Library',       icon: Landmark },
      { href: '/finance',       label: '永續財務',    sub: 'Finance',       icon: Layers },
      { href: '/supply-chain',  label: '供應鏈',      sub: 'Supply Chain',  icon: Globe },
      { href: '/stakeholders',  label: '利害關係人',  sub: 'Stakeholders',  icon: HeartHandshake },
      { href: '/audit-verify',  label: 'VerifyLink™', sub: 'ZKP Verify',    icon: FileText },
    ]
  },
  {
    title: 'ACADEMY',
    items: [
      { href: '/academy',       label: '永續學院',    sub: 'Academy',       icon: GraduationCap },
      { href: '/advisors',      label: '顧問專區',    sub: 'Advisors',      icon: UserCheck },
      { href: '/agents',        label: '代理專區',    sub: 'Agents',        icon: Briefcase },
      { href: '/consulting',    label: '顧問服務',    sub: 'Consulting',    icon: Heart },
      { href: '/ai-platform',   label: 'AI 整合平台', sub: 'AI Platform',   icon: Bot },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { href: '/tasks',         label: '任務中心',    sub: 'Tasks',         icon: CheckSquare },
      { href: '/profile',       label: '企業管理',    sub: 'Profile',       icon: Building2 },
      { href: '/api-setup',     label: '整合中心',    sub: 'API Setup',     icon: Link2 },
    ]
  }
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <aside
      style={{
        width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-w)',
        height: '100vh',
        background: 'var(--berkeley-blue)',
        position: 'fixed',
        top: 0, left: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--dur-slow) var(--ease-in-out)',
        zIndex: 200,
        overflow: 'hidden',
        boxShadow: '2px 0 20px rgba(0,0,0,0.18)',
      }}
    >
      {/* Logo Header */}
      <div style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        padding: collapsed ? '0 14px' : '0 16px',
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
        gap: 10,
      }}>
        {/* Logo Mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, overflow: 'hidden' }}>
          <div style={{
            width: 32,
            height: 32,
            background: 'var(--california-gold)',
            borderRadius: 9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 10.5,
            color: 'var(--berkeley-blue)',
            letterSpacing: '-0.5px',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(253,181,21,0.4)',
          }}>
            ESG
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                color: '#fff',
                fontWeight: 700,
                fontSize: 14.5,
                lineHeight: 1.2,
                letterSpacing: '-0.3px',
                whiteSpace: 'nowrap',
              }}>
                ESG GO
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.38)',
                fontSize: 8.5,
                fontWeight: 600,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                Omni_Terminal
              </div>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          style={{
            width: 24,
            height: 24,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 6,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.5)',
            transition: 'all var(--dur-fast) var(--ease-out)',
            flexShrink: 0,
          }}
          onMouseOver={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.14)';
            (e.currentTarget as HTMLButtonElement).style.color = '#fff';
          }}
          onMouseOut={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)';
          }}
          title={collapsed ? '展開側欄' : '收合側欄'}
        >
          {collapsed
            ? <ChevronRight size={12} />
            : <ChevronLeft size={12} />
          }
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '10px 0 8px' }}>
        {navGroups.map((group, gi) => (
          <div key={group.title} style={{ marginBottom: 2 }}>
            {/* Group Label */}
            {!collapsed && (
              <div style={{
                padding: gi === 0 ? '10px 18px 4px' : '12px 18px 4px',
                fontSize: 9.5,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
              }}>
                {group.title}
              </div>
            )}
            {collapsed && gi > 0 && (
              <div style={{
                height: 1,
                background: 'rgba(255,255,255,0.07)',
                margin: '8px 12px',
              }} />
            )}

            {/* Nav Items */}
            {group.items.map((item) => {
              const active = isActive(item.href);
              const hovered = hoveredHref === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHoveredHref(item.href)}
                  onMouseLeave={() => setHoveredHref(null)}
                  title={collapsed ? `${item.label} ${item.sub || ''}` : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    margin: '1px 8px',
                    padding: collapsed ? '8px 0' : '7px 10px',
                    borderRadius: 8,
                    textDecoration: 'none',
                    transition: `all var(--dur-fast) var(--ease-out)`,
                    background: active
                      ? 'rgba(253,181,21,0.13)'
                      : hovered
                        ? 'rgba(255,255,255,0.06)'
                        : 'transparent',
                    color: active
                      ? 'var(--california-gold)'
                      : hovered
                        ? 'rgba(255,255,255,0.88)'
                        : 'rgba(255,255,255,0.55)',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderLeft: active
                      ? '2px solid var(--california-gold)'
                      : '2px solid transparent',
                    paddingLeft: collapsed ? undefined : active ? '8px' : '10px',
                  }}
                >
                  <Icon
                    size={15}
                    style={{
                      flexShrink: 0,
                      opacity: active ? 1 : 0.8,
                      transition: 'opacity var(--dur-fast)',
                    }}
                  />
                  {!collapsed && (
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13,
                        fontWeight: active ? 600 : 500,
                        lineHeight: 1.25,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        letterSpacing: '-0.01em',
                      }}>
                        {item.label}
                      </div>
                      {item.sub && (
                        <div style={{
                          fontSize: 10,
                          opacity: 0.42,
                          fontWeight: 400,
                          marginTop: 1,
                        }}>
                          {item.sub}
                        </div>
                      )}
                    </div>
                  )}
                  {!collapsed && item.badge && (
                    <span style={{
                      fontSize: 8.5,
                      fontWeight: 800,
                      background: 'var(--california-gold)',
                      color: 'var(--berkeley-blue)',
                      padding: '1px 5px',
                      borderRadius: 3,
                      letterSpacing: '0.3px',
                      flexShrink: 0,
                    }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Status */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: collapsed ? '10px 8px' : '10px 16px',
        flexShrink: 0,
      }}>
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 7, height: 7,
              borderRadius: '50%',
              background: '#4ade80',
              boxShadow: '0 0 7px rgba(74,222,128,0.65)',
              flexShrink: 0,
              animation: 'pulse 2.5s ease-in-out infinite',
            }} />
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                Supabase 已連線
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', marginTop: 1 }}>
                5T 協議 · 實時同步
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 7, height: 7,
              borderRadius: '50%',
              background: '#4ade80',
              boxShadow: '0 0 7px rgba(74,222,128,0.65)',
            }} />
          </div>
        )}
      </div>
    </aside>
  );
}