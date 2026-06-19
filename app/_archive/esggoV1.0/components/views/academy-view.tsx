"use client";

import { motion } from "motion/react";
import {
    BookOpen,
    Play,
    Clock,
    Award,
    Search,
    Filter,
    Users,
    Star,
    ChevronRight,
    BookMarked
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";

const COURSES = [
    {
        id: 1,
        title: "GRI 實務操作：從披露到存證",
        category: "Frameworks",
        duration: "4.5 hrs",
        students: 1284,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1454165833767-027508492b98?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 2,
        title: "5T 專業代碼與 ZK 隱私保護基礎",
        category: "Technical",
        duration: "2.5 hrs",
        students: 856,
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 3,
        title: "氣候風險財務揭露 (TCFD) 專家班",
        category: "Finance",
        duration: "6.0 hrs",
        students: 2105,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60"
    }
];

export function AcademyView() {
    return (
        <div className="flex flex-col flex-1 w-full max-w-7xl mx-auto p-8 space-y-12 min-h-screen">
            {/* Hero Banner */}
            <div className="relative h-96 rounded-[48px] overflow-hidden bg-stitch-text group shadow-2xl">
                <div className="absolute inset-0 opacity-40 bg-gradient-to-r from-black to-transparent z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&auto=format&fit=crop&q=80"
                    alt="Academy Hero"
                    fill
                    sizes="(max-width: 1600px) 100vw, 1600px"
                    className="object-cover grayscale opacity-50 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-x-12 bottom-12 z-20">
                    <Badge variant="optimal" styleType="solid" className="bg-primary-teal-start text-black px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border-none mb-6">
                        OMNI_ACADEMY
                    </Badge>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase font-headline mb-4 max-w-2xl">
                        ESG_Intelligence
                    </h1>
                    <p className="text-stone-300 font-bold max-w-xl text-sm leading-relaxed mb-8">
                        從零開始掌握專業級永續報告與存證技術。結合專業知識與 5T 實戰邏輯，建構可信賴的綠色數位資產。
                    </p>
                    <div className="flex gap-4">
                        <button className="px-8 py-4 rounded-2xl bg-white text-black font-black text-[11px] uppercase tracking-widest hover:bg-stone-100 transition-all shadow-xl">
                            搜尋課程
                        </button>
                        <button className="px-8 py-4 rounded-2xl bg-white/10 text-white font-black text-[11px] uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-md">
                            我的學習紀錄
                        </button>
                    </div>
                </div>
            </div>

            {/* Course Explorer */}
            <div className="space-y-8">
                <div className="flex items-end justify-between border-b border-stone-200 pb-8">
                    <h2 className="text-3xl font-black text-stitch-text tracking-tighter uppercase font-headline">
                        Courses <span className="text-stone-300">/</span> 課程庫
                    </h2>
                    <div className="flex gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stitch-text transition-colors" />
                            <input
                                type="text"
                                placeholder="搜尋課程..."
                                className="pl-11 pr-6 py-3 rounded-2xl bg-stone-100 border-none text-[11px] font-black uppercase text-stitch-text focus:ring-2 focus:ring-primary-teal-start transition-all w-64"
                            />
                        </div>
                        <button className="p-3 rounded-2xl bg-stone-100 text-stone-600 hover:bg-stone-200 transition-all">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {COURSES.map((course, i) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <GlassCard className="rounded-[32px] overflow-hidden group hover:border-black/20 transition-all cursor-pointer flex flex-col h-full bg-white shadow-lg hover:shadow-2xl">
                                <div className="h-48 overflow-hidden relative">
                                    <Image
                                        src={course.image}
                                        alt={course.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 400px"
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge variant="optimal" styleType="solid" className="bg-white/90 backdrop-blur-md text-black px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border-none">
                                            {course.category}
                                        </Badge>
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-primary-teal-start text-black flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                                            <Play className="w-6 h-6 fill-black" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h4 className="text-xl font-black text-stitch-text tracking-tighter leading-tight mb-4 group-hover:text-primary-teal-start transition-colors">
                                        {course.title}
                                    </h4>
                                    <div className="flex items-center gap-6 mt-auto">
                                        <div className="flex items-center gap-2 text-stone-400">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase">{course.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-stone-400">
                                            <Users className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase">{course.students}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-amber-500 ml-auto">
                                            <Star className="w-4 h-4 fill-amber-500" />
                                            <span className="text-[10px] font-black uppercase">{course.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GlassCard className="p-10 rounded-[40px] bg-black text-white relative overflow-hidden group border-none">
                    <div className="relative z-10">
                        <h4 className="text-2xl font-black tracking-tighter uppercase font-headline mb-4">專家導師一對一諮詢</h4>
                        <p className="text-stone-400 font-bold text-xs leading-relaxed mb-8 max-w-sm">
                            預約 Omni 認證的 ESG 專家與 ZK 架構師，為您的企業量身打造存證流程。
                        </p>
                        <button className="flex items-center gap-2 text-primary-teal-start font-black text-sm uppercase tracking-widest group">
                            預約 <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                    <BookMarked className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
                </GlassCard>

                <GlassCard className="p-10 rounded-[40px] border-stone-200 group relative">
                    <div className="flex items-center gap-3 mb-6">
                        <Award className="w-8 h-8 text-primary-teal-start outline-none" />
                        <h4 className="text-2xl font-black text-stitch-text tracking-tighter uppercase font-headline">成就與證書</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-stone-200">
                                    <Award className="w-5 h-5 text-stone-300" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-black text-stone-400 uppercase tracking-widest block">Level 1 Practitioner</span>
                                    <span className="text-xs font-bold text-stitch-text">GRI 實務初階認證 (Pending)</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-primary-teal-start uppercase">85% Complete</span>
                            </div>
                        </div>
                        <button className="w-full py-4 rounded-2xl border border-stone-200 text-[10px] font-black uppercase text-stone-400 hover:text-stitch-text hover:border-black transition-all">
                            檢視所有成就
                        </button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
