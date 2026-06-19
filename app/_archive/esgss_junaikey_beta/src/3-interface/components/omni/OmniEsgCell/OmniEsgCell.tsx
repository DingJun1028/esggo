import React from 'react';

interface OmniEsgCellProps {
  label: string;
  value: string | number;
  status?: 'valid' | 'invalid' | 'pending';
  icon?: React.ReactNode;
}

export const OmniEsgCell: React.FC<OmniEsgCellProps> = ({
  label,
  value,
  status = 'valid',
  icon,
}) => {
  return (
    <div
      className={`p-4 rounded-xl border ${
        status === 'valid'
          ? 'border-emerald-500/20 bg-emerald-500/5'
          : status === 'invalid'
            ? 'border-red-500/20 bg-red-500/5'
            : 'border-slate-700 bg-slate-800/50'
      } backdrop-blur-sm transition-all hover:bg-slate-800/80`}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-slate-400">{icon}</span>}
        <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-xl font-mono font-medium text-slate-200">{value}</div>
      <div className="mt-2 flex items-center gap-1">
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            status === 'valid'
              ? 'bg-emerald-500 animate-pulse'
              : status === 'invalid'
                ? 'bg-red-500'
                : 'bg-amber-500'
          }`}
        />
        <span className="text-[10px] text-slate-500">
          {status === 'valid' ? 'Verified' : status === 'invalid' ? 'Attention' : 'Processing'}
        </span>
      </div>
    </div>
  );
};
