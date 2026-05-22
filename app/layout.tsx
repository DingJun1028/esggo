import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'ESG GO 善向永續 | Omni_Terminal',
  description: '臺北市中小企業永續治理實證系統 v8.5.0-Alpha · Berkeley Haas × TSISDA · 5T 誠信協議',
  keywords: ['ESG', 'GRI', 'TCFD', '永續報告', '台灣', '中小企業'],
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
        <p style={{ fontSize: 13, color: '#94A3B8', fontFamily: 'system-ui' }}>ESG GO 善向永續</p>
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