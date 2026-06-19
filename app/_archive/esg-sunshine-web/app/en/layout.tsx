import { Metadata, Viewport } from 'next'
import { LanguageProvider } from '@/contexts/LanguageContext'
import '../globals.css'

export const metadata: Metadata = {
  title: 'ESG Sunshine | International Sustainability Talent Development Program',
  description: 'Combining Berkeley international perspective with Taiwan practical experience, cultivating sustainability transformation leaders. Offering dual certification courses, ESG consulting and sustainability solutions.',
  keywords: 'ESG, Sustainability, Berkeley, International Certification, Sustainable Transformation, Corporate Social Responsibility',
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

export default function EnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider locale="en">
      {children}
    </LanguageProvider>
  )
}
