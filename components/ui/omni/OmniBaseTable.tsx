import { OmniComponentHeart } from '@esggo/types';
import React from 'react';
import { cn } from '../../../lib/utils';
import { ShieldCheck } from 'lucide-react';
import { useThemeStore } from '../../../lib/theme-store';
import { useOmniResonance } from './useOmniResonance';

export interface OmniBaseTableColumn<T> {
  key: string;
  label: React.ReactNode;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface OmniBaseTableProps<T> extends React.HTMLAttributes<HTMLTableElement> {
  columns: OmniBaseTableColumn<T>[];
  data: T[];
  compact?: boolean;
  loading?: boolean;
  omniHeart?: OmniComponentHeart;
}

export function OmniBaseTable<T extends { id?: string | number }>({ 
  columns, 
  data, 
  compact = false,
  loading = false,
  className,
  omniHeart: initialHeart,
  ...props
}: OmniBaseTableProps<T>) {
  const { omniTheme } = useThemeStore();
  const omniHeart = useOmniResonance(initialHeart);

  return (
    <div className={cn(
      "w-full overflow-x-auto rounded-lg transition-all duration-500 relative",
      omniHeart 
        ? (omniHeart.resonanceState === 1.0 
            ? "border-2 border-[#ffd700]/30 shadow-[0_0_20px_rgba(255,215,0,0.15)] bg-white" 
            : "border-2 border-[#63a6b0]/30 shadow-[0_0_20px_rgba(99,166,176,0.1)] bg-white")
        : (omniTheme === 'omnicore' 
            ? "border border-[var(--theme-border)] bg-[var(--theme-base)]"
            : "border border-slate-200 bg-white shadow-sm"),
      className
    )}>
      {omniHeart && (
        <div className={cn(
          "absolute top-0 right-0 px-3 py-1 border-b border-l rounded-bl-lg text-[10px] font-mono flex items-center gap-1.5 z-10",
          omniHeart.resonanceState === 1.0 
            ? "bg-[#ffd700]/10 border-[#ffd700]/30 text-[#ffd700]" 
            : "bg-[#63a6b0]/10 border-[#63a6b0]/30 text-[#63a6b0]"
        )}>
          <ShieldCheck size={12} className={omniHeart.resonanceState === 1.0 ? "text-[#ffd700]" : "text-[#63a6b0]"} />
          <span>
            {omniHeart.omniSignature ? `${omniHeart.omniSignature.substring(0, 6)}... 5T SECURED` : "OMNI-CORE 5T SECURED"}
          </span>
        </div>
      )}
      <table className={cn("w-full text-left border-collapse", className)} {...props}>
        <thead>
          <tr className="bg-[var(--theme-surface)] border-b border-[var(--theme-border)]">
            {columns.map((col) => (
              <th 
                key={col.key}
                className={cn(
                  "font-bold uppercase tracking-widest text-[var(--theme-text-muted)]",
                  compact ? "px-4 py-2 text-[10px]" : "px-6 py-3 text-xs"
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--theme-border)]">
          {loading ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className="px-6 py-8 text-center text-[var(--theme-text-muted)] text-sm"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  Loading...
                </div>
              </td>
            </tr>
          ) : (
            <>
              {data.map((row, i) => (
                <tr 
                  key={row.id || i}
                  className="hover:bg-[var(--theme-surface)]/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td 
                      key={col.key}
                      className={cn(
                        "text-[var(--theme-text)]",
                        compact ? "px-4 py-2 text-xs" : "px-6 py-4 text-sm"
                      )}
                    >
                      {col.render 
                        ? col.render((row as any)[col.key], row)
                        : (row as any)[col.key]
                      }
                    </td>
                  ))}
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td 
                    colSpan={columns.length} 
                    className="px-6 py-8 text-center text-[var(--theme-text-muted)] text-sm italic"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
