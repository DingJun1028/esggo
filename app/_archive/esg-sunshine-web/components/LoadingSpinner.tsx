'use client'

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-neutral-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-brand font-bold text-gradient">ESG Sunshine</h3>
          <p className="text-sm text-neutral-600">善向永續 · 載入中...</p>
        </div>
      </div>
    </div>
  )
}