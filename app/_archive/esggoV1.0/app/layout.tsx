import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Newsreader } from "next/font/google";
import Script from "next/script";
import "./globals.css"; // Global styles

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["italic", "normal"],
  variable: "--font-newsreader"
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fdf9f0",
};

export const metadata: Metadata = {
  title: "Omni_Terminal v4.5 | Google Stitch UIUX",
  description: "Enterprise-grade ESG Terminal featuring Google Stitch UIUX aesthetics. Intelligence Hub mode active.",
  keywords: ["Omni_Terminal", "ESG", "Sustainability", "Reporting", "2026", "ZKP", "Zero-Knowledge", "5T Protocol", "Enterprise Integrity", "GRI", "SASB"],
  authors: [{ name: "Omni ESG Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ESG GO",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Omni_Terminal v4.3 | Enterprise Integrity",
    description: "The next generation of enterprise-grade ESG reporting for the 2026 enterprise landscape.",
    url: "https://esggo.infoone.com",
    siteName: "Omni_Terminal",
    images: [
      {
        url: "https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6",
        width: 1200,
        height: 630,
        alt: "Omni_Terminal Platform Preview",
      },
    ],
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Omni_Terminal v4.3 | Enterprise Integrity",
    description: "Advanced Enterprise ESG Architecture - 2026 Hardened.",
    images: ["https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6"],
  },
};

import ErrorBoundary from "@/components/ui/error-boundary";
import { AuthProvider } from "@/components/context/auth-context";
import { QueryProvider } from "@/components/context/query-provider";
import { MemoryAwakener } from "@/components/ai/memory-awakener";
import { Toaster } from "sonner";

// Disable static generation across the entire app so backend modules aren't executed in CI/CD build environments
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-TW"
      className={`${inter.variable} ${spaceGrotesk.variable} ${newsreader.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Google reCAPTCHA Enterprise */}
        <Script
          src="https://www.google.com/recaptcha/enterprise.js?render=6Ldek6osAAAAAOrXT4VChbhORIC_5zUjCaEyHBrt"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className="font-sans antialiased text-on-surface bg-surface relative overflow-x-hidden"
        suppressHydrationWarning
      >
        <div className="relative z-10">
          <ErrorBoundary>
            <QueryProvider>
              <AuthProvider>
                <MemoryAwakener />
                {children}
              </AuthProvider>
              {/* 加入 Sonner Toaster 以啟用全域通知，並開啟 richColors 增加質感 */}
              <Toaster position="top-center" richColors theme="light" />
            </QueryProvider>
          </ErrorBoundary>
        </div>
      </body>
    </html>
  );
}
