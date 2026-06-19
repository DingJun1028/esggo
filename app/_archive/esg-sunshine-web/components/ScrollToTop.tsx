'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      className={`fixed bottom-8 right-8 z-40 w-14 h-14 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-glow hover:shadow-glow-lg transform transition-all duration-300 ${
        isVisible 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-16 opacity-0 scale-75 pointer-events-none'
      } hover:scale-110 group`}
      onClick={scrollToTop}
      aria-label="回到頂部"
    >
      <ArrowUp className="w-6 h-6 mx-auto group-hover:-translate-y-1 transition-transform" />
    </button>
  )
}