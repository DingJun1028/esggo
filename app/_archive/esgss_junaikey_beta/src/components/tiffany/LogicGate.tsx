import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

interface LogicGateProps {
    status: 'pass' | 'lock';
    hash?: string;
    message?: string;
}

export const LogicGate: React.FC<LogicGateProps> = ({
    status,
    hash = "0x00E676",
    message = "正在通過 5T 協議驗證層。流量目前穩定且資源分配正常。",
}) => {
    const isPass = status === 'pass';

    return (
        <div className={`
      relative p-6 rounded-3xl border overflow-hidden
      ${isPass ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}
    `}>
            {/* Background Animated Hex Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

            <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isPass ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {isPass ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-lg font-black tracking-tight ${isPass ? 'text-emerald-400' : 'text-red-400'}`}>
                                {isPass ? 'PASS' : 'LOCK'}
                            </span>
                            <span className="text-[10px] text-[var(--tiffany-text-secondary)] font-mono tracking-tighter uppercase">Verification Token</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`text-sm font-mono font-bold ${isPass ? 'text-emerald-500' : 'text-red-500'}`}>{hash}</div>
                        <div className="text-[9px] text-[var(--tiffany-text-secondary)] uppercase tracking-widest font-black">Gate ID: 5T-NODE-SEC</div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <Cpu className="w-3 h-3 text-[#81D8D0]/40" />
                        <span className="text-[10px] text-[var(--tiffany-text-secondary)] font-bold uppercase tracking-widest">Protocol Stream</span>
                    </div>
                    <p className="text-xs text-[var(--tiffany-text)] leading-relaxed italic">
                        "{message}"
                    </p>
                </div>

                <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[9px] uppercase font-black text-white/30 tracking-widest">
                        <span>Validation Load</span>
                        <span>{isPass ? 'Stable' : 'Error'}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: isPass ? '100%' : '35%' }}
                            className={`h-full ${isPass ? 'bg-emerald-500 ring-2 ring-emerald-500/50' : 'bg-red-500 ring-2 ring-red-500/50'}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
