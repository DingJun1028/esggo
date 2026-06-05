import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Fingerprint, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OmniAuthUniversal() {
  const [status, setStatus] = useState<'idle' | 'authenticating' | 'verifying_5T' | 'success'>('idle');
  const router = useRouter();

  const handleLogin = async () => {
    setStatus('authenticating');
    // Simulate backend call
    setTimeout(() => {
      setStatus('verifying_5T');
      // Simulate Proof Center verification
      setTimeout(() => {
        setStatus('success');
        setTimeout(() => router.push('/dashboard'), 1000);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#020617] rounded-3xl border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.15)] max-w-md w-full mx-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-indigo-500/10 pointer-events-none" />
      
      <div className="w-16 h-16 bg-black/40 border border-cyan-500/30 rounded-2xl flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 rounded-2xl bg-cyan-400/20 blur-xl" />
        {status === 'success' ? (
          <ShieldCheck size={32} className="text-emerald-400" />
        ) : status === 'verifying_5T' ? (
          <Activity size={32} className="text-cyan-400 animate-pulse" />
        ) : (
          <Lock size={32} className="text-slate-300" />
        )}
      </div>

      <h2 className="text-2xl font-black text-white tracking-wide uppercase mb-2">Omni Identity</h2>
      <p className="text-slate-400 text-sm mb-8 text-center leading-relaxed">
        通過 5T 誠信協議驗證您的主權身份<br/>
        <span className="text-[10px] text-cyan-500/70 uppercase tracking-widest font-mono mt-1 block">Zero Knowledge Proof Enabled</span>
      </p>

      <button 
        onClick={handleLogin}
        disabled={status !== 'idle'}
        className="w-full relative group overflow-hidden rounded-xl bg-white/5 border border-white/10 p-4 transition-all hover:bg-white/10 hover:border-cyan-500/30 active:scale-95"
      >
        <div className="absolute inset-0 w-0 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 transition-all duration-500 ease-out group-hover:w-full" />
        <div className="relative flex items-center justify-center gap-3">
          <Fingerprint size={20} className={status === 'idle' ? 'text-cyan-400' : 'text-slate-500'} />
          <span className="text-white font-bold tracking-widest">
            {status === 'idle' && '啟動神經連結登入'}
            {status === 'authenticating' && '身份核驗中...'}
            {status === 'verifying_5T' && '生成防竄改金鑰...'}
            {status === 'success' && '授權通過 (Trustworthy)'}
          </span>
        </div>
      </button>

      {status !== 'idle' && (
        <div className="mt-6 w-full flex flex-col gap-2">
          <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span>Protocol Check</span>
            <span className={status === 'success' ? 'text-emerald-400 font-bold' : 'text-cyan-400 animate-pulse'}>
              {status === 'success' ? 'Verified' : 'Processing'}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: status === 'authenticating' ? '40%' : status === 'verifying_5T' ? '80%' : '100%' }}
              className={`h-full ${status === 'success' ? 'bg-emerald-400' : 'bg-cyan-400'}`}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
