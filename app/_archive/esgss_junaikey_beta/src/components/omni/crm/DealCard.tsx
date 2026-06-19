import React from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Calendar,
    DollarSign,
    CheckCircle2,
    Clock
} from 'lucide-react';

interface DealCardProps {
    title: string;
    company: string;
    amount: string;
    progress: number;
    daysRemaining: number;
}

export const DealCard: React.FC<DealCardProps> = ({
    title,
    company,
    amount,
    progress,
    daysRemaining
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/30 rounded-3xl border border-slate-800 p-8 space-y-6 backdrop-blur-xl relative group"
        >
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h4 className="text-xl font-black text-white group-hover:text-[#63a6b0] transition-colors">{title}</h4>
                    <p className="text-slate-400 text-sm font-medium">{company}</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">預估價值</p>
                    <p className="text-lg font-black text-[#63a6b0]">NT$ {amount}</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">賸餘天數</p>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-400" />
                        <p className="text-lg font-black text-orange-400">{daysRemaining} 天</p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#63a6b0]" />
                        Trackable 進度
                    </p>
                    <span className="text-xs font-black text-[#63a6b0]">{progress}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-[#63a6b0] via-[#4a90a4] to-[#ffd700] rounded-full shadow-[0_0_10px_rgba(99,166,176,0.5)]"
                    />
                </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs font-bold text-slate-500 border-t border-slate-800/50">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>預計結案: 2026/03/15</span>
                </div>
                <button className="text-[#63a6b0] hover:underline transition-all">詳情看板 →</button>
            </div>
        </motion.div>
    );
};
