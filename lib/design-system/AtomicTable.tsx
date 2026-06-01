import React, { useEffect } from 'react';
import { IAtomicComponent, atomicManager } from './atomic-core';
import { cn } from '../utils';
import { useColorDropStream, ColorDropData } from '../../lib/hooks/useColorDropStream';

export interface AtomicTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

export interface AtomicTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  columns: AtomicTableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  caption?: string;
  getRowEvidenceUuid?: (row: T) => string | undefined; // New prop to get evidence UUID from row
}

export function AtomicTable<T>({
  columns,
  data,
  loading = false,
  emptyText = '暫無任何數據資料',
  caption,
  className,
  getRowEvidenceUuid, // Destructure new prop
  ...props
}: AtomicTableProps<T>) {
  const tableId = React.useId();
  const { drops } = useColorDropStream(); // Use the Color-Drop stream hook

  useEffect(() => {
    const atom: IAtomicComponent = {
      atomId: 'ATOM_TBL_001',
      type: 'atom',
      version: '1.1.0',
      core: { status: 'Trustworthy' } as any,
      reference: {
        specification: 'Data Grid Spec v1.0.1',
        intent: 'Evidence Registry Grid',
        governanceNode: 'UI_DATA_ENGINE'
      }
    };
    atomicManager?.registerAtom?.(atom);
  }, []);

  return (
    <div 
      className={cn(
        "w-full overflow-hidden rounded-xl border border-white/10 bg-[#020617]/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative",
        className
      )}
      role="region"
      aria-labelledby={caption ? `${tableId}-caption` : undefined}
      tabIndex={0}
      {...props}
    >
      {/* 頂部裝飾光暈 */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#06b6d4]/50 to-transparent shadow-[0_0_10px_rgba(6,182,212,0.8)] pointer-events-none" aria-hidden="true" />
      
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          {caption && <caption id={`${tableId}-caption`} className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b border-white/10 bg-white/5 backdrop-blur-md">
              {columns.map((col) => (
                <th key={col.key} scope="col" className="px-5 py-4 text-[11px] font-black font-mono text-[#06b6d4] uppercase tracking-widest whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr aria-live="polite" aria-busy="true">
                <td colSpan={columns.length} className="px-5 py-16 text-center">
                  <div className="inline-flex items-center gap-3 text-xs font-mono text-[#06b6d4] animate-pulse">
                    <span className="w-4 h-4 rounded-full border-2 border-[#06b6d4] border-t-transparent animate-spin" aria-hidden="true" />
                    <span className="sr-only">Loading data...</span>
                    數據加載中 (Loading Registry)...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-16 text-center text-xs font-mono text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl opacity-50" aria-hidden="true">📂</span>
                    <span>{emptyText}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, i) => {
                const evidenceUuid = getRowEvidenceUuid ? getRowEvidenceUuid(row) : undefined;
                const colorDropStatus = evidenceUuid ? drops.get(evidenceUuid)?.status : undefined;

                let rowHighlightClass = '';
                if (colorDropStatus === 'verified') {
                  rowHighlightClass = 'bg-emerald-800/20'; // Green for verified
                } else if (colorDropStatus === 'issued') {
                  rowHighlightClass = 'bg-yellow-800/20'; // Yellow for issued
                } else if (colorDropStatus === 'absolute-zero') {
                  rowHighlightClass = 'bg-red-800/20'; // Red for "Absolute Zero"
                }

                return (
                  <tr 
                    key={i} 
                    className={cn(
                      "group hover:bg-white/10 hover:shadow-[inset_0_0_15px_rgba(6,182,212,0.1)] transition-all duration-300 relative",
                      rowHighlightClass
                    )}
                    tabIndex={-1}
                  >
                    {/* 左側發光條 (Hover Indicator) */}
                    <td className="absolute left-0 top-0 bottom-0 w-1 bg-[#06b6d4] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_10px_rgba(6,182,212,1)]" aria-hidden="true" />
                    
                    {columns.map((col) => (
                      <td key={col.key} className="px-5 py-4 text-[13px] text-slate-300 font-medium whitespace-nowrap group-hover:text-white transition-colors duration-300">
                        {col.render ? col.render(row) : (row as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
