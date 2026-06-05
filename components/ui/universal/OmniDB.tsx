'use client';
import React, { useState, useCallback } from 'react';
import { cn } from '../../../lib/cn';
import { Database, RefreshCw, Plus, Trash2, Edit2 } from 'lucide-react';
import { UniversalButton } from './UniversalButton';
import { UniversalInput } from './UniversalInput';
import { UniversalBadge } from './UniversalBadge';

export interface OmniDBRecord {
  id: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface OmniDBCredentials {
  host: string;
  port: number;
  database: string;
  username: string;
  password?: string;
}

export interface OmniDBProps {
  source?: 'supabase' | 'ncbdb' | 'mysql' | 'postgres';
  records?: OmniDBRecord[];
  onRefresh?: () => void;
  onAdd?: (data: Record<string, any>) => void;
  onUpdate?: (id: string, data: Record<string, any>) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
  className?: string;
}

export const OmniDB = React.forwardRef<HTMLDivElement, OmniDBProps>(
  ({ source = 'supabase', records = [], onRefresh, onAdd, onUpdate, onDelete, loading, className }, ref) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newRecord, setNewRecord] = useState<Record<string, any>>({});
    const [activeTab, setActiveTab] = useState<'records' | 'schema'>('records');

    const handleAdd = useCallback(() => {
      if (onAdd) {
        onAdd(newRecord);
        setNewRecord({});
      }
    }, [onAdd, newRecord]);

    const sourceConfig = {
      supabase: { label: 'Supabase', color: 'emerald' },
      ncbdb: { label: 'NCBDB', color: 'purple' },
      mysql: { label: 'MySQL', color: 'orange' },
      postgres: { label: 'PostgreSQL', color: 'blue' },
    };

    const config = sourceConfig[source];

    return (
      <div ref={ref} className={cn('w-full bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] shadow-2xl overflow-hidden', className)}>
        {/* Header */}
        <div className="p-4 border-b border-[var(--theme-border)] bg-[var(--theme-surface)]/80 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/20 rounded-md">
              <Database className="w-5 h-5 text-[var(--theme-primary)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--theme-text)]">
              OmniDB <span className="text-xs font-mono text-[var(--theme-text-muted)] ml-2">({config.label})</span>
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <UniversalBadge variant="outline" size="sm">{config.label} Connected</UniversalBadge>
            {onRefresh && (
              <UniversalButton variant="ghost" size="icon" onClick={onRefresh} disabled={loading}>
                <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
              </UniversalButton>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--theme-border)]">
          <button
            onClick={() => setActiveTab('records')}
            className={cn('px-4 py-2 text-xs font-medium border-b-2 transition-colors', 
              activeTab === 'records' ? 'border-[var(--theme-primary)] text-[var(--theme-primary)]' : 'border-transparent text-[var(--theme-text-muted)]')}
          >
            Records
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={cn('px-4 py-2 text-xs font-medium border-b-2 transition-colors', 
              activeTab === 'schema' ? 'border-[var(--theme-primary)] text-[var(--theme-primary)]' : 'border-transparent text-[var(--theme-text-muted)]')}
          >
            Schema
          </button>
        </div>

        {/* Content */}
        {activeTab === 'records' && (
          <div className="p-4">
            {/* Add Record Form */}
            {onAdd && (
              <div className="mb-4 p-3 border border-[var(--theme-border)] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[var(--theme-text-muted)] uppercase tracking-widest">New Record</span>
                  <UniversalButton variant="primary" size="sm" onClick={handleAdd}>
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </UniversalButton>
                </div>
                <UniversalInput
                  value={JSON.stringify(newRecord)}
                  onChange={(e) => {
                    try {
                      setNewRecord(JSON.parse(e.target.value || '{}'));
                    } catch {}
                  }}
                  placeholder='{"field": "value"}'
                  className="font-mono text-xs"
                />
              </div>
            )}

            {/* Records Table */}
            <div className="max-h-96 overflow-y-auto">
              {records.length === 0 ? (
                <div className="text-center py-8 text-[var(--theme-text-muted)]">
                  <Database className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>No records found</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="border-b border-[var(--theme-border)]">
                    <tr className="text-[var(--theme-text-muted)]">
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">Data</th>
                      <th className="text-right p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id} className="border-b border-[var(--theme-border)]/50 hover:bg-[var(--theme-surface)]/50">
                        <td className="p-2 font-mono text-xs text-[var(--theme-text-muted)]">{record.id.slice(0, 8)}...</td>
                        <td className="p-2 font-mono text-xs text-[var(--theme-text)]">{JSON.stringify(record.data).slice(0, 50)}...</td>
                        <td className="p-2 text-right">
                          <div className="flex justify-end gap-1">
                            {onUpdate && (
                              <button
                                onClick={() => setEditingId(record.id)}
                                className="p-1 text-[var(--theme-text-muted)] hover:text-[var(--theme-primary)]"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(record.id)}
                                className="p-1 text-[var(--theme-text-muted)] hover:text-rose-500"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="p-4">
            <div className="text-center py-8 text-[var(--theme-text-muted)]">
              <p>Schema view - connect to {config.label} to explore table structure</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);
OmniDB.displayName = 'OmniDB';