'use client'

import { useState, useEffect, useRef } from 'react'
import { Globe } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('zh-TW')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    // 檢查當前路徑是否在 /en/ 下
    if (pathname?.startsWith('/en')) {
      setCurrentLang('en')
    } else {
      setCurrentLang('zh-TW')
    }
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageChange = (lang: string) => {
    if (lang === 'en') {
      // 切換到英文版本
      const newPath = pathname?.startsWith('/en') ? pathname : `/en${pathname || '/'}`
      window.location.href = newPath
    } else {
      // 切換回中文版本
      const newPath = pathname?.startsWith('/en') ? pathname.replace(/^\/en/, '') || '/' : pathname || '/'
      window.location.href = newPath
    }
    setIsOpen(false)
  }

  const languages = [
    { code: 'zh-TW', label: '繁體中文', short: '繁體中文' },
    { code: 'en', label: 'English', short: 'EN' },
  ]

  const currentLanguage = languages.find(lang => lang.code === currentLang)

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-neutral-700 hover:text-primary font-medium transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 w-full sm:w-auto justify-between sm:justify-start"
        aria-label="切換語言"
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm sm:text-base">{currentLanguage?.short}</span>
        </div>
        <svg
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-40 bg-white rounded-xl shadow-strong border border-neutral-100 py-2 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${
                currentLang === lang.code
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
