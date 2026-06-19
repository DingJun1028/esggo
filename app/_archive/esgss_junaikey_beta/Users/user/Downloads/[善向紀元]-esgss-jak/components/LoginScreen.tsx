
import React, { useState, useMemo } from 'react';
import { Lock, User, ShieldCheck, ToggleLeft, ToggleRight, ArrowRight, BrainCircuit, Activity, Eye, Cpu, Database, PenTool, Network, Server, Zap, CheckCircle2, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { LogoIcon } from './Layout';
import { z } from 'zod';

interface LoginScreenProps {
  onLogin: () => void;
  language: 'zh-TW' | 'en-US';
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, language }) => {
  const [isDevMode, setIsDevMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addToast } = useToast();

  const isZh = language === 'zh-TW';

  const loginSchema = useMemo(() => z.object({
    email: z.string().email(isZh ? "請輸入正確的電子信箱格式" : "Invalid email address"),
    password: z.string().min(6, isZh ? "密碼長度至少 6 位" : "Password must be at least 6 characters")
  }), [isZh]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!isDevMode) {
      const result = loginSchema.safeParse({ email, password });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach(err => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }
    }
    
    setLoading(true);

    // Initial check for AI Studio Key selector if needed
    try {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
            await (window as any).aistudio.openSelectKey();
        }
    } catch (err) {}

    // Pre-emptively clear any potentially stuck session boot sequences
    sessionStorage.removeItem('esgss_boot_sequence_v15');
    
    // Snappy login transition
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 400);
  };

  const toggleDevMode = () => {
      setIsDevMode(!isDevMode);
      setErrors({});
      addToast('warning', isZh ? '開發者模式已啟用' : 'Dev Mode Enabled', 'System');
  };

  const cores = [
      { id: 'perception', name: isZh ? '感知核心' : 'Perception', icon: Eye, color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
      { id: 'cognition', name: isZh ? '認知核心' : 'Cognition', icon: BrainCircuit, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
      { id: 'memory', name: isZh ? '記憶核心' : 'Memory', icon: Database, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
      { id: 'expression', name: isZh ? '表達核心' : 'Expression', icon: PenTool, color: 'text-pink-400', border: 'border-pink-500/30', bg: 'bg-pink-500/10' },
      { id: 'nexus', name: isZh ? '連結核心' : 'Nexus', icon: Network, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] flex relative overflow-hidden font-sans">
      {/* Decorative Blob */}
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-celestial-emerald/5 rounded-full blur-[120px] animate-blob" />
      
      <div className="w-full lg:w-[420px] xl:w-[480px] relative z-20 flex flex-col justify-center p-8 md:p-12 border-r border-white/5 bg-slate-950/80 backdrop-blur-2xl shadow-2xl h-screen">
          <div className="relative z-10 w-full max-w-sm mx-auto">
            <div className="flex flex-col items-center mb-10">
                <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 bg-celestial-gold/20 blur-2xl rounded-full" />
                    <LogoIcon className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight text-center uppercase">
                    ESGss <span className="text-celestial-gold">JunAiKey</span>
                </h1>
                <p className="text-[10px] text-gray-500 mt-2 font-mono uppercase tracking-[0.4em]">Autonomous Omni-OS Kernel</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                {!isDevMode && (
                <>
                    <div className="space-y-1">
                        <div className="relative group">
                        <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.email ? 'text-rose-400' : 'text-gray-500 group-focus-within:text-celestial-emerald'}`} />
                        <input 
                            type="email" value={email} onChange={(e) => { setEmail(e.target.value); if(errors.email) setErrors(prev => ({...prev, email: ''})); }}
                            placeholder={isZh ? "企業信箱" : "Enterprise Email"}
                            className={`w-full bg-white/5 border rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all ${errors.email ? 'border-rose-500/50' : 'border-white/10 focus:border-celestial-emerald/50'}`}
                            required
                        />
                        </div>
                        {errors.email && <div className="text-[10px] text-rose-400 font-bold uppercase flex items-center gap-1 pl-4"><AlertCircle className="w-3 h-3"/> {errors.email}</div>}
                    </div>
                    <div className="space-y-1">
                        <div className="relative group">
                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.password ? 'text-rose-400' : 'text-gray-500 group-focus-within:text-celestial-purple'}`} />
                        <input 
                            type="password" value={password} onChange={(e) => { setPassword(e.target.value); if(errors.password) setErrors(prev => ({...prev, password: ''})); }}
                            placeholder={isZh ? "密碼" : "Password"}
                            className={`w-full bg-white/5 border rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all ${errors.password ? 'border-rose-500/50' : 'border-white/10 focus:border-celestial-purple/50'}`}
                            required
                        />
                        </div>
                        {errors.password && <div className="text-[10px] text-rose-400 font-bold uppercase flex items-center gap-1 pl-4"><AlertCircle className="w-3 h-3"/> {errors.password}</div>}
                    </div>
                </>
                )}

                {isDevMode && (
                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl animate-fade-in">
                    <p className="text-[10px] text-amber-500 font-black uppercase mb-1">Developer Authorization</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed">Auth bypassed. Entering with Kernel Architect privileges.</p>
                </div>
                )}

                <button 
                    type="submit" disabled={loading}
                    className="w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-celestial-gold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 overflow-hidden group"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Access System <ArrowRight className="w-4 h-4" /></>}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{isZh ? '穩定' : 'Stable'}</span>
                <button onClick={toggleDevMode} className="flex items-center gap-2 text-[10px] text-gray-500 hover:text-white transition-colors uppercase font-bold tracking-widest">
                    {isDevMode ? <ToggleRight className="w-5 h-5 text-celestial-emerald" /> : <ToggleLeft className="w-5 h-5" />}
                    DevMode
                </button>
            </div>
          </div>
      </div>

      <div className="hidden lg:flex flex-1 relative bg-black items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="relative z-10 w-full max-w-4xl px-8">
              <h2 className="text-3xl font-black text-white mb-10 tracking-widest uppercase">The <span className="text-celestial-gold">Universal</span> Core</h2>
              <div className="grid grid-cols-2 gap-4">
                  {cores.map(core => (
                      <div key={core.id} className={`p-6 rounded-3xl border ${core.border} bg-slate-900/40 flex items-center gap-6 hover:bg-slate-900 transition-all cursor-crosshair group`}>
                          <div className={`p-3 rounded-2xl ${core.bg} ${core.color} group-hover:scale-110 transition-transform`}><core.icon className="w-6 h-6" /></div>
                          <div className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{core.name}</div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};
