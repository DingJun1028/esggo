'use client';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { useColorDropStream } from '@/lib/hooks/useColorDropStream';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  evidenceUuid?: string;
}

const positionClasses: Record<string, string> = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  right:  'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Tooltip({ content, children, position = 'top', className, evidenceUuid }: TooltipProps & { evidenceUuid?: string }) {
  const [visible, setVisible] = useState(false);
  const colorDropMap = useColorDropStream();
  const colorDrop = evidenceUuid ? Array.from((colorDropMap as any).values?.() || []).find((cd: any) => cd.evidenceUuid === evidenceUuid) as any : undefined;
  const bgStyle = colorDrop?.verified ? 'bg-green-600' : colorDrop?.status === 'issued' ? 'bg-yellow-600' : 'bg-[#1a1a2e]';
  const displayContent = colorDrop ? `${content} (色碼滴: ${colorDrop.status ?? 'unknown'})` : content;

  return (
    <div
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={cn('absolute z-50 px-2.5 py-1.5 rounded-[7px] text-[12px] text-white whitespace-nowrap shadow-lg pointer-events-none', positionClasses[position], bgStyle)}>
          {displayContent}
        </div>
      )}
    </div>
  );
}