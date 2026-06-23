import React from 'react';
import BrandEmptyState from './BrandEmptyState';
import { Hammer, Rocket, ShieldCheck } from 'lucide-react';

interface ComingSoonPlaceholderProps {
  title: string;
  wave: 1 | 2;
}

export default function ComingSoonPlaceholder({ title, wave }: ComingSoonPlaceholderProps) {
  const isWave1 = wave === 1;

  return (
    <div className="flex-1 h-full w-full flex flex-col items-center justify-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 m-4">
      <BrandEmptyState
        title={`${title} 模組`}
        description={
          isWave1
            ? '本模組屬於 WAVE 1 (近期更新) 波次，目前正進入最後階段的 5T 協議對接與壓力測試，即將開放。'
            : '本模組屬於 WAVE 2 (遠期更新) 波次，預計於下一季釋出，將為您帶來更深度的 ESG 管理體驗。'
        }
        icon={isWave1 ? <Hammer size={28} className="text-cyan-600" /> : <Rocket size={28} className="text-indigo-600" />}
      />
      
      <div className="mt-8 flex gap-4 text-xs font-medium text-slate-400">
        <span className="flex items-center gap-1"><ShieldCheck size={14}/> 5T Integrity Protocol</span>
        <span className="flex items-center gap-1"><ShieldCheck size={14}/> Zero-Knowledge Proof Ready</span>
      </div>
    </div>
  );
}
