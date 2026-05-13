'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PenLine, Leaf, ClipboardList, Send } from 'lucide-react';

const items = [
  { href: '/',           icon: LayoutDashboard, label: '控制台' },
  { href: '/editor',     icon: PenLine,         label: '撰寫' },
  { href: '/environmental', icon: Leaf,          label: '環境' },
  { href: '/audit-log',  icon: ClipboardList,   label: '審計' },
  { href: '/publish',    icon: Send,            label: '發布' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      background: 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderTop: '1px solid var(--border-0)',
      display: 'flex',
      zIndex: 100,
      boxShadow: '0 -4px 20px rgba(0,50,98,0.08)',
    }}>
      {items.map(({ href, icon: Icon, label }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 4px',
              textDecoration: 'none',
              color: active ? 'var(--berkeley-blue)' : 'var(--text-muted)',
              transition: 'color var(--duration-fast) var(--ease-out)',
              gap: 3,
            }}
          >
            <Icon size={20} />
            <span style={{
              fontSize: 10,
              fontWeight: active ? 700 : 400,
              letterSpacing: '-0.01em',
            }}>
              {label}
            </span>
            {active && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                width: 20, height: 2,
                background: 'var(--berkeley-blue)',
                borderRadius: '2px 2px 0 0',
              }} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}