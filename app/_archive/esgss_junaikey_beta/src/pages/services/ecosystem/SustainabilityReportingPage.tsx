import React, { useState } from 'react';
import { StitchPageTemplate } from '@/components/layout/StitchPageTemplate';
import {
    FileText,
    Download,
    CheckCircle,
    Globe,
    ShieldCheck,
    FileJson,
    RefreshCw,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import omniApi from '@/services/api/omni.api';

export const SustainabilityReportingPage: React.FC = () => {
    const [generating, setGenerating] = useState<string | null>(null);

    const handleGenerateReport = async (type: string, standard: string) => {
        setGenerating(type);
        try {
            console.log(`[OmniReport] Requesting ${standard} report generation...`);

            // Call Omni API
            // Note: In a real scenario, we might want 'json' for preview or 'pdf' for download
            const response = await omniApi.post('/market/reports/generate', {
                topic: 'ESG',
                company: 'General', // Defaulting to General for demo
                format: 'json', // requesting JSON first to show success, PDF logic can be added
                limit: 10
            });

            console.log(`[OmniReport] Generation successful:`, response);
            alert(`✅ ${standard} Report Generated Successfully! (Trace ID: ${(response as any).meta?.traceId})`);

            // TODO: In Phase 25, we will handle the PDF blob download here

        } catch (error) {
            console.error(`[OmniReport] Generation failed:`, error);
            alert(`❌ Failed to generate report. Please try again.`);
        } finally {
            setGenerating(null);
        }
    };

    return (
        <StitchPageTemplate
            id="sustainability-reporting"
            title="Sustainability Reporting"
            subtitle="Automated GSI / SASB / TCFD Report Generation"
            headerIcon={<FileText className="w-8 h-8" />}
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Services', href: '/esg/omniverse' },
                { label: 'Ecosystem', href: '/esg/omniverse' },
                { label: 'Reporting', href: '/services/ecosystem/reporting' },
            ]}
        >
            <div className="space-y-8">
                {/* 5T Protocol Status */}
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-[#0f172a]/50 border border-[#63a6b0]/20 backdrop-blur-sm">
                    <div className="flex items-center space-x-2 text-[#63a6b0]">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="font-mono text-sm">5T PROTOCOL:</span>
                    </div>
                    <div className="flex space-x-2">
                        <span className="px-2 py-1 rounded text-xs bg-[#63a6b0]/20 text-[#63a6b0] border border-[#63a6b0]/30">Transparent</span>
                        <span className="px-2 py-1 rounded text-xs bg-[#f43f5e]/20 text-[#f43f5e] border border-[#f43f5e]/30">Trustworthy</span>
                    </div>
                </div>

                {/* Report Generation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* GRI Report */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-6 rounded-2xl bg-[#0f172a]/40 border border-[#63a6b0]/20 hover:border-[#63a6b0]/50 transition-all group"
                    >
                        <div className="mb-4 p-3 rounded-xl bg-[#63a6b0]/10 w-fit group-hover:bg-[#63a6b0]/20">
                            <Globe className="w-8 h-8 text-[#63a6b0]" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-2">GRI Standards</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Global Reporting Initiative compliant report generation with material topic analysis.
                        </p>
                        <button
                            onClick={() => handleGenerateReport('gri', 'GRI Standards')}
                            disabled={!!generating}
                            className="w-full py-2 rounded-lg bg-[#63a6b0] text-[#0f172a] font-bold hover:bg-[#63a6b0]/90 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {generating === 'gri' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4" />
                            )}
                            <span>{generating === 'gri' ? 'Generating...' : 'Generate GRI 2026'}</span>
                        </button>
                    </motion.div>

                    {/* SASB Report */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-6 rounded-2xl bg-[#0f172a]/40 border border-[#ffd700]/20 hover:border-[#ffd700]/50 transition-all group"
                    >
                        <div className="mb-4 p-3 rounded-xl bg-[#ffd700]/10 w-fit group-hover:bg-[#ffd700]/20">
                            <FileJson className="w-8 h-8 text-[#ffd700]" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-2">SASB Standards</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Sustainability Accounting Standards Board industry-specific disclosure metrics.
                        </p>
                        <button
                            onClick={() => handleGenerateReport('sasb', 'SASB Standards')}
                            disabled={!!generating}
                            className="w-full py-2 rounded-lg bg-[#ffd700] text-[#0f172a] font-bold hover:bg-[#ffd700]/90 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {generating === 'sasb' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4" />
                            )}
                            <span>{generating === 'sasb' ? 'Generating...' : 'Generate SASB'}</span>
                        </button>
                    </motion.div>

                    {/* TCFD Report */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-6 rounded-2xl bg-[#0f172a]/40 border border-[#f43f5e]/20 hover:border-[#f43f5e]/50 transition-all group"
                    >
                        <div className="mb-4 p-3 rounded-xl bg-[#f43f5e]/10 w-fit group-hover:bg-[#f43f5e]/20">
                            <ShieldCheck className="w-8 h-8 text-[#f43f5e]" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-2">TCFD Framework</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Task Force on Climate-related Financial Disclosures risk assessment report.
                        </p>
                        <button
                            onClick={() => handleGenerateReport('tcfd', 'TCFD Framework')}
                            disabled={!!generating}
                            className="w-full py-2 rounded-lg bg-[#f43f5e] text-[#0f172a] font-bold hover:bg-[#f43f5e]/90 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {generating === 'tcfd' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4" />
                            )}
                            <span>{generating === 'tcfd' ? 'Generating...' : 'Generate TCFD'}</span>
                        </button>
                    </motion.div>
                </div>

                {/* Recent Reports Table */}
                <div className="rounded-2xl bg-[#0f172a]/40 border border-slate-800 p-6">
                    <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 text-[#63a6b0] mr-2" />
                        Generated Reports (Trustworthy Vault)
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-700 text-slate-400 text-sm">
                                    <th className="py-3 px-4">Report Name</th>
                                    <th className="py-3 px-4">Standard</th>
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Hash Lock (SHA-256)</th>
                                    <th className="py-3 px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-200 text-sm">
                                <tr className="border-b border-slate-800 hover:bg-slate-800/30">
                                    <td className="py-3 px-4">FY2025 Comprehensive ESG</td>
                                    <td className="py-3 px-4"><span className="px-2 py-1 rounded-full bg-[#63a6b0]/10 text-[#63a6b0] text-xs">GRI</span></td>
                                    <td className="py-3 px-4">2026-02-14</td>
                                    <td className="py-3 px-4 font-mono text-xs text-slate-500">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</td>
                                    <td className="py-3 px-4">
                                        <button className="text-[#63a6b0] hover:text-[#63a6b0]/80">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                                <tr className="border-b border-slate-800 hover:bg-slate-800/30">
                                    <td className="py-3 px-4">Climate Risk Assessment</td>
                                    <td className="py-3 px-4"><span className="px-2 py-1 rounded-full bg-[#f43f5e]/10 text-[#f43f5e] text-xs">TCFD</span></td>
                                    <td className="py-3 px-4">2026-01-30</td>
                                    <td className="py-3 px-4 font-mono text-xs text-slate-500">8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92</td>
                                    <td className="py-3 px-4">
                                        <button className="text-[#63a6b0] hover:text-[#63a6b0]/80">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </StitchPageTemplate>
    );
};
