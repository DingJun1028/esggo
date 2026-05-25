import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: {
    default: 'ESG GO | 5T 永續治理系統',
    template: '%s | ESG GO',
  },
  description: '臺北市中小企業永續治理實證系統 v8.5 · Berkeley Haas × TSISDA · 5T 誠信協議驅動之 ESG 報告自動化平台',
  keywords: ['ESG', 'GRI', 'TCFD', '永續報告', '台灣', '中小企業', '5T', '誠信協議'],
  robots: { index: true, follow: true },
  icons: [{ rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' }],
  openGraph: {
    title: 'ESG GO | 5T 永續治理系統',
    description: 'Berkeley Haas × TSISDA 跨界合作 — 5T 誠信協議驅動之 ESG 報告自動化平台',
    siteName: 'ESG GO',
    locale: 'zh_TW',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

function LoadingFallback() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F8FAFC' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #003262', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: 13, color: '#94A3B8', fontFamily: 'system-ui' }}>OmniHermes + ESG Go</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Suspense fallback={<LoadingFallback />}>
          <ClientLayout>{children}</ClientLayout>
        </Suspense>
      </body>
    </html>
  );
}