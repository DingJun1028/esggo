// components/ui/v2/Table.tsx
'use client';
import React from 'react';
import { cn } from '@/lib/utils';

export interface TableColumn<T> {
  key: string;
  label: React.ReactNode;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  compact?: boolean;
  loading?: boolean;
  className?: string;
}

export function Table<T extends { id?: string | number }>({
  columns,
  data,
  compact = false,
  loading = false,
  className,
}: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm', className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-neutral-50 border-b border-neutral-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'font-semibold uppercase tracking-wider text-neutral-500',
                  compact ? 'px-4 py-2 text-[10px]' : 'px-6 py-3 text-xs'
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-neutral-400 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  Loading...
                </div>
              </td>
            </tr>
          ) : (
            <>
              {data.map((row, i) => (
                <tr key={row.id || i} className="hover:bg-neutral-50/50 transition-colors">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn('text-neutral-700', compact ? 'px-4 py-2 text-xs' : 'px-6 py-4 text-sm')}
                    >
                      {col.render
                        ? col.render((row as any)[col.key], row)
                        : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-neutral-400 text-sm italic">
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

// BrandTable compatibility wrapper
interface BrandColumn<T> {
  key: string;
  label: string;
  width?: string;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface BrandTableProps<T extends Record<string, any>> {
  columns: BrandColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  rowKey?: (row: T) => string;
  striped?: boolean;
  className?: string;
}

export function BrandTableCompat<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = '暫無資料',
  onRowClick,
  rowKey,
  striped = false,
  className,
}: BrandTableProps<T>) {
  if (loading) {
    return (
      <div className={cn('rounded-xl border border-slate-100 overflow-hidden', className)}>
        <div className="">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-50 border-b border-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-slate-100/50 overflow-hidden shadow-sm', className)}>
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-[13px] lg:text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-3 lg:px-6 py-4 font-black text-slate-400 uppercase tracking-widest whitespace-nowrap',
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                  )}
                  style={col.width ? { width: col.width } : {}}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-16 text-slate-300 font-bold italic">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowKey ? rowKey(row) : rowIndex}
                  className={cn(
                    'border-b border-slate-50 last:border-0 transition-all duration-300',
                    striped && rowIndex % 2 === 1 ? 'bg-slate-50/20' : 'bg-transparent',
                    onRowClick ? 'hover:bg-[#003262]/5 cursor-pointer' : 'hover:bg-slate-50/40'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-3 lg:px-6 py-4 text-[#003262] font-medium whitespace-nowrap',
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                      )}
                    >
                      {col.render ? col.render(row[col.key], row, rowIndex) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
