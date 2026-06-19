import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Award, Lock, ShieldCheck } from 'lucide-react';

export const GovernancePeak: React.FC = () => {
  const { language } = useLanguage();
  const isZh = language === 'zh-TW';

  const leaders = [
    { rank: 1, name: 'G-Score Project Alpha', score: 89.2, change: '+1.2' },
    { rank: 2, name: 'HyperTrader Corp', score: 89.2, change: '0.0' },
    { rank: 3, name: 'OmniBank Ltd', score: 89.8, change: '+0.5' },
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Top G-Score */}
      <div className="flex-1">
        <h4 className="text-xs text-white/50 font-bold mb-2 uppercase tracking-wider flex justify-between">
          <span>{isZh ? 'G 分數排行' : 'TOP G-SCORE'}</span>
          <span className="text-emerald-500">North</span>
        </h4>
        <div className="space-y-2">
          {leaders.map((leader, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-white/5 p-2 rounded border border-white/5 hover:border-emerald-500/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                {/* Live Certifications */}
                <div className="h-[40%] border-t border-white/5 pt-2">
                  <h4 className="text-xs text-white/50 font-bold mb-2 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {isZh ? '即時認證' : 'LIVE CERTIFICATIONS'}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-emerald-900/10 border border-emerald-500/20 p-2 rounded flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Award className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">UGN</div>
                        <div className="text-[10px] text-emerald-400">Verified</div>
                      </div>
                    </div>
                    <div className="bg-indigo-900/10 border border-indigo-500/20 p-2 rounded flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <Award className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">ISO</div>
                        <div className="text-[10px] text-indigo-400">Pending</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
