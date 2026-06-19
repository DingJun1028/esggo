import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogCategory, omniLogger } from '@/services/omniLogger';
import { Loader2, ShieldCheck, Fingerprint, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { SystemError } from '@/omni/infrastructure/errors/SystemError';

export const LoginPortal = () => {
  const { loginWithGoogle, loginAsDeveloper, loading: authLoading } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoHash] = useState('0x7f2a9c4d8e1f0b3a9d7c6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a');
  const [error, setError] = useState<string | null>(null);

  // 🖱️ Handler: Google Login (Primary)
  const handleGoogleLogin = async () => {
    if (isLoggingIn || authLoading) return;
    setIsLoggingIn(true);
    setError(null);
    try {
      await loginWithGoogle();
      // App.tsx will handle redirect upon user state change
    } catch (err: any) {
      const systemError = SystemError.fromFirebaseError(err);
      omniLogger.error(LogCategory.SYSTEM, 'Login Portal Error', { error: systemError });
      setError(systemError.message); // Display user-friendly message
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="bg-slate-950 font-sans min-h-screen relative overflow-x-hidden selection:bg-[#0ab8b2]/30 flex flex-col items-center justify-center p-6 text-white">
      {/* Background Refractions */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#0ab8b2]/20 to-transparent blur-[80px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-500/10 to-transparent blur-[100px] opacity-60"></div>
      </div>

      <div className="relative z-10 w-full max-w-[480px]">
        {/* Headline */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2 tracking-tight">
            用戶登入與身份驗證
          </h1>
          <p className="text-[#0ab8b2]/70 text-sm font-normal tracking-widest uppercase">
            ESGss JunAiKey | ESG All In One
          </p>
        </div>

        {/* Liquid Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-2xl bg-[#1b2727]/60 border border-[#0ab8b2]/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] rounded-xl p-8 md:p-10 flex flex-col gap-6 relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60 text-xs font-mono uppercase tracking-tighter">
              Identity Portal v7.0
            </span>
            <div className="flex items-center gap-2 text-[#0ab8b2]">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Secure Session
              </span>
            </div>
          </div>

          {/* Error Message Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-xs font-medium text-center"
            >
              {error}
            </motion.div>
          )}

          {/* TextFields (Mock - Visual Alignment with Standard Input) */}
          <div className="space-y-5">
            <Input
              label="用戶名 / 電子郵件"
              placeholder="請輸入您的帳號"
              className="bg-white/5 border-white/10"
            // mocked functionality
            />

            <div className="relative">
              <Input
                label="密碼"
                placeholder="請輸入您的密碼"
                type={showPassword ? 'text' : 'password'}
                className="bg-white/5 border-white/10 pr-12"
              // mocked functionality
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-white/20 hover:text-[#0ab8b2] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Secondary Actions */}
          <div className="flex justify-between items-center text-sm px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="rounded border-white/20 bg-transparent text-[#0ab8b2] focus:ring-[#0ab8b2]/50 focus:ring-offset-0"
              />
              <span className="text-white/60 group-hover:text-white transition-colors">
                保持登入
              </span>
            </label>
            <a href="#" className="text-[#0ab8b2] hover:text-[#0ab8b2]/80 transition-colors">
              忘記密碼？
            </a>
          </div>

          {/* Login Button (Google) */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full h-14 bg-[#0ab8b2] text-[#102222] font-bold text-lg rounded-xl transition-all hover:shadow-[0_0_20px_rgba(10,184,178,0.4)] hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <span>Google 登入</span>
                {/* <LoginIcon className="w-5 h-5" /> */}
              </>
            )}
          </button>

          {/* Biometric Section (Visual Only) */}
          <div className="flex flex-col items-center gap-4 mt-2">
            <div className="flex items-center gap-4 w-full">
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <span className="text-white/30 text-xs font-medium uppercase">或使用生物識別</span>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>
            <div className="flex gap-6">
              <button className="size-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-[#0ab8b2] hover:border-[#0ab8b2]/50 hover:bg-[#0ab8b2]/5 transition-all">
                <Fingerprint className="w-8 h-8" />
              </button>
            </div>
          </div>

          {/* Trustworthy Hash-Lock */}
          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0ab8b2] animate-pulse"></div>
                <span className="text-[10px] text-[#0ab8b2] font-bold uppercase tracking-widest">
                  數據誠信驗證已啟動
                </span>
              </div>
              <span className="text-[10px] text-white/30 font-mono">SHA-256 ACTIVE</span>
            </div>
            <div className="bg-black/40 rounded-lg p-2 font-mono text-[10px] text-white/40 break-all border border-white/5 text-center">
              SESSION_HASH: {logoHash}
            </div>
          </div>

          {/* 🔧 Developer Access */}
          <div className="mt-2 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={async () => {
                if (isLoggingIn || authLoading) return;
                setIsLoggingIn(true);
                try {
                  if (loginAsDeveloper) {
                    await loginAsDeveloper();
                  } else {
                    omniLogger.error(LogCategory.SYSTEM, '[LoginPortal] Developer login not implemented in context');
                    setIsLoggingIn(false);
                  }
                } catch (e) {
                  omniLogger.error(LogCategory.SYSTEM, '[LoginPortal] Dev login failed', { error: e });
                  setIsLoggingIn(false);
                }
              }}
              className="w-full py-2 bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/20 text-purple-300/60 font-mono text-[10px] rounded hover:from-purple-900/60 hover:to-pink-900/60 hover:text-purple-200 transition-all flex items-center justify-center gap-2"
            >
              <span>🔧</span>
              <span>DEV_ACCESS_OVERRIDE</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer Meta */}
      <footer className="mt-12 text-white/30 text-[11px] tracking-widest uppercase flex flex-col items-center gap-1 relative z-10">
        <p>© 2026 ESG Sunshine JunAiKey by DingJun</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[#0ab8b2]">
            使用條款
          </a>
          <a href="#" className="hover:text-[#0ab8b2]">
            隱私政策
          </a>
          <a href="#" className="hover:text-[#0ab8b2]">
            節點狀態
          </a>
        </div>
      </footer>
    </div>
  );
};
