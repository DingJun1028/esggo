import React, { useState, useEffect } from 'react';
import {
  Shield,
  Fingerprint,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Database,
  GitBranch,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GenesisGateStatus,
  GENESIS_CRITERIA,
  GOVERNANCE_PROTOCOLS,
} from '../../../core/genesis/LogicGates';
import { useTheme } from '@/contexts/ThemeContext';

interface GateProps {
  id: string;
  label: string;
  status: 'LOCKED' | 'OPEN' | 'FAIL';
  icon: React.ElementType;
  details: string;
  delay?: number;
}

const GateNode: React.FC<GateProps> = ({ id, label, status, icon: Icon, details, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`relative p-4 rounded-xl border flex items-center gap-4 group overflow-hidden ${
        status === 'OPEN'
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : status === 'FAIL'
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-white/5 border-white/10 opacity-60'
      }`}
    >
      <div
        className={`p-3 rounded-full ${
          status === 'OPEN'
            ? 'bg-emerald-500/20 text-emerald-400'
            : status === 'FAIL'
              ? 'bg-red-500/20 text-red-400'
              : 'bg-gray-700/50 text-gray-500'
        }`}
      >
        <Icon size={20} />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4
            className={`font-bold font-mono text-sm ${
              status === 'OPEN'
                ? 'text-emerald-400'
                : status === 'FAIL'
                  ? 'text-red-400'
                  : 'text-gray-400'
            }`}
          >
            GATE_{id} // {label}
          </h4>
          {status === 'OPEN' ? (
            <Unlock size={14} className="text-emerald-500" />
          ) : (
            <Lock size={14} className="text-gray-500" />
          )}
        </div>
        <p className="text-xs text-gray-500">{details}</p>
      </div>

      {/* Connection Line */}
      <div
        className={`absolute left-8 bottom-0 w-0.5 h-full -z-10 bg-white/5 group-last:hidden translate-y-full`}
      />
    </motion.div>
  );
};

export const ProofLogicGate: React.FC = () => {
  const { style } = useTheme();
  const [verificationStatus, setVerificationStatus] = useState<'IDLE' | 'VERIFYING' | 'COMPLETE'>(
    'IDLE'
  );

  // Simulate Logic Gate State
  const [gates, setGates] = useState([
    {
      id: '01',
      label: 'INTEGRITY_CHECK',
      status: 'LOCKED',
      icon: Fingerprint,
      details: `Req: Score > ${GENESIS_CRITERIA.MIN_INTEGRITY_SCORE}%`,
    },
    {
      id: '02',
      label: 'PROTOCOL_COMPLIANCE',
      status: 'LOCKED',
      icon: Shield,
      details: 'Governance Tags Valid',
    },
    {
      id: '03',
      label: 'ENTROPY_STABILITY',
      status: 'LOCKED',
      icon: Database,
      details: `Threshold < ${GENESIS_CRITERIA.ENTROPY_THRESHOLD_MAX}%`,
    },
    {
      id: '04',
      label: 'GENESIS_EVOLUTION',
      status: 'LOCKED',
      icon: GitBranch,
      details: 'Core Modules Active',
    },
  ]);

  const runVerification = () => {
    setVerificationStatus('VERIFYING');

    // Sequence the gates opening
    const sequence = [
      { idx: 0, status: 'OPEN' as const },
      { idx: 1, status: 'OPEN' as const },
      { idx: 2, status: 'OPEN' as const }, // Simulate success
      { idx: 3, status: 'OPEN' as const },
    ];

    sequence.forEach((step, i) => {
      setTimeout(
        () => {
          setGates(prev =>
            prev.map((g, idx) => (idx === step.idx ? { ...g, status: step.status } : g))
          );
          if (i === sequence.length - 1) setVerificationStatus('COMPLETE');
        },
        (i + 1) * 800
      );
    });
  };

  return (
    <div
      className={`rounded-2xl border p-6 ${style === 'glass' ? 'bg-black/40 border-white/10 backdrop-blur-xl' : 'bg-slate-900 border-white/5'}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle className="text-cyan-400" size={20} />
            Proof Logic Gate // Evidence Library
          </h3>
          <p className="text-xs text-gray-400 font-mono mt-1">VERIFICATION_PROTOCOL: v6.0.2</p>
        </div>
        <button
          onClick={runVerification}
          disabled={verificationStatus === 'VERIFYING' || verificationStatus === 'COMPLETE'}
          className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
            verificationStatus === 'COMPLETE'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
              : verificationStatus === 'VERIFYING'
                ? 'bg-cyan-500/20 text-cyan-400 animate-pulse border border-cyan-500/50'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
          }`}
        >
          {verificationStatus === 'IDLE'
            ? 'INITIATE_PROOF_SEQUENCE'
            : verificationStatus === 'VERIFYING'
              ? 'VERIFYING...'
              : 'PROOF_VERIFIED'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visualizer */}
        <div className="relative space-y-4 before:absolute before:left-[34px] before:top-8 before:bottom-8 before:w-0.5 before:bg-white/10 before:-z-10">
          {gates.map((gate, i) => (
            <GateNode key={gate.id} {...gate} status={gate.status as any} delay={i * 0.1} />
          ))}
        </div>

        {/* Evidence Artifacts (Simulated Evidence Library) */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Database size={12} /> Encrypted Evidence Artifacts
          </h4>

          <div className="space-y-2">
            {[
              {
                id: 'EV-001',
                name: 'Carbon_Credit_Audit_Q3.pdf',
                hash: '0x7f...3a29',
                type: 'AUDIT',
                verified: true,
              },
              {
                id: 'EV-002',
                name: 'Supply_Chain_Map_v2.json',
                hash: '0x9b...1c4d',
                type: 'TRACE',
                verified: true,
              },
              {
                id: 'EV-003',
                name: 'Board_Resolution_2024.sig',
                hash: '0x1a...9e8f',
                type: 'GOV',
                verified: verificationStatus === 'COMPLETE',
              },
            ].map((item, i) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-cyan-400 transition-colors">
                    <Database size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">
                      {item.name}
                    </div>
                    <div className="text-[9px] font-mono text-gray-600">{item.hash}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">
                    {item.type}
                  </span>
                  {item.verified ? (
                    <Shield size={14} className="text-emerald-500" />
                  ) : (
                    <AlertTriangle size={14} className="text-amber-500 animate-pulse" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {verificationStatus === 'COMPLETE' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 bg-emerald-900/20 border border-emerald-500/20 rounded-lg text-center"
            >
              <p className="text-[10px] text-emerald-400 font-mono">
                ALL ARTIFACTS CRYPTOGRAPHICALLY VERIFIED
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
