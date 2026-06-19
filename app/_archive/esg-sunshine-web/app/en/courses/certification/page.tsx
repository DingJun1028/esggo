'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import { GraduationCap, Award, Users, BookOpen, Target, CheckCircle2, Lightbulb, Star } from 'lucide-react'

export default function CertificationCoursePage() {
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
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">{t.certificationCourse.englishTitle}</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                  {t.certificationCourse.title}
                </h1>
                <p className="text-2xl text-neutral-700 mb-8 font-semibold">
                  {t.certificationCourse.subtitle}
                </p>
              </div>
            </div>
          </section>

          {/* Introduction Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <p className="text-lg text-neutral-700 mb-4 leading-relaxed">
                  {t.certificationCourse.intro.description}
                </p>
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 my-8">
                  <p className="text-xl text-neutral-900 font-bold text-center">
                    {t.certificationCourse.intro.belief}
                  </p>
                </div>
                <p className="text-lg text-neutral-700 leading-relaxed">
                  {t.certificationCourse.intro.purpose}
                </p>
              </div>
            </div>
          </section>

          {/* Programs Section */}
          <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="space-y-12">
                {t.certificationCourse.programs.map((program, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {program.number}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                          {program.title}
                        </h2>
                        <p className="text-lg text-neutral-700 mb-6">
                          {program.target}
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          {program.focuses.map((focus, focusIndex) => (
                            <div key={focusIndex} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                              <span className="text-neutral-700">{focus}</span>
                            </div>
                          ))}
                        </div>
                        <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl p-6">
                          <p className="text-neutral-800 leading-relaxed">
                            {program.note}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why ESG Sunshine Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                  {t.certificationCourse.whyEsgSunshine.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {t.certificationCourse.whyEsgSunshine.features.map((feature, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <Star className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                      <p className="text-neutral-700 leading-relaxed">{feature}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <Lightbulb className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Start Your Sustainability Certification Journey
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                Become a Next-Generation Sustainability Talent and Civilization Advocate
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#contact" className="btn-primary text-base px-8 py-3 shadow-glow">
                  Enroll Now
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
