"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mic, Volume2, ShieldCheck, Sparkles, MessageSquare, Square } from "lucide-react";
import { useAppContext } from "@/lib/context/app-context";

export function DailyBriefingOverlay() {
    const { isDailyBriefingOpen, setIsDailyBriefingOpen, lang } = useAppContext();
    const [step, setStep] = useState(0);
    const [isInterrupting, setIsInterrupting] = useState(false);
    const [isAsking, setIsAsking] = useState(false);
    const [transcript, setTranscript] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [isGenerating, setIsGenerating] = useState(false);

    const generateBriefing = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch("/api/genkit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    flowName: "omniFlow",
                    input: {
                        text: "請為 ESG GO 產出簡潔的今日數據簡報範疇，包含：1. 關鍵核心指標變動 2. 數據異常預警 3. 戰略合規行動建議。請維持專業中性的口吻。",
                        persona: {
                            name: "Omni 數據引擎",
                            title: "專業合規導師",
                            description: "我是 Omni 數據助理，負責提供專業的 ESG 數據核閱與合規建議。"
                        }
                    }
                }),
            });
            const data = await res.json();
            const summary = data.result || "抱歉，目前數據簡報引擎暫時無法連線。";

            // Split by common delimiters to simulate the streaming steps
            const parts = summary.split(/[。！\n]/).filter((p: string) => p.trim().length > 0);
            setTranscript([parts[0]]);

            let i = 1;
            const interval = setInterval(() => {
                if (i < parts.length) {
                    setTranscript(t => [...t, parts[i]]);
                    setStep(i);
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 3000);

            return () => clearInterval(interval);
        } catch (err) {
            console.error("Briefing Error:", err);
            setTranscript(["抱歉，目前 Omni 服務連線狀況不稳定。"]);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleInterruption = async () => {
        setIsAsking(true);
        try {
            const res = await fetch("/api/genkit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    flowName: "omniFlow",
                    input: {
                        text: "用戶中斷了簡報。請針對其問題進行回答並引導回到簡報流程。",
                        persona: {
                            name: "Omni 數據引擎",
                            title: "專業合規導師",
                            description: "我是 Omni 數據助理，負責提供專業的 ESG 數據核閱與合規建議。"
                        }
                    }
                }),
            });
            const data = await res.json();
            const answer = data.result || "正在聽取您的指令，請稍候。";
            setTranscript(prev => [...prev, "正在聽取您的指令...", answer]);
        } catch (err) {
            console.error("Interruption Error:", err);
        } finally {
            setIsAsking(false);
            setIsInterrupting(false);
        }
    };

    useEffect(() => {
        if (isDailyBriefingOpen) {
            generateBriefing();
        } else {
            setTranscript([]);
            setStep(0);
        }
    }, [isDailyBriefingOpen, lang]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [transcript]);

    if (!isDailyBriefingOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-2xl flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden"
            >
                {/* Background Aura */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 left-1/4 w-full md:w-[500px] h-[500px] bg-stitch-teal-start/20 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.1, 0.15, 0.1]
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-1/4 right-1/4 w-full md:w-[600px] h-[600px] bg-stitch-primary/15 rounded-full blur-[120px]"
                    />
                </div>

                {/* Top Controls */}
                <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-lg shadow-black/20">
                            <ShieldCheck className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-stitch-text tracking-tight uppercase">Omni 每日數據簡報</h2>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 " />
                                <p className="text-[10px] text-stitch-text-muted font-bold tracking-widest uppercase opacity-60">PROFESSIONAL_ANALYSIS_ACTIVE</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsDailyBriefingOpen(false)}
                        className="p-3 bg-stitch-bg rounded-lg shadow-xl border border-stitch-border hover:bg-stitch-shallow-gray transition-all active:scale-95 group"
                    >
                        <X className="w-6 h-6 text-stitch-text group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                </div>

                {/* Main Omni Visualizer */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-12">
                    {/* Animated Rings */}
                    {[1, 2, 3].map((r) => (
                        <motion.div
                            key={r}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 0, 0.3],
                                rotate: [0, 180, 360]
                            }}
                            transition={{
                                duration: 4 + r,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: r * 0.5
                            }}
                            className={`absolute border border-black/10 rounded-full`}
                            style={{ width: `${100 + r * 20}%`, height: `${100 + r * 20}%` }}
                        />
                    ))}

                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                            boxShadow: [
                                "0 0 20px rgba(0, 0, 0, 0.1)",
                                "0 0 50px rgba(0, 0, 0, 0.2)",
                                "0 0 20px rgba(0, 0, 0, 0.1)"
                            ]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full h-full rounded-full bg-white border-[12px] border-stitch-bg shadow-2xl overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-[url('https://thumbs4.imagebam.com/e5/b8/6c/ME1B44KB_t.png')] bg-cover bg-center opacity-80 mix-blend-multiply grayscale" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-stitch-teal-start/20 to-transparent mix-blend-overlay" />

                        {/* Audio Waves (Simulated) */}
                        <div className="absolute bottom-1/4 left-0 right-0 flex justify-center items-end gap-1 px-8 h-12">
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        height: [4, Math.random() * 24 + 8, 4]
                                    }}
                                    transition={{
                                        duration: 0.5 + Math.random(),
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="w-1 bg-black rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]"
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Rolling Transcript */}
                <div className="w-full max-w-2xl flex flex-col items-center">
                    <div
                        ref={scrollRef}
                        className="h-32 w-full overflow-y-auto custom-scrollbar flex flex-col gap-4 text-center px-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {transcript.map((text, i) => (
                                <motion.p
                                    key={i}
                                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    className={`text-lg md:text-xl font-black leading-relaxed transition-colors duration-500 ${i === step ? 'text-stitch-text' : 'text-stitch-text-muted/40'}`}
                                >
                                    {text}
                                </motion.p>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Interaction Bar */}
                <div className="mt-12 w-full max-w-lg">
                    <div className="bg-stitch-bg border border-stitch-border rounded-[32px] p-2 flex items-center gap-2 shadow-2xl relative">
                        {isInterrupting && (
                            <div className="absolute -top-12 left-0 right-0 text-center animate-bounce">
                                <span className="text-[10px] font-black text-stitch-teal-start uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-black/5 shadow-minimal">
                                    Awaiting data instruction...
                                </span>
                            </div>
                        )}

                        <button
                            onMouseDown={() => setIsInterrupting(true)}
                            onMouseUp={handleInterruption}
                            disabled={isAsking}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isAsking ? 'bg-stitch-shallow-gray' : isInterrupting ? 'bg-stitch-critical text-white scale-90 ring-8 ring-stitch-critical/10' : 'bg-black text-white hover:bg-black/90 shadow-lg shadow-black/10'}`}
                        >
                            {isAsking ? <Sparkles className="w-5 h-5 animate-spin" /> : isInterrupting ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-6 h-6" />}
                        </button>

                        <div className="flex-1 px-4">
                            <input
                                type="text"
                                placeholder={lang === "zh" ? "請輸入專業指令..." : "Enter professional directive..."}
                                className="w-full bg-transparent border-none focus:ring-0 text-sm font-black text-stitch-text"
                                onFocus={() => setIsInterrupting(true)}
                                onBlur={() => setIsInterrupting(false)}
                            />
                        </div>

                        <div className="flex items-center gap-2 pr-2">
                            <div className="p-3 bg-stitch-shallow-gray/50 rounded-lg text-stitch-text-muted">
                                <Volume2 className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-8 mt-6">
                        <div className="flex items-center gap-2 opacity-50 font-black">
                            <ShieldCheck className="w-4 h-4 text-black" />
                            <span className="text-[10px] text-stitch-text tracking-widest uppercase">Professional Grade Privacy</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-50 font-black">
                            <MessageSquare className="w-4 h-4 text-black" />
                            <span className="text-[10px] text-stitch-text tracking-widest uppercase">Verified Omni Core</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

