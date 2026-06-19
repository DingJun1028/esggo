'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import { TrendingUp, Globe2, Search, Target, Lightbulb, BarChart3 } from 'lucide-react'

export default function IntelligenceAnalysisPage() {
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
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">國際商情分析</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                  {t.intelligenceAnalysis.title}
                </h1>
                <p className="text-xl text-neutral-600 mb-8">
                  {t.intelligenceAnalysis.subtitle}
                </p>
                <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                  {t.intelligenceAnalysis.description}
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <Globe2 className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">全球趨勢追蹤</h3>
                  <p className="text-neutral-600">
                    即時掌握國際永續發展趨勢與政策變化
                  </p>
                </div>
                <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <Search className="w-12 h-12 text-secondary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">產業深度分析</h3>
                  <p className="text-neutral-600">
                    提供各產業永續轉型的深度洞察與案例研究
                  </p>
                </div>
                <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <Target className="w-12 h-12 text-accent mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">機會識別</h3>
                  <p className="text-neutral-600">
                    協助企業發掘永續轉型中的商機與創新契機
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <Lightbulb className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">創新策略建議</h3>
                  <p className="text-neutral-600">
                    基於國際經驗，提供在地化的創新策略方案
                  </p>
                </div>
                <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <BarChart3 className="w-12 h-12 text-secondary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">競爭態勢分析</h3>
                  <p className="text-neutral-600">
                    分析同業永續表現，掌握競爭優勢定位
                  </p>
                </div>
                <div className="bg-gradient-to-br from-accent/5 to-secondary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <TrendingUp className="w-12 h-12 text-accent mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">風險預警系統</h3>
                  <p className="text-neutral-600">
                    提前預警永續風險，協助企業及早因應
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                掌握全球永續趨勢
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                訂閱我們的商情分析服務，領先競爭對手一步
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#contact" className="btn-primary text-base px-8 py-3 shadow-glow">
                  訂閱服務
                </a>
                <a href="#contact" className="btn-outline text-base px-8 py-3">
                  索取報告範本
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
