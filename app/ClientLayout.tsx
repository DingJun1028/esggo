'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';

const HIDE_NAV = ['/login', '/register'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) setCollapsed(saved === 'true');
  }, []);

  const handleToggle = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  }, []);

  if (!mounted) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#003262', flexDirection: 'column', gap: 16,
      }}>
        <div style={{
          width: 44, height: 44, background: '#FDB515', borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 11, color: '#003262',
        }}>ESG</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>載入中...</div>
      </div>
    );
  }

  const hideNav = HIDE_NAV.includes(pathname);
  if (hideNav) return <>{children}</>;

  const sidebarWidth = isMobile ? 0 : (collapsed ? 64 : 256);

  return (
    <div className="app-shell">
      {!isMobile && (
        <Sidebar collapsed={collapsed} onToggle={handleToggle} />
      )}
      <main
        className="app-main"
        style={{
          marginLeft: sidebarWidth,
          paddingBottom: isMobile ? 64 : 0,
          minHeight: '100vh',
          background: 'var(--surface-1)',
        }}
      >
        {children}
      </main>
      {isMobile && <MobileNav />}
    </div>
  );
}