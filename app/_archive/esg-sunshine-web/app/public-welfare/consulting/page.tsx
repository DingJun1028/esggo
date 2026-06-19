'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import { Sun, CheckCircle2, Heart, Users, Sparkles } from 'lucide-react'

export default function PublicWelfareConsultingPage() {
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
                  <Sun className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">{t.publicWelfareConsulting.englishTitle}</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                  {t.publicWelfareConsulting.icon} {t.publicWelfareConsulting.englishTitle}
                </h1>
                <p className="text-2xl text-neutral-700 font-semibold">
                  {t.publicWelfareConsulting.subtitle}
                </p>
              </div>
            </div>
          </section>

          {/* Introduction Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <p className="text-xl text-neutral-700 mb-4 font-bold">
                  {t.publicWelfareConsulting.intro.belief}
                </p>
                {t.publicWelfareConsulting.intro.beliefs.map((belief, index) => (
                  <p key={index} className="text-lg text-neutral-700 mb-2 leading-relaxed">
                    {belief}
                  </p>
                ))}
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 mt-8">
                  <p className="text-lg text-neutral-900">
                    {t.publicWelfareConsulting.intro.mission}
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
                  {t.publicWelfareConsulting.services.title}
                </h2>
                <p className="text-lg text-neutral-700">
                  {t.publicWelfareConsulting.services.description}
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
                {t.publicWelfareConsulting.services.items.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <p className="text-neutral-700 leading-relaxed">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl p-8 max-w-4xl mx-auto">
                <p className="text-lg text-neutral-700 mb-2">
                  {t.publicWelfareConsulting.services.note}
                </p>
                <p className="text-lg text-neutral-900 font-bold">
                  {t.publicWelfareConsulting.services.purpose}
                </p>
              </div>
            </div>
          </section>

          {/* Target Audience Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {t.publicWelfareConsulting.targetAudience.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {t.publicWelfareConsulting.targetAudience.groups.map((group, index) => (
                  <div key={index} className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
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
              <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                {t.publicWelfareConsulting.closing.title}
              </h2>
              <p className="text-lg text-neutral-700 mb-2">
                {t.publicWelfareConsulting.closing.belief}
              </p>
              <p className="text-xl text-neutral-900 font-bold mb-4">
                {t.publicWelfareConsulting.closing.message}
              </p>
              <p className="text-lg text-neutral-700">
                {t.publicWelfareConsulting.closing.commitment}
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                預約免費公益諮詢
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                讓永續知識成為每個人都能接近的光
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#contact" className="btn-primary text-base px-8 py-3 shadow-glow">
                  立即預約
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
