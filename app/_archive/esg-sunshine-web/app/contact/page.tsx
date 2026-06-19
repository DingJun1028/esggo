'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import Contact from '@/components/Contact'

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface">
        <Header />
        <main className="pt-20">
          <Contact />
        </main>
        <Footer />
        <ScrollToTop />
        <NewsletterBanner />
      </div>
    </PageTransition>
  )
}
