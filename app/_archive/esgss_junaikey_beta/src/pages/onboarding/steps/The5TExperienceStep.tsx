import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, Database, FileDigit, Fingerprint, Lock, Check } from 'lucide-react';

interface The5TExperienceStepProps {
    onNext: () => void;
}

const The5TExperienceStep: React.FC<The5TExperienceStepProps> = ({ onNext }) => {
    const [verified, setVerified] = useState<string[]>([]);

    const items = [
        { id: 'tangible', title: 'Tangible (可感知)', icon: Eye, desc: 'Visual feedback loops.', color: 'text-blue-500' },
        { id: 'traceable', title: 'Traceable (可溯源)', icon: Database, desc: 'Origin source log.', color: 'text-indigo-500' },
        { id: 'trackable', title: 'Trackable (可追蹤)', icon: FileDigit, desc: 'Lifecycle hooks.', color: 'text-purple-500' },
        { id: 'transparent', title: 'Transparent (可驗算)', icon: Fingerprint, desc: 'Open algorithms.', color: 'text-rose-500' },
        { id: 'trustworthy', title: 'Trustworthy (不可篡改)', icon: Lock, desc: 'Immutable seal.', color: 'text-amber-500' },
    ];

    const toggleVerify = (id: string) => {
        if (!verified.includes(id)) {
            setVerified([...verified, id]);
        }
    };

    const isComplete = verified.length === items.length;

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-3xl"
        >
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">The 5T Protocol Experience</h2>
                <p className="text-slate-500">Verify each attribute to unlock the Trust Anchor.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => toggleVerify(item.id)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all aspect-square ${verified.includes(item.id) ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-105' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${verified.includes(item.id) ? 'bg-emerald-500 text-white' : 'bg-slate-100 ' + item.color}`}>
                            {verified.includes(item.id) ? <Check size={20} /> : <item.icon size={20} />}
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 mb-1">{item.title}</h3>
                        <p className="text-[10px] text-slate-500 leading-tight">{item.desc}</p>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-center">
                <button
                    disabled={!isComplete}
                    onClick={onNext}
                    className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all flex items-center gap-2 ${isComplete ? 'bg-emerald-500 text-white hover:scale-105 shadow-emerald-500/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                    <ShieldCheck size={18} /> Seal & Proceed
                </button>
            </div>
        </motion.div>
    );
};

export default The5TExperienceStep;
