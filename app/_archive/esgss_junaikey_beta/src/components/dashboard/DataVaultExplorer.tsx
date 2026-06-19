import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Shield, FileText, Activity, Lock, ChevronRight } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  entityType: 'AGENT' | 'USER' | 'SYSTEM';
  entityId: string;
  evidenceType: 'ZKP_COMMITMENT' | 'BLOCKCHAIN_ANCHOR' | 'SWARM_RESULT';
  summary: string;
  hash: string;
  verified: boolean;
}

const DataVaultExplorer: React.FC = () => {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Mock Data based on VaultService schema
  const logs: AuditLog[] = [
    {
      id: 'log_001',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      entityType: 'AGENT',
      entityId: 'Arvo_Planner',
      evidenceType: 'SWARM_RESULT',
      summary: 'Executed strategic planning for "Carbon Reduction 2026"',
      hash: '0x7f83...a2b1',
      verified: true,
    },
    {
      id: 'log_002',
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      entityType: 'SYSTEM',
      entityId: 'ZKP_Service',
      evidenceType: 'ZKP_COMMITMENT',
      summary: 'Committed sensitive supplier emission data (Scope 3)',
      hash: '0xabc1...9988',
      verified: true,
    },
    {
      id: 'log_003',
      timestamp: new Date(Date.now() - 1000 * 30).toISOString(),
      entityType: 'SYSTEM',
      entityId: 'Blockchain_Anchor',
      evidenceType: 'BLOCKCHAIN_ANCHOR',
      summary: 'Anchored Batch #4421 to Polygon Amoy',
      hash: '0x1234...5678',
      verified: true,
    },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
        <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
          <Database className="w-4 h-4" />
          DATA VAULT EXPLORER
        </h3>
        <div className="flex items-center gap-1 text-[10px] bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <Shield className="w-3 h-3" />
          AUDIT TRAIL SECURE
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Timeline List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {logs.map((log, idx) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedLog(log)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedLog?.id === log.id
                  ? 'bg-indigo-600/20 border-indigo-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    log.evidenceType === 'ZKP_COMMITMENT'
                      ? 'bg-purple-500/20 text-purple-300'
                      : log.evidenceType === 'BLOCKCHAIN_ANCHOR'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {log.evidenceType.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-500">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2">{log.summary}</p>
            </motion.div>
          ))}
        </div>

        {/* Detail View */}
        <div className="w-1/2 bg-black/20 rounded-lg p-3 border border-white/5 font-mono text-xs text-slate-400">
          {selectedLog ? (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-600 uppercase">Entity</label>
                <div className="text-white flex items-center gap-2">
                  {selectedLog.entityType === 'AGENT' && <Activity className="w-3 h-3" />}
                  {selectedLog.entityType === 'SYSTEM' && <Lock className="w-3 h-3" />}
                  {selectedLog.entityId}
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-slate-600 uppercase">
                  Cryptographic Hash
                </label>
                <div className="text-emerald-400 break-all">{selectedLog.hash}</div>
              </div>
              <div>
                <label className="block text-[10px] text-slate-600 uppercase">
                  Verification Status
                </label>
                <div className="flex items-center gap-1 text-emerald-400">
                  <Shield className="w-3 h-3" /> Verified Immutable
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <Database className="w-8 h-8 mb-2" />
              <p>Select an event to inspect cryptographic evidence</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataVaultExplorer;
