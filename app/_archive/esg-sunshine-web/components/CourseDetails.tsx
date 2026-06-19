'use client'

import { Clock, Calendar, Monitor, Users, BookOpen, Target, CheckCircle, Lightbulb, Brain, Rocket } from 'lucide-react'

export default function CourseDetails() {
  const courseInfo = [
    {
      icon: Calendar,
      label: '課程時程',
      value: '六週一班',
      description: '共兩期（內容相同）',
      color: 'from-blue to-blue-dark'
    },
    {
      icon: Clock,
      label: '總課程時數',
      value: '60小時',
      description: 'Berkeley 31h + 實務 29h',
      color: 'from-emerald to-emerald-dark'
    },
    {
      icon: Monitor,
      label: '授課模式',
      value: '線上Live',
      description: '可重複回看，不限地區',
      color: 'from-purple to-purple-dark'
    },
    {
      icon: Users,
      label: '教學指導',
      value: '國際導師',
      description: '矽谷專家實戰輔導',
      color: 'from-secondary to-secondary-dark'
    }
  ]

  const curriculum = [
    {
      phase: '任脈：法遵合規',
      subtitle: '建立永續治理基礎',
      color: 'from-primary to-primary-dark',
      bgColor: 'bg-primary/5',
      textColor: 'text-primary',
      icon: CheckCircle,
      modules: [
        { title: 'ESG 國際框架與標準', desc: '掌握 GRI、SASB、TCFD 等主要框架' },
        { title: '永續報告與揭露要求', desc: '學習國際永續報告撰寫技巧' },
        { title: '法規合規與風險管理', desc: '了解各國 ESG 相關法規要求' },
        { title: '國際永續評級系統', desc: '熟悉 MSCI、CDP、Sustainalytics 評級' }
      ]
    },
    {
      phase: '督脈：創價創新',
      subtitle: '驅動永續商業價值',
      color: 'from-emerald to-emerald-dark',
      bgColor: 'bg-emerald/5',
      textColor: 'text-emerald',
      icon: Lightbulb,
      modules: [
        { title: '永續商業模式創新', desc: '設計符合 SDGs 的商業模式' },
        { title: '碳管理與交易策略', desc: '碳盤查、碳中和、碳交易實務' },
        { title: '永續金融與投資', desc: 'ESG 投資、綠色債券、影響力投資' },
        { title: '數位轉型與永續科技', desc: 'AI、區塊鏈在永續領域的應用' }
      ]
    }
  ]

  const outcomes = [
    {
      title: '策略規劃能力',
      description: '制定符合國際標準的永續策略藍圖',
      icon: Target,
      color: 'text-blue'
    },
    {
      title: '合規管理技能',
      description: '掌握各項法規要求與風險控制機制',
      icon: CheckCircle,
      color: 'text-emerald'
    },
    {
      title: '創新思維培養',
      description: '結合永續與商業價值的創新解決方案',
      icon: Lightbulb,
      color: 'text-purple'
    },
    {
      title: '實務執行經驗',
      description: '具備落地執行的專案管理實戰能力',
      icon: Rocket,
      color: 'text-secondary'
    },
    {
      title: '國際視野建立',
      description: '了解全球永續趨勢與最佳實務案例',
      icon: Brain,
      color: 'text-pink'
    },
    {
      title: '領導力提升',
      description: '成為引領組織永續轉型的關鍵人才',
      icon: Users,
      color: 'text-indigo'
    }
  ]

  return (
    <section id="details" className="section-spacing bg-surface">
      <div className="container-wide section-padding">
        {/* Header */}
        <div className="text-center space-content max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <BookOpen className="w-4 h-4" />
            <span>課程架構</span>
          </div>
          <h2 className="text-headline text-gray-900 text-balance">
            📚 系統化學習路徑
            <span className="text-primary">全面培養永續專業能力</span>
          </h2>
          <p className="text-body-large text-muted max-w-3xl mx-auto text-balance">
            從基礎理論到實務應用，60小時完整課程體系，讓您成為永續領域的專業人才
          </p>
        </div>

        {/* Course Info Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {courseInfo.map((info, index) => (
            <div key={index} className="card-elevated p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-medium group-hover:shadow-strong`}>
                <info.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">{info.label}</h3>
              <p className="text-2xl font-bold text-primary mb-2 font-heading">{info.value}</p>
              <p className="text-sm text-muted">{info.description}</p>
            </div>
          ))}
        </div>

        {/* Curriculum */}
        <div className="space-content">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 gradient-bg rounded-3xl mb-6 shadow-medium">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-title text-gray-900 mb-4">
              🧠 核心課程架構
            </h3>
            <p className="text-muted max-w-2xl mx-auto">
              打通任督二脈的學習路徑，系統性建構從合規到創價的完整永續管理能力
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {curriculum.map((phase, index) => (
              <div key={index} className="card-elevated p-8 lg:p-10">
                <div className="flex items-center space-x-4 mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${phase.color} rounded-3xl flex items-center justify-center shadow-medium`}>
                    <phase.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-title text-gray-900">{phase.phase}</h4>
                    <p className={`text-sm ${phase.textColor} font-medium`}>{phase.subtitle}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {phase.modules.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="group">
                      <div className="flex items-start space-x-4">
                        <div className={`w-2 h-2 ${phase.bgColor} rounded-full mt-3 flex-shrink-0`}></div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                            {module.title}
                          </h5>
                          <p className="text-sm text-muted leading-relaxed">{module.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="mt-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 gradient-bg rounded-3xl mb-6 shadow-medium">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-title text-gray-900 mb-4">
              學習成果與能力培養
            </h3>
            <p className="text-muted max-w-2xl mx-auto">
              完成課程後，您將具備以下核心專業能力，成為永續轉型的領導者
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {outcomes.map((outcome, index) => (
              <div key={index} className="card-interactive p-6 group">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-14 h-14 bg-gray-50 group-hover:bg-gray-100 rounded-2xl flex items-center justify-center transition-colors duration-300`}>
                    <outcome.icon className={`w-7 h-7 ${outcome.color}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">{outcome.title}</h4>
                    <p className="text-sm text-muted leading-relaxed">{outcome.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}