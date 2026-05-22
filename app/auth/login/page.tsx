'use client';
// [Stitch Identity Sealed] 2026-05-22
import React, { useState } from 'react';
import { Leaf, ShieldCheck, ArrowRight, Github } from 'lucide-react';
import { BrandCard, BrandButton, BrandInput, BrandBadge } from '../../../components/brand';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);
    
    // Stitch Auth Force Seal - Admin Access
    localStorage.clear();
    localStorage.setItem('omni_user', 'developer_master_admin');
    
    // Using window.location.href to force a full app state re-initialization
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#003262]">
      {/* Stitch Liquid Background Texture */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#009E9D]/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4AF37]/10 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-6 fade-in">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-10 text-center">
           {/* DEVELOPER MASTER KEY - CLICK THE LOGO */}
           <button 
             onClick={() => handleLogin()} 
             type="button"
             title="Developer Master Key - Click to bypass"
             className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#009E9D] to-[#00C2A8] flex items-center justify-center shadow-2xl mb-6 hover:scale-110 active:scale-90 transition-all cursor-pointer group relative"
           >
              <div className="absolute inset-0 rounded-2xl bg-white/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
              <Leaf size={32} color="#fff" className="relative z-10 group-hover:rotate-12 transition-transform" />
           </button>
           
           <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">ESG GO</h1>
           <div className="flex items-center gap-2">
              <BrandBadge variant="outline" className="border-white/20 text-white/60 text-[10px]">VER v8.5.1</BrandBadge>
              <span className="text-white/40 text-xs font-medium uppercase tracking-[0.2em]">OmniHermes Core</span>
           </div>
        </div>

        <BrandCard padding="lg" className="bg-white/10 backdrop-blur-[24px] border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.2)]">
           <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-1">歡迎回來</h2>
              <p className="text-white/50 text-sm">請使用您的企業帳號登入 5T 實證系統</p>
           </div>

           <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">電子郵件</label>
                 <BrandInput 
                   type="email" 
                   placeholder="name@company.com" 
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-[#009E9D] h-11"
                   required
                 />
              </div>

              <div className="space-y-1.5">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">密碼</label>
                    <Link href="#" className="text-[10px] text-[#009E9D] font-bold hover:underline">忘記密碼？</Link>
                 </div>
                 <BrandInput 
                   type="password" 
                   placeholder="••••••••" 
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-[#009E9D] h-11"
                   required
                 />
              </div>

              <div className="pt-4">
                 <BrandButton 
                   variant="primary" 
                   fullWidth 
                   size="lg" 
                   className="bg-gradient-to-r from-[#009E9D] to-[#00C2A8] border-none h-12 text-sm font-bold shadow-xl shadow-[#009E9D]/20"
                   loading={loading}
                 >
                    進入系統控制台 <ArrowRight size={16} className="ml-2" />
                 </BrandButton>
              </div>
           </form>

           <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              <p className="text-center text-[10px] text-white/30 uppercase tracking-widest font-bold mb-4">或者使用</p>
              <div className="grid grid-cols-2 gap-3">
                 <BrandButton variant="outline" className="border-white/10 text-white/70 hover:bg-white/5 h-10 text-xs">
                    <ShieldCheck size={14} className="mr-2" /> SSO
                 </BrandButton>
                 <BrandButton variant="outline" className="border-white/10 text-white/70 hover:bg-white/5 h-10 text-xs">
                    <Github size={14} className="mr-2" /> GitHub
                 </BrandButton>
              </div>
           </div>
        </BrandCard>

        <p className="mt-10 text-center text-white/30 text-xs font-medium tracking-tight">
          &copy; 2026 ESG GO Systems. <br/>
          Berkeley Haas × TSISDA Academic Partner.
        </p>
      </div>
    </div>
  );
}
