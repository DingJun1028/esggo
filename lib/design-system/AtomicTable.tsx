import React, { useEffect } from 'react';
import { IAtomicComponent, atomicManager } from './atomic-core';

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
}

export function AtomicTable<T>({
  columns,
  data,
  loading = false,
  emptyText = '暫無任何數據資料',
  className = '',
  ...props
}: AtomicTableProps<T>) {
  useEffect(() => {
    const atom: IAtomicComponent = {
      atomId: 'ATOM_TBL_001',
      type: 'atom',
      version: '1.0.0',
      core: { status: 'Trustworthy' } as any,
      reference: {
        specification: 'Data Grid Spec v1.0',
        intent: 'Evidence Registry Grid',
        governanceNode: 'UI_DATA_ENGINE'
      }
    };
    atomicManager?.registerAtom?.(atom);
  }, []);

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-md ${className}`} {...props}>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-[10px] font-black font-mono text-slate-400 uppercase tracking-widest">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-xs font-mono text-slate-500 animate-pulse">
                  數據加載中 (Loading Registry)...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-xs font-mono text-slate-500">
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors duration-200">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-xs text-slate-300 font-medium">
                      {col.render ? col.render(row) : (row as any)[col.key]}
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
