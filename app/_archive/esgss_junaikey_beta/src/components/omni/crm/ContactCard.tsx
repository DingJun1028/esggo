import React from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Mail,
    ShieldCheck,
    History,
    Activity
} from 'lucide-react';

interface ContactCardProps {
    name: string;
    role: string;
    company: string;
    status: 'Trustworthy' | 'Processing';
    metrics: {
        tangible: number;
        traceable: number;
    };
}

export const ContactCard: React.FC<ContactCardProps> = ({
    name,
    role,
    company,
    status,
    metrics
}) => {
    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
            className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6 space-y-4 backdrop-blur-xl relative overflow-hidden group"
        >
            {/* 5T Status Ribbon */}
            <div className="absolute top-0 right-0 px-3 py-1 bg-[#ffd700] text-black text-[10px] font-black uppercase tracking-widest rounded-bl-xl shadow-lg">
                {status}
            </div>

            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#63a6b0]/20 to-slate-800 flex items-center justify-center border border-[#63a6b0]/30 group-hover:border-[#63a6b0]/60 transition-colors">
                    <span className="text-[#63a6b0] font-black text-xl">{name.charAt(0)}</span>
                </div>
                <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-[#63a6b0] transition-colors">{name}</h4>
                    <p className="text-slate-400 text-xs flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {role} @ {company}
                    </p>
                </div>
            </div>

            <div className="space-y-3 pt-2">
                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <span>Tangible (可感知)</span>
                        <span className="text-[#63a6b0]">{metrics.tangible}%</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${metrics.tangible}%` }}
                            className="h-full bg-gradient-to-r from-[#63a6b0] to-[#4a90a4]"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <span>Traceable (可溯源)</span>
                        <span className="text-[#63a6b0]">{metrics.traceable}%</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${metrics.traceable}%` }}
                            className="h-full bg-gradient-to-r from-[#4a90a4] to-[#3d7a8c]"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/50">
                <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2">
                    <Mail className="w-3 h-3" />
                    聯繫
                </button>
                <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all">
                    <History className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};
