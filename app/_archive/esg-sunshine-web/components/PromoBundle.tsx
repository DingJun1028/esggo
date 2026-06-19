"use client"

import Image from 'next/image'

const ITEMS = [
  {
    text: '一份完整的《永續策略藍圖 2.0》',
    image: 'https://cdn.imgchest.com/files/8ea08e87252b.png',
    alt: '永續策略藍圖 2.0'
  },
  {
    text: '一份企業永續報告骨架 × 策略框架',
    image: 'https://cdn.imgchest.com/files/d07deff9fd8f.png',
    alt: '企業永續報告骨架'
  },
  {
    text: '一份創價型 ESG 新創提案原型（Prototype）',
    image: 'https://cdn.imgchest.com/files/d4f515b7efd7.png',
    alt: 'ESG 新創提案原型'
  },
  {
    text: '市價 NT$29,000 的 ESG 轉型健檢 × 顧問諮詢',
    image: 'https://cdn.imgchest.com/files/f1461a7ac862.png',
    alt: 'ESG 轉型健檢'
  },
  {
    text: 'Berkeley × TSISDA 兩大正式證書',
    image: 'https://cdn.imgchest.com/files/dbf395982bdb.png',
    alt: 'Berkeley TSISDA 證書'
  },
]

export default function PromoBundle() {
  return (
    <section className="py-16 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8">
          <h3 className="text-2xl font-bold text-neutral-900 mb-8 text-center">學員將帶走</h3>

          <div className="space-y-8 mb-8">
            {ITEMS.map((item, index) => (
              <div key={index} className="space-y-4">
                <p className="text-lg text-neutral-700">• {item.text}</p>
                <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://corporateinnovation.berkeley.edu/students/business-model-practicum-2026/" target="_blank" rel="noopener noreferrer" className="btn-outline px-6 py-3">了解課程</a>
            <a href="https://esg-form.esgsunshine.com/" target="_blank" rel="noopener noreferrer" className="btn-primary px-6 py-3">立即報名</a>
          </div>
        </div>
      </div>
    </section>
  )
}
