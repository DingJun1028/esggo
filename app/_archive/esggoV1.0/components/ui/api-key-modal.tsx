"use client";

import React, { useState } from "react";
import { X, Key, ExternalLink, Sparkles, ShieldCheck, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context/app-context";
import { cn } from "@/lib/utils";

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function ApiKeyModal({ isOpen, onClose, onSuccess }: ApiKeyModalProps) {
    const { geminiApiKey, setGeminiApiKey } = useAppContext();
    const [inputValue, setInputValue] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    // Initialize input value when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setInputValue(geminiApiKey || "");
            setError("");
        }
    }, [isOpen, geminiApiKey]);

    const handleSave = async () => {
        const trimmedKey = inputValue.trim();
        if (!trimmedKey) {
            setError("請輸入 API Key。");
            return;
        }

        if (!trimmedKey.startsWith("AIza")) {
            setError("無效的 API Key 格式。請確保它以 'AIza' 開頭。");
            return;
        }

        setIsSaving(true);
        setError("");

        try {
            // Simulate a secure save delay for better UX
            await new Promise(resolve => setTimeout(resolve, 800));
            setGeminiApiKey(trimmedKey);
            onSuccess?.();
            onClose();
        } catch (err) {
            setError("儲存失敗，請檢查瀏覽器設定。");
        } finally {
            setIsSaving(false);
        }
    };


    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="w-full max-w-lg bg-stitch-surface/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 pointer-events-auto relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-stitch-teal-start via-stitch-teal-end to-stitch-gold" />

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-stitch-muted hover:text-stitch-text hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-stitch-teal-start/20 flex items-center justify-center border border-stitch-teal-start/30">
                                    <Key className="w-5 h-5 text-stitch-teal-start" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-stitch-text tracking-tight">
                                        啟用 AI 導寫引擎 (BYOK)
                                    </h2>
                                    <p className="text-[11px] text-stitch-muted uppercase tracking-widest font-black">
                                        Bring Your Own Key Configuration
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <p className="text-sm text-stitch-muted leading-relaxed">
                                    為確保資料隱私與提供您專屬的生成配額，本平台採用 <strong className="text-stitch-teal-end">BYOK (Bring Your Own Key)</strong> 模式。請輸入您的 Google Gemini API 金鑰來啟用完整 AI 生成功能。
                                </p>

                                <div className="p-4 rounded-xl bg-[#0f1115] border border-white/5 space-y-3">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 text-stitch-gold mt-0.5 shrink-0" />
                                        <div className="text-xs text-stitch-muted">
                                            <span className="font-bold text-stitch-gold block mb-1">如何取得免費金鑰？</span>
                                            1. 點擊下方按鈕前往 Google AI Studio<br />
                                            2. 登入您的 Google 帳號<br />
                                            3. 點擊「Create API Key」並複製該字串
                                        </div>
                                    </div>
                                    <a
                                        href="https://aistudio.google.com/app/apikey"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs text-stitch-teal-end hover:text-stitch-teal-start transition-colors font-medium border-b border-transparent hover:border-stitch-teal-start pb-0.5"
                                    >
                                        前往 Google AI Studio 取得金鑰
                                        <ExternalLink size={12} />
                                    </a>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black tracking-widest text-stitch-muted uppercase">Google Gemini API Key</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={inputValue}
                                            onChange={(e) => {
                                                setInputValue(e.target.value);
                                                setError("");
                                            }}
                                            placeholder="AIzaSy..."
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-stitch-text placeholder:text-stitch-muted/50 focus:outline-none focus:border-stitch-teal-start focus:ring-1 focus:ring-stitch-teal-start transition-all font-mono"
                                        />
                                        {inputValue.startsWith("AIza") && (
                                            <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                        )}
                                    </div>
                                    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                <Button
                                    onClick={onClose}
                                    className="bg-transparent text-stitch-muted hover:text-stitch-text hover:bg-white/5 border-none shadow-none"
                                >
                                    取消
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={!inputValue.trim() || isSaving}
                                    className={cn(
                                        "bg-gradient-to-r from-stitch-teal-start to-stitch-teal-end text-black font-bold border-none shadow-[0_0_15px_rgba(45,212,191,0.3)] min-w-full md:w-[120px]",
                                        isSaving && "opacity-80"
                                    )}
                                >
                                    {isSaving ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                            驗證中...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Sparkles size={16} />
                                            確認並啟用
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
