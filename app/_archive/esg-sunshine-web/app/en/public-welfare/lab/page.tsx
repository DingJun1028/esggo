'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import { Microscope, CheckCircle2, Heart, Lightbulb, Users, Target } from 'lucide-react'

export default function SunshineLabPage() {
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
                  <Microscope className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">{t.sunshineLab.englishTitle}</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                  {t.sunshineLab.icon} Sunshine Lab
                </h1>
                <p className="text-2xl text-neutral-700 font-semibold">
                  {t.sunshineLab.subtitle}
                </p>
              </div>
            </div>
          </section>

          {/* Introduction Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <p className="text-lg text-neutral-700 mb-4 leading-relaxed">
                  {t.sunshineLab.intro.description}
                </p>
                <p className="text-lg text-neutral-700 mb-4 leading-relaxed">
                  {t.sunshineLab.intro.mission}
                </p>
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 my-8">
                  <p className="text-lg text-neutral-700 mb-2">
                    {t.sunshineLab.intro.belief}
                  </p>
                  <p className="text-xl text-neutral-900 font-bold">
                    {t.sunshineLab.intro.statement}
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
                  {t.sunshineLab.services.title}
                </h2>
              </div>
              <div className="space-y-8">
                {t.sunshineLab.services.items.map((service, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {service.number}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                          {service.title}
                        </h3>
                        {service.description && (
                          <p className="text-lg text-neutral-700 mb-6">
                            {service.description}
                          </p>
                        )}
                        <div className="grid md:grid-cols-2 gap-4">
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
                  {t.sunshineLab.targetAudience.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {t.sunshineLab.targetAudience.groups.map((group, index) => (
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
              <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                {t.sunshineLab.closing.title}
              </h2>
              <p className="text-xl text-neutral-700">
                {t.sunshineLab.closing.message}
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <Lightbulb className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Join Sunshine Lab
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                Learning from cases, studying the world's best sustainability exemplars
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
