import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Target, Zap, Trophy, ArrowRight } from 'lucide-react';

interface ImpactNexusStepProps {
    onNext: () => void;
}

const ImpactNexusStep: React.FC<ImpactNexusStepProps> = ({ onNext }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-4xl text-center"
        >
            <div className="mb-8">
                <div className="inline-block bg-[#00FFFF]/10 text-[#00FFFF] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                    Stage 3: Impact Nexus
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-4">Enter the Game of Sustainability</h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Transform your knowledge into assets. Complete missions, earn cards, and build your legacy in the blockchain-verified Impact Nexus.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
                {[
                    { title: 'Missions', icon: Target, desc: 'Real-world tasks that generate verified impact score.' },
                    { title: 'Assets', icon: Zap, desc: 'Collect Knowledge Cards as tradeable NFT-like assets.' },
                    { title: 'Legacy', icon: Trophy, desc: 'Build your profile and prove your sustainable contribution.' },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all"
                    >
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-4">
                            <item.icon size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </div>

            <button
                onClick={onNext}
                className="px-10 py-4 bg-[#00FFFF] text-white rounded-full font-bold shadow-xl shadow-[#00FFFF]/30 hover:bg-[#528a96 hover:bg-[#4f838f] transition-all flex items-center gap-3 mx-auto text-lg hover:scale-105"
            >
                Launch Dashboard <ArrowRight size={20} />
            </button>
        </motion.div>
    );
};

export default ImpactNexusStep;

