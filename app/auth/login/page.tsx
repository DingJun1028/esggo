'use client';
import React, { useState } from 'react';
import { Leaf, ShieldCheck, ArrowRight, Github, AlertCircle } from 'lucide-react';
import { BrandCard, BrandButton, BrandInput, BrandBadge } from '../../../components/brand';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!email || !password) {
        throw new Error('請輸入電子郵件與密碼');
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      
      // Store flag for legacy compatibility if needed
      localStorage.setItem('omni_user', email);
      
      // Navigate to dashboard
      router.push('/');
    } catch (err: any) {
      console.error('Login error:', err);
      // Map Firebase errors to user friendly messages
      let errorMsg = '登入失敗，請檢查您的帳號密碼。';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMsg = '電子郵件或密碼錯誤。';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-50">
      {/* Light Theme Background Texture */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-6 fade-in">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-10 text-center">
           <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#009E9D] to-[#00C2A8] flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6 relative">
              <Leaf size={32} color="#fff" className="relative z-10" />
           </div>
           
           <h1 className="text-3xl font-black text-[#003262] mb-2 tracking-tight">ESG GO</h1>
           <div className="flex items-center gap-2">
              <BrandBadge variant="outline" className="border-blue-200 text-blue-600 text-[10px] bg-blue-50/50">VER v8.5.1</BrandBadge>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">OmniHermes Core</span>
           </div>
        </div>

        <BrandCard padding="lg" className="bg-white/80 backdrop-blur-[24px] border-slate-200/60 shadow-2xl shadow-blue-900/5">
           <div className="mb-8">
              <h2 className="text-xl font-black text-[#003262] mb-1">歡迎回來</h2>
              <p className="text-slate-500 text-sm font-medium">請使用您的企業帳號登入 5T 實證系統</p>
           </div>

           {error && (
             <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 text-sm font-medium">
               <AlertCircle size={16} className="mt-0.5 shrink-0" />
               <p>{error}</p>
             </div>
           )}

           <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">電子郵件</label>
                 <BrandInput 
                   type="email" 
                   placeholder="name@company.com" 
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-[#009E9D] focus:ring-4 focus:ring-emerald-500/10 h-11 transition-all"
                   required
                 />
              </div>

              <div className="space-y-1.5">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">密碼</label>
                    <Link href="#" className="text-[10px] text-[#009E9D] font-black hover:underline">忘記密碼？</Link>
                 </div>
                 <BrandInput 
                   type="password" 
                   placeholder="••••••••" 
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-[#009E9D] focus:ring-4 focus:ring-emerald-500/10 h-11 transition-all"
                   required
                 />
              </div>

              <div className="pt-4">
                 <BrandButton 
                   variant="primary" 
                   fullWidth 
                   size="lg" 
                   className="bg-gradient-to-r from-[#009E9D] to-[#00C2A8] border-none h-12 text-sm font-black shadow-xl shadow-[#009E9D]/20 hover:shadow-[#009E9D]/30"
                   loading={loading}
                 >
                    進入系統控制台 <ArrowRight size={16} className="ml-2" />
                 </BrandButton>
              </div>
           </form>

           <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
              <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-black mb-4">或者使用</p>
              <div className="grid grid-cols-2 gap-3">
                 <BrandButton variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 h-10 text-xs font-bold bg-white">
                    <ShieldCheck size={14} className="mr-2 text-slate-400" /> SSO
                 </BrandButton>
                 <BrandButton variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 h-10 text-xs font-bold bg-white">
                    <Github size={14} className="mr-2 text-slate-400" /> GitHub
                 </BrandButton>
              </div>
           </div>
        </BrandCard>

        <p className="mt-10 text-center text-slate-400 text-xs font-medium tracking-tight">
          &copy; {new Date().getFullYear()} ESG GO Systems. <br/>
          Berkeley Haas × TSISDA Academic Partner.
        </p>
      </div>
    </div>
  );
}
