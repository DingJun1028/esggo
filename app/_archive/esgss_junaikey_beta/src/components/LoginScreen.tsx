import React, { useState, useEffect, useRef } from 'react';
import { Language } from '@/types';

// Decentralized Scattered Design - Login Screen
export const LoginScreen = ({
  onLogin,
  language = 'zh-TW',
}: {
  onLogin: () => void;
  language?: Language;
}) => {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isZh = language === 'zh-TW';

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        // Normalize to -1 to 1
        const x = (clientX / innerWidth) * 2 - 1;
        const y = (clientY / innerHeight) * 2 - 1;
        setMousePos({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Parallax helper
  const transformStyle = (depth: number) => ({
    transform: `translate(${mousePos.x * depth * 20}px, ${mousePos.y * depth * 20}px)`,
    transition: 'transform 0.1s ease-out',
  });

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden p-8 perspective-1000"
    >
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF]/50 to-transparent animate-scan-line" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-scan-line-reverse" />
      </div>

      {/* 隨機分佈的光點 - Parallax Enabled */}
      {[...Array(15)].map((_, i) => {
        const depth = Math.random() * 2 + 1; // 1 to 3
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white/20 animate-pulse-variable"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              ...transformStyle(depth),
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        );
      })}

      {/* 去中心化網格佈局 */}
      <div
        className={`relative z-10 min-h-screen grid grid-cols-12 gap-4 transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* 左上角 - Logo球體 - High Depth Parallax */}
        <div
          className="col-span-4 row-span-2 flex items-start justify-start pt-8"
          style={transformStyle(2)}
        >
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-3xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-500">
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#00FFFF]/20 to-purple-500/20 animate-spin-slow" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                  💎
                </span>
              </div>
            </div>
            {/* Orbiting ring */}
            <div className="absolute inset-[-10px] rounded-full border border-white/10 border-t-[#00FFFF]/50 animate-spin-reverse-slow pointer-events-none" />
          </div>
        </div>

        {/* 右上角 - 標題 - Medium Depth */}
        <div
          className="col-span-8 row-span-1 flex items-start justify-end pt-12 pr-8"
          style={transformStyle(1)}
        >
          <div className="text-right">
            <h1 className="text-7xl font-thin tracking-[0.2em] bg-gradient-to-l from-white via-[#00FFFF]/20 to-white/60 bg-clip-text text-transparent mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              ESGss
            </h1>
            <p className="text-2xl font-extralight text-white/60 tracking-[0.3em] uppercase">
              JunAiKey
            </p>
          </div>
        </div>

        {/* 中央左側 - 副標題 */}
        <div
          className="col-span-5 col-start-2 row-start-3 flex items-center"
          style={transformStyle(1.5)}
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-full px-8 py-4 shadow-[0_0_30px_rgba(0,255,255,0.1)] hover:bg-white/10 transition-all duration-500">
            <p className="text-white/80 text-sm font-light tracking-[0.3em] uppercase">
              {isZh ? '善向紀元 · 啟動' : 'OMNI ERA · START'}
            </p>
          </div>
        </div>

        {/* 中央偏右 - 第二副標題 */}
        <div
          className="col-span-5 col-start-7 row-start-4 flex items-center justify-end"
          style={transformStyle(1.2)}
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-full px-8 py-4 shadow-[0_0_30px_rgba(168,85,247,0.1)] hover:bg-white/10 transition-all duration-500">
            <p className="text-white/80 text-sm font-light tracking-[0.3em] uppercase">
              {isZh ? 'AI 賦能 · 進化' : 'AI EMPOWERED · EVOLVE'}
            </p>
          </div>
        </div>

        {/* 左下區域 - 主按鈕 - Stable Depth */}
        <div className="col-span-6 col-start-1 row-start-6 flex items-center z-20">
          <button
            onClick={onLogin}
            className="group relative w-full rounded-[28px] overflow-hidden hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/20 via-blue-500/20 to-purple-500/20 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-[1px] bg-slate-950/90 rounded-[27px] backdrop-blur-xl" />

            {/* Button Shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            <div className="relative px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#00FFFF] shadow-[0_0_10px_rgba(0,255,255,0.8)] animate-pulse" />
                <span className="text-xl font-light tracking-[0.4em] text-white group-hover:text-[#00FFFF]/80 transition-colors">
                  {isZh ? '啟動系統' : 'LAUNCH SYSTEM'}
                </span>
              </div>
              <span className="text-2xl text-white/50 group-hover:text-white transition-colors group-hover:translate-x-2 duration-300">
                →
              </span>
            </div>
          </button>
        </div>

        {/* Floating Cards - Variable Parallax */}
        <div
          className="col-span-3 col-start-8 row-start-5 flex items-center"
          style={transformStyle(0.8)}
        >
          <GlassCard label={isZh ? 'AI 智能' : 'Intelligence'} color="cyan" />
        </div>

        <div
          className="col-span-3 col-start-10 row-start-6 flex items-end"
          style={transformStyle(1.1)}
        >
          <GlassCard label={isZh ? 'ESG 管理' : 'Management'} color="emerald" />
        </div>

        <div
          className="col-span-3 col-start-3 row-start-8 flex items-center"
          style={transformStyle(0.9)}
        >
          <GlassCard label={isZh ? '數據分析' : 'Analytics'} color="purple" />
        </div>

        <div
          className="col-span-3 col-start-7 row-start-8 flex items-center justify-end"
          style={transformStyle(1.3)}
        >
          <GlassCard label={isZh ? '區塊鏈' : 'Blockchain'} color="blue" />
        </div>

        {/* 底部左側 - 版本號 */}
        <div className="col-span-4 col-start-1 row-start-11 flex items-end pb-4">
          <div className="flex items-center gap-4 text-white/30 text-[10px] tracking-[0.3em] font-light">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
            <span>{isZh ? '系統版本 5.0.0' : 'VERSION 5.0.0'}</span>
          </div>
        </div>

        {/* 底部右側 - 版權 */}
        <div className="col-span-8 col-start-5 row-start-11 flex items-end justify-end pb-4 pr-4">
          <p className="text-white/20 text-[10px] tracking-[0.2em] font-light">
            {isZh
              ? '© 2026 ESGss 善向永續系統 · 強化版'
              : '© 2026 ESGss JunAiKey System · ENHANCED'}
          </p>
        </div>

        {/* 裝飾線 - Static reference point */}
        <div className="col-span-1 col-start-1 row-start-4 row-span-2 flex items-center opacity-30">
          <div className="h-32 w-[1px] bg-gradient-to-b from-transparent via-white to-transparent" />
        </div>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        @keyframes scan-line {
            0% { transform: translateX(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes spin-slow {
            to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-slow {
            to { transform: rotate(-360deg); }
        }
        .animate-scan-line { animation: scan-line 8s linear infinite; }
        .animate-scan-line-reverse { animation: scan-line 6s linear infinite reverse; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-reverse-slow { animation: spin-reverse-slow 25s linear infinite; }
        .animate-pulse-variable { animation: pulse 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

// Reusable Glass Card Component
const GlassCard = ({
  label,
  color,
}: {
  label: string;
  color: 'cyan' | 'emerald' | 'purple' | 'blue';
}) => {
  const colorClasses = {
    cyan: 'from-[#00FFFF]/20 to-[#00FFFF]/5 hover:border-[#00FFFF]/40',
    emerald: 'from-emerald-400/20 to-emerald-400/5 hover:border-emerald-400/40',
    purple: 'from-purple-400/20 to-purple-400/5 hover:border-purple-400/40',
    blue: 'from-blue-400/20 to-blue-400/5 hover:border-blue-400/40',
  };

  return (
    <div
      className={`w-full backdrop-blur-xl bg-gradient-to-br ${colorClasses[color]} rounded-2xl border border-white/10 px-6 py-5 transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-1 group`}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
      <p className="relative z-10 text-sm font-light text-white/70 tracking-[0.2em] text-center group-hover:text-white transition-colors">
        {label}
      </p>
    </div>
  );
};
