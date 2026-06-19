'use client';

import React from 'react';
import { TimelineItem } from '@/types/esg-sonar';

interface TimelineProps {
    items: TimelineItem[];
    className?: string;
    showIcons?: boolean;
}

// 時間軸項目類型對應圖標
const typeIcons: Record<string, string> = {
    regulation: '📜',
    report: '📄',
    update: '🔄'
};

// 時間軸項目類型對應顏色
const typeColors: Record<string, string> = {
    regulation: 'var(--esg-primary)',
    report: 'var(--esg-accent)',
    update: 'var(--esg-warning)'
};

export function Timeline({ items, className = '', showIcons = true }: TimelineProps) {
    if (items.length === 0) {
        return (
            <div className={`p-8 text-center text-[var(--esg-text-muted)] ${className}`}>
                <span className="text-4xl mb-2 block">📭</span>
                <p>尚無法規沿革資料</p>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            {/* 垂直線 */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[var(--esg-glass-border)]" />

            <div className="space-y-6">
                {items.map((item, index) => (
                    <TimelineItemComponent
                        key={item.id || index}
                        item={item}
                        showIcon={showIcons}
                        isLast={index === items.length - 1}
                    />
                ))}
            </div>
        </div>
    );
}

interface TimelineItemComponentProps {
    item: TimelineItem;
    showIcon: boolean;
    isLast: boolean;
}

function TimelineItemComponent({ item, showIcon, isLast }: TimelineItemComponentProps) {
    const icon = typeIcons[item.type] || '📌';
    const color = typeColors[item.type] || 'var(--esg-primary)';

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="relative flex gap-4">
            {/* 圖標圓圈 */}
            <div
                className={`
          relative z-10 flex-shrink-0 w-12 h-12 rounded-full 
          flex items-center justify-center text-xl
          bg-[var(--esg-card-bg)] border-2
        `}
                style={{
                    borderColor: color,
                    boxShadow: `0 0 10px ${color}30`
                }}
            >
                {showIcon && icon}
            </div>

            {/* 內容區域 */}
            <div className="flex-1 pb-6">
                <div className={`
          p-4 rounded-xl border transition-all duration-200
          hover:shadow-md hover:border-[var(--esg-primary)]
          bg-[var(--esg-card-bg)] border-[var(--esg-glass-border)]
        `}>
                    {/* 日期 */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-[var(--esg-primary)]">
                            {formatDate(item.date)}
                        </span>
                        {item.status && (
                            <StatusBadge status={item.status} />
                        )}
                    </div>

                    {/* 標題 */}
                    <h4 className="font-semibold text-[var(--esg-text-main)] mb-1">
                        {item.title}
                    </h4>

                    {/* 描述 */}
                    {item.description && (
                        <p className="text-sm text-[var(--esg-text-sub)] mb-3">
                            {item.description}
                        </p>
                    )}

                    {/* 連結 */}
                    {item.link && (
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[var(--esg-primary)] hover:underline inline-flex items-center gap-1"
                        >
                            查看詳情 ↗
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

// 狀態徽章
function StatusBadge({ status }: { status: string }) {
    const statusConfig: Record<string, { label: string; color: string }> = {
        ACTIVE: { label: '生效', color: 'var(--esg-success)' },
        AMENDED: { label: '修訂', color: 'var(--esg-warning)' },
        REPEALED: { label: '廢止', color: 'var(--esg-error)' },
        DRAFT: { label: '草案', color: 'var(--esg-text-muted)' },
        COMPLETED: { label: '完成', color: 'var(--esg-success)' },
        PROCESSING: { label: '處理中', color: 'var(--esg-info)' },
        FAILED: { label: '失敗', color: 'var(--esg-error)' }
    };

    const config = statusConfig[status] || { label: status, color: 'var(--esg-text-muted)' };

    return (
        <span
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
                backgroundColor: `${config.color}20`,
                color: config.color
            }}
        >
            {config.label}
        </span>
    );
}

// 迷你時間軸（用於卡片內）
export function TimelineCompact({ items, className = '' }: { items: TimelineItem[]; className?: string }) {
    return (
        <div className={`relative ${className}`}>
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[var(--esg-glass-border)]" />

            <div className="space-y-3">
                {items.slice(0, 3).map((item, index) => (
                    <div key={item.id || index} className="relative flex items-center gap-3 pl-6">
                        <div
                            className="absolute left-0 w-3 h-3 rounded-full"
                            style={{ backgroundColor: typeColors[item.type] || 'var(--esg-primary)' }}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-[var(--esg-text-muted)]">
                                {item.date}
                            </p>
                            <p className="text-sm text-[var(--esg-text-main)] truncate">
                                {item.title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}