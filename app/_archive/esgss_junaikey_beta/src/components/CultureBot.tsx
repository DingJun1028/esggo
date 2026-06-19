import React from 'react';
import { Language } from '@/types';

export const CultureBot: React.FC<{ language?: Language; onNavigate?: any }> = ({ language }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4 text-white">CultureBot</h2>
    <div className="bg-slate-900/50 border border-cyan-500/20 p-6 rounded-2xl backdrop-blur-sm">
      <p className="text-slate-400">Component placeholder for CultureBot</p>
    </div>
  </div>
);
