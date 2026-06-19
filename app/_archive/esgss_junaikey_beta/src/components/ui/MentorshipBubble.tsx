import React from 'react';
import { motion } from 'framer-motion';

interface MentorshipBubbleProps {
  role: 'MENTOR' | 'LEARNER';
  message: string;
  className?: string;
}

export const MentorshipBubble: React.FC<MentorshipBubbleProps> = ({
  role,
  message,
  className = '',
}) => {
  const isMentor = role === 'MENTOR';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex items-start gap-4 mb-6 ${isMentor ? 'flex-row' : 'flex-row-reverse'} ${className}`}
    >
      {/* Avatar Icon */}
      <div
        className={`size-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-transform hover:rotate-12
        ${isMentor ? 'bg-primary text-[#102221] shadow-primary/20' : 'bg-white/5 border border-white/20 text-white/40'}
      `}
      >
        <span className="material-symbols-outlined font-bold">
          {isMentor ? 'smart_toy' : 'person'}
        </span>
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-2 max-w-[80%] ${isMentor ? 'items-start' : 'items-end'}`}>
        <div
          className={`p-5 rounded-2xl glass-effect border transition-all duration-500
          ${
            isMentor
              ? 'rounded-tl-none bg-[#283938] border-white/10 text-white'
              : 'rounded-tr-none bg-primary/10 border-primary/30 text-primary'
          }
        `}
        >
          <p className="text-sm leading-relaxed font-medium">{message}</p>
        </div>

        {/* Status / Time */}
        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] px-1">
          {isMentor ? 'Wisdom Mentor • Active' : 'Seeker • Confirmed'}
        </span>
      </div>
    </motion.div>
  );
};

export default MentorshipBubble;
