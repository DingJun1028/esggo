'use client';
import React from 'react';

interface Column<T> {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface BrandTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  rowKey?: (row: T) => string;
  striped?: boolean;
}

export default function BrandTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = '暫無資料',
  onRowClick,
  rowKey,
  striped = false,
}: BrandTableProps<T>) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div className="animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 border-b border-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-medium text-slate-600 whitespace-nowrap ${
                    col.align === 'center' ? 'text-center' :
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
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
                <td colSpan={columns.length} className="text-center py-10 text-slate-400 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowKey ? rowKey(row) : rowIndex}
                  className={`
                    border-b border-slate-100 last:border-0 transition-colors
                    ${striped && rowIndex % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}
                    ${onRowClick ? 'hover:bg-[#EBF2FA] cursor-pointer' : 'hover:bg-slate-50/50'}
                  `}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-[#0F172A] ${
                        col.align === 'center' ? 'text-center' :
                        col.align === 'right' ? 'text-right' : 'text-left'
                      }`}
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