import { Award, Globe2, Star, Users } from 'lucide-react'

export default function Partners() {
  const partners = [
    {
      category: '學術合作夥伴',
      description: '與全球頂尖學府合作，提供最高品質的教育資源',
      institutions: [
        { name: 'UC Berkeley Haas', logo: 'Berkeley', tier: 'primary' },
        { name: 'Stanford GSB', logo: 'Stanford', tier: 'primary' },
        { name: 'MIT Sloan', logo: 'MIT', tier: 'secondary' },
        { name: 'Harvard Business School', logo: 'Harvard', tier: 'secondary' },
        { name: 'INSEAD', logo: 'INSEAD', tier: 'secondary' },
        { name: 'London Business School', logo: 'LBS', tier: 'secondary' }
      ]
    },
    {
      category: '認證機構',
      description: '獲得國際權威認證機構的官方認可',
      institutions: [
        { name: 'GRI Standards', logo: 'GRI', tier: 'primary' },
        { name: 'SASB Foundation', logo: 'SASB', tier: 'primary' },
        { name: 'CDP Worldwide', logo: 'CDP', tier: 'secondary' },
        { name: 'Science Based Targets', logo: 'SBTi', tier: 'secondary' },
        { name: 'UN Global Compact', logo: 'UNGC', tier: 'secondary' },
        { name: 'TCFD', logo: 'TCFD', tier: 'secondary' }
      ]
    },
    {
      category: '企業夥伴',
      description: '與領先企業攜手推動永續轉型實務應用',
      institutions: [
        { name: '台積電', logo: 'TSMC', tier: 'primary' },
        { name: '鴻海科技', logo: 'Foxconn', tier: 'primary' },
        { name: '中華電信', logo: 'Chunghwa', tier: 'secondary' },
        { name: '台灣大哥大', logo: 'TWM', tier: 'secondary' },
        { name: '永豐銀行', logo: 'SinoPac', tier: 'secondary' },
        { name: '富邦金控', logo: 'Fubon', tier: 'secondary' }
      ]
    }
  ]

  const achievements = [
    {
      icon: Globe2,
      number: '15+',
      label: '國際合作夥伴',
      description: '遍布全球的頂尖教育機構'
    },
    {
      icon: Award,
      number: '10+',
      label: '權威認證',
      description: '獲得多項國際專業認證'
    },
    {
      icon: Users,
      number: '100+',
      label: '企業客戶',
      description: '信賴合作的知名企業'
    },
    {
      icon: Star,
      number: '5+',
      label: '年合作經驗',
      description: '長期穩定的夥伴關係'
    }
  ]

  return (
    <section className="section-spacing bg-white">
      <div className="container-base section-padding">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Globe2 className="w-4 h-4" />
            <span>合作夥伴</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-display font-bold text-neutral-900 mb-6">
            信賴 <span className="text-gradient">夥伴網絡</span>
          </h2>
          
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            與全球頂尖學術機構、權威認證組織及領先企業建立戰略夥伴關係，
            共同推動永續教育與實務應用的卓越發展。
          </p>
        </div>

        {/* Achievements */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement, index) => (
            <div key={index} className="card p-6 text-center group hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300">
                <achievement.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2 font-display">
                {achievement.number}
              </div>
              <div className="font-semibold text-neutral-900 mb-2">
                {achievement.label}
              </div>
              <div className="text-sm text-neutral-600">
                {achievement.description}
              </div>
            </div>
          ))}
        </div>

        {/* Partners Sections */}
        <div className="space-y-16">
          {partners.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-8">
              {/* Category Header */}
              <div className="text-center">
                <h3 className="text-2xl font-display font-bold text-neutral-900 mb-4">
                  {category.category}
                </h3>
                <p className="text-neutral-600 max-w-2xl mx-auto">
                  {category.description}
                </p>
              </div>

              {/* Institutions Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {category.institutions.map((institution, index) => (
                  <div 
                    key={index} 
                    className={`card-interactive p-6 text-center group ${
                      institution.tier === 'primary' ? 'border-2 border-primary/20' : ''
                    }`}
                  >
                    {/* Logo Placeholder */}
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      institution.tier === 'primary' 
                        ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-glow'
                        : 'bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200'
                    }`}>
                      <span className="text-xs font-bold">
                        {institution.logo.slice(0, 3)}
                      </span>
                    </div>
                    
                    <div className={`font-semibold text-sm group-hover:text-primary transition-colors ${
                      institution.tier === 'primary' ? 'text-neutral-900' : 'text-neutral-700'
                    }`}>
                      {institution.name}
                    </div>
                    
                    {institution.tier === 'primary' && (
                      <div className="mt-2">
                        <span className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                          <Star className="w-3 h-3" />
                          <span>核心夥伴</span>
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Partnership Benefits */}
        <div className="mt-20">
          <div className="card p-12 bg-gradient-to-br from-primary/5 via-surface to-secondary/5 border-2 border-primary/10">
            <div className="text-center max-w-4xl mx-auto">
              <h3 className="text-3xl font-display font-bold text-neutral-900 mb-6">
                為什麼選擇我們的夥伴網絡？
              </h3>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-lg text-neutral-900">國際權威認證</h4>
                  <p className="text-neutral-600">獲得全球最具權威性的專業認證，提升職場競爭力</p>
                </div>
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Globe2 className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-lg text-neutral-900">全球校友網絡</h4>
                  <p className="text-neutral-600">連結全球永續領域專業人士，擴展國際人脈關係</p>
                </div>
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-lg text-neutral-900">實務應用機會</h4>
                  <p className="text-neutral-600">直接參與企業永續專案，獲得寶貴的實務經驗</p>
                </div>
              </div>
              
              <div className="mt-10">
                <button className="btn-primary btn-large">
                  <Globe2 className="w-5 h-5 mr-2" />
                  加入我們的夥伴網絡
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}