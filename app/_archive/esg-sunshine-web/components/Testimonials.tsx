'use client'

import { Star, Quote, Users, Building, Award } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Testimonials() {
  const { t, locale } = useLanguage()

  const avatars = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80',
    'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80',
  ]

  const testimonials = t.testimonials.testimonialsList.map((item, index) => ({
    ...item,
    rating: 5,
    avatar: avatars[index % avatars.length]
  }))

  const stats = [
    {
      icon: Award,
      value: t.testimonials.stats.experience.value,
      label: t.testimonials.stats.experience.label,
      description: t.testimonials.stats.experience.description
    },
    {
      icon: Users,
      value: t.testimonials.stats.instructors.value,
      label: t.testimonials.stats.instructors.label,
      description: t.testimonials.stats.instructors.description
    },
    {
      icon: Building,
      value: t.testimonials.stats.projects.value,
      label: t.testimonials.stats.projects.label,
      description: t.testimonials.stats.projects.description
    },
    {
      icon: Star,
      value: t.testimonials.stats.students.value,
      label: t.testimonials.stats.students.label,
      description: t.testimonials.stats.students.description
    }
  ]

  return (
    <section className="section-spacing bg-gradient-to-br from-surface via-white to-primary/5">
      <div className="container-base section-padding">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4" />
            <span>{t.testimonials.badge}</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-display font-bold text-neutral-900 mb-6">
            {t.testimonials.title.prefix} <span className="text-gradient">{t.testimonials.title.highlight}</span>
          </h2>

          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            {t.testimonials.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-medium">
                <stat.icon className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold font-display text-neutral-900 mb-2">
                {stat.value}
              </div>
              <div className="font-semibold text-neutral-800 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-neutral-600">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card p-8 group hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start space-x-4 mb-6">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-medium">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <Quote className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-bold text-lg text-neutral-900">
                      {testimonial.name}
                    </h4>
                    <div className="flex text-amber-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-primary font-medium mb-1">
                    {testimonial.position}
                  </p>
                  <p className="text-sm text-neutral-600 mb-2">
                    {testimonial.company}
                  </p>
                  <div className="flex items-center text-xs">
                    <span className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-semibold px-3 py-1 rounded-full">
                      {testimonial.category}
                    </span>
                  </div>
                </div>
              </div>

              <blockquote className="text-neutral-700 leading-relaxed italic border-l-4 border-primary/20 pl-4">
                "{testimonial.content}"
              </blockquote>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="card p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/10">
            <h3 className="text-2xl font-display font-bold text-neutral-900 mb-4">
              {t.testimonials.cta.title}
            </h3>
            <p className="text-neutral-600 mb-6">
              {t.testimonials.cta.subtitle}
            </p>
            <a href="https://esg-form.esgsunshine.com/" target="_blank" rel="noopener noreferrer" className="btn-primary btn-large">
              <Users className="w-5 h-5 mr-2" />
              {t.testimonials.cta.button}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}