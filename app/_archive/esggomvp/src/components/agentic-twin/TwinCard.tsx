import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface TwinCardProps {
    id: string;
    name: string;
    type: string;
    description: string;
    isActive?: boolean;
    onClick?: () => void;
}

export const TwinCard: React.FC<TwinCardProps> = ({ id, name, type, description, isActive, onClick }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                relative p-4 rounded-xl cursor-pointer border backdrop-blur-md overflow-hidden
                ${isActive ? 'bg-rose-500/20 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-black/40 border-white/10 hover:border-white/20'}
            `}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            <div className="flex items-start gap-4 relative z-10">
                <div className={`
                    p-3 rounded-lg flex items-center justify-center
                    ${isActive ? 'bg-rose-500/30 text-rose-300' : 'bg-white/10 text-white/70'}
                `}>
                    <Brain size={24} className={isActive ? 'animate-pulse' : ''} />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <h4 className="text-white font-black tracking-wide">{name}</h4>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                            {type}
                        </span>
                    </div>
                    <p className="text-sm text-omni-text-muted font-['Outfit'] leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>

            {isActive && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            )}
        </motion.div>
    );
};
