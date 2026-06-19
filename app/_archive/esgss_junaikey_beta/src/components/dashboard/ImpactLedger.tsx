import React from 'react';
import { Card, ScrollArea } from '@/components/ui';
import { FileSearch, Leaf, Zap, Globe, ShieldCheck } from 'lucide-react';

export interface ImpactRecord {
  id: string;
  timestamp: string;
  type: 'ENVIRONMENTAL' | 'SOCIAL' | 'GOVERNANCE';
  description: string;
  metric: string;
  hash: string;
}

interface ImpactLedgerProps {
  records: ImpactRecord[];
}

export const ImpactLedger: React.FC<ImpactLedgerProps> = ({ records }) => {
  const getIcon = (type: ImpactRecord['type']) => {
    switch (type) {
      case 'ENVIRONMENTAL':
        return <Leaf className="text-emerald-400" size={14} />;
      case 'SOCIAL':
        return <Globe className="text-blue-400" size={14} />;
      case 'GOVERNANCE':
        return <ShieldCheck className="text-purple-400" size={14} />;
      default:
        return <FileSearch className="text-slate-400" size={14} />;
    }
  };

  return (
    <Card className="bg-slate-950/80 border-slate-800 shadow-2xl overflow-hidden flex flex-col h-full border-t-2 border-t-emerald-500/30">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/20 p-1.5 rounded-lg">
            <Zap className="text-emerald-400" size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Impact Ledger</h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              3+1 Immutable Protocol
            </p>
          </div>
        </div>
        <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-[9px] font-black text-emerald-400 font-mono">LIVE_UPDATE</span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 opacity-30 text-center">
              <FileSearch size={32} className="mb-2" />
              <p className="text-xs font-mono">
                NO IMPACT DETECTED
                <br />
                Awaiting system signals...
              </p>
            </div>
          ) : (
            records.map(record => (
              <div
                key={record.id}
                className="group relative bg-slate-900/30 border border-slate-800 rounded-lg p-3 hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {getIcon(record.type)}
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                      {record.description}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-600 group-hover:text-emerald-500/50 transition-colors uppercase">
                    {record.timestamp}
                  </span>
                </div>

                <div className="flex items-end justify-between">
                  <div className="text-lg font-black text-emerald-400 tracking-tighter font-mono italic">
                    {record.metric}
                  </div>
                  <div className="text-[8px] font-mono text-slate-700 bg-black/40 px-1.5 py-0.5 rounded border border-white/5 truncate max-w-[120px]">
                    HASH:{record.hash}
                  </div>
                </div>

                {/* Scanning line effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-full w-full pointer-events-none opacity-0 group-hover:animate-scan transition-opacity"></div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-3 bg-slate-900/50 border-t border-slate-800 flex justify-center">
        <p className="text-[8px] font-mono text-slate-600 tracking-widest uppercase">
          Verification Engine Active • GSC-Core v2.4
        </p>
      </div>
    </Card>
  );
};
