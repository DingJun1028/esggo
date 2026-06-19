'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import { Stethoscope, CheckCircle2, ClipboardCheck, FileCheck2, BarChart3, Sparkles, Target } from 'lucide-react'

export default function EsgAssessmentPage() {
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
                  <span className="text-2xl">{t.esgAssessment.icon}</span>
                  <span className="text-sm font-semibold text-primary">{t.esgAssessment.englishTitle}</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                  🩺 Compliance & Value-Creating ESG Assessment
                </h1>
                <p className="text-2xl text-neutral-700 mb-8 font-semibold">
                  {t.esgAssessment.subtitle}
                </p>
              </div>
            </div>
          </section>

          {/* Intro Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8 mb-6">
                  <p className="text-xl text-neutral-800 font-bold mb-4">{t.esgAssessment.intro.description}</p>
                  <p className="text-lg text-neutral-700">{t.esgAssessment.intro.importance}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {t.esgAssessment.services.title}
                </h2>
              </div>
              <div className="space-y-12">
                {t.esgAssessment.services.items.map((service, index) => {
                  const icons = [ClipboardCheck, FileCheck2, BarChart3]
                  const Icon = icons[index]
                  const gradients = [
                    'from-blue-500 to-blue-600',
                    'from-green-500 to-green-600',
                    'from-purple-500 to-purple-600',
                  ]
                  const bgColors = [
                    'from-blue-50 to-indigo-50',
                    'from-green-50 to-emerald-50',
                    'from-purple-50 to-pink-50',
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

                          {service.frameworks && (
                            <div className="mb-6">
                              <div className="grid md:grid-cols-2 gap-4">
                                {service.frameworks.map((framework, fIndex) => (
                                  <div key={fIndex} className="flex items-start gap-3 bg-white/80 rounded-lg p-4">
                                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                                    <span className="text-neutral-700">{framework}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {service.focus && (
                            <div className="mb-4">
                              <p className="text-lg text-neutral-800 font-semibold mb-3">{service.focus}</p>
                            </div>
                          )}

                          {service.checkpoints && (
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                              {service.checkpoints.map((checkpoint, cIndex) => (
                                <div key={cIndex} className="flex items-start gap-3 bg-white/80 rounded-lg p-4">
                                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                                  <span className="text-neutral-700">{checkpoint}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {service.aiAnalysis && (
                            <div className="mb-4">
                              <p className="text-lg text-neutral-800 font-semibold mb-3">{service.aiAnalysis}</p>
                            </div>
                          )}

                          {service.dimensions && (
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                              {service.dimensions.map((dimension, dIndex) => (
                                <div key={dIndex} className="flex items-start gap-3 bg-white/80 rounded-lg p-4">
                                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                                  <span className="text-neutral-700">{dimension}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {service.output && (
                            <div className="bg-white/90 rounded-xl p-6 mb-6">
                              <p className="text-neutral-800 leading-relaxed font-medium">{service.output}</p>
                            </div>
                          )}

                          {service.components && (
                            <div className="grid md:grid-cols-2 gap-4">
                              {service.components.map((component, cIndex) => (
                                <div key={cIndex} className="flex items-start gap-3 bg-white/80 rounded-lg p-4">
                                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                                  <span className="text-neutral-700">{component}</span>
                                </div>
                              ))}
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
                  {t.esgAssessment.targetAudience.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {t.esgAssessment.targetAudience.groups.map((group, index) => (
                  <div key={index} className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-4">
                    <Target className="w-6 h-6 text-primary flex-shrink-0" />
                    <p className="text-neutral-800 font-semibold">{group}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Closing Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                {t.esgAssessment.closing.title}
              </h2>
              <p className="text-2xl text-neutral-700 mb-8 font-semibold">{t.esgAssessment.closing.message}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#contact" className="btn-primary text-base px-8 py-3 shadow-glow">
                  Schedule Assessment
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
