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
      <div className="rounded-2xl border border-slate-100 overflow-hidden">
        <div className="animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-50 border-b border-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100/50 overflow-hidden bg-white/40 backdrop-blur-md shadow-sm">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-[13px] lg:text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-3 lg:px-6 py-4 font-black text-slate-400 uppercase tracking-widest whitespace-nowrap ${
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
                <td colSpan={columns.length} className="text-center py-16 text-slate-300 font-bold italic">
                   {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowKey ? rowKey(row) : rowIndex}
                  className={`
                    border-b border-slate-50 last:border-0 transition-all duration-300
                    ${striped && rowIndex % 2 === 1 ? 'bg-slate-50/20' : 'bg-transparent'}
                    ${onRowClick ? 'hover:bg-[#003262]/5 cursor-pointer' : 'hover:bg-slate-50/40'}
                  `}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className={`px-3 lg:px-6 py-4 text-[#003262] font-medium whitespace-nowrap ${
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
