import React, { useState } from 'react';
import { getMockCourses } from '../constants';
import { ArrowRight, GraduationCap, Compass, Activity, Target, Zap, Crown, Star, PlayCircle, BookOpen, ShieldCheck, Heart } from 'lucide-react';
import { Language, Course } from '../types';
import { CoursePlayer } from './CoursePlayer';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';

export const Academy: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const courses = getMockCourses(language) as Course[];
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const { addToast } = useToast();
  const { awardXp, level } = useCompany();

  const handleRegisterStar = () => {
      window.open('https://www.esgsunshine.com/courses/berkeley-tsisda', '_blank');
      addToast('success', isZh ? '正在前往 Berkeley 官方報名系統...' : 'Redirecting to Berkeley...', 'Academy');
  };

  return (
    <>
        {activeCourse && <CoursePlayer course={activeCourse} onClose={() => setActiveCourse(null)} onComplete={() => { awardXp(800); setActiveCourse(null); }} />}

        <div className="h-full flex flex-col space-y-4 animate-fade-in pb-4 overflow-hidden" data-agent-node="academy-v15">
            <UniversalPageHeader 
                icon={GraduationCap} 
                title={{ zh: '永續學院', en: 'Sustainability Academy' }} 
                description={{ zh: '提昇團隊 ESG 權能等級：從 Berkeley 策略思維到 TSISDA 實務轉型', en: 'Elevate ESG Authority: From Berkeley Strategy to TSISDA Transition' }} 
                language={language} 
                tag={{ zh: '修煉核心 v15.9', en: 'LEARN_CORE_V15.9' }} 
            />

            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
                
                {/* 欄位 1:Berkeley 旗艦課程 (8/12) */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 min-h-0 overflow-hidden">
                    {/* Berkeley 明星課程傳奇卡 */}
                    <div className="glass-bento p-10 border-celestial-gold/40 bg-gradient-to-br from-black via-slate-900 to-amber-900/20 relative overflow-hidden group shrink-0 shadow-2xl rounded-[3rem]">
                        <div className="absolute inset-0 z-0">
                            <img src="https://thumbs4.imagebam.com/aa/15/cf/ME196QBY_t.png" alt="Star Course" className="w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
                        </div>

                        <div className="relative z-10 flex flex-col gap-8">
                            <div className="flex gap-4">
                                <div className="px-4 py-1.5 rounded-full bg-celestial-gold/20 border border-celestial-gold/50 flex items-center gap-2 backdrop-blur-md">
                                    <Crown className="w-4 h-4 text-celestial-gold" />
                                    <span className="text-[10px] font-black text-celestial-gold uppercase tracking-widest">{isZh ? '傳奇級雙證班' : 'LEGENDARY_DOUBLE_CERT'}</span>
                                </div>
                                <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center gap-2 backdrop-blur-md">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">IBI × TSISDA</span>
                                </div>
                            </div>

                            <div className="max-w-2xl">
                                <h2 className="zh-main text-4xl text-white mb-4 leading-tight tracking-tighter">
                                    Berkeley 國際永續策略創新師 <br/>
                                    <span className="text-celestial-gold">× TSISDA 國際永續轉型規劃師</span>
                                </h2>
                                <p className="text-gray-300 text-lg leading-relaxed font-light mb-10">
                                    全球唯一整合 Berkeley Haas IBI 頂尖商學院思維與台灣實務轉型任督二脈。打通創價型 ESG 策略與前瞻合規實作的最後一哩路。
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleRegisterStar} className="px-12 py-5 bg-celestial-gold hover:bg-amber-400 text-black font-black rounded-2xl shadow-2xl shadow-amber-500/30 transition-all flex items-center gap-3 uppercase text-xs tracking-widest">
                                        {isZh ? '立即啟航報名' : 'REGISTER_NOW'} <ArrowRight className="w-5 h-5" />
                                    </button>
                                    <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-xs tracking-widest uppercase">
                                        瀏覽成果白皮書
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 課程列表區域 */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courses.map((course) => (
                            <div key={course.id} className="glass-bento flex flex-col group hover:bg-white/[0.03] transition-all border-white/5 rounded-3xl overflow-hidden shadow-xl">
                                <div className="h-32 relative overflow-hidden shrink-0">
                                    <img src={course.thumbnail} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-all duration-700" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                                    <div className="absolute bottom-3 left-3 uni-mini bg-black/80 text-white border border-white/20">LV.{course.level[0]}</div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="zh-main text-lg text-white mb-2 leading-tight group-hover:text-celestial-gold transition-colors">{course.title}</h3>
                                        <span className="en-sub !text-[8px] opacity-40">{course.category}_MODULE_ACTIVE</span>
                                    </div>
                                    <div className="space-y-3 mt-6">
                                        <div className="flex justify-between text-[10px] font-mono text-gray-500">
                                            <span>Progress</span>
                                            <span className="text-white">{course.progress}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${course.progress}%` }} />
                                        </div>
                                        <button onClick={() => setActiveCourse(course)} className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                                            <PlayCircle className="w-3.5 h-3.5" /> Resume_Training
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 欄位 2: 權能狀態與勳章 (4/12) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 min-h-0 overflow-hidden">
                    <div className="glass-bento p-8 flex flex-col bg-slate-900/60 border-celestial-purple/30 rounded-[3rem] shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex flex-col">
                                <span className="zh-main text-lg text-white">權能等級狀態</span>
                                <span className="en-sub">AUTHORITY_EPOCH</span>
                            </div>
                            <div className="p-3 bg-celestial-purple/20 rounded-2xl text-celestial-purple shadow-xl animate-pulse">
                                <Star className="w-6 h-6 fill-current" />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="p-5 rounded-3xl bg-black/40 border border-white/5 relative overflow-hidden">
                                <div className="flex justify-between text-xs font-black mb-3">
                                    <span className="text-gray-500 uppercase tracking-widest">Kernel_Level</span>
                                    <span className="text-white">Lv.{level}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-gradient-to-r from-celestial-purple to-pink-500 animate-pulse" style={{ width: '65%' }} />
                                </div>
                                <span className="text-[9px] text-gray-600 font-mono">NEXT_UPGRADE: 1,450 XP REQUIRED</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center group hover:bg-white/10 transition-all">
                                    <span className="en-sub block mb-1 !mt-0">Cert_Locked</span>
                                    <span className="zh-main text-2xl text-emerald-400">03</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center group hover:bg-white/10 transition-all">
                                    <span className="en-sub block mb-1 !mt-0">Skill_Shards</span>
                                    <span className="zh-main text-2xl text-celestial-gold">14</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-bento p-8 flex-1 flex flex-col bg-slate-900/40 border-white/5 rounded-[3rem] overflow-hidden shadow-xl">
                        <div className="flex justify-between items-center mb-8 shrink-0">
                            <div className="flex flex-col">
                                <span className="zh-main text-lg text-white">素養修煉日誌</span>
                                <span className="en-sub">Literacy_Manifest</span>
                            </div>
                            <Activity className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2">
                            {[
                                { title: '王道思想共鳴', xp: '+150', icon: Heart, color: 'text-rose-400' },
                                { title: 'CBAM 法規解析', xp: '+240', icon: BookOpen, color: 'text-blue-400' },
                                { title: '碳權模擬器熟練', xp: '+100', icon: Target, color: 'text-emerald-400' },
                                { title: 'Berkeley 策略會診', xp: '+500', icon: Crown, color: 'text-celestial-gold' }
                            ].map((log, i) => (
                                <div key={i} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg bg-white/5 ${log.color}`}><log.icon className="w-4 h-4" /></div>
                                        <span className="zh-main text-sm text-gray-300 group-hover:text-white transition-colors">{log.title}</span>
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-emerald-400">{log.xp} XP</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};
