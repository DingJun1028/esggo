"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareModalProps {
    isOpen: boolean;
    url: string;
    onClose: () => void;
}

export function ShareModal({ isOpen, url, onClose }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
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
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 pointer-events-auto relative"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-stitch-teal-start/10 flex items-center justify-center text-stitch-teal-start">
                                    <Share2 size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-stitch-text tracking-tight">報告歸檔成功</h2>
                                    <p className="text-[10px] text-stitch-muted uppercase tracking-widest font-bold">Share & Download</p>
                                </div>
                            </div>

                            <p className="text-sm text-stitch-muted mb-4 font-medium">
                                您的報告已成功產生並上傳至雲端金庫，這是一組具備時效性的安全分享連結：
                            </p>

                            <div className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-200 rounded-xl mb-6">
                                <input readOnly value={url} className="flex-1 bg-transparent border-none text-xs text-stone-600 font-mono focus:ring-0 px-2 outline-none truncate" />
                                <Button variant="wireframe" onClick={handleCopy} className="px-3 py-1.5 text-xs h-auto shrink-0 border-stone-300 text-stone-600 hover:bg-stone-100">
                                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                    {copied ? "已複製" : "複製連結"}
                                </Button>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="solid" onClick={() => window.open(url, "_blank")} className="flex-1 w-full">
                                    <Download size={16} />
                                    下載 PDF 檔案
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}