'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import { Lock, Mail, Activity, AlertCircle, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [developerPassword, setDeveloperPassword] = useState('');
  const [showDeveloperPasswordInput, setShowDeveloperPasswordInput] = useState(false);
  const router = useRouter();

  const handleDeveloperLogin = async () => {
    setStatus('loading');
    setErrorMessage('');

    if (developerPassword === 'sunshine888') {
      setStatus('success');
      localStorage.setItem('omni_user', JSON.stringify({
        email: 'dev_sunshine@omnicore.com',
        company_id: 'dev_sunshine_company',
        id: 'dev_sunshine_123'
      }));
      router.push('/dashboard');
      router.refresh();
    } else {
      setStatus('error');
      setErrorMessage('開發者密碼錯誤，請重試。');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Handle Supabase Sign In
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
      return;
    }

    setStatus('success');

    // Simulate setting legacy omni_user for compatibility with useAuth.tsx and ClientLayout
    if (data && data.user) {
      localStorage.setItem('omni_user', JSON.stringify({
        email: data.user.email,
        company_id: data.user.user_metadata?.company_id || 'default',
        id: data.user.id
      }));
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">
      {/* Liquid Glass Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-md p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-xl relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent rounded-[2rem] pointer-events-none" />
        
        <div className="text-center mb-8 relative">
          <div className="mx-auto w-16 h-16 bg-black/40 border border-cyan-500/30 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-cyan-400/20 blur-xl" />
            <Fingerprint size={32} className="text-cyan-400 relative z-10" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">
            Omni System
          </h1>
          <p className="text-slate-400 text-sm mt-2 tracking-wide">
            ESG GO 5T Trust Protocol Enforcer
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="識別位址 (Email)" 
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all backdrop-blur-sm"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="存取金鑰 (Password)" 
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all backdrop-blur-sm"
              />
            </div>
          </div>

          {status === 'error' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <AlertCircle size={16} />
              <p>{errorMessage}</p>
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full relative group overflow-hidden rounded-xl bg-white/5 border border-white/10 p-4 transition-all hover:bg-white/10 hover:border-cyan-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 w-0 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 transition-all duration-500 ease-out group-hover:w-full" />
            <div className="relative flex items-center justify-center gap-3">
              {status === 'loading' ? (
                <Activity size={20} className="text-cyan-400 animate-pulse" />
              ) : (
                <Lock size={20} className="text-cyan-400" />
              )}
              <span className="text-white font-bold tracking-widest uppercase">
                {status === 'loading' ? 'Authenticating...' : 'Secure Login'}
              </span>
            </div>
          </button>

          {process.env.NODE_ENV === 'development' && (
            <>
              {showDeveloperPasswordInput ? (
                <div className="space-y-4">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-400 transition-colors" size={20} />
                    <input 
                      type="password" 
                      required
                      value={developerPassword}
                      onChange={(e) => setDeveloperPassword(e.target.value)}
                      placeholder="開發者密碼 (sunshine888)" 
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all backdrop-blur-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleDeveloperLogin}
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full relative overflow-hidden rounded-xl bg-purple-500/10 border border-purple-500/30 p-3 transition-all hover:bg-purple-500/20 active:scale-95 disabled:opacity-50"
                  >
                    <div className="relative flex items-center justify-center gap-2">
                      <Fingerprint size={16} className="text-purple-400" />
                      <span className="text-purple-300 font-bold tracking-wider uppercase text-sm">
                        確認開發者身份
                      </span>
                    </div>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeveloperPasswordInput(true)}
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full mt-2 relative overflow-hidden rounded-xl bg-indigo-500/10 border border-indigo-500/30 p-3 transition-all hover:bg-indigo-500/20 active:scale-95 disabled:opacity-50"
                >
                  <div className="relative flex items-center justify-center gap-2">
                    <Activity size={16} className="text-indigo-400" />
                    <span className="text-indigo-300 font-bold tracking-wider uppercase text-sm">
                      開發者專用通道
                    </span>
                  </div>
                </button>
              )}
            </>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
            Secured by Zero Knowledge Proof & 5T Protocol
          </p>
        </div>
      </motion.div>
    </div>
  );
}
