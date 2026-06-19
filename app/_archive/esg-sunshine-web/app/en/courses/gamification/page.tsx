'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import { Trophy, Target, Award, Star, Users, TrendingUp, CheckCircle2, Sparkles, Gamepad2, Zap } from 'lucide-react'

export default function GamificationPage() {
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
                  <span className="text-2xl">{t.gamification.icon}</span>
                  <span className="text-sm font-semibold text-primary">{t.gamification.englishTitle}</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                  🏆 Gamified Learning Missions
                </h1>
                <p className="text-2xl text-neutral-700 mb-8 font-semibold">
                  {t.gamification.subtitle}
                </p>
                <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                  {t.gamification.description}
                </p>
              </div>
            </div>
          </section>

          {/* Core Mechanics Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {t.gamification.coreMechanics.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {t.gamification.coreMechanics.items.map((mechanic, index) => {
                  const icons = [Target, Star, Award, Trophy, Users]
                  const Icon = icons[index]
                  const gradients = [
                    'from-blue-500 to-blue-600',
                    'from-yellow-500 to-yellow-600',
                    'from-purple-500 to-purple-600',
                    'from-green-500 to-green-600',
                    'from-pink-500 to-pink-600',
                  ]
                  return (
                    <div key={index} className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                      <div className={`w-16 h-16 bg-gradient-to-br ${gradients[index]} rounded-2xl flex items-center justify-center mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-neutral-900 mb-3">{mechanic.title}</h3>
                      <p className="text-neutral-600">{mechanic.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Target Audience Section */}
          <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {t.gamification.targetAudience.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {t.gamification.targetAudience.groups.map((group, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    <p className="text-neutral-800 font-semibold">{group}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Value Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {t.gamification.values.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {t.gamification.values.items.map((value, index) => {
                  const icons = [Zap, TrendingUp, Users, Sparkles]
                  const Icon = icons[index]
                  return (
                    <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 text-center">
                      <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                      <p className="text-neutral-800 font-semibold leading-relaxed">{value}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <Gamepad2 className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Start Your Gamified Learning Journey
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                Making sustainability learning fun, motivating, and sustainable
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#contact" className="btn-primary text-base px-8 py-3 shadow-glow">
                  Join Missions Now
                </a>
                <a href="#contact" className="btn-outline text-base px-8 py-3">
                  Enterprise Solutions
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
