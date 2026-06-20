'use client';
import { OmniComponentHeart } from '@esggo/types';
// @ts-nocheck

import React, { useState } from 'react';

import {
  ShieldCheck,
  History,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Database,
} from 'lucide-react';
import { OmniBaseCard } from '../ui/omni/OmniBaseCard';
import { OmniBadge } from '../ui/omni/OmniBadge';

export interface OmniTableDataRow {
  id: string;
  source_origin: string; // 5T: Traceable
  formula_visibility: boolean; // 5T: Transparent
  zkp_sealed: boolean; // 5T: Trustworthy
  status: 'Void' | 'Pending' | 'Verified'; // 5T: Trackable
  content: string;
  value: string | number;
  timestamp: string;
  hash?: string;
}

interface OmniTableProps {
  /** [永恆覺醒] 萬能元件心核：無作妙德，圓通無礙 */
  omniHeart?: OmniComponentHeart;

  data: OmniTableDataRow[];
  onSealAction?: (id: string) => Promise<void>;
}

export function OmniTable({ data, onSealAction, omniHeart }: OmniTableProps) {
  const [filter, setFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const lowerFilter = filter.toLowerCase();
  const filteredData = data.filter(
    (row) =>
      row.content.toLowerCase().includes(lowerFilter) ||
      row.source_origin.toLowerCase().includes(lowerFilter) ||
      (row.hash && row.hash.toLowerCase().includes(lowerFilter))
  );

  const handleSeal = async (id: string) => {
    if (!onSealAction) return;
    setProcessing(id);
    try {
      await onSealAction(id);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-4">
      {omniHeart && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border border-[#ffd700]/30 rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.1)]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className={omniHeart.resonanceState === 1.0 ? "text-[#ffd700]" : "text-[#63a6b0]"} />
            <span className={`text-xs font-bold tracking-widest ${omniHeart.resonanceState === 1.0 ? "text-[#ffd700]" : "text-[#63a6b0]"}`}>
              OMNI-CORE 5T SECURED
            </span>
          </div>
          {omniHeart.fiveTState && (
            <div className="flex gap-2 text-[10px] font-mono opacity-80">
              <span className={omniHeart.fiveTState.tangible ? 'text-[#63a6b0]' : 'text-slate-600'}>Tan</span>
              <span className={omniHeart.fiveTState.traceable ? 'text-[#63a6b0]' : 'text-slate-600'}>Tra</span>
              <span className={omniHeart.fiveTState.trackable ? 'text-[#63a6b0]' : 'text-slate-600'}>Trk</span>
              <span className={omniHeart.fiveTState.transparent ? 'text-[#63a6b0]' : 'text-slate-600'}>Trp</span>
              <span className={omniHeart.fiveTState.trustworthy ? 'text-[#ffd700]' : 'text-slate-600'}>Tru</span>
            </div>
          )}
        </div>
      )}

      {/* Table Toolbar */}
      <div className="flex justify-between items-center bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="搜尋資料來源、單據、Hash..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-[#63a6b0]/50 focus:ring-1 focus:ring-[#63a6b0]/50 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl transition-colors">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Liquid Interaction Table Body */}
      <div className="flex flex-col gap-3">
        {filteredData.map((row) => (
          <div
            key={row.id}
            className={`group rounded-2xl border transition-all duration-300 ${
              row.status === 'Void' 
                ? 'bg-slate-900/50 border-slate-800' 
                : row.zkp_sealed
                ? 'bg-[#ffd700]/5 border-[#ffd700]/20 hover:border-[#ffd700]/40 hover:bg-[#ffd700]/10 shadow-[0_0_15px_rgba(255,215,0,0.05)] hover:shadow-[0_0_20px_rgba(255,215,0,0.15)]'
                : 'bg-black/40 border-[#63a6b0]/10 hover:border-[#63a6b0]/30 hover:bg-[#63a6b0]/5 shadow-[0_0_20px_rgba(99,166,176,0)] hover:shadow-[0_0_20px_rgba(99,166,176,0.1)]'
            }`}
          >
            {/* Main Row */}
            <div
              className="p-5 flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
            >
              <div className="flex items-center gap-4 w-1/3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    row.status === 'Void' 
                      ? 'bg-slate-800 text-slate-500' 
                      : row.zkp_sealed 
                      ? 'bg-[#ffd700]/20 text-[#ffd700]' 
                      : 'bg-[#63a6b0]/20 text-[#63a6b0]'
                  }`}
                >
                  <Database size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{row.content}</p>
                  <p className="text-[10px] font-mono text-slate-500 flex items-center gap-1 mt-1">
                    <History size={10} /> {row.source_origin}
                  </p>
                </div>
              </div>

              <div className="w-1/4 text-sm font-mono text-slate-300">{row.value}</div>

              <div className="w-1/4 flex gap-2 items-center">
                {row.zkp_sealed ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#ffd700]/10 border border-[#ffd700]/20 text-[#ffd700] text-xs font-medium">
                    <ShieldCheck size={12} /> ZKP Sealed
                  </div>
                ) : (
                  <OmniBadge variant="warning" size="sm" icon={<AlertTriangle size={12} />}>
                    Unsealed
                  </OmniBadge>
                )}
                {row.status === 'Void' && (
                  <OmniBadge variant="error" size="sm">
                    Void
                  </OmniBadge>
                )}
              </div>

              <div className="w-[100px] flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSeal(row.id);
                  }}
                  disabled={row.zkp_sealed || processing === row.id || row.status === 'Void'}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#ffd700]/10 text-[#ffd700] hover:bg-[#ffd700]/20 border border-[#ffd700]/20 disabled:opacity-50 disabled:border-transparent disabled:bg-slate-800 disabled:text-slate-500 transition-colors"
                >
                  {processing === row.id ? 'Sealing...' : 'Approve'}
                </button>
              </div>
            </div>

            {/* Expandable Trace Details */}
            
              {expandedId === row.id && (
                <div
                  className="overflow-hidden border-t border-slate-800/50"
                >
                  <div className="p-5 bg-[#0a0f1d]/80 flex flex-col gap-4 rounded-b-2xl border-t border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                          公式透明度
                        </h4>
                        <div className={`text-sm flex items-center gap-2 font-mono p-2 rounded-lg border ${row.formula_visibility ? 'bg-[#63a6b0]/10 border-[#63a6b0]/20 text-[#63a6b0]' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                          {row.formula_visibility ? (
                            <CheckCircle size={14} />
                          ) : (
                            <AlertTriangle size={14} />
                          )}
                          {row.formula_visibility ? 'ISO-14064 公開可驗證' : 'OPAQUE'}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                          Timestamp
                        </h4>
                        <div className="text-sm text-slate-300 font-mono">{row.timestamp}</div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                          Hash Lock (哈希封印)
                        </h4>
                        <div className="flex flex-col gap-2">
                          <div className="text-xs text-slate-300 font-mono break-all p-2.5 rounded-lg border border-white/10 shadow-inner">
                            {row.hash || 'N/A (Awaiting Seal)'}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(
                                `正向 OmniCore Gateway 發起溯源請求...\n目標 Hash: ${
                                  row.hash || '無效'
                                }\n此功能將展示原始單據與 5T 驗證路徑。`
                              );
                            }}
                            className="flex items-center justify-center gap-2 px-3 py-1.5 mt-1 bg-[#63a6b0]/10 hover:bg-[#63a6b0]/30 text-[#63a6b0] text-xs font-bold rounded-lg border border-[#63a6b0]/20 transition-all"
                          >
                            <Search size={12} />
                            溯源反查 (Trace Origin)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            
          </div>
        ))}
        {filteredData.length === 0 && (
          <div className="py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            No 5T registered data found.
          </div>
        )}
      </div>
    </div>
  );
}
