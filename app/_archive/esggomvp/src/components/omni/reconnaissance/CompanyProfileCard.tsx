/**
 * 💡 企業履歷卡片組件
 * Company Profile Card Component
 */

'use client';

import React from 'react';
import { CompanyProfile } from '@/services/reconnaissance/company-intel-service';
import {
    Globe,
    MapPin,
    Calendar,
    Users,
    Award,
    FileText,
    CheckCircle,
    AlertTriangle,
    ExternalLink
} from 'lucide-react';

interface CompanyProfileCardProps {
    company: CompanyProfile;
    riskAssessment?: {
        score: number;
        factors: string[];
        recommendation: string;
    };
}

const riskColors = {
    1: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
    2: 'text-green-400 bg-green-500/20 border-green-500/30',
    3: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
    4: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
    5: 'text-red-400 bg-red-500/20 border-red-500/30'
};

const riskLabels = {
    1: '極低',
    2: '低',
    3: '中',
    4: '高',
    5: '極高'
};

export const CompanyProfileCard: React.FC<CompanyProfileCardProps> = ({
    company,
    riskAssessment
}) => {
    return (
        <div className="relative p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
            {/* 背景裝飾 */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full" />

            {/* 標題區 */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white">{company.nameZh}</h3>
                    <p className="text-sm text-slate-400">{company.nameEn}</p>
                </div>
                <div className="flex items-center gap-2">
                    {company.esgRating && (
                        <span className="px-2 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                            ESG: {company.esgRating}
                        </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-bold rounded border ${riskColors[company.riskLevel]}`}>
                        風險: {riskLabels[company.riskLevel]}
                    </span>
                </div>
            </div>

            {/* 基本資訊 */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{company.industry}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{company.headquarters}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>成立於 {company.founded} 年</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>{company.employees} 員工</span>
                </div>
            </div>

            {/* 描述 */}
            <p className="text-sm text-slate-300 mb-4">{company.description}</p>

            {/* 認證 */}
            {company.certifications && company.certifications.length > 0 && (
                <div className="mb-4">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs text-slate-400">認證</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {company.certifications.map((cert, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-[10px] bg-slate-700/50 text-slate-300 rounded">
                                {cert}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* 永續報告 */}
            {company.sustainabilityReports && company.sustainabilityReports.length > 0 && (
                <div className="mb-4">
                    <div className="flex items-center gap-1.5 mb-2">
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-xs text-slate-400">永續報告</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {company.sustainabilityReports.map((report, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-[10px] bg-cyan-900/30 text-cyan-300 rounded">
                                {report}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* 風險評估 */}
            {riskAssessment && (
                <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs text-slate-400">風險評估</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                        {riskAssessment.factors.map((factor, idx) => (
                            <span key={idx} className="flex items-center gap-1 px-2 py-0.5 text-[10px] bg-emerald-900/30 text-emerald-300 rounded">
                                <CheckCircle className="w-2.5 h-2.5" />
                                {factor}
                            </span>
                        ))}
                    </div>
                    <p className="text-xs text-slate-300">
                        建議: {riskAssessment.recommendation}
                    </p>
                </div>
            )}

            {/* 官網連結 */}
            <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mt-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">訪問官網</span>
            </a>
        </div>
    );
};

export default CompanyProfileCard;