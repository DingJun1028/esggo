import React from 'react';
import { AlertTriangle, ShieldAlert, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Incident {
    id: string;
    risk_level: 'High' | 'Medium' | 'Low';
    status: string;
    ai_rationale: string;
    market_intelligence_items: {
        title: string;
        url: string;
    };
}

interface RiskAlertBannerProps {
    incidents: Incident[];
    onDismiss?: (id: string) => void;
}

/**
 * 🚨 ESG 風險預警 Banner - 5T 誠信監控前端組件
 * 用於及時展示偵測到的高影響力負面事件。
 */
export const RiskAlertBanner: React.FC<RiskAlertBannerProps> = ({ incidents, onDismiss }) => {
    if (incidents.length === 0) return null;

    return (
        <div className="space-y-3 mb-8">
            <AnimatePresence>
                {incidents.map((incident) => (
                    <motion.div
                        key={incident.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`relative overflow-hidden glass-panel border-l-4 p-5 flex items-start gap-4 ${incident.risk_level === 'High'
                                ? 'border-red-500/50 bg-red-500/5'
                                : 'border-amber-500/50 bg-amber-500/5'
                            }`}
                    >
                        <div className={`p-3 rounded-xl ${incident.risk_level === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                            {incident.risk_level === 'High' ? <ShieldAlert size={24} /> : <AlertTriangle size={24} />}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <span className={`text-[10px] font-black tracking-[0.2em] px-3 py-1 rounded-full border ${incident.risk_level === 'High'
                                        ? 'border-red-500/30 text-red-400 bg-red-500/10'
                                        : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                                    }`}>
                                    CRITICAL RISK DETECTED: {incident.risk_level.toUpperCase()}
                                </span>
                                <h4 className="text-base font-bold text-white/95">
                                    {incident.market_intelligence_items.title}
                                </h4>
                            </div>

                            <div className="max-w-2xl mb-4">
                                <p className="text-sm text-white/60 leading-relaxed italic border-l-2 border-white/10 pl-4">
                                    "AI 判定理由：{incident.ai_rationale}"
                                </p>
                            </div>

                            <div className="flex items-center gap-6">
                                <a
                                    href={incident.market_intelligence_items.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[11px] font-black tracking-widest text-[#63a6b0] hover:text-[#ffd700] transition-colors group"
                                >
                                    TRACING SOURCE ORIGIN <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </a>

                                <span className="text-[10px] font-medium text-white/20 uppercase tracking-tighter">
                                    Sentinel ID: {incident.id.substring(0, 8)}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => onDismiss?.(incident.id)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/40 group relative"
                        >
                            <X size={20} />
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                ACKNOWLEDGE
                            </span>
                        </button>

                        {/* Animated Scanner Scanline Effect */}
                        <motion.div
                            className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
                            animate={{ left: ['-20%', '120%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
