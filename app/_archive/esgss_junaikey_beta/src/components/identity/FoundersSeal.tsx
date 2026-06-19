import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { Language } from '@/types/core';

interface FoundersSealProps {
  language: Language;
  className?: string;
}

export const FoundersSeal: React.FC<FoundersSealProps> = ({ language, className = '' }) => {
  const isZh = language === 'zh-TW';

  return (
    <div
      className={`relative group cursor-help ${className}`}
      title={isZh ? '創始者印記：早鳥專屬獎勵' : "Founder's Seal: Early Adopter Reward"}
    >
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md group-hover:bg-blue-500/40 transition-all duration-500" />

      {/* Badge Body */}
      <div className="relative flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-slate-900 to-slate-800 border border-blue-500/50 rounded-full shadow-lg shadow-blue-900/40 overflow-hidden">
        {/* Animated Shine Effect */}
        <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out" />

        <ShieldCheck className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />

        <span className="text-[10px] font-black text-blue-100 uppercase tracking-tighter flex items-center gap-1">
          {isZh ? '創始印記' : 'Founder'}
          <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
        </span>
      </div>
    </div>
  );
};
