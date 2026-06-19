import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import Testimonials from '@/components/Testimonials'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import NewsletterBanner from '@/components/NewsletterBanner'
import PageTransition from '@/components/PageTransition'

export default function EnHomePage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-surface" style={{ margin: 0, padding: 0, display: 'block' }}>
        <Header />
        <main style={{ margin: 0, padding: 0, display: 'block', position: 'relative' }}>
          <iframe
            src="https://emb.fouita.com/widget/0x3816f0/fthfdl841"
            title="ESG Sunshine"
            width="100%"
            height="1100"
            frameBorder="0"
            className="hidden md:block"
            style={{ height: '1100px', margin: 0, padding: 0, position: 'relative', top: '-160px', marginBottom: '-400px' }}
          />
          <Hero />
          <About />
          <Services />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
        <ScrollToTop />
        <NewsletterBanner />
      </div>
    </PageTransition>
  )
}
