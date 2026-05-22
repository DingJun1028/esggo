'use client';
import React from 'react';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  icon?: React.ReactNode;
  color?: string;
  badge?: React.ReactNode;
}

interface BrandTimelineProps {
  items: TimelineItem[];
  className?: string;
}

export default function BrandTimeline({ items, className = '' }: BrandTimelineProps) {
  return (
    <div className={`space-y-0 ${className}`}>
      {items.map((item, i) => (
        <div key={item.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white"
              style={{ backgroundColor: item.color ? `${item.color}20` : '#EBF2FA', color: item.color || '#003262' }}
            >
              {item.icon || <div className="w-2 h-2 rounded-full bg-current" />}
            </div>
            {i < items.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
          </div>
          <div className={`pb-4 ${i < items.length - 1 ? '' : ''}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">{item.title}</p>
                {item.description && <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {item.badge}
                <span className="text-[11px] text-slate-400 whitespace-nowrap">{item.time}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}