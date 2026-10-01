/**
 * App.jsx — route table and shell for ftgtours.
 *
 * 5T-Traceable: source_origin = deployed bundle index-XzYV-tOx.js route table
 * (33 `path:` literals resolving to the 14 routes below).
 *
 * Recovered then corrected. The deployed app used BrowserRouter, and so does
 * this one: every internal link is a react-router <Link to="...">. That makes
 * the two `href="#/contact"` anchors that shipped in the Navbar a genuine
 * dead link — under BrowserRouter a bare "#/contact" changes only the hash and
 * never matches a route. Navbar now uses <Link to="/contact"> instead.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CorporateTravelPage from './pages/CorporateTravelPage';
import FamilyDayPage from './pages/FamilyDayPage';
import TeamDayPage from './pages/TeamDayPage';
import WellbeingPage from './pages/WellbeingPage';
import ExecutivePage from './pages/ExecutivePage';
import ImpactNotePage from './pages/ImpactNotePage';
import ContactPage from './pages/ContactPage';
import JourneyDesignPage from './pages/JourneyDesignPage';
import StreamsPage from './pages/StreamsPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/corporate-travel" element={<CorporateTravelPage />} />
              <Route path="/family-day" element={<FamilyDayPage />} />
              <Route path="/esg-team-day" element={<TeamDayPage />} />
              <Route path="/wellbeing-retreat" element={<WellbeingPage />} />
              <Route path="/executive-retreat" element={<ExecutivePage />} />
              <Route path="/esg-impact-note" element={<ImpactNotePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/journey-design" element={<JourneyDesignPage />} />
              <Route path="/streams" element={<StreamsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}
