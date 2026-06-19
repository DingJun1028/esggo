'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-omni-bg text-omni-text-main selection:bg-omni-primary/30">
      {/* 🌌 Animated Background Core */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,color-mix(in_srgb,var(--theme-primary)_10%,transparent),transparent_70%)]" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-full h-full bg-omni-primary brightness-50 blur-[120px] rounded-full opacity-20"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* 🏛️ System Logo / Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-omni-text-main to-omni-text-muted drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            ESG GO
          </h1>
          <div className="h-1 w-24 bg-omni-accent mx-auto mt-4 blur-[1px] shadow-[0_0_10px_var(--theme-accent)]" />
          <h2 className="mt-4 text-2xl md:text-3xl tracking-[0.3em] font-black text-omni-primary uppercase drop-shadow-[0_0_10px_rgba(99,166,176,0.3)]">
            善向永續報告中心
          </h2>
          <p className="mt-4 text-omni-text-main text-sm md:text-base tracking-[0.2em] font-light">
            服務即教學，知識即資產
          </p>
        </motion.div>

        {/* 📜 Philosophy Wings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="max-w-2xl mb-12 space-y-4"
        >
          <p className="text-xl md:text-2xl font-light tracking-widest text-omni-primary italic mb-2">
            「服務即教學，知識即資產」
          </p>
          <p className="text-omni-text-muted text-sm md:text-base leading-relaxed">
            在這裡，我們不提供被動的工具，而是提供主動的進化。<br />
            以您的 ESG 知識需求為中心，透過 <span className="text-omni-accent font-semibold tracking-wider">5T 協議</span> 驗證，<br />
            將每一次的操作軌跡結晶為不滅的永恆知識資產。
          </p>
        </motion.div>

        {/* 🚀 Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Link
            href="/omni/onboarding"
            className="px-12 py-5 rounded-full bg-slate-900 border border-slate-700 text-white font-black uppercase tracking-[0.3em] text-sm hover:scale-110 hover:shadow-[0_0_50px_var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:border-[var(--theme-primary)] transition-all inline-block group"
          >
            <span className="flex items-center gap-3">
              建立初次共鳴 · Begin Resonance
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                →
              </motion.span>
            </span>
          </Link>
        </motion.div>

        {/* 🏛️ Philosophy Footer */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-around px-4 opacity-70 text-[10px] md:text-xs tracking-[0.3em] uppercase">
          <span className="text-omni-text-muted">自然共鳴律 (Resonance)</span>
          <span className="text-omni-accent font-bold">5T Protocol</span>
          <span className="text-omni-text-muted">誠信閉環律 (Integrity)</span>
        </div>
      </div>
    </main>
  );
}
