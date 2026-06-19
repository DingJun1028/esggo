'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Mail, X, Check, TrendingUp, Globe2, BookOpen, Bell } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { subscribeNewsletter } from '@/app/actions'

export default function NewsletterBanner() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // 只在首页显示
  const isHomePage = pathname === '/' || pathname === '/en'

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await subscribeNewsletter(email)

      if (result.success) {
        setIsSubscribed(true)
        setTimeout(() => {
          setIsVisible(false)
        }, 3000)
      } else {
        alert(result.message || 'Subscription failed')
      }
    } catch (error) {
      console.error('Newsletter error:', error)
      alert('Subscription failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const benefits = [
    { icon: TrendingUp, text: t.newsletter.benefits[0].text },
    { icon: Globe2, text: t.newsletter.benefits[1].text },
    { icon: BookOpen, text: t.newsletter.benefits[2].text }
  ]

  // 如果不是首页或不可见，则不显示
  if (!isHomePage || !isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-primary via-emerald-500 to-secondary text-white shadow-strong animate-slide-up">
      <div className="container-base px-4 md:px-6">
        <div className="py-3">
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {!isSubscribed ? (
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold">{t.newsletter.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1">
                      <benefit.icon className="w-3 h-3" />
                      <span>{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubscribe} className="flex gap-2 md:min-w-[380px]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.newsletter.placeholder}
                  className="flex-1 px-3 py-2 text-sm rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-all backdrop-blur-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors shadow-medium hover:shadow-strong whitespace-nowrap disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '...' : t.newsletter.submit}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-2">
              <div className="inline-flex items-center space-x-2 bg-white/20 rounded-xl px-4 py-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold">{t.newsletter.success.title}</h3>
                  <p className="text-xs text-white/90">{t.newsletter.success.subtitle}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}