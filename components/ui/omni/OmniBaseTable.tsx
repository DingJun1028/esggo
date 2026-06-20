import { OmniComponentHeart } from '@esggo/types';
import React from 'react';
import { cn } from '../../../lib/utils';
import { ShieldCheck } from 'lucide-react';

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
  omniHeart,
  ...props
}: OmniBaseTableProps<T>) {
  return (
    <div className={cn(
      "w-full overflow-x-auto rounded-lg border transition-all duration-500 relative",
      omniHeart ? (
        omniHeart.resonanceState === 1.0 
          ? "border-[#ffd700]/30 shadow-[0_0_20px_rgba(255,215,0,0.15)] bg-[#ffd700]/5" 
          : "border-[#63a6b0]/30 shadow-[0_0_20px_rgba(99,166,176,0.1)] bg-[#63a6b0]/5"
      ) : "border-[var(--theme-border)] bg-[var(--theme-base)]",
      className
    )}>
      {omniHeart && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-[var(--theme-surface)] border-b border-l border-[var(--theme-border)] rounded-bl-lg text-[10px] font-mono flex items-center gap-1 z-10">
          <ShieldCheck size={12} className={omniHeart.resonanceState === 1.0 ? "text-[#ffd700]" : "text-[#63a6b0]"} />
          <span className={omniHeart.resonanceState === 1.0 ? "text-[#ffd700]" : "text-[#63a6b0]"}>
            OMNI-CORE 5T SECURED
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
