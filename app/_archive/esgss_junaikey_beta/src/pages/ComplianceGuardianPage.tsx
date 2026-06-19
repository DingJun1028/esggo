import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    Search,
    AlertTriangle,
    FileText,
    Activity,
    CheckCircle,
    Database,
    Zap,
    Scale,
    Eye,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * 💡 自動化合規：自律守衛 (Self-Regulatory Guardian)
 * 核心：5T 邏輯門與 ARVO 覺醒機制
 */

// --- Types ---
interface IRegulation {
    id: string;
    code: string;
    title: string;
    status: 'Compliant' | 'Warning' | 'Violation' | 'Pending';
    impact_level: 'High' | 'Medium' | 'Low';
    last_audit: number;
    evidence_hash?: string;
    reasoning?: string; // Transparent reasoning
}

interface IAuditLog {
    id: string;
    stage: 'Tangible' | 'Traceable' | 'Trackable' | 'Transparent' | 'Trustworthy';
    message: string;
    timestamp: number;
}

// --- Mock Data ---
const INITIAL_REGULATIONS: IRegulation[] = [
    { id: 'REG-001', code: 'GRI Omni', title: 'Omni Standards', status: 'Compliant', impact_level: 'High', last_audit: Date.now() - 100000, evidence_hash: 'sha256:e3b0c442...' },
    { id: 'REG-002', code: 'TW-FSC-004', title: 'Sustainable Development Roadmap', status: 'Compliant', impact_level: 'High', last_audit: Date.now() - 200000 },
    { id: 'REG-003', code: 'TCFD', title: 'Climate-Related Disclosures', status: 'Warning', impact_level: 'Medium', last_audit: Date.now(), reasoning: 'Missing definitive Capital Expenditure (CapEx) plan for transition.' },
];

// --- Components ---

const RadarScanner = ({ isScanning, onFound }: { isScanning: boolean, onFound: () => void }) => {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Radar Grid */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/20" />
            <div className="absolute inset-4 rounded-full border border-cyan-500/10" />
            <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-cyan-500/10" />
            <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-cyan-500/10" />

            {/* Scanning Beam */}
            <motion.div
                animate={isScanning ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute w-full h-full rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(6,182,212,0.1)_60deg,transparent_60deg)]"
                style={{ opacity: isScanning ? 1 : 0 }}
            />

            {/* Core Eye */}
            <div className="z-10 bg-slate-900 border border-cyan-500 p-4 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <Eye className={`w-8 h-8 ${isScanning ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`} />
            </div>

            {/* Blips */}
            {isScanning && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5], opacity: [1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute w-2 h-2 bg-red-500 rounded-full top-1/3 left-1/3 shadow-[0_0_10px_#ef4444]"
                    onAnimationComplete={onFound}
                />
            )}
        </div>
    );
};

const ComplianceCard = ({ reg, isNew = false }: { reg: IRegulation, isNew?: boolean }) => {
    const statusColor =
        reg.status === 'Compliant' ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400' :
            reg.status === 'Warning' ? 'border-amber-500/50 bg-amber-500/5 text-amber-400' :
                reg.status === 'Violation' ? 'border-red-500/50 bg-red-500/5 text-red-400' :
                    'border-slate-500/50 bg-slate-800 text-slate-400';

    return (
        <motion.div
            initial={isNew ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-4 rounded-xl border ${statusColor} mb-3 relative overflow-hidden`}
        >
            {isNew && <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-bl">NEW</div>}

            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                    <Scale className="w-4 h-4" />
                    <span className="font-bold text-sm tracking-wide">{reg.code}</span>
                </div>
                <span className="text-xs font-mono opacity-80">{reg.status.toUpperCase()}</span>
            </div>

            <h4 className="text-slate-200 text-sm mb-2">{reg.title}</h4>

            {reg.reasoning && (
                <div className="bg-black/20 p-2 rounded text-xs opacity-90 font-mono mt-2 flex items-start space-x-2">
                    <Database className="w-3 h-3 mt-0.5 shrink-0" />
                    <span>{reg.reasoning}</span>
                </div>
            )}

            {reg.evidence_hash && (
                <div className="mt-3 flex items-center space-x-1 text-[10px] opacity-60">
                    <ShieldCheck className="w-3 h-3" />
                    <span className="font-mono truncate w-full">{reg.evidence_hash}</span>
                </div>
            )}
        </motion.div>
    );
};

const GuardianPage = () => {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(false);
    const [regulations, setRegulations] = useState<IRegulation[]>(INITIAL_REGULATIONS);
    const [logs, setLogs] = useState<IAuditLog[]>([]);
    const [detectedNewCode, setDetectedNewCode] = useState<string | null>(null);

    // --- Actions ---

    const startScan = () => {
        if (isScanning) return;
        setIsScanning(true);
        addLog('Tangible', 'Initiated global regulatory scan protocol.');

        setTimeout(() => {
            addLog('Traceable', 'Detected signal from EU Legislative Database: "EU AI Act".');
            setDetectedNewCode("EU AI Act");
        }, 2000);

        setTimeout(() => {
            addLog('Trackable', 'Ingesting regulation text. Analyzing for "ESG Impact".');
            const newReg: IRegulation = {
                id: 'REG-NEW-01',
                code: 'EU AI Act',
                title: 'Artificial Intelligence Act (2026)',
                status: 'Warning',
                impact_level: 'High',
                last_audit: Date.now(),
                reasoning: 'Article 50: Transparency obligations for GPAI models detected. Requires updated technical documentation by Q3.',
            };
            setRegulations(prev => [newReg, ...prev]);
            setDetectedNewCode(null);
            setIsScanning(false);
            addLog('Transparent', 'Analysis Complete. Rule Warning issued for AI Model Transparency.');
        }, 4500);
    };

    const addLog = (stage: IAuditLog['stage'], message: string) => {
        setLogs(prev => [{ id: Date.now().toString(), stage, message, timestamp: Date.now() }, ...prev.slice(0, 4)]);
    };

    const resolveWarning = (id: string) => {
        setRegulations(prev => prev.map(r => {
            if (r.id === id) {
                addLog('Trustworthy', `Manual Override: Mitigation plan uploaded for ${r.code}. Sealing status.`);
                return {
                    ...r,
                    status: 'Compliant',
                    evidence_hash: 'sha256:manual_mitigation_' + Date.now().toString().slice(-6),
                    reasoning: 'Mitigation plan uploaded and verified.'
                };
            }
            return r;
        }));
    };

    // --- Render ---

    const stats = {
        compliant: regulations.filter(r => r.status === 'Compliant').length,
        warning: regulations.filter(r => r.status === 'Warning').length,
        score: Math.round((regulations.filter(r => r.status === 'Compliant').length / regulations.length) * 100)
    };

    return (
        <div className="fixed inset-0 bg-[#0f172a] text-slate-200 font-sans flex flex-col overflow-hidden">

            {/* Header */}
            <header className="h-20 shrink-0 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-8 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="bg-cyan-900/50 p-2 rounded-lg border border-cyan-500/30">
                            <ShieldCheck className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-100 tracking-wider">COMPLIANCE GUARDIAN</h1>
                            <div className="flex items-center space-x-2 text-[10px] text-cyan-400/80 font-mono">
                                <span className="animate-pulse">● ONLINE</span>
                                <span>|</span>
                                <span>VER: 2.4.0 (SENTIENT)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-bold leading-none">Compliance Score</div>
                        <div className={`text-xl font-bold font-mono mt-1 ${stats.score === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {stats.score}<span className="text-sm">%</span>
                        </div>
                    </div>
                    <button
                        onClick={startScan}
                        disabled={isScanning}
                        className={`px-4 py-2 rounded-lg border text-sm font-bold flex items-center space-x-2 transition-all ${isScanning ? 'bg-cyan-900/20 border-cyan-500/20 text-cyan-500 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'}`}
                    >
                        <Search className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                        <span>{isScanning ? 'SCANNING...' : 'SYSTEM SCAN'}</span>
                    </button>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* Left Panel: Radar & Stats */}
                <div className="w-80 bg-[#0b1120] border-r border-white/5 flex flex-col p-6 space-y-8 z-10">

                    {/* Visualizer Region */}
                    <div className="flex flex-col items-center justify-center py-4 bg-slate-900/50 rounded-2xl border border-white/5 relative overflow-hidden">
                        <RadarScanner isScanning={isScanning} onFound={() => { }} />
                        {detectedNewCode && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="absolute bottom-4 bg-red-500/20 border border-red-500 text-red-300 px-3 py-1 rounded-full text-xs font-mono flex items-center"
                            >
                                <AlertTriangle className="w-3 h-3 mr-2" />
                                DETECTED: {detectedNewCode}
                            </motion.div>
                        )}
                    </div>

                    {/* Stats Summary */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase">System Status</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg flex flex-col items-center">
                                <span className="text-2xl font-bold text-emerald-400">{stats.compliant}</span>
                                <span className="text-[10px] text-emerald-600/80 uppercase">Secured</span>
                            </div>
                            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex flex-col items-center">
                                <span className="text-2xl font-bold text-amber-400">{stats.warning}</span>
                                <span className="text-[10px] text-amber-600/80 uppercase">Attention</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Cards & Audit */}
                <div className="flex-1 bg-slate-900/50 relative flex flex-col">

                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }}
                    />

                    {/* Content Scroll */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-xl font-light text-slate-300 mb-6 flex items-center">
                                <FileText className="w-5 h-5 mr-3 text-cyan-400" />
                                Active Regulations & Standards
                            </h2>

                            <AnimatePresence>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {regulations.map(reg => (
                                        <div key={reg.id} onClick={() => reg.status === 'Warning' && resolveWarning(reg.id)} className={reg.status === 'Warning' ? "cursor-pointer" : ""}>
                                            <ComplianceCard reg={reg} isNew={reg.id === 'REG-NEW-01'} />
                                        </div>
                                    ))}
                                </div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Bottom: 5T Audit Trail */}
                    <div className="h-48 bg-[#0b1120] border-t border-white/10 shrink-0 p-4 font-mono text-xs overflow-y-auto">
                        <h4 className="text-slate-500 text-[10px] font-bold tracking-widest mb-3 uppercase flex items-center">
                            <Activity className="w-3 h-3 mr-2" />
                            5T Guardian Audit Sequence
                        </h4>
                        <div className="space-y-2">
                            <AnimatePresence>
                                {logs.map(log => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-start space-x-3 text-slate-400"
                                    >
                                        <span className="text-slate-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] ${log.stage === 'Tangible' ? 'bg-emerald-900/50 text-emerald-400' :
                                            log.stage === 'Transparent' ? 'bg-amber-900/50 text-amber-400' :
                                                'bg-blue-900/50 text-blue-400'
                                            }`}>{log.stage}</span>
                                        <span>{log.message}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {logs.length === 0 && <div className="text-slate-600 italic">Core systems compliant. Awaiting scan...</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuardianPage;
