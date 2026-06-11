'use client';
import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  rowKey?: (row: T) => string;
  onRowClick?: (row: T) => void;
  className?: string;
}

function DataTableInner<T extends object>({
  columns,
  data,
  loading = false,
  searchable = false,
  searchPlaceholder = '搜尋…',
  emptyMessage = '尚無資料',
  rowKey,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    let result = data;

    // ⚡ Bolt Optimization: Hoist toLowerCase() and useMemo to prevent unnecessary recalculations
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((v) =>
          String(v ?? '')
            .toLowerCase()
            .includes(searchLower)
        )
      );
    }
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const av = String((a as any)[sortKey] ?? '');

        const bv = String((b as any)[sortKey] ?? '');
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }

    return result;
  }, [data, search, sortKey, sortDir]);

  return (
    <div
      className={cn('bg-white rounded-[16px] border border-[#e5e7eb] overflow-hidden', className)}
    >
      {searchable && (
        <div className="px-4 py-3 border-b border-[#f3f4f6] bg-[#f9fafb]">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-3 py-2 rounded-[8px] border border-[#e5e7eb] text-[13px] outline-none focus:border-[#003262]"
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: '600px' }}>
          <thead>
            <tr className="bg-[#f9fafb]">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  style={{ width: col.width }}
                  className={cn(
                    'px-4 py-3 text-left text-[12px] font-semibold text-[#6b7280] border-b border-[#e5e7eb] whitespace-nowrap',
                    col.sortable && 'cursor-pointer hover:text-[#003262] select-none'
                  )}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && (
                      <span className="text-[#d1d5db]">
                        {sortKey === String(col.key) ? (
                          sortDir === 'asc' ? (
                            <ChevronUp size={12} className="text-[#003262]" />
                          ) : (
                            <ChevronDown size={12} className="text-[#003262]" />
                          )
                        ) : (
                          <ChevronsUpDown size={12} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-[#f3f4f6]">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3">
                      <div className="h-4 bg-[#f3f4f6] rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-[13px] text-[#9ca3af]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr
                  key={rowKey ? rowKey(row) : i}
                  className={cn(
                    'border-b border-[#f3f4f6] transition-colors',
                    i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]',
                    onRowClick && 'cursor-pointer hover:bg-blue-50/50'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-[13px] text-[#374151]">
                      {col.render
                        ? col.render((row as any)[col.key], row)
                        : String((row as any)[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {filtered.length > 0 && (
        <div className="px-4 py-2.5 bg-[#f9fafb] border-t border-[#f3f4f6] text-[11px] text-[#9ca3af]">
          共 {filtered.length} 筆記錄{search && `（篩選自 ${data.length} 筆）`}
        </div>
      )}
    </div>
  );
}

// ⚡ Bolt Optimization: Added React.memo to prevent unnecessary re-renders of the table
// when parent components update state that doesn't affect the table props.
// Preserving generic type signature using type assertion.
export const DataTable = React.memo(DataTableInner) as typeof DataTableInner;
