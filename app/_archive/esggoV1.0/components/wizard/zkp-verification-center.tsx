"use client";

import React, { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    ShieldCheck,
    Hash,
    Search,
    Upload,
    CheckCircle2,
    AlertCircle,
    Zap,
    Loader2,
    Database,
    Lock,
    ArrowRight,
    ClipboardCheck,
    Globe2
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ZKPVerificationCenter() {
    const [verifyStatus, setVerifyStatus] = useState<"idle" | "scanning" | "verified" | "error">("idle");
    const [hashInput, setHashInput] = useState("");
    const [scanProgress, setScanProgress] = useState(0);
    const [scanMessage, setScanMessage] = useState("");
    const [hasFile, setHasFile] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Pre-calculate stable random positions for particles to maintain purity
    const particles = useMemo(() => {
        return [...Array(6)].map(() => ({
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50
        }));
    }, []);

    const handleVerify = async () => {
        if (!hashInput && !fileInputRef.current?.files?.length) return;

        setVerifyStatus("scanning");
        setScanProgress(0);

        const steps = [
            { p: 15, m: "📡 [NETWORK] Establishing encrypted tunnel to Omni Heart (Verifiable Compute Node)..." },
            { p: 35, m: "🔐 [CIRCUIT] Compiling R1CS constraints & Generating QAP witness..." },
            { p: 55, m: "🧮 [SNARK] Executing Groth16 Prover via WASM backend..." },
            { p: 80, m: "🧬 [HASH] Validating Merkle Inclusion Proof (Leaf Index: 0x7a2f)..." },
            { p: 100, m: "✅ [SUCCESS] Zero-Knowledge Proof verified. Integrity: 100%." }
        ];

        for (const step of steps) {
            setScanMessage(step.m);
            // Simulate scan animation
            let startP = scanProgress;
            const targetP = step.p;
            while (startP < targetP) {
                startP += 2;
                setScanProgress(startP);
                await new Promise(r => setTimeout(r, 30));
            }
            await new Promise(r => setTimeout(r, 300));
        }

        setVerifyStatus("verified");
    };

    const handleReset = () => {
        setVerifyStatus("idle");
        setHashInput("");
        setScanProgress(0);
        setHasFile(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto p-4 lg:p-8">
            {/* Visual Identity Section */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-black/5 border border-black/10 backdrop-blur-md">
                    <Globe2 size={14} className="text-primary-teal-start animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest uppercase text-stone-500 font-sans">Omni_Audit_Terminal_v4.3</span>
                </div>
                <h1 className="text-4xl font-black text-stitch-text tracking-tighter">
                    5T+ZKP <span className="text-primary-teal-start">終端檢驗系統</span>
                </h1>
                <p className="text-sm font-bold text-stone-400 max-w-xl mx-auto leading-relaxed">
                    透過零知識證明 (Zero-Knowledge Proofs) 技術，在不洩露原始文件內容的前提下，
                    驗證數據是否符合 ESG GO 5T 誠信存證標準。
                </p>
            </div>

            {/* Main Terminal Interface */}
            <GlassCard className="p-10 bg-white/80 border-stone-200/50 shadow-2xl relative overflow-hidden group">
                {/* Enterprise Matte Background Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-teal-start/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                {/* Prism Shimmer Overlays */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-1000 bg-gradient-to-tr from-stitch-teal-start via-purple-500 to-primary-gold blur-[100px] animate-pulse" />

                <AnimatePresence mode="wait">
                    {verifyStatus === "idle" ? (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 border-b border-stone-100 pb-2">
                                    <Hash size={18} className="text-primary-teal-start" />
                                    <span className="text-xs font-black uppercase tracking-widest text-stitch-text">輸入存證雜湊 (Hash_Target)</span>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={hashInput}
                                        onChange={(e) => setHashInput(e.target.value)}
                                        placeholder="SHA256:..."
                                        className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-6 py-5 font-mono text-sm focus:border-primary-teal-start focus:ring-4 focus:ring-primary-teal-start/10 transition-all outline-none"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary-teal-start transition-colors">
                                        <Search size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex-1 h-[1px] bg-stone-100" />
                                <span className="text-[10px] font-black text-stone-300 uppercase italic">Or Drop Evidence</span>
                                <div className="flex-1 h-[1px] bg-stone-100" />
                            </div>

                            <div
                                className="border-2 border-dashed border-stone-200 rounded-3xl p-10 text-center hover:border-primary-teal-start hover:bg-primary-teal-start/[0.02] transition-all cursor-pointer group/upload"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={(e) => setHasFile(!!e.target.files?.length)}
                                />
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 bg-stone-100 rounded-2xl text-stone-400 group-hover/upload:bg-primary-teal-start group-hover/upload:text-white transition-all shadow-inner">
                                        <Upload size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-stitch-text">上傳原始單據或 PDF</h3>
                                        <p className="text-[10px] font-bold text-stone-400 mt-1 uppercase tracking-tighter">系統將自動計算雜湊並進行 ZKP 比對</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleVerify}
                                disabled={!hashInput && !hasFile}
                                className="w-full bg-black text-white py-8 rounded-2xl font-black tracking-[0.2em] uppercase text-sm hover:translate-y-[-4px] hover:shadow-2xl transition-all shadow-xl disabled:opacity-30"
                            >
                                開始誠信驗證 (EXECUTE_VERIFY)
                            </Button>
                        </motion.div>
                    ) : verifyStatus === "scanning" ? (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-12 space-y-10"
                        >
                            <div className="flex flex-col md:flex-row items-center gap-12">
                                <div className="space-y-6 flex-1 text-center md:text-left">
                                    <div className="relative inline-block">
                                        {/* Scanning Grid Background */}
                                        <div className="absolute inset-[-40px] opacity-20 pointer-events-none overflow-hidden">
                                            <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                                            <motion.div
                                                animate={{ top: ['0%', '100%', '0%'] }}
                                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                                className="absolute left-0 right-0 h-[2px] bg-primary-teal-start/50 blur-[2px]"
                                            />
                                        </div>

                                        <div className="w-32 h-32 rounded-full border-4 border-stone-100 flex items-center justify-center relative bg-white/50 backdrop-blur-sm shadow-inner overflow-hidden">
                                            <Loader2 className="animate-spin text-primary-teal-start" size={48} />
                                            {/* Data Particles */}
                                            {particles.map((p, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{
                                                        opacity: [0, 1, 0],
                                                        scale: [0, 1, 0],
                                                        x: [p.x, 0],
                                                        y: [p.y, 0]
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: i * 0.3,
                                                        ease: "easeOut"
                                                    }}
                                                    className="absolute w-1.5 h-1.5 bg-primary-teal-start rounded-full blur-[1px]"
                                                />
                                            ))}
                                        </div>
                                        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-teal-start rounded-full animate-ping opacity-20" />
                                    </div>

                                    <div className="space-y-3 relative z-10">
                                        <div className="text-4xl font-black text-stitch-text font-serif italic tracking-tighter">{scanProgress}%</div>
                                        <p className="text-[10px] font-black tracking-[0.2em] text-primary-teal-start transition-all uppercase">{scanMessage}</p>
                                        <div className="max-w-xs h-1.5 bg-stone-100 rounded-full overflow-hidden mt-4 mx-auto md:mx-0 shadow-inner">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-primary-teal-start to-emerald-400 shadow-[0_0_15px_rgba(45,212,191,0.6)]"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${scanProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Terminal Console */}
                                <div className="flex-1 w-full bg-black/90 rounded-2xl p-6 font-mono text-[10px] space-y-2 border border-white/10 shadow-2xl min-h-[200px] overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary-teal-start/5 to-transparent pointer-events-none" />
                                    <div className="flex items-center justify-between text-stone-500 mb-4 border-b border-white/5 pb-2 uppercase font-black text-[8px] tracking-widest">
                                        <span>ZKP_Verify_Stream</span>
                                        <span className="animate-pulse">Active</span>
                                    </div>
                                    <div className="space-y-1.5 opacity-80">
                                        <p className="text-emerald-500 flex items-center gap-2">
                                            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                            [SUCCESS] Secure tunnel established: CURVE_BN254_G1.
                                        </p>
                                        <p className="text-sky-400 font-bold">[SYSTEM] Fetching Merkle Roots via RPC...</p>
                                        {scanProgress > 20 && <p className="text-stone-400">[ZK_CIRCUIT] Compiling R1CS with Groth16. Constraints: 142k...</p>}
                                        {scanProgress > 35 && <p className="text-purple-400">[WITNESS] Map reduction: Input values mapped to private signals.</p>}
                                        {scanProgress > 50 && <p className="text-yellow-500 font-bold">[PROVER] Large-scale scalar multiplication in progress...</p>}
                                        {scanProgress > 65 && <p className="text-emerald-400">[SUCCESS] Proof generated: [π_A, π_B, π_C, public_signals].</p>}
                                        {scanProgress > 80 && <p className="text-stitch-teal-start font-black">[CONSENSUS] Threshold signature verified by 12/12 validators.</p>}
                                        {scanProgress > 95 && <p className="text-white bg-stitch-teal-start/20 px-1 inline-block">[FINALIZE] Transaction anchored to Layer-1 State Root.</p>}
                                        <motion.div
                                            animate={{ opacity: [1, 0, 1] }}
                                            transition={{ repeat: Infinity, duration: 0.8 }}
                                            className="w-1.5 h-3 bg-primary-teal-start inline-block align-middle ml-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="verified"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="py-10 space-y-10"
                        >
                            <div className="flex items-center gap-6 p-8 bg-primary-teal-start/5 border border-primary-teal-start/20 rounded-3xl relative overflow-hidden group/success">
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="w-20 h-20 rounded-full bg-primary-teal-start flex items-center justify-center text-white shadow-massive relative z-10"
                                >
                                    <CheckCircle2 size={40} />
                                    {/* Geometric Seal Pulse */}
                                    <div className="absolute inset-0 rounded-full border border-primary-teal-start animate-ping opacity-30" />
                                </motion.div>
                                <div className="space-y-1 relative z-10">
                                    <h3 className="text-2xl font-black text-stitch-text tracking-tighter">
                                        驗證通過 <span className="text-primary-teal-start italic underline decoration-2 decoration-primary-teal-start/30 underline-offset-4">Trinity_Shield_Verified</span>
                                    </h3>
                                    <p className="text-xs font-bold text-stone-500 tracking-tight leading-relaxed max-w-lg">
                                        此數據已通過 5T 誠信協議驗證，零知識證明 (ZKP) 指紋與原始鏈上紀錄完美一致。具備不可篡改之法律級存證效力。
                                    </p>
                                </div>
                                {/* Hexagon Decorative Pattern */}
                                <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none group-hover/success:opacity-10 transition-opacity">
                                    <Globe2 size={120} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="text-[10px] font-black uppercase text-stone-400 tracking-widest border-b border-stone-100 pb-2">檢驗報告詳解 (Technical_Metadata)</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { label: "存證單元", value: "經營者永續聲明 (Chapter_1.01)", icon: Database },
                                        { label: "信度評分", value: "99.8 / 100", icon: Zap },
                                        { label: "UCC Hash", value: "SHA256:0x8f3c...d9a2", icon: Hash },
                                        { label: "存證鏈結", value: "Linked_Chain_Optimal", icon: Lock }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 shadow-sm">
                                            <div className="p-2 bg-white rounded-xl text-stone-400 shadow-sm">
                                                <item.icon size={16} />
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-black uppercase text-stone-400">{item.label}</div>
                                                <div className="text-[11px] font-bold text-stitch-text">{item.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    onClick={handleReset}
                                    variant="wireframe"
                                    className="flex-1 border-2 border-stone-200 py-6 rounded-2xl font-black text-xs uppercase tracking-widest text-stone-500 hover:bg-stone-50"
                                >
                                    重設終端 (RESET)
                                </Button>
                                <Button
                                    className="flex-2 bg-primary-teal-start text-white py-6 px-10 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary-teal-start/20"
                                >
                                    <div className="flex items-center gap-2">
                                        <ClipboardCheck size={16} />
                                        <span>下載驗證憑證 (D-CERT)</span>
                                    </div>
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </GlassCard>
        </div>
    );
}
