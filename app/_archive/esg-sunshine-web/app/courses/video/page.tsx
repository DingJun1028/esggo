'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import { Video, Play, BookOpen, Users, Building2, GraduationCap, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react'

export default function VideoCoursePage() {
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
                  <span className="text-2xl">{t.videoCourse.icon}</span>
                  <span className="text-sm font-semibold text-primary">{t.videoCourse.englishTitle}</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                  📺 視頻課程 Video Learning
                </h1>
                <p className="text-2xl text-neutral-700 mb-8 font-semibold">
                  {t.videoCourse.subtitle}
                </p>
                <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                  {t.videoCourse.description}
                </p>
              </div>
            </div>
          </section>

          {/* Content Categories Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {t.videoCourse.categories.title}
                </h2>
              </div>
              <div className="space-y-12">
                {t.videoCourse.categories.items.map((category, index) => {
                  const icons = [Play, Video]
                  const Icon = icons[index]
                  const gradients = ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600']
                  const bgColors = ['from-blue-50 to-indigo-50', 'from-purple-50 to-pink-50']
                  return (
                    <div key={index} className={`bg-gradient-to-br ${bgColors[index]} rounded-2xl shadow-lg p-8 md:p-12`}>
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${gradients[index]} rounded-full flex items-center justify-center text-white text-xl font-bold`}>
                          {category.number}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <Icon className="w-8 h-8 text-primary" />
                            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
                              {category.title}
                            </h2>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            {category.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-start gap-3 bg-white/80 rounded-lg p-4">
                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                                <span className="text-neutral-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Value Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {t.videoCourse.values.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {t.videoCourse.values.items.map((value, index) => {
                  const icons = [Users, Building2, GraduationCap, TrendingUp]
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
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                開始您的視頻學習之旅
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                以科技讓永續知識更普及、更易近、更有力量
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#contact" className="btn-primary text-base px-8 py-3 shadow-glow">
                  探索免費視頻
                </a>
                <a href="#contact" className="btn-outline text-base px-8 py-3">
                  查看付費課程
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
