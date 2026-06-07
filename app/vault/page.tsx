import React from 'react';
import VaultOmniTable, { VaultOmniTableRecord } from '@/components/omni/VaultOmniTable';
import { OmniCard } from '@/components/omni/OmniCard';
import { RecordLifecycleStatus, AttentionStatus } from '@/shared-types/status';

const mockRecords: VaultOmniTableRecord[] = [
  {
    id: '1',
    data: { action: 'Emission Data Sync', amount: '1,240 tCO2e', status: 'Verified' },
    timestamp: new Date().toISOString(),
    author: 'OmniNexus',
    zkpHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    fiveTStatus: [true, true, true, true, true]
  },
  {
    id: '2',
    data: { action: 'Energy Report Audit', amount: 'N/A', status: 'Pending' },
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    author: 'System Admin',
    zkpHash: '0xf9e8d7c6b5a4938271605a4b3c2d1e0f9a8b7c6d',
    fiveTStatus: [true, true, true, false, true]
  },
  {
    id: '3',
    data: { action: 'Water Usage Log', amount: '34,000 L', status: 'Verified' },
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    author: 'Facility Sensor A',
    zkpHash: '0x8d7c6b5a4938271605a4b3c2d1e0f9a8b7c6df9e',
    fiveTStatus: [true, true, true, true, true]
  }
];

const mockColumns = [
  { key: 'action', label: 'Action' },
  { key: 'amount', label: 'Impact / Value' },
  { key: 'status', label: 'Status' }
];

export default function Page() {
  return (
    <div className="p-8 h-full w-full bg-[#020617] text-slate-200 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Data Vault</h1>
          <p className="text-slate-400">Secure, ZKP-sealed data records validated against the 5T Integrity Protocol.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <VaultOmniTable 
              columns={mockColumns} 
              records={mockRecords} 
              className="h-full"
            />
          </div>
          <div className="col-span-1 space-y-6">
            <OmniCard
              nodeId="F-VAULT-N-001"
              title="Vault Health Status"
              description="System integrity and cryptographic verification metrics."
              status={RecordLifecycleStatus.ACTIVE}
              attention={AttentionStatus.NORMAL}
              metrics={[
                { label: 'Total Records', value: '14,092' },
                { label: 'ZKP Hash Rate', value: '100%' },
                { label: '5T Compliance', value: '99.8%' }
              ]}
              evidence={{
                source_origin: 'Vault Core',
                timestamp: Date.now(),
                hash_lock: '0xabc123...',
                status: 'Trustworthy'
              }}
              formula="∑(Records * ZKP_Verified) / Total"
              version="8.5.0-Alpha"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
