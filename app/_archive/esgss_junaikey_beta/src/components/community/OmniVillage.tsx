// src/components/community/OmniVillage.tsx
import React, { useState } from 'react';
import {
  Globe,
  Sun,
  Users,
  ArrowRight,
  Star,
  Building2,
  Sprout,
  Landmark,
  Network,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OmniVillage: React.FC = () => {
  const navigate = useNavigate();
  const [activeDistrict, setActiveDistrict] = useState<'genesis' | 'global'>('genesis');

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 pb-32 animate-in fade-in">
      {/* 🎖️ Hero Section: The Global View */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-900/30 px-4 py-2 rounded-full text-sm font-bold text-cyan-400 mb-6 border border-cyan-500/30">
          <Globe className="w-4 h-4" /> 善向永續國際村 (Omni-Village)
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
          從 <span className="text-amber-400">元組起源</span> 到{' '}
          <span className="text-cyan-400">全球共榮</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          這是一個有機生長的生態系。一切始於「黃金生態聯盟」，如太陽般照耀，延伸出連接世界的善向國際村。
        </p>
      </div>

      {/* 🌞 Genesis Node: Golden Ecology Alliance */}
      <div className="relative max-w-5xl mx-auto mb-20">
        {/* Connecting Line */}
        <div className="absolute left-1/2 top-full h-20 w-1 bg-gradient-to-b from-amber-500 to-cyan-500/50 -translate-x-1/2 z-0"></div>

        <div
          onClick={() => setActiveDistrict('genesis')}
          className={`relative z-10 bg-gradient-to-b from-amber-900/40 to-black border-2 ${activeDistrict === 'genesis' ? 'border-amber-400 shadow-[0_0_50px_rgba(251,191,36,0.2)]' : 'border-amber-500/30'} rounded-3xl p-8 md:p-12 text-center cursor-pointer transition-all hover:scale-[1.02] group`}
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-black rounded-full border-4 border-amber-400 flex items-center justify-center shadow-lg z-20">
            <Sun className="w-8 h-8 text-amber-400 fill-amber-400 animate-pulse-slow" />
          </div>

          <h2 className="text-3xl font-bold text-amber-400 mb-2 mt-4">黃金生態聯盟</h2>
          <div className="text-sm font-bold text-amber-200/60 uppercase tracking-[0.2em] mb-6">
            Golden Ecology Alliance
          </div>

          <div className="inline-block bg-amber-500/20 px-4 py-1 rounded-full text-amber-300 text-sm font-bold border border-amber-500/30 mb-8">
            👑 Un-Zu Genesis (元組生態鏈)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-black/40 p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/50 transition-colors">
              <Sprout className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="font-bold text-white mb-2">創始初心</h3>
              <p className="text-amber-100/60 text-sm">
                確立「善向」為核心價值，制定 5+1 心法與 4T 協議的最初原點。
              </p>
            </div>
            <div className="bg-black/40 p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/50 transition-colors">
              <Network className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="font-bold text-white mb-2">核心鏈結</h3>
              <p className="text-amber-100/60 text-sm">
                串聯產、官、學、研的元老級夥伴，構建堅不可摧的信任基礎。
              </p>
            </div>
            <div className="bg-black/40 p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/50 transition-colors">
              <Landmark className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="font-bold text-white mb-2">標準制定</h3>
              <p className="text-amber-100/60 text-sm">
                定義了什麼是「真正的影響力」，成為後續國際村擴展的圭臬。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🌍 Expansion: International Village */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
            <Globe className="text-cyan-400" />
            善向永續國際村 (International Village)
          </h2>
          <p className="text-slate-400 text-sm mt-2">基於元組精神，開枝散葉於全球</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Node 1 */}
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-cyan-900/30 p-2 rounded-lg text-cyan-400">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-500">APAC NODE</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">亞太創新港</h3>
            <p className="text-slate-400 text-sm mb-4">專注於科技賦能與供應鏈轉型。</p>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-slate-700 border border-slate-900"
                ></div>
              ))}
              <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-900 flex items-center justify-center text-[10px] text-white">
                +120
              </div>
            </div>
          </div>

          {/* Node 2 */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-400 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-900/30 p-2 rounded-lg text-emerald-400">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-500">EU NODE</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">歐洲綠色學院</h3>
            <p className="text-slate-400 text-sm mb-4">碳中和政策研究與教育推廣中心。</p>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-slate-700 border border-slate-900"
                ></div>
              ))}
              <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-900 flex items-center justify-center text-[10px] text-white">
                +85
              </div>
            </div>
          </div>

          {/* Node 3 */}
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-900/30 p-2 rounded-lg text-purple-400">
                <Landmark className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-500">NA NODE</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">北美影響力中心</h3>
            <p className="text-slate-400 text-sm mb-4">SROI 評估標準與資本對接樞紐。</p>
            <div className="flex -space-x-2">
              {[1, 2].map(i => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-slate-700 border border-slate-900"
                ></div>
              ))}
              <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-900 flex items-center justify-center text-[10px] text-white">
                +200
              </div>
            </div>
          </div>

          {/* Join Card */}
          <div
            onClick={() => navigate('/alliance')}
            className="bg-gradient-to-br from-blue-900/20 to-slate-900 border border-dashed border-blue-400/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-900/30 transition-colors group"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white mb-1">成為下一個節點</h3>
            <p className="text-blue-200/60 text-xs mb-3">加入善向聯盟，擴展您的影響力</p>
            <div className="text-blue-400 text-sm font-bold flex items-center gap-1">
              立即加入 <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
