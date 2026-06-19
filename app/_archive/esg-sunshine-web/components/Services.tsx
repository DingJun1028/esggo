'use client'

import {
  Globe2,
  BookOpen,
  Lightbulb,
  BarChart3,
  Leaf,
  Users,
  Target,
  Shield,
  ArrowRight
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Services() {
  const { t, locale } = useLanguage()

  const services = t.services.items.map((item, index) => ({
    ...item,
    icon: [Target, BookOpen, Leaf, BarChart3, Lightbulb, Users][index],
    color: ['from-blue to-blue-dark', 'from-emerald to-emerald-dark', 'from-purple to-purple-dark', 'from-secondary to-secondary-dark', 'from-pink to-pink-dark', 'from-indigo to-indigo-dark'][index],
    bgColor: ['bg-blue/5', 'bg-emerald/5', 'bg-purple/5', 'bg-secondary/5', 'bg-pink/5', 'bg-indigo/5'][index],
    borderColor: ['border-blue/20', 'border-emerald/20', 'border-purple/20', 'border-secondary/20', 'border-pink/20', 'border-indigo/20'][index]
  }))

  const highlights = t.services.highlights.map((item, index) => ({
    ...item,
    icon: [Globe2, Shield, Target, Users][index]
  }))

  return (
    <section id="services" className="section-spacing bg-surface">
      <div className="container-base section-padding">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Globe2 className="w-4 h-4" />
            <span>{t.services.badge}</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-display font-bold text-neutral-900 mb-6">
            {t.services.title.prefix} <span className="text-gradient">{t.services.title.highlight}</span>
          </h2>

          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {highlights.map((highlight, index) => (
            <div key={index} className="card p-6 text-center group hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300">
                <highlight.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">{highlight.title}</h3>
              <p className="text-sm text-neutral-600">{highlight.description}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className={`card-interactive border-2 ${service.borderColor} p-8 group`}>
              <div className="flex items-start space-x-4 mb-6">
                <div className={`icon-wrapper bg-gradient-to-br ${service.color} text-white group-hover:scale-110`}>
                  <service.icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-neutral-900 mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 ${service.bgColor} rounded-full`}></div>
                    <span className="text-sm text-neutral-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full btn-outline btn-small group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                <span>{t.services.learnMore}</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="card p-12 bg-gradient-to-br from-primary/5 via-surface to-secondary/5 border-2 border-primary/10">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-3xl font-display font-bold text-neutral-900 mb-4">
                {t.services.cta.title}
              </h3>
              <p className="text-lg text-neutral-600 mb-8">
                {t.services.cta.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={locale === 'en' ? '/en/contact' : '/contact'} className="btn-primary btn-large">
                  <Users className="w-5 h-5 mr-2" />
                  {t.services.cta.buttons.consult}
                </a>
                <a href="https://corporateinnovation.berkeley.edu/students/business-model-practicum-2026/" target="_blank" rel="noopener noreferrer" className="btn-outline btn-large">
                  <BookOpen className="w-5 h-5 mr-2" />
                  {t.services.cta.buttons.browse}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}