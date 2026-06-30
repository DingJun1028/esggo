export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { AuthProvider } from '@/components/AuthProvider';
import { AgnesProvider } from '@/components/AgnesProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'ESGGO — 萬能中心 | 5T 永續數據治理平台',
  description: 'ESGGO 萬能中心：OmniCore 同心圓系統、5T 協議、OmniOne 覺醒 AI、永續報告產生器',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;600;700&family=Noto+Serif+TC:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Fira+Code&family=Montserrat:wght@700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('esggo-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`
        }} />
      </head>
      <body className="bg-primary text-textPrimary font-sans min-h-screen transition-colors duration-300">
        <AuthProvider>
          <AgnesProvider>
            <GlobalNav />
            <main>{children}</main>
          </AgnesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

function toggleTheme() {
  const d = document.documentElement;
  const isDark = d.classList.toggle('dark');
  localStorage.setItem('esggo-theme', isDark ? 'dark' : 'light');
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = isDark ? '🌙' : '☀️';
}

function GlobalNav() {
  const NAV = [
    { href: '/',                  label: '首頁',     icon: '⊙', color: 'hover:text-accentTeal hover:bg-accentTeal/10' },
    { href: '/omni-center',       label: '萬能中心',  icon: '◎', color: 'hover:text-accentGold hover:bg-accentGold/10' },
    { href: '/sustain-write/v5',  label: 'ESG 報告', icon: '📊', color: 'hover:text-accentBlue hover:bg-accentBlue/10' },
    { href: '/emm',              label: 'EMM IDE', icon: '🔍', color: 'hover:text-accentPurple hover:bg-accentPurple/10' },
  ];
  return (
    <nav className="sticky top-0 z-[200] bg-secondary/80 backdrop-blur-md border-b border-borderColor px-5 h-[52px] flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accentTeal flex items-center justify-center font-['Montserrat'] font-bold text-[15px] text-black">E</div>
        <span className="font-['Montserrat'] font-bold text-base text-accentTeal">ESGGO</span>
        <span className="bg-accentGold text-black px-2 py-0.5 rounded-md text-[10px] font-bold">v5.0</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {NAV.map(n => (
            <a key={n.href} href={n.href} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] text-textSecondary transition-all duration-200 ${n.color}`}>
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </a>
          ))}
        </div>
        <button onClick={toggleTheme} className="w-7 h-7 flex items-center justify-center rounded-md text-textSecondary hover:text-accentTeal hover:bg-accentTeal/10 transition-all text-sm" title="切換主題">
          <span id="theme-icon">☀️</span>
        </button>
        <div className="border-l border-borderColor h-5"/>
      </div>
    </nav>
  );
}
