import React from 'react';
import OmniAllianceHub from '@/components/omni/OmniAllianceHub';
import VaultOmniTable from '@/components/omni/VaultOmniTable';
import OmniSustainWriteEditor from '@/components/omni/OmniSustainWriteEditor';

export default function TestTriplePage() {
  return (
    <div className="p-8 bg-[#020617] min-h-screen text-white space-y-8">
      <h1 className="text-2xl font-bold border-b border-white/10 pb-4">Triple Layer Ascension Validation</h1>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-cyan-400">Alliance Hub</h2>
        <OmniAllianceHub />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-cyan-400">Vault Omni Table</h2>
        <VaultOmniTable />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-cyan-400">Sustain Write Editor</h2>
        <OmniSustainWriteEditor />
      </section>
    </div>
  );
}
