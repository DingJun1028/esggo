'use client';
import React from 'react';

interface T5Item {
  code: 'T1' | 'T2' | 'T3' | 'T4' | 'T5';
  active?: boolean;
}

interface BrandT5StripProps {
  items?: T5Item[];
  compact?: boolean;
}

const t5Config = {
  T1: { label: '可溯源', color: '#3B7EA1', bg: '#EBF2FA' },
  T2: { label: '透明', color: '#22c55e', bg: '#f0fdf4' },
  T3: { label: '可感知', color: '#FDB515', bg: '#fefce8' },
  T4: { label: '不可篡改', color: '#ef4444', bg: '#fff1f2' },
  T5: { label: '可追蹤', color: '#8b5cf6', bg: '#f5f3ff' },
};

export default function BrandT5Strip({
  items = [
    { code: 'T1', active: true },
    { code: 'T2', active: true },
    { code: 'T3', active: true },
    { code: 'T4', active: true },
    { code: 'T5', active: true },
  ],
  compact = false,
}: BrandT5StripProps) {
  return (
    <div className={`flex items-center gap-${compact ? '1' : '1.5'} flex-wrap`}>
      {items.map(item => {
        const config = t5Config[item.code];
        const active = item.active !== false;
        return (
          <div
            key={item.code}
            className={`inline-flex items-center gap-1 rounded-full font-medium ${compact ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}
            style={{
              backgroundColor: active ? config.bg : '#f1f5f9',
              color: active ? config.color : '#94a3b8',
              border: `1px solid ${active ? config.color + '40' : '#e2e8f0'}`,
            }}
          >
            <span className="font-bold">{item.code}</span>
            {!compact && <span>{config.label}</span>}
          </div>
        );
      })}
    </div>
  );
}