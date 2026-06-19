'use client';

import React from 'react';
import Link from 'next/link';
import { Regulation, RegulationCategory } from '@/types/esg-sonar';
import { RegulationCategoryTag, StatusTag } from './ESGTag';

interface RegulationCardProps {
  regulation: Regulation;
  onClick?: () => void;
  showFullContent?: boolean;
  className?: string;
}

// 法規分類對應圖標
const categoryIcons: Record<RegulationCategory, string> = {
  ENVIRONMENTAL: '🌿',
  SOCIAL: '🤝',
  GOVERNANCE: '⚖️',
  DISCLOSURE: '📊',
  TAXONOMY: '📋',
  OTHER: '📌'
};

export function RegulationCard({ regulation, onClick, showFullContent = false, className = '' }: RegulationCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const icon = categoryIcons[regulation.category] || '📌';

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
        {/* 標題區域 */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <h3 className="font-semibold text-[var(--esg-text-main)] line-clamp-2">
              {regulation.name}
            </h3>
          </div>
          <StatusTag status={regulation.status} />
        </div>

        {/* 法規編號 */}
        <div className="mb-3">
          <span className="text-sm font-mono text-[var(--esg-text-muted)]">
            {regulation.code}
          </span>
        </div>

        {/* 分類標籤 */}
        <div className="flex flex-wrap gap-2 mb-3">
          <RegulationCategoryTag category={regulation.category} />
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-[var(--esg-text-sub)] bg-[var(--esg-surface-2)]">
            🏛️ {regulation.authority}
          </span>
        </div>

        {/* 內容摘要 */}
        {showFullContent && regulation.content && (
          <div className="mb-4 p-3 rounded-lg bg-[var(--esg-surface-2)]">
            <p className="text-sm text-[var(--esg-text-sub)] line-clamp-4">
              {regulation.content}
            </p>
          </div>
        )}

        {/* 日期資訊 */}
        <div className="flex flex-wrap gap-4 text-sm text-[var(--esg-text-muted)]">
          <div className="flex items-center gap-1">
            <span>📅</span>
            <span>發布日期：{formatDate(regulation.publishedDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>✨</span>
            <span>生效日期：{formatDate(regulation.effectiveDate)}</span>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--esg-glass-border)]">
          <Link
            href={`/esg-sonar/regulations/${regulation.id}`}
            className="text-sm font-medium text-[var(--esg-primary)] hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            查看詳情 →
          </Link>
          {regulation.sourceUrl && (
            <a
              href={regulation.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--esg-text-muted)] hover:text-[var(--esg-primary)]"
              onClick={(e) => e.stopPropagation()}
            >
              來源 ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// 精簡版法規卡片（小尺寸）
export function RegulationCardCompact({ regulation, className = '' }: { regulation: Regulation; className?: string }) {
  const icon = categoryIcons[regulation.category] || '📌';

  return (
    <div
      className={`
        group flex items-center gap-3 p-3 rounded-lg border transition-all duration-200
        hover:bg-[var(--esg-surface-2)] hover:border-[var(--esg-primary)]
        cursor-pointer bg-[var(--esg-card-bg)] border-[var(--esg-glass-border)]
        ${className}
      `}
    >
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-[var(--esg-text-main)] truncate">
          {regulation.name}
        </h4>
        <p className="text-xs text-[var(--esg-text-muted)]">
          {regulation.code} · {regulation.authority}
        </p>
      </div>
      <StatusTag status={regulation.status} />
    </div>
  );
}

// 載入中的骨架卡片
export function RegulationCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`p-5 rounded-xl border bg-[var(--esg-card-bg)] border-[var(--esg-glass-border)] ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--esg-surface-2)] animate-pulse" />
          <div className="h-5 w-48 bg-[var(--esg-surface-2)] rounded animate-pulse" />
        </div>
        <div className="h-6 w-16 bg-[var(--esg-surface-2)] rounded-full animate-pulse" />
      </div>
      <div className="h-4 w-32 bg-[var(--esg-surface-2)] rounded animate-pulse mb-3" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-20 bg-[var(--esg-surface-2)] rounded animate-pulse" />
        <div className="h-6 w-24 bg-[var(--esg-surface-2)] rounded animate-pulse" />
      </div>
      <div className="flex gap-4">
        <div className="h-4 w-28 bg-[var(--esg-surface-2)] rounded animate-pulse" />
        <div className="h-4 w-28 bg-[var(--esg-surface-2)] rounded animate-pulse" />
      </div>
    </div>
  );
}