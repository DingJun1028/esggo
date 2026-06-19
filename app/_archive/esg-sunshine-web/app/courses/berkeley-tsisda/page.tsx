'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'
import { GraduationCap, Award, Users, BookOpen, Target, CheckCircle2, Lightbulb, Star, TrendingUp, BarChart3, Briefcase, FileText } from 'lucide-react'
import MentorLogos from '@/components/MentorLogos'
import PromoBundle from '@/components/PromoBundle'

export default function BerkeleyCourse() {
  const { t } = useLanguage()
  const course = t.berkeleyCourse

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface">
        <Header />
        <main className="pt-32 pb-20">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
              <div className="relative">
                {/* Desktop Logos - Absolute positioned */}
                <div className="absolute left-0 top-0 hidden lg:block">
                  <img
                    src="https://cdn.imgchest.com/files/925070a76f6c.png"
                    alt="Berkeley Haas logo"
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <div className="absolute -right-[40px] -top-[30px] hidden lg:block">
                  <img
                    src="https://cdn.imgchest.com/files/43f7d008f75a.png"
                    alt="TSISDA logo"
                    className="h-24 w-auto object-contain"
                  />
                </div>

                {/* Mobile Logos - Centered */}
                <div className="flex items-center justify-center gap-6 mb-8 lg:hidden">
                  <img
                    src="https://cdn.imgchest.com/files/925070a76f6c.png"
                    alt="Berkeley Haas logo"
                    className="h-8 w-auto object-contain"
                  />
                  <img
                    src="https://cdn.imgchest.com/files/43f7d008f75a.png"
                    alt="TSISDA logo"
                    className="h-16 w-auto object-contain"
                  />
                </div>

                <div className="text-center max-w-5xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-6">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold text-primary">{course.englishTitle}</span>
                  </div>
                  <h1
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6"
                    style={{ lineHeight: '1.4' }}
                    dangerouslySetInnerHTML={{ __html: course.title }}
                  />
                  <p className="text-2xl text-neutral-700 mb-8 font-semibold">
                    {course.home.heading}
                  </p>
                  <p className="text-lg text-neutral-600">
                    {course.home.subheading}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Introduction Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="max-w-5xl mx-auto">
                <p className="text-lg text-neutral-700 mb-8 leading-relaxed">
                  {course.home.description}
                </p>
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8 mb-8">
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">{course.home.structure.title}</h3>
                  {course.home.structure.modules.map((module, index) => (
                    <div key={index} className="flex items-start gap-3 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <p className="text-neutral-700">{module}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-secondary/5 to-accent/5 rounded-xl p-8">
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">{course.home.takeaways.title}</h3>
                  {course.home.takeaways.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 mb-3">
                      <Star className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                      <p className="text-neutral-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Highlights Section */}
          <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                  {course.highlights.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {course.highlights.items.map((item, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-lg font-bold">
                        {item.number}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-neutral-900 mb-3">
                          {item.title}
                        </h3>
                        <p className="text-neutral-700 leading-relaxed mb-3">
                          {item.description}
                        </p>
                        {item.deliverables && (
                          <div className="mt-4 space-y-2">
                            {item.deliverables.map((deliverable, dIndex) => (
                              <div key={dIndex} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                                <span className="text-sm text-neutral-600">{deliverable}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Need This Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                  {course.whyNeedThis.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {course.whyNeedThis.reasons.map((reason, index) => (
                  <div key={index} className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {reason.number}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-neutral-900 mb-2">
                          {reason.title}
                        </h3>
                        <p className="text-sm text-neutral-700 leading-relaxed">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Overview Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                  {course.overview.title}
                </h2>
                <p className="text-xl text-neutral-700">{course.overview.description}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Berkeley Module */}
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">{course.overview.berkeleyModule.title}</h3>
                  <p className="text-neutral-700 mb-6">{course.overview.berkeleyModule.description}</p>
                  <div className="space-y-3">
                    {course.overview.berkeleyModule.topics.map((topic, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <span className="text-neutral-700">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Taiwan Module */}
                <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">{course.overview.taiwanModule.title}</h3>
                  <p className="text-neutral-700 mb-6">{course.overview.taiwanModule.description}</p>
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-neutral-900 mb-3">{course.overview.taiwanModule.renMai.title}</h4>
                    <div className="space-y-2">
                      {course.overview.taiwanModule.renMai.topics.map((topic, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-1" />
                          <span className="text-sm text-neutral-600">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-900 mb-3">{course.overview.taiwanModule.duMai.title}</h4>
                    <div className="space-y-2">
                      {course.overview.taiwanModule.duMai.topics.map((topic, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
                          <span className="text-sm text-neutral-600">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Faculty Section */}
          <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                  {course.faculty.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
                {/* Berkeley Faculty */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-neutral-900 mb-6">{course.faculty.berkeleyFaculty.title}</h3>
                  <div className="space-y-3 mb-6">
                    {course.faculty.berkeleyFaculty.centers.map((center, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <span className="text-neutral-700">{center}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Taiwan Team */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-neutral-900 mb-6">{course.faculty.taiwanTeam.title}</h3>
                  <div className="space-y-3">
                    {course.faculty.taiwanTeam.members.map((member, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Briefcase className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                        <span className="text-neutral-700">{member}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Faculty Details */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-neutral-900 mb-8 text-center">{course.faculty.instructorsTitle}</h3>
                <p className="text-sm text-neutral-600 mb-6 text-center">{course.faculty.instructorsNote}</p>
                <div className="mb-12">
                  {(() => {
                    const allInstructors = [
                      ...(course.faculty.berkeleyFaculty.instructors || []),
                      ...(course.faculty.taiwanTeam.instructors || [])
                    ]
                    const firstRow = allInstructors.slice(0, 3)
                    const secondRow = allInstructors.slice(3, 5)

                    return (
                      <>
                        {/* First row - 3 instructors */}
                        <div className="flex flex-wrap justify-center gap-6 mb-6">
                          {firstRow.map((instructor, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] max-w-[300px]">
                              <div className="flex flex-col items-center text-center">
                                {instructor.image ? (
                                  <img
                                    src={instructor.image}
                                    alt={instructor.name}
                                    className="w-32 h-32 object-cover rounded-lg mb-4"
                                  />
                                ) : (
                                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                                    {instructor.name.split(' ')[1]?.charAt(0) || instructor.name.charAt(0)}
                                  </div>
                                )}
                                <h4 className="font-bold text-neutral-900 mb-2">{instructor.name}</h4>
                                <p className="text-sm text-neutral-600">{instructor.title}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Second row - 2 instructors */}
                        <div className="flex flex-wrap justify-center gap-6">
                          {secondRow.map((instructor, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] max-w-[300px]">
                              <div className="flex flex-col items-center text-center">
                                {instructor.image ? (
                                  <img
                                    src={instructor.image}
                                    alt={instructor.name}
                                    className="w-32 h-32 object-cover rounded-lg mb-4"
                                  />
                                ) : (
                                  <div className="w-20 h-20 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                                    {instructor.name.split(' ')[1]?.charAt(0) || instructor.name.charAt(0)}
                                  </div>
                                )}
                                <h4 className="font-bold text-neutral-900 mb-2">{instructor.name}</h4>
                                <p className="text-sm text-neutral-600">{instructor.title}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )
                  })()}
                </div>

                <h3 className="text-2xl font-bold text-neutral-900 mb-8 text-center">{course.faculty.mentorsTitle}</h3>
                <MentorLogos note={course.faculty.mentorsNote} />
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {course.faculty.berkeleyFaculty.mentors?.map((mentor, index) => (
                    <div key={index} className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-lg p-4 hover:shadow-md transition-all">
                      <p className="font-semibold text-neutral-900 text-sm mb-1">{mentor.name}</p>
                      <p className="text-xs text-neutral-600">{mentor.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Structure Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {course.structure.title}
                </h2>
                <p className="text-2xl text-neutral-700">{course.structure.subtitle}</p>
              </div>
              <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-neutral-200">
                <h3 className="text-xl font-bold text-neutral-900 mb-6">{course.structure.weeklyStructure.title}</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {course.structure.weeklyStructure.components.map((component, index) => (
                    <div key={index} className="flex items-start gap-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
                      <BarChart3 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span className="text-neutral-700">{component}</span>
                    </div>
                  ))}
                </div>
                <p className="text-neutral-700 text-center mt-6">{course.structure.description}</p>
              </div>
            </div>
          </section>

          {/* Deliverables Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                  {course.deliverables.title}
                </h2>
              </div>
              <div className="space-y-8 max-w-5xl mx-auto">
                {course.deliverables.items.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-lg font-bold">
                        {item.number}
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-900 flex-1">
                        {item.title}
                      </h3>
                    </div>
                    {item.description && (
                      <p className="text-neutral-700 mb-4 ml-14">{item.description}</p>
                    )}
                    <div className="ml-14 space-y-2">
                      {(item.canvases || item.components)?.map((element, eIndex) => (
                        <div key={eIndex} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                          <span className="text-neutral-700">{element}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Certification Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-4xl mx-auto">
                <Award className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                  {course.certification.title}
                </h2>
                <p className="text-lg text-neutral-700 mb-8">{course.certification.description}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  {course.certification.certificates.map((cert, index) => (
                    <div key={index} className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6">
                      <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                      <p className="text-neutral-800 font-semibold text-center">{cert}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Promo Bundle */}
          <PromoBundle />

          {/* FAQs Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                  {course.faqs.title}
                </h2>
              </div>
              <div className="max-w-4xl mx-auto space-y-6">
                {course.faqs.items.map((faq, index) => (
                  <div key={index} className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-6 hover:shadow-lg transition-all">
                    <h3 className="text-lg font-bold text-primary mb-3">{faq.question}</h3>
                    <p className="text-neutral-700 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Enrollment Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                  {course.enrollment.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="bg-white rounded-xl p-8">
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">{course.enrollment.targetAudience.title}</h3>
                  <div className="space-y-3">
                    {course.enrollment.targetAudience.groups.map((group, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <span className="text-neutral-700">{group}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-8 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{course.enrollment.format.title}</h3>
                    <p className="text-neutral-700">{course.enrollment.format.description}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{course.enrollment.admission.title}</h3>
                    <p className="text-neutral-700">{course.enrollment.admission.description}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{course.enrollment.contact.title}</h3>
                    <p className="text-neutral-700">{course.enrollment.contact.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <Lightbulb className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                開啟您的國際永續策略人才之旅
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                成為具備國際視野與實務能力的永續策略領袖
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://corporateinnovation.berkeley.edu/students/business-model-practicum-2026/" target="_blank" rel="noopener noreferrer" className="btn-outline text-base px-8 py-3">
                  了解課程
                </a>
                <a href="https://esg-form.esgsunshine.com/" target="_blank" rel="noopener noreferrer" className="btn-primary text-base px-8 py-3 shadow-glow">
                  立即報名
                </a>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <ScrollToTop />
        <NewsletterBanner />
      </div>
    </PageTransition>
  )
}
