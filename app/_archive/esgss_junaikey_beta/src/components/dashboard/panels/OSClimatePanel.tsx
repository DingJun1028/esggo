import React, { useState } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion } from 'framer-motion';
import { FileUp, ShieldCheck, Thermometer, TrendingUp, Search, Lock } from 'lucide-react';
import { osClimateService } from '@/services/integration/OSClimateService';
import { IDataCommonsRecord } from '@/types/os-climate';
import { ComponentCoreFactory, IComponentCore } from '@/services/ceremony';
import '../../../styles/liquid-glass.css';

export const OSClimatePanel: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'ingesting' | 'calculating' | 'verified'>('idle');
  const [result, setResult] = useState<{
    protocol?: { traceable?: { origin?: string }; immutable?: { hash_lock?: string } };
    itr?: { temperatureScore?: number; pathway?: string };
  } | null>(null);

  // IComponentCore Initialization
  const [core] = useState<IComponentCore>(() =>
    ComponentCoreFactory.create(
      'dashboard/panels/OSClimatePanel.tsx',
      '1.0.0',
      ['OS-Climate', 'DataBridge', '5T-Protocol']
    )
  );

  const handleIngest = async () => {
    setStatus('ingesting');
    try {
      // Simulate ingestion
      const mockRecord: IDataCommonsRecord = {
        entityName: 'TSMC',
        data: { scope1: 1500, scope2: 3200, scope3: 8900 },
        meta: {
          source_url: 'TSMC_2025_ESG_Report.pdf',
          page_number: 42,
          extraction_method: 'NLP_AUTOMATED',
        },
      };
      const packet = await osClimateService.ingestFromDataCommons(mockRecord);
      setResult(packet);
      setStatus('calculating');

      // Simulate ITR
      setTimeout(async () => {
        const itr = await osClimateService.calculateITR(mockRecord.data);
        setResult(prev => (prev ? { ...prev, itr } : { itr }));
        setStatus('verified');
      }, 1500);
    } catch (e) {
      omniLogger.error(LogCategory.SYSTEM, '[OSClimatePanel] Error', { error: e });
      setStatus('idle');
    }
  };

  return (
    <div
      className="w-full liquid-glass rounded-xl border border-slate-700 p-6 shadow-2xl"
      data-uuid={core.uuid}
      data-timestamp={core.timestamp}
      data-5t-protocol="active"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">OS-Climate Data Bridge</h2>
            <div className="flex space-x-2 text-xs">
              <span className="text-slate-400 font-mono">PROT: 3+1</span>
              <span className="text-emerald-400 font-mono">STATUS: ONLINE</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleIngest}
          disabled={status !== 'idle'}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 font-semibold transition-all ${status === 'idle'
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
        >
          <FileUp className="w-4 h-4" />
          <span>{status === 'idle' ? 'Ingest Data Commons' : 'Processing...'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Traceable Source */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs uppercase tracking-wider">Source Origin</span>
            <Search className="w-4 h-4 text-slate-500" />
          </div>
          <div className="font-mono text-sm text-blue-300 truncate">
            {result?.protocol?.traceable?.origin ?? '---'}
          </div>
          {result && (
            <div className="mt-2 text-xs text-green-400 flex items-center">
              <ShieldCheck className="w-3 h-3 mr-1" /> Verified PDF Source
            </div>
          )}
        </div>

        {/* 2. ITR Result */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs uppercase tracking-wider">ITR Temp Rise</span>
            <Thermometer className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-white">
            {result?.itr ? `${result.itr.temperatureScore}°C` : '---'}
          </div>
          {result?.itr && (
            <div className="text-xs text-slate-400 mt-1">Target: 1.5°C | {result.itr.pathway}</div>
          )}
        </div>

        {/* 3. Immutable Hash */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs uppercase tracking-wider">Block Hash</span>
            <Lock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="font-mono text-xs text-slate-400 break-all">
            {result?.protocol?.immutable?.hash_lock ?? 'WAITING_FOR_DATA'}
          </div>
          {result && (
            <div className="mt-2 text-xs text-purple-400 flex items-center">
              <Lock className="w-3 h-3 mr-1" /> Ledger Locked
            </div>
          )}
        </div>
      </div>

      {/* Protocol Visualization */}
      {status !== 'idle' && (
        <div className="mt-6">
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-emerald-400 to-purple-500"
              initial={{ width: '0%' }}
              animate={{
                width: status === 'verified' ? '100%' : status === 'calculating' ? '66%' : '33%',
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
            <span
              className={
                status === 'ingesting' || status === 'calculating' || status === 'verified'
                  ? 'text-blue-400'
                  : ''
              }
            >
              INGESTION
            </span>
            <span
              className={
                status === 'calculating' || status === 'verified' ? 'text-emerald-400' : ''
              }
            >
              CALCULATION
            </span>
            <span className={status === 'verified' ? 'text-purple-400' : ''}>IMMUTABLE LOCK</span>
          </div>
        </div>
      )}
    </div>
  );
};
