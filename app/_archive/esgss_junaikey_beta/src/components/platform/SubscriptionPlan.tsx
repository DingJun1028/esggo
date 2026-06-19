// src/components/platform/SubscriptionPlan.tsx
import React from 'react';
import { Check, X, Star, Zap, Building2, Crown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SubscriptionPlan: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 pb-32 animate-in fade-in font-sans">
      <div className="text-center mb-12">
        <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20 mb-4">
          OMNI-PLATFORM PLANS
        </span>
        <h1 className="text-4xl font-black text-white mb-4">選擇您的永續賦能方案</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          絕大部分功能 (70%) 永久免費。僅針對進階個人需求與企業合規需求提供付費加值服務。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* 70% Free Tier */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 flex flex-col relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-700 to-slate-500"></div>
          <div className="mb-6">
            <div className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
              <Star className="w-5 h-5 fill-emerald-400" /> 基礎版 (Basic)
            </div>
            <div className="text-4xl font-black text-white mb-1">FREE</div>
            <div className="text-xs text-slate-500 font-bold">永久免費 (70% 內容)</div>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-sm text-slate-300">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>Dr. Thoth 永續心法專區</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-300">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>ESG Go! 日常任務功能</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-300">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>基礎Omni-Tools工具組</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-300">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>Omni-Alliance 聯盟推廣</span>
            </li>
          </ul>
          <button className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold cursor-default border border-white/5">
            目前方案
          </button>
        </div>

        {/* 15% Pro Tier */}
        <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-2xl scale-[1.02] z-10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 to-blue-600"></div>
          <div className="absolute top-4 right-4 text-[10px] font-bold bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
            POPULAR
          </div>
          <div className="mb-6">
            <div className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 fill-cyan-400" /> 進階版 (Pro)
            </div>
            <div className="text-4xl font-black text-white mb-1">
              $399<span className="text-base font-normal text-slate-500">/月</span>
            </div>
            <div className="text-xs text-slate-500 font-bold">個人進階賦能 (15% 加值)</div>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-sm text-white font-bold">
              <Check className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />
              <span>所有基礎版功能</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-300">
              <Check className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />
              <span>Omni-Hut 付費主題模板 (日/夜)</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-300">
              <Check className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />
              <span>300 善向幣/每月空投</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-300">
              <Check className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />
              <span>個人影響力 AI 深度分析</span>
            </li>
          </ul>
          <button
            onClick={() => alert('即將開放訂閱！')}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-shadow"
          >
            立即升級
          </button>
        </div>

        {/* 10% Enterprise Tier */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 flex flex-col relative overflow-hidden group hover:border-purple-500/50 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
          <div className="mb-6">
            <div className="text-purple-400 font-bold mb-2 flex items-center gap-2">
              <Building2 className="w-5 h-5" /> 企業版 (Enterprise)
            </div>
            <div className="text-4xl font-black text-white mb-1">Custom</div>
            <div className="text-xs text-slate-500 font-bold">企業合規專用 (10% 專屬)</div>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-sm text-white font-bold">
              <Check className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
              <span>多重帳號管理權限</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-300">
              <Check className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
              <span>ISO 14064-1 報告書生成</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-300">
              <Check className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
              <span>SROI 區塊鏈影響力查證</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-300">
              <Check className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
              <span>專屬顧問 API 串接</span>
            </li>
          </ul>
          <button
            onClick={() => alert('請聯繫銷售團隊')}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-white/5 transition-colors"
          >
            聯繫我們
          </button>
        </div>

        {/* 5% Hidden Unlockable Tier */}
        <div className="bg-black border border-yellow-500/50 rounded-2xl p-6 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600"></div>

          <div className="relative z-10 mb-6 text-center pt-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full mx-auto flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(251,191,36,0.5)]">
              <Crown className="w-8 h-8 text-black fill-black" />
            </div>
            <div className="text-yellow-400 font-black text-xl mb-1">LEGENDARY</div>
            <div className="text-xs text-yellow-600 font-bold tracking-widest uppercase">
              Secret Achievement
            </div>
          </div>

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <Sparkles className="w-6 h-6 text-yellow-200 animate-pulse" />
            <p className="text-slate-400 text-sm italic">
              "Only those who have truly impacted the world may enter the Golden Genesis."
            </p>
            <div className="text-xs font-bold text-slate-600 border border-slate-800 px-3 py-1 rounded bg-black/50">
              5% Hidden Content
            </div>
          </div>

          <div className="relative z-10 mt-8">
            <button
              disabled
              className="w-full py-3 bg-slate-900/50 text-slate-500 rounded-xl font-bold border border-white/5 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" /> 未解鎖 (Locked)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
