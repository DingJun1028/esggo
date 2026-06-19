import React from 'react';
import { INexusCard } from '@/core/omni-types';
import { LucideIcon, Shield, Zap, Info, Layers, Sword } from 'lucide-react';

/**
 * 🎴 PixelNexusCard.tsx
 * 2D 像素風格的靈魂卡牌組件 (16-bit Aesthetic)
 * 結合 LiquidGlass 的質感與像素的代入感。
 */
interface PixelNexusCardProps {
    card: INexusCard;
    onClick?: () => void;
    isHovered?: boolean;
}

export const PixelNexusCard: React.FC<PixelNexusCardProps> = ({ card, onClick, isHovered }) => {
    const getElementColor = (element: INexusCard['element']) => {
        switch (element) {
            case 'Environment': return 'text-emerald-400 border-emerald-500/50 shadow-emerald-500/20';
            case 'Social': return 'text-sky-400 border-sky-500/50 shadow-sky-500/20';
            case 'Governance': return 'text-indigo-400 border-indigo-500/50 shadow-indigo-500/20';
            default: return 'text-cyan-400 border-cyan-500/50 shadow-cyan-500/20';
        }
    };

    const getRarityStyle = (rarity: INexusCard['rarity']) => {
        switch (rarity) {
            case 'Omni': return 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 animate-pulse';
            case 'Legendary': return 'bg-gradient-to-br from-purple-600 to-indigo-800';
            case 'Epic': return 'bg-gradient-to-br from-pink-600 to-rose-800';
            case 'Rare': return 'bg-gradient-to-br from-blue-600 to-cyan-800';
            default: return 'bg-slate-700';
        }
    };

    return (
        <div
            className={`relative w-64 h-80 rounded-sm cursor-pointer transition-all duration-300 transform ${isHovered ? 'scale-105 -translate-y-2' : ''} active:scale-95`}
            onClick={onClick}
            style={{
                imageRendering: 'pixelated',
                boxShadow: isHovered ? '0 0 30px rgba(99, 166, 176, 0.4)' : 'none'
            }}
        >
            {/* 像素外框 (8-bit Border) */}
            <div className={`absolute inset-0 border-4 ${getElementColor(card.element).split(' ')[1]} bg-black/90 p-1`}>
                {/* 內框 (Inset Border) */}
                <div className="absolute inset-1 border-2 border-white/10" />

                {/* 頂部標籤 (Header) */}
                <div className="relative z-10 flex justify-between items-center p-2 border-b-2 border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-tighter truncate max-w-[70%]">
                        {card.name}
                    </span>
                    <div className="flex items-center gap-1">
                        <span className={`text-[8px] px-1 rounded-sm border ${getRarityStyle(card.rarity)} text-white`}>
                            {card.rarity[0]}
                        </span>
                    </div>
                </div>

                {/* 像素圖像區域 (Illustration) */}
                <div className="relative w-full h-36 bg-slate-900 overflow-hidden group">
                    {card.visualUrl ? (
                        <img
                            src={card.visualUrl}
                            alt={card.name}
                            className="w-full h-full object-cover"
                            style={{ imageRendering: 'pixelated' }}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-50">
                            <Layers className="w-8 h-8 text-cyan-500/30" />
                            <span className="text-[8px] uppercase tracking-widest text-white/20">Awaiting Sprite</span>
                        </div>
                    )}

                    {/* 維度標誌 (Element Icon) */}
                    <div className="absolute bottom-1 right-1 bg-black/80 border border-white/20 p-1">
                        <span className={`text-[8px] font-bold ${getElementColor(card.element).split(' ')[0]}`}>
                            {card.element[0]}
                        </span>
                    </div>
                </div>

                {/* 能力與數值 (Stats & Abilities) */}
                <div className="relative z-10 p-3 space-y-2">
                    {/* 六德微型雷達 (Virtue Mini-Grid) */}
                    <div className="grid grid-cols-3 gap-1 mb-2">
                        {Object.entries(card.attributes).map(([key, val]) => (
                            <div key={key} className="flex flex-col items-center p-1 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <span className="text-[6px] text-white/40 uppercase">{key.slice(0, 3)}</span>
                                <span className="text-[8px] font-bold text-cyan-400">{val}</span>
                            </div>
                        ))}
                    </div>

                    {/* 首位技能 (Primary Ability) */}
                    {card.abilities[0] && (
                        <div className="p-2 bg-slate-800/50 border-l-2 border-cyan-500">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[8px] font-bold text-white uppercase">{card.abilities[0].name}</span>
                                <span className="text-[8px] text-yellow-400">Pwr: {card.abilities[0].power}</span>
                            </div>
                            <p className="text-[7px] text-white/40 leading-tight">
                                {card.abilities[0].description}
                            </p>
                        </div>
                    )}
                </div>

                {/* 底部裝飾線 (Footer Deco) */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center px-1">
                    <span className="text-[8px] text-white/20">UUID: {card.uuid.slice(0, 8)}</span>
                    <Sword className="w-2 h-2 text-rose-500/50" />
                </div>
            </div>

            {/* 玻璃反光特效 (LiquidGlass Highlight) */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent z-20 group-hover:block" />
        </div>
    );
};
