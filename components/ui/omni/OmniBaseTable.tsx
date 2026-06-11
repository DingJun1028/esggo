import React from 'react';
import { cn } from '../../../lib/utils';

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
}

export function OmniBaseTable<T extends { id?: string | number }>({ 
  columns, 
  data, 
  compact = false,
  loading = false,
  className,
  ...props
}: OmniBaseTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-[var(--theme-border)] bg-[var(--theme-base)]">
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
