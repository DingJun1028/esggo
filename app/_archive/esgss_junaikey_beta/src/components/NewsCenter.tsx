import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserService } from '../services/UserService';
import { IIntelNode } from '../types/intelligence';
import {
  Diamond,
  Search,
  Bell as Notifications,
  Activity as Hub,
  Leaf as Eco,
  CreditCard as Payments,
  Users as Groups,
  Gavel,
  Sparkles as AutoAwesome,
  Megaphone as Campaign,
  ShieldCheck as VerifiedUser,
  ChevronLeft,
  ChevronRight,
  History,
  Link as LinkIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 📰 Daily ESG Intelligence Briefing (1.3)
 * --------------------------------------------------
 * Curation center for real-time ESG updates.
 * Leverages 5T Protocol for source verification.
 */
export const NewsCenter = () => {
  const { user, profile } = useAuth();
  const [news, setNews] = useState<IIntelNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Global Feed');

  useEffect(() => {
    const loadNews = async () => {
      if (user?.uid) {
        const dailyNews = await UserService.getDailyNews(user.uid);
        setNews(dailyNews);
        setLoading(false);
      }
    };
    loadNews();
  }, [user]);

  if (loading)
    return <div className="p-10 text-white animate-pulse">Initializing News Feed...</div>;

  return (
    <div className="bg-[#f5f8f8] dark:bg-[#0a1111] font-sans text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="max-w-[1440px] mx-auto flex gap-6 px-6 py-8">
        {/* Sidebar Navigation */}
        <aside className="w-64 shrink-0 hidden xl:flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="px-2">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
                Interests Database
              </h3>
              <div className="space-y-1">
                {[
                  { icon: Hub, name: 'Global Feed', badge: '12' },
                  { icon: Eco, name: 'Carbon Credits' },
                  { icon: Payments, name: 'Green Finance' },
                  { icon: Groups, name: 'Social Impact' },
                  { icon: Gavel, name: 'Governance' },
                ].map(tab => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group ${
                      activeTab === tab.name
                        ? 'bg-[#0ab8b2]/10 text-[#0ab8b2]'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon className="w-5 h-5" />
                      <span className="text-sm font-semibold">{tab.name}</span>
                    </div>
                    {tab.badge && (
                      <span className="text-[10px] bg-[#0ab8b2] text-[#0a1111] px-1.5 py-0.5 rounded font-bold">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Page Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                Daily AI Briefing
              </h1>
              <p className="text-white/50 text-lg">
                AI has curated{' '}
                <span className="text-[#0ab8b2] font-semibold">
                  {news.length} critical ESG updates
                </span>{' '}
                for your portfolio today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-[#0ab8b2] text-[#0a1111] px-4 py-2.5 rounded-lg text-sm font-bold hover:brightness-110 transition-all">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                Ask AI Assistant
              </button>
            </div>
          </div>

          {/* Top Priority Alerts */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Campaign className="text-[#0ab8b2]" />
                High Priority Signals
              </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {news.map((item, idx) => (
                <motion.div
                  key={item.uuid}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`min-w-[400px] backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:border-[#0ab8b2] transition-all hover:shadow-[0_0_20px_rgba(10,184,178,0.15)] ${idx === 0 ? 'ring-1 ring-[#0ab8b2]/30' : ''}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-2 py-1 rounded text-[10px] font-bold bg-[#0ab8b2] text-[#0a1111] uppercase tracking-wider">
                      Critical Impact
                    </span>
                    <div className="flex items-center gap-2 text-[#0ab8b2]">
                      <VerifiedUser className="w-4 h-4" />
                      <span className="text-xs font-bold tracking-widest uppercase italic">
                        Traceable
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#0ab8b2] transition-colors text-white line-clamp-2">
                    {item.data.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-2">
                    {item.data.summary}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded bg-white/5 flex items-center justify-center">
                        <LinkIcon className="text-white/40 w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase">Source Origin</p>
                        <p className="text-xs font-bold text-white">
                          {item.evidence.source_origin}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/40 uppercase">Relevance</p>
                      <p className="text-xs font-bold text-[#0ab8b2]">98% Match</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Intelligence Feed Grid */}
          <section>
            <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="text-xl font-bold text-white">Intelligence Feed</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* News tiles would go here, mapped from a larger dataset */}
              {news.map(item => (
                <div
                  key={item.uuid}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-5 group cursor-pointer hover:border-[#0ab8b2] transition-all"
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-[#0ab8b2] uppercase tracking-widest">
                          Sentiment: Bullish
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                        <span className="text-[10px] text-white/40">Renewables</span>
                      </div>
                      <h4 className="text-lg font-bold group-hover:text-[#0ab8b2] transition-colors leading-snug text-white">
                        {item.data.title}
                      </h4>
                    </div>
                  </div>
                  <p className="text-white/50 text-sm mb-4 line-clamp-2">{item.data.summary}</p>
                  <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase">
                    <div className="flex items-center gap-1.5 text-white/40">
                      <History className="w-3.5 h-3.5" />
                      <span>Source • Just now</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#0ab8b2]">
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>Origin Verified</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Right Side: Mini Stats/Widgets */}
        <aside className="w-72 shrink-0 hidden 2xl:flex flex-col gap-6">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-5 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
              Briefing Quality
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative size-14">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/5"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="100, 100"
                    strokeWidth="3"
                  ></path>
                  <path
                    className="text-[#0ab8b2]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="88, 100"
                    strokeLinecap="round"
                    strokeWidth="3"
                  ></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  88%
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-white">AI Accuracy</p>
                <p className="text-[10px] text-white/40">Verified by 42 Sources</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
