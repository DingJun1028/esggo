import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    Shield,
    Zap,
    MessageSquare,
    BookOpen,
    Target,
    Scroll,
    LayoutGrid,
    HelpCircle,
    Pause,
    ChevronRight,
    Star,
    Layers,
    UserCircle
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtocolModal } from '@/components/omni/ProtocolModal';
import { useStitchTheme } from '@/contexts/StitchThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Card Component based on the image style
const NexusCard: React.FC<{ title: string, subtitle: string, color: string, active?: boolean, onClick?: () => void }> = ({ title, subtitle, color, active, onClick }) => (
    <motion.div
        whileHover={{ y: -10, scale: 1.05 }}
        onClick={onClick}
        className={`w-32 h-44 rounded-2xl border-2 flex flex-col items-center p-2 relative cursor-pointer shadow-xl transition-all ${active ? 'ring-4 ring-white/50 scale-110 z-10' : 'opacity-90'
            }`}
        style={{
            backgroundColor: `${color}dd`,
            borderColor: 'rgba(255,255,255,0.3)',
            background: `linear-gradient(135deg, ${color}, ${color}aa)`
        }}
    >
        <div className="w-full aspect-[4/5] bg-white/20 rounded-xl mb-2 overflow-hidden flex items-center justify-center">
            <Layers size={32} className="text-white/50" />
        </div>
        <div className="text-center">
            <p className="text-[10px] font-black text-white leading-tight uppercase">{title}</p>
            <p className="text-[8px] text-white/70 font-bold uppercase">{subtitle}</p>
        </div>
        {active && <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />}
    </motion.div>
);

const ImpactVillagePage: React.FC = () => {
    const { resolvedMode } = useStitchTheme();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const isDark = resolvedMode === 'dark';

    const [modal, setModal] = useState({ isOpen: false, type: 'TRANSPARENT' as any, title: '', content: '' });

    return (
        <MainLayout activeView="village" onViewChange={() => { }}>
            <div className="fixed inset-0 bg-[#4a6b4a] overflow-hidden flex items-center justify-center">
                {/* Simulated Village Background */}
                <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                    <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-emerald-800 rounded-full blur-[100px]" />
                    <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-amber-800 rounded-full blur-[120px]" />
                </div>

                {/* The Map Layout Replicated */}
                <div className="relative w-full h-full max-w-[1200px] max-h-[800px] flex flex-col p-8">

                    {/* Top Content */}
                    <div className="flex justify-between items-start h-full">

                        {/* Task / Mission Panel (Top Left) */}
                        <div className="w-72 p-1 bg-[#8b5a2b] rounded-[24px] shadow-2xl border-4 border-[#5d3a1a]">
                            <div className="bg-[#f4e4bc] rounded-[20px] p-4 text-[#5d3a1a] h-[300px]">
                                <h3 className="text-sm font-black uppercase mb-4 flex items-center gap-2 border-b-2 border-[#5d3a1a]/20 pb-2">
                                    <Scroll size={18} /> {t('mvp.village.tasks')}
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-2">
                                        <input type="checkbox" className="mt-1" defaultChecked />
                                        <p className="text-xs font-bold leading-tight">{t('mvp.village.phase1')}</p>
                                    </div>
                                    <div className="flex items-start gap-2 opacity-50">
                                        <input type="checkbox" className="mt-1" disabled />
                                        <p className="text-xs font-bold leading-tight">{t('mvp.village.phase2')}</p>
                                    </div>

                                    <div className="mt-12 text-center">
                                        <div className="w-16 h-16 rounded-full bg-white/50 mx-auto border-2 border-[#5d3a1a]/20 flex items-center justify-center">
                                            <UserCircle size={32} />
                                        </div>
                                        <p className="text-[10px] font-black mt-2">UUID: AL-99-LEVEL-1</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Center: The Lighthouse & Altar (Visual) */}
                        <div className="flex-1 flex flex-col items-center justify-center relative">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="w-1 bg-blue-400/50 h-64 blur-xl absolute top-0"
                            />
                            <div className="w-24 h-64 bg-slate-300/20 backdrop-blur-md rounded-full relative border border-white/20">
                                <div className="absolute top-0 w-full h-12 bg-blue-400/60 blur-lg animate-pulse" />
                            </div>
                            <div className="mt-8 grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-8 h-24 bg-gradient-to-t from-blue-500/50 to-emerald-500/50 rounded-lg blur-[2px]" />
                                ))}
                            </div>
                        </div>

                        {/* Sovereign Panel (Top Right) */}
                        <div className="w-72 p-1 bg-[#8b5a2b] rounded-[24px] shadow-2xl border-4 border-[#5d3a1a]">
                            <div className="bg-[#f4e4bc] rounded-[20px] p-4 text-[#5d3a1a]">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-white/80 border-2 border-[#5d3a1a]/40" />
                                    <div>
                                        <h3 className="text-xs font-black">靈魂的主權</h3>
                                        <p className="text-[10px] opacity-60">CSO 首席策略官</p>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-[10px] font-bold">
                                        <span>真 (Truth)</span>
                                        <span>98%</span>
                                    </div>
                                    <div className="h-1 bg-[#5d3a1a]/10 rounded-full">
                                        <div className="h-full bg-emerald-500 w-[98%]" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button className="p-2 bg-white/40 rounded-xl text-[9px] font-black uppercase">收藏夾</button>
                                    <button className="p-2 bg-white/40 rounded-xl text-[9px] font-black uppercase">分析報</button>
                                    <button className="p-2 bg-white/40 rounded-xl text-[9px] font-black uppercase">法條庫</button>
                                    <button className="p-2 bg-white/40 rounded-xl text-[9px] font-black uppercase">偵察記</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom: Card Deck Area */}
                    <div className="absolute bottom-12 left-0 right-0 flex justify-center items-end gap-x-4">
                        <NexusCard title={t('mvp.village.data')} subtitle="ISO-14064" color="#63a6b0" onClick={() => navigate('/esg-report-center')} />
                        <NexusCard title={t('mvp.village.intelligence')} subtitle="DR. THOTH" color="#3b82f6" onClick={() => navigate('/intelligence/market')} />
                        <NexusCard title={t('mvp.village.vault')} subtitle="HASH LOCK" color="#f59e0b" active onClick={() => navigate('/quantum-vault')} />
                        <NexusCard title={t('mvp.village.forest')} subtitle="DECARBON" color="#10b981" />
                        <NexusCard title={t('mvp.village.twin')} subtitle="AGENTIC" color="#8b5cf6" onClick={() => navigate('/avatar/center')} />
                    </div>


                    {/* Bottom Right Controls */}
                    <div className="absolute bottom-8 right-8 flex flex-col gap-4">
                        <button className="p-4 bg-[#8b5a2b] rounded-full text-white shadow-xl hover:scale-110 transition-transform"><Pause size={24} /></button>
                        <button className="p-4 bg-[#8b5a2b] rounded-full text-white shadow-xl hover:scale-110 transition-transform"><HelpCircle size={24} /></button>
                        <div className="flex gap-2">
                            <button className="p-4 bg-[#8b5a2b] rounded-full text-white shadow-xl hover:scale-110 transition-transform" onClick={() => navigate('/omni-hub')}><LayoutGrid size={24} /></button>
                            <button className="p-4 bg-[#8b5a2b] rounded-full text-white shadow-xl hover:scale-110 transition-transform" onClick={() => navigate('/')}><Home size={24} /></button>
                        </div>
                    </div>

                </div>
            </div>

            <ProtocolModal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                type={modal.type}
                title={modal.title}
                content={modal.content}
            />
        </MainLayout>
    );
};

export default ImpactVillagePage;
