'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Lock, Mail, ArrowRight, Fingerprint, ShieldCheck, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react';

type AuthMode = 'checking' | 'supabase' | 'demo';
type LoginField = 'email' | 'password';

interface FieldError {
  email?: string;
  password?: string;
}

const SUPABASE_ERROR_MAP: Record<string, string> = {
  'Invalid login credentials': 'Email 或密碼錯誤',
  'Email not confirmed': 'Email 尚未驗證，請檢查您的信箱',
  'User not found': '找不到此使用者',
  'Invalid email': 'Email 格式不正確',
  'Password should be at least 6 characters': '密碼至少需要 6 個字元',
  'Unable to validate email address: invalid format': 'Email 格式不正確',
  'For security purposes, you can only request this once every 60 seconds': '請稍後再試（60 秒限制）',
  'signup is disabled': '目前不開放註冊',
  'rate limit exceeded': '請求過於頻繁，請稍後再試',
};

function mapSupabaseError(message: string): string {
  for (const [key, value] of Object.entries(SUPABASE_ERROR_MAP)) {
    if (message.toLowerCase().includes(key.toLowerCase())) return value;
  }
  return `登入失敗：${message}`;
}

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return '請輸入 Email';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Email 格式不正確';
  return undefined;
}

function validatePassword(password: string, isSupabase: boolean): string | undefined {
  if (!password) return '請輸入密碼';
  if (isSupabase && password.length < 6) return '密碼至少需要 6 個字元';
  return undefined;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [touched, setTouched] = useState<Record<LoginField, boolean>>({ email: false, password: false });
  const [mode, setMode] = useState<AuthMode>('checking');
  const router = useRouter();

  // 偵測 Supabase 配置
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const isPlaceholder = url.includes('placeholder') || key.includes('placeholder') || !url || !key;
    setMode(isPlaceholder ? 'demo' : 'supabase');
  }, []);

  // 已登入自動跳轉
  useEffect(() => {
    if (mode === 'supabase') {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) { router.push('/dashboard'); router.refresh(); }
      });
    } else if (mode === 'demo') {
      if (localStorage.getItem('omni_user')) { router.push('/dashboard'); router.refresh(); }
    }
  }, [mode, router]);

  // 即時欄位驗證
  const validateField = useCallback((field: LoginField, value: string) => {
    const error = field === 'email' ? validateEmail(value) : validatePassword(value, mode === 'supabase');
    setFieldErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  }, [mode]);

  const handleBlur = (field: LoginField) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, field === 'email' ? email : password);
  };

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
    setErrorMsg('');
    setSuccessMsg('');

    // 欄位驗證
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password, mode === 'supabase');
    setFieldErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });

    if (emailError || passwordError) {
      setStatus('error');
      setErrorMsg(emailError || passwordError || '請檢查輸入欄位');
      return;
    }

    setStatus('loading');

    if (mode === 'demo') {
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
      setSuccessMsg('展示登入成功！正在跳轉...');
      setTimeout(() => { router.push('/dashboard'); router.refresh(); }, 800);
      return;
    }

    // Supabase 登入
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setStatus('error');
        setErrorMsg(mapSupabaseError(error.message));
        return;
      }

      if (data.user) {
        setStatus('success');
        setSuccessMsg('登入成功！正在跳轉...');
        localStorage.setItem('omni_user', JSON.stringify({
          email: data.user.email,
          id: data.user.id,
          role: data.user.role || 'authenticated',
          company_id: data.user.user_metadata?.company_id || 'default',
        }));
        setTimeout(() => { router.push('/dashboard'); router.refresh(); }, 800);
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMsg('網路錯誤，請檢查連線後再試');
    }
  };

  if (mode === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Loader2 size={16} className="animate-spin" />
          載入中...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden px-4">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-100/40 rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-100/30 rounded-full" />
      </div>

      <div className="z-10 w-full max-w-md">
        {/* Logo */}
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

        {/* 登入卡片 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 space-y-4">
          {/* Demo 模式：快速進入按鈕 */}
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

          {/* 表單 */}
          <form onSubmit={handleLogin} className="space-y-3" noValidate>
            {/* Email */}
            <div>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (touched.email) validateField('email', e.target.value);
                  }}
                  onBlur={() => handleBlur('email')}
                  placeholder="Email"
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                    touched.email && fieldErrors.email
                      ? 'border-rose-300 focus:ring-rose-500/30'
                      : 'border-slate-200 focus:ring-cyan-500/30'
                  }`}
                />
              </div>
              {touched.email && fieldErrors.email && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle size={10} />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (touched.password) validateField('password', e.target.value);
                  }}
                  onBlur={() => handleBlur('password')}
                  placeholder="Password"
                  autoComplete={mode === 'supabase' ? 'current-password' : 'off'}
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                    touched.password && fieldErrors.password
                      ? 'border-rose-300 focus:ring-rose-500/30'
                      : 'border-slate-200 focus:ring-cyan-500/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {touched.password && fieldErrors.password && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle size={10} />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* 全域錯誤訊息 */}
            {status === 'error' && errorMsg && (
              <div className="flex items-start gap-2 text-xs text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 成功訊息 */}
            {status === 'success' && successMsg && (
              <div className="flex items-start gap-2 text-xs text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* 送出按鈕 */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  登入中...
                </>
              ) : (
                mode === 'supabase' ? 'Secure Login' : '展示登入'
              )}
            </button>
          </form>

          {/* Supabase 模式：忘記密碼 */}
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
