import React from 'react';
import { Language } from '@/types';

export const Dashboard: React.FC<{ language: Language }> = ({ language }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">
        {language === 'zh-TW' ? '儀表板' : 'Dashboard'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-cyan-500/20 p-6 rounded-2xl backdrop-blur-sm hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-300">
          <h3 className="font-semibold mb-2 text-white">Metrics</h3>
          <p className="text-slate-400">Placeholder for ESG metrics</p>
        </div>
      </div>
    </div>
  );
};
