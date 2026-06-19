"use client";

import { usePathname } from "next/navigation";
import { ChevronRight, Home, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface PageHeaderProps {
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(Boolean);

    return (
        <div className="mb-8 space-y-4">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <Link href="/dashboard" className="hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                    <Home className="w-3 h-3" />
                    <span>ESGG</span>
                </Link>
                {paths.map((path, index) => {
                    const href = `/${paths.slice(0, index + 1).join('/')}`;
                    const isLast = index === paths.length - 1;

                    return (
                        <div key={path} className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 opacity-30" />
                            <Link
                                href={href}
                                className={cn(
                                    "hover:text-emerald-600 transition-colors",
                                    isLast ? "text-emerald-600/80" : ""
                                )}
                            >
                                {path.replace(/-/g, ' ')}
                            </Link>
                        </div>
                    );
                })}
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 capitalize">
                            {title || paths[paths.length - 1]?.replace(/-/g, ' ') || "智核"}
                        </h1>
                        <div className="px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-100/50 flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Active</span>
                        </div>
                    </motion.div>
                    {subtitle && (
                        <p className="text-sm font-medium text-slate-500 max-w-2xl">
                            {subtitle}
                        </p>
                    )}
                </div>

                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
