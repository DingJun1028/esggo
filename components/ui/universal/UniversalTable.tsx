import React from 'react';
import { cn } from '../../../lib/utils';

export interface UniversalTableColumn<T> {
  key: string;
  label: React.ReactNode;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface UniversalTableProps<T> extends React.HTMLAttributes<HTMLTableElement> {
  columns: UniversalTableColumn<T>[];
  data: T[];
  compact?: boolean;
}

export function UniversalTable<T extends { id?: string | number }>({ 
  columns, 
  data, 
  compact = false,
  className,
  ...props
}: UniversalTableProps<T>) {
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
        </tbody>
      </table>
    </div>
  );
}
