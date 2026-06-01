import React, { useEffect } from 'react';
import { IAtomicComponent, atomicManager } from './atomic-core';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export interface AtomicAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
}

export const AtomicAlert: React.FC<AtomicAlertProps> = ({
  variant = 'info',
  title,
  children,
  className = '',
  ...props
}) => {
  useEffect(() => {
    const atom: IAtomicComponent = {
      atomId: 'ATOM_ALT_001',
      type: 'atom',
      version: '1.0.0',
      core: { status: 'Trustworthy' } as any,
      reference: {
        specification: 'Notifications Spec v1.0',
        intent: 'Semantic Info Alert',
        governanceNode: 'UI_INTERACTION_CORE'
      }
    };
    atomicManager?.registerAtom?.(atom);
  }, []);

  const variantStyles = {
    info: {
      border: 'border-[#06b6d4]/30',
      bg: 'bg-[#06b6d4]/5',
      text: 'text-[#06b6d4]',
      icon: <Info size={16} className="text-[#06b6d4]" />,
    },
    success: {
      border: 'border-[#10b981]/30',
      bg: 'bg-[#10b981]/5',
      text: 'text-[#10b981]',
      icon: <CheckCircle size={16} className="text-[#10b981]" />,
    },
    warning: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/5',
      text: 'text-amber-400',
      icon: <AlertTriangle size={16} className="text-amber-400" />,
    },
    error: {
      border: 'border-rose-500/30',
      bg: 'bg-rose-500/5',
      text: 'text-rose-400',
      icon: <XCircle size={16} className="text-rose-400" />,
    },
  }[variant];

  return (
    <div className={`flex items-start gap-3.5 p-4 rounded-xl border backdrop-blur-md ${variantStyles.border} ${variantStyles.bg} ${className}`} {...props}>
      <div className="flex-shrink-0 mt-0.5">
        {variantStyles.icon}
      </div>
      <div className="space-y-1 flex-1">
        {title && (
          <h4 className={`text-xs font-black uppercase tracking-wider ${variantStyles.text}`}>
            {title}
          </h4>
        )}
        <div className="text-[11px] font-medium text-slate-300 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};
