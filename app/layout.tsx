import type { Metadata } from 'next';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'ESGGO — 萬能中心 | 5T 永續數據治理平台',
  description: 'ESGGO 萬能中心：OmniCore 同心圓系統、5T 協議、OmniOne 覺醒 AI、永續報告產生器',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;600;700&family=Noto+Serif+TC:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Fira+Code&family=Montserrat:wght@700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
        <style>{`
          :root {
            --bg-color: #F7F8FA;
            --text-color: #1A1D23;
            --nav-bg: rgba(247, 248, 250, 0.92);
            --nav-border: rgba(0, 0, 0, 0.08);
            --card-bg: #FFFFFF;
            --card-border: rgba(0, 0, 0, 0.08);
            --card-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 2px 8px -1px rgba(0, 0, 0, 0.02);
            --surface-bg: #F0F2F5;
            --muted-color: #6B7280;
            --scroll-track: #F0F2F5;
            --scroll-thumb: #009EB0;
            --logo-text: #009EB0;
            --accent-teal: #009EB0;
            --accent-gold: #C9962A;
            --accent-blue: #2563EB;
            --accent-purple: #7C3AED;
            --accent-red: #DC2626;
            --font-serif: 'Noto Serif TC', 'Lora', serif;
          }
          [data-theme="dark"] {
            --bg-color: #0D0D0D;
            --text-color: #E8E8E8;
            --nav-bg: rgba(13, 13, 13, 0.92);
            --nav-border: rgba(0, 158, 176, 0.18);
            --card-bg: rgba(20, 20, 24, 0.85);
            --card-border: rgba(0, 158, 176, 0.2);
            --card-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 2px 8px -1px rgba(0, 0, 0, 0.3);
            --surface-bg: #1A1A1F;
            --muted-color: #9CA3AF;
            --scroll-track: #1A1A1F;
            --scroll-thumb: #009EB0;
            --logo-text: #009EB0;
            --accent-teal: #009EB0;
            --accent-gold: #D4AF37;
            --accent-blue: #3B82F6;
            --accent-purple: #8B5CF6;
            --accent-red: #FF4D6D;
            --font-serif: 'Noto Serif TC', 'Lora', serif;
          }
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          html{scroll-behavior:smooth}
          body{background:var(--bg-color);color:var(--text-color);font-family:'Noto Sans TC',sans-serif;min-height:100vh;transition:background 0.2s, color 0.2s}
          ::-webkit-scrollbar{width:4px;height:4px}
          ::-webkit-scrollbar-track{background:var(--scroll-track)}
          ::-webkit-scrollbar-thumb{background:var(--scroll-thumb);border-radius:2px}
          a{text-decoration:none;color:inherit}
          button{font-family:inherit}
          .nav-link{transition:all .2s}
          .nav-link:hover{color:var(--hover-color) !important;background:var(--hover-bg) !important}
        `}</style>
      </head>
      <body>
        <AuthProvider>
          <GlobalNav />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

function GlobalNav() {
  const NAV = [
    { href: '/',                  label: '首頁',     icon: '⊙', color: '#009EB0' },
    { href: '/omni-center',       label: '萬能中心',  icon: '◎', color: '#D4AF37' },
    { href: '/sustain-write/v5',  label: 'ESG 報告', icon: '📊', color: '#3B82F6' },
  ];
  return (
    <nav style={{
      position:'sticky', top:0, zIndex:200,
      background:'var(--nav-bg)', backdropFilter:'blur(16px)',
      borderBottom:'1px solid var(--nav-border)',
      padding:'0 20px', height:52,
      display:'flex', alignItems:'center', justifyContent:'space-between', gap:16,
    }}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:32,height:32,borderRadius:8,background:'#009EB0',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Montserrat',sans-serif",fontWeight:700,fontSize:15,color:'#000'}}>E</div>
        <span style={{fontFamily:"'Montserrat',sans-serif",fontWeight:700,fontSize:16,color:'var(--logo-text)'}}>ESGGO</span>
        <span style={{background:'#D4AF37',color:'#000',padding:'1px 7px',borderRadius:6,fontSize:10,fontWeight:700}}>v5.0</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{display:'flex',alignItems:'center',gap:4}}>
          {NAV.map(n => (
            <a key={n.href} href={n.href} className="nav-link" style={{
              display:'flex', alignItems:'center',gap:6,
              padding:'5px 12px',borderRadius:8,
              fontSize:13,color:'var(--muted-color)',
              transition:'all .2s',
              '--hover-color': n.color,
              '--hover-bg': n.color + '18',
            } as any}>
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </a>
          ))}
        </div>
        <div style={{borderLeft:'1px solid var(--nav-border)',height:20}}/>
      </div>
    </nav>
  );
}
