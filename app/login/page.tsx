'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, ArrowRight, Chrome } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] glass-card p-12 relative z-10"
      >
        <div className="text-center space-y-3 mb-12">
          <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center mx-auto shadow-2xl">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">ESG GO</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Omni_Terminal Auth</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Email</label>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 flex items-center gap-3 focus-within:border-emerald-400 focus-within:bg-white transition-all">
              <Mail size={18} className="text-slate-300" />
              <input 
                type="email" 
                placeholder="name@company.com"
                className="bg-transparent border-none outline-none text-sm font-bold flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 flex items-center gap-3 focus-within:border-emerald-400 focus-within:bg-white transition-all">
              <Lock size={18} className="text-slate-300" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="bg-transparent border-none outline-none text-sm font-bold flex-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-600 active:scale-95 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2">
            Sign In to Terminal <ArrowRight size={16} />
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase"><span className="bg-white px-4 text-slate-300">Or Secure Login With</span></div>
          </div>

          <button className="w-full py-4 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
            <Chrome size={18} className="text-blue-500" /> Continue with Google
          </button>
        </div>

        <p className="text-center mt-12 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Enterprise Grade 5T Encryption Active
        </p>
      </motion.div>
    </div>
  );
}