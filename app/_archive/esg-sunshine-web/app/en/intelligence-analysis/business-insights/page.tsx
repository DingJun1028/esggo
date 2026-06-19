'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import { Globe, Radar, TrendingUp, BarChart3, CheckCircle2, Lightbulb, Target } from 'lucide-react'

export default function BusinessInsightsPage() {
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
                  <span className="text-2xl">{t.businessInsights.icon}</span>
                  <span className="text-sm font-semibold text-primary">{t.businessInsights.englishTitle}</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                  🌏 Global Intelligence & Strategic Positioning
                </h1>
                <p className="text-2xl text-neutral-700 mb-8 font-semibold">
                  {t.businessInsights.subtitle}
                </p>
              </div>
            </div>
          </section>

          {/* Intro Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8 mb-8">
                  {t.businessInsights.intro.lines.map((line, index) => (
                    <p key={index} className="text-xl text-neutral-800 font-bold mb-2">{line}</p>
                  ))}
                </div>
                <p className="text-lg text-neutral-700 mb-6 leading-relaxed">{t.businessInsights.intro.description}</p>
                <p className="text-lg text-neutral-800 font-semibold leading-relaxed">{t.businessInsights.intro.mission}</p>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {t.businessInsights.services.title}
                </h2>
              </div>
              <div className="space-y-12">
                {t.businessInsights.services.items.map((service, index) => {
                  const icons = [Globe, Radar, TrendingUp]
                  const Icon = icons[index]
                  const gradients = [
                    'from-blue-500 to-blue-600',
                    'from-purple-500 to-purple-600',
                    'from-green-500 to-green-600',
                  ]
                  const bgColors = [
                    'from-blue-50 to-indigo-50',
                    'from-purple-50 to-pink-50',
                    'from-green-50 to-emerald-50',
                  ]
                  return (
                    <div key={index} className={`bg-gradient-to-br ${bgColors[index]} rounded-2xl shadow-lg p-8 md:p-12`}>
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${gradients[index]} rounded-full flex items-center justify-center text-white text-xl font-bold`}>
                          {service.number}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <Icon className="w-8 h-8 text-primary" />
                            <h3 className="text-2xl md:text-3xl font-bold text-neutral-900">
                              {service.title}
                            </h3>
                          </div>
                          <p className="text-lg text-neutral-700 mb-6">{service.description}</p>
                          <div className="grid md:grid-cols-2 gap-4 mb-6">
                            {service.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-start gap-3 bg-white/80 rounded-lg p-4">
                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                                <span className="text-neutral-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                          {service.summary && (
                            <div className="bg-white/90 rounded-xl p-6">
                              <p className="text-neutral-800 leading-relaxed font-medium">{service.summary}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Target Audience Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {t.businessInsights.targetAudience.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {t.businessInsights.targetAudience.groups.map((group, index) => (
                  <div key={index} className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-4">
                    <Target className="w-6 h-6 text-primary flex-shrink-0" />
                    <p className="text-neutral-800 font-semibold">{group}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Needed Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <Lightbulb className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                {t.businessInsights.whyNeeded.title}
              </h2>
              <p className="text-xl text-neutral-700 mb-2">{t.businessInsights.whyNeeded.intro}</p>
              <p className="text-2xl text-neutral-900 font-bold mb-6">{t.businessInsights.whyNeeded.mainPoint}</p>
              <p className="text-xl text-neutral-700 mb-2">{t.businessInsights.whyNeeded.strength}</p>
              <p className="text-xl text-neutral-800 font-semibold mb-8">{t.businessInsights.whyNeeded.conclusion}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#contact" className="btn-primary text-base px-8 py-3 shadow-glow">
                  Apply for Service
                </a>
                <a href="#contact" className="btn-outline text-base px-8 py-3">
                  Learn More
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
