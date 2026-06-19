import React from 'react';

export type TCategory = 'Tangible' | 'Traceable' | 'Trackable' | 'Transparent' | 'Trustworthy';

interface TagProps {
  category: TCategory;
  value?: string;
  className?: string;
}

const categoryConfig: Record<TCategory, { color: string; icon: string; code: string }> = {
  Tangible: { color: '#0df2ee', icon: 'token', code: 'T-01' },
  Traceable: { color: '#60a5fa', icon: 'account_tree', code: 'T-02' },
  Trackable: { color: '#fbbf24', icon: 'route', code: 'T-03' },
  Transparent: { color: '#c084fc', icon: 'visibility', code: 'T-04' },
  Trustworthy: { color: '#00e676', icon: 'verified_user', code: 'T-05' },
};

export const Tag: React.FC<TagProps> = ({ category, value, className = '' }) => {
  const config = categoryConfig[category];

  return (
    <div
      className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 glass-effect group hover:bg-white/10 transition-all ${className}`}
    >
      <div
        className="size-2 rounded-full animate-pulse"
        style={{
          backgroundColor: config.color,
          boxShadow: `0 0 8px ${config.color}`,
        }}
      />
      <span className="text-sm font-bold text-white font-display">
        {category} {value && <span className="text-white/60 ml-1">({value})</span>}
      </span>
      <span
        className="ml-auto text-[10px] font-mono font-bold tracking-wider"
        style={{ color: config.color }}
      >
        {config.code}
      </span>
    </div>
  );
};

export default Tag;
