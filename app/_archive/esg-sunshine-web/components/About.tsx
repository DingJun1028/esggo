'use client'

import {
  Users,
  Award,
  Globe2,
  Target,
  CheckCircle2,
  Star,
  TrendingUp,
  Shield
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function About() {
  const { t } = useLanguage()

  const achievements = [
    {
      number: t.about.achievements.experience.number,
      label: t.about.achievements.experience.label,
      description: t.about.achievements.experience.description,
      icon: TrendingUp,
      color: 'from-blue to-blue-dark'
    },
    {
      number: t.about.achievements.instructors.number,
      label: t.about.achievements.instructors.label,
      description: t.about.achievements.instructors.description,
      icon: Users,
      color: 'from-emerald to-emerald-dark'
    },
    {
      number: t.about.achievements.projects.number,
      label: t.about.achievements.projects.label,
      description: t.about.achievements.projects.description,
      icon: Target,
      color: 'from-purple to-purple-dark'
    },
    {
      number: t.about.achievements.students.number,
      label: t.about.achievements.students.label,
      description: t.about.achievements.students.description,
      icon: Award,
      color: 'from-secondary to-secondary-dark'
    }
  ]

  const values = t.about.values.items.map((item, index) => ({
    ...item,
    icon: [Award, Target, Shield, Globe2][index],
    gradient: ['from-blue to-blue-dark', 'from-emerald to-emerald-dark', 'from-purple to-purple-dark', 'from-secondary to-secondary-dark'][index]
  }))

  return (
    <section id="about" className="section-spacing bg-white">
      <div className="container-base section-padding">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Users className="w-4 h-4" />
            <span>{t.about.badge}</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-display font-bold text-neutral-900 mb-6">
            {t.about.title.prefix} <span className="text-gradient">{t.about.title.highlight}</span>
          </h2>

          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            {t.about.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-center mb-20">
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-6">
              <h3 className="text-3xl font-display font-bold text-neutral-900">
                {t.about.mission.title}
              </h3>
              <div className="space-y-4 text-lg text-neutral-600 leading-relaxed">
                {t.about.mission.paragraphs.map((paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              {achievements.map((item, index) => (
                <div key={index} className="card p-4 sm:p-6 group hover:scale-105">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-medium transition-all duration-300 group-hover:scale-110 bg-gradient-to-br ${item.color} text-white flex-shrink-0`}>
                      <item.icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-2xl sm:text-3xl font-bold font-display text-neutral-900 mb-1">
                        {item.number}
                      </div>
                      <div className="font-semibold text-sm sm:text-base text-neutral-800 mb-1">
                        {item.label}
                      </div>
                      <div className="text-xs sm:text-sm text-neutral-600 break-words">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-strong">
                <img
                  src="https://cdn.imgchest.com/files/fbf8a4f1e64e.jpg"
                  alt="Berkeley Certificate"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-strong border border-neutral-100 animate-float">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900">{t.about.certificate.title}</div>
                    <div className="text-sm text-neutral-600">{t.about.certificate.subtitle}</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl rotate-12 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="space-y-16">
          <div className="text-center">
            <h3 className="text-3xl font-display font-bold text-neutral-900 mb-6">
              {t.about.values.title}
            </h3>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {t.about.values.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card-interactive p-8 text-center group">
                <div className={`w-24 h-24 bg-gradient-to-br ${value.gradient} text-white rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-strong`}>
                  <value.icon className="w-12 h-12" />
                </div>
                <h4 className="font-bold text-xl text-neutral-900 mb-4">
                  {value.title}
                </h4>
                <p className="text-neutral-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}