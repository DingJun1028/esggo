'use client';

import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { IComponentCore } from '@/core/gov/IComponentCore';
import { Zap, Globe, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignIn() {
  const coreContext: IComponentCore = {
    uuid: 'auth-signin-core',
    version: '1.2.0',
    timestamp: Date.now(),
    evidence: []
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050C14] text-white selection:bg-aqua/30">
      {/* 🌌 Deep Space Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.05)_0%,transparent_70%)]" />

        {/* Floating Resonance Blobs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-omni-primary/10 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-omni-accent/10 blur-[100px] rounded-full"
        />

        {/* Ether Particles (Scanlines / Grid) */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
        <div className="scan-line opacity-20" />
      </div>

      {/* 🛸 Liquid Glass Login Interface */}
      <div className="relative z-10 w-full max-w-[440px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <LiquidGlassContainer coreContext={coreContext} stitchId="signin-card" className="border-white/10 shadow-2xl backdrop-blur-3xl">
            <div className="flex flex-col items-center text-center">
              {/* 4D Metallic Logo Section */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="mb-8 relative group"
              >
                <div className="absolute inset-0 bg-aqua/40 blur-3xl opacity-20 group-hover:opacity-60 transition-opacity" />
                <div className="size-20 bg-gradient-to-br from-white to-aqua/40 rounded-2xl flex items-center justify-center relative z-10 border border-white/20 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
                  <Zap size={40} className="text-black group-hover:animate-pulse" />
                </div>
              </motion.div>

              <h1 className="text-4xl font-black tracking-tighter mb-2 italic">
                ESG GO <span className="text-aqua primary-glow">善向永續報告中心</span>
              </h1>
              <p className="text-[10px] font-black tracking-[0.5em] uppercase text-white/40 mb-10">
                Resonate with Truth · Forge your Legacy
              </p>

              <div className="w-full space-y-4">
                {/* Prismatic Google Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => signIn('google', { callbackUrl: '/omni' })}
                  className="w-full relative group overflow-hidden rounded-full p-[1px] bg-gradient-to-r from-aqua/50 via-omni-accent/50 to-aqua/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-aqua via-omni-accent to-aqua opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-500" />
                  <div className="relative bg-[#050C14] hover:bg-black/40 rounded-full py-4 px-6 flex items-center justify-center gap-3 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="text-sm font-black tracking-widest uppercase">進入永恒共鳴 Sign In</span>
                  </div>
                </motion.button>

                <div className="pt-6 flex items-center justify-center gap-6 opacity-30">
                  <ShieldCheck size={20} className="hover:text-aqua transition-colors cursor-help" />
                  <Globe size={20} className="hover:text-aqua transition-colors cursor-help" />
                  <Sparkles size={20} className="hover:text-aqua transition-colors cursor-help" />
                </div>
              </div>
            </div>
          </LiquidGlassContainer>

          <p className="mt-12 text-center space-y-3">
            <Link
              href="/auth/signup"
              className="block text-[10px] font-black tracking-widest uppercase text-white/40 hover:text-aqua transition-colors"
            >
              尚未加入？引導加入 →
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-white/40 hover:text-aqua transition-colors group"
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
              返回終端 Back to Terminal
            </Link>
          </p>
        </motion.div>
      </div>

      {/* 📡 Peripheral Decorations */}
      <div className="absolute bottom-8 left-8 hidden md:block">
        <div className="text-[10px] font-mono text-white/20 space-y-1">
          <p>SYSTEM: ESG GO 善向永續報告中心 CORE</p>
          <p>PROTOCOL: LIQUID GLASS 4.0</p>
          <p>STATUS: AWAITING RESONANCE</p>
        </div>
      </div>
      <div className="absolute top-8 right-8 hidden md:block">
        <div className="text-[10px] font-mono text-white/20 text-right">
          <p>EST. 2026</p>
          <p>DINGJUN × AI COLLAB</p>
        </div>
      </div>
    </main>
  );
}
