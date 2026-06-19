import React, { useState, useEffect } from 'react';
import { 
    X, ChevronRight, ChevronLeft, Sparkles, 
    Zap, Layout, ShieldCheck, Target, Award
} from 'lucide-react';
import { Language } from '../types';

interface OnboardingTourProps {
    isOpen: boolean;
    onClose: () => void;
    language: Language;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose, language }) => {
    const isZh = language === 'zh-TW';
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: isZh ? '歡迎來到 JunAiKey AIOS' : 'Welcome to JunAiKey AIOS',
            content: isZh ? '您的全方位 ESG 決策支援系統已啟動。本導覽將協助您熟悉核心權能。' : 'Your comprehensive ESG decision support system is live. This tour will guide you through core authorities.',
            icon: Sparkles,
            color: 'text-celestial-gold'
        },
        {
            title: isZh ? '全域儀表板' : 'Global Dashboard',
            content: isZh ? '頂部區域實時監控您的用戶角色、善向值 (GWC) 與 ESG 素養進度。' : 'Real-time monitoring of your role, GWC, and ESG literacy progress at the top.',
            icon: Layout,
            color: 'text-blue-400'
        },
        {
            title: isZh ? 'AMICE 全球商情' : 'AMICE Intelligence',
            content: isZh ? '利用 AI 全網檢索競爭對手與政策動態，並生成精緻 PDF 報告。' : 'Leverage AI for global competitive scanning and professional PDF reports.',
            icon: Target,
            color: 'text-emerald-400'
        },
        {
            title: isZh ? '王道與修煉' : 'Wangdao & Mastery',
            content: isZh ? '透過行動鍛造人格，提升王道契合度，解鎖更高階的系統功能。' : 'Forge personality through action, increase Wangdao sync, and unlock advanced features.',
            icon: ShieldCheck,
            color: 'text-purple-400'
        }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
                {/* Header Decoration */}
                <div className="h-1.5 w-full bg-slate-800">
                    <div 
                        className="h-full bg-gradient-to-r from-celestial-gold via-celestial-purple to-celestial-emerald transition-all duration-500" 
                        style={{ width: `${((step + 1) / steps.length) * 100}%` }} 
                    />
                </div>

                <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-xl text-gray-500 transition-all">
                    <X className="w-5 h-5" />
                </button>

                <div className="p-10 flex flex-col items-center text-center">
                    <div className={`p-5 rounded-3xl bg-white/5 mb-8 ${steps[step].color}`}>
                        {React.createElement(steps[step].icon, { className: "w-12 h-12" })}
                    </div>
                    
                    <h3 className="zh-main text-2xl text-white mb-4">{steps[step].title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm mb-12">
                        {steps[step].content}
                    </p>

                    <div className="flex w-full gap-4">
                        {step > 0 && (
                            <button 
                                onClick={() => setStep(step - 1)}
                                className="flex-1 py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" /> {isZh ? '上一步' : 'Back'}
                            </button>
                        )}
                        <button 
                            onClick={() => step === steps.length - 1 ? onClose() : setStep(step + 1)}
                            className="flex-1 py-4 bg-celestial-gold text-black font-black rounded-2xl shadow-xl shadow-amber-500/10 hover:scale-105 transition-all flex items-center justify-center gap-2"
                        >
                            {step === steps.length - 1 ? (isZh ? '開始體驗' : 'Begin') : (isZh ? '下一步' : 'Next')}
                            {step < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="p-4 bg-black/20 text-center border-t border-white/5">
                    <span className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.3em]">
                        Step {step + 1} of {steps.length} • PROTOCOL_TOUR_V15
                    </span>
                </div>
            </div>
        </div>
    );
};