"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface TOCSection {
    id: string;
    title: string;
    chapter: string;
    isDone: boolean;
}

interface FloatingTOCProps {
    sections: TOCSection[];
    activeSectionId: string | null;
    onSectionClick: (id: string) => void;
    className?: string;
}

export function FloatingTOC({ sections, activeSectionId, onSectionClick, className }: FloatingTOCProps) {
    // Group sections by chapter
    const chapters = sections.reduce((acc, section) => {
        if (!acc[section.chapter]) {
            acc[section.chapter] = [];
        }
        acc[section.chapter].push(section);
        return acc;
    }, {} as Record<string, TOCSection[]>);

    return (
        <div className={cn("w-64 flex flex-col h-full bg-slate-900/50 backdrop-blur-xl border-r border-white/10 overflow-hidden", className)}>
            <div className="p-6 border-b border-white/10">
                <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-1">Report Structure</h3>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-white tracking-tight">架構目錄</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[10px]">
                        {sections.filter(s => s.isDone).length}/{sections.length} Done
                    </Badge>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                {Object.entries(chapters).map(([chapterName, chapterSections]) => (
                    <div key={chapterName} className="space-y-2">
                        <h4 className="px-2 text-[10px] font-black text-white/30 uppercase tracking-widest truncate">
                            {chapterName}
                        </h4>
                        <div className="space-y-1">
                            {chapterSections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => onSectionClick(section.id)}
                                    className={cn(
                                        "w-full flex items-start gap-3 p-2 rounded-xl transition-all group text-left",
                                        activeSectionId === section.id
                                            ? "bg-white/10 text-white shadow-lg"
                                            : "text-white/40 hover:bg-white/5 hover:text-white/60"
                                    )}
                                >
                                    <div className="mt-0.5 shrink-0">
                                        {section.isDone ? (
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                        ) : (
                                            <Circle className={cn("w-3.5 h-3.5", activeSectionId === section.id ? "text-white/40" : "text-white/10")} />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-0.5 overflow-hidden">
                                        <span className="text-[11px] font-bold leading-tight truncate">
                                            {section.title}
                                        </span>
                                        <span className="text-[9px] font-medium opacity-40">
                                            ID: {section.id}
                                        </span>
                                    </div>
                                    {activeSectionId === section.id && (
                                        <motion.div layoutId="active-indicator" className="ml-auto">
                                            <ChevronRight className="w-3 h-3 text-emerald-400" />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={cn("px-2 py-0.5 rounded-full font-bold", className)}>
            {children}
        </span>
    );
}
