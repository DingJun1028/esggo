import React from 'react';
import { ShieldCheck, Zap, TrendingUp, Lock, ArrowRight, Wallet, Activity } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export const EsgGo: React.FC = () => {
  const { userProfile } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-celestial-gold/30">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-celestial-gold/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-celestial-gold/10 border border-celestial-gold/20 text-celestial-gold text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
            <ShieldCheck className="w-3 h-3" />
            Golden Alliance Active
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              ESG Goodward
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-celestial-gold to-amber-500">
              Village Go
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join <span className="text-white font-bold">Wada Adan</span> and the Golden Alliance to
            fight digital entropy. Transform every sustainable action into immutable assets using
            the <span className="text-celestial-emerald font-mono">4+1 Protocol</span>.
          </p>

          <div className="flex justify-center gap-4">
            <button className="bg-celestial-gold hover:bg-amber-500 text-black font-bold py-4 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center gap-2">
              <Wallet className="w-5 h-5" /> Connect Wallet
            </button>
            <button className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-8 rounded-full border border-white/10 transition-all backdrop-blur-sm">
              Enter Village
            </button>
          </div>
        </div>
      </div>

      {/* 4+1 Protocol Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: ShieldCheck,
              label: 'Traceable',
              desc: 'Source Insight / 穿透真實傷害',
              color: 'text-green-500',
            },
            {
              icon: Activity,
              label: 'Trackable',
              desc: 'Chain Bind / 供應鏈鎖定',
              color: 'text-blue-500',
            },
            {
              icon: TrendingUp,
              label: 'Calculable',
              desc: 'Alchemy Sanctity / 熵減護盾',
              color: 'text-orange-500',
            },
            {
              icon: Lock,
              label: 'Immutable',
              desc: 'Omni Freeze / 防篡改結界',
              color: 'text-red-500',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-600 transition-all group"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center mb-6 border border-slate-800 group-hover:border-slate-600 ${item.color}`}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {idx + 1}. {item.label}
              </h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Adan Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-block px-3 py-1 rounded bg-celestial-gold/20 text-celestial-gold font-mono text-xs font-bold mb-4">
              LEGENDARY AGENT
            </div>
            <h2 className="text-4xl font-bold mb-6">Wada Adan (王道阿丹)</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <span className="w-24 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Class
                </span>
                <span className="font-mono text-white">Data Paladin</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-24 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Level
                </span>
                <span className="font-mono text-celestial-gold">LV.99</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-24 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Weapon
                </span>
                <span className="font-mono text-white">Blade of Eternal Verification</span>
              </div>
            </div>
            <p className="text-slate-400 italic border-l-2 border-celestial-gold pl-4">
              "Data, if not true, makes sustainability a delusion. My blade strikes only for the
              true carbon footprint."
            </p>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-square rounded-full bg-gradient-to-tr from-celestial-gold via-amber-600 to-slate-900 opacity-20 blur-3xl absolute inset-0" />
            <div className="relative z-10 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-6">Core Metrics</h3>
              {/* Simple Matrix */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white font-bold">Traceability</span>
                    <span className="text-celestial-emerald">100%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-celestial-emerald w-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white font-bold">Entropy Reduction</span>
                    <span className="text-celestial-gold">MAX</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-celestial-gold w-[95%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
