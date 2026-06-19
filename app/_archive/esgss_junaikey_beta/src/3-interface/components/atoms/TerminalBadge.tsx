import React from 'react';
import { motion } from 'framer-motion';

interface TerminalBadgeProps {
  label: string;
  status?: 'online' | 'offline' | 'warning' | 'eternal';
}

export const TerminalBadge: React.FC<TerminalBadgeProps> = ({ label, status = 'online' }) => {
  const colorMap = {
    online: 'text-green-500 border-green-500/50 bg-green-500/10',
    offline: 'text-red-500 border-red-500/50 bg-red-500/10',
    warning: 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10',
    eternal:
      'text-primary border-primary/80 bg-primary/20 shadow-[0_0_10px_rgba(13,242,238,0.4)] animate-pulse',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`px-3 py-1 border rounded font-mono text-[10px] tracking-widest uppercase ${colorMap[status]}`}
    >
      {status === 'eternal' && <span className="mr-2">✨</span>}
      {label}
    </motion.div>
  );
};
