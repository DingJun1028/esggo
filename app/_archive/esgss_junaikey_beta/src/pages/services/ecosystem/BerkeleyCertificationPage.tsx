import React from 'react';
import { StitchPageTemplate } from '@/components/layout/StitchPageTemplate';
import {
    Award,
    BookOpen,
    GraduationCap,
    Star,
    CheckCircle,
    PlayCircle,
    ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export const BerkeleyCertificationPage: React.FC = () => {
    return (
        <StitchPageTemplate
            id="berkeley-certification"
            title="Berkeley Certification Academy"
            subtitle="ESG Professional Training & Credentialing"
            icon={GraduationCap}
            accentColor="#63a6b0"
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Services', href: '/esg/omniverse' },
                { label: 'Ecosystem', href: '/esg/omniverse' },
                { label: 'Academy', href: '/services/ecosystem/certification' },
            ]}
        >
            <div className="space-y-8">
                {/* User Progress Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f172a] to-[#1e293b] p-8 border border-[#63a6b0]/30">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Award className="w-64 h-64 text-[#63a6b0]" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-100 mb-2">Welcome back, Scholar</h2>
                            <div className="flex items-center space-x-4 text-slate-400">
                                <span className="flex items-center"><Star className="w-4 h-4 text-[#ffd700] mr-1" /> Level 12</span>
                                <span className="flex items-center"><BookOpen className="w-4 h-4 text-[#63a6b0] mr-1" /> 4 Certifications</span>
                            </div>
                        </div>
                        <div className="w-full md:w-1/3">
                            <div className="flex justify-between text-sm text-[#63a6b0] mb-2 font-mono">
                                <span>Next Level: Master Strategist</span>
                                <span>850 / 1000 XP</span>
                            </div>
                            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "85%" }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-[#63a6b0] to-[#ffd700]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Catalog */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Course 1 */}
                    <div className="group relative rounded-xl bg-[#0f172a]/40 border border-[#63a6b0]/20 hover:border-[#63a6b0]/50 transition-all overflow-hidden">
                        <div className="h-40 bg-slate-800/50 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a]/90" />
                            <Award className="w-16 h-16 text-[#63a6b0]/50 group-hover:text-[#63a6b0] transition-colors z-10" />
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <span className="px-2 py-1 text-xs rounded bg-[#63a6b0]/10 text-[#63a6b0] font-mono border border-[#63a6b0]/20">ADVANCED</span>
                                <span className="flex items-center text-[#ffd700] text-xs"><Star className="w-3 h-3 mr-1 fill-current" /> 500 XP</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-100 mb-2">Sustainable Supply Chain Management</h3>
                            <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                                Master the 5T protocol for supply chain transparency and traceability. Learn to audit suppliers and manage risk.
                            </p>
                            <button className="w-full py-2 rounded-lg bg-[#63a6b0]/10 text-[#63a6b0] border border-[#63a6b0]/50 hover:bg-[#63a6b0] hover:text-[#0f172a] font-bold transition-all flex items-center justify-center space-x-2">
                                <PlayCircle className="w-4 h-4" />
                                <span>Start Course</span>
                            </button>
                        </div>
                    </div>

                    {/* Course 2 */}
                    <div className="group relative rounded-xl bg-[#0f172a]/40 border border-[#f43f5e]/20 hover:border-[#f43f5e]/50 transition-all overflow-hidden">
                        <div className="h-40 bg-slate-800/50 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a]/90" />
                            <ShieldCheck className="w-16 h-16 text-[#f43f5e]/50 group-hover:text-[#f43f5e] transition-colors z-10" />
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <span className="px-2 py-1 text-xs rounded bg-[#f43f5e]/10 text-[#f43f5e] font-mono border border-[#f43f5e]/20">EXPERT</span>
                                <span className="flex items-center text-[#ffd700] text-xs"><Star className="w-3 h-3 mr-1 fill-current" /> 800 XP</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-100 mb-2">Climate Risk Governance</h3>
                            <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                                Deep dive into TCFD scenario analysis and board-level governance structures for climate resilience.
                            </p>
                            <button className="w-full py-2 rounded-lg bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/50 hover:bg-[#f43f5e] hover:text-[#0f172a] font-bold transition-all flex items-center justify-center space-x-2">
                                <PlayCircle className="w-4 h-4" />
                                <span>Start Course</span>
                            </button>
                        </div>
                    </div>

                    {/* Course 3 */}
                    <div className="group relative rounded-xl bg-[#0f172a]/40 border border-[#ffd700]/20 hover:border-[#ffd700]/50 transition-all overflow-hidden">
                        <div className="h-40 bg-slate-800/50 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a]/90" />
                            <BookOpen className="w-16 h-16 text-[#ffd700]/50 group-hover:text-[#ffd700] transition-colors z-10" />
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <span className="px-2 py-1 text-xs rounded bg-[#ffd700]/10 text-[#ffd700] font-mono border border-[#ffd700]/20">FOUNDATION</span>
                                <span className="flex items-center text-[#ffd700] text-xs"><Star className="w-3 h-3 mr-1 fill-current" /> 200 XP</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-100 mb-2">Intro to ESG Data Analytics</h3>
                            <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                                Learn the basics of data collection, verification, and analysis for sustainability reporting.
                            </p>
                            <button className="w-full py-2 rounded-lg bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/50 hover:bg-[#ffd700] hover:text-[#0f172a] font-bold transition-all flex items-center justify-center space-x-2">
                                <PlayCircle className="w-4 h-4" />
                                <span>Start Course</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Certification Vault */}
                <div className="border-t border-slate-800 pt-8">
                    <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
                        <Award className="w-5 h-5 text-[#63a6b0] mr-2" />
                        Your Credentials (Trustworthy Vault)
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {[
                            { name: 'Certified ESG Strategist', date: '2025-11-15', id: 'CES-8821' },
                            { name: 'Carbon Accounting Specialist', date: '2025-09-20', id: 'CAS-4493' }
                        ].map((cert) => (
                            <div key={cert.id} className="flex items-center space-x-4 p-4 rounded-xl bg-[#0f172a] border border-[#63a6b0]/30 min-w-[300px]">
                                <CheckCircle className="w-8 h-8 text-[#63a6b0]" />
                                <div>
                                    <h4 className="font-bold text-slate-200">{cert.name}</h4>
                                    <div className="text-xs text-slate-500 font-mono mt-1">
                                        Issued: {cert.date} • ID: {cert.id}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </StitchPageTemplate>
    );
};
