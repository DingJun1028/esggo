'use client'

import { useState } from 'react'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ContactFormData, submitContactMessage } from '@/app/actions'

export default function Contact() {
  const { t } = useLanguage()

  // Form state
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    job_title: '',
    email: '',
    phone: '',
    company_name: '',
    subject: '課程諮詢',
    message: '',
  })

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  // Validation errors
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {}

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = t.contact.form.fields.name.required ? '此欄位為必填' : ''
    }
    if (!formData.email.trim()) {
      newErrors.email = '此欄位為必填'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '請輸入有效的電子郵件地址'
    }
    if (!formData.message.trim()) {
      newErrors.message = '此欄位為必填'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous status
    setSubmitStatus({ type: null, message: '' })

    // Validate form
    if (!validateForm()) {
      setSubmitStatus({
        type: 'error',
        message: '請填寫所有必填欄位',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitContactMessage(formData)

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: '訊息已成功送出！我們會盡快與您聯繫。',
        })

        // Reset form
        setFormData({
          name: '',
          job_title: '',
          email: '',
          phone: '',
          company_name: '',
          subject: '課程諮詢',
          message: '',
        })
      } else {
        throw new Error(result.message || 'Submission failed')
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error
          ? error.message
          : '提交失敗，請稍後再試或直接與我們聯繫。',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      title: t.contact.info.items[0].title,
      details: t.contact.info.items[0].details,
      subtitle: t.contact.info.items[0].subtitle
    },
    {
      icon: Mail,
      title: t.contact.info.items[1].title,
      details: t.contact.info.items[1].details,
      subtitle: t.contact.info.items[1].subtitle
    },
    {
      icon: MapPin,
      title: t.contact.info.items[2].title,
      details: t.contact.info.items[2].details,
      subtitle: t.contact.info.items[2].subtitle
    },
    {
      icon: Clock,
      title: t.contact.info.items[3].title,
      details: t.contact.info.items[3].details,
      subtitle: t.contact.info.items[3].subtitle
    }
  ]

  const services = [
    {
      icon: MessageCircle,
      title: t.contact.services.items[0].title,
      description: t.contact.services.items[0].description,
      action: t.contact.services.items[0].action
    },
    {
      icon: Calendar,
      title: t.contact.services.items[1].title,
      description: t.contact.services.items[1].description,
      action: t.contact.services.items[1].action
    },
    {
      icon: Users,
      title: t.contact.services.items[2].title,
      description: t.contact.services.items[2].description,
      action: t.contact.services.items[2].action
    }
  ]

  return (
    <section id="contact" className="section-spacing bg-surface">
      <div className="container-base section-padding">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Phone className="w-4 h-4" />
            <span>{t.contact.badge}</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-display font-bold text-neutral-900 mb-6">
            {t.contact.title.prefix} <span className="text-gradient">{t.contact.title.highlight}</span>
          </h2>

          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <div className="card p-8">
              <h3 className="text-2xl font-display font-bold text-neutral-900 mb-6">
                {t.contact.form.title}
              </h3>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Success/Error Message */}
                {submitStatus.type && (
                  <div
                    className={`p-4 rounded-xl flex items-start space-x-3 ${submitStatus.type === 'success'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                      }`}
                  >
                    {submitStatus.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <p
                      className={`text-sm font-medium ${submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                        }`}
                    >
                      {submitStatus.message}
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      {t.contact.form.fields.name.label} {t.contact.form.fields.name.required && t.common.required}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-neutral-200'
                        } focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300`}
                      placeholder={t.contact.form.fields.name.placeholder}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      {t.contact.form.fields.title.label}
                    </label>
                    <input
                      type="text"
                      name="job_title"
                      value={formData.job_title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                      placeholder={t.contact.form.fields.title.placeholder}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      {t.contact.form.fields.email.label} {t.contact.form.fields.email.required && t.common.required}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-neutral-200'
                        } focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300`}
                      placeholder={t.contact.form.fields.email.placeholder}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      {t.contact.form.fields.phone.label}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                      placeholder={t.contact.form.fields.phone.placeholder}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    {t.contact.form.fields.company.label}
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                    placeholder={t.contact.form.fields.company.placeholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    {t.contact.form.fields.subject.label}
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                  >
                    {t.contact.form.fields.subject.options.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    {t.contact.form.fields.message.label} {t.contact.form.fields.message.required && t.common.required}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-500' : 'border-neutral-200'
                      } focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300`}
                    placeholder={t.contact.form.fields.message.placeholder}
                  ></textarea>
                  {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary btn-large group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  {isSubmitting ? '送出中...' : t.contact.form.submit}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="card p-8">
              <h3 className="text-xl font-display font-bold text-neutral-900 mb-6">
                {t.contact.info.title}
              </h3>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">
                        {info.title}
                      </h4>
                      <p className="text-neutral-700 font-medium">
                        {info.details}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {info.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-8">
              <h3 className="text-xl font-display font-bold text-neutral-900 mb-6">
                {t.contact.services.title}
              </h3>

              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="border border-neutral-200 rounded-xl p-4 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 group cursor-pointer">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <service.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900 mb-1 group-hover:text-primary transition-colors">
                          {service.title}
                        </h4>
                        <p className="text-sm text-neutral-600 mb-2">
                          {service.description}
                        </p>
                        <span className="text-xs font-medium text-primary">
                          {service.action} →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-8">
              <h3 className="text-xl font-display font-bold text-neutral-900 mb-4">
                {t.contact.map.title}
              </h3>
              <div className="rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d903.5146211118994!2d121.52015971961227!3d25.066006813412333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a94599096c2b%3A0xd392851f7afff64b!2zMTA0MzI36Ie65YyX5biC5Lit5bGx5Y2A5Lit5bGx5YyX6Lev5LiJ5q61NDDomZ8!5e0!3m2!1szh-TW!2stw!4v1763697245448!5m2!1szh-TW!2stw"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}