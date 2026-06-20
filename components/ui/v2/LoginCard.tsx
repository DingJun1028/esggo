// components/ui/v2/LoginCard.tsx
'use client';

import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';

interface LoginCardProps {
  onSubmit: (email: string, password: string) => void;
  loading?: boolean;
  error?: string;
  success?: string;
  mode?: 'supabase' | 'demo';
  onDemoLogin?: () => void;
}

export function LoginCard({ onSubmit, loading, error, success, mode = 'demo', onDemoLogin }: LoginCardProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    onSubmit(email, password);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Demo quick entry */}
      {mode === 'demo' && onDemoLogin && (
        <>
          <button
            onClick={onDemoLogin}
            className="w-full py-3 mb-4 bg-berkeley-blue text-white font-semibold rounded-lg hover:bg-berkeley-dark transition-all flex items-center justify-center gap-2 text-sm"
          >
            <ShieldCheck size={18} />
            快速進入展示平台
            <ArrowRight size={16} />
          </button>
          <div className="relative flex items-center mb-4">
            <div className="flex-grow border-t border-neutral-200" />
            <span className="flex-shrink mx-3 text-xs text-neutral-400">或</span>
            <div className="flex-grow border-t border-neutral-200" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Email */}
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-berkeley-blue/20 focus:border-berkeley-blue transition-all"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-berkeley-blue/20 focus:border-berkeley-blue transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="text-xs text-emerald-600 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
            {success}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !email.trim() || !password.trim()}
          className="w-full py-2.5 bg-berkeley-blue text-white font-semibold rounded-lg hover:bg-berkeley-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 size={14} className="animate-spin" />處理中...</>
          ) : (
            mode === 'supabase' ? 'Secure Login' : '展示登入'
          )}
        </button>
      </form>
    </div>
  );
}
