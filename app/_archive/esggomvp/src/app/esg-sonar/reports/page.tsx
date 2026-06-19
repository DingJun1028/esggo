'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CompanyReport, ReportFilters, PaginatedResponse } from '@/types/esg-sonar';
import { CompanyReportCard, CompanyReportCardSkeleton } from '@/components/esg-sonar/CompanyReportCard';
import { FilterPanel } from '@/components/esg-sonar/FilterPanel';
import { useTheme } from '@/components/esg-sonar/DarkThemeProvider';

export default function ReportsPage() {
    const [reports, setReports] = useState<CompanyReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const { theme, toggleTheme } = useTheme();

    const pageSize = 10;

    const [filters, setFilters] = useState<ReportFilters>({});

    // 獲取報告書數據
    const fetchReports = useCallback(async (pageNum: number = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', pageNum.toString());
            params.set('pageSize', pageSize.toString());

            if (searchQuery) params.set('search', searchQuery);
            if (filters.companyName) params.set('search', filters.companyName);
            if (filters.companyCode) params.set('companyCode', filters.companyCode);
            if (filters.industries?.length) params.set('industries', filters.industries.join(','));
            if (filters.reportTypes?.length) params.set('reportTypes', filters.reportTypes.join(','));
            if (filters.reportYears?.length) params.set('reportYears', filters.reportYears.join(','));
            if (filters.status?.length) params.set('status', filters.status.join(','));

            const response = await fetch(`/api/esg-sonar/reports?${params}`);
            const result = await response.json();

            if (result.success) {
                setReports(result.data.items);
                setTotal(result.data.total);
                setPage(pageNum);
            }
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, filters]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleFilterChange = (newFilters: Record<string, unknown>) => {
        setFilters(newFilters as ReportFilters);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchReports(1);
    };

    const handlePageChange = (newPage: number) => {
        fetchReports(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalPages = Math.ceil(total / pageSize);

    // 企業搜尋表單
    const CompanySearchForm = () => (
        <form onSubmit={handleSearch} className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                🔍
            </span>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋企業名稱或股票代碼..."
                className="
          w-full pl-12 pr-4 py-3 rounded-xl
          bg-[var(--esg-card-bg)] border border-[var(--esg-glass-border)]
          text-[var(--esg-text-main)] placeholder-[var(--esg-text-muted)]
          focus:outline-none focus:ring-2 focus:ring-[var(--esg-primary)] focus:border-transparent
          transition-all
        "
            />
            <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-[var(--esg-primary)] text-white font-medium hover:bg-[var(--esg-primary)]/90 transition-colors"
            >
                搜尋
            </button>
        </form>
    );

    return (
        <div className="min-h-screen bg-[var(--esg-bg)]">
            {/* 背景裝飾 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--esg-accent)]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--esg-primary)]/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 頁面標題 */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--esg-text-main)] flex items-center gap-3">
                            <span className="text-4xl">📄</span>
                            企業報告書
                        </h1>
                        <p className="text-[var(--esg-text-muted)] mt-1">
                            追蹤企業 ESG 報告書發布狀態
                        </p>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-xl bg-[var(--esg-card-bg)] border border-[var(--esg-glass-border)] hover:border-[var(--esg-primary)] transition-all"
                        aria-label="切換主題"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </div>

                {/* 企業搜尋 */}
                <div className="mb-8">
                    <CompanySearchForm />
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* 左側：過濾面板 */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <FilterPanel
                                onFilterChange={handleFilterChange}
                                filterType="reports"
                            />
                        </div>
                    </div>

                    {/* 右側：報告書列表 */}
                    <div className="lg:col-span-3">
                        {/* 結果數量 */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-[var(--esg-text-muted)]">
                                共找到 <span className="font-semibold text-[var(--esg-text-main)]">{total}</span> 筆報告書
                            </p>
                        </div>

                        {/* 報告書列表 */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <CompanyReportCardSkeleton key={i} />
                                ))
                            ) : reports.length > 0 ? (
                                reports.map(report => (
                                    <CompanyReportCard
                                        key={report.id}
                                        report={report}
                                        showDetails
                                    />
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-12">
                                    <span className="text-6xl mb-4 block">🔍</span>
                                    <p className="text-[var(--esg-text-muted)]">找不到符合條件的報告書</p>
                                </div>
                            )}
                        </div>

                        {/* 分頁 */}
                        {!loading && totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className="px-4 py-2 rounded-lg border border-[var(--esg-glass-border)] bg-[var(--esg-card-bg)] text-[var(--esg-text-sub)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--esg-primary)] transition-all"
                                >
                                    上一頁
                                </button>

                                <div className="flex items-center gap-1">
                                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-10 h-10 rounded-lg transition-all ${page === pageNum
                                                        ? 'bg-[var(--esg-primary)] text-white'
                                                        : 'border border-[var(--esg-glass-border)] bg-[var(--esg-card-bg)] text-[var(--esg-text-sub)] hover:border-[var(--esg-primary)]'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 rounded-lg border border-[var(--esg-glass-border)] bg-[var(--esg-card-bg)] text-[var(--esg-text-sub)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--esg-primary)] transition-all"
                                >
                                    下一頁
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
