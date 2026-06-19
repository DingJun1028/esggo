'use client'

import { Star, CheckCircle, ArrowRight, Award, Clock, Gift, Zap, Shield, Crown, Users } from 'lucide-react'

export default function Pricing() {
  const features = [
    { name: 'Berkeley Haas 國際永續策略長認證', highlight: true },
    { name: 'Taiwan 國際永續轉型規劃師認證', highlight: true },
    { name: '60小時完整課程（31+29小時）', highlight: false },
    { name: '線上Live教學，可重複回看', highlight: false },
    { name: '矽谷導師實戰指導', highlight: true },
    { name: '國際案例研討與分析', highlight: false },
    { name: '專屬永續服務優惠', highlight: true },
    { name: '課程完成證書', highlight: false },
    { name: '永續人才網絡建立', highlight: true },
    { name: '終身學習資源存取', highlight: false }
  ]

  const guarantees = [
    { icon: Shield, title: '品質保證', desc: '不滿意全額退款' },
    { icon: Crown, title: 'VIP待遇', desc: '專人諮詢服務' },
    { icon: Gift, title: '免費贈送', desc: 'ESG實務工具包' }
  ]

  return (
    <section id="pricing" className="section-spacing bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container-wide section-padding relative">
        {/* Header */}
        <div className="text-center space-content max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-accent/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary/20">
            <Zap className="w-4 h-4" />
            <span>限時早鳥優惠</span>
          </div>
          <h2 className="text-headline text-gray-900 text-balance">
            💡 立即投資您的
            <span className="text-primary">永續職涯未來</span>
          </h2>
          <p className="text-body-large text-muted max-w-3xl mx-auto text-balance">
            現在報名享受早鳥優惠，成為引領永續轉型的國際關鍵人才！
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Main Pricing Card */}
          <div className="relative">
            {/* Popular Badge */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full text-sm font-bold flex items-center space-x-2 shadow-medium">
                <Star className="w-5 h-5 text-yellow-200" />
                <span>🔥 限額招生中</span>
              </div>
            </div>

            <div className="card-elevated border-2 border-primary/20 hover:border-primary/30 transition-all duration-300 overflow-hidden">
              <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                {/* Left Side - Course Info */}
                <div className="lg:col-span-7 p-8 lg:p-12 space-content">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-medium">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-title text-gray-900">
                          國際永續策略師認證課程
                        </h3>
                        <p className="text-primary font-semibold">Berkeley + Taiwan 雙認證</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline space-x-3 mb-8">
                      <span className="text-5xl font-bold text-primary font-heading">NT$ 69,000</span>
                      <div className="flex flex-col">
                        <span className="text-xl text-gray-400 line-through">NT$ 89,000</span>
                        <span className="text-sm text-accent font-semibold">省下 NT$ 20,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-6 text-lg">課程包含內容：</h4>
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3 group">
                          <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors ${
                            feature.highlight ? 'text-primary' : 'text-emerald-500'
                          }`} />
                          <span className={`text-sm leading-relaxed transition-colors group-hover:text-gray-900 ${
                            feature.highlight ? 'text-gray-900 font-semibold' : 'text-gray-700'
                          }`}>
                            {feature.name}
                            {feature.highlight && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">亮點</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side - CTA & Info */}
                <div className="lg:col-span-5 p-8 lg:p-12 bg-surface/50">
                  <div className="space-content h-full flex flex-col">
                    {/* Guarantee Badges */}
                    <div className="space-y-4 mb-8">
                      {guarantees.map((guarantee, index) => (
                        <div key={index} className="flex items-center space-x-3 bg-white rounded-xl p-4 shadow-soft border border-gray-100">
                          <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <guarantee.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{guarantee.title}</div>
                            <div className="text-xs text-muted">{guarantee.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Schedule */}
                    <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 mb-8 border border-primary/10">
                      <div className="flex items-center space-x-3 mb-4">
                        <Clock className="w-6 h-6 text-primary" />
                        <span className="font-bold text-gray-900">開課時程</span>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted">第一期</span>
                          <span className="font-semibold text-gray-900">2024年3月開班</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted">第二期</span>
                          <span className="font-semibold text-gray-900">2024年5月開班</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <span className="text-xs text-primary font-medium">💡 兩期內容相同，可依需求選擇</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-auto">
                      <button className="w-full btn-primary btn-large text-xl py-6 shadow-glow hover:shadow-strong group mb-4">
                        <span>🚀 立即報名課程</span>
                        <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
                      </button>
                      
                      <div className="text-center text-sm text-muted">
                        <div className="flex items-center justify-center space-x-4">
                          <span>🔒 安全付款</span>
                          <span>💯 品質保證</span>
                          <span>📞 專人服務</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="mt-12 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-200">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">早鳥優惠價 77折</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full border border-blue-200">
                <Users className="w-4 h-4" />
                <span className="font-medium">小班制精品教學</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full border border-purple-200">
                <Gift className="w-4 h-4" />
                <span className="font-medium">企業團報另有優惠</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}