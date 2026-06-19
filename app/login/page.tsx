'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Fingerprint, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@esggo.com');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const enterDemo = () => {
    localStorage.setItem('omni_user', JSON.stringify({
      email: 'demo@esggo.com',
      company_id: 'esg-sunshine',
      id: 'demo_user_001',
      role: 'superadmin',
    }));
    router.push('/dashboard');
    router.refresh();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    // Demo mode bypass — works without Supabase
    await new Promise((r) => setTimeout(r, 600));
    localStorage.setItem('omni_user', JSON.stringify({
      email: email || 'admin@esggo.com',
      company_id: 'esg-sunshine',
      id: 'user_001',
      role: 'superadmin',
    }));
    setStatus('success');
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-100/40 rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-100/30 rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-[#003262] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Fingerprint size={32} className="text-[#FDB515]" />
          </div>
          <h2 className="text-2xl font-black text-[#003262] tracking-tight">ESGGO 善向永續</h2>
          <p className="text-sm text-slate-400 mt-1">5T Trust Protocol · 真善美信通</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 space-y-4">
          {/* Demo Entry — primary CTA */}
          <button
            onClick={enterDemo}
            className="w-full py-3.5 bg-[#003262] text-white font-bold rounded-xl hover:bg-[#002850] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 text-base"
          >
            <ShieldCheck size={20} />
            進入 ESGGO 展示平台
            <ArrowRight size={18} />
          </button>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-4 text-xs text-slate-400">或登入帳號</span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            {status === 'error' && errorMsg && (
              <p className="text-xs text-rose-500 bg-rose-50 p-2 rounded-lg">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all disabled:opacity-50 text-sm"
            >
              {status === 'loading' ? '登入中...' : 'Secure Login'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[10px] text-slate-400 font-mono">
          Secured by 5T Protocol · 真善美信通
        </p>
      </motion.div>
    </div>
  );
}
