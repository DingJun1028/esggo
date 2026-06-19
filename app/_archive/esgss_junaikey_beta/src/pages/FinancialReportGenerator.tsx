import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Download,
    Calendar,
    FileSpreadsheet,
    Printer,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { ReportService } from '@/services/ReportService';
import { AssetService } from '@/services/AssetService';
import { financialImpactService, FinancialImpactMetrics, ImpactBreakdown } from '@/services/FinancialImpactService';
import { format } from 'date-fns';

const ReportTypeCard = ({
    title,
    description,
    icon: Icon,
    selected,
    onClick
}: {
    title: string;
    description: string;
    icon: any;
    selected: boolean;
    onClick: () => void
}) => (
    <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
      cursor-pointer p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden
      ${selected
                ? 'bg-aqua-500/10 border-aqua-500 shadow-[0_0_20px_rgba(99,166,176,0.2)]'
                : 'bg-white/5 border-white/10 hover:border-white/30'
            }
    `}
    >
        <div className={`p-3 rounded-xl w-fit mb-4 ${selected ? 'bg-aqua-500 text-[#050c0c]' : 'bg-white/10 text-gray-400'}`}>
            <Icon size={24} />
        </div>
        <h3 className={`text-lg font-bold mb-2 ${selected ? 'text-white' : 'text-gray-300'}`}>{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>

        {selected && (
            <div className="absolute top-4 right-4 text-aqua-400">
                <CheckCircle2 size={20} />
            </div>
        )}
    </motion.div>
);

export const FinancialReportGenerator: React.FC = () => {
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [assets, setAssets] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<FinancialImpactMetrics | null>(null);
    const [breakdown, setBreakdown] = useState<ImpactBreakdown[]>([]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [assetList, impactMetrics, impactBreakdown] = await Promise.all([
                    AssetService.getStrategicAssets(),
                    financialImpactService.calculateImpact(),
                    financialImpactService.getImpactBreakdown()
                ]);
                setAssets(assetList);
                setMetrics(impactMetrics);
                setBreakdown(impactBreakdown);
            } catch (error) {
                console.error('Failed to load report data:', error);
            }
        };
        loadInitialData();
    }, []);

    const handleGenerate = async (formatType: 'pdf' | 'excel') => {
        if (!selectedType) return;
        setIsGenerating(true);

        try {
            let reportData: any;

            if (selectedType === 'esg') {
                reportData = {
                    title: `ESG Impact Summary - ${format(new Date(), 'yyyy Q1')}`,
                    headers: ['Asset Type', 'Origin', 'Verifier', 'Status', 'Gold Weight'],
                    rows: assets.map(a => [
                        a.asset_type,
                        a.evidence?.traceable?.source_origin || 'Unknown',
                        a.evidence?.trackable?.lifecycle_hooks?.[0]?.actor || 'System',
                        a.current_state || 'CALCULABLE',
                        `${a.gold_weight}%`
                    ]),
                    meta: {
                        generatedBy: 'JunAiKey Intelligence',
                        generatedAt: new Date().toLocaleString(),
                        description: 'Detailed ESG asset integrity report based on 5T Protocol validation.'
                    }
                };
            } else if (selectedType === 'financial') {
                reportData = {
                    title: `Financial Overview - ${format(new Date(), 'yyyy Q1')}`,
                    headers: ['Category', 'Value', 'Description'],
                    rows: [
                        ['Total Savings', `$${metrics?.totalSavings.toLocaleString()}`, 'Reclaimed efficiency from risk mitigation'],
                        ['Risk Mitigation', `$${metrics?.riskMitigationValue.toLocaleString()}`, 'Value of integrity score improvement'],
                        ['Carbon Tax Exp.', `$${metrics?.carbonTaxExposure.toLocaleString()}`, 'Potential environmental cost exposure'],
                        ['ROI', `${metrics?.roi.toFixed(2)}%`, 'Strategic return on ESG investment'],
                        ...breakdown.map(b => [b.category, `$${b.impactValue.toLocaleString()}`, b.description])
                    ],
                    meta: {
                        generatedBy: 'Financial Engine v2',
                        generatedAt: new Date().toLocaleString(),
                        description: 'Financial impact analysis correlating ESG performance with monetary value.'
                    }
                };
            } else {
                // Audit Log Export
                reportData = {
                    title: `Audit Log Export - ${format(new Date(), 'yyyy-MM-dd')}`,
                    headers: ['Timestamp', 'Event', 'UUID', 'Protocol Level'],
                    rows: assets.filter(a => a.id).map(a => [
                        new Date(a.timestamp || Date.now()).toLocaleString(),
                        'ASSET_CRYSTALLIZATION',
                        a.uuid,
                        a.logic_state || 'TRUSTWORTHY'
                    ]),
                    meta: {
                        generatedBy: 'OmniPriest Auditor',
                        generatedAt: new Date().toLocaleString(),
                        description: 'Raw system audit log for compliance and security verification.'
                    }
                };
            }

            if (formatType === 'pdf') {
                ReportService.generatePDF(reportData, `Report-${selectedType}-${Date.now()}.pdf`);
            } else {
                ReportService.generateExcel(reportData, `Report-${selectedType}-${Date.now()}.xlsx`);
            }
        } catch (error) {
            console.error('Generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-8 space-y-8 min-h-screen bg-[#020617] text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">
                        Report Generator
                    </h1>
                    <p className="text-white/60 font-mono text-sm mt-2">
                        Professional Grade • Multi-Format • Validated Data
                    </p>
                </div>
            </div>

            {/* Report Type Selection */}
            <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-1 h-6 bg-teal-500 rounded-full" />
                Select Report Type
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ReportTypeCard
                    title="ESG Impact Summary"
                    description="Comprehensive overview of Environmental, Social, and Governance performance metrics."
                    icon={FileText}
                    selected={selectedType === 'esg'}
                    onClick={() => setSelectedType('esg')}
                />
                <ReportTypeCard
                    title="Financial Overview"
                    description="Detailed financial statement analysis including balance sheets and cash flow."
                    icon={FileSpreadsheet}
                    selected={selectedType === 'financial'}
                    onClick={() => setSelectedType('financial')}
                />
                <ReportTypeCard
                    title="Audit Log Export"
                    description="Raw system event logs and security audit trails for compliance validation."
                    icon={Printer}
                    selected={selectedType === 'audit'}
                    onClick={() => setSelectedType('audit')}
                />
            </div>

            {/* Action Area */}
            {selectedType && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm"
                >
                    <div>
                        <h3 className="text-xl font-bold mb-1">Ready to Export</h3>
                        <p className="text-gray-400 text-sm">
                            Selected: <span className="text-teal-400 font-bold uppercase">{selectedType} Report</span>
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            disabled={isGenerating}
                            onClick={() => handleGenerate('excel')}
                            className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/50"
                        >
                            {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <FileSpreadsheet className="mr-2" size={18} />}
                            Export Excel
                        </Button>

                        <Button
                            disabled={isGenerating}
                            onClick={() => handleGenerate('pdf')}
                            className="bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20"
                        >
                            {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" size={18} />}
                            Download PDF
                        </Button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default FinancialReportGenerator;
