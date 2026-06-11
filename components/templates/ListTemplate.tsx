'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

/**
 * ListTemplate: Standard List View following Governance v1.0
 */
export interface ListTemplateProps<T> {
  title: string;
  description?: string;
  primaryAction?: React.ReactNode;
  filterBar?: React.ReactNode;
  columns: { key: string; label: string; width?: string }[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
  emptyState?: React.ReactNode;
  pagination?: React.ReactNode;
  loading?: boolean;
}

export function ListTemplate<T>({
  title,
  description,
  primaryAction,
  filterBar,
  columns,
  data,
  renderRow,
  emptyState,
  pagination,
  loading
}: ListTemplateProps<T>) {
  return (
    <div className="flex flex-col gap-6 w-full fade-in">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-text-brand">{title}</h1>
          {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
        </div>
        {primaryAction}
      </header>

      <Card className="border-border-primary bg-surface-primary shadow-sm overflow-hidden">
        {filterBar && (
          <div className="p-4 border-b border-border-primary bg-surface-secondary/50">
            {filterBar}
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-secondary border-b border-border-primary">
                {columns.map(col => (
                  <th key={col.key} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-secondary" style={{ width: col.width }}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={columns.length} className="px-6 py-4 h-16 bg-surface-secondary/20" />
                  </tr>
                ))
              ) : data.length > 0 ? (
                data.map((item, i) => renderRow(item))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-20 text-center">
                    {emptyState || (
                      <div className="text-slate-400">
                        <p className="font-bold uppercase tracking-widest text-xs">No Data Found</p>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="p-4 border-t border-border-primary flex justify-center">
            {pagination}
          </div>
        )}
      </Card>
    </div>
  );
}
