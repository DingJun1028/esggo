'use client';

const NAV = [
  { href: '/', label: '首頁', icon: '⊙', color: 'hover:text-accentTeal hover:bg-accentTeal/10' },
  {
    href: '/omni-center',
    label: '萬能中心',
    icon: '◎',
    color: 'hover:text-accentGold hover:bg-accentGold/10',
  },
  {
    href: '/omni-todo',
    label: '萬能待辦',
    icon: '📋',
    color: 'hover:text-accentTeal hover:bg-accentTeal/10',
  },
  {
    href: '/sustain-write/v5',
    label: 'ESG 報告',
    icon: '📊',
    color: 'hover:text-accentBlue hover:bg-accentBlue/10',
  },
  {
    href: '/village',
    label: '永續村',
    icon: '🏘️',
    color: 'hover:text-accentTeal hover:bg-accentTeal/10',
  },
  {
    href: '/daily',
    label: '每日永續',
    icon: '📅',
    color: 'hover:text-accentGold hover:bg-accentGold/10',
  },
  {
    href: '/sonnar',
    label: 'Sonnar',
    icon: '🔎',
    color: 'hover:text-accentPurple hover:bg-accentPurple/10',
  },
  {
    href: '/emm',
    label: 'EMM IDE',
    icon: '🛠️',
    color: 'hover:text-accentPurple hover:bg-accentPurple/10',
  },
  {
    href: '/resources',
    label: '資源總覽',
    icon: '📦',
    color: 'hover:text-accentGold hover:bg-accentGold/10',
  },
  {
    href: '/export',
    label: '資料匯出',
    icon: '📥',
    color: 'hover:text-accentTeal hover:bg-accentTeal/10',
  },
  {
    href: '/profile',
    label: '個人檔案',
    icon: '👤',
    color: 'hover:text-accentBlue hover:bg-accentBlue/10',
  },
];

function toggleTheme() {
  const d = document.documentElement;
  const isDark = d.classList.toggle('dark');
  localStorage.setItem('esggo-theme', isDark ? 'dark' : 'light');
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = isDark ? '🌙' : '☀️';
}

export function GlobalNav() {
  return (
    <nav className="sticky top-0 z-[200] bg-secondary/80 backdrop-blur-md border-b border-borderColor px-5 h-[52px] flex items-center justify-between gap-4" aria-label="主導覽列">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accentTeal flex items-center justify-center font-['Montserrat'] font-bold text-[15px] text-black">
          E
        </div>
        <span className="font-['Montserrat'] font-bold text-base text-accentTeal">ESGGO</span>
        <span className="bg-accentGold text-black px-2 py-0.5 rounded-md text-[10px] font-bold">
          v5.0
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1" role="menubar" aria-label="導覽選單">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              role="menuitem"
              aria-label={n.label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] text-textSecondary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current ${n.color}`}
            >
              <span aria-hidden="true">{n.icon}</span>
              <span>{n.label}</span>
            </a>
          ))}
        </div>
        <button
          onClick={toggleTheme}
          className="w-7 h-7 flex items-center justify-center rounded-md text-textSecondary hover:text-accentTeal hover:bg-accentTeal/10 transition-all text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          title="切換主題"
          aria-label="切換主題"
        >
          <span id="theme-icon">☀️</span>
        </button>
        <div className="border-l border-borderColor h-5" />
      </div>
    </nav>
  );
}
