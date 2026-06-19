import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    FlaskConical,
    Sparkles,
    Trophy,
    Zap,
    BookOpen,
    ChevronRight,
    ShieldCheck,
    Cpu
} from 'lucide-react';
import { skillService, MasterySkill, SkillShard } from '../services/SkillService';

export const SkillMasteryPage: React.FC = () => {
    const navigate = useNavigate();
    const [skills, setSkills] = useState<MasterySkill[]>([]);
    const [shards, setShards] = useState<SkillShard[]>([]);
    const [selectedShards, setSelectedShards] = useState<string[]>([]);
    const [isAlchemyActive, setIsAlchemyActive] = useState(false);

    useEffect(() => {
        setSkills(skillService.getSkills());
        setShards(skillService.getAvailableShards());
    }, []);

    const toggleShard = (id: string) => {
        setSelectedShards(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const runAlchemy = () => {
        if (selectedShards.length === 0) return;
        setIsAlchemyActive(true);

        setTimeout(() => {
            const result = skillService.performAlchemy(selectedShards);
            setSkills([...skillService.getSkills()]);
            setSelectedShards([]);
            setIsAlchemyActive(false);
            alert(result.message);
        }, 2000);
    };

    return (
        <div className="h-screen w-screen text-[var(--tiffany-text)] font-sans relative overflow-hidden bg-black transition-colors duration-500">
            {/* 🌌 Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-[#81D8D0]/05 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-[#D4AF37]/03 blur-[100px] rounded-full" />
            </div>

            {/* 🧭 Header HUD */}
            <header className="absolute top-0 left-0 right-0 h-20 p-6 flex justify-between items-center z-50">
                <div className="flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate('/')}
                        className="p-3 bg-[var(--tiffany-glass-bg)] backdrop-blur-md border border-[var(--tiffany-border)] rounded-full hover:bg-[rgba(var(--tiffany-blue),0.1)] transition-colors group"
                    >
                        <ArrowLeft className="text-[var(--tiffany-text-secondary)] group-hover:text-[#81D8D0]" />
                    </motion.button>
                    <div>
                        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] to-[#81D8D0] italic uppercase tracking-widest">
                            技能 <span className="text-[var(--tiffany-text)]">掌握中心</span>
                        </h1>
                        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-[#D4AF37]/70">
                            <Sparkles size={10} className="animate-pulse" />
                            <span>鍊金協議：在線</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-[#81D8D0]/40 uppercase tracking-tighter">主權 XP</span>
                        <span className="text-xl font-black text-[#D4AF37] italic">12,450</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl liquid-crystal-panel flex items-center justify-center border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                        <Trophy size={20} className="text-[#D4AF37]" />
                    </div>
                </div>
            </header>

            {/* 🍱 Main Bento Grid Layout */}
            <main className="absolute inset-0 pt-24 pb-8 px-6 grid grid-cols-12 grid-rows-6 gap-6">

                {/* 🧩 Skill Mosaic: 4 cols, rows 1-6 */}
                <section className="col-span-4 row-span-6 flex flex-col gap-4 overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xs font-black tracking-widest uppercase text-[#81D8D0]/60 flex items-center gap-2">
                            <BookOpen size={14} /> 已掌握技能
                        </h2>
                        <span className="text-[10px] font-black text-[#81D8D0]/40">4/24 已解鎖</span>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                        {skills.map(skill => (
                            <motion.div
                                key={skill.id}
                                className={`liquid-crystal-panel p-5 rounded-3xl border ${skill.unlocked ? 'border-[var(--tiffany-border)]' : 'border-white/5 opacity-40'} relative group overflow-hidden`}
                                whileHover={skill.unlocked ? { x: 5 } : {}}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[10px] font-black text-[#81D8D0] uppercase tracking-tighter">{skill.category}</span>
                                    <span className="text-xs font-black text-[#D4AF37]">等級 {skill.level}</span>
                                </div>
                                <h3 className="text-sm font-black text-[var(--tiffany-text)] uppercase italic mb-3">
                                    {skill.unlocked ? skill.name : '?????? ?????'}
                                </h3>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-[#81D8D0] to-[#D4AF37]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(skill.xp / skill.nextLevelXp) * 100}%` }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 🧪 Alchemy Vessel: 5 cols, rows 1-6 */}
                <section className="col-span-5 row-span-6 liquid-crystal-panel rounded-[3rem] border border-[#81D8D0]/20 relative flex flex-col items-center justify-center bg-[rgba(129,216,208,0.02)]">
                    <div className="absolute top-8 flex flex-col items-center">
                        <span className="text-[10px] font-black tracking-widest text-[#81D8D0]/50 uppercase">轉化反應爐</span>
                        <h2 className="text-lg font-black text-[var(--tiffany-text)] italic italic">技能鍊金</h2>
                    </div>

                    {/* Central Reactor Visual */}
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        <motion.div
                            className="absolute inset-0 rounded-full border border-[#81D8D0]/10"
                            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                            className="absolute inset-4 rounded-full border-2 border-dashed border-[#81D8D0]/05"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                        />

                        <div className={`transition-all duration-1000 ${isAlchemyActive ? 'scale-150 blur-sm' : 'scale-100'}`}>
                            <FlaskConical size={80} className={`text-[#81D8D0] ${isAlchemyActive ? 'animate-bounce' : ''}`} />
                        </div>

                        {/* Floating Shard Icons into the reactor */}
                        <AnimatePresence>
                            {selectedShards.map((id, idx) => (
                                <motion.div
                                    key={id}
                                    initial={{ scale: 0, opacity: 0, x: 100, y: 100 }}
                                    animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                                    exit={{ scale: 0, opacity: 0, y: -50 }}
                                    className="absolute"
                                    style={{
                                        top: `${Math.sin(idx) * 80 + 100}px`,
                                        left: `${Math.cos(idx) * 80 + 100}px`
                                    }}
                                >
                                    <Zap size={14} className="text-[#D4AF37]" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="absolute bottom-12 flex flex-col items-center gap-4 w-full px-12">
                        <p className="text-[10px] text-center font-black text-[var(--tiffany-text-secondary)] uppercase tracking-widest">
                            組合最佳實踐碎片以解鎖或升級操作技能。
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={selectedShards.length === 0 || isAlchemyActive}
                            onClick={runAlchemy}
                            className={`w-full py-4 rounded-2xl font-black tracking-[0.3em] uppercase transition-all border shadow-lg
                                ${selectedShards.length > 0
                                    ? 'bg-[#81D8D0] text-black border-[#81D8D0] shadow-[#81D8D0]/20'
                                    : 'bg-white/5 text-white/20 border-white/10 cursor-not-allowed'}`}
                        >
                            {isAlchemyActive ? '精煉中...' : '啟動轉化'}
                        </motion.button>
                    </div>
                </section>

                {/* 💎 Best Practice Shards: 3 cols, rows 1-6 */}
                <section className="col-span-3 row-span-6 flex flex-col gap-4 overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap size={14} className="text-[#D4AF37]" />
                        <h2 className="text-xs font-black tracking-widest uppercase text-[#D4AF37]/60">實踐碎片</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                        {shards.map(shard => (
                            <motion.div
                                key={shard.id}
                                onClick={() => toggleShard(shard.id)}
                                className={`liquid-crystal-panel p-5 rounded-3xl border transition-all cursor-pointer relative group
                                    ${selectedShards.includes(shard.id)
                                        ? 'border-[#D4AF37] bg-[rgba(212,175,55,0.05)] shadow-inner'
                                        : 'border-white/10 hover:border-[#D4AF37]/50'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${shard.rarity === 'SOVEREIGN' ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30' : 'bg-white/5 text-white/40 border-white/10'} uppercase tracking-tighter`}>
                                        {shard.rarity === 'SOVEREIGN' ? '主權級' : '稀有'}
                                    </span>
                                    <Cpu size={12} className="text-white/20" />
                                </div>
                                <h4 className="text-xs font-black text-[var(--tiffany-text)] uppercase leading-tight group-hover:text-[#D4AF37] transition-colors">{shard.title}</h4>
                                <p className="text-[9px] font-black text-[var(--tiffany-text-secondary)] mt-2 uppercase opacity-50">{shard.source}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* HUD Mini Section */}
                    <div className="mt-auto liquid-crystal-panel p-4 rounded-3xl border-[var(--tiffany-border)] bg-[#81D8D0]/05">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-[#81D8D0]/60 uppercase">系統完整性</span>
                            <span className="text-[10px] font-black text-[#81D8D0]">在線</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-[#81D8D0]" />
                            <span className="text-[11px] font-black italic">信任層安全</span>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default SkillMasteryPage;
