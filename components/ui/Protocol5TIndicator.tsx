import React from 'react';
import { cn } from '@/lib/utils';
import { Shield, Fingerprint, Activity, Network, CheckCircle2 } from 'lucide-react';

export type T5Status = {
  t1: boolean; // Traceable
  t2: boolean; // Transparent
  t3: boolean; // Tangible
  t4: boolean; // Trustworthy
  t5: boolean; // Trackable
};

interface Protocol5TIndicatorProps {
  status: T5Status;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const T_PROTOCOLS = [
  { id: 't1', label: 'T1 真 Traceable', icon: Fingerprint, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { id: 't2', label: 'T2 善 Transparent', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 't3', label: 'T3 美 Tangible', icon: CheckCircle2, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 't4', label: 'T4 信 Trustworthy', icon: Shield, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 't5', label: 'T5 通 Trackable', icon: Network, color: 'text-blue-500', bg: 'bg-blue-500/10' },
];

export function Protocol5TIndicator({ status, className, size = 'sm' }: Protocol5TIndicatorProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 text-[9px]',
    md: 'w-7 h-7 text-xs',
    lg: 'w-9 h-9 text-sm'
  };

  const iconSizes = { sm: 10, md: 14, lg: 18 };

  return (
    <div className={cn("flex items-center gap-1.5", className)} title="5T Protocol Status">
      {T_PROTOCOLS.map((protocol, i) => {
        const isPassed = status[protocol.id as keyof T5Status];
        const Icon = protocol.icon;
        
        return (
          <div 
            key={protocol.id}
            className={cn(
              "flex items-center justify-center rounded-md border shadow-sm transition-all duration-300",
              sizeClasses[size],
              isPassed 
                ? `${protocol.bg} border-${protocol.color.replace('text-', '')}/30 ${protocol.color} shadow-${protocol.color.replace('text-', '')}/20` 
                : "bg-slate-100/50 border-slate-200 text-slate-400 opacity-50 grayscale"
            )}
            title={protocol.label}
          >
            <span className="sr-only">{protocol.label}</span>
            {isPassed ? <Icon size={iconSizes[size]} strokeWidth={2.5} /> : <span className="font-bold">{i+1}</span>}
          </div>
        );
      })}
    </div>
  );
}
