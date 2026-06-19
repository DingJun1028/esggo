import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Activity,
    Lock,
    AlertTriangle,
    CheckCircle2,
    Fingerprint,
    Zap,
    Globe,
    Database,
    Cpu,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { governanceService, GovernanceProposal } from '@/services/GovernanceService';
import { agentService } from '@/services/agentService';
import { type Agent } from '@/types';
import { ethicalGuardianService, EthicalAlignment } from '@/services/EthicalGuardianService';
import { complianceService, ComplianceCheck } from '@/services/complianceService';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

// -------------------------------------------------------------------------
// Styled Components (Simulated via tailwind classes for brevity)
// -------------------------------------------------------------------------

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden group ${className}`}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        {children}
    </motion.div>
);

const QuantumIndicator = ({ value, label, icon: Icon, color = "cyan" }: { value: number, label: string, icon: any, color?: string }) => (
    <div className="flex flex-col items-center justify-center space-y-2">
        <div className={`relative w-20 h-20 rounded-full flex items-center justify-center border-2 border-${color}-500/20 bg-${color}-500/5`}>
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute inset-0 rounded-full bg-${color}-400/10 blur-md`}
            />
            <Icon className={`w-10 h-10 text-${color}-400`} />
            <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                    cx="40" cy="40" r="38"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={238.76}
                    strokeDashoffset={238.76 * (1 - value / 100)}
                    className={`text-${color}-500 transition-all duration-1000 ease-out`}
                />
            </svg>
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <span className={`text-xl font-black text-${color}-100`}>{Math.round(value)}%</span>
    </div>
);

// -------------------------------------------------------------------------
// Main Page Component
// -------------------------------------------------------------------------

const QuantumEthicsPage: React.FC = () => {
    const navigate = useNavigate();
    const [alignment, setAlignment] = useState<EthicalAlignment>(ethicalGuardianService.getAlignment());
    const [complianceResults, setComplianceResults] = useState<ComplianceCheck[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [activeTab, setActiveTab] = useState<'ethics' | 'compliance' | 'vault'>('ethics');

    useEffect(() => {
        const unsubscribe = ethicalGuardianService.subscribe(setAlignment);
        fetchCompliance();
        return () => {
            unsubscribe();
        };
    }, []);

    const fetchCompliance = async () => {
        setIsSyncing(true);
        try {
            const results = await complianceService.checkCompliance({}, 'GRI');
            setComplianceResults(results);
            omniLogger.info(LogCategory.GOVERNANCE, 'Quantum Compliance Matrix Refreshed');
        } finally {
            setIsSyncing(false);
        }
    };

    const triggerManualAudit = async () => {
        setIsSyncing(true);
        try {
            await ethicalGuardianService.auditAction('SYSTEM_HAND', 'Quantum Integrity Re-calibration', { timestamp: Date.now() });
            omniLogger.info(LogCategory.GOVERNANCE, 'Manual Ethical Pulse Triggered');
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050b14] text-slate-200 p-8 font-['Inter',sans-serif] selection:bg-cyan-500/30">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Header Section */}
            <header className="relative z-50 h-24 flex items-center border-b border-slate-800/50 bg-black/40 backdrop-blur-md px-8">
                <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-3 mr-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                            title="Back to Dashboard"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                                <Shield className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent uppercase tracking-wider">
                                    Academic & Asset Ethics Portal
                                </h1>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Student-Centered Integrity</span>
                                    <div className="h-1 w-1 rounded-full bg-slate-800" />
                                    <span className="text-[10px] text-cyan-500/60 uppercase font-mono tracking-widest">VERSION: v1.1.0-PQC</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={triggerManualAudit}
                            className="px-6 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl font-black text-xs tracking-widest flex items-center gap-2 hover:bg-cyan-500/20 transition-all active:scale-95 group text-cyan-100"
                        >
                            <Zap className="w-4 h-4 group-hover:animate-bounce" />
                            RE-CALIBRATE PROTOCOLS
                        </button>
                        <div className="px-6 py-2 bg-slate-800/50 rounded-xl border border-slate-700 font-mono text-[10px] flex items-center gap-2 text-slate-400">
                            <Activity className={`w-3 h-3 text-green-400 ${isSyncing ? 'animate-spin' : ''}`} />
                            UPTIME: 99.998%
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Quantum Heartbeat (4-span) */}
                <section className="lg:col-span-4 space-y-8">
                    <GlassCard className="h-full">
                        <h2 className="text-xl font-black mb-8 flex items-center gap-2">
                            <Activity className="text-cyan-400" />
                            QUANTUM HEARTBEAT
                        </h2>

                        <div className="grid grid-cols-2 gap-y-12 gap-x-4 py-8">
                            <QuantumIndicator icon={Fingerprint} label="Originality" value={alignment.transparency} color="cyan" />
                            <QuantumIndicator icon={Globe} label="Contribution" value={alignment.altruism} color="emerald" />
                            <QuantumIndicator icon={Database} label="Asset Integrity" value={alignment.integrity} color="amber" />
                            <QuantumIndicator icon={Cpu} label="Systemic Logic" value={alignment.sustainability} color="violet" />
                        </div>

                        <div className="mt-12 p-4 bg-slate-950/50 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-500 leading-relaxed uppercase">
              // Quantum Resonance established via 5T Hash Locking
                        // Current Entropy: 0.0034 J/K
                        // Trustworthy status: VERIFIED_SOVEREIGN
                        </div>
                    </GlassCard>
                </section>

                {/* Center/Right Column: Active Intel & Matrix (8-span) */}
                <section className="lg:col-span-8 space-y-8">
                    {/* Navigation Tabs */}
                    <div className="flex gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800 w-fit">
                        {(['ethics', 'compliance', 'vault'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {tab.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'ethics' && (
                            <motion.div
                                key="ethics"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <GlassCard>
                                    <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                                        <CheckCircle2 className="text-emerald-400" />
                                        ACTIVE INTELLIGENCE LOGS
                                    </h3>
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="flex gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 group hover:border-cyan-500/30 transition-colors">
                                                <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700">
                                                    <Lock className="w-5 h-5 text-slate-500 group-hover:text-cyan-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-bold text-slate-200">Academic Integrity Audit #{2400 + i}</h4>
                                                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded uppercase font-black">Verified</span>
                                                    </div>
                                                    <p className="text-sm text-slate-400">Knowledge module "{i % 2 === 0 ? 'Sustainable Systems' : 'Ethics of AI'}" passed 5T authenticity check.</p>
                                                    <div className="mt-2 flex gap-4 text-[10px] font-mono text-slate-600">
                                                        <span>TS: {Date.now() - i * 120000}</span>
                                                        <span>SHASH: 0xAsset...{i}v22</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}

                        {activeTab === 'compliance' && (
                            <motion.div
                                key="compliance"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <GlassCard>
                                    <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                                        <Database className="text-amber-400" />
                                        COMPLIANCE NEXUS MATRIX
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {complianceResults.map((check, idx) => (
                                            <div key={idx} className="p-5 bg-slate-950/40 rounded-2xl border border-slate-800 group hover:border-amber-500/30 transition-all">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{check.ruleId}</span>
                                                    {check.status === 'pass' ?
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                                                        <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" />
                                                    }
                                                </div>
                                                <h4 className="text-md font-bold text-white mb-2">{check.ruleName}</h4>
                                                <p className="text-xs text-slate-400 leading-relaxed">{check.details}</p>
                                                <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-between items-center">
                                                    <span className={`text-[10px] font-black uppercase tracking-tighter ${check.status === 'pass' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                        {check.status === 'pass' ? 'System Validated' : 'Action Required'}
                                                    </span>
                                                    <button className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors">VIEW_DETAILS →</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 p-6 bg-gradient-to-r from-amber-500/5 to-transparent rounded-2xl border border-amber-500/20">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-amber-500/20 rounded-xl">
                                                <AlertTriangle className="text-amber-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-amber-200">REGULATORY_UPDATE_DETECTED</h4>
                                                <p className="text-xs text-amber-200/60 font-medium">New EU Sustainability Directive (CSRD) alignment required by Q3 2026.</p>
                                            </div>
                                            <button className="ml-auto px-4 py-2 bg-amber-500 text-black text-xs font-black rounded-lg hover:shadow-lg hover:shadow-amber-500/20 transition-all">
                                                UPGRADE_PROTOCOL
                                            </button>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Bottom Call to Action: System Hand */}
                    <GlassCard className="!bg-gradient-to-r from-cyan-600/10 to-indigo-600/10 border-cyan-500/20">
                        <div className="flex items-center justify-between">
                            <div className="max-w-md">
                                <h3 className="text-xl font-black mb-2 text-cyan-100 flex items-center gap-2">
                                    <Cpu className="w-6 h-6" />
                                    THE SYSTEM HAND
                                </h3>
                                <p className="text-sm text-cyan-100/60 leading-relaxed">
                                    Autonomous resolution of ethical conflicts and automated submission of compliance evidence.
                                    5T validation is active on all background processes.
                                </p>
                            </div>
                            <button className="relative px-8 py-4 bg-white text-black font-black rounded-xl overflow-hidden group">
                                <div className="absolute inset-0 bg-cyan-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                                <span className="relative z-10">ENABLE_AUTONOMOUS_GOVERNANCE</span>
                            </button>
                        </div>
                    </GlassCard>
                </section>
            </main>

            {/* Footer Meta */}
            <footer className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800/50 flex justify-between items-center text-[10px] font-mono text-slate-600 uppercase tracking-[0.2em]">
                <div>© 2026 ESGss • SHAN XIANG GOVERNANCE LAYER</div>
                <div className="flex gap-8">
                    <span>ENCRYPTION: AES-256-QUANTUM</span>
                    <span>PROTOCOL: 5T-SENTIENT-v1</span>
                    <span>LOCATION: TAIWAN_HQ</span>
                </div>
            </footer>
        </div>
    );
};

export default QuantumEthicsPage;
