'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import { Users, Zap, Brain, Lightbulb, Target, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react'

export default function WorkshopPage() {
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
                  <span className="text-2xl">{t.workshop.icon}</span>
                  <span className="text-sm font-semibold text-primary">{t.workshop.englishTitle}</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                  {t.workshop.subtitle}
                </h1>
                <p className="text-2xl text-neutral-700 mb-8 font-semibold">
                  {t.workshop.description}
                </p>
                <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                  {t.workshop.intro}
                </p>
              </div>
            </div>
          </section>

          {/* Core Features Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {t.workshop.coreFeatures.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {t.workshop.coreFeatures.items.map((feature, index) => {
                  const icons = [Users, Zap, Brain, Lightbulb]
                  const Icon = icons[index]
                  return (
                    <div key={index} className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                      <Icon className="w-12 h-12 text-primary mb-4" />
                      <h3 className="text-xl font-bold text-neutral-900 mb-3">{feature.title}</h3>
                      <p className="text-neutral-600">{feature.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Popular Topics Section */}
          <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {t.workshop.popularTopics.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {t.workshop.popularTopics.topics.map((topic, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex items-start gap-4">
                    <Target className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                    <p className="text-neutral-700 font-medium">{topic}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Organization Value Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {t.workshop.organizationValue.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {t.workshop.organizationValue.values.map((value, index) => (
                  <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 text-center">
                    <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                    <p className="text-neutral-800 font-semibold text-lg">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Join Our Workshops Today
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                Transform sustainability learning into action and create change with us
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#contact" className="btn-primary text-base px-8 py-3 shadow-glow">
                  Book a Workshop
                </a>
                <a href="#contact" className="btn-outline text-base px-8 py-3">
                  Customized Solutions
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
