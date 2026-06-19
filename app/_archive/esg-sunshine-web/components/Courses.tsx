import { 
  Award, 
  Clock, 
  Users, 
  Globe2,
  CheckCircle,
  Star,
  ArrowRight,
  BookOpen,
  Target,
  Lightbulb
} from 'lucide-react'

export default function Courses() {
  const courses = [
    {
      title: 'Berkeley 國際永續策略長認證',
      subtitle: 'International Sustainability Executive Certificate',
      duration: '6週',
      hours: '31小時',
      students: '20人',
      price: 'NT$ 45,000',
      originalPrice: 'NT$ 55,000',
      level: '高階主管',
      description: '來自加州大學柏克萊分校商學院的頂尖課程，培養全球永續策略思維與領導力',
      features: [
        '國際永續趋势分析',
        '永續商業模式設計', 
        '利害關係人議合',
        '永續風險管理',
        '碳中和策略規劃'
      ],
      highlights: ['🏆 Berkeley 官方認證', '🌍 全球校友網絡', '💼 高階主管專班'],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Taiwan 永續轉型規劃師認證',
      subtitle: 'Certified Sustainability Transformation Planner',
      duration: '6週',
      hours: '29小時',
      students: '30人',
      price: 'NT$ 35,000',
      originalPrice: 'NT$ 42,000',
      level: '中高階專業人員',
      description: '結合台灣產業特色，專注於永續轉型實務操作與在地化解決方案',
      features: [
        'ESG 實務操作',
        '永續報告撰寫',
        '碳盤查實作',
        '供應鏈管理',
        '數位永續工具'
      ],
      highlights: ['🇹🇼 在地化專精', '🔧 實務操作導向', '📊 工具與範本'],
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'ESG 基礎認證課程',
      subtitle: 'ESG Fundamentals Certificate',
      duration: '4週',
      hours: '16小時',
      students: '50人',
      price: 'NT$ 18,000',
      originalPrice: 'NT$ 22,000',
      level: '入門到中階',
      description: '全面性的ESG基礎知識建構，適合永續新手或轉職人員',
      features: [
        'ESG 基礎概念',
        '國際標準介紹',
        '法規合規要求',
        '案例研究分析',
        '職涯發展規劃'
      ],
      highlights: ['📚 基礎扎實', '⏰ 彈性學習', '💡 職涯導向'],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ]

  const features = [
    {
      icon: Award,
      title: '國際認證',
      description: '獲得業界認可的專業證書'
    },
    {
      icon: Users,
      title: '專家指導',
      description: '國際頂尖講師親自授課'
    },
    {
      icon: Globe2,
      title: '全球視野',
      description: '掌握國際最新永續趨勢'
    },
    {
      icon: Target,
      title: '實務導向',
      description: '理論結合實務案例教學'
    }
  ]

  return (
    <section id="courses" className="section-spacing bg-white">
      <div className="container-base section-padding">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <BookOpen className="w-4 h-4" />
            <span>認證課程</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-display font-bold text-neutral-900 mb-6">
            專業 <span className="text-gradient">認證課程</span>
          </h2>
          
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            與國際頂尖學府合作，提供最高品質的永續教育課程，
            培養您成為永續領域的專業領袖人才。
          </p>
        </div>

        {/* Course Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="card p-6 text-center group hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-neutral-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {courses.map((course, index) => (
            <div key={index} className={`card-interactive border-2 ${course.borderColor} overflow-hidden group`}>
              {/* Course Header */}
              <div className={`${course.bgColor} p-6 border-b border-neutral-100`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex items-center space-x-2 bg-white rounded-full px-3 py-1 text-xs font-semibold`}>
                    <Star className="w-3 h-3" />
                    <span>{course.level}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-neutral-900">{course.price}</div>
                    <div className="text-sm text-neutral-500 line-through">{course.originalPrice}</div>
                  </div>
                </div>
                
                <h3 className="font-bold text-xl text-neutral-900 mb-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-neutral-600 mb-4">{course.subtitle}</p>
                
                {/* Course Stats */}
                <div className="flex items-center space-x-4 text-sm text-neutral-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.hours}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students}</span>
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <p className="text-neutral-600 leading-relaxed mb-6">
                  {course.description}
                </p>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-neutral-900">課程內容：</h4>
                  {course.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-neutral-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Highlights */}
                <div className="space-y-2 mb-6">
                  {course.highlights.map((highlight, highlightIndex) => (
                    <div key={highlightIndex} className="inline-block bg-neutral-100 rounded-full px-3 py-1 text-xs font-medium text-neutral-700 mr-2">
                      {highlight}
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className={`w-full btn-primary bg-gradient-to-r ${course.color} hover:scale-105`}>
                  <span>立即報名</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="card p-12 bg-gradient-to-br from-primary/5 via-surface to-secondary/5 border-2 border-primary/10">
            <div className="max-w-2xl mx-auto">
              <Lightbulb className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h3 className="text-3xl font-display font-bold text-neutral-900 mb-4">
                還在猶豫選擇哪個課程？
              </h3>
              <p className="text-lg text-neutral-600 mb-8">
                我們的專業顧問將根據您的背景和職涯目標，為您推薦最適合的學習路徑。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary btn-large">
                  <Users className="w-5 h-5 mr-2" />
                  免費課程諮詢
                </button>
                <button className="btn-outline btn-large">
                  <BookOpen className="w-5 h-5 mr-2" />
                  下載課程手冊
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}