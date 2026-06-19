'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import Link from 'next/link'
import { Stethoscope, Database, Shield, TrendingUp, Zap, FileCheck2 } from 'lucide-react'

export default function EsgSystemPage() {
  const { t } = useLanguage()

  const services = [
    {
      icon: Stethoscope,
      title: 'ESG Assessment',
      description: 'Helping companies quickly understand their sustainability health, from "compliance" to "value creation" in one go',
      href: '/en/health-check-management/health-check',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-indigo-50',
    },
    {
      icon: Database,
      title: 'ESG Information Management System',
      description: 'Record × Detect × Analyze × Recommend × Report—all integrated, fully automated',
      href: '/en/health-check-management/information-system',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-pink-50',
    },
  ]

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
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">ESG Assessment & Management</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                  {t.healthCheckManagement.title}
                </h1>
                <p className="text-xl text-neutral-600 mb-8">
                  {t.healthCheckManagement.subtitle}
                </p>
                <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                  {t.healthCheckManagement.description}
                </p>
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-8">
                {services.map((service, index) => {
                  const Icon = service.icon
                  return (
                    <Link
                      key={index}
                      href={service.href}
                      className="group"
                    >
                      <div className={`bg-gradient-to-br ${service.bgGradient} rounded-2xl p-8 md:p-12 hover:shadow-xl transition-all duration-300 h-full`}>
                        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                          {service.title}
                        </h3>
                        <p className="text-neutral-700 leading-relaxed">
                          {service.description}
                        </p>
                        <div className="mt-6 inline-flex items-center text-primary font-semibold group-hover:gap-3 transition-all duration-300">
                          Learn More
                          <span className="ml-2 group-hover:ml-0 transition-all duration-300">→</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  Core Advantages
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-8 hover:shadow-lg transition-all duration-300">
                  <FileCheck2 className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">Dual-Track Approach</h3>
                  <p className="text-neutral-600">
                    Balancing compliance and value-creation ESG to enhance overall sustainability competitiveness
                  </p>
                </div>
                <div className="bg-white rounded-xl p-8 hover:shadow-lg transition-all duration-300">
                  <Zap className="w-12 h-12 text-secondary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">AI-Powered Intelligence</h3>
                  <p className="text-neutral-600">
                    AI-driven automated analysis and recommendations, significantly improving efficiency and accuracy
                  </p>
                </div>
                <div className="bg-white rounded-xl p-8 hover:shadow-lg transition-all duration-300">
                  <TrendingUp className="w-12 h-12 text-accent mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">Continuous Optimization</h3>
                  <p className="text-neutral-600">
                    Complete cycle from diagnosis to management, supporting the enterprise sustainability transformation journey
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Begin Your Sustainability Assessment Journey
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                Apply for ESG assessment services now and establish a systematic sustainability management mechanism
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#contact" className="btn-primary text-base px-8 py-3 shadow-glow">
                  Schedule Consultation
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
