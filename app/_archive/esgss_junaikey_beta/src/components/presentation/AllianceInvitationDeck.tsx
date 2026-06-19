import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    title: 'Alliance Invitation',
    content: 'Join the Omni-Sovereign Entity',
    theme: 'bg-gradient-to-br from-[#0ab8b2]/20 to-blue-900/50',
  },
  {
    title: 'Authentication',
    content: '5 Ke Protocol Verified',
    theme: 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50',
  },
  {
    title: 'Sovereignty',
    content: 'Autonomous Governance Activated',
    theme: 'bg-gradient-to-br from-amber-900/50 to-orange-900/50',
  },
];

export const AllianceInvitationDeck: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, SLIDES.length - 1));
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 0, 0));

  return (
    <div className="w-full h-full min-h-[400px] bg-[#050505] text-white flex flex-col items-center justify-center p-8 rounded-xl border border-white/10 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className={`w-full max-w-2xl aspect-video rounded-2xl p-12 flex flex-col items-center justify-center text-center ${SLIDES[currentSlide].theme} border border-white/10 backdrop-blur-md`}
        >
          <h2 className="text-3xl font-bold mb-4 font-serif text-[#0ab8b2]">
            {SLIDES[currentSlide].title}
          </h2>
          <p className="text-xl text-slate-300">{SLIDES[currentSlide].content}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-4 mt-8">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 disabled:opacity-50 transition-all"
        >
          Previous
        </button>
        <button
          onClick={nextSlide}
          disabled={currentSlide === SLIDES.length - 1}
          className="px-6 py-2 rounded-full bg-[#0ab8b2] text-black font-medium hover:bg-[#089994] disabled:opacity-50 transition-all"
        >
          Next
        </button>
      </div>

      <div className="absolute bottom-4 left-0 w-full text-center">
        <p className="text-[10px] text-slate-700 font-mono tracking-widest">
          ESGss JunAiKey :: CONFIDENTIAL :: {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};
