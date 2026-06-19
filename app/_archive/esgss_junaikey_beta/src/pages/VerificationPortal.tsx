import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Fingerprint,
  Map,
  Search,
  Cpu,
  Lock,
  ArrowLeft,
  Gem,
  Sparkles,
  Zap,
  Hash,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { junAiKeyAPI } from '../services/jun-ai-key-integration';
import { ImpactProof } from '../types/core';
import { originArchiveService } from '../services/OriginArchiveService';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

// Visual Configuration for Grades
type GradeTheme = { color: string; bg: string; shadow: string; border: string; title: string };
const GRADE_CONFIG: Record<string, GradeTheme> = {
  GOLD: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    shadow: 'drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]',
    border: 'border-amber-500/50',
    title: 'IMPERIAL GOLD',
  },
  PLATINUM: {
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20',
    shadow: 'drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]',
    border: 'border-cyan-500/50',
    title: 'CELESTIAL PLATINUM',
  },
  SOVEREIGN: {
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    shadow: 'drop-shadow-[0_0_25px_rgba(192,132,252,0.6)]',
    border: 'border-purple-500/50',
    title: 'SUPREME SOVEREIGN',
  },
};

const VerificationPortal = () => {
  const { uuid } = useParams();
  const [proof, setProof] = useState<ImpactProof | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifyingStep, setVerifyingStep] = useState(0);
  const [isCrystallized, setIsCrystallized] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const [sealing, setSealing] = useState(false);

  useEffect(() => {
    const verifyAsset = async () => {
      if (!uuid) return;
      try {
        // 1. Simulate Verification Steps
        for (let i = 0; i <= 5; i++) {
          setVerifyingStep(i);
          await new Promise(r => setTimeout(r, 800)); // Cinematic delay
        }

        // 2. Fetch Actual Proof (Simulated for Demo if API not ready, but we use API)
        // In a real scenario, we might fetch first then show animation.
        // For effect, we do animation then "reveal".
        const data = await junAiKeyAPI.verifyAsset(uuid);
        setProof(data);

        // 3. Crystallize
        setIsCrystallized(true);
      } catch (err) {
        omniLogger.error(LogCategory.SYSTEM, '[VerificationPortal] Verification failed', { error: err });
      } finally {
        setLoading(false);
      }
    };

    verifyAsset();
  }, [uuid]);

  // Celebration Effect
  useEffect(() => {
    if (isCrystallized && proof) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#fbbf24', '#22d3ee', '#c084fc'], // Gold, Cyan, Purple
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#fbbf24', '#22d3ee', '#c084fc'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isCrystallized, proof]);

  const getGradeTheme = (): GradeTheme => {
    const grade = (proof?.evidence?.tangible_manifest?.visual_grade ||
      'GOLD') as keyof typeof GRADE_CONFIG;
    return (GRADE_CONFIG[grade] || GRADE_CONFIG.GOLD) as GradeTheme;
  };

  if (loading && !proof) {
    // Initial Loading / Scanning UI
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 text-center space-y-8"
        >
          <div className="relative w-40 h-40 mx-auto">
            <div className="absolute inset-0 border-2 border-blue-500/10 rounded-full" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Fingerprint className="w-16 h-16 text-blue-500 animate-pulse" />
            </div>
          </div>
          <div className="space-y-4 max-w-md w-full mx-auto">
            {[
              'Tracing Source...',
              'Tracking Lifecycle...',
              'Calculating Formula...',
              'Materializing...',
              'Locking Integrity...',
            ].map((text, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5"
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${verifyingStep >= idx ? 'bg-blue-500 border-blue-400' : 'border-slate-700'}`}
                >
                  {verifyingStep > idx ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  )}
                </div>
                <span
                  className={`text-[11px] font-mono tracking-wider ${verifyingStep >= idx ? 'text-blue-300' : 'text-slate-600'}`}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (!proof) return null;
  const theme = getGradeTheme();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-8 backdrop-blur-xl bg-slate-950/70 sticky top-0 z-50">
        <Link
          to="/"
          className="flex items-center gap-3 text-slate-400 hover:text-white transition-all group"
        >
          <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Return Sanctuary</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              const element = document.getElementById('certification-content');
              if (!element) return;

              // Dynamically import to ensure client-side execution
              const html2canvas = (await import('html2canvas')).default;
              const jsPDF = (await import('jspdf')).default;

              const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#020617', // slate-950
              } as any);

              const imgData = canvas.toDataURL('image/png');
              const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
              });

              const imgWidth = 210;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;

              pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
              pdf.save(`ESG-Certificate-${uuid?.substring(0, 8)}.pdf`);
            }}
            className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded-lg transition-colors flex items-center gap-2"
            title="Download Certificate"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase hidden sm:inline">Download PDF</span>
          </button>
          {!isSealed ? (
            <button
              onClick={async () => {
                if (!uuid || !proof) return;
                setSealing(true);
                try {
                  const hash = await originArchiveService.archiveReport(uuid, proof);
                  await omniLogger.sovereignAudit('REPORT_SEALED_TO_ORIGIN', {
                    reportId: uuid,
                    originHash: hash,
                  });
                  setIsSealed(true);
                  confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#ffd700', '#ffffff'],
                  });
                } finally {
                  setSealing(false);
                }
              }}
              disabled={sealing}
              className={`p-2 rounded-lg transition-all flex items-center gap-2 ${sealing ? 'bg-slate-800 text-slate-500' : 'bg-amber-500/20 hover:bg-amber-500/40 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(247,202,24,0.2)]'}`}
            >
              <Lock className={`w-4 h-4 ${sealing ? 'animate-spin' : ''}`} />
              <span className="text-[10px] font-mono uppercase hidden sm:inline">
                {sealing ? 'Sealing...' : 'Seal to Origin'}
              </span>
            </button>
          ) : (
            <div className="p-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase">Origin Sealed</span>
            </div>
          )}
          <div className="text-right hidden sm:block">
            <span
              className={`block text-[10px] font-mono font-black uppercase tracking-widest ${theme.color}`}
            >
              Sentinel 5T Verified
            </span>
            <span className="text-[8px] text-slate-500 font-mono">
              HASH: {proof.evidence.hash_lock.substring(0, 16)}
            </span>
          </div>
          <div
            className={`w-2 h-10 ${theme.bg} rounded-full overflow-hidden flex flex-col justify-end`}
          >
            <div className={`h-full w-full ${theme.color.replace('text', 'bg')} animate-pulse`} />
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-8 py-16 space-y-16">
        {/* 1. HERO: CRYSTALLIZED ASSET */}
        <section className="flex flex-col md:flex-row items-center justify-center gap-12 text-center md:text-left">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="relative group"
          >
            <div
              className={`absolute inset-0 ${theme.color.replace('text', 'bg')}/20 blur-[80px] rounded-full animate-pulse`}
            />
            <div
              className={`relative p-8 bg-gradient-to-br from-white/5 to-white/0 rounded-[3rem] border ${theme.border} backdrop-blur-md`}
            >
              <Gem className={`w-32 h-32 ${theme.color} ${theme.shadow}`} />

              {/* QR Code Overlay (Hover) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 rounded-[3rem]">
                <div className="p-4 bg-white rounded-xl">
                  <QRCodeSVG
                    value={
                      proof.evidence.tangible_manifest?.qr_link || `https://nexus.esg/v/${uuid}`
                    }
                    size={100}
                  />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-slate-900 border border-white/10 rounded-full">
              <span className={`text-[10px] font-mono font-black tracking-widest ${theme.color}`}>
                {theme.title}
              </span>
            </div>
          </motion.div>

          <div className="space-y-4 max-w-lg">
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter italic">
              ASSET <span className={theme.color}>SECURED</span>
            </h1>
            <p className="text-slate-400 font-mono text-xs leading-relaxed">
              五德兼備，5T 存證。此數位資產已通過 4+1 協議驗收，完全符合晶粹化 (Crystallization)
              標準，具備不可篡改之信實度。
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2">
                <Fingerprint className="w-3 h-3 text-slate-500" />
                <span className="text-[10px] font-mono text-slate-300">
                  Auth: {proof.evidence.hash_lock.substring(0, 8)}...
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 5T PROTOCOL HUD */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Traceable', icon: Map, color: 'text-emerald-400', zh: '可溯源' },
            { label: 'Trackable', icon: Search, color: 'text-blue-400', zh: '可追蹤' },
            { label: 'Transparent', icon: Cpu, color: 'text-orange-400', zh: '可演算' },
            { label: 'Tangible', icon: Gem, color: 'text-purple-400', zh: '可感知' },
            { label: 'Trustworthy', icon: Lock, color: 'text-rose-400', zh: '不可篡改' },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="p-5 bg-white/5 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all text-center space-y-3 group"
            >
              <div
                className={`p-3 rounded-2xl bg-slate-950 inline-block shadow-inner group-hover:scale-110 transition-transform`}
              >
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs tracking-wider">{item.label}</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{item.zh}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* 3. SIX VIRTUES & DATA BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* A. Six Virtues Dashboard */}
          <div className="lg:col-span-2 bg-slate-900/40 rounded-[2.5rem] border border-white/10 p-10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="w-32 h-32" />
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-2xl">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">善向六德指標 (Six Virtues)</h3>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { key: 'intelligence', zh: '智', color: 'bg-blue-500' },
                { key: 'benevolence', zh: '仁', color: 'bg-emerald-500' },
                { key: 'integrity', zh: '誠', color: 'bg-rose-500' },
                { key: 'courage', zh: '勇', color: 'bg-orange-500' },
                { key: 'temperance', zh: '節', color: 'bg-indigo-500' },
                { key: 'harmony', zh: '和', color: 'bg-purple-500' },
              ].map(v => (
                <div key={v.key} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-white/50">{v.zh}</span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">
                        {v.key}
                      </span>
                    </div>
                    <span className="text-xl font-mono text-white font-black">
                      {(proof.virtues as any)[v.key]}
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(proof.virtues as any)[v.key] * 10}%` }}
                      transition={{ duration: 1.5, ease: 'circOut', delay: 1 }}
                      className={`h-full ${v.color} shadow-[0_0_15px_rgba(255,255,255,0.2)]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* B. Core Evidence Box */}
          <div className="bg-gradient-to-b from-slate-900/60 to-slate-950 rounded-[2.5rem] border border-white/10 p-10 space-y-8">
            <h4 className="text-[10px] font-mono uppercase text-slate-500 tracking-[0.3em]">
              Lifecycle Evidence
            </h4>

            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 font-mono uppercase">
                  Source Origin
                </label>
                <p className="text-sm font-bold text-blue-300">{proof.evidence.source_origin}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 font-mono uppercase">Tracking ID</label>
                <p className="text-xs font-mono text-slate-300">
                  {proof.evidence.lifecycle_hooks[0] || 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 font-mono uppercase">Verified At</label>
                <p className="text-xs font-mono text-slate-300">
                  {new Date(proof.verified_at).toLocaleString()}
                </p>
              </div>
              <div className="pt-6 border-t border-white/5">
                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-[10px] font-mono text-emerald-400 leading-tight">
                    Authenticity Guaranteed by 5T Protocol
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. TRANSPARENT LOGIC (Technical Section) */}
        <section className="bg-slate-950 rounded-[3rem] border-2 border-white/5 p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <Cpu className="w-64 h-64" />
          </div>
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Hash className="w-6 h-6 text-blue-500" />
              信實加密驗算 (Trustworthy Logic)
            </h3>
            <Fingerprint className="w-8 h-8 text-slate-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-[10px] uppercase text-slate-500 font-mono font-black tracking-[0.2em] flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                Transparent Algorithm
              </label>
              <div className="bg-black/40 p-6 rounded-3xl border border-white/10 font-mono text-sm text-orange-300/80 leading-relaxed">
                {proof.evidence.logic_formula}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase text-slate-500 font-mono font-black tracking-[0.2em] flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                Trustworthy Hash Lock
              </label>
              <div className="bg-black/40 p-6 rounded-3xl border border-white/10 font-mono text-[10px] text-rose-300/80 break-all">
                {proof.evidence.hash_lock}
              </div>
            </div>
          </div>

          <div className="mt-12 text-center opacity-40">
            <p className="text-[11px] font-mono tracking-widest">
              THE CRYSTALLIZED DATA IS FINAL. ANY ALTERATION WILL VOID THE 5T INTEGRITY SEAL.
            </p>
          </div>
        </section>

        {/* 5. FOOTER BRANDING */}
        <footer className="text-center py-20 border-t border-white/5">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              Impact Nexus / ESGss
            </span>
          </div>
          <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.5em]">
            System Epoch: Sentient-7.0 &copy; 2026
          </p>
        </footer>
      </main>
    </div>
  );
};

export default VerificationPortal;
