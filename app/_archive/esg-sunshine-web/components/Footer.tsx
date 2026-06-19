'use client'

import {
  Globe2,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Linkedin,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  const footerSections = t.footer.sections

  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook', color: 'hover:text-blue-500' },
    { icon: Linkedin, href: '#', name: 'LinkedIn', color: 'hover:text-blue-600' },
    { icon: Instagram, href: '#', name: 'Instagram', color: 'hover:text-pink-500' },
    { icon: Twitter, href: '#', name: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Youtube, href: '#', name: 'YouTube', color: 'hover:text-red-500' }
  ]

  const contactInfo = [
    { icon: Phone, text: t.footer.contact.phone, type: 'tel' },
    { icon: Mail, text: t.footer.contact.email, type: 'email' },
    { icon: MapPin, text: t.footer.contact.address, type: 'address' }
  ]

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container-base section-padding">
        <div className="py-16">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center">
                <img
                  src="https://cdn.imgchest.com/files/ae1d769340b0.png"
                  alt="ESG Sunshine logo"
                  className="h-20 w-auto object-contain"
                />
              </div>
              
              <p className="text-neutral-300 leading-relaxed">
                {t.footer.description}
              </p>

              <div className="space-y-3">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <contact.icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-neutral-300">{contact.text}</span>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-white">{t.footer.social.title}</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={`w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-xl flex items-center justify-center transition-all duration-300 group ${social.color}`}
                      aria-label={social.name}
                    >
                      <social.icon className="w-5 h-5 text-neutral-400 group-hover:scale-110 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {footerSections.map((section, index) => (
                <div key={index}>
                  <h4 className="font-bold text-white mb-6">{section.title}</h4>
                  <nav className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.href}
                        className="block text-neutral-300 hover:text-primary transition-colors duration-200 text-sm hover:translate-x-1 transform"
                      >
                        {link.name}
                      </a>
                    ))}
                  </nav>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-8 border-t border-neutral-800">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <p className="text-neutral-400 text-sm">
                {t.footer.copyright}
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              {t.footer.legal.map((item, index) => (
                <a key={index} href={item.href} className="text-neutral-400 hover:text-primary transition-colors">
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}