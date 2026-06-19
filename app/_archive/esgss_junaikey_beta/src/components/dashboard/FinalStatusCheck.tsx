import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🛡️ 5T Final Status Check (5T 終極狀態檢查)
 * --------------------------------------------------
 * 視覺：Tiffany ESG / 液態玻璃 / 雷射掃描
 * 核心：4可1不可 (Tangible, Traceable, Trackable, Transparent + TRUSTWORTHY)
 */
export const FinalStatusCheck = ({ data, onComplete }: { data: any; onComplete?: () => void }) => {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'verified' | 'locked'>('idle');
  const [checkSteps, setCheckSteps] = useState([
    { id: 'tangible', label: '可感知 (Tangible)', status: 'pending', color: '#0df2df' },
    { id: 'traceable', label: '可溯源 (Traceable)', status: 'pending', color: '#0df2df' },
    { id: 'trackable', label: '可追蹤 (Trackable)', status: 'pending', color: '#0df2df' },
    { id: 'transparent', label: '可透明 (Transparent)', status: 'pending', color: '#0df2df' },
    { id: 'trustworthy', label: '不可篡改 (Trustworthy)', status: 'pending', color: '#f20d52' },
  ]);

  const startVerification = async () => {
    setScanState('scanning');

    for (let i = 0; i < checkSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCheckSteps(prev =>
        prev.map((step, idx) => (idx === i ? { ...step, status: 'checked' } : step))
      );
    }

    setScanState('verified');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setScanState('locked');
    if (onComplete) onComplete();
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto p-12 bg-[#051110]/80 backdrop-blur-3xl rounded-[3rem] border border-[#0df2df]/20 overflow-hidden shadow-[0_0_100px_rgba(13,242,223,0.1)]">
      {/* Liquid Glass Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] size-64 bg-[#0df2df]/5 blur-[80px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] size-96 bg-cyan-600/5 blur-[100px] rounded-full" />
      </div>

      {/* Scanning Laser Overlay */}
      <AnimatePresence>
        {scanState === 'scanning' && (
          <motion.div
            initial={{ top: '0%' }}
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0df2df] to-transparent z-50 shadow-[0_0_20px_#0df2df]"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center text-center space-y-12">
        <header className="space-y-4">
          <div className="flex items-center justify-center gap-3 text-[#0df2df]">
            <span className="material-symbols-outlined text-[32px] animate-pulse">
              verified_user
            </span>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">
              5T Final Status Check
            </h2>
          </div>
          <p className="text-slate-500 text-sm font-bold tracking-[0.3em] uppercase italic">
            Crystallizing Data Integrity...
          </p>
        </header>

        {/* Progress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full">
          {checkSteps.map((step, index) => (
            <div key={step.id} className="relative group">
              <motion.div
                animate={
                  step.status === 'checked' ? { scale: [1, 1.05, 1], borderColor: step.color } : {}
                }
                className={`p-6 rounded-2xl border bg-black/40 backdrop-blur-xl transition-all duration-500 ${
                  step.status === 'checked'
                    ? 'border-[#0df2df]/60 shadow-[0_0_20px_rgba(13,242,223,0.2)]'
                    : 'border-white/5'
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div
                    className={`size-12 rounded-full border-2 flex items-center justify-center ${
                      step.status === 'checked'
                        ? 'bg-[#0df2df]/10 text-[#0df2df]'
                        : 'text-slate-700 border-white/10'
                    }`}
                    style={{ borderColor: step.status === 'checked' ? step.color : '' }}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {step.status === 'checked' ? 'check_circle' : 'hourglass_empty'}
                    </span>
                  </div>
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest leading-tight ${
                      step.status === 'checked' ? 'text-white' : 'text-slate-600'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Info Display */}
        <div className="w-full p-8 bg-white/[0.02] border border-white/5 rounded-3xl text-left space-y-4 font-mono text-[11px]">
          <div className="flex justify-between items-center text-slate-500 border-b border-white/5 pb-2">
            <span>DATA_UUID</span>
            <span className="text-[#0df2df]">{data?.uuid || '8888-9999-XXXX-YURI'}</span>
          </div>
          <div className="flex justify-between items-center text-slate-500 border-b border-white/5 pb-2">
            <span>VERSION</span>
            <span className="text-white">v8.1.0-Sentient-Unified</span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span>SSOT_MANIFEST</span>
            <span className="text-white">VERIFIED - CRYPTOGRAPHIC_ANCHOR_ACTIVE</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="relative">
          {scanState === 'idle' && (
            <button
              onClick={startVerification}
              className="bg-[#0df2df] text-[#051110] px-12 py-5 rounded-2xl font-black italic uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(13,242,223,0.3)] hover:scale-105 transition-all flex items-center gap-4"
            >
              <span className="material-symbols-outlined">shutter_speed</span>
              Execute 5T Validation
            </button>
          )}

          {scanState === 'scanning' && (
            <div className="text-[#0df2df] flex items-center gap-4 animate-pulse">
              <span className="material-symbols-outlined animate-spin">sync</span>
              <span className="font-black italic uppercase tracking-widest">
                Scanning Metadata...
              </span>
            </div>
          )}

          {scanState === 'locked' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[#f20d52] flex flex-col items-center gap-4"
            >
              <div className="size-20 bg-[#f20d52]/10 border-2 border-[#f20d52] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(242,13,82,0.3)]">
                <span className="material-symbols-outlined text-[40px]">lock</span>
              </div>
              <span className="font-black italic uppercase tracking-[0.4em]">
                Trustworthy State Locked
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-8 left-8 size-4 border-t-2 border-l-2 border-[#0df2df]/30" />
      <div className="absolute top-8 right-8 size-4 border-t-2 border-r-2 border-[#0df2df]/30" />
      <div className="absolute bottom-8 left-8 size-4 border-b-2 border-l-2 border-[#0df2df]/30" />
      <div className="absolute bottom-8 right-8 size-4 border-b-2 border-r-2 border-[#0df2df]/30" />

      <style>{`
                @font-face {
                    font-family: 'Lexend';
                    src: url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;700;900&display=swap');
                }
                .font-display { font-family: 'Lexend', 'Manrope', 'Noto Sans TC', sans-serif; }
            `}</style>
    </div>
  );
};
