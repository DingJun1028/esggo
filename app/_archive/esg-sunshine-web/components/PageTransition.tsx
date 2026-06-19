'use client'

import { useEffect, useState } from 'react'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-surface via-surface-2 to-primary/5 flex items-center justify-center">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="relative w-48 h-48 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-emerald animate-rotate-slow opacity-20"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/30 via-emerald/20 to-secondary/30 animate-pulse-soft"></div>
            <div className="absolute inset-8 rounded-full bg-white shadow-glow border-4 border-white/50 flex items-center justify-center">
              <img
                src="https://cdn.imgchest.com/files/ae1d769340b0.png"
                alt="ESG Sunshine logo"
                className="w-20 h-20 object-contain animate-glow"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-brand font-bold text-gradient">ESG Sunshine</h2>
            <p className="text-lg text-neutral-600 font-medium">善向永續</p>
            <div className="w-48 h-1 bg-neutral-200 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-loading-bar"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {children}
    </div>
  )
}