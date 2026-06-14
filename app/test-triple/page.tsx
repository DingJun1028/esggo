'use client';
import React, { useState } from 'react';
import OmniAllianceHub from '@/components/omni/OmniAllianceHub';
import VaultOmniTable from '@/components/omni/VaultOmniTable';
import OmniSustainWriteEditor from '@/components/omni/OmniSustainWriteEditor';

export default function TestTriplePage() {
  const [editorValue, setEditorValue] = useState('<p>This is a 5T-compliant document.</p>');

  return (
    <div className="p-8 bg-[#020617] min-h-screen text-slate-200 space-y-12">
      <h1 className="text-3xl font-bold text-cyan-400">Triple Layer Ascension Validation</h1>

      <section>
        <h2 className="text-xl font-bold mb-4 text-emerald-400">1. Data Layer: Vault OmniTable</h2>
        <VaultOmniTable columns={[{ key: 'category', label: 'Type' }]} records={[]} />
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 text-blue-400">
          2. Intelligence Layer: Alliance Hub
        </h2>
        <OmniAllianceHub />
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 text-amber-400">
          3. Reporting Layer: SustainWrite Editor
        </h2>
        <div className="bg-slate-900 p-4 rounded-xl">
          <OmniSustainWriteEditor
            value={editorValue}
            onChange={setEditorValue}
            documentId="test-123"
          />
        </div>
      </section>
    </div>
  );
}
