'use client';
import React from 'react';
import { SACRED_GATES, ProtocolGateCode } from '../../types/protocol';
import { motion } from 'framer-motion';

interface T5Item {
  code: ProtocolGateCode;
  active?: boolean;
}

interface BrandT5StripProps {
  items?: T5Item[];
  compact?: boolean;
  className?: string;
  animate?: boolean;
}

export default function BrandT5Strip({
  items = [
    { code: 'T1', active: true },
    { code: 'T2', active: true },
    { code: 'T3', active: true },
    { code: 'T4', active: true },
    { code: 'T5', active: true },
  ],
  compact = false,
  className = '',
  animate = true,
}: BrandT5StripProps) {
  return (
    <div className={`flex items-center gap-${compact ? '1.5' : '2'} flex-wrap ${className}`}>
      {items.map((item, idx) => {
        const config = SACRED_GATES[item.code];
        const active = item.active !== false;
        
        return (
          <motion.div
            key={item.code}
            initial={animate ? { opacity: 0, scale: 0.8 } : false}
            animate={animate ? { opacity: 1, scale: 1 } : false}
            transition={{ delay: idx * 0.1 }}
            className={`
              inline-flex items-center gap-1.5 rounded-2xl font-black transition-all border-2
              ${compact ? 'text-[9px] px-2.5 py-0.5' : 'text-[10px] px-3.5 py-1.5'}
            `}
            style={{
              backgroundColor: active ? `${config.color}15` : '#f8fafc',
              color: active ? config.color : '#cbd5e1',
              borderColor: active ? `${config.color}30` : '#f1f5f9',
              boxShadow: active ? `0 0 12px ${config.color}10` : 'none',
            }}
          >
            <span className="opacity-40">{item.code}</span>
            <div className={`w-1 h-1 rounded-full ${active ? '' : 'bg-slate-300'}`} style={{ backgroundColor: active ? config.color : undefined }} />
            <span>{config.labelZh}</span>
            {!compact && <span className="text-[8px] opacity-40 font-bold ml-0.5">{config.titleZh.split('(')[1]?.replace(')', '')}</span>}
          </motion.div>
        );
      })}
    </div>
  );
}
