"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    LogIn, Shield, Mail, Lock, Eye, EyeOff,
    ArrowRight, Users, Globe, CheckCircle2, KeyRound, AlertCircle,
    Terminal
} from "lucide-react";
import { useAuth } from "@/components/context/auth-context";
import Link from "next/link";

type AuthMode = "login" | "signup" | "reset";

const DataStreamBackground = () => {
    // Stable random seed for the stream
    const streams = useMemo(() => [...Array(12)].map(() => ({
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 10,
        content: Array.from({ length: 100 }, () => Math.random() > 0.5 ? "1" : "0").join("\n")
    })), []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
            <div className="flex justify-around gap-1 h-full w-full">
                {streams.map((stream, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: "-100%" }}
                        animate={{ y: "100%" }}
                        transition={{
                            duration: stream.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: stream.delay
                        }}
                        className="text-[10px] font-mono break-all whitespace-pre-wrap leading-none select-none text-primary-teal-start"
                        style={{ width: "1ch" }}
                    >
                        {stream.content}
                    </motion.div>
                ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-transparent to-slate-50" />
        </div>
    );
};

export const AuthSimulationView = ({ onLogin }: { onLogin: () => void }) => {
    const { loginWithEmail, registerWithEmail, resetPassword, loginWithGoogle, loginAsDeveloper } = useAuth();
    const [mode, setMode] = useState<AuthMode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isDevBypassEnabled, setIsDevBypassEnabled] = useState(false);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            if (mode === "login") {
                if (isDevBypassEnabled) {
                    await loginAsDeveloper();
                } else {
                    await loginWithEmail(email, password);
                }
                onLogin();
            } else if (mode === "signup") {
                await registerWithEmail(email, password, displayName || email.split("@")[0]);
                onLogin();
            } else {
                await resetPassword(email);
                setSuccess("重設密碼郵件已寄出，請檢查您的信箱。");
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "操作失敗，請稍後再試。";
            setError(msg.replace("Firebase: Error (auth/", "").replace(").", "").replace(/-/g, " "));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await loginWithGoogle();
            onLogin();
        } catch (err: any) {
            console.error("Google login failure:", err);
            if (err.code === "auth/popup-blocked") {
                setError("存取被攔截：請在瀏覽器中允許本站的彈出視窗後重試。");
            } else if (err.code === "auth/popup-closed-by-user") {
                setError("登入已取消：您關閉了登入視窗。");
            } else if (err.code === "auth/cancelled-popup-request") {
                setError("請求已取消：請勿重複點擊登入按鈕。");
            } else {
                setError("Google 登入失敗，請確認您的網路連線或稍後再試。");
            }
        } finally {
            setLoading(false);
        }
    };

    const modeLabel = { login: "登入帳號", signup: "建立帳號", reset: "重設密碼" };

    return (
        <div className="flex flex-col items-center justify-center min-h-[90vh] p-6 relative overflow-hidden bg-slate-50">
            <DataStreamBackground />

            {/* Scanning Overlay */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex flex-col items-center justify-center"
                    >
                        <div className="relative w-64 h-64">
                            {/* Geometric Scanner */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-2 border-dashed border-primary-teal-start/30 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-4 border border-stitch-teal-start/20 rounded-full"
                            />

                            {/* Scanning Beam */}
                            <motion.div
                                initial={{ top: "0%" }}
                                animate={{ top: "100%" }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute left-0 right-0 h-[2px] bg-primary-teal-start shadow-[0_0_15px_rgba(45,212,191,0.8)] z-10"
                            />

                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                <Shield className="w-12 h-12 text-primary-teal-start animate-pulse" />
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-1">Identity Syncing</p>
                                    <div className="flex items-center gap-1 justify-center">
                                        <div className="w-1 h-1 bg-primary-teal-start rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1 h-1 bg-primary-teal-start rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1 h-1 bg-primary-teal-start rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Feed */}
                        <div className="mt-12 w-full max-w-xs font-mono text-[9px] text-white/40 space-y-1">
                            <p className="text-primary-teal-start animate-pulse truncate">[SYS] Initialize Secure Handshake: P256_ECDSA...</p>
                            <p className="truncate">[ZKP] Proof parameters verified. Entropy: 0x7fa2...</p>
                            <p className="truncate">[OMNI] Verifying Enterprise Node permissions...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/">
                        <button
                            type="button"
                            className="inline-flex p-3 bg-primary-teal-start/10 rounded-2xl mb-4 hover:bg-primary-teal-start/20 transition-all active:scale-95 group"
                        >
                            <Shield className="w-8 h-8 text-primary-teal-start group-hover:rotate-12 transition-transform" />
                        </button>
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight text-stitch-text uppercase">
                        Omni_Terminal <span className="text-primary-teal-start">v4.3</span>
                    </h1>
                    <p className="text-stitch-text-muted text-[10px] font-black uppercase tracking-[0.3em] mt-2">
                        5T Protocol · ZKP Verified · Enterprise Hardened
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white border border-stitch-border rounded-[32px] shadow-minimal overflow-hidden transition-all hover:shadow-lg hover:shadow-primary-teal-start/5">
                    {/* Mode Tabs */}
                    <div className="flex border-b border-stitch-border">
                        {(["login", "signup"] as AuthMode[]).map(m => (
                            <button
                                key={m}
                                onClick={() => { setMode(m); setError(null); setSuccess(null); }}
                                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${mode === m
                                    ? "text-primary-teal-start bg-primary-teal-start/5 border-b-2 border-primary-teal-start"
                                    : "text-stitch-text-muted hover:text-primary-teal-start hover:bg-slate-50"}`}
                            >
                                {m === "login" ? "登入" : "註冊"}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            <motion.form
                                key={mode}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={handleEmailAuth}
                                className="space-y-4"
                            >
                                {/* Display Name (signup only) */}
                                {mode === "signup" && (
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-stitch-text-muted mb-1.5">
                                            顯示名稱
                                        </label>
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={e => setDisplayName(e.target.value)}
                                            placeholder="您的名稱"
                                            className="w-full px-4 py-3.5 rounded-xl border border-stitch-border bg-slate-50/50 text-sm font-bold text-stitch-text focus:outline-none focus:border-primary-teal-start focus:bg-white transition-all shadow-minimal-inset"
                                        />
                                    </div>
                                )}

                                {/* Email */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-stitch-text-muted mb-1.5">
                                        電子郵件
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stitch-text-muted" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                            placeholder="you@company.com"
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-stitch-border bg-slate-50/50 text-sm font-bold text-stitch-text focus:outline-none focus:border-primary-teal-start focus:bg-white transition-all shadow-minimal-inset"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                {mode !== "reset" && (
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-stitch-text-muted">
                                                密碼
                                            </label>
                                            {mode === "login" && (
                                                <button
                                                    type="button"
                                                    onClick={() => { setMode("reset"); setError(null); }}
                                                    className="text-[10px] font-black text-primary-teal-start uppercase tracking-widest hover:underline"
                                                >
                                                    忘記密碼？
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stitch-text-muted" />
                                            <input
                                                type={showPwd ? "text" : "password"}
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                required
                                                minLength={6}
                                                placeholder="••••••••"
                                                className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-stitch-border bg-slate-50/50 text-sm font-bold text-stitch-text focus:outline-none focus:border-primary-teal-start focus:bg-white transition-all shadow-minimal-inset"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPwd(!showPwd)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-stitch-text-muted hover:text-stitch-text"
                                            >
                                                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Error / Success */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                            className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold">
                                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            {error}
                                        </motion.div>
                                    )}
                                    {success && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                            className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 font-bold">
                                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            {success}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Developer Bypass Toggle */}
                                {mode === "login" && (
                                    <div className="flex items-center gap-3 px-1 py-2 group cursor-pointer" onClick={() => setIsDevBypassEnabled(!isDevBypassEnabled)}>
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isDevBypassEnabled ? "bg-primary-teal-start border-primary-teal-start shadow-sm" : "border-stitch-border bg-slate-50 hover:border-primary-teal-start"}`}>
                                            {isDevBypassEnabled && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <label className="text-[10px] font-black text-stitch-text-muted uppercase tracking-[0.2em] cursor-pointer group-hover:text-primary-teal-start transition-colors leading-none">
                                            開發者模式：免密碼快速進入
                                        </label>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-stitch-text text-white rounded-xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50 shadow-minimal"
                                >
                                    {loading ? (
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <KeyRound className="w-4 h-4" />
                                            {modeLabel[mode]}
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                {/* Back to login from reset */}
                                {mode === "reset" && (
                                    <button type="button" onClick={() => setMode("login")}
                                        className="w-full text-center text-[10px] font-black uppercase tracking-widest text-stitch-text-muted hover:text-primary-teal-start transition-colors">
                                        ← 返回登入頁面
                                    </button>
                                )}
                            </motion.form>
                        </AnimatePresence>

                        {mode !== "reset" && (
                            <>
                                {/* Divider */}
                                <div className="flex items-center gap-4 my-8">
                                    <div className="flex-1 h-px bg-stitch-border/50" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-stitch-text-muted">OR</span>
                                    <div className="flex-1 h-px bg-stitch-border/50" />
                                </div>

                                {/* Google Sign In - Optimized for Enterprise Branding */}
                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="w-full py-4 bg-white border border-[#dadce0] rounded-xl font-bold text-sm text-[#3c4043] flex items-center justify-center gap-3 transition-all hover:bg-[#f8f9fa] hover:border-[#d2e3fc] hover:shadow-sm active:scale-[0.98] disabled:opacity-50 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-primary-teal-start/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 z-10">
                                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.715 -3.333 49.919 -3.475 49.13 L -14.509 49.13 L -14.509 53.649 L -8.243 53.649 C -8.513 55.088 -9.395 56.348 -10.603 57.172 L -10.603 60.103 L -6.657 60.103 C -4.348 58.005 -3.264 54.895 -3.264 51.509 Z" />
                                            <path fill="#34A853" d="M -14.509 63 C -11.4 63 -8.793 61.983 -6.657 60.103 L -10.603 57.172 C -11.667 57.904 -13.013 58.324 -14.509 58.324 C -17.436 58.324 -19.92 56.368 -20.803 53.729 L -24.897 53.729 L -24.897 56.862 C -23.003 60.584 -19.043 63 -14.509 63 Z" />
                                            <path fill="#FBBC05" d="M -20.803 53.729 C -21.033 53.045 -21.161 52.316 -21.161 51.562 C -21.161 50.809 -21.033 50.079 -20.803 49.395 L -20.803 46.262 L -24.897 46.262 C -25.688 47.854 -26.136 49.658 -26.136 51.562 C -26.136 53.467 -25.688 55.271 -24.897 56.862 L -20.803 53.729 Z" />
                                            <path fill="#EA4335" d="M -14.509 44.801 C -12.82 44.801 -11.264 45.377 -10.076 46.495 L -6.559 43.023 C -8.788 40.97 -11.42 39.865 -14.509 39.865 C -19.043 39.865 -23.003 42.28 -24.897 46.002 L -20.803 49.135 C -19.92 46.495 -17.436 44.801 -14.509 44.801 Z" />
                                        </g>
                                    </svg>
                                    <span className="z-10 tracking-tight">使用 Google 帳號登入</span>
                                </button>

                                <div className="space-y-3 mt-4">
                                    <DeveloperBypassButton onLogin={onLogin} loginAsDeveloper={loginAsDeveloper} />

                                    <Link href="/dev" className="block">
                                        <button className="w-full py-3.5 bg-primary-teal-start/5 border border-primary-teal-start/20 rounded-xl font-black text-xs text-primary-teal-start uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-primary-teal-start/10 active:scale-[0.98]">
                                            <Terminal className="w-4 h-4" />
                                            進入開發者維運中心 (Dev Portal)
                                        </button>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center gap-6 mt-10">
                    <div className="flex flex-col items-center gap-1 opacity-20 text-[9px] font-black uppercase tracking-[0.2em]">
                        <Users className="w-4 h-4" />
                        <span>Enterprise Native</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-20 text-[9px] font-black uppercase tracking-[0.2em]">
                        <Globe className="w-4 h-4" />
                        <span>Sovereign Data</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-20 text-[9px] font-black uppercase tracking-[0.2em]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>5T Certified</span>
                    </div>
                </div>
                <p className="text-center text-[9px] text-stitch-text-muted mt-6 font-black uppercase tracking-[0.3em] opacity-40">
                    Sovereign ESG Terminal · ZK-Privacy · Trustless
                </p>
            </motion.div>
        </div>
    );
};

const DeveloperBypassButton = ({ onLogin, loginAsDeveloper }: { onLogin: () => void; loginAsDeveloper: () => Promise<void> }) => {
    const [loading, setLoading] = useState(false);

    const handleDeveloperLogin = async () => {
        setLoading(true);
        try {
            await loginAsDeveloper();
            onLogin();
        } catch (error) {
            console.error("Developer login failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDeveloperLogin}
            disabled={loading}
            className="w-full py-3.5 bg-primary-gold/5 border border-primary-gold/30 rounded-xl font-black text-xs text-primary-gold uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-primary-gold/10 active:scale-[0.98] disabled:opacity-50 shadow-minimal"
        >
            {loading ? (
                <span className="w-4 h-4 border-2 border-primary-gold/30 border-t-primary-gold rounded-full animate-spin" />
            ) : (
                <>
                    <Shield className="w-4 h-4" />
                    開發者快速登入 (Admin Bypass)
                </>
            )}
        </button>
    );
};
