'use client';
import React from 'react';

interface BrandGRITagProps {
  code: string;
  label?: string;
  size?: 'xs' | 'sm';
}

export default function BrandGRITag({ code, label, size = 'sm' }: BrandGRITagProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded font-mono font-medium ${size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'} bg-[#EBF2FA] text-[#003262] border border-[#D4E4F7]`}>
      {code}
      {label && <span className="font-sans text-[#3B7EA1]">· {label}</span>}
    </span>
  );
}