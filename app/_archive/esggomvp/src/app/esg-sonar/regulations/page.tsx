'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Regulation, RegulationFilters, PaginatedResponse, TimelineItem, TransparencyReport } from '@/types/esg-sonar';
import { RegulationCard, RegulationCardSkeleton } from '@/components/esg-sonar/RegulationCard';
import { FilterPanel } from '@/components/esg-sonar/FilterPanel';
import { Timeline } from '@/components/esg-sonar/Timeline';
import { useTheme } from '@/components/esg-sonar/DarkThemeProvider';

export default function RegulationsPage() {
    const searchParams = useSearchParams();
    const [regulations, setRegulations] = useState<Regulation[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [selectedRegulation, setSelectedRegulation] = useState<Regulation | null>(null);
    const [showTransparencyModal, setShowTransparencyModal] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const pageSize = 10;

    // 從 URL 獲取初始搜尋關鍵字
    const initialSearch = searchParams.get('search') || '';

    const [filters, setFilters] = useState<RegulationFilters>({
        search: initialSearch
    });

    // 獲取法規數據
    const fetchRegulations = useCallback(async (pageNum: number = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', pageNum.toString());
            params.set('pageSize', pageSize.toString());

            if (filters.search) params.set('search', filters.search);
            if (filters.categories?.length) params.set('categories', filters.categories.join(','));
            if (filters.authorities?.length) params.set('authorities', filters.authorities.join(','));
            if (filters.status?.length) params.set('status', filters.status.join(','));
            if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
            if (filters.dateTo) params.set('dateTo', filters.dateTo);

            const response = await fetch(`/api/esg-sonar/regulations?${params}`);
            const result = await response.json();

            if (result.success) {
                setRegulations(result.data.items);
                setTotal(result.data.total);
                setPage(pageNum);
            }
        } catch (error) {
            console.error('Failed to fetch regulations:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchRegulations();
    }, [fetchRegulations]);

    const handleFilterChange = (newFilters: Record<string, unknown>) => {
        setFilters(newFilters as RegulationFilters);
    };

    const handlePageChange = (newPage: number) => {
        fetchRegulations(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRegulationClick = (regulation: Regulation) => {
        setSelectedRegulation(regulation);
        setShowTransparencyModal(true);
    };

    const totalPages = Math.ceil(total / pageSize);

    // 模擬法規沿革數據
    const timelineItems: TimelineItem[] = selectedRegulation ? [
        {
            id: '1',
            date: selectedRegulation.publishedDate || new Date().toISOString().split('T')[0],
            title: '法規發布',
            description: `${selectedRegulation.name} 正式發布`,
            type: 'regulation',
            status: selectedRegulation.status
        },
        ...(selectedRegulation.effectiveDate ? [{
            id: '2',
            date: selectedRegulation.effectiveDate,
            title: '法規生效',
            description: `${selectedRegulation.name} 正式生效`,
            type: 'regulation',
            status: 'ACTIVE' as const
        }] : [])
    ] : [];

    return (
        <div className="min-h-screen bg-[var(--esg-bg)]">
            {/* 背景裝飾 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--esg-primary)]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[var(--esg-accent)]/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 頁面標題 */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--esg-text-main)] flex items-center gap-3">
                            <span className="text-4xl">📜</span>
                            法規查詢
                        </h1>
                        <p className="text-[var(--esg-text-muted)] mt-1">
                            搜尋並追蹤 ESG 相關法規
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

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* 左側：過濾面板 */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <FilterPanel
                                onFilterChange={handleFilterChange}
                                filterType="regulations"
                            />
                        </div>
                    </div>

                    {/* 右側：法規列表 */}
                    <div className="lg:col-span-3">
                        {/* 結果數量 */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-[var(--esg-text-muted)]">
                                共找到 <span className="font-semibold text-[var(--esg-text-main)]">{total}</span> 筆法規
                            </p>
                        </div>

                        {/* 法規列表 */}
                        <div className="space-y-4">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <RegulationCardSkeleton key={i} />
                                ))
                            ) : regulations.length > 0 ? (
                                regulations.map(regulation => (
                                    <RegulationCard
                                        key={regulation.id}
                                        regulation={regulation}
                                        onClick={() => handleRegulationClick(regulation)}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <span className="text-6xl mb-4 block">🔍</span>
                                    <p className="text-[var(--esg-text-muted)]">找不到符合條件的法規</p>
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

            {/* 透明度報告彈窗 */}
            {showTransparencyModal && selectedRegulation && (
                <TransparencyModal
                    regulation={selectedRegulation}
                    timelineItems={timelineItems}
                    onClose={() => {
                        setShowTransparencyModal(false);
                        setSelectedRegulation(null);
                    }}
                />
            )}
        </div>
    );
}

// 透明度報告彈窗元件
function TransparencyModal({
    regulation,
    timelineItems,
    onClose
}: {
    regulation: Regulation;
    timelineItems: TimelineItem[];
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* 背景遮罩 */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* 彈窗內容 */}
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--esg-card-bg)] rounded-2xl border border-[var(--esg-glass-border)] shadow-2xl">
                {/* 標題 */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-[var(--esg-glass-border)] bg-[var(--esg-card-bg)]">
                    <h2 className="text-xl font-semibold text-[var(--esg-text-main)]">
                        透明度報告
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-[var(--esg-surface-2)] transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* 內容 */}
                <div className="p-6 space-y-6">
                    {/* 法規基本資訊 */}
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--esg-text-main)] mb-3">
                            {regulation.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-[var(--esg-text-muted)]">法規編號</p>
                                <p className="text-[var(--esg-text-main)]">{regulation.code}</p>
                            </div>
                            <div>
                                <p className="text-[var(--esg-text-muted)]">發布機關</p>
                                <p className="text-[var(--esg-text-main)]">{regulation.authority}</p>
                            </div>
                            <div>
                                <p className="text-[var(--esg-text-muted)]">發布日期</p>
                                <p className="text-[var(--esg-text-main)]">{regulation.publishedDate || '-'}</p>
                            </div>
                            <div>
                                <p className="text-[var(--esg-text-muted)]">生效日期</p>
                                <p className="text-[var(--esg-text-main)]">{regulation.effectiveDate || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* 法規沿革 */}
                    <div>
                        <h4 className="text-md font-semibold text-[var(--esg-text-main)] mb-3">
                            法規沿革
                        </h4>
                        <Timeline items={timelineItems} />
                    </div>

                    {/* 透明度指標 */}
                    <div className="p-4 rounded-xl bg-[var(--esg-surface-2)]">
                        <h4 className="text-md font-semibold text-[var(--esg-text-main)] mb-3">
                            透明度指標
                        </h<div className="4>
            space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--esg-text-sub)]">法規內容揭露</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 rounded-full bg-[var(--esg-surface)] overflow-hidden">
                                        <div className="h-full w-3/4 bg-[var(--esg-success)] rounded-full" />
                                    </div>
                                    <span className="text-sm text-[var(--esg-text-muted)]">75%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--esg-text-sub)]">時效性揭露</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 rounded-full bg-[var(--esg-surface)] overflow-hidden">
                                        <div className="h-full w-4/5 bg-[var(--esg-success)] rounded-full" />
                                    </div>
                                    <span className="text-sm text-[var(--esg-text-muted)]">80%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--esg-text-sub)]">合規指引完整性</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 rounded-full bg-[var(--esg-surface)] overflow-hidden">
                                        <div className="h-full w-2/3 bg-[var(--esg-warning)] rounded-full" />
                                    </div>
                                    <span className="text-sm text-[var(--esg-text-muted)]">66%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}