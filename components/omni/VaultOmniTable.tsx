import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalButton } from '../ui/universal/UniversalButton';
import { UniversalBadge } from '../ui/universal/UniversalBadge';

export interface VaultOmniTableRecord {
  id: string;
  data: Record<string, any>;
  timestamp: string;
  author: string;
  zkpHash: string; // The Zero-Knowledge Proof hash or signature
  fiveTStatus: [boolean, boolean, boolean, boolean, boolean];
}

interface VaultOmniTableProps {
  columns: { key: string; label: string }[];
  records: VaultOmniTableRecord[];
  className?: string;
}

export default function VaultOmniTable({ columns, records, className = '' }: VaultOmniTableProps) {
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  return (
    <div className={`w-full bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-cyan-950 border border-cyan-800 rounded-md">
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-200">Vault OmniTable <span className="text-xs font-mono text-cyan-500 ml-2 border border-cyan-900/50 bg-cyan-950/30 px-2 py-0.5 rounded">ZKP SEALED</span></h3>
        </div>
        <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          REALTIME VERIFIED
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
              <th className="p-4 pl-6">ZKP Hash</th>
              {columns.map(col => (
                <th key={col.key} className="p-4">{col.label}</th>
              ))}
              <th className="p-4">Author</th>
              <th className="p-4 text-center">5T Protocol</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium">
            <AnimatePresence>
              {records.map((record, index) => (
                <motion.tr 
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedRecord(selectedRecord === record.id ? null : record.id)}
                  className={`border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer transition-colors ${selectedRecord === record.id ? 'bg-slate-800/50' : ''}`}
                >
                  <td className="p-4 pl-6 font-mono text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      {record.zkpHash.substring(0, 12)}...
                    </div>
                  </td>
                  {columns.map(col => (
                    <td key={col.key} className="p-4 text-slate-300">
                      {record.data[col.key]}
                    </td>
                  ))}
                  <td className="p-4 text-slate-400 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white">
                      {record.author.charAt(0)}
                    </div>
                    {record.author}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-1">
                      {record.fiveTStatus.map((status, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-4 rounded-sm ${status ? 'bg-cyan-500' : 'bg-slate-700'}`}
                          title={`5T Protocol Element ${i + 1}`}
                        />
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
