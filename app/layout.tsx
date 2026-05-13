import type { Metadata } from 'next';
import './globals.css';
import { Suspense } from 'react';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'ESG GO | Omni_Terminal',
  description: '臺北市中小企業永續治理實證系統 v8.5.0-Alpha — 5T Integrity Protocol',
};

function LoadingScreen() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#003262', flexDirection: 'column', gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, background: '#FDB515', borderRadius: 13,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 12, color: '#003262', letterSpacing: '-0.5px',
      }}>ESG</div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>系統載入中...</div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Suspense fallback={<LoadingScreen />}>
          <ClientLayout>{children}</ClientLayout>
        </Suspense>
      </body>
    </html>
  );
}