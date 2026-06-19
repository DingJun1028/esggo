"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Sparkles, Wand2, FileText, CheckCircle2, AlertCircle, Loader2, Bot } from "lucide-react";
import { useAppContext } from "@/lib/context/app-context";

export function OmniSidebar() {
    const { isOmniOpen, setIsOmniOpen, setActiveTab: setGlobalActiveTab, geminiApiKey } = useAppContext();
    const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
        { role: "ai", content: "您好，我是 Omni 數據助理。我已準備好為您提供全方位的 ESG 數據分析與合規建議。請問今天有什麼我可以幫您的？" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isGenerating]);

    if (!isOmniOpen) return null;

    const handleSend = async () => {
        if (!inputValue.trim() || isGenerating) return;

        const userMsg = inputValue;
        const currentHistory = [...messages];

        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setInputValue("");
        setIsGenerating(true);

        try {
            const res = await fetch("/api/genkit/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: userMsg,
                    history: currentHistory.map(m => ({
                        role: m.role === "user" ? "user" : "model",
                        content: m.content
                    })),
                    apiKey: geminiApiKey,
                }),
            });

            if (!res.ok) throw new Error("Failed to fetch response");
            const data = await res.json();

            setMessages(prev => [...prev, {
                role: "ai",
                content: data.result || "抱歉，分析引擎目前無回應。"
            }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, {
                role: "ai",
                content: "⚠️ 數據鏈結中斷。請檢查您的網路連線或稍後再試。"
            }]);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <AnimatePresence>
            {isOmniOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-black/5 md:bg-black/20 backdrop-blur-sm"
                        onClick={() => setIsOmniOpen(false)}
                    />

                    {/* Sidebar Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 z-[120] w-full max-w-full md:w-[450px] h-full bg-background border-l border-outline-variant/30 shadow-massive flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-outline-variant/30 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-[20px] bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                    <Sparkles className="w-6 h-6 animate-pulse" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-primary tracking-tighter uppercase font-headline">Omni 數據助理 / Omni Assistant</h2>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <p className="text-[10px] text-primary/40 font-black tracking-widest uppercase">已驗證 AI 引擎運作中 / Verified AI Engine Active</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOmniOpen(false)}
                                className="p-3 hover:bg-surface-container rounded-2xl transition-all active:scale-90 border border-outline-variant/30"
                            >
                                <X className="w-6 h-6 text-primary/60" />
                            </button>
                        </div>

                        {/* Chat Content */}
                        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-8 hide-scrollbar bg-surface-container/10">
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-outline-variant/30",
                                        m.role === 'user' ? "bg-primary text-on-primary" : "bg-surface-container text-primary"
                                    )}>
                                        {m.role === 'user' ? <span className="text-[10px] font-black uppercase">Me</span> : <Bot className="w-5 h-5" />}
                                    </div>
                                    <div className={cn(
                                        "max-w-[85%] p-5 rounded-[28px] text-[13px] leading-relaxed font-bold transition-all shadow-sm",
                                        m.role === 'user'
                                            ? "bg-primary text-on-primary rounded-tr-none"
                                            : "bg-background border border-outline-variant/50 text-on-surface rounded-tl-none"
                                    )}>
                                        {m.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isGenerating && (
                                <div className="flex items-center gap-4 ml-14">
                                    <Loader2 className="w-5 h-5 animate-spin text-primary/40" />
                                    <span className="text-[10px] font-black text-primary/30 uppercase tracking-[0.3em]">Omni 正在合成數據... / Omni is synthesizing data...</span>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-8 border-t border-outline-variant/30 bg-background">
                            <div className="flex flex-wrap gap-3 mb-6">
                                <button
                                    onClick={() => setInputValue("請檢查我的數據狀況")}
                                    className="px-4 py-2 rounded-full border border-outline-variant text-[10px] font-black uppercase tracking-widest text-primary/60 hover:bg-primary/5 hover:border-primary transition-all"
                                >
                                    數據狀態檢查
                                </button>
                                <button
                                    onClick={() => setInputValue("GRI 305-1 要求說明")}
                                    className="px-4 py-2 rounded-full border border-outline-variant text-[10px] font-black uppercase tracking-widest text-primary/60 hover:bg-primary/5 hover:border-primary transition-all"
                                >
                                    GRI 標準查詢
                                </button>
                            </div>

                            <div className="relative">
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="請輸入專業指令... / Enter professional directive..."
                                    className="w-full bg-surface-container/30 border border-outline-variant/50 rounded-3xl pl-8 pr-16 py-5 min-h-[80px] max-h-[150px] focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all text-sm font-black text-on-surface placeholder:text-primary/20 resize-none overflow-hidden shadow-inner"
                                    rows={1}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isGenerating}
                                    className="absolute right-3 bottom-3 w-12 h-12 bg-primary text-on-primary rounded-[20px] flex items-center justify-center hover:bg-primary-container disabled:opacity-30 transition-all active:scale-95 shadow-lg shadow-primary/20"
                                >
                                    <Send className="w-6 h-6" />
                                </button>
                            </div>
                            <p className="text-center text-[10px] font-black text-primary/20 mt-6 uppercase tracking-[0.4em]">
                                已驗證 5T 誠信協議運作中 / Verified 5T Integrity Protocol Active
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
