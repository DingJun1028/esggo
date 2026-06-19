import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap, Cpu, Award } from 'lucide-react';
import { OmniTable } from "@/components/omni/liquid-glass/OmniTable";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";

interface DecisionPanelProps {
    decisions: any[];
    validationHistory: any[];
    isLoading?: boolean;
}

export const DecisionPanel: React.FC<DecisionPanelProps> = ({ decisions, validationHistory, isLoading }) => {
    return (
        <div className="flex flex-col gap-8 w-full">
            <LiquidGlassContainer glowColor="fuchsia" intensity="medium" className="p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-transparent z-0"></div>

                <h3 className="text-xl font-black tracking-widest text-white uppercase flex items-center gap-2 italic relative z-10 mb-6">
                    <Award size={24} className="text-fuchsia-400" />
                    歷史決策池 (Decision Pool)
                </h3>

                {isLoading ? (
                    <div className="flex justify-center items-center py-10 relative z-10">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 rounded-full border-t-2 border-r-2 border-fuchsia-500"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        <AnimatePresence>
                            {decisions.map((decision, index) => (
                                <motion.div
                                    key={decision.decisionId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-black/50 border border-white/10 rounded-xl p-5 hover:border-fuchsia-500/50 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-fuchsia-500/20 text-fuchsia-300 tracking-wider">
                                            {decision.decisionId}
                                        </span>
                                        <span className="text-xs font-black text-emerald-400">
                                            {(decision.confidence * 100).toFixed(1)}% CONF
                                        </span>
                                    </div>
                                    <p className="text-sm font-['Outfit'] text-white/90 leading-relaxed mb-4">
                                        {decision.recommendation}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <ShieldAlert size={14} className="text-amber-400" />
                                        <span className="text-xs text-omni-text-muted">
                                            Risk: {decision.riskAssessment?.level || 'UNKNOWN'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {decisions.length === 0 && (
                            <div className="col-span-full text-center py-10 text-white/40">
                                暫無決策紀錄 (No records found)
                            </div>
                        )}
                    </div>
                )}
            </LiquidGlassContainer>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-10"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-transparent to-teal-500/20 rounded-3xl blur-xl opacity-50"></div>
                <OmniTable
                    title="5T 協議驗證記錄 (5T Validation Log)"
                    subtitle="Trustworthy Protocol Audits"
                    columns={[
                        { key: 'decisionId', header: '決策編號 (ID)' },
                        {
                            key: 'status',
                            header: '狀態 (Status)',
                            render: (val) => (
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${val === 'VALID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                    {val}
                                </span>
                            )
                        },
                        {
                            key: 'overallScore',
                            header: '綜評分 (Score)',
                            render: (val) => (
                                <span className="font-['Outfit'] font-black">{(val * 100).toFixed(1)}%</span>
                            )
                        },
                        {
                            key: 'timestamp',
                            header: '時間戳記 (Timestamp)',
                            render: (val) => new Date(val).toLocaleString()
                        }
                    ]}
                    data={validationHistory as any}
                />
            </motion.div>
        </div>
    );
};
