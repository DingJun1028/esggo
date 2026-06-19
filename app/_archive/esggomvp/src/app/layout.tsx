import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/components/LanguageProvider';
import NextAuthProvider from '@/components/NextAuthProvider';
import AuthProvider from '@/components/omni/UI/AuthMenu';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import MasterLayout from './MasterLayout';
import JunAiKey from '@/components/JunAiKey';
import { FloatingFunctionKey428 } from '@/components/FloatingFunctionKey428';
import { OmniGenesisProvider } from '@/context/OmniGenesisContext';
// ErrorBoundary does not exist in components, but MasterLayout might handle errors, so we'll remove it or comment it out for now.

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ESG GO 善向永續報告中心',
  description: '全域多部門共做 ESG 報告區與 JunAiKey 萬能精靈。提供 5T 協議驅動的數據溯源、碳盤查、以及 Berkeley 認證學院學習路徑。',
  keywords: ['ESG', '永續發展', '碳盤查', '5T Protocol', 'AI 導師', 'GRI', 'SASB', 'Berkeley Academy'],
  openGraph: {
    title: 'ESG GO 善向永續報告中心',
    description: '服務即教學，知識即資產。引導企業與個人走向超越級永續未來。',
    url: 'https://esgss.io',
    siteName: 'ESG GO 善向永續報告中心',
    locale: 'zh_TW',
    type: 'website',
  },
  manifest: '/manifest.json',
  themeColor: '#63a6b0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text-main)] relative selection:bg-omni-primary/20 selection:text-omni-primary`}>
        <ThemeProvider>
          <LanguageProvider>
            <NextAuthProvider>
              <OmniGenesisProvider>
                <TooltipProvider delayDuration={300}>
                  <MasterLayout>
                    {children}
                  </MasterLayout>
                  <FloatingFunctionKey428 />
                  <JunAiKey />
                </TooltipProvider>
              </OmniGenesisProvider>
            </NextAuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
