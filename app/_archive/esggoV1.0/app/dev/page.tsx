"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/auth-context";
import {
    Shield,
    Terminal,
    Zap,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    Copy,
    RefreshCw,
    Database,
    Cpu,
    Globe,
    Lock,
    ChevronRight,
    Code2,
    FlaskConical,
    Layers,
    BarChart3,
} from "lucide-react";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
type BootPhase = "booting" | "authenticating" | "ready" | "error";

interface EnvRow {
    label: string;
    value: string;
    sensitive?: boolean;
}

interface QuickLink {
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
    description: string;
    external?: boolean;
}

interface HealthData {
    status: "healthy" | "degraded" | "loading" | "error";
    timestamp?: string;
    environment?: string;
    services?: {
        server: string;
        firestore: string;
        recaptcha: string;
    };
    latency?: {
        firestore?: string;
        total?: string;
    };
    uptime?: number;
}

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────
const QUICK_LINKS: QuickLink[] = [
    {
        label: "主控台",
        href: "/",
        icon: Layers,
        badge: "LIVE",
        description: "跳至 Omni Terminal 主控台",
    },
    {
        label: "Firebase Console",
        href: "https://console.firebase.google.com",
        icon: Database,
        description: "Firestore / Auth / Functions",
        external: true,
    },
    {
        label: "Data Connect Studio",
        href: "https://console.firebase.google.com",
        icon: Globe,
        description: "GraphQL schema + SDK explorer",
        external: true,
    },
    {
        label: "API Routes",
        href: "/api/health",
        icon: Terminal,
        badge: "REST",
        description: "健康檢查 · /api/health",
    },
    {
        label: "AI / Genkit",
        href: "/api/genkit",
        icon: FlaskConical,
        badge: "GENKIT",
        description: "Genkit flow endpoints",
    },
    {
        label: "系統最佳化",
        href: "/?tab=system-optimization",
        icon: Cpu,
        description: "SystemOptimizationView",
    },
    {
        label: "稽核金庫",
        href: "/?tab=audit-vault",
        icon: Lock,
        description: "AuditVaultView · ZKP",
    },
    {
        label: "功能地圖",
        href: "/?tab=feature-map",
        icon: BarChart3,
        description: "所有模組完成度",
    },
];

const BOOT_MESSAGES = [
    "Initializing 5T forensic kernel…",
    "Mounting developer channel…",
    "Bypassing reCAPTCHA Enterprise…",
    "Injecting anonymous auth token…",
    "Hydrating Omni Terminal…",
    "🚀 Developer channel OPEN",
];

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

const VitalityCard = ({ label, value, status, icon: Icon }: {
    label: string;
    value: string;
    status: "success" | "warning" | "error" | "neutral";
    icon: any;
}) => (
    <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-sm hover:shadow-md transition group">
        <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-stone-50 rounded-lg group-hover:bg-stone-100 transition">
                <Icon className="w-4 h-4 text-stone-600" />
            </div>
            <div className={`w-2 h-2 rounded-full ${status === "success" ? "bg-emerald-500 animate-pulse" :
                status === "warning" ? "bg-amber-500" :
                    status === "error" ? "bg-rose-500" : "bg-stone-300"
                }`} />
        </div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{label}</div>
        <div className="text-sm font-mono font-bold text-stone-800">{value}</div>
    </div>
);

function TerminalBoot({
    messages,
    done,
}: {
    messages: string[];
    done: boolean;
}) {
    return (
        <div className="font-mono text-xs space-y-1.5 text-emerald-400 bg-black rounded-xl p-6 min-h-[140px]">
            {messages.map((msg, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.18 }}
                    className="flex items-center gap-2"
                >
                    <span className="text-emerald-600">›</span>
                    <span>{msg}</span>
                </motion.div>
            ))}
            {!done && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.7 }}
                    className="inline-block w-2 h-4 bg-emerald-400 ml-4"
                />
            )}
        </div>
    );
}

function EnvTable({ rows }: { rows: EnvRow[] }) {
    const [revealed, setRevealed] = useState<Record<string, boolean>>({});

    const copy = (val: string) => {
        navigator.clipboard.writeText(val).catch(() => { });
    };

    return (
        <div className="overflow-x-auto rounded-xl border border-black/5 bg-white shadow-minimal">
            <table className="w-full text-left text-xs">
                <thead>
                    <tr className="border-b border-black/5 bg-stone-50">
                        <th className="px-5 py-3 font-black uppercase tracking-widest text-stone-400">
                            Variable
                        </th>
                        <th className="px-5 py-3 font-black uppercase tracking-widest text-stone-400">
                            Value
                        </th>
                        <th className="px-5 py-3 font-black uppercase tracking-widest text-stone-400 text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                    {rows.map((row) => {
                        const isRevealed = revealed[row.label];
                        const display =
                            row.sensitive && !isRevealed
                                ? "••••••••••••••••"
                                : row.value || "(not set)";
                        return (
                            <tr key={row.label} className="hover:bg-stone-50/60 transition">
                                <td className="px-5 py-3 font-bold text-stone-700 font-mono">
                                    {row.label}
                                </td>
                                <td className="px-5 py-3 text-stone-500 font-mono break-all max-w-[260px]">
                                    {display}
                                </td>
                                <td className="px-5 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {row.sensitive && (
                                            <button
                                                onClick={() =>
                                                    setRevealed((r) => ({
                                                        ...r,
                                                        [row.label]: !isRevealed,
                                                    }))
                                                }
                                                className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-black transition"
                                            >
                                                {isRevealed ? "Hide" : "Reveal"}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => copy(row.value)}
                                            className="p-1.5 rounded-lg hover:bg-stone-100 transition text-stone-400 hover:text-black"
                                            title="Copy"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function QuickLinkCard({ link }: { link: QuickLink }) {
    const Icon = link.icon;
    const router = useRouter();

    const handleClick = () => {
        if (link.external) {
            window.open(link.href, "_blank", "noopener");
        } else if (link.href.startsWith("/?tab=")) {
            // Navigate to main app with a tab preset via query
            router.push("/");
        } else {
            router.push(link.href);
        }
    };

    return (
        <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleClick}
            className="w-full text-left bg-white rounded-xl border border-black/5 p-5 shadow-minimal hover:border-emerald-400/40 hover:shadow-md transition-all group flex items-start gap-4"
        >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-black text-sm text-stone-800 uppercase tracking-tight">
                        {link.label}
                    </span>
                    {link.badge && (
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase tracking-widest">
                            {link.badge}
                        </span>
                    )}
                    {link.external && (
                        <ExternalLink className="w-3 h-3 text-stone-300 ml-auto" />
                    )}
                </div>
                <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wide">
                    {link.description}
                </p>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-200 group-hover:text-emerald-400 transition mt-1 flex-shrink-0" />
        </motion.button>
    );
}

// ──────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────
export default function DevPortalPage() {
    const router = useRouter();
    const { loginAsDeveloper, user } = useAuth();

    const [phase, setPhase] = useState<BootPhase>("booting");
    const [bootMessages, setBootMessages] = useState<string[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [elapsed, setElapsed] = useState(0);

    // Health state
    const [health, setHealth] = useState<HealthData>({ status: "loading" });

    const fetchHealth = async () => {
        try {
            const res = await fetch("/api/health");
            const data = await res.json();
            setHealth(data);
        } catch (err) {
            setHealth({ status: "error" });
        }
    };

    useEffect(() => {
        fetchHealth();
        const interval = setInterval(fetchHealth, 30000); // 30s refresh
        return () => clearInterval(interval);
    }, []);

    // Collect env rows at render time (client-only)
    const envRows: EnvRow[] = [
        {
            label: "APP_ENV",
            value: process.env.NODE_ENV ?? "unknown",
        },
        {
            label: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
            value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
        },
        {
            label: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
            value: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
        },
        {
            label: "NEXT_PUBLIC_GEMINI_API_KEY",
            value: process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "",
            sensitive: true,
        },
        {
            label: "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
            value: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "",
            sensitive: true,
        },
        {
            label: "DEV_UID",
            value: user?.uid ?? "(pending…)",
        },
        {
            label: "DEV_EMAIL",
            value: user?.email ?? "dev-guest@esg-go.com",
        },
    ];

    // ── Boot sequence ──
    useEffect(() => {
        let cancelled = false;
        const start = Date.now();

        const tick = setInterval(() => {
            if (!cancelled) setElapsed(Math.floor((Date.now() - start) / 1000));
        }, 1000);

        const run = async () => {
            // Drip boot messages
            for (let i = 0; i < BOOT_MESSAGES.length; i++) {
                await delay(220 + i * 160);
                if (cancelled) return;
                const msg = BOOT_MESSAGES[i] ?? "";
                setBootMessages((prev) => [...prev, msg]);
            }

            // If already authed, skip the loginAsDeveloper call
            if (!user) {
                setPhase("authenticating");
                try {
                    await loginAsDeveloper();
                } catch (e: unknown) {
                    if (!cancelled) {
                        const msg = e instanceof Error ? e.message : "Unknown auth error";
                        setErrorMsg(msg);
                        setPhase("error");
                        clearInterval(tick);
                        return;
                    }
                }
            }

            if (!cancelled) {
                setPhase("ready");
                clearInterval(tick);
            }
        };

        run();

        return () => {
            cancelled = true;
            clearInterval(tick);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRetry = () => {
        setPhase("booting");
        setBootMessages([]);
        setErrorMsg(null);
        setElapsed(0);
        // Full reload for clean slate
        window.location.reload();
    };

    const handleGoHome = () => router.push("/");

    // ──────────────────────────────────────────────
    // Render
    // ──────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans">
            {/* ── Top Bar ── */}
            <div className="sticky top-0 z-50 bg-black text-white flex items-center justify-between px-6 py-3 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <Code2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest">
                        ESG GO · Developer Portal
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase tracking-widest">
                        v4.3 Internal
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    {phase === "ready" && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            AUTHENTICATED
                        </div>
                    )}
                    <button
                        onClick={handleGoHome}
                        className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-white transition flex items-center gap-1.5"
                    >
                        <Layers className="w-3.5 h-3.5" />
                        主控台
                    </button>
                </div>
            </div>

            <div className="max-w-[1100px] mx-auto px-6 py-12 space-y-10">
                {/* ── Hero ── */}
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-5 h-5 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                Developer Fast-Track · Channel Open
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-black tracking-tighter uppercase leading-none mb-2">
                            Dev Portal
                        </h1>
                        <p className="text-stone-400 text-sm font-medium">
                            零帳號密碼、即時進入 Omni Terminal。僅限開發環境使用。
                        </p>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-3">
                        {phase === "error" && (
                            <button
                                onClick={handleRetry}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[11px] font-black uppercase tracking-widest hover:bg-red-100 transition"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Retry
                            </button>
                        )}
                        {phase === "ready" && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={handleGoHome}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition"
                            >
                                <Zap className="w-4 h-4" />
                                進入主控台
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* ── Boot Terminal ── */}
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3">
                        Boot Sequence
                        {elapsed > 0 && (
                            <span className="ml-2 text-stone-300">[{elapsed}s]</span>
                        )}
                    </p>
                    <TerminalBoot messages={bootMessages} done={phase === "ready"} />
                </div>

                {/* ── Status Banner ── */}
                <AnimatePresence mode="wait">
                    {phase === "error" && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
                        >
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-black text-red-700 uppercase tracking-wide">
                                    Authentication Failed
                                </p>
                                <p className="text-xs text-red-500 font-mono mt-1">
                                    {errorMsg}
                                </p>
                                <p className="text-[10px] font-bold text-red-400 mt-2 uppercase tracking-widest">
                                    嘗試方案：確認 Firebase Anonymous Auth 已在 Console 啟用
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {phase === "ready" && (
                        <motion.div
                            key="ready"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
                        >
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-black text-emerald-700 uppercase tracking-wide">
                                    Developer Session Active
                                </p>
                                <p className="text-xs text-emerald-500 font-mono mt-0.5">
                                    UID: {user?.uid ?? "—"} · Role: developer · Subscription:
                                    enterprise
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* System Vitality / 系統生命體徵 */}
                {phase === "ready" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                    >
                        <VitalityCard
                            label="Server Status"
                            value={health.services?.server || "Checking..."}
                            status={health.status === "healthy" ? "success" : "warning"}
                            icon={Globe}
                        />
                        <VitalityCard
                            label="Firestore Connection"
                            value={health.services?.firestore || "Checking..."}
                            status={health.services?.firestore === "online" ? "success" : "error"}
                            icon={Database}
                        />
                        <VitalityCard
                            label="Uptime"
                            value={health.uptime ? `${Math.floor(health.uptime / 60)} min` : "--"}
                            status="neutral"
                            icon={RefreshCw}
                        />
                        <VitalityCard
                            label="Total Latency"
                            value={health.latency?.total || "--"}
                            status="neutral"
                            icon={Zap}
                        />
                    </motion.div>
                )}


                {/* ── Content (only when ready) ── */}
                <AnimatePresence>
                    {phase === "ready" && (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-10"
                        >
                            {/* Quick Links */}
                            <section>
                                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">
                                    Quick Access
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {QUICK_LINKS.map((link) => (
                                        <QuickLinkCard key={link.label} link={link} />
                                    ))}
                                </div>
                            </section>

                            {/* Environment Inspector */}
                            <section>
                                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">
                                    Environment Inspector
                                </p>
                                <EnvTable rows={envRows} />
                            </section>

                            {/* Bypass Methods */}
                            <section>
                                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">
                                    Developer Bypass Methods
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        {
                                            title: "URL Channel",
                                            code: "/login?channel=dev",
                                            desc: "在登入頁附加 ?channel=dev 參數，自動觸發 loginAsDeveloper()。",
                                            status: "active",
                                        },
                                        {
                                            title: "Shield Icon",
                                            code: "AuthSimulationView → Shield",
                                            desc: "點擊登入頁上方的 Shield 圖示即可直接繞過驗證。",
                                            status: "active",
                                        },
                                        {
                                            title: "Bypass Checkbox",
                                            code: "開發者模式：免帳號密碼快速進入",
                                            desc: "在登入表單底部勾選開發者模式後提交，無需填寫憑證。",
                                            status: "active",
                                        },
                                    ].map((method) => (
                                        <div
                                            key={method.title}
                                            className="bg-white rounded-xl border border-black/5 p-5 shadow-minimal"
                                        >
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-[8px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase tracking-widest">
                                                    {method.status}
                                                </span>
                                                <h3 className="text-sm font-black text-stone-800 uppercase tracking-tight">
                                                    {method.title}
                                                </h3>
                                            </div>
                                            <code className="block text-[10px] font-mono text-stone-500 bg-stone-50 px-3 py-2 rounded-lg mb-3 break-all">
                                                {method.code}
                                            </code>
                                            <p className="text-[11px] text-stone-400 font-medium leading-relaxed">
                                                {method.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Danger Zone / Info */}
                            <section className="p-5 rounded-xl border border-dashed border-stone-200 bg-stone-50/60 flex items-start gap-3">
                                <Lock className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider leading-relaxed">
                                    此入口僅供本地開發及測試使用。生產環境中 Anonymous Auth
                                    應由 Firebase Security Rules 隔離。請勿將此 URL 公開分享。
                                </p>
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function delay(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
