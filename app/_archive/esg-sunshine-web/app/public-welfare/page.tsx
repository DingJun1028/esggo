'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import { Heart, Users, UserPlus, Sprout, Globe2, Award } from 'lucide-react'

export default function PublicWelfarePage() {
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
                  <Heart className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">公益共創</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                  {t.publicWelfare.title}
                </h1>
                <p className="text-xl text-neutral-600 mb-8">
                  {t.publicWelfare.subtitle}
                </p>
                <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                  {t.publicWelfare.description}
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <Users className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">社區共融</h3>
                  <p className="text-neutral-600">
                    推動社區永續發展，創造共享價值
                  </p>
                </div>
                <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <UserPlus className="w-12 h-12 text-secondary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">跨界合作</h3>
                  <p className="text-neutral-600">
                    串聯企業、政府、NPO等各界資源
                  </p>
                </div>
                <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <Sprout className="w-12 h-12 text-accent mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">生態保育</h3>
                  <p className="text-neutral-600">
                    支持生物多樣性保護與環境永續行動
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <Globe2 className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">國際交流</h3>
                  <p className="text-neutral-600">
                    促進永續議題的國際經驗交流與學習
                  </p>
                </div>
                <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <Award className="w-12 h-12 text-secondary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">社會創新</h3>
                  <p className="text-neutral-600">
                    孵化永續創新項目，推動社會正向改變
                  </p>
                </div>
                <div className="bg-gradient-to-br from-accent/5 to-secondary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <Heart className="w-12 h-12 text-accent mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">公益教育</h3>
                  <p className="text-neutral-600">
                    提供弱勢族群永續教育與培力機會
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                一起創造永續共好
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                加入我們的公益生態圈，共同推動社會正向改變
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#contact" className="btn-primary text-base px-8 py-3 shadow-glow">
                  成為夥伴
                </a>
                <a href="#contact" className="btn-outline text-base px-8 py-3">
                  了解活動
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
