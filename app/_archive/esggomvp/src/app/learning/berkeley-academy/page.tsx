'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap,
    BookOpen,
    Award,
    Clock,
    ChevronRight,
    CheckCircle,
    Lock,
    Zap,
    Search,
    Filter
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { BERKELEY_COURSES, CourseCategory, CourseLevel, BerkeleyAcademy } from '@/core/berkeley-academy';
import { AlchemyEngine } from '@/core/alchemy-engine';

export default function BerkeleyAcademyPage() {
    const { locale } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
    const [alchemyState, setAlchemyState] = useState(AlchemyEngine.getState());

    const categories = Object.values(CourseCategory);

    const filteredCourses = selectedCategory
        ? BERKELEY_COURSES.filter(c => c.category === selectedCategory)
        : BERKELEY_COURSES;

    const handleEnroll = async (courseId: string) => {
        if (enrolledCourses.includes(courseId)) return;

        // 1. Core enrollment
        await BerkeleyAcademy.enroll(courseId, "USER_ALPHA_1");
        setEnrolledCourses(prev => [...prev, courseId]);

        // 2. Alchemy & Achievement logic
        await AlchemyEngine.unlockAchievement('ach-academy-scholar');
        await AlchemyEngine.addExp(300); // Enrollment base XP

        setAlchemyState(AlchemyEngine.getState());
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
            <PageHeader
                title={locale === 'zh-TW' ? 'Berkeley 認證學院' : 'Berkeley Certification Academy'}
                subtitle={locale === 'zh-TW' ? '專業 ESG 核心課程，打造您的永續職能資產' : 'Professional ESG Core Courses: Build Your Sustainable Competency Assets'}
                category="教育與鍊金"
            />

            {/* 🛠️ Hero Statistics / Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: locale === 'zh-TW' ? '已獲得證書' : 'Certificates Earned', value: '0', icon: Award, color: 'text-gold' },
                    { label: locale === 'zh-TW' ? '學習中的課程' : 'Active Courses', value: enrolledCourses.length.toString(), icon: BookOpen, color: 'text-aqua' },
                    { label: locale === 'zh-TW' ? '待領取成就' : 'Pending Achievements', value: '3', icon: Zap, color: 'text-purple-400' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-black/20 border border-white/5 rounded-3xl p-6 flex items-center justify-between backdrop-blur-xl"
                    >
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                        </div>
                        <div className={`size-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 🧪 Alchemy Rank Progress */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="liquid-glass aura-pulse rounded-[2rem] p-8 overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Zap size={120} className="text-aqua" />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-aqua/20 text-aqua text-[10px] font-black rounded-lg uppercase tracking-widest">RANK {alchemyState.currentLevel}</span>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                                {locale === 'zh-TW' ? '現在等階：' : 'Current Rank: '}
                                <span className="text-aqua">Initiate</span>
                            </h2>
                        </div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                            {locale === 'zh-TW' ? '距離下一階還需 ' : 'Next Rank in '}
                            <span className="text-gold">500 XP</span>
                        </p>
                    </div>

                    <div className="flex-1 max-w-xl w-full">
                        <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${AlchemyEngine.getProgress(alchemyState)}%` }}
                                className="h-full bg-gradient-to-r from-aqua to-blue-400 shadow-[0_0_20px_rgba(99,162,176,0.5)]"
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                            <span>{alchemyState.currentExp} XP</span>
                            <span>{AlchemyEngine.getProgress(alchemyState).toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 📂 Category Filter */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all border ${!selectedCategory ? 'bg-aqua text-black border-aqua' : 'bg-white/5 text-gray-400 border-white/10 hover:border-aqua/50'
                        }`}
                >
                    {locale === 'zh-TW' ? '全部課程' : 'All Courses'}
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-5 py-2 rounded-full text-xs font-bold transition-all border ${selectedCategory === cat ? 'bg-aqua text-black border-aqua' : 'bg-white/5 text-gray-400 border-white/10 hover:border-aqua/50'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* 📚 Course Grid (Bento Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredCourses.map((course, idx) => (
                        <motion.div
                            key={course.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group relative liquid-glass aura-pulse rounded-[2.5rem] overflow-hidden flex flex-col p-8 transition-all"
                        >
                            {/* Course Level Bagde */}
                            <div className="absolute top-8 right-8 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                                <span className="text-[10px] font-black uppercase text-aqua tracking-tighter">{course.level}</span>
                            </div>

                            <div className="size-14 rounded-2xl bg-aqua/10 flex items-center justify-center text-aqua mb-6 group-hover:scale-110 transition-transform">
                                <GraduationCap size={28} />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 leading-tight">{course.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1">
                                {course.description}
                            </p>

                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="flex items-center justify-between text-[11px] font-bold tracking-widest uppercase">
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <Clock size={12} className="text-aqua" />
                                        <span>{course.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gold">
                                        <Zap size={12} />
                                        <span>+{course.xpReward} XP</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {course.skills.map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-bold text-gray-500 border border-white/5 uppercase">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleEnroll(course.id)}
                                    className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${enrolledCourses.includes(course.id)
                                        ? 'bg-zinc-800 text-gray-500 cursor-default'
                                        : 'bg-aqua text-black hover:scale-[1.02] active:scale-95 shadow-[0_10px_20px_-5px_rgba(99,162,176,0.4)]'
                                        }`}
                                >
                                    {enrolledCourses.includes(course.id) ? (
                                        <>
                                            <CheckCircle size={18} />
                                            {locale === 'zh-TW' ? '已註冊' : 'Enrolled'}
                                        </>
                                    ) : (
                                        <>
                                            {locale === 'zh-TW' ? '立刻註冊' : 'Enroll Now'}
                                            <ChevronRight size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
