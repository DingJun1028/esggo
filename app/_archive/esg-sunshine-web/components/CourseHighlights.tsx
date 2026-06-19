'use client'

import { Globe, Award, Target, Users, CheckCircle, Star, Zap, Shield } from 'lucide-react'

export default function CourseHighlights() {
  const highlights = [
    {
      number: '01',
      title: '全台唯一｜前瞻 × 實務雙核心',
      description: '結合 Berkeley Haas 與台灣矽谷永續實務專家，打造市場唯一具「國際視野」與「落地執行力」的高階永續培訓課程。',
      icon: Globe,
      color: 'from-blue-500 to-blue-600',
      accent: 'text-blue-600',
      bgAccent: 'bg-blue-50'
    },
    {
      number: '02',
      title: '雙證書認證｜一次報名，雙重榮耀',
      description: '修畢課程即可獲得國際永續策略長（Berkeley）與國際永續轉型規劃師（Taiwan）雙認證。',
      icon: Award,
      color: 'from-amber-500 to-amber-600',
      accent: 'text-amber-600',
      bgAccent: 'bg-amber-50'
    },
    {
      number: '03',
      title: '打通任督二脈｜從合規到創價',
      description: '以「任脈：法遵合規」與「督脈：創價創新」為核心架構，幫助企業全面掌握永續轉型的推進關鍵。',
      icon: Target,
      color: 'from-emerald-500 to-emerald-600',
      accent: 'text-emerald-600',
      bgAccent: 'bg-emerald-50'
    },
    {
      number: '04',
      title: '實戰導向 × 國際落地輔導',
      description: '融合最新國際趨勢、案例研討與矽谷導師實戰指導，讓學員提案具備國際市場落地水準。',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      accent: 'text-purple-600',
      bgAccent: 'bg-purple-50'
    }
  ]

  const services = [
    { name: '永續健檢', icon: Shield },
    { name: '溫室氣體盤查', icon: Zap },
    { name: '碳交易輔導', icon: Target },
    { name: '永續報告撰寫', icon: Award },
    { name: '數位治理工具', icon: Globe }
  ]

  return (
    <section id="highlights" className="section-spacing bg-surface">
      <div className="container-wide section-padding">
        {/* Header */}
        <div className="text-center space-content max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4" />
            <span>課程核心優勢</span>
          </div>
          <h2 className="text-headline text-gray-900 text-balance">
            五大特色讓您成為
            <span className="text-primary">永續轉型專家</span>
          </h2>
          <p className="text-body-large text-muted max-w-3xl mx-auto text-balance">
            全方位永續人才培育計畫，從國際視野到實務落地，一次掌握永續轉型核心能力
          </p>
        </div>

        {/* Main Highlights Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
          {highlights.map((highlight, index) => (
            <div key={index} className="card-interactive p-8 lg:p-10 group">
              <div className="flex items-start space-x-6">
                {/* Number & Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${highlight.color} flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110`}>
                    <highlight.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="mt-4 text-center">
                    <span className={`text-2xl font-bold ${highlight.accent} font-heading`}>
                      {highlight.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-title text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                    {highlight.title}
                  </h3>
                  <p className="text-muted leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Services Section */}
        <div className="card-elevated p-8 lg:p-12">
          <div className="text-center space-content max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 gradient-bg rounded-3xl mb-6 shadow-medium">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-title text-gray-900 mb-4">
              專屬永續服務加值
            </h3>
            <p className="text-muted">
              課程學員享有合作夥伴提供之免費或優惠 ESG 轉型服務，讓學習與實務完美結合
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6 hover:from-primary/10 hover:to-primary/20 hover:border-primary/30 transition-all duration-300"
              >
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary/20 rounded-2xl flex items-center justify-center mx-auto transition-colors duration-300">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 block">
                    {service.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}