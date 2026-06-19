'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import { BarChart3, Database, TrendingUp, Zap, Shield, Globe2 } from 'lucide-react'

export default function DecisionPlatformPage() {
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
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">Smart Decision Platform</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                  {t.decisionPlatform.title}
                </h1>
                <p className="text-xl text-neutral-600 mb-8">
                  {t.decisionPlatform.subtitle}
                </p>
                <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                  {t.decisionPlatform.description}
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <Database className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">Multi-dimensional Data Integration</h3>
                  <p className="text-neutral-600">
                    Integrate ESG, financial, market and other multi-dimensional data for comprehensive analysis
                  </p>
                </div>
                <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <TrendingUp className="w-12 h-12 text-secondary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">Real-time Data Analysis</h3>
                  <p className="text-neutral-600">
                    Monitor sustainability indicators in real-time and quickly grasp corporate sustainability performance
                  </p>
                </div>
                <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <Zap className="w-12 h-12 text-accent mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">Intelligent Decision Support</h3>
                  <p className="text-neutral-600">
                    AI-driven intelligent analysis providing scientific decision-making recommendations
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <Shield className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">Information Security Assurance</h3>
                  <p className="text-neutral-600">
                    Enterprise-grade security protection ensuring data safety and privacy
                  </p>
                </div>
                <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <Globe2 className="w-12 h-12 text-secondary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">International Standards Alignment</h3>
                  <p className="text-neutral-600">
                    Compliant with international reporting frameworks such as GRI, SASB, TCFD
                  </p>
                </div>
                <div className="bg-gradient-to-br from-accent/5 to-secondary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <BarChart3 className="w-12 h-12 text-accent mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">Visual Dashboard</h3>
                  <p className="text-neutral-600">
                    Intuitive data visualization for quick insights into key information
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Experience the Power of Smart Decision Making
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                Apply for a platform trial now and start your data-driven sustainability transformation journey
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#contact" className="btn-primary text-base px-8 py-3 shadow-glow">
                  Apply for Trial
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
