'use client';

import React from 'react';
import { ESGCategory } from '@/types/esg-sonar';

interface ESGTagProps {
    category: ESGCategory;
    name?: string;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
    className?: string;
}

const categoryConfig: Record<ESGCategory, { label: string; color: string; bgColor: string; icon: string }> = {
    ENVIRONMENTAL: {
        label: '環境',
        color: '#10B981',
        bgColor: 'rgba(16, 185, 129, 0.15)',
        icon: '🌿'
    },
    SOCIAL: {
        label: '社會',
        color: '#3B82F6',
        bgColor: 'rgba(59, 130, 246, 0.15)',
        icon: '🤝'
    },
    GOVERNANCE: {
        label: '治理',
        color: '#8B5CF6',
        bgColor: 'rgba(139, 92, 246, 0.15)',
        icon: '⚖️'
    },
    OTHER: {
        label: '其他',
        color: '#6B7280',
        bgColor: 'rgba(107, 114, 128, 0.15)',
        icon: '📋'
    }
};

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
};

export function ESGTag({ category, name, size = 'md', showIcon = true, className = '' }: ESGTagProps) {
    const config = categoryConfig[category];
    const displayName = name || config.label;

    return (
        <span
            className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${sizeClasses[size]}
        ${className}
      `}
            style={{
                color: config.color,
                backgroundColor: config.bgColor,
                border: `1px solid ${config.color}30`
            }}
        >
            {showIcon && <span className="text-xs">{config.icon}</span>}
            <span>{displayName}</span>
        </span>
    );
}

// 法規分類標籤
interface RegulationCategoryTagProps {
    category: string;
    className?: string;
}

const regulationCategoryConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    ENVIRONMENTAL: { label: '環境保護', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
    SOCIAL: { label: '社會責任', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.15)' },
    GOVERNANCE: { label: '公司治理', color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.15)' },
    DISCLOSURE: { label: '資訊揭露', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.15)' },
    TAXONOMY: { label: '分類標準', color: '#EC4899', bgColor: 'rgba(236, 72, 153, 0.15)' },
    OTHER: { label: '其他', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.15)' }
};

export function RegulationCategoryTag({ category, className = '' }: RegulationCategoryTagProps) {
    const config = regulationCategoryConfig[category] || regulationCategoryConfig.OTHER;

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${className}`}
            style={{
                color: config.color,
                backgroundColor: config.bgColor,
                border: `1px solid ${config.color}30`
            }}
        >
            {config.label}
        </span>
    );
}

// 狀態標籤
interface StatusTagProps {
    status: string;
    className?: string;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    ACTIVE: { label: '生效中', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
    AMENDED: { label: '已修訂', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.15)' },
    REPEALED: { label: '已廢止', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
    DRAFT: { label: '草案', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.15)' },
    PENDING: { label: '待處理', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.15)' },
    PROCESSING: { label: '處理中', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.15)' },
    COMPLETED: { label: '已完成', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
    FAILED: { label: '失敗', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
    ARCHIVED: { label: '已歸檔', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.15)' }
};

export function StatusTag({ status, className = '' }: StatusTagProps) {
    const config = statusConfig[status] || statusConfig.PENDING;

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
            style={{
                color: config.color,
                backgroundColor: config.bgColor,
                border: `1px solid ${config.color}30`
            }}
        >
            <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: config.color }} />
            {config.label}
        </span>
    );
}

// 風險等級標籤
interface RiskLevelTagProps {
    level: 'low' | 'medium' | 'high' | 'critical';
    className?: string;
}

const riskConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    low: { label: '低風險', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
    medium: { label: '中風險', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.15)' },
    high: { label: '高風險', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
    critical: { label: '嚴重', color: '#7C3AED', bgColor: 'rgba(124, 58, 237, 0.15)' }
};

export function RiskLevelTag({ level, className = '' }: RiskLevelTagProps) {
    const config = riskConfig[level];

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
            style={{
                color: config.color,
                backgroundColor: config.bgColor,
                border: `1px solid ${config.color}30`
            }}
        >
            <span className="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse" style={{ backgroundColor: config.color }} />
            {config.label}
        </span>
    );
}