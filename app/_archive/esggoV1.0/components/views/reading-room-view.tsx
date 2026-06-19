"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { READING_ROOM_RESOURCES, ReadingResource } from "@/lib/data/reading-room";
import {
    BookOpen,
    Search,
    Download,
    ExternalLink,
    ChevronRight,
    Layers,
    Globe,
    Award,
    FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const CATEGORIES = [
    { id: "all", label: "全部資源", icon: Globe },
    { id: "Template", label: "報告範本", icon: Layers },
    { id: "Yearbook", label: "企業年鑑", icon: Award },
    { id: "Standard", label: "國際準則", icon: BookOpen },
    { id: "Guide", label: "政策指南", icon: FileText }
];

export function ReadingRoomView() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredResources = READING_ROOM_RESOURCES.filter(res => {
        const matchesCategory = activeCategory === "all" || res.category === activeCategory;
        const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.organization.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-stitch-teal-start/10 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-stitch-teal-start" />
                        </div>
                        <h1 className="text-3xl font-bold text-stitch-text tracking-tight">
                            永續報告閱覽室 <span className="text-stitch-teal-start">Reading Room</span>
                        </h1>
                    </div>
                    <p className="text-stitch-muted text-lg max-w-2xl">
                        收錄最新台灣上市櫃企業永續年鑑、官方產製範本及國際揭露準則，為您的 ESG 實踐提供權威參考。
                    </p>
                </div>

                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stitch-muted group-focus-within:text-stitch-teal-start transition-colors" />
                    <Input
                        type="text"
                        placeholder="搜尋標竿範本或企業年鑑..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 h-12 bg-white/50 backdrop-blur-sm border-stitch-border focus:border-stitch-teal-start transition-all rounded-xl shadow-minimal"
                    />
                </div>
            </div>

            {/* Category Navigation */}
            <div className="flex overflow-x-auto pb-2 gap-3 hide-scrollbar">
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${isActive
                                    ? "bg-stitch-teal-start text-white shadow-lg shadow-stitch-teal-start/20 scale-105"
                                    : "bg-white border border-stitch-border text-stitch-muted hover:border-stitch-teal-start/50 hover:bg-stitch-shallow-gray"
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-stitch-teal-start"}`} />
                            {cat.label}
                        </button>
                    );
                })}
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredResources.map((res, index) => (
                        <motion.div
                            key={res.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <GlassCard className="h-full group hover:shadow-2xl hover:shadow-stitch-teal-start/5 transition-all duration-500 overflow-hidden border-t-4 border-t-stitch-teal-start/30">
                                <div className="p-6 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge
                                            variant="optimal"
                                            styleType="soft"
                                            className="bg-stitch-teal-start/5 text-stitch-teal-start border-none px-3 py-1"
                                        >
                                            {CATEGORIES.find(c => c.id === res.category)?.label || res.category}
                                        </Badge>
                                        <span className="text-xs font-bold text-stitch-muted tracking-widest uppercase">
                                            {res.year} EDITION
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-stitch-text mb-2 group-hover:text-stitch-teal-start transition-colors line-clamp-2">
                                        {res.title}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-sm font-medium text-stitch-teal-start bg-stitch-teal-start/10 px-2 py-0.5 rounded">
                                            {res.organization}
                                        </span>
                                    </div>

                                    <p className="text-stitch-muted text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                        {res.description}
                                    </p>

                                    <div className="space-y-3 mt-auto pt-4 border-t border-stitch-border/50">
                                        <div className="flex gap-2">
                                            <a
                                                href={res.viewUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 bg-stitch-teal-start text-white text-sm font-bold py-2.5 rounded-lg hover:opacity-90 transition-all active:scale-95"
                                            >
                                                <BookOpen className="w-4 h-4" />
                                                覽閱原文
                                            </a>
                                            <a
                                                href={res.officialUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 bg-stitch-shallow-gray text-stitch-muted text-sm font-bold py-2.5 rounded-lg hover:bg-stitch-border transition-all active:scale-95"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                官方網址
                                            </a>
                                        </div>
                                        <button className="w-full flex items-center justify-center gap-2 text-xs font-bold text-stitch-muted hover:text-stitch-teal-start transition-colors py-2 group/btn">
                                            <Download className="w-3.5 h-3.5 group-hover/btn:translate-y-0.5 transition-transform" />
                                            下載本地加密快照版
                                            <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredResources.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-stitch-shallow-gray flex items-center justify-center">
                        <Search className="w-10 h-10 text-stitch-muted" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-stitch-text">未找到相關資源</h3>
                        <p className="text-stitch-muted">嘗試更換關鍵字或類別，或聯繫管理員增加資源。</p>
                    </div>
                    <button
                        onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                        className="text-stitch-teal-start font-bold hover:underline"
                    >
                        重置搜尋條件
                    </button>
                </div>
            )}
        </div>
    );
}
