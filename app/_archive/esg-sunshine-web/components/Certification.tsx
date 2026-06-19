'use client'

import { Award, Star, Globe, CheckCircle, Sparkles, Trophy, Target, Users } from 'lucide-react'

export default function Certification() {
  const benefits = [
    {
      title: '國際合規思維',
      description: '掌握全球永續法規趨勢與國際標準框架',
      icon: Globe,
      color: 'from-blue to-blue-dark',
      bgColor: 'bg-blue/5'
    },
    {
      title: '創價創新能力',
      description: '結合永續目標與商業價值創造能力',
      icon: Sparkles,
      color: 'from-emerald to-emerald-dark',
      bgColor: 'bg-emerald/5'
    },
    {
      title: '跨域整合技能',
      description: '打通任督二脈，從合規到創價全掌握',
      icon: Target,
      color: 'from-purple to-purple-dark',
      bgColor: 'bg-purple/5'
    },
    {
      title: '實戰落地經驗',
      description: '具備國際市場落地水準的提案能力',
      icon: Trophy,
      color: 'from-secondary to-secondary-dark',
      bgColor: 'bg-secondary/5'
    }
  ]

  return (
    <section id="certification" className="section-spacing bg-white">
      <div className="container-wide section-padding">
        {/* Header */}
        <div className="text-center space-content max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-emerald/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary/20">
            <Trophy className="w-4 h-4" />
            <span>雙重認證</span>
          </div>
          <h2 className="text-headline text-gray-900 text-balance">
            🎓 <span className="text-primary">雙證書認證系統</span>
          </h2>
          <p className="text-body-large text-muted max-w-3xl mx-auto text-balance">
            一次報名，獲得兩張國際認可的專業證書，象徵您兼具國際合規思維與創價創新能力
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Certificates */}
          <div className="lg:col-span-7 space-items">
            {/* Berkeley Certificate */}
            <div className="card-interactive border-2 border-primary/10 hover:border-primary/20 p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                  國際權威
                </div>
              </div>

              <div className="flex items-start space-x-6 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-3xl flex items-center justify-center shadow-medium">
                    <Globe className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-title text-gray-900 mb-2">
                    國際永續策略長
                  </h3>
                  <p className="text-primary font-semibold text-lg mb-3">Berkeley Haas 認證</p>
                  <p className="text-muted leading-relaxed">
                    來自加州大學柏克萊分校商學院的國際權威認證，代表您具備全球永續策略制定與執行的專業能力。
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                <Star className="w-5 h-5 text-secondary" />
                <span className="text-sm font-medium text-gray-700">全球認可度最高的永續管理認證</span>
              </div>
            </div>

            {/* Taiwan Certificate */}
            <div className="card-interactive border-2 border-emerald/10 hover:border-emerald/20 p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <div className="bg-emerald/10 text-emerald px-3 py-1 rounded-full text-xs font-semibold">
                  在地專精
                </div>
              </div>

              <div className="flex items-start space-x-6 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald to-emerald-dark rounded-3xl flex items-center justify-center shadow-medium">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-title text-gray-900 mb-2">
                    國際永續轉型規劃師
                  </h3>
                  <p className="text-emerald font-semibold text-lg mb-3">Taiwan 在地認證</p>
                  <p className="text-muted leading-relaxed">
                    結合台灣產業特色與亞洲市場需求，專精於永續轉型實務規劃與執行管理的專業認證。
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                <CheckCircle className="w-5 h-5 text-emerald" />
                <span className="text-sm font-medium text-gray-700">亞洲市場永續實務領導認證</span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="lg:col-span-5 space-content">
            <div className="text-center mb-10">
              <div className="w-16 h-16 gradient-bg rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-medium">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-title text-gray-900 mb-4">
                雙證書帶來的職涯優勢
              </h3>
              <p className="text-muted">
                同時擁有國際視野與本土實務能力，成為企業永續轉型的關鍵人才
              </p>
            </div>

            <div className="space-items">
              {benefits.map((benefit, index) => (
                <div key={index} className={`${benefit.bgColor} border-l-4 border-l-current rounded-2xl p-6 group hover:shadow-soft transition-all duration-300`}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">{benefit.title}</h4>
                      <p className="text-sm text-muted leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="card-elevated p-6 text-center gradient-bg text-white">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h4 className="font-bold text-lg mb-2">立即開始您的認證之路</h4>
              <p className="text-white/90 text-sm mb-4">加入我們，獲得業界最高標準的雙重認證</p>
              <a href="#pricing" className="btn-secondary bg-white text-primary hover:bg-gray-100 btn-small">
                查看報名詳情
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}