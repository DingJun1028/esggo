'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    XCircle,
    ArrowRight,
    Award,
    ShieldCheck,
    Zap,
    BrainCircuit,
    Sparkles
} from 'lucide-react';

interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

const questions: Question[] = [
    {
        id: 1,
        text: "在 InfoOne 的 5T 協議中，「Trustworthy (不可篡改)」主要是透過哪種技術手段實現的？",
        options: [
            "定期的手動備份",
            "V8 引擎級別的 Object.freeze() 與 Hash Lock 封印",
            "將數據存儲在 Excel 檔案中",
            "僅透過前端加密"
        ],
        correctAnswer: 1,
        explanation: "5T 協議中的 Trustworthy 透過 Hash Lock 與運行時的 Object.freeze() 確保數據在封裝後進入不可篡改的終態。"
    },
    {
        id: 2,
        text: "「服務即教學，知識即資產」的核心理念是為了滿足使用者的什麼需求？",
        options: [
            "單純的報表生成",
            "ESG 知識點的學習與專業能力的資產化",
            "增加系統的複雜度",
            "減少與 AI 的互動"
        ],
        correctAnswer: 1,
        explanation: "InfoOne 旨在將每一項服務轉化為學習機會，並將學習成果轉化為可證明的個人數位資產。"
    },
    {
        id: 3,
        text: "關於「進化引擎 (Evolution Engine)」的描述，下列何者正確？",
        options: [
            "它只負責美化 UI 介面",
            "它會自動增加系統的熵值",
            "它監測代碼熵值並在過高時觸發自動重構 (Entropy Reduction)",
            "它是一個人工審核流程"
        ],
        correctAnswer: 2,
        explanation: "進化引擎負責監測系統複雜度，並透過自動化手段降低熵值，確保系統的長期穩定與純淨。"
    }
];

interface BerkeleyExamProps {
    courseId: number;
    onComplete: (score: number) => void;
}

export const BerkeleyExam: React.FC<BerkeleyExamProps> = ({ courseId, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const handleOptionSelect = (index: number) => {
        if (showResult) return;
        setSelectedOption(index);
    };

    const handleNext = () => {
        if (selectedOption === null) return;

        if (selectedOption === questions[currentStep].correctAnswer) {
            setScore(prev => prev + 1);
        }

        setShowResult(true);

        setTimeout(() => {
            if (currentStep < questions.length - 1) {
                setCurrentStep(prev => prev + 1);
                setSelectedOption(null);
                setShowResult(false);
            } else {
                setIsFinished(true);
                onComplete(score + (selectedOption === questions[currentStep].correctAnswer ? 1 : 0));
            }
        }, 2500);
    };

    if (isFinished) {
        const finalScore = (score / questions.length) * 100;
        const passed = finalScore >= 80;

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 rounded-[3rem] bg-white/5 border border-white/10 liquid-glass text-center space-y-8"
            >
                <div className="flex justify-center">
                    {passed ? (
                        <div className="p-6 bg-gold/20 rounded-full text-gold animate-bounce shadow-[0_0_40px_rgba(255,215,0,0.3)]">
                            <Award size={64} />
                        </div>
                    ) : (
                        <div className="p-6 bg-red-500/20 rounded-full text-red-500">
                            <XCircle size={64} />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase">
                        {passed ? "Certification Granted" : "Review Required"}
                    </h3>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                        Your Score: {Math.round(finalScore)}%
                    </p>
                </div>

                <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                    {passed
                        ? "恭喜！您已成功通過認證。5T 誠信勳章已派發至您的「個人數位分身」，這項資產已正式封印於 Celestial 核心。"
                        : "本次未達合格標準（80%）。建議再次複習相關知識點，Dr. Thoth 隨時準備為您解答疑問。"}
                </p>

                <div className="pt-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                        {passed ? "Return to Academy" : "Retry Certification"}
                    </button>
                </div>
            </motion.div>
        );
    }

    const currentQuestion = questions[currentStep];

    return (
        <div className="p-12 rounded-[3rem] bg-white/5 border border-white/10 liquid-glass space-y-10 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <BrainCircuit size={120} />
            </div>

            {/* Header */}
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <span className="text-[10px] font-black text-gold uppercase tracking-widest">Certification Exam</span>
                    <h3 className="text-2xl font-black text-white italic tracking-tight">Question {currentStep + 1}/{questions.length}</h3>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-500 block uppercase">Accuracy Level</span>
                    <span className="text-xl font-black text-gold">{Math.round((score / (currentStep || 1)) * 100)}%</span>
                </div>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
                <p className="text-xl font-bold text-white leading-relaxed">
                    {currentQuestion.text}
                </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option, idx) => {
                    let style = "bg-white/5 border-white/10 text-gray-400";
                    if (selectedOption === idx) {
                        if (showResult) {
                            style = idx === currentQuestion.correctAnswer
                                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                                : "bg-red-500/20 border-red-500/40 text-red-500";
                        } else {
                            style = "bg-gold/10 border-gold/40 text-gold";
                        }
                    } else if (showResult && idx === currentQuestion.correctAnswer) {
                        style = "bg-emerald-500/20 border-emerald-500/40 text-emerald-400";
                    }

                    return (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleOptionSelect(idx)}
                            disabled={showResult}
                            className={`p-6 rounded-2xl border text-left text-sm font-bold transition-all flex items-center justify-between group ${style}`}
                        >
                            <span>{option}</span>
                            {showResult && idx === currentQuestion.correctAnswer && <CheckCircle2 size={18} className="text-emerald-400" />}
                        </motion.button>
                    );
                })}
            </div>

            {/* Result Overlay */}
            <AnimatePresence>
                {showResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-6 rounded-2xl bg-[#63a6b0]/10 border border-[#63a6b0]/20 flex gap-4 items-start animate-in fade-in slide-in-from-bottom-2"
                    >
                        <Zap className="w-5 h-5 text-gold shrink-0 mt-1" />
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-[#63a6b0] uppercase tracking-widest">Sentient Feedback</p>
                            <p className="text-sm font-medium text-gray-300 leading-relaxed">{currentQuestion.explanation}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <div className="pt-6 flex justify-between items-center border-t border-white/5">
                <div className="flex gap-1">
                    {questions.map((_, i) => (
                        <div key={i} className={`h-1 w-8 rounded-full transition-all ${i === currentStep ? "bg-gold" : i < currentStep ? "bg-emerald-500" : "bg-white/10"}`} />
                    ))}
                </div>
                <button
                    onClick={handleNext}
                    disabled={selectedOption === null || showResult}
                    className="px-8 py-3 rounded-xl bg-gold text-black text-[10px] font-black uppercase tracking-widest hover:bg-gold/80 transition-all flex items-center gap-2 disabled:opacity-30"
                >
                    Confirm Answer <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
};
