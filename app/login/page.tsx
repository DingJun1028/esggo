'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Lock, Mail, ArrowRight, Fingerprint, ShieldCheck, AlertCircle } from 'lucide-react';

type AuthMode = 'checking' | 'supabase' | 'demo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [mode, setMode] = useState<AuthMode>('checking');
  const router = useRouter();

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const isPlaceholder = url.includes('placeholder') || key.includes('placeholder') || !url || !key;
    setMode(isPlaceholder ? 'demo' : 'supabase');
  }, []);

  useEffect(() => {
    if (mode === 'supabase') {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          router.push('/dashboard');
          router.refresh();
        }
      });
    } else if (mode === 'demo') {
      if (localStorage.getItem('omni_user')) {
        router.push('/dashboard');
        router.refresh();
      }
    }
  }, [mode, router]);

  const enterDemo = () => {
    localStorage.setItem('omni_user', JSON.stringify({
      email: 'demo@esggo.com',
      company_id: 'esg-sunshine',
      id: 'demo_user_001',
      role: 'superadmin',
      demo: true,
    }));
    document.cookie = 'omni_demo_session=true; path=/; max-age=86400; SameSite=Lax';
    router.push('/dashboard');
    router.refresh();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    if (mode === 'demo') {
      if (!email.trim()) {
        setErrorMsg('請輸入 Email');
        setStatus('error');
        return;
      }
      if (!password.trim()) {
        setErrorMsg('請輸入密碼');
        setStatus('error');
        return;
      }
      await new Promise(r => setTimeout(r, 400));
      localStorage.setItem('omni_user', JSON.stringify({
        email: email.trim(),
        company_id: 'esg-sunshine',
        id: 'demo_user_' + Date.now(),
        role: 'superadmin',
        demo: true,
      }));
      document.cookie = 'omni_demo_session=true; path=/; max-age=86400; SameSite=Lax';
      setStatus('success');
      router.push('/dashboard');
      router.refresh();
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setStatus('error');
      if (error.message.includes('Invalid login credentials')) {
        setErrorMsg('Email 或密碼錯誤');
      } else if (error.message.includes('Email not confirmed')) {
        setErrorMsg('Email 尚未驗證，請檢查您的信箱');
      } else {
        setErrorMsg('登入失敗：' + error.message);
      }
      return;
    }

    if (data.user) {
      setStatus('success');
      localStorage.setItem('omni_user', JSON.stringify({
        email: data.user.email,
        id: data.user.id,
        role: data.user.role || 'authenticated',
        company_id: data.user.user_metadata?.company_id || 'default',
      }));
      router.push('/dashboard');
      router.refresh();
    }
  };

  if (mode === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-slate-400 text-sm animate-pulse">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-100/40 rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-100/30 rounded-full" />
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-[#003262] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Fingerprint size={32} className="text-[#FDB515]" />
          </div>
          <h2 className="text-2xl font-black text-[#003262] tracking-tight">ESGGO 善向永續</h2>
          <p className="text-sm text-slate-400 mt-1">5T Trust Protocol · 真善美信通</p>
          {mode === 'demo' && (
            <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs px-3 py-1 rounded-full border border-amber-200">
              <AlertCircle size={12} />
              展示模式 — Supabase 尚未配置
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 space-y-4">
          {mode === 'demo' && (
            <>
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
                <span className="flex-shrink mx-4 text-xs text-slate-400">或自訂登入</span>
                <div className="flex-grow border-t border-slate-200" />
              </div>
            </>
          )}

          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                autoComplete="email"
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
                required
                autoComplete={mode === 'supabase' ? 'current-password' : 'off'}
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
              {status === 'loading' ? '登入中...' : mode === 'supabase' ? 'Secure Login' : '展示登入'}
            </button>
          </form>

          {mode === 'supabase' && (
            <p className="text-center">
              <a href="/forgot-password" className="text-xs text-cyan-600 hover:underline">
                忘記密碼？
              </a>
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-[10px] text-slate-400 font-mono">
          Secured by 5T Protocol · 真善美信通
        </p>
      </div>
    </div>
  );
}
