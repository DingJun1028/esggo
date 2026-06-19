import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const OmniCirclePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto space-y-6"
            >
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        奧秘圓通 (OmniCircle)
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100">
                        <CardContent className="pt-6">
                            <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Knowledge Assets</div>
                            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">Crystallized 💎</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-cyan-50/50 dark:bg-cyan-900/10 border-cyan-100">
                        <CardContent className="pt-6">
                            <div className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">Sync Status</div>
                            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">Connected 🔗</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100">
                        <CardContent className="pt-6">
                            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Circular Flow</div>
                            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">Flowing 🌊</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-cyan-100 dark:border-cyan-900 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-800 dark:text-slate-100 flex items-center justify-between">
                            Omni Connection Hub
                            <span className="text-xs font-normal text-slate-400 px-2 py-1 rounded bg-slate-100 dark:bg-slate-700">Ver: v8.2.5</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-slate-600 dark:text-slate-300">
                            Welcome to the OmniCircle. This acts as the central node for universal connections and circular economy integration within the InfoOne ecosystem.
                            連成一線，奧秘圓通。
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800">
                                <h3 className="font-semibold text-cyan-700 dark:text-cyan-300 mb-1 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Omni-Connect (OmniSpace)
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Seamlessly connect diverse knowledge assets and internal data across the OmniSpace matrix.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                                <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Circular Flow (OmniTable)
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Visualize and manage the structured resonance of resources in the OmniTable core.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-900 text-cyan-400 font-mono text-sm border border-cyan-500/30 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-cyan-500/5 animate-pulse group-hover:bg-cyan-500/10 transition-colors"></div>
                            <div className="relative">
                                <div>{'>'} OMNI_SYSTEM_STATUS: NIRVANA</div>
                                <div>{'>'} OMNISPACE_RESONANCE: ALIGNED 🌌</div>
                                <div>{'>'} OMNITABLE_STRUCTURE: CRYSTALLIZED 📊</div>
                                <div>{'>'} CIRCULAR_DATA_FLOW: RESONATING 🌊</div>
                                <div>{'>'} 5T_PROTOCOL_SYNC: SUCCESSFUL 🔗</div>
                                <div>{'>'} KNOWLEDGE_CRYSTALLIZATION: 100% 💎</div>
                            </div>
                        </div>

                        <div className="pt-4 text-center text-xs text-slate-400">
                            System Status: <span className="text-emerald-500 font-medium">NIRVANA</span> | Protocol: <span className="text-cyan-500 font-medium">5T-READY</span>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default OmniCirclePage;
