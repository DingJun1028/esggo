"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Leaf, Building2, Globe, BookOpen, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { OmniComicStrip, ComicPanel } from '@/components/omni/cards/OmniComicStrip';
import { useRouter } from 'next/navigation';

/**
 * 🏛️ Onboarding Page (初次共鳴 - First Resonance)
 * 
 * 用戶建立「個人數位主體性 (Digital Agency)」的起點。
 * 服務即教學，知識即資產。
 */

const STEPS = [
    {
        id: 1,
        title: "您是誰？",
        subtitle: "選擇您的永續旅程起點",
        options: [
            { icon: Building2, label: "企業 CSR / ESG 部門", desc: "需要報告、合規、碳管理", value: "corp" },
            { icon: Globe, label: "顧問 / 稽核機構", desc: "協助企業評估與改善", value: "consultant" },
            { icon: GraduationCap, label: "學術 / 研究人員", desc: "分析數據、建立知識", value: "academic" },
            { icon: Leaf, label: "永續倡議者", desc: "推動社會與環境正向改變", value: "activist" },
        ]
    },
    {
        id: 2,
        title: "您最關心什麼？",
        subtitle: "選擇最重要的 ESG 議題",
        options: [
            { icon: Leaf, label: "碳排放與氣候行動", desc: "Scope 1/2/3, 淨零路徑", value: "carbon" },
            { icon: Building2, label: "供應鏈透明度", desc: "溯源、風險管控", value: "supply" },
            { icon: GraduationCap, label: "社會平等與包容", desc: "員工、社區、人權", value: "social" },
            { icon: Globe, label: "公司治理與透明度", desc: "董事會、法規遵循", value: "gov" },
        ]
    },
    {
        id: 3,
        title: "建立您的數位分身",
        subtitle: "為您的永續旅程命名",
        type: 'form',
    }
];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [selections, setSelections] = useState<Record<number, string>>({});
    const [name, setName] = useState('');
    const [org, setOrg] = useState('');

    const comicPanels: [ComicPanel, ComicPanel, ComicPanel, ComicPanel] = [
        { id: '1', title: '1. 感知共鳴', description: '告訴我們您的角色，讓平台為您量身打造最精準的永續學習路徑。', color: 'primary' },
        { id: '2', title: '2. 選擇議題', description: '聚焦您最關心的 ESG 議題，讓知識資產精準累積在正確的方向。', color: 'accent' },
        { id: '3', title: '3. 建立分身', description: '您的數位分身將記錄所有學習軌跡，成為不可篡改的永續成就資產。', color: 'success' },
        { id: '4', title: '4. 啟程！', description: '進入善向紀元，開啟服務即教學、知識即資產的無盡進化之旅。', color: 'primary' },
    ];

    const currentStep = STEPS[step];

    const handleSelect = (value: string) => {
        setSelections(prev => ({ ...prev, [step]: value }));
    };

    const handleNext = () => {
        if (step < STEPS.length - 1) setStep(s => s + 1);
        else handleComplete();
    };

    const handleComplete = () => {
        if (!name.trim()) return;
        localStorage.setItem('omni-avatar', JSON.stringify({ name, org, ...selections }));
        router.push('/omni');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-[#63a6b0]/5 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-4xl mx-auto space-y-10">
                {/* Header */}
                <div className="text-center space-y-3">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 bg-omni-primary/10 text-omni-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest"
                    >
                        <Sparkles size={12} className="animate-pulse" /> 第一章：初次共鳴
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black text-slate-800"
                    >
                        歡迎加入 InfoOne
                    </motion.h1>
                    <p className="text-slate-500 text-sm font-bold">服務即教學，知識即資產 · 善向永續</p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-2 max-w-md mx-auto">
                    {STEPS.map((s, i) => (
                        <React.Fragment key={i}>
                            <div className={`size-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${i < step ? 'bg-emerald-500 text-white' :
                                    i === step ? 'bg-omni-primary text-white' :
                                        'bg-slate-100 text-slate-400'
                                }`}>
                                {i < step ? <CheckCircle2 size={16} /> : i + 1}
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                                    <div className={`h-full bg-omni-primary transition-all duration-500 ${i < step ? 'w-full' : 'w-0'}`} />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Comic Guide */}
                <OmniComicStrip panels={comicPanels} />

                {/* Step Content */}
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                >
                    <LiquidGlassContainer className="p-8 space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-slate-800">{currentStep.title}</h2>
                            <p className="text-slate-500 text-sm">{currentStep.subtitle}</p>
                        </div>

                        {currentStep.type === 'form' ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">您的名稱 / 暱稱</label>
                                    <input
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="例如：永續長 李大明"
                                        className="w-full bg-slate-50 border border-omni-glass-border rounded-2xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-omni-primary/30 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">您的組織 (可選)</label>
                                    <input
                                        value={org}
                                        onChange={e => setOrg(e.target.value)}
                                        placeholder="例如：台積電永續發展部"
                                        className="w-full bg-slate-50 border border-omni-glass-border rounded-2xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-omni-primary/30 transition-all"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {currentStep.options?.map(opt => {
                                    const Icon = opt.icon;
                                    const selected = selections[step] === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleSelect(opt.value)}
                                            className={`p-5 rounded-2xl border-2 text-left transition-all ${selected
                                                    ? 'border-omni-primary bg-omni-primary/5'
                                                    : 'border-omni-glass-border hover:border-omni-primary/30'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`size-10 rounded-xl flex items-center justify-center ${selected ? 'bg-omni-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                    <Icon size={18} />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="font-black text-slate-800 text-sm">{opt.label}</p>
                                                    <p className="text-xs text-slate-500">{opt.desc}</p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t border-omni-glass-border">
                            {step > 0 ? (
                                <button onClick={() => setStep(s => s - 1)} className="text-sm font-bold text-slate-400 hover:text-slate-700">
                                    ← 上一步
                                </button>
                            ) : <div />}
                            <button
                                onClick={handleNext}
                                disabled={!selections[step] && currentStep.type !== 'form' || (currentStep.type === 'form' && !name.trim())}
                                className="flex items-center gap-2 px-8 py-3 bg-omni-primary text-white rounded-2xl font-black text-sm hover:bg-omni-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                {step === STEPS.length - 1 ? '啟程！進入善向紀元' : '下一步'}
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </LiquidGlassContainer>
                </motion.div>

                {/* Bottom Philosophy */}
                <div className="flex justify-center gap-12 text-xs font-bold text-slate-300 uppercase tracking-widest">
                    <span>道法自然 系統毅然</span>
                    <span>以終為始 始終如一</span>
                </div>
            </div>
        </div>
    );
}
