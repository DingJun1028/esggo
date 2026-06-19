import React from 'react';

interface EvidenceItem {
  id: string;
  type: string;
  timestamp: string;
  status: 'verified' | 'pending';
  hash: string;
}

const MOCK_EVIDENCE: EvidenceItem[] = [
  {
    id: 'ev-001',
    type: 'Energy Usage',
    timestamp: '2025-10-27 10:00:00',
    status: 'verified',
    hash: '0xabc...123',
  },
  {
    id: 'ev-002',
    type: 'Water Quality',
    timestamp: '2025-10-27 11:30:00',
    status: 'verified',
    hash: '0xdef...456',
  },
  {
    id: 'ev-003',
    type: 'Social Impact',
    timestamp: '2025-10-28 09:15:00',
    status: 'pending',
    hash: '0xghi...789',
  },
];

export const EvidenceBrowser: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#050505] border border-white/10 rounded-xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
        <h3 className="text-sm font-medium text-slate-300">Evidence Vault</h3>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
          5T Secured
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {MOCK_EVIDENCE.map(item => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-lg border border-white/5 hover:border-white/20 bg-white/5 transition-all"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm text-white">{item.type}</span>
              <span className="text-[10px] text-slate-500 font-mono">
                {item.id} :: {item.timestamp}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:block text-[10px] font-mono text-slate-600">
                {item.hash}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${item.status === 'verified' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvidenceBrowser;
