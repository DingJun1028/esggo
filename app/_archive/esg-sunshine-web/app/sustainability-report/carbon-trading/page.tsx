'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import { Wind, CheckCircle2, Leaf, Target, TrendingDown } from 'lucide-react'

export default function CarbonTradingPage() {
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
                  <Wind className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">{t.carbonTrading.englishTitle}</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                  {t.carbonTrading.icon} {t.carbonTrading.englishTitle}
                </h1>
                <p className="text-2xl text-neutral-700 font-semibold">
                  {t.carbonTrading.subtitle}
                </p>
              </div>
            </div>
          </section>

          {/* Introduction Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6">
                  <p className="text-xl text-neutral-900 font-bold">
                    {t.carbonTrading.intro.description}
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
                  {t.carbonTrading.services.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {t.carbonTrading.services.items.map((service, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {service.number}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                          {service.title}
                        </h3>
                        {service.description && (
                          <p className="text-lg text-neutral-700 mb-4">
                            {service.description}
                          </p>
                        )}
                        <div className="space-y-3">
                          {service.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                              <span className="text-neutral-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Target Audience Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {t.carbonTrading.targetAudience.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {t.carbonTrading.targetAudience.groups.map((group, index) => (
                  <div key={index} className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <p className="text-neutral-700 leading-relaxed">{group}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Closing Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <Leaf className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
                {t.carbonTrading.closing.title}
              </h2>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <TrendingDown className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                開啟您的淨零路徑
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                從碳盤查到碳交易，我們提供完整的碳資產管理服務
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
