"use client";

import { motion } from "motion/react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, Calendar, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chapter {
    id: string;
    title: string;
    content: string;
}

interface NewsletterIssueCardProps {
    issueNumber: number;
    title: string;
    author: string;
    publishDate?: string;
    takeaways: string;
    chapters: Chapter[];
    onReadMore?: () => void;
    className?: string;
}

export function NewsletterIssueCard({
    issueNumber,
    title,
    author,
    publishDate,
    takeaways,
    chapters,
    onReadMore,
    className,
}: NewsletterIssueCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn("group", className)}
        >
            <GlassCard className="p-8 bg-white border-stone-200/50 shadow-xl rounded-[32px] overflow-hidden relative hover:border-primary-teal-start/30 transition-all duration-500">
                <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="primary" styleType="soft" className="font-black text-[9px] uppercase tracking-widest px-3 py-1">
                                    Issue #{issueNumber}
                                </Badge>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[8px] font-black text-emerald-700 uppercase tracking-tighter">Verified Content</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-stitch-text uppercase tracking-tighter leading-tight font-headline group-hover:text-primary-teal-start transition-colors line-clamp-2">
                                {title}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-stone-900 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform shrink-0">
                            <BookOpen className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-primary-teal-start" />
                            <span>{author}</span>
                        </div>
                        {publishDate && (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-primary-teal-start" />
                                <span>{publishDate}</span>
                            </div>
                        )}
                    </div>

                    {/* Takeaways Section */}
                    <div className="p-6 bg-stone-50 rounded-[24px] border border-stone-100 group-hover:bg-primary-teal-start/[0.02] transition-colors relative overflow-hidden">
                        <span className="text-[10px] font-black text-primary-teal-start uppercase tracking-[0.2em] mb-3 block">
                            Executive_Takeaways <span className="text-stone-300">/</span> 重點摘要
                        </span>
                        <p className="text-sm font-bold text-stone-600 leading-relaxed italic line-clamp-3">
                            &quot;{takeaways}&quot;
                        </p>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-teal-start/5 rounded-full blur-3xl -translate-x-4 -translate-y-4" />
                    </div>

                    {/* Quick Stats/Tags (optional) */}
                    <div className="flex flex-wrap gap-2">
                        {["ESG", "Sustainability", "Policy"].map((tag) => (
                            <span key={tag} className="px-2.5 py-1 rounded-lg bg-stone-100 text-[8px] font-black text-stone-500 uppercase tracking-widest border border-stone-200/50">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Action Trigger */}
                    <button
                        onClick={onReadMore}
                        className="w-full mt-4 py-4 rounded-[16px] bg-stone-900 text-white font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-stone-800 transition-all active:scale-[0.98] shadow-minimal"
                    >
                        <span>Read Full Analysis</span>
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>

                </div>

                {/* Decorative Grid */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </GlassCard>
        </motion.div>
    );
}
