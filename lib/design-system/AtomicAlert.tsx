import React, { useEffect } from 'react';
import { IAtomicComponent, atomicManager } from './atomic-core';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '../utils';

export interface AtomicAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
}

export const AtomicAlert: React.FC<AtomicAlertProps> = ({
  variant = 'info',
  title,
  children,
  className,
  ...props
}) => {
  const alertId = React.useId();
  useEffect(() => {
    const atom: IAtomicComponent = {
      atomId: 'ATOM_ALT_001',
      type: 'atom',
      version: '1.1.0',
      core: { status: 'Trustworthy' },
      reference: {
        specification: 'Notifications Spec v1.1',
        intent: 'Semantic Info Alert',
        governanceNode: 'UI_INTERACTION_CORE'
      }
    };
    atomicManager?.registerAtom?.(atom);
  }, []);

  const variantStyles = {
    info: {
      base: 'border-[#06b6d4]/40 border-l-[#06b6d4] bg-[#06b6d4]/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
      text: 'text-[#06b6d4]',
      icon: <Info size={18} className="text-[#06b6d4] drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" />,
    },
    success: {
      base: 'border-[#10b981]/40 border-l-[#10b981] bg-[#10b981]/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
      text: 'text-[#10b981]',
      icon: <CheckCircle size={18} className="text-[#10b981] drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" />,
    },
    warning: {
      base: 'border-amber-500/40 border-l-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
      text: 'text-amber-400',
      icon: <AlertTriangle size={18} className="text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" />,
    },
    error: {
      base: 'border-rose-500/40 border-l-rose-500 bg-rose-500/10 shadow-[0_0_15px_rgba(225,29,72,0.15)]',
      text: 'text-rose-400',
      icon: <XCircle size={18} className="text-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.8)]" />,
    },
  }[variant];

  return (
    <div 
      role="alert"
      aria-live="polite"
      aria-labelledby={title ? `${alertId}-title` : undefined}
      aria-describedby={children ? `${alertId}-desc` : undefined}
      className={cn(
        'relative overflow-hidden flex items-start gap-3.5 p-4 rounded-xl border border-l-4 backdrop-blur-xl',
        variantStyles.base,
        className
      )}
      {...props}
    >
      {/* 玻璃反光特效 (Glass reflection) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className="flex-shrink-0 mt-0.5 relative z-10" aria-hidden="true">
        {variantStyles.icon}
      </div>
      <div className="space-y-1 flex-1 relative z-10">
        {title && (
          <h4 id={`${alertId}-title`} className={cn('text-[13px] font-black uppercase tracking-wider', variantStyles.text)}>
            {title}
          </h4>
        )}
        <div id={`${alertId}-desc`} className="text-[12px] font-medium text-slate-200 leading-relaxed drop-shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
};
