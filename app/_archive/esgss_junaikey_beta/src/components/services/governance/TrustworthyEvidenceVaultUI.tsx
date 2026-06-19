import React, { useState } from 'react';
import {
  Shield,
  Database,
  Lock,
  Search,
  Filter,
  Terminal,
  Copy,
  ExternalLink,
  Activity,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { governanceManager, EvidenceRecord } from '../../../services/GovernanceManager';

export const TrustworthyEvidenceVaultUI: React.FC<{ language: any; theme: string; data?: any }> = ({
  language,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [records] = useState<EvidenceRecord[]>(() => governanceManager.getVaultRecords());
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = records.filter(
    r =>
      (filter === 'ALL' || r.status === filter) &&
      (r.type.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${isDark ? 'text-white' : 'text-slate-900'}`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(13,242,238,0.2)]">
            <Shield size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">Evidence Vault</h2>
            <div className="text-[8px] sm:text-[10px] font-mono opacity-50 uppercase tracking-widest">
              Immortal 5T Ledger System
            </div>
          </div>
        </div>
        <div className="w-full sm:w-auto flex gap-2">
          <div
            className={`flex-1 sm:flex-initial flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isDark ? 'bg-slate-900 border-white/5' : 'bg-slate-50 border-slate-200'}`}
          >
            <Search size={14} className="opacity-30" />
            <input
              type="text"
              placeholder="Search IDs/Types..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] w-full sm:w-32 font-mono"
            />
          </div>
        </div>
      </div>

      <div
        className={`flex-1 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} flex flex-col overflow-hidden`}
      >
        <div
          className={`p-4 border-b ${isDark ? 'border-white/5' : 'border-slate-100'} flex gap-4 overflow-x-auto custom-scrollbar`}
        >
          <FilterTab
            label="All Records"
            active={filter === 'ALL'}
            onClick={() => setFilter('ALL')}
            count={records.length}
            isDark={isDark}
          />
          <FilterTab
            label="Verified"
            active={filter === 'VERIFIED'}
            onClick={() => setFilter('VERIFIED')}
            count={records.filter(r => r.status === 'VERIFIED').length}
            isDark={isDark}
          />
          <FilterTab
            label="Pending"
            active={filter === 'PENDING'}
            onClick={() => setFilter('PENDING')}
            count={records.filter(r => r.status === 'PENDING').length}
            isDark={isDark}
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
          <table className="w-full text-left border-collapse">
            <thead
              className={`sticky top-0 z-10 ${isDark ? 'bg-slate-900' : 'bg-slate-50'} text-[10px] font-black uppercase tracking-widest opacity-40`}
            >
              <tr>
                <th className="px-4 sm:px-6 py-4">Status</th>
                <th className="hidden sm:table-cell px-6 py-4">Evidence ID</th>
                <th className="px-4 sm:px-6 py-4">Component Type</th>
                <th className="hidden md:table-cell px-6 py-4">Source Origin</th>
                <th className="hidden lg:table-cell px-6 py-4">Cryptographic Hash</th>
                <th className="px-4 sm:px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(record => (
                <tr
                  key={record.id}
                  className={`group border-none transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
                >
                  <td className="px-4 sm:px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black ${record.status === 'VERIFIED'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                        }`}
                    >
                      {record.status === 'VERIFIED' ? (
                        <CheckCircle size={10} />
                      ) : (
                        <Activity size={10} />
                      )}
                      {record.status}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 font-mono text-xs opacity-80">{record.id}</td>
                  <td className="px-4 sm:px-6 py-4 font-bold text-xs">{record.type}</td>
                  <td className="hidden md:table-cell px-6 py-4 text-xs opacity-60">{record.source}</td>
                  <td className="hidden lg:table-cell px-6 py-4">
                    <div className="flex items-center gap-2 group/hash">
                      <span className="font-mono text-[10px] opacity-30 truncate w-32">
                        {record.hash}
                      </span>
                      <Copy
                        size={12}
                        className="opacity-0 group-hover/hash:opacity-100 cursor-pointer transition-opacity text-indigo-400"
                      />
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-[10px] opacity-40 font-mono">
                    <span className="hidden sm:inline">{new Date(record.timestamp).toLocaleString()}</span>
                    <span className="sm:hidden">{new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className={`mt-6 p-4 rounded-xl border ${isDark ? 'bg-slate-950/50 border-white/5' : 'bg-accent/5'} flex items-center justify-between`}
      >
        <div className="flex items-center gap-3">
          <Terminal size={16} className="text-indigo-400" />
          <p className="text-[10px] font-mono opacity-50">
            Vault integrity: 100% | Blockchain sync: Active | Last pulse: 12s ago
          </p>
        </div>
      </div>
      <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1">
        Export Audit Trail <ExternalLink size={10} />
      </button>
    </div >
  );
};

const FilterTab = ({ label, active, onClick, count, isDark }: any) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${active
      ? isDark
        ? 'bg-white/10 text-white'
        : 'bg-slate-100 text-slate-900'
      : 'text-slate-500 hover:text-slate-400'
      }`}
  >
    {label} <span className="text-[9px] font-mono opacity-40">{count}</span>
  </button>
);

const CheckCircle = ({ size }: any) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default TrustworthyEvidenceVaultUI;
