'use client';

import React, { useState, useEffect } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { Lock, FileText, UploadCloud, Link as LinkIcon, Activity, ChevronRight, Hash, ShieldCheck, Search } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';

export default function VaultPage() {
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  const [vaultRecords, setVaultRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sealingId, setSealingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecords() {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) throw new Error("Supabase client not initialized");
        const { data, error } = await supabase
          .from('evidence_vault')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }

        if (data) {
          const records = data.map((item: any) => ({
            id: item.id,
            uuid: item.id,
            name: item.file_name || 'Unknown Source',
            type: item.file_type || 'Document',
            hash: item.hash_lock || 'Unsealed',
            sealed: !!item.hash_lock,
            timestamp: item.created_at,
            gri: item.gri_mapping || item.gri_reference || 'N/A',
            verified: item.zkp_proof || false,
          }));
          setVaultRecords(records);
          if (records.length > 0) {
            setSelectedRecord(records[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch records', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecords();
  }, []);

  const handleExecuteSeal = async (recordId: string) => {
    try {
      setSealingId(recordId);
      const res = await fetch('/api/vault/seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evidenceUuid: recordId,
          sealType: '5t',
          sourceOrigin: 'evidence-vault',
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Update the local state
        setVaultRecords(prev => prev.map(r => 
          r.id === recordId 
            ? { ...r, hash: data.hashLock, sealed: true, verified: true } 
            : r
        ));
      } else {
        console.error('Seal failed:', data.error);
      }
    } catch (err) {
      console.error('Seal request error:', err);
    } finally {
      setSealingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-void-stark text-white p-6 lg:p-8 animate-in fade-in duration-700">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <UniversalBadge variant="success" icon="🛡️">
                5T 實證金庫 (Vault-Omni)
              </UniversalBadge>
              <span className="text-xs text-emerald-soul/70 uppercase tracking-widest font-mono">
                System: Immutable
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white/90 font-mono">
              Cryptographic Seal Hall
            </h1>
            <p className="text-sm text-white/50 max-w-2xl">
              All records here are cryptographically sealed. This acts as the Single Source of Truth for the ESG GO OmniCore.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-cyan-core/10 border border-cyan-core/30 hover:bg-cyan-core/20 text-cyan-core px-4 py-2 rounded-lg transition-all duration-300">
            <UploadCloud className="w-4 h-4" />
            <span className="text-sm font-medium">Smart Ingestion</span>
          </button>
        </header>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Ledger / List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-2 px-4">
              <div className="flex items-center gap-2 text-white/40">
                <Search className="w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search by hash, name, or GRI tag..." 
                  className="bg-transparent border-none outline-none text-sm w-64 placeholder:text-white/30 text-white"
                />
              </div>
              <div className="text-xs text-white/30 font-mono">
                Showing {vaultRecords.length} records
              </div>
            </div>

            <div className="space-y-3">
              {vaultRecords.map((record) => (
                <div 
                  key={record.id}
                  onClick={() => setSelectedRecord(record.id)}
                  className={`
                    group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer
                    ${selectedRecord === record.id 
                      ? 'bg-cyan-core/10 border-cyan-core/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${record.sealed ? 'bg-emerald-soul/10 text-emerald-soul' : 'bg-white/10 text-white/50'}`}>
                      {record.sealed ? <Lock className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className={`font-medium ${selectedRecord === record.id ? 'text-cyan-core' : 'text-white/90'}`}>
                        {record.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/50 font-mono">
                        <span className="flex items-center gap-1"><Hash className="w-3 h-3"/> {record.hash}</span>
                        <span>•</span>
                        <span>{new Date(record.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 text-white/60">
                      {record.gri}
                    </span>
                    <ChevronRight className={`w-5 h-5 transition-transform ${selectedRecord === record.id ? 'text-cyan-core translate-x-1' : 'text-white/20'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Details & Lineage */}
          <div className="space-y-6">
            {selectedRecord ? (
              <>
                <UniversalCard variant="glow" title="Record Hash Lock">
                  {vaultRecords.filter(r => r.id === selectedRecord).map(record => (
                    <div key={record.id} className="space-y-6">
                      
                      {/* Seal Status */}
                      <div className="flex flex-col items-center justify-center p-6 border border-white/10 rounded-lg bg-black/20 backdrop-blur-md relative overflow-hidden">
                        {record.sealed ? (
                          <>
                            <div className="absolute inset-0 bg-emerald-soul/5 animate-pulse"></div>
                            <ShieldCheck className="w-12 h-12 text-emerald-soul mb-2 relative z-10" />
                            <h4 className="text-emerald-soul font-bold text-lg relative z-10">Cryptographically Sealed</h4>
                            <p className="text-xs text-emerald-soul/60 font-mono mt-1 relative z-10">Integrity Verified</p>
                          </>
                        ) : (
                          <>
                            <FileText className="w-12 h-12 text-white/30 mb-2 relative z-10" />
                            <h4 className="text-white/70 font-bold text-lg relative z-10">Pending Seal</h4>
                            <button 
                              onClick={() => handleExecuteSeal(record.id)}
                              disabled={sealingId === record.id}
                              className="mt-3 text-xs bg-emerald-soul/20 text-emerald-soul border border-emerald-soul/30 px-3 py-1.5 rounded hover:bg-emerald-soul/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                              {sealingId === record.id ? 'Sealing...' : 'Execute 5T Seal'}
                            </button>
                          </>
                        )}
                      </div>

                      {/* Metadata */}
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-white/50">Origin Source</span>
                          <span className="text-white/90 text-right">{record.type} Upload</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-white/50">Timestamp</span>
                          <span className="text-white/90 font-mono text-xs">{record.timestamp}</span>
                        </div>
                        <div className="flex flex-col gap-1 border-b border-white/10 pb-2">
                          <span className="text-white/50">SHA-256 Hash</span>
                          <span className="text-cyan-core font-mono text-xs break-all">{record.hash.padEnd(64, '0')}</span>
                        </div>
                      </div>

                      {/* Lineage Graph (Simplified UI representation) */}
                      <div className="pt-2">
                        <h5 className="text-xs text-white/50 mb-3 flex items-center gap-2">
                          <LinkIcon className="w-3 h-3" /> Data Lineage Graph
                        </h5>
                        <div className="p-4 border border-white/10 rounded-lg bg-white/5 relative">
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-cyan-core shadow-[0_0_5px_#06b6d4]"></div>
                              <span className="text-xs text-white/80">Vault Ingestion</span>
                            </div>
                            <div className="w-px h-4 bg-gradient-to-b from-cyan-core/50 to-emerald-soul/50 ml-1"></div>
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-emerald-soul shadow-[0_0_5px_#10b981]"></div>
                              <span className="text-xs text-white/80">SustainWrite (GRI {record.gri})</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </UniversalCard>

                {/* API Gateway View */}
                <UniversalCard variant="bordered" title="API Gateway View" className="opacity-80">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/50">RPC Endpoint</span>
                      <span className="text-cyan-core font-mono">get_gri_nexus</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/50">Last Access</span>
                      <span className="text-white/70 font-mono">2 mins ago by OmniAgent</span>
                    </div>
                    <div className="p-2 bg-black/40 rounded border border-white/5 text-[10px] font-mono text-white/40 overflow-hidden">
                      {`{
  "query": "hash_verify",
  "record_id": "${selectedRecord}"
}`}
                    </div>
                  </div>
                </UniversalCard>
              </>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-xl p-8 text-center text-white/40">
                Select a record to view its Cryptographic Seal details and Data Lineage.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
