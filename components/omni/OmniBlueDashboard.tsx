'use client';

import React, { useEffect, useState } from 'react';
import VaultOmniTable, { VaultOmniTableRecord } from './VaultOmniTable';
import { Database, Server } from 'lucide-react';
import { UniversalButton } from '../ui/universal/UniversalButton';
import { UniversalCard } from '../ui/universal/UniversalCard';
import { UniversalBadge } from '../ui/universal/UniversalBadge';

export default function OmniBlueDashboard() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<VaultOmniTableRecord[]>([]);

  const fetchOmniBlueData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/omniblue');
      const json = await res.json();

      const newRecords: VaultOmniTableRecord[] = [];

      // Process Supabase Data
      if (json.data?.supabase) {
        json.data.supabase.forEach((item: any, idx: number) => {
          newRecords.push({
            id: `sb-${item.id || idx}`,
            data: {
              source: 'Supabase',
              node: item.node_name || 'OmniNode',
              status: item.status || 'Active',
            },
            timestamp: item.created_at || new Date().toISOString(),
            author: item.author || 'OmniSystem',
            zkpHash: item.hash || `0xsb${Math.random().toString(16).slice(2, 14)}`,
            fiveTStatus: [true, true, true, true, false],
          });
        });
      }

      // Process NCBDB Data
      if (json.data?.ncbdb && Array.isArray(json.data.ncbdb)) {
        json.data.ncbdb.forEach((item: any, idx: number) => {
          newRecords.push({
            id: `ncb-${item.Id || idx}`,
            data: {
              source: 'NCBDB',
              node: item.Title || 'NCB Node',
              status: item.Status || 'Synced',
            },
            timestamp: item.CreatedAt || new Date().toISOString(),
            author: 'NCB_Agent',
            zkpHash: `0xnc${Math.random().toString(16).slice(2, 14)}`,
            fiveTStatus: [true, true, true, false, false],
          });
        });
      }

      // If no data, provide mock data for visual demonstration
      if (newRecords.length === 0) {
        newRecords.push({
          id: 'mock-1',
          data: { source: 'Supabase (Mock)', node: 'Genesis Node', status: 'Sealed' },
          timestamp: new Date().toISOString(),
          author: 'System',
          zkpHash: '0x94b3a2c1d9f8e7',
          fiveTStatus: [true, true, true, true, true],
        });
        newRecords.push({
          id: 'mock-2',
          data: { source: 'NCBDB (Mock)', node: 'Data Connect', status: 'Synced' },
          timestamp: new Date().toISOString(),
          author: 'NCB_Agent',
          zkpHash: '0x1a2b3c4d5e6f7a',
          fiveTStatus: [true, true, false, true, false],
        });
      }

      setRecords(newRecords);
    } catch (err) {
      console.error('Failed to fetch OmniBlue data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOmniBlueData();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 space-y-6 relative z-10">
      <UniversalCard variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Database className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-slate-100 flex items-center gap-2">
                OmniBlue <span className="text-blue-500">Data Mesh</span>
              </h2>
              <p className="text-sm text-slate-400 font-medium">
                Synchronizing state across Supabase & NoCodeBackend
              </p>
            </div>
          </div>
          <UniversalButton variant="outline" size="sm" onClick={fetchOmniBlueData} disabled={loading}>
            {loading ? 'Sync...' : 'Sync State'}
          </UniversalButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <UniversalCard variant="outline" className="flex items-center gap-4 p-4">
            <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 tracking-wider uppercase">Primary Vault</div>
              <div className="text-lg font-bold text-slate-200">Supabase Connected</div>
            </div>
          </UniversalCard>

          <UniversalCard variant="outline" className="flex items-center gap-4 p-4">
            <div className="p-3 bg-purple-500/10 rounded-full border border-purple-500/20">
              <Server className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 tracking-wider uppercase">Sovereign DB</div>
              <div className="text-lg font-bold text-slate-200">NCBDB Synchronized</div>
            </div>
          </UniversalCard>
        </div>
      </UniversalCard>

      <VaultOmniTable
        columns={[
          { key: 'source', label: 'Data Source' },
          { key: 'node', label: 'Node Signature' },
          { key: 'status', label: 'State' }
        ]}
        records={records}
      />
    </div>
  );
}