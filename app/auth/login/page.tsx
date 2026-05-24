'use client';
import React, { useState, useRef } from 'react';
import { Leaf, ShieldCheck, ArrowRight, Github, AlertCircle, Zap, Shield, Terminal, Layout, Globe, Key, AlertTriangle } from 'lucide-react';
import { BrandCard, BrandButton, BrandInput, BrandBadge } from '../../../components/brand';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, isDemoMode } from '../../../lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const leafClicksRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleLeafClick = () => {
    leafClicksRef.current += 1;
    
    if (leafClicksRef.current >= 3) {
      router.push('/terminal');
      leafClicksRef.current = 0;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      // Reset counter if no click within 2 seconds
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
      if (!email || !password) throw new Error('請輸入電子郵件與密碼');
      
      if (isDemoMode) {
        console.log('[Auth] Demo Mode Active. Bypassing Firebase.');
        // Allow any login in demo mode for dev convenience
        localStorage.setItem('omni_user', JSON.stringify({ email, id: 'demo_user', role: 'admin' }));
        router.push('/');
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('omni_user', JSON.stringify({ email, id: auth.currentUser?.uid, role: 'authenticated' }));
      router.push('/');
    } catch (err: any) {
      setError(err.message || '登入失敗');
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    localStorage.setItem('omni_user', JSON.stringify({ email: 'admin@esggo.com', id: 'dev_admin', role: 'admin' }));
    router.push('/');
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (err: any) {
      setError('Google 登入失敗');
    } finally {
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
             className="w-20 h-20 rounded-[32px] bg-[#003262] flex items-center justify-center shadow-2xl shadow-blue-900/20 mb-6 relative group overflow-hidden cursor-pointer active:scale-95 transition-all"
           >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Leaf size={40} color="#FDB515" className="relative z-10" />
           </div>
           
           <h1 className="text-4xl font-black text-[#003262] mb-2 tracking-tighter uppercase">ESG GO</h1>
           <div className="flex items-center gap-2">
              <BrandBadge variant="gold" size="xs" className="font-black px-3">PREMIUM_OS</BrandBadge>
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">OmniHermes Engine</span>
           </div>
        </div>

        <BrandCard padding="lg" className="bg-white/90 backdrop-blur-[40px] border-white shadow-extreme rounded-[48px] p-10">
           <div className="mb-10 text-center">
              <h2 className="text-2xl font-black text-[#003262] tracking-tight">身分驗證中心</h2>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Sovereign Identity Access</p>
           </div>

           {error && (
             <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600 text-xs font-bold">
               <AlertCircle size={16} className="mt-0.5 shrink-0" />
               <p>{error}</p>
             </div>
           )}

           {isDemoMode && (
             <div className="mb-8 p-5 bg-blue-50 border border-blue-200 rounded-[32px] flex flex-col gap-4">
                <div className="flex items-start gap-3">
                   <Shield size={18} className="text-blue-600 shrink-0 mt-0.5" />
                   <div>
                      <p className="text-blue-800 text-[11px] font-black uppercase tracking-wider">Developer_Channel_Active</p>
                      <p className="text-blue-700/70 text-[10px] font-bold leading-relaxed mt-1">開發者測試模式已啟動。您可以直接使用快速存取進入平台管理介面。</p>
                   </div>
                </div>
                <BrandButton 
                  variant="primary" 
                  fullWidth 
                  size="sm" 
                  onClick={handleDemoLogin}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-12 text-xs font-black rounded-2xl shadow-lg shadow-blue-500/20"
                  loading={loading}
                >
                   <Zap size={14} className="mr-2" /> 快速進入開發者控制台
                </BrandButton>
             </div>
           )}

           <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Enterprise Email</label>
                 <BrandInput 
                   type="email" 
                   placeholder="name@company.com" 
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   className="bg-slate-50 border-slate-100 text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-[#003262] focus:ring-8 focus:ring-blue-500/5 h-14 rounded-2xl transition-all font-bold"
                   required
                 />
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Key</label>
                    <Link href="#" className="text-[10px] text-[#3B7EA1] font-black hover:underline">Forgot_Password?</Link>
                 </div>
                 <BrandInput 
                   type="password" 
                   placeholder="••••••••" 
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   className="bg-slate-50 border-slate-100 text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-[#003262] focus:ring-8 focus:ring-blue-500/5 h-14 rounded-2xl transition-all font-bold"
                   required
                 />
              </div>

              <div className="pt-4 space-y-4">
                 <BrandButton 
                   variant="primary" 
                   fullWidth 
                   size="lg" 
                   className="bg-[#003262] h-14 text-sm font-black shadow-xl shadow-blue-900/20 rounded-2xl group"
                   loading={loading}
                 >
                    啟動主權連線 <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                 </BrandButton>
                 
                 <div className="text-center">
                    <p className="text-[11px] font-bold text-slate-400">
                       尚未擁有帳號？ <Link href="#" className="text-[#3B7EA1] font-black hover:text-[#003262] transition-colors underline underline-offset-4">立即註冊成為成員</Link>
                    </p>
                 </div>
              </div>
           </form>

           <div className="mt-10 pt-10 border-t border-slate-50 space-y-6">
              <div className="relative">
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-50"></div></div>
                 <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-300 tracking-[0.3em]"><span className="bg-white px-4">Trusted_Providers</span></div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                 <BrandButton 
                   variant="outline" 
                   onClick={handleGoogleLogin}
                   className="border-slate-100 text-slate-600 hover:bg-slate-50 h-14 text-xs font-black bg-white rounded-2xl shadow-sm flex items-center justify-center gap-3 group"
                 >
                    <Globe size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" /> Continue_with_Google
                 </BrandButton>
                 
                 <div className="grid grid-cols-2 gap-3">
                    <BrandButton variant="outline" className="border-slate-100 text-slate-500 hover:bg-slate-50 h-12 text-[10px] font-black bg-white rounded-xl shadow-sm uppercase tracking-widest">
                       <Github size={14} className="mr-2 opacity-40" /> GitHub
                    </BrandButton>
                    <BrandButton variant="outline" className="border-slate-100 text-slate-500 hover:bg-slate-50 h-12 text-[10px] font-black bg-white rounded-xl shadow-sm uppercase tracking-widest">
                       <ShieldCheck size={14} className="mr-2 opacity-40" /> SSO_SAML
                    </BrandButton>
                 </div>
              </div>
           </div>
        </BrandCard>

        <p className="mt-10 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
          &copy; {new Date().getFullYear()} ESG GO Enterprise Hub <br/>
          Berkeley × TSISDA Digital Sovereignty Partner
        </p>
      </div>
    </div>
  );
}
