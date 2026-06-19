import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, CheckCircle2, AlertTriangle, AlertOctagon, ArrowRight, Play, Download, RefreshCw, FileText, Shield, HeartPulse } from 'lucide-react';
import { l1HealthCheckService } from '@/services/esg-go/L1HealthCheckService';
import { L1MinimumViableData, L1HealthCheckResult } from '@/types/esg_go_schema';
import { StitchPageTemplate } from '@/components/layout/StitchPageTemplate';

const L1HealthCheckPage: React.FC = () => {
    const [step, setStep] = useState<'form' | 'analyzing' | 'result'>('form');
    const [formData, setFormData] = useState<L1MinimumViableData>({
        companyName: '',
        industry: 'Manufacturing',
        employeeCount: 100,
        hasSustainabilityReport: false,
        hasGhInventory: false,
        hasCodeOfConduct: false,
        supplyChainPolicy: false,
        contactPerson: '',
        email: ''
    });
    const [result, setResult] = useState<L1HealthCheckResult | null>(null);
    const [analysisProgress, setAnalysisProgress] = useState(0);

    const handleDownloadPDF = () => {
        // Mock PDF Generation
        const reportData = JSON.stringify(result, null, 2);
        const blob = new Blob([`ESG L1 Health Check Report\n\nCompany: ${formData.companyName}\n\nScore: ${result?.score}\nStatus: ${result?.overallStatus}\n\nReport Data:\n${reportData}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `L1_HealthCheck_${formData.companyName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleAnalyze = async () => {
        setStep('analyzing');
        setAnalysisProgress(0);

        const progressInterval = setInterval(() => {
            setAnalysisProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 150);

        const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));
        const analysisPromise = l1HealthCheckService.assess(formData);

        const [_, analysis] = await Promise.all([delayPromise, analysisPromise]);

        clearInterval(progressInterval);
        setAnalysisProgress(100);
        await new Promise(resolve => setTimeout(resolve, 300));

        setResult(analysis);
        setStep('result');
    };

    return (
        <StitchPageTemplate
            title="ESG L1 Health Check"
            subtitle="FAST_TRACK_DIAGNOSTIC"
            headerAction={
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-[#63a6b0]/10 text-[#63a6b0] text-xs font-mono rounded border border-[#63a6b0]/20">
                        POC-1 ALPHA
                    </span>
                </div>
            }
        >
            <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    {/* STEP 1: FORM */}
                    {step === 'form' && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl"
                        >
                            <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-8">
                                <div className="size-16 rounded-2xl bg-[#63a6b0]/10 flex items-center justify-center text-[#63a6b0] border border-[#63a6b0]/20">
                                    <HeartPulse className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Corporate Vital Signs</h2>
                                    <p className="text-sm text-slate-400">Initialize Minimum Viable Data (MVD) collection protocol.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#63a6b0]">Company Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-[#63a6b0] outline-none text-white transition-all focus:bg-white/5"
                                        value={formData.companyName}
                                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                        placeholder="Enter company name..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#63a6b0]">Industry Sector</label>
                                    <select
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-[#63a6b0] outline-none text-white transition-all focus:bg-white/5 appearance-none"
                                        value={formData.industry}
                                        onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                    >
                                        <option value="Manufacturing">Manufacturing (Electronics)</option>
                                        <option value="Textile">Textile & Apparel</option>
                                        <option value="Retail">chain Retail</option>
                                        <option value="Service">Professional Services</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#63a6b0] block mb-2">Compliance Checkpoints</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { key: 'hasGhInventory', label: 'GHG Inventory (Scope 1 & 2)' },
                                        { key: 'hasCodeOfConduct', label: 'Code of Conduct Published' },
                                        { key: 'hasSustainabilityReport', label: 'Sustainability Report Released' },
                                        { key: 'supplyChainPolicy', label: 'Supply Chain Policy Active' },
                                    ].map((item) => (
                                        <div
                                            key={item.key}
                                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${formData[item.key as keyof L1MinimumViableData] ? 'bg-[#63a6b0]/10 border-[#63a6b0]/50' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                                            onClick={() => setFormData({ ...formData, [item.key]: !formData[item.key as keyof L1MinimumViableData] })}
                                        >
                                            <div className={`size-5 rounded border flex items-center justify-center transition-colors ${formData[item.key as keyof L1MinimumViableData] ? 'bg-[#63a6b0] border-[#63a6b0]' : 'border-slate-600'}`}>
                                                {formData[item.key as keyof L1MinimumViableData] && <CheckCircle2 className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className={`text-sm font-medium ${formData[item.key as keyof L1MinimumViableData] ? 'text-white' : 'text-slate-400'}`}>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleAnalyze}
                                className="w-full py-4 bg-gradient-to-r from-[#63a6b0] to-cyan-600 rounded-xl font-black uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(99,166,176,0.3)] flex items-center justify-center gap-2 text-white"
                            >
                                <Play className="w-4 h-4 fill-current" /> Start Analysis
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 2: ANALYZING */}
                    {step === 'analyzing' && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-black/40 border border-white/10 rounded-3xl p-12 backdrop-blur-xl text-center"
                        >
                            <div className="relative inline-block mb-8">
                                <div className="absolute inset-0 bg-[#63a6b0] blur-xl opacity-20 rounded-full"></div>
                                <div className="size-24 rounded-full border-4 border-[#63a6b0] border-t-transparent animate-spin relative z-10" />
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <span className="text-xl font-mono font-bold text-[#63a6b0]">{analysisProgress}%</span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black uppercase italic mb-2 text-white">System Scanning</h3>
                            <p className="text-sm text-slate-400 mb-8">Performing 5T Protocol verification and risk assessment...</p>

                            <div className="max-w-md mx-auto h-2 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[#63a6b0]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${analysisProgress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>

                            <div className="flex justify-center gap-8 mt-8 opacity-60">
                                <div className="flex flex-col items-center">
                                    <Shield className="w-5 h-5 mb-1 text-[#63a6b0]" />
                                    <span className="text-[10px] text-slate-400 uppercase">Integrity</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <FileText className="w-5 h-5 mb-1 text-emerald-400" />
                                    <span className="text-[10px] text-slate-400 uppercase">Compliance</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <AlertTriangle className="w-5 h-5 mb-1 text-amber-400" />
                                    <span className="text-[10px] text-slate-400 uppercase">Risk</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: RESULT */}
                    {step === 'result' && result && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            {/* Score Card */}
                            <div className="bg-gradient-to-br from-black/60 to-black/30 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden backdrop-blur-xl">
                                <div className={`absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full pointer-events-none 
                                    ${result.overallStatus === 'Green' ? 'bg-emerald-500/10' : result.overallStatus === 'Yellow' ? 'bg-amber-500/10' : 'bg-red-500/10'}`}
                                />

                                <div className="flex flex-col md:flex-row items-center md:items-start justify-between relative z-10 gap-8">
                                    <div>
                                        <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono text-slate-400 mb-4 border border-white/5">DIAGNOSTIC ID: {Date.now().toString(36).toUpperCase()}</span>
                                        <h2 className="text-4xl font-black uppercase italic text-white mb-2">Health Report</h2>
                                        <div className="flex items-center gap-3">
                                            {result.overallStatus === 'Green' && <span className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20"><CheckCircle2 size={16} /> Low Risk</span>}
                                            {result.overallStatus === 'Yellow' && <span className="flex items-center gap-2 text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20"><AlertTriangle size={16} /> Medium Risk</span>}
                                            {result.overallStatus === 'Red' && <span className="flex items-center gap-2 text-red-500 font-bold bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20"><AlertOctagon size={16} /> High Risk</span>}
                                        </div>
                                    </div>
                                    <div className="text-center md:text-right">
                                        <div className="text-8xl font-black italic tracking-tighter drop-shadow-2xl" style={{ color: result.overallStatus === 'Green' ? '#34d399' : result.overallStatus === 'Yellow' ? '#fbbf24' : '#ef4444' }}>
                                            {result.score}
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">ESG Health Score</span>
                                    </div>
                                </div>

                                <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase text-slate-500 mb-4">Risk Factors</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.riskFactors.length > 0 ? result.riskFactors.map((risk, i) => (
                                                <span key={i} className="px-3 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-lg flex items-center gap-2">
                                                    <AlertOctagon size={14} /> {risk}
                                                </span>
                                            )) : <span className="text-emerald-400 text-sm italic flex items-center gap-2"><CheckCircle2 size={16} /> No critical risks identified.</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Plan */}
                            <div className="bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                                <h3 className="text-lg font-black uppercase italic flex items-center gap-2 mb-6 text-white">
                                    <Play className="text-[#63a6b0] w-5 h-5" /> 90-Day Action Plan
                                </h3>
                                <div className="space-y-3">
                                    {result.ninetyDayTasks.map((task, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/[0.07] hover:border-[#63a6b0]/30 transition-all cursor-pointer">
                                            <div className="flex items-center gap-5">
                                                <div className="size-8 rounded-lg bg-black/30 flex items-center justify-center font-bold text-slate-400 text-xs font-mono border border-white/5">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors">{task.title}</h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] text-[#63a6b0] bg-[#63a6b0]/10 px-2 py-0.5 rounded uppercase font-bold">{task.priority}</span>
                                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{task.estimatedEffort}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-[#63a6b0] transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setStep('form')} className="p-4 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-bold flex items-center justify-center gap-2 transition-all text-slate-300 hover:text-white">
                                    <RefreshCw className="w-4 h-4" /> Retake Analysis
                                </button>
                                <button
                                    onClick={handleDownloadPDF}
                                    className="p-4 rounded-xl bg-[#63a6b0] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#528d96] transition-all shadow-lg shadow-[#63a6b0]/20"
                                >
                                    <Download className="w-4 h-4" /> Export Report
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </StitchPageTemplate>
    );
};

export default L1HealthCheckPage;
