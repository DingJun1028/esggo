import React, { useState } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Settings,
    Cpu,
    CheckCircle,
    ChevronRight,
    ChevronLeft,
    Zap,
    LineChart,
    ShieldCheck,
    Sparkles,
    Building2,
    Calendar,
    Globe
} from 'lucide-react';
import axios from 'axios';

import EvidenceUploader from '@/components/Report/EvidenceUploader';

const OneClickReportWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({
        companyName: '',
        industry: '',
        framework: 'GRI',
        data: {
            carbonEmission: 0,
            energyConsumption: 0,
            employeeCount: 0
        },
        evidence: {} as Record<string, string[]> // metricId -> assetIds
    });
    const [result, setResult] = useState<any>(null);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/api/v1/report/one-click', config);
            if (response.data.success) {
                setResult(response.data.data);
                setStep(4);
            }
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OneClickReportWizard] Generation failed:', { error })
        } finally {
            setLoading(false);
        }
    };

    const addEvidence = (metricId: string, assetId: string) => {
        setConfig(prev => ({
            ...prev,
            evidence: {
                ...prev.evidence,
                [metricId]: [...(prev.evidence[metricId] || []), assetId]
            }
        }));
    };

    const steps = [
        { id: 1, name: '基本資訊 Data Input', icon: <Building2 className="w-5 h-5" /> },
        { id: 2, name: '框架選擇 Framework', icon: <Settings className="w-5 h-5" /> },
        { id: 3, name: '核心數據 Metrics', icon: <Cpu className="w-5 h-5" /> },
        { id: 4, name: '結果生成 Finalization', icon: <CheckCircle className="w-5 h-5" /> }
    ];

    return (
        <div className="min-h-screen bg-[#050c14] text-slate-100 p-8 font-sans selection:bg-[#63a6b0]/30 flex items-center justify-center">
            {/* Background FX */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#63a6b0]/5 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-4xl bg-slate-900/40 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl overflow-hidden shadow-2xl"
            >
                {/* Header / Stepper */}
                <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                                <Sparkles className="text-[#63a6b0]" />
                                一鍵生成中心 <span className="text-[#63a6b0] ml-2">Wizard</span>
                            </h1>
                            <p className="text-xs font-black text-white/30 uppercase tracking-widest mt-1">One-Click ESG Report Generation</p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black italic text-[#63a6b0]/40">0{step}</span>
                            <span className="text-xs font-black text-white/10 uppercase tracking-widest block">/ 04</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-4 relative">
                        <div className="absolute left-0 right-0 h-0.5 bg-white/5 top-1/2 -translate-y-1/2 z-0" />
                        {steps.map((s) => (
                            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                                <div className={`size-10 rounded-xl border flex items-center justify-center transition-all duration-500 ${step >= s.id ? 'bg-[#63a6b0] text-slate-950 border-[#63a6b0] scale-110 shadow-[0_0_20px_#63a6b060]' : 'bg-slate-900 text-white/20 border-white/10'
                                    }`}>
                                    {step > s.id ? <CheckCircle className="w-6 h-6" /> : s.icon}
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-tighter ${step >= s.id ? 'text-[#63a6b0]' : 'text-white/20'}`}>
                                    {s.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-12 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#63a6b0] mb-2 block">公司全稱 Company Name</label>
                                        <input
                                            type="text"
                                            value={config.companyName}
                                            onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                                            placeholder="例如：永續科技股份有限公司"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#63a6b0]/50 transition-all text-lg italic"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#63a6b0] mb-2 block">所屬產業 Industry Segment</label>
                                        <input
                                            type="text"
                                            value={config.industry}
                                            onChange={(e) => setConfig({ ...config, industry: e.target.value })}
                                            placeholder="例如：半導體、製造業、零售"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#63a6b0]/50 transition-all text-lg italic"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {['GRI', 'SASB', 'TCFD', 'Integrated'].map((fw) => (
                                    <button
                                        key={fw}
                                        onClick={() => setConfig({ ...config, framework: fw as any })}
                                        className={`p-8 rounded-[2rem] border transition-all text-left group relative overflow-hidden ${config.framework === fw ? 'bg-[#63a6b0]/10 border-[#63a6b0]' : 'bg-white/5 border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <div className={`size-12 rounded-2xl mb-4 flex items-center justify-center ${config.framework === fw ? 'bg-[#63a6b0] text-slate-950' : 'bg-white/10 text-white'}`}>
                                            <Globe className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-black italic uppercase">{fw}</h3>
                                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-2">
                                            {fw === 'GRI' ? '全球報告倡議' : fw === 'TCFD' ? '氣候相關揭露' : '綜合性框架'}
                                        </p>
                                        {config.framework === fw && <div className="absolute -right-4 -bottom-4 size-16 bg-[#63a6b0]/20 rounded-full blur-xl" />}
                                    </button>
                                ))}
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#63a6b0]">碳排放量 (tCO2e) Carbon Footprint</label>
                                        {config.evidence['carbon'] && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="number"
                                            value={config.data.carbonEmission}
                                            onChange={(e) => setConfig({ ...config, data: { ...config.data, carbonEmission: parseInt(e.target.value) } })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#63a6b0]/50 font-mono text-xl"
                                        />
                                        <EvidenceUploader
                                            label="上傳碳排憑證 Attach Carbon Receipt"
                                            onUploadComplete={(id) => addEvidence('carbon', id)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">員工人數 (HC) Workforce</label>
                                        {config.evidence['employees'] && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="number"
                                            value={config.data.employeeCount}
                                            onChange={(e) => setConfig({ ...config, data: { ...config.data, employeeCount: parseInt(e.target.value) } })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#63a6b0]/50 font-mono text-xl"
                                        />
                                        <EvidenceUploader
                                            label="上傳人力清冊 Attach Payroll/Workforce List"
                                            onUploadComplete={(id) => addEvidence('employees', id)}
                                        />
                                    </div>
                                </div>

                                <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-2xl flex gap-4">
                                    <Zap className="text-yellow-500 shrink-0" />
                                    <p className="text-xs text-yellow-200/60 italic leading-loose">
                                        TIP: 提供佐證單據 (Vouchers) 將大幅提升報告書的「可溯源性得分」，並有助於通過未來可能的第三方稽核。
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && result && (
                            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center py-10">
                                <div className="size-32 rounded-full bg-[#63a6b0]/20 border border-[#63a6b0]/40 mx-auto flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-[#63a6b0]/20 blur-3xl animate-pulse" />
                                    <ShieldCheck className="w-16 h-16 text-[#63a6b0]" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">生成成功！</h2>
                                    <p className="text-white/40 uppercase font-black tracking-[0.3em] text-xs">Report Crystallized Successfully</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">完整性分數</p>
                                        <p className="text-2xl font-black italic text-[#63a6b0]">{result.completenessScore}%</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">生成耗時</p>
                                        <p className="text-2xl font-black italic text-white">{result.generationTime}</p>
                                    </div>
                                </div>
                                <button className="px-12 py-4 bg-[#63a6b0] text-slate-950 font-black uppercase italic tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_20px_40px_rgba(99,166,176,0.3)]">
                                    預覽報告書 Preview
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer / Controls */}
                <div className="p-8 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <button
                        onClick={() => step > 1 && setStep(step - 1)}
                        disabled={step === 1 || step === 4}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors disabled:opacity-0"
                    >
                        <ChevronLeft /> 上一步
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={!config.companyName && step === 1}
                            className="bg-white text-slate-950 px-10 py-3 rounded-xl font-black uppercase italic tracking-widest hover:bg-[#63a6b0] transition-colors flex items-center gap-2"
                        >
                            下一步 <ChevronRight />
                        </button>
                    ) : step === 3 ? (
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="bg-[#63a6b0] text-slate-950 px-12 py-4 rounded-2xl font-black uppercase italic tracking-[0.2em] shadow-[0_0_30px_#63a6b040] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                        >
                            {loading ? <Zap className="animate-spin" /> : <Sparkles />}
                            {loading ? 'AI 生成中...' : '開始一鍵生成'}
                        </button>
                    ) : (
                        <button
                            onClick={() => window.location.href = '/report-hub'}
                            className="text-xs font-black uppercase tracking-widest text-[#63a6b0] border border-[#63a6b0]/20 px-8 py-3 rounded-xl hover:bg-[#63a6b0]/10 transition-all"
                        >
                            返回報告書中心 Back to Hub
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default OneClickReportWizard;
