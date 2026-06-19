'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import { Lightbulb, Target, Eye, CheckCircle2 } from 'lucide-react'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface">
        <Header />
        <main className="pt-32 pb-20">
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"></div>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
              <div className="text-center max-w-4xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-6">
                  <span className="text-sm font-semibold text-primary">{t.aboutPage.positioning.title}</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                  {t.aboutPage.positioning.subtitle}
                </h1>
                <div className="space-y-4 text-lg text-neutral-600">
                  {t.aboutPage.intro.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Beliefs Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              {/* Vision Mission Image */}
              <div className="text-center mb-12">
                <img
                  src="https://cdn.imgchest.com/files/9f12e6291dec.jpg"
                  alt="Vision and Mission"
                  className="max-w-4xl mx-auto rounded-2xl shadow-lg"
                />
              </div>

              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                  {t.aboutPage.beliefs.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {t.aboutPage.beliefs.items.map((belief, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300"
                  >
                    <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                    <p className="text-lg text-neutral-700 leading-relaxed">{belief}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="py-20 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-6">
                    <Target className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold text-primary">{t.aboutPage.mission.title}</span>
                  </div>
                  <p className="text-lg text-neutral-700 leading-relaxed">
                    {t.aboutPage.mission.content}
                  </p>
                </div>
                <div className="relative">
                  <img
                    src="https://cdn.imgchest.com/files/d4d45858412c.png"
                    alt="Mission"
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Vision Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative order-2 lg:order-1">
                  <img
                    src="https://cdn.imgchest.com/files/36168fce5d34.png"
                    alt="Vision"
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
                <div className="order-1 lg:order-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full mb-6">
                    <Eye className="w-5 h-5 text-secondary" />
                    <span className="text-sm font-semibold text-secondary">{t.aboutPage.vision.title}</span>
                  </div>
                  <p className="text-2xl font-bold text-neutral-900 mb-4">
                    {t.aboutPage.vision.intro}
                  </p>
                  <p className="text-lg text-neutral-700 leading-relaxed mb-8">
                    {t.aboutPage.vision.description}
                  </p>

                  <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-neutral-900 mb-4">
                      {t.aboutPage.vision.goals.title}
                    </h3>
                    <ul className="space-y-3">
                      {t.aboutPage.vision.goals.items.map((goal, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                          <span className="text-neutral-700">{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 text-lg text-neutral-700 italic">
                    {t.aboutPage.vision.closing.paragraphs.map((paragraph, index) => (
                      <p key={index} className={index === t.aboutPage.vision.closing.paragraphs.length - 1 ? 'font-bold text-primary' : ''}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <Lightbulb className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Build a Sustainable Civilization with Us
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                Join ESG Sunshine's sustainability transformation journey and become a torchbearer of civilization
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://corporateinnovation.berkeley.edu/students/business-model-practicum-2026/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-base px-8 py-3"
                >
                  Learn About Our Services
                </a>
                <a
                  href="/en/contact"
                  className="btn-primary text-base px-8 py-3 shadow-glow"
                >
                  Contact Us
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
