'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Globe2, Award, BookOpen, Users, Phone, ClipboardCheck, BarChart3, TrendingUp, FileText, Heart, ChevronDown, GraduationCap } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null)
  const { t, locale } = useLanguage()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleMobileMenuClose = () => {
    setIsMenuOpen(false)
    setMobileOpenDropdown(null)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdown])

  const navigation = [
    { name: t.header.nav.about, href: locale === 'en' ? '/en/about' : '/about', icon: Users },
    { name: t.header.nav.services, href: '#services', icon: Globe2, hasDropdown: true, dropdownKey: 'services' },
    { name: t.header.nav.courses, href: '#courses', icon: Award, hasDropdown: true, dropdownKey: 'courses' },
    { name: t.header.nav.decisionPlatform, href: locale === 'en' ? '/en/decision-platform' : '/decision-platform', icon: BarChart3, hasDropdown: true, dropdownKey: 'decisionPlatform' },
    { name: t.header.nav.intelligenceAnalysis, href: locale === 'en' ? '/en/intelligence-analysis' : '/intelligence-analysis', icon: TrendingUp, hasDropdown: true, dropdownKey: 'intelligenceAnalysis' },
    { name: t.header.nav.healthCheckManagement, href: locale === 'en' ? '/en/health-check-management' : '/health-check-management', icon: ClipboardCheck, hasDropdown: true, dropdownKey: 'healthCheckManagement' },
    { name: t.header.nav.sustainabilityReport, href: '#sustainability-report', icon: FileText, hasDropdown: true, dropdownKey: 'sustainabilityReport' },
    { name: t.header.nav.publicWelfare, href: locale === 'en' ? '/en/public-welfare' : '/public-welfare', icon: Heart, hasDropdown: true, dropdownKey: 'publicWelfare' },
  ]

  const dropdownItems: Record<string, any[]> = {
    services: t.header.servicesDropdown.map(item => ({
      ...item,
      href: locale === 'en' ? item.href : item.href.replace('/en/', '/')
    })),
    courses: t.header.coursesDropdown.map(item => ({
      ...item,
      href: locale === 'en' ? item.href : item.href.replace('/en/', '/')
    })),
    decisionPlatform: t.header.decisionPlatformDropdown.map(item => ({
      ...item,
      href: locale === 'en' ? item.href : item.href.replace('/en/', '/')
    })),
    intelligenceAnalysis: t.header.intelligenceAnalysisDropdown.map(item => ({
      ...item,
      href: locale === 'en' ? item.href : item.href.replace('/en/', '/')
    })),
    healthCheckManagement: t.header.healthCheckManagementDropdown.map(item => ({
      ...item,
      href: locale === 'en' ? item.href : item.href.replace('/en/', '/')
    })),
    sustainabilityReport: t.header.sustainabilityReportDropdown.map(item => ({
      ...item,
      href: locale === 'en' ? item.href : item.href.replace('/en/', '/')
    })),
    publicWelfare: t.header.publicWelfareDropdown.map(item => ({
      ...item,
      href: locale === 'en' ? item.href : item.href.replace('/en/', '/')
    })),
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'bg-white/95 backdrop-blur-xl shadow-strong border-b border-neutral-100'
        : 'bg-white/80 backdrop-blur-sm'
        }`}>
        <div className="w-full px-6 lg:px-8 xl:px-12">
          <div className="flex items-start justify-between h-20 pt-2">
            <Link href={locale === 'en' ? '/en' : '/'} className="flex items-start group flex-shrink-0">
              <img
                src="https://cdn.imgchest.com/files/ae1d769340b0.png"
                alt="ESG Sunshine logo"
                className="h-12 w-auto object-contain group-hover:scale-110 transition-all duration-300"
              />
            </Link>

            <nav className="hidden lg:flex items-start flex-1 pl-4 pr-0 gap-0 -mt-[2px]">
              {navigation.map((item, index) => {
                const isEnglish = locale === 'en'
                const shouldWrap = isEnglish && index >= 3

                if (item.hasDropdown && item.dropdownKey) {
                  const isOpen = openDropdown === item.dropdownKey
                  const currentDropdownItems = dropdownItems[item.dropdownKey] || []

                  return (
                    <div
                      key={item.name}
                      className="relative"
                      ref={isOpen ? dropdownRef : null}
                    >
                      <button
                        onClick={() => setOpenDropdown(isOpen ? null : item.dropdownKey!)}
                        className={`flex items-start gap-1.5 px-3 py-2 ${locale === 'en' ? 'min-h-[60px]' : 'min-h-[36px]'} text-neutral-700 hover:text-primary font-medium transition-all duration-300 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 group flex-1 text-left ${shouldWrap ? 'max-w-[140px]' : ''
                          }`}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className={`text-xs leading-snug flex items-center gap-1 text-left ${shouldWrap ? 'break-words' : 'whitespace-nowrap'}`}>
                          {item.name}
                          <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </span>
                      </button>
                      {isOpen && (
                        <div className={`absolute top-full left-0 mt-2 ${locale === 'en' ? 'w-[570px]' : 'w-[450px]'} bg-white rounded-xl shadow-2xl border border-neutral-100 py-2 z-50 animate-fadeIn`}>
                          {currentDropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="block px-4 py-3 text-sm text-neutral-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-all duration-200 whitespace-nowrap"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-start gap-1.5 px-3 py-2 ${locale === 'en' ? 'min-h-[60px]' : 'min-h-[36px]'} text-neutral-700 hover:text-primary font-medium transition-all duration-300 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 group flex-1 text-left ${shouldWrap ? 'max-w-[140px]' : ''
                      }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className={`text-xs leading-snug text-left ${shouldWrap ? 'break-words' : 'whitespace-nowrap'}`}>
                      {item.name}
                    </span>
                  </Link>
                )
              })}
            </nav>

            <div className="hidden lg:flex items-start space-x-2 flex-shrink-0 -ml-4">
              <div className="scale-75 origin-right -mt-[5px]">
                <LanguageSwitcher />
              </div>
              <a href="https://corporateinnovation.berkeley.edu/students/business-model-practicum-2026/" target="_blank" rel="noopener noreferrer" className="btn-outline text-xs px-3 py-1.5 group whitespace-nowrap mt-1">
                <Award className="w-3.5 h-3.5 mr-1.5 group-hover:animate-pulse" />
                {t.header.buttons.contact}
              </a>
              <a href="https://esg-form.esgsunshine.com/" target="_blank" rel="noopener noreferrer" className="btn-primary text-xs px-3 py-1.5 shadow-glow group whitespace-nowrap mt-1">
                <Phone className="w-3.5 h-3.5 mr-1.5 group-hover:animate-bounce-soft" />
                {t.header.buttons.enroll}
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-neutral-700 hover:text-primary transition-colors mt-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu - outside header */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-white z-[60] overflow-y-auto shadow-xl">
          <div className="flex flex-col h-full">
            {/* Menu items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {navigation.map((item) => (
                <div key={item.name} className="border-b border-neutral-100">
                  {item.hasDropdown && item.dropdownKey ? (
                    <div>
                      <button
                        onClick={() => setMobileOpenDropdown(
                          mobileOpenDropdown === item.dropdownKey ? null : item.dropdownKey!
                        )}
                        className="w-full flex items-center justify-between py-4 text-neutral-700 hover:text-primary transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <span className="font-medium text-left">{item.name}</span>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${mobileOpenDropdown === item.dropdownKey ? 'rotate-180' : ''
                            }`}
                        />
                      </button>
                      {mobileOpenDropdown === item.dropdownKey && (
                        <div className="pb-2 pl-8 space-y-2">
                          {dropdownItems[item.dropdownKey]?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              onClick={handleMobileMenuClose}
                              className="block py-2 text-sm text-neutral-600 hover:text-primary transition-colors text-left"
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={handleMobileMenuClose}
                      className="w-full flex items-center gap-3 py-4 text-neutral-700 hover:text-primary transition-colors text-left"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium text-left">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom section with language switcher and contact button */}
            <div className="border-t border-neutral-200 px-6 py-4 bg-neutral-50 space-y-4">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-neutral-600" />
                <LanguageSwitcher />
              </div>
              <a
                href="https://esg-form.esgsunshine.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleMobileMenuClose}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                {t.header.buttons.enroll}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}