"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Share2, Filter, Search as SearchIcon, Inbox, Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NewsletterIssueCard } from "@/components/ui/newsletter-issue-card";
import { SustainabilityReportDetail } from "@/components/newsletters/sustainability-report-detail";
import { toast } from "sonner";

const NEWSLETTER_ISSUES = [
    {
        issueNumber: 29,
        title: "ESG SUNSHINE - 完整永續情報週報：全球永續觀察與政策矩陣",
        author: "ESG GO 研究小組",
        publishDate: "2026-04-10",
        takeaways: "歐盟將氣候轉型與工業競爭力掛鉤，2040 減碳目標正式發布，目標減排 90%。這標誌著 ESG 不再僅是合規指標，更是全球市場的技術准入門檻。",
        chapters: [
            {
                id: "01_Current_Situation",
                title: "What Happened / 現況解析",
                content: `
                    <p>歐盟自 2024 年以來，將氣候轉型與工業競爭力（Industrial Competitiveness）掛鉤的趨勢愈發明顯。2040 減碳目標正式發布，目標減排 90%，並強調能源中立路徑。ETS 市場配額收緊，推動碳價維持在高檔區間，增加企業轉型成本。</p>
                `
            },
            {
                id: "02_Impact_Analysis",
                title: "Why It Matters / 為何重要",
                content: `
                    <p>對於亞洲企業而言，這不僅僅是法律框架的收緊。隨著歐盟 CSRD 與 CBAM 的聯動，供應鏈必須同步揭露 Scope 3 排放數據。融資成本將直接掛鉤氣候績效。</p>
                `
            }
        ],
    },
    {
        issueNumber: 28,
        title: "全球永續觀察：社會創新專題 (01) - 社會企業正在被重新定義",
        author: "善向永續 楊坤修 博士",
        publishDate: "2026-02-20",
        takeaways: "社會企業不再只被看作有使命感的創業型態，而正被重新放進「減貧、就業、地方韌性與包容發展」的政策工具箱。",
        chapters: [],
    },
    {
        issueNumber: 27,
        title: "歐盟氣候政策進入競爭力重寫期：2040 減碳目標與 ETS 市場轉型",
        author: "ESG GO 研究小組",
        publishDate: "2026-02-13",
        takeaways: "歐盟正在將氣候目標與工業競爭力掛鉤，不再單純追求減碳，而是尋求在綠色轉型中鞏固其全球領先地位。",
        chapters: [],
    },
    {
        issueNumber: 26,
        title: "能源危機下的永續韌性：高能源價格是否加速了綠色轉型？",
        author: "氣候變遷分析師",
        publishDate: "2026-02-06",
        takeaways: "短期能源短缺雖然增加了化石燃料的使用，但從長遠來看，這正迫使企業更快地轉向再生能源以確保能源安全。",
        chapters: [],
    },
];

export function NewslettersView() {
    const [selectedIssueNumber, setSelectedIssueNumber] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredNewsletters = useMemo(() => {
        if (!searchQuery.trim()) return NEWSLETTER_ISSUES;
        const query = searchQuery.toLowerCase();
        return NEWSLETTER_ISSUES.filter(issue =>
            issue.title.toLowerCase().includes(query) ||
            issue.takeaways.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const handleShare = () => {
        toast.success("分享連結已產生！已將集合網址複製到剪貼簿。");
    };

    const handleArchive = () => {
        toast.info("正在開啟核心存檔金庫... 此功能需要權限驗證。");
    };

    const selectedIssue = NEWSLETTER_ISSUES.find(i => i.issueNumber === selectedIssueNumber);

    return (
        <AnimatePresence mode="wait">
            {!selectedIssue ? (
                <motion.div
                    key="list"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col gap-10"
                >
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-black rounded-[20px] flex items-center justify-center text-primary-teal-start shadow-2xl rotate-3">
                                    <Sparkles className="w-10 h-10" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <Badge variant="primary" styleType="soft" className="bg-primary-teal-start/10 text-primary-teal-start border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5">
                                            ESG_SUNSHINE_DIGEST
                                        </Badge>
                                        <span className="text-[11px] text-stone-400 font-bold uppercase tracking-tighter">Issue Collection v1.0</span>
                                    </div>
                                    <h1 className="text-5xl font-black tracking-tighter text-stitch-text uppercase font-headline">
                                        Sustainability_Digest <span className="text-stone-300">/</span> <span className="text-primary-teal-start">永續觀察電子報</span>
                                    </h1>
                                </div>
                            </div>

                            <button onClick={handleShare} className="hidden md:flex items-center gap-3 px-6 py-3 bg-stone-100 hover:bg-stone-200 rounded-full border border-stone-200 transition-all group">
                                <Share2 className="w-4 h-4 text-stone-500 group-hover:rotate-12 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-widest text-stone-600">Share Collection</span>
                            </button>
                        </div>

                        <p className="max-w-3xl text-sm font-bold text-stone-500 leading-relaxed uppercase tracking-tight">
                            追蹤全球最新的永續轉型訊號、氣候政策變動以及社會創新案例。我們透過 5T 協議確保每一份研究報告的深度與公信力，為您的企業決策提供最精準的 ESG 洞察。
                        </p>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-stone-50 rounded-[28px] border border-stone-200/50">
                        <div className="flex items-center gap-2 pl-4">
                            <SearchIcon className="w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Search Intelligence Reports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none focus:outline-none text-[11px] font-black uppercase tracking-widest text-stone-600 w-64 placeholder:text-stone-300"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-6 py-2 bg-white rounded-full border border-stone-200 text-[10px] font-black uppercase tracking-widest text-stone-500 hover:bg-stone-100 transition-all">
                                <Filter className="w-3 h-3" />
                                <span>Latest Issues</span>
                            </button>
                        </div>
                    </div>

                    {filteredNewsletters.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredNewsletters.map((issue) => (
                                <NewsletterIssueCard
                                    key={issue.issueNumber}
                                    {...issue}
                                    onReadMore={() => setSelectedIssueNumber(issue.issueNumber)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-stone-50/50 rounded-[40px] border border-dashed border-stone-200">
                            <div className="w-16 h-16 rounded-full bg-stone-200/50 flex items-center justify-center text-stone-400 mb-6">
                                <Inbox className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black text-stitch-text uppercase tracking-widest">No matching results</h3>
                            <p className="text-sm text-stone-400 mt-2 font-bold uppercase">Try adjusting your search query</p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="mt-6 text-primary-teal-start font-black text-[11px] uppercase tracking-widest hover:underline"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}

                    <div className="mt-12 p-10 bg-black rounded-[40px] flex flex-col items-center text-center gap-6 relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col items-center gap-3">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Explore_The_Vault</span>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-headline">Access_Historical_Archives</h2>
                            <p className="text-xs text-white/60 max-w-lg leading-relaxed font-bold">
                                需要查詢過往所有的永續觀察電子報？我們的永續存證庫包含自 2024 年以來的所有數位存證紀錄。
                            </p>
                            <button
                                onClick={handleArchive}
                                className="mt-4 px-10 py-4 bg-primary-teal-start rounded-full text-black font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_15px_30px_rgba(0,158,157,0.3)]"
                            >
                                Open Archive Vault
                            </button>
                        </div>
                        {/* Animated Background Elements */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-teal-start/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-primary-teal-start/20 transition-all duration-1000" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-teal-start/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                    </div>
                </motion.div>
            ) : (
                <SustainabilityReportDetail
                    key="detail"
                    {...selectedIssue}
                    onBack={() => setSelectedIssueNumber(null)}
                />
            )}
        </AnimatePresence>
    );
}
