import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/context/app-context";
import { FirebaseProvider } from "@/components/layout/firebase-provider";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { Toaster } from "sonner";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: {
    default: "ESG GO | InfoOne 永續治理平台",
    template: "%s | ESG GO"
  },
  description: "領先的企業永續數據管理平台。讓永續數據，像金融交易一樣透明可信。結合 GenAI 技術提供深入的 ESG 合規洞察。",
  keywords: ["ESG", "永續發展", "CSR", "SASB", "GRI", "GenAI", "ESG GO", "InfoOne"],
  authors: [{ name: "InfoOne Team" }],
  creator: "InfoOne",
  publisher: "InfoOne",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "ESG GO | InfoOne 永續治理平台",
    description: "領先的企業永續數據管理平台。讓永續數據，像金融交易一樣透明可信。",
    url: "https://esggo.info",
    siteName: "ESG GO",
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ESG GO | InfoOne 永續治理平台",
    description: "讓永續數據，像金融交易一樣透明可信。",
    creator: "@infoone",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#009E9D",
};

import { GlobalErrorBoundary } from "@/components/error-boundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-slate-900 bg-mesh" suppressHydrationWarning>
        <GlobalErrorBoundary>
          <ReactQueryProvider>
            <FirebaseProvider>
              <AppProvider>
                {children}
                <Toaster richColors position="top-right" closeButton />
              </AppProvider>
            </FirebaseProvider>
          </ReactQueryProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
