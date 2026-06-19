import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Leaf, Users, ShieldCheck } from 'lucide-react';
import { useI18n } from '../../utils/i18n';
import { useOmniContext } from '@/hooks/useOmniContext';

interface SpiritViewProps {
    onResonanceChange?: (resonance: number) => void;
}

const OpticalBeam = ({ color, value, target, label }: { color: string, value: number, target: number, label: string }) => {
    const diff = Math.abs(value - target);
    const alignment = Math.max(0, 1 - diff);

    // Use semantic colors for the beams
    const colorMap: Record<string, string> = {
        emerald: 'var(--color-t5-traceable)',
        blue: 'var(--color-t5-trackable)',
        purple: 'var(--color-t5-trustworthy)'
    };
    const hexColor = colorMap[color] || 'var(--brand-primary)';

    return (
        <div className="relative h-[300px] flex items-center justify-center mx-4 group">
            <div className="absolute bottom-0 w-full flex flex-col items-center">
                <div
                    className="w-3 h-3 rounded-full opacity-80"
                    style={{ backgroundColor: hexColor, boxShadow: `0 0 15px ${hexColor}` }}
                />
                <div
                    className="w-0.5 h-[60px]"
                    style={{ background: `linear-gradient(to top, ${hexColor}80, transparent)` }}
                />
            </div>
            <motion.div
                className="absolute w-1.5 bg-gradient-to-t from-white/80 via-white/20 to-transparent blur-md"
                style={{
                    height: '100%',
                    backgroundColor: hexColor,
                    opacity: alignment * 0.8,
                    width: Math.max(1, alignment * 15) + 'px',
                }}
                animate={{ opacity: [alignment * 0.6, alignment * 1.0, alignment * 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="absolute top-[20%] w-10 h-1 bg-white/10 backdrop-blur border border-white/20 rounded-full" />
            <div className="absolute bottom-[-35px] text-center">
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: hexColor }}>{label}</p>
                <p className="text-[9px] text-slate-500 font-mono">{Math.round(value * 100)}%</p>
            </div>
        </div>
    );
};

export const SpiritView: React.FC<SpiritViewProps> = ({ onResonanceChange }) => {
    const { t } = useI18n();
    const { playerState, updatePlayerState } = useOmniContext();

    // Initialize from playerState or default
    const [values, setValues] = useState({
        e: (playerState?.personalityProfile.environmental || 50) / 100,
        s: (playerState?.personalityProfile.social || 50) / 100,
        g: (playerState?.personalityProfile.governance || 50) / 100
    });

    // Update local state if playerState changes externally
    useEffect(() => {
        if (playerState) {
            setValues({
                e: playerState.personalityProfile.environmental / 100,
                s: playerState.personalityProfile.social / 100,
                g: playerState.personalityProfile.governance / 100
            });
        }
    }, [playerState]);

    const targets = { e: 0.90, s: 0.85, g: 0.95 };

    const resonance = useMemo(() => {
        const eScore = 1 - Math.abs(values.e - targets.e);
        const sScore = 1 - Math.abs(values.s - targets.s);
        const gScore = 1 - Math.abs(values.g - targets.g);
        const res = ((eScore + sScore + gScore) / 3) * 100;
        onResonanceChange?.(res);
        return res;
    }, [values, onResonanceChange]);

    const handleSliderChange = (key: 'e' | 's' | 'g', val: number) => {
        const newValues = { ...values, [key]: val };
        setValues(newValues);

        if (playerState) {
            updatePlayerState({
                personalityProfile: {
                    ...playerState.personalityProfile,
                    environmental: key === 'e' ? Math.round(val * 100) : playerState.personalityProfile.environmental,
                    social: key === 's' ? Math.round(val * 100) : playerState.personalityProfile.social,
                    governance: key === 'g' ? Math.round(val * 100) : playerState.personalityProfile.governance,
                }
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Resonance Header */}
            <div className="w-full flex justify-between items-center bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
                <div>
                    <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">{t('myNorthStar.title')}</h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{t('myNorthStar.subtitle')}</p>
                </div>
                <div className="px-6 py-2 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center gap-4 shadow-[0_0_20px_var(--brand-primary-rgb,rgba(99,166,176,0.1))]">
                    <div className="text-right">
                        <div className="text-[9px] uppercase font-bold text-brand-primary/80 tracking-tighter">{t('myNorthStar.totalResonance')}</div>
                        <div className="text-2xl font-black text-brand-primary leading-none">{resonance.toFixed(1)}%</div>
                    </div>
                </div>
            </div>

            {/* Prism Stage */}
            <div className="relative w-full h-[400px] flex items-end justify-center perspective-1000">
                <div className="absolute top-[60px] w-24 h-24 bg-brand-primary/5 backdrop-blur-md border border-brand-primary/20 rotate-45 z-10 shadow-[0_0_40px_var(--brand-primary-rgb,rgba(99,166,176,0.1))]" />
                <div className="flex justify-between w-full max-w-xl px-12 pb-16 z-0">
                    <OpticalBeam color="emerald" label={t('myNorthStar.labels.environmental')} value={values.e} target={targets.e} />
                    <OpticalBeam color="blue" label={t('myNorthStar.labels.social')} value={values.s} target={targets.s} />
                    <OpticalBeam color="purple" label={t('myNorthStar.labels.governance')} value={values.g} target={targets.g} />
                </div>
                <motion.div
                    className="absolute top-[0px] w-4 h-4 bg-white rounded-full shadow-[0_0_30px_white,0_0_60px_var(--brand-primary)]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
            </div>

            {/* Control Deck */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 bg-slate-900/40 p-10 rounded-[3rem] border border-white/5 shadow-inner">
                {[
                    { key: 'e', label: t('myNorthStar.enviro'), color: 'emerald', icon: Leaf, desc: t('myNorthStar.enviroDesc'), semantic: 'var(--color-t5-traceable)' },
                    { key: 's', label: t('myNorthStar.social'), color: 'blue', icon: Users, desc: t('myNorthStar.socialDesc'), semantic: 'var(--color-t5-trackable)' },
                    { key: 'g', label: t('myNorthStar.gov'), color: 'purple', icon: ShieldCheck, desc: t('myNorthStar.govDesc'), semantic: 'var(--color-t5-trustworthy)' }
                ].map((item) => (
                    <div key={item.key} className="space-y-4">
                        <div className="flex justify-between text-xs font-black uppercase tracking-tight" style={{ color: item.semantic }}>
                            <span className="flex items-center gap-2"><item.icon size={14} /> {item.label}</span>
                            <span>{(values[item.key as 'e' | 's' | 'g'] * 100).toFixed(0)}%</span>
                        </div>
                        <input
                            type="range" min="0" max="1" step="0.01"
                            value={values[item.key as 'e' | 's' | 'g']}
                            onChange={(e) => handleSliderChange(item.key as any, parseFloat(e.target.value))}
                            className="w-full h-1 bg-slate-700 appearance-none rounded-full cursor-pointer"
                            style={{ accentColor: item.semantic }}
                        />
                        <p className="text-[10px] text-slate-500 leading-relaxed italic">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Dr. Thoth 認證核心</span>
                </div>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className={`w-1 h-3 rounded-full ${s <= 4 ? 'bg-brand-primary' : 'bg-white/10'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};
