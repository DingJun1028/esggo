"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Rocket,
    ShieldCheck,
    Zap,
    ChevronRight,
    ArrowRight,
    Lock,
    CheckCircle2,
    Database,
    Fingerprint,
    Search,
    Share2,
    Cpu,
    Target
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

interface ProtocolInfo {
    id: string;
    char: string;
    attr: string;
    status: string;
    meaning: { en: string; zh: string };
    icon: any;
}

const T5_PROTOCOL: ProtocolInfo[] = [
    {
        id: "T1",
        char: "真",
        attr: "Truthful",
        status: "Traceable",
        meaning: { en: "原始數據的可溯源性與鏈狀路徑", zh: "原始數據的可溯源性與鏈狀路徑" },
        icon: Database
    },
    {
        id: "T2",
        char: "善",
        attr: "Thankful",
        status: "Transparent",
        meaning: { en: "算法透明度與 ISO-14064-1 驗算", zh: "算法透明度與 ISO-14064-1 驗算" },
        icon: Search
    },
    {
        id: "T3",
        char: "美",
        attr: "Tasteful",
        status: "Tangible",
        meaning: { en: "Enterprise Matte 極簡高密度視覺語言", zh: "Enterprise Matte 極簡高密度視覺語言" },
        icon: Target
    },
    {
        id: "T4",
        char: "信",
        attr: "Trustful",
        status: "Trustworthy",
        meaning: { en: "SHA-256 Hash Lock 不可篡改禁區", zh: "SHA-256 Hash Lock 不可篡改禁區" },
        icon: ShieldCheck
    },
    {
        id: "T5",
        char: "通",
        attr: "Transferful",
        status: "Trackable",
        meaning: { en: "全程記錄數據的流動與生命週期", zh: "全程記錄數據的流動與生命週期" },
        icon: Share2
    }
];

export function PlatformIntroView() {
    const [activeT, setActiveT] = useState<string | null>(null);

    return (
        <div className="space-y-16 pb-20 max-w-6xl mx-auto px-4 md:px-0">
            {/* Hero Section */}
            <header className="text-center space-y-6 pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-teal-start/10 text-primary-teal-start rounded-full border border-primary-teal-start/20 text-[10px] font-black uppercase tracking-[0.2em]"
                >
                    <ShieldCheck className="w-4 h-4" />
                    v4.3 Enterprise Hardened
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-black text-stitch-text tracking-tight uppercase leading-none"
                >
                    Omni_Terminal <span className="text-primary-teal-start">v4.3</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg font-bold text-stitch-muted max-w-3xl mx-auto tracking-widest leading-relaxed"
                >
                    企業級 ESG 全感知企業管理平台<br />
                    <span className="text-sm opacity-60">Enterprise-Grade Enterprise Sustainability Intelligence</span>
                </motion.p>
            </header>

            {/* Vision Quote */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="relative p-12 rounded-[40px] bg-surface-container/30 border border-outline-variant/30 text-center overflow-hidden group"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-teal-start to-transparent opacity-50" />
                <h2 className="text-xl md:text-2xl font-black text-stitch-text mb-6">🌟 平台願景 (Vision)</h2>
                <p className="text-sm md:text-base text-stitch-muted leading-relaxed max-w-4xl mx-auto font-medium">
                    Omni_Terminal v4.3 致力於為全球企業提供「企業級別」的 ESG 數位治理體驗。我們不只是數據工具，而是透過專屬的 <span className="text-primary-teal-start font-black">5T 絕對誠信協議 (Trust-Bound Protocols)</span>、ZKP (零知識證明) 以及 <span className="text-primary-teal-start font-black">Omni ADK 多代理人 AI 矩陣</span>，將 ESG 報告從單純的合規文件，昇華為具備最高透明度與防篡改價值的「永續智能資產」。
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link href="/login">
                        <Button className="h-14 px-10 rounded-2xl bg-primary-teal-start hover:bg-primary-teal-end text-white font-black uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-primary-teal-start/20 snappy-transition">
                            啟動核心終端 <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* 5T Protocol Matrix */}
            <section className="space-y-10">
                <div className="flex flex-col items-center text-center space-y-2">
                    <h3 className="text-sm font-black text-stitch-text uppercase tracking-[0.3em]">核心哲學：真、善、美、信、通</h3>
                    <div className="w-20 h-1 bg-primary-teal-start/20 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {T5_PROTOCOL.map((protocol) => {
                        const Icon = protocol.icon;
                        const isActive = activeT === protocol.id;

                        return (
                            <motion.div
                                key={protocol.id}
                                onMouseEnter={() => setActiveT(protocol.id)}
                                onMouseLeave={() => setActiveT(null)}
                                className={`relative p-8 rounded-[32px] border-2 transition-all duration-500 cursor-crosshair overflow-hidden group ${isActive
                                        ? "bg-primary-teal-start text-white border-primary-teal-start shadow-xl shadow-primary-teal-start/30 -translate-y-2"
                                        : "bg-white border-stitch-border hover:border-primary-teal-start/30"
                                    }`}
                            >
                                <div className="absolute top-4 right-6 text-6xl font-black opacity-10 italic group-hover:scale-110 transition-transform">
                                    {protocol.char}
                                </div>

                                <div className="space-y-4 relative">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isActive ? "bg-white/20" : "bg-surface-container/50 group-hover:bg-primary-teal-start/10"
                                        }`}>
                                        <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-primary-teal-start"}`} />
                                    </div>

                                    <div>
                                        <div className={`text-[10px] font-black uppercase tracking-widest opacity-60`}>
                                            {protocol.attr}
                                        </div>
                                        <h4 className="text-lg font-black tracking-tight">{protocol.status}</h4>
                                    </div>

                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="text-[11px] font-bold leading-relaxed border-t border-white/20 pt-4"
                                            >
                                                {protocol.meaning.zh}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* Meta Info */}
            <footer className="pt-20 border-t border-stitch-border text-center space-y-6">
                <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                    <div className="flex flex-col items-center gap-1 opacity-40">
                        <Fingerprint className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">SHA-256 Hash Locked</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-40">
                        <Cpu className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Omni ADK Engine</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-40">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">ZKP Proven Privacy</span>
                    </div>
                </div>
                <p className="text-[10px] text-stitch-muted font-bold tracking-widest uppercase">
                    © 2026 Omni ESG Group · Enterprise Sovereign Sustainability Integrity
                </p>
            </footer>
        </div>
    );
}

