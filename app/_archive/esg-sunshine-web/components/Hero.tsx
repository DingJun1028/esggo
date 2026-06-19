'use client'

import { ArrowRight, Globe2, Award, TrendingUp, Users, Star, Sparkles, Target, Play, Download, Building2 } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const { t, locale } = useLanguage()

  const stats = [
    {
      value: locale === 'en' ? '20+' : '20年+',
      label: t.hero.stats.experience,
      icon: Star,
      color: 'from-blue to-blue-dark',
    },
    {
      value: '50+',
      label: t.hero.stats.instructors,
      icon: Users,
      color: 'from-emerald to-emerald-dark',
    },
    {
      value: '100+',
      label: t.hero.stats.projects,
      icon: Target,
      color: 'from-secondary to-secondary-dark',
    },
    {
      value: '500+',
      label: t.hero.stats.students,
      icon: Award,
      color: 'from-purple to-purple-dark',
    },
  ]

  const quickActions = [
    {
      icon: Download,
      text: t.hero.quickActions.download.text,
      description: t.hero.quickActions.download.description,
      color: 'bg-primary'
    },
    {
      icon: Play,
      text: t.hero.quickActions.watch.text,
      description: t.hero.quickActions.watch.description,
      color: 'bg-red'
    }
  ]

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-surface via-surface-2 to-primary/5 pt-24 pb-16 md:py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

      {/* 動態背景元素 */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 left-20 w-20 h-20 bg-gradient-to-br from-emerald/20 to-primary/20 rounded-full blur-lg animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="container-base section-padding relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-10">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary/10 via-emerald/10 to-secondary/10 backdrop-blur-sm rounded-full px-6 py-3 border border-primary/20 animate-slide-up">
              <Globe2 className="w-6 h-6 text-primary animate-rotate-slow" />
              <span className="font-semibold text-primary text-sm">{t.hero.badge}</span>
            </div>

            <div className="space-y-6 animate-slide-up">
              <h1 className="text-5xl lg:text-7xl font-display font-bold leading-none">
                <span className="block text-neutral-900">{t.hero.title.line1}</span>
                <span className="block text-gradient mt-2">{t.hero.title.line2}</span>
                <span className="block text-neutral-800 mt-2">{t.hero.title.line3}</span>
              </h1>

              <p className="text-xl lg:text-2xl text-neutral-600 max-w-2xl leading-relaxed font-light">
                {t.hero.subtitle.prefix}<span className="font-semibold text-primary">{t.hero.subtitle.international}</span>{t.hero.subtitle.middle}
                <span className="font-semibold text-secondary">{t.hero.subtitle.local}</span>
                {t.hero.subtitle.suffix}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 animate-slide-up">
              {t.hero.features.map((feature, index) => (
                <div
                  key={index}
                  className="inline-flex items-center bg-white rounded-full px-4 py-2 shadow-soft border border-neutral-100 hover:shadow-medium transition-all duration-300 hover:scale-105"
                >
                  <span className="text-sm font-medium text-neutral-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
              <a href="https://esg-form.esgsunshine.com/" target="_blank" rel="noopener noreferrer" className="btn-primary btn-large shadow-glow group">
                <Sparkles className="w-6 h-6 mr-3 group-hover:animate-spin" />
                <span>{t.hero.buttons.start}</span>
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </a>
              <a href="https://corporateinnovation.berkeley.edu/students/business-model-practicum-2026/" target="_blank" rel="noopener noreferrer" className="btn-outline btn-large group">
                <Target className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                <span>{t.hero.buttons.learnMore}</span>
              </a>
            </div>

            {/* 快速行動按鈕 */}
            <div className="flex items-center gap-4 animate-slide-up">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="flex items-center space-x-2 px-4 py-2 bg-white rounded-2xl shadow-soft border border-neutral-100 hover:shadow-medium transition-all duration-300 hover:scale-105 group"
                  onClick={() => index === 1 && setIsVideoOpen(true)}
                >
                  <div className={`w-8 h-8 ${action.color} rounded-xl flex items-center justify-center`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-neutral-800">{action.text}</div>
                    <div className="text-xs text-neutral-500">{action.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative animate-fade-in">
              <div className="relative mx-auto w-full max-w-sm h-[350px] sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-emerald animate-rotate-slow opacity-20"></div>
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/30 via-emerald/20 to-secondary/30 animate-pulse-soft"></div>
                <div className="absolute inset-8 rounded-full bg-white shadow-glow border-4 border-white/50 flex items-center justify-center">
                  <div className="text-center p-8">
                    <img
                      src="https://cdn.imgchest.com/files/ae1d769340b0.png"
                      alt="ESG Sunshine logo"
                      className="w-full h-auto object-contain max-w-[200px] mx-auto"
                    />
                  </div>
                </div>

                {stats.map((stat, index) => {
                  const positions = [
                    'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
                    'top-[25%] -right-4 translate-x-1/2 -translate-y-1/2',
                    'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
                    'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2',
                  ]

                  const IconComponent = stat.icon

                  return (
                    <div
                      key={index}
                      className={`absolute ${positions[index]} animate-float`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-strong border border-neutral-100 min-w-[120px] sm:min-w-[140px] hover:scale-110 transition-all duration-300 group cursor-pointer">
                        <div className="text-center space-y-2">
                          <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-medium`}>
                            <IconComponent className="w-6 h-6 text-white" strokeWidth={2.5} />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-neutral-800 font-display">{stat.value}</div>
                            <div className="text-xs font-semibold text-neutral-600">{stat.label}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 視頻彈窗 */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              ×
            </button>
            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-20 h-20 mx-auto mb-4 opacity-75" />
                <p className="text-lg">{t.hero.videoModal.comingSoon}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}