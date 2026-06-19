'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import { FileText, CheckCircle2, Sparkles, BookOpen, Target } from 'lucide-react'

export default function SustainabilityReportingPage() {
  const { t } = useLanguage()

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface">
        <Header />
        <main className="pt-32 pb-20">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-6">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">{t.sustainabilityReporting.englishTitle}</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                  {t.sustainabilityReporting.icon} {t.sustainabilityReporting.subtitle}
                </h1>
              </div>
            </div>
          </section>

          {/* Introduction Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <p className="text-lg text-neutral-700 mb-4 leading-relaxed">
                  {t.sustainabilityReporting.intro.description}
                </p>
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 my-8">
                  <p className="text-xl text-neutral-900 font-bold">
                    {t.sustainabilityReporting.intro.mission}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {t.sustainabilityReporting.services.title}
                </h2>
              </div>
              <div className="space-y-12">
                {t.sustainabilityReporting.services.items.map((service, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {service.number}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                          {service.title}
                        </h3>
                        <p className="text-lg text-neutral-700 mb-6">
                          {service.description}
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          {service.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                              <span className="text-neutral-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl p-6">
                          <p className="text-neutral-800 leading-relaxed">
                            {service.summary}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Closing Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                {t.sustainabilityReporting.closing.title}
              </h2>
              <p className="text-xl text-neutral-700 italic">
                {t.sustainabilityReporting.closing.message}
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                開始您的永續報告之旅
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                讓我們協助您打造能被看見、相信、採用的永續敘事
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#contact" className="btn-primary text-base px-8 py-3 shadow-glow">
                  立即諮詢
                </a>
                <a href="#contact" className="btn-outline text-base px-8 py-3">
                  了解更多
                </a>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <ScrollToTop />
        <NewsletterBanner />
      </div>
    </PageTransition>
  )
}
