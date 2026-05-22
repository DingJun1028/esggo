'use client';
import React from 'react';

interface BrandSkeletonProps {
  className?: string;
  lines?: number;
  card?: boolean;
}

export default function BrandSkeleton({ className = '', lines = 3, card = false }: BrandSkeletonProps) {
  if (card) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-slate-200 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-200 rounded w-3/4" />
            <div className="h-2.5 bg-slate-100 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          {[...Array(lines)].map((_, i) => (
            <div key={i} className="h-2.5 bg-slate-100 rounded" style={{ width: `${85 - i * 10}%` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-pulse space-y-2 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="h-3 bg-slate-200 rounded" style={{ width: `${90 - i * 8}%` }} />
      ))}
    </div>
  );
}