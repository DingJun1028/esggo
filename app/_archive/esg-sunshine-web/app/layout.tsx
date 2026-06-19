import { Metadata, Viewport } from 'next'
import { LanguageProvider } from '@/contexts/LanguageContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'ESG Sunshine 善向永續 | 建構永續轉型新典範',
  description: '結合國際頂尖商學院與矽谷實業家國際視野與在地實務經驗，提供永續轉型的全方位服務',
  keywords: 'ESG, 永續發展, Berkeley, 國際認證, 永續轉型, 企業社會責任',
  icons: {
    icon: 'https://cdn.imgchest.com/files/ae1d769340b0.png',
    apple: 'https://cdn.imgchest.com/files/ae1d769340b0.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <LanguageProvider locale="zh-TW">
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}