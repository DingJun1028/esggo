'use client';
import React from 'react';

interface BrandEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function BrandEmptyState({ icon, title, description, action, className = '' }: BrandEmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-14 px-6 text-center ${className}`}>
      {icon && (
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-[#0F172A] mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}