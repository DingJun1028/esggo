'use client';

import React from 'react';
import Link from 'next/link';
import { CompanyReport, ReportType, ReportStatus } from '@/types/esg-sonar';
import { StatusTag, RiskLevelTag } from './ESGTag';
import { RiskLevel } from '@/types/esg-sonar';

interface CompanyReportCardProps {
    report: CompanyReport;
    onClick?: () => void;
    showDetails?: boolean;
    className?: string;
}

// 報告書類型對應圖標
const reportTypeIcons: Record<ReportType, string> = {
    ESG_REPORT: '📈',
    SUSTAINABILITY: '🌱',
    ANNUAL_REPORT: '📊',
    CARBON_INVENTORY: '🌿',
    INTEGRATED: '🔗',
    OTHER: '📄'
};

// 報告書類型對應標籤
const reportTypeLabels: Record<ReportType, string> = {
    ESG_REPORT: 'ESG 報告',
    SUSTAINABILITY: '永續報告',
    ANNUAL_REPORT: '年報',
    CARBON_INVENTORY: '碳盤查報告',
    INTEGRATED: '整合報告',
    OTHER: '其他報告'
};

// 計算風險等級
function calculateRiskLevel(report: CompanyReport): RiskLevel {
    if (report.status === 'FAILED') return 'critical';
    if (report.changeType === 'UPDATED') return 'high';
    if (report.status === 'PENDING') return 'medium';
    return 'low';
}

export function CompanyReportCard({ report, onClick, showDetails = false, className = '' }: CompanyReportCardProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const icon = reportTypeIcons[report.reportType] || '📄';
    const riskLevel = calculateRiskLevel(report);

    return (
        <div
            className={`
        group relative p-5 rounded-xl border transition-all duration-300 cursor-pointer
        hover:shadow-lg hover:-translate-y-1
        bg-[var(--esg-card-bg)] border-[var(--esg-glass-border)]
        ${className}
      `}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
        >
            {/* 裝飾性漸層背景 */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[var(--esg-primary-muted)] to-transparent pointer-events-none" />

            <div className="relative z-10">
                {/* 企業資訊 */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--esg-primary)] to-[var(--esg-accent)] flex items-center justify-center text-white font-bold text-lg">
                            {report.companyName.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-semibold text-[var(--esg-text-main)]">
                                {report.companyName}
                            </h3>
                            {report.companyCode && (
                                <p className="text-sm text-[var(--esg-text-muted)]">
                                    {report.companyCode} · {report.industry || '-'}
                                </p>
                            )}
                        </div>
                    </div>
                    <RiskLevelTag level={riskLevel} />
                </div>

                {/* 報告資訊 */}
                <div className="mb-4 p-4 rounded-lg bg-[var(--esg-surface-2)]">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{icon}</span>
                        <span className="font-medium text-[var(--esg-text-main)]">
                            {reportTypeLabels[report.reportType]}
                        </span>
                        <span className="text-sm text-[var(--esg-text-muted)]">
                            {report.reportYear}年度
                        </span>
                    </div>

                    {/* 版本資訊 */}
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-[var(--esg-text-muted)]">
                            版本 {report.version}
                            {!report.isLatest && <span className="text-[var(--esg-warning)] ml-1">（有新版）</span>}
                        </span>
                        {report.changeType && report.changeType !== 'NO_CHANGE' && (
                            <span className={`
                px-2 py-0.5 rounded text-xs font-medium
                ${report.changeType === 'NEW' ? 'bg-[var(--esg-success)]/20 text-[var(--esg-success)]' : ''}
                ${report.changeType === 'UPDATED' ? 'bg-[var(--esg-warning)]/20 text-[var(--esg-warning)]' : ''}
                ${report.changeType === 'DELETED' ? 'bg-[var(--esg-error)]/20 text-[var(--esg-error)]' : ''}
              `}>
                                {report.changeType === 'NEW' && '✨ 新增'}
                                {report.changeType === 'UPDATED' && '🔄 更新'}
                                {report.changeType === 'DELETED' && '❌ 刪除'}
                            </span>
                        )}
                    </div>
                </div>

                {/* 狀態標籤 */}
                <div className="flex flex-wrap gap-2 mb-3">
                    <StatusTag status={report.status} />
                </div>

                {/* 詳細內容 */}
                {showDetails && report.summary && (
                    <div className="mb-4 p-3 rounded-lg bg-[var(--esg-surface)]">
                        <p className="text-sm text-[var(--esg-text-sub)] line-clamp-3">
                            {report.summary}
                        </p>
                    </div>
                )}

                {/* 日期資訊 */}
                <div className="flex flex-wrap gap-4 text-sm text-[var(--esg-text-muted)]">
                    <div className="flex items-center gap-1">
                        <span>📅</span>
                        <span>發布日期：{formatDate(report.publishDate)}</span>
                    </div>
                </div>

                {/* 底部操作 */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--esg-glass-border)]">
                    <Link
                        href={`/esg-sonar/reports/${report.id}`}
                        className="text-sm font-medium text-[var(--esg-primary)] hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        查看詳情 →
                    </Link>
                    {report.reportUrl && (
                        <a
                            href={report.reportUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[var(--esg-text-muted)] hover:text-[var(--esg-primary)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            報告連結 ↗
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

// 精簡版報告書卡片（小尺寸）
export function CompanyReportCardCompact({ report, className = '' }: { report: CompanyReport; className?: string }) {
    const icon = reportTypeIcons[report.reportType] || '📄';
    const riskLevel = calculateRiskLevel(report);

    return (
        <div
            className={`
        group flex items-center gap-3 p-3 rounded-lg border transition-all duration-200
        hover:bg-[var(--esg-surface-2)] hover:border-[var(--esg-primary)]
        cursor-pointer bg-[var(--esg-card-bg)] border-[var(--esg-glass-border)]
        ${className}
      `}
        >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--esg-primary)]/50 to-[var(--esg-accent)]/50 flex items-center justify-center text-lg flex-shrink-0">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="font-medium text-[var(--esg-text-main)] truncate">
                        {report.companyName}
                    </h4>
                    <span className="text-xs text-[var(--esg-text-muted)]">
                        {report.reportYear}
                    </span>
                </div>
                <p className="text-xs text-[var(--esg-text-muted)]">
                    {reportTypeLabels[report.reportType]}
                </p>
            </div>
            <div className="flex flex-col items-end gap-1">
                <StatusTag status={report.status} />
                <RiskLevelTag level={riskLevel} />
            </div>
        </div>
    );
}

// 載入中的骨架卡片
export function CompanyReportCardSkeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`p-5 rounded-xl border bg-[var(--esg-card-bg)] border-[var(--esg-glass-border)] ${className}`}>
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[var(--esg-surface-2)] animate-pulse" />
                    <div>
                        <div className="h-5 w-32 bg-[var(--esg-surface-2)] rounded animate-pulse mb-1" />
                        <div className="h-4 w-24 bg-[var(--esg-surface-2)] rounded animate-pulse" />
                    </div>
                </div>
                <div className="h-6 w-16 bg-[var(--esg-surface-2)] rounded-full animate-pulse" />
            </div>
            <div className="mb-4 p-4 rounded-lg bg-[var(--esg-surface-2)]">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[var(--esg-surface)] animate-pulse" />
                    <div className="h-5 w-24 bg-[var(--esg-surface)] rounded animate-pulse" />
                    <div className="h-4 w-16 bg-[var(--esg-surface)] rounded animate-pulse" />
                </div>
                <div className="h-4 w-20 bg-[var(--esg-surface)] rounded animate-pulse" />
            </div>
            <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-[var(--esg-surface-2)] rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-[var(--esg-surface-2)] rounded-full animate-pulse" />
            </div>
        </div>
    );
}