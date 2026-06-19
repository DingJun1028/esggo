
import React from 'react';
import { Language } from '../types';
import { LucideIcon, Activity, Cpu } from 'lucide-react';

interface UniversalPageHeaderProps {
    icon: LucideIcon;
    title: { zh: string; en: string };
    description: { zh: string; en: string };
    language: Language;
    tag?: { zh: string; en: string };
}

export const UniversalPageHeader: React.FC<UniversalPageHeaderProps> = ({ 
    icon: Icon, 
    title, 
    description, 
    language,
    tag 
}) => {
    const isZh = language === 'zh-TW';
    return (
        <div className="w-full flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3 mb-4 group animate-fade-in shrink-0">
            <div className="flex items-center gap-4 min-w-0">
                <div className="relative shrink-0">
                    <div className="p-2.5 bg-slate-900/5 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-lg group-hover:border-celestial-gold/50 transition-all duration-700 group-hover:scale-105">
                        <Icon className="w-5 h-5 text-celestial-gold" />
                    </div>
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-3">
                        <h2 className={`text-xl tracking-tighter uppercase leading-none text-slate-900 dark:text-white ${isZh ? 'font-black' : 'font-light'}`}>
                            {isZh ? title.zh : title.en}
                        </h2>
                        {tag && (
                            <div className="px-2 py-0.5 rounded bg-celestial-purple/10 border border-celestial-purple/20">
                                <span className="text-[8px] font-black text-celestial-purple dark:text-white uppercase tracking-widest">{isZh ? tag.en : tag.zh}</span>
                            </div>
                        )}
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-gray-500 mt-1 truncate font-mono">
                        {isZh ? description.zh : description.en}
                    </p>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-6 shrink-0 font-mono">
                <div className="flex flex-col items-end">
                    <span className="text-[8px] text-slate-400 dark:text-gray-600 uppercase font-black tracking-tighter">Sync_Latency</span>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500 font-bold text-xs">
                        <Activity className="w-2.5 h-2.5" /> 12ms
                    </div>
                </div>
                <div className="w-px h-6 bg-slate-200 dark:bg-white/5" />
                <div className="flex flex-col items-end">
                    <span className="text-[8px] text-slate-400 dark:text-gray-600 uppercase font-black tracking-tighter">Thread_Load</span>
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs">
                        <Cpu className="w-2.5 h-2.5" /> 42%
                    </div>
                </div>
            </div>
        </div>
    );
};
