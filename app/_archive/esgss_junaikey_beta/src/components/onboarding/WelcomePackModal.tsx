import React from 'react';
import { Gift, Zap, Shield, Award, X } from 'lucide-react';
import { Language, SubscriptionTier } from '@/types/core';
import { Button } from '@/components/ui';

interface WelcomePackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => void;
  language: Language;
}

export const WelcomePackModal: React.FC<WelcomePackModalProps> = ({
  isOpen,
  onClose,
  onClaim,
  language,
}) => {
  if (!isOpen) return null;

  const isZh = language === 'zh-TW';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 animate-in zoom-in-95 duration-300">
        {/* Background Decorative Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-[80px]" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-[80px]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors rounded-full hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Icon Banner */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <Gift className="w-10 h-10 text-white" />
            </div>

            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white tracking-tight">
                {isZh ? '覺醒者新手權益包' : 'Awakened Welcome Pack'}
              </h2>
              <p className="text-slate-400 text-sm">
                {isZh
                  ? '歡迎來到 ESGss。我們為您的覺醒之旅準備了初期物資。'
                  : 'Welcome to ESGss. We have prepared initial supplies for your awakening journey.'}
              </p>
            </div>

            {/* Perks List */}
            <div className="w-full space-y-3">
              <div className="flex items-center p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mr-4">
                  <Award className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-left flex-1">
                  <h4 className="text-white font-bold text-sm">
                    {isZh ? '誠信代幣：1,000 XP' : 'Token of Trust: 1,000 XP'}
                  </h4>
                  <p className="text-slate-500 text-xs">
                    {isZh ? '即刻提升您的覺醒等級' : 'Instantly boost your Awakening level'}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mr-4">
                  <Zap className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-left flex-1">
                  <h4 className="text-white font-bold text-sm">
                    {isZh ? '中樞權限：7天試用' : 'Central Access: 7-Day Trial'}
                  </h4>
                  <p className="text-slate-500 text-xs">
                    {isZh
                      ? '解鎖 Agent Forge 與進階分析'
                      : 'Unlock Agent Forge and Advanced Analytics'}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mr-4">
                  <Shield className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-left flex-1">
                  <h4 className="text-white font-bold text-sm">
                    {isZh ? '創始者印記' : "Founder's Seal"}
                  </h4>
                  <p className="text-slate-500 text-xs">
                    {isZh ? '早鳥專屬身份識別 badge' : 'Early adopter exclusive id badge'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={onClaim}
              className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 transition-all active:scale-95"
            >
              {isZh ? '即刻領取並覺醒' : 'Claim Now & Awaken'}
            </Button>

            <p className="text-slate-500 text-[10px] uppercase tracking-widest">
              {isZh
                ? '善向永續：文明轉型的起點'
                : 'ESGss: The Origin of Civilization Transformation'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
