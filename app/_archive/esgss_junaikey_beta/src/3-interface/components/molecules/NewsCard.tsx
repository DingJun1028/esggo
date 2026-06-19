import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock } from 'lucide-react';

interface NewsCardProps {
  title: string;
  source: string;
  timestamp: string;
  category: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export const NewsCard: React.FC<NewsCardProps> = ({
  title,
  source,
  timestamp,
  category,
  impact,
}) => {
  const impactColors = {
    positive: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    negative: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    neutral: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
  };

  return (
    <motion.div
      whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      className="p-4 rounded-2xl border border-white/5 bg-black/40 transition-all flex flex-col gap-3"
    >
      <div className="flex justify-between items-start">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${impactColors[impact]}`}
        >
          {category}
        </span>
        <ExternalLink size={14} className="text-slate-600 hover:text-white cursor-pointer" />
      </div>

      <h3 className="text-sm font-bold text-slate-100 leading-snug line-clamp-2">{title}</h3>

      <div className="mt-auto flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span className="font-bold">{source}</span>
        <div className="flex items-center gap-1">
          <Clock size={10} />
          {timestamp}
        </div>
      </div>
    </motion.div>
  );
};
