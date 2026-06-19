'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import {
    GraduationCap,
    BookOpen,
    Clock,
    Award,
    ChevronRight,
    Globe,
    ShieldCheck,
    Cpu,
    Zap,
    BarChart4,
    Search,
    Filter,
    ArrowLeft
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { BerkeleyExam } from './components/BerkeleyExam';

/**
 * 🎓 Berkeley Certified Academy
 * Professional ESG certification matrix with 25+ courses.
 */
export default function BerkeleyAcademyPage() {
    const { locale } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [isExamMode, setIsExamMode] = useState(false);

    const courses = [
        { id: 1, title: "ESG Fundamentals & GRI", zh: "ESG 基礎與 GRI 標準", duration: "12h", level: "Beginner", icon: <BookOpen />, category: "Core" },
        { id: 2, title: "Circular Economy Systems", zh: "循環經濟系統工程", duration: "18h", level: "Advanced", icon: <Zap />, category: "Environment" },
        { id: 3, title: "SASB Reporting Mastery", zh: "SASB 報告撰寫實務", duration: "15h", level: "Intermediate", icon: <BarChart4 />, category: "Governance" },
        { id: 4, title: "TCFD Scenario Analysis", zh: "TCFD 情境分析與風控", duration: "10h", level: "Advanced", icon: <Globe />, category: "Risk" },
        { id: 5, title: "Supply Chain Audit 5T", zh: "供應鏈 5T 審核程序", duration: "20h", level: "Expert", icon: <ShieldCheck />, category: "Core" },
        { id: 6, title: "Decarbonization Strategy", zh: "去碳化策略與路徑", duration: "14h", level: "Intermediate", icon: <Cpu />, category: "Environment" },
        { id: 7, title: "DEI Metrics & Social SROI", zh: "DEI 指標與社會 SROI", duration: "8h", level: "Intermediate", icon: <Users />, category: "Social" },
        { id: 8, title: "AI-Driven ESG Audit", zh: "AI 驅動的 ESG 審計", duration: "12h", level: "Expert", icon: <Zap />, category: "Tech" },
    ];

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.zh.includes(searchQuery)
    );

    const handleEnroll = (course: any) => {
        setSelectedCourse(course);
        setIsExamMode(true);
    };

    const handleExamComplete = (score: number) => {
        console.log(`Exam completed for course ${selectedCourse?.id} with score ${score}`);
        // In a real implementation, this would trigger 5T badge awarding via CelestialLifecycleManager
    };

    if (isExamMode && selectedCourse) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 py-12">
                <button
                    onClick={() => setIsExamMode(false)}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest"
                >
                    <ArrowLeft size={14} /> Back to Academy
                </button>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white italic tracking-tight underline decoration-gold/30">
                        {locale === 'zh-TW' ? selectedCourse.zh : selectedCourse.title}
                    </h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Certification Assessment</p>
                </div>
                <BerkeleyExam courseId={selectedCourse.id} onComplete={handleExamComplete} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            <PageHeader
                title={locale === 'zh-TW' ? "柏克萊認證學院 (Berkeley Academy)" : "Berkeley Academy"}
                subtitle={locale === 'zh-TW' ? "專屬 ESG 認證課程，從基礎理論到高階管理。完成課程可獲取 5T 誠信認證勳章。" : "Elite ESG certifications across 25+ specialized domains. From foundation to master level."}
                category="學習鍊金"
            />

            {/* 🔍 Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-6 rounded-[2rem] border border-white/10 liquid-glass">
                <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-full px-6 py-2 w-full md:w-96">
                    <Search size={18} className="text-gray-500" />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={locale === 'zh-TW' ? "搜尋認證課程..." : "Search certifications..."}
                        className="bg-transparent border-none outline-none text-sm flex-1 text-white"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {['All', 'Core', 'Environment', 'Social', 'Governance', 'Risk'].map(cat => (
                        <button key={cat} className="px-4 py-1.5 rounded-full border border-white/10 text-[10px] uppercase font-bold tracking-widest hover:border-gold hover:text-gold transition-all whitespace-nowrap">
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* 📚 Course Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCourses.map((course, idx) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-gold/30 transition-all cursor-pointer overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                            <GraduationCap size={80} />
                        </div>

                        <div className="flex flex-col h-full space-y-6">
                            <div className="p-4 bg-gold/10 text-gold rounded-2xl w-fit group-hover:scale-110 transition-transform">
                                {course.icon}
                            </div>

                            <div>
                                <span className="text-[10px] font-black tracking-widest text-gold uppercase mb-2 block">{course.category}</span>
                                <h3 className="text-base font-bold text-white group-hover:text-gold transition-colors leading-snug">
                                    {locale === 'zh-TW' ? course.zh : course.title}
                                </h3>
                            </div>

                            <div className="mt-auto space-y-4">
                                <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 border-t border-white/5 pt-4">
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        <span>{course.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Award size={12} />
                                        <span>{course.level}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleEnroll(course)}
                                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all flex items-center justify-center gap-2"
                                >
                                    Enroll Module <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 🎖️ Certification Path */}
            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-gold/5 via-black to-blue-500/5 border border-white/10 liquid-glass">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="p-3 bg-gold/20 rounded-2xl w-fit text-gold shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                            <Award size={32} />
                        </div>
                        <h4 className="text-2xl font-black italic tracking-tighter uppercase whitespace-nowrap">Professional Path</h4>
                        <p className="text-sm text-gray-400 leading-loose">
                            Our certifications are backed by the **OmniDomain Sovereignty** protocol. Every certificate is hashed and stored in the **Trustworthy Evidence Vault**, serving as a permanent 5T asset for your professional ESG career.
                        </p>
                        <div className="flex gap-4">
                            <div className="px-5 py-2 bg-white/5 rounded-full text-[10px] font-bold border border-white/10">Master (3/25)</div>
                            <div className="px-5 py-2 bg-white/5 rounded-full text-[10px] font-bold border border-white/10">Expert (1/10)</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { t: 'Course Completion', v: '85%' },
                            { t: 'Exam Accuracy', v: '96%' },
                            { t: 'Practical Proofs', v: '12/50' },
                            { t: 'Academy Rank', v: '#124' }
                        ].map(stat => (
                            <div key={stat.t} className="p-6 rounded-3xl bg-white/5 border border-white/5 text-center group hover:border-gold/30 transition-all">
                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.t}</p>
                                <p className="text-xl font-black text-white group-hover:text-gold transition-colors">{stat.v}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const Users = () => <BookOpen size={24} />;
