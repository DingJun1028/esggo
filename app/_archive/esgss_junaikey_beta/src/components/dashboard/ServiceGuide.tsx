import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Compass, Map, Search, ArrowRight, ShieldCheck } from 'lucide-react';

export const ServiceGuide: React.FC = () => {
  const guides = [
    {
      id: 'g1',
      title: 'Platform Onboarding',
      desc: 'Master the user interface in 5 minutes.',
      icon: <Compass size={24} className="text-cyan-400" />,
      difficulty: 'Beginner',
    },
    {
      id: 'g2',
      title: 'Carbon Inventory 101',
      desc: 'How to input Scope 1 & 2 data efficiently.',
      icon: <ShieldCheck size={24} className="text-emerald-400" />,
      difficulty: 'Intermediate',
    },
    {
      id: 'g3',
      title: 'Supply Chain Audit',
      desc: 'Verify supplier compliance with 5T protocols.',
      icon: <Map size={24} className="text-amber-400" />,
      difficulty: 'Advanced',
    },
  ];

  return (
    <div className="h-full w-full bg-[#050c0c] text-white p-8 overflow-y-auto relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-[#020606] -z-10" />

      {/* Header */}
      <header className="mb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block p-4 rounded-full bg-cyan-900/20 border border-cyan-500/30 mb-4"
        >
          <BookOpen size={40} className="text-cyan-400" />
        </motion.div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-200 via-white to-cyan-200 bg-clip-text text-transparent mb-2">
          Interactive Service Guide
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Navigate the JunAiKey ecosystem with precision. Select a module to begin your journey.
        </p>
      </header>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-12 relative group">
        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center bg-slate-800/80 border border-white/10 rounded-full px-6 py-4 backdrop-blur-md">
          <Search className="text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Search for guides, tutorials, or API docs..."
            className="bg-transparent border-none outline-none flex-1 text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Guide Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {guides.map((guide, idx) => (
          <motion.div
            key={guide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform">
                  {guide.icon}
                </div>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                    guide.difficulty === 'Beginner'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : guide.difficulty === 'Intermediate'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {guide.difficulty}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                {guide.title}
              </h3>
              <p className="text-sm text-slate-400 mb-6">{guide.desc}</p>

              <div className="flex items-center text-xs font-bold text-cyan-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                START GUIDED TOUR <ArrowRight size={14} className="ml-1" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
