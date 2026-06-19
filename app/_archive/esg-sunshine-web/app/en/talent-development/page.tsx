'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import { GraduationCap, BookOpen, Award, Users, Globe2, Lightbulb } from 'lucide-react'

export default function TalentDevelopmentPage() {
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
                  <span className="text-sm font-semibold text-primary">Professional Talent Development</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                  {t.talentDevelopment.title}
                </h1>
                <p className="text-xl text-neutral-600 mb-8">
                  {t.talentDevelopment.subtitle}
                </p>
                <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                  {t.talentDevelopment.description}
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <BookOpen className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">International Certification Courses</h3>
                  <p className="text-neutral-600">
                    Berkeley Haas and other top institutions' certifications, providing world-class sustainability professional training
                  </p>
                </div>
                <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <Award className="w-12 h-12 text-secondary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">Professional Certification Coaching</h3>
                  <p className="text-neutral-600">
                    Complete certification exam coaching to help students obtain professional qualifications
                  </p>
                </div>
                <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <Users className="w-12 h-12 text-accent mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">Practical Workshops</h3>
                  <p className="text-neutral-600">
                    Combining theory with practice, strengthening practical skills through case studies
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <Globe2 className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">International Faculty Team</h3>
                  <p className="text-neutral-600">
                    Top business school professors and industry experts teaching together
                  </p>
                </div>
                <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <Lightbulb className="w-12 h-12 text-secondary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">Innovative Learning Model</h3>
                  <p className="text-neutral-600">
                    Blended online and offline teaching with flexible learning arrangements
                  </p>
                </div>
                <div className="bg-gradient-to-br from-accent/5 to-secondary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <GraduationCap className="w-12 h-12 text-accent mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">Lifelong Learning Support</h3>
                  <p className="text-neutral-600">
                    Continuously providing latest sustainability knowledge and industry updates
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Start Your Sustainability Talent Development Journey
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                Enroll in our courses now and become an internationally competitive sustainability professional
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#courses" className="btn-primary text-base px-8 py-3 shadow-glow">
                  View Courses
                </a>
                <a href="#contact" className="btn-outline text-base px-8 py-3">
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
