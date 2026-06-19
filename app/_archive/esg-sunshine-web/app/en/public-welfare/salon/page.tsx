'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import { BookOpen, CheckCircle2, Heart, Sparkles, Users } from 'lucide-react'

export default function SunshineSalonPage() {
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
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">{t.sunshineSalon.englishTitle}</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                  {t.sunshineSalon.icon} Sunshine Salon
                </h1>
                <p className="text-2xl text-neutral-700 font-semibold">
                  {t.sunshineSalon.subtitle}
                </p>
              </div>
            </div>
          </section>

          {/* Introduction Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <p className="text-lg text-neutral-700 mb-4 leading-relaxed">
                  {t.sunshineSalon.intro.description}
                </p>
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 my-8">
                  <p className="text-xl text-neutral-900 font-bold mb-4">
                    {t.sunshineSalon.intro.mission}
                  </p>
                  <p className="text-lg text-neutral-700">
                    {t.sunshineSalon.intro.belief}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Topics Section */}
          <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {t.sunshineSalon.topics.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
                {t.sunshineSalon.topics.items.map((topic, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <BookOpen className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <p className="text-neutral-700 font-semibold">{topic}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl p-8 max-w-4xl mx-auto text-center">
                <p className="text-lg text-neutral-900 italic">
                  {t.sunshineSalon.topics.purpose}
                </p>
              </div>
            </div>
          </section>

          {/* Format Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {t.sunshineSalon.format.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {t.sunshineSalon.format.items.map((item, index) => (
                  <div key={index} className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <p className="text-neutral-700 leading-relaxed">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {t.sunshineSalon.values.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {t.sunshineSalon.values.items.map((value, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <Sparkles className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                      <p className="text-neutral-700 leading-relaxed">{value}</p>
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
              <p className="text-2xl md:text-3xl text-neutral-900 font-bold">
                {t.sunshineSalon.closing.message}
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <Users className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Join Sunshine Salon
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                Read with us and create a sustainable civilization thought community
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#contact" className="btn-primary text-base px-8 py-3 shadow-glow">
                  Join Now
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
