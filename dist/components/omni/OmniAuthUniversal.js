import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Fingerprint, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function OmniAuthUniversal() {
    const [status, setStatus] = useState('idle');
    const router = useRouter();
    const handleLogin = async () => {
        setStatus('authenticating');
        // Simulate backend call
        setTimeout(() => {
            setStatus('verifying_5T');
            // Simulate Proof Center verification
            setTimeout(() => {
                setStatus('success');
                setTimeout(() => router.push('/dashboard'), 1000);
            }, 1500);
        }, 1000);
    };
    return (_jsxs("div", { className: "flex flex-col items-center justify-center p-8 bg-[#020617] rounded-3xl border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.15)] max-w-md w-full mx-auto relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-indigo-500/10 pointer-events-none" }), _jsxs("div", { className: "w-16 h-16 bg-black/40 border border-cyan-500/30 rounded-2xl flex items-center justify-center mb-6 relative", children: [_jsx("div", { className: "absolute inset-0 rounded-2xl bg-cyan-400/20 blur-xl" }), status === 'success' ? (_jsx(ShieldCheck, { size: 32, className: "text-emerald-400" })) : status === 'verifying_5T' ? (_jsx(Activity, { size: 32, className: "text-cyan-400 animate-pulse" })) : (_jsx(Lock, { size: 32, className: "text-slate-300" }))] }), _jsx("h2", { className: "text-2xl font-black text-white tracking-wide uppercase mb-2", children: "Omni Identity" }), _jsxs("p", { className: "text-slate-400 text-sm mb-8 text-center leading-relaxed", children: ["\u901A\u904E 5T \u8AA0\u4FE1\u5354\u8B70\u9A57\u8B49\u60A8\u7684\u4E3B\u6B0A\u8EAB\u4EFD", _jsx("br", {}), _jsx("span", { className: "text-[10px] text-cyan-500/70 uppercase tracking-widest font-mono mt-1 block", children: "Zero Knowledge Proof Enabled" })] }), _jsxs("button", { onClick: handleLogin, disabled: status !== 'idle', className: "w-full relative group overflow-hidden rounded-xl bg-white/5 border border-white/10 p-4 transition-all hover:bg-white/10 hover:border-cyan-500/30 active:scale-95", children: [_jsx("div", { className: "absolute inset-0 w-0 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 transition-all duration-500 ease-out group-hover:w-full" }), _jsxs("div", { className: "relative flex items-center justify-center gap-3", children: [_jsx(Fingerprint, { size: 20, className: status === 'idle' ? 'text-cyan-400' : 'text-slate-500' }), _jsxs("span", { className: "text-white font-bold tracking-widest", children: [status === 'idle' && '啟動神經連結登入', status === 'authenticating' && '身份核驗中...', status === 'verifying_5T' && '生成防竄改金鑰...', status === 'success' && '授權通過 (Trustworthy)'] })] })] }), status !== 'idle' && (_jsxs("div", { className: "mt-6 w-full flex flex-col gap-2", children: [_jsxs("div", { className: "flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest", children: [_jsx("span", { children: "Protocol Check" }), _jsx("span", { className: status === 'success' ? 'text-emerald-400 font-bold' : 'text-cyan-400 animate-pulse', children: status === 'success' ? 'Verified' : 'Processing' })] }), _jsx("div", { className: "h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5", children: _jsx(motion.div, { initial: { width: '0%' }, animate: { width: status === 'authenticating' ? '40%' : status === 'verifying_5T' ? '80%' : '100%' }, className: `h-full ${status === 'success' ? 'bg-emerald-400' : 'bg-cyan-400'}`, transition: { duration: 0.5 } }) })] }))] }));
}
//# sourceMappingURL=OmniAuthUniversal.js.map