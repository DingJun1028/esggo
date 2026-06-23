// @ts-nocheck
'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  Leaf,
  ShieldCheck,
  ArrowUpRight,
  Github,
  AlertCircle,
  Zap,
  Shield,
  Globe,
} from 'lucide-react';
import { Card } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Input, Badge } from '@/components/ui/v2/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, isDemoMode } from '../../../lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for dynamically loaded providers
  const [providers, setProviders] = useState<{
    email?: boolean;
    google?: { enabled: boolean };
    emailOTP?: boolean;
  } | null>(null);
  const [providersLoading, setProvidersLoading] = useState(true);

  const leafClicksRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Fetch available authentication providers from NCB Proxy on mount
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch('/api/auth-providers');
        if (res.ok) {
          const data = await res.json();
          setProviders(data);
        } else {
          console.warn('Failed to fetch auth providers, falling back to default email login.');
          setProviders({ email: true }); // Fallback
        }
      } catch (err) {
        console.error('Error fetching auth providers:', err);
        setProviders({ email: true });
      } finally {
        setProvidersLoading(false);
      }
    };
    fetchProviders();

    // Dynamically load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleLeafClick = () => {
    leafClicksRef.current += 1;

    if (leafClicksRef.current >= 3) {
      router.push('/terminal');
      leafClicksRef.current = 0;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        leafClicksRef.current = 0;
      }, 2000);
    }
  };

  async function handleLogin(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!email || !password) throw new Error('請輸入電子郵件與密碼 (Email & Password required)');

      if (isDemoMode) {
        console.log('[Auth] Demo Mode Active. Developer Bypass.');
        document.cookie = 'omni_user_bypass=true; path=/';
        document.cookie = 'omni_demo_session=true; path=/';
        router.push('/dashboard');
        return;
      }

      // Firebase Authentication Call
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Session creation failed');
      }

      // Session token is secure in HTTP-Only cookie, no need for localStorage

      router.push('/dashboard');
    } catch (err: any) {
      const message = err.message || '連線錯誤 (Connection Error)';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    document.cookie = 'omni_user_bypass=true; path=/';
    document.cookie = 'omni_demo_session=true; path=/';
    router.push('/dashboard');
  }

  const handleGoogleCredentialResponse = async (response: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/google-signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google 驗證失敗');

      // Secure HTTP-Only cookie is set by the backend, no localStorage needed
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google 登入失敗');
      setLoading(false);
    }
  };

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);
    try {
      if (isDemoMode) {
        console.log('[Auth] Demo Mode Active. Google Developer Bypass.');
        document.cookie = 'omni_user_bypass=true; path=/';
        document.cookie = 'omni_demo_session=true; path=/';
        await new Promise((r) => setTimeout(r, 1000));
        router.push('/dashboard');
        return;
      }

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();

      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Session creation failed');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google 登入失敗');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#F8FAFC]">
      {/* Light Theme Background Texture */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#FDB515]/5 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] px-6 py-12 fade-in">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div
            onClick={handleLeafClick}
            className="w-20 h-20 rounded-[32px] bg-[#003262] flex items-center justify-center shadow-sm shadow-blue-900/20 mb-6 relative group overflow-hidden cursor-pointer active:scale-95 transition-all"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Leaf size={40} color="#FDB515" className="relative z-10" />
          </div>

          <h1 className="text-4xl font-black text-[#003262] mb-2 tracking-tighter uppercase">
            ESG GO
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="gold" size="xs" className="font-black px-3">
              NCB_AUTH
            </Badge>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
              OmniAgent Engine
            </span>
          </div>
        </div>

        <Card padding="lg" className="bg-white border border-neutral-200 shadow-sm rounded-xl p-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black text-[#003262] tracking-tight">身分驗證中心</h2>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">
              Sovereign Identity Access
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-600 text-xs font-bold">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {isDemoMode && (
            <div className="mb-8 p-5 bg-blue-50 border border-blue-200 rounded-[32px] flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-800 text-[11px] font-black uppercase tracking-wider">
                    Developer_Channel_Active
                  </p>
                  <p className="text-blue-700/70 text-[10px] font-bold leading-relaxed mt-1">
                    開發者測試模式已啟動。您可以直接使用快速存取進入平台管理介面。
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                fullWidth
                size="sm"
                onClick={handleDemoLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white h-12 text-xs font-black rounded-xl shadow-sm shadow-blue-500/20"
                loading={loading}
              >
                <Zap size={14} className="mr-2" /> 快速進入開發者控制台
              </Button>
            </div>
          )}

          {providersLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {providers?.email !== false && (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      Enterprise Email
                    </label>
                    <Input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-50 border-slate-100 text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-[#003262] focus:ring-8 focus:ring-blue-500/5 h-14 rounded-xl transition-all font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Access Key
                      </label>
                      <Link
                        href="#"
                        className="text-[10px] text-[#3B7EA1] font-black hover:underline"
                      >
                        Forgot_Password?
                      </Link>
                    </div>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-slate-50 border-slate-100 text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-[#003262] focus:ring-8 focus:ring-blue-500/5 h-14 rounded-xl transition-all font-bold"
                      required
                    />
                  </div>

                  <div className="pt-4 space-y-4">
                    <Button
                      variant="primary"
                      fullWidth
                      size="lg"
                      className="bg-[#003262] h-14 text-sm font-black shadow-sm shadow-blue-900/20 rounded-xl group"
                      loading={loading}
                    >
                      啟動主權連線{' '}
                      <ArrowUpRight
                        size={18}
                        className="ml-2 group-hover:translate-x-1 transition-transform"
                      />
                    </Button>

                    <div className="text-center">
                      <p className="text-[11px] font-bold text-slate-400">
                        尚未擁有帳號？{' '}
                        <Link
                          href="#"
                          className="text-[#3B7EA1] font-black hover:text-[#003262] transition-colors underline underline-offset-4"
                        >
                          立即註冊成為成員
                        </Link>
                      </p>
                    </div>
                  </div>
                </form>
              )}

              {true && (
                <div className="mt-10 pt-10 border-t border-slate-50 space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-50"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-300 tracking-[0.3em]">
                      <span className="bg-white px-4">Trusted_Providers</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      variant="outline"
                      onClick={handleGoogleLogin}
                      className="border-slate-100 text-slate-600 hover:bg-slate-50 h-14 text-xs font-black bg-white rounded-xl shadow-sm flex items-center justify-center gap-3 group"
                    >
                      <Globe
                        size={18}
                        className="text-slate-300 group-hover:text-blue-500 transition-colors"
                      />{' '}
                      Continue_with_Google
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

        <div className="mt-10 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
          <p>&copy; {new Date().getFullYear()} ESG GO Enterprise Hub</p>
          <p>Berkeley × TSISDA Digital Sovereignty Partner</p>
          <p className="mt-2 text-[9px] opacity-60">
            v{process.env.NEXT_PUBLIC_APP_VERSION || '1.5.0'}
            {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
              ? ` • Build: ${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA.substring(0, 7)}`
              : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
