import React, { useMemo } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import {
  Shield,
  Lock,
  check,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
  Hash,
  Crown,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { IComponentCore } from '../../../0-domain/contracts/IComponentCore';
import { use5TShield } from '../../../5-hooks/use5TShield';
import { auditComponent } from '../../../services/aiProcessor';
import { OmniEsgManager } from '../../../omni/services/OmniEsgManager';
import { SovereignDisclosureSection } from '../collaboration/SovereignDisclosureSection';

const ID_SLICE_LENGTH = 8;

interface IntegrityPassportUIProps {
  data?: IComponentCore;
  theme?: 'dark' | 'light';
  className?: string;
}

export const IntegrityPassportUI: React.FC<IntegrityPassportUIProps> = ({
  data,
  theme = 'dark',
  className = '',
}) => {
  const [internalData, setInternalData] = React.useState<IComponentCore | null>(data || null);
  const [auditResult, setAuditResult] = React.useState<any>(null);
  const [isAuditing, setIsAuditing] = React.useState(false);

  // Auto-fetch if no data
  React.useEffect(() => {
    if (!data) {
      const components = OmniEsgManager.getAllComponents();
      if (components.length > 0) {
        // Find a component with evidence if possible
        const bestComp = components.find(c => c.metadata?.dataModel) || components[0];
        if (bestComp?.metadata?.dataModel) {
          setInternalData(bestComp.metadata.dataModel as any);
        }
      }
    } else {
      setInternalData(data);
    }
  }, [data]);

  const shieldStatus = use5TShield(internalData);
  const isDark = theme === 'dark';

  const handleAiAudit = async () => {
    if (!internalData) return;
    setIsAuditing(true);
    try {
      const result = await auditComponent(internalData);
      setAuditResult(result);
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[IntegrityPassportUI] Audit failed:', { error })
    } finally {
      setIsAuditing(false);
    }
  };

  // Safe Access to evidence items
  const evidenceList = useMemo(() => {
    if (!internalData?.evidence) return [];
    return Object.entries(internalData.evidence).map(([key, value]) => ({
      id: key,
      ...(value as any),
    }));
  }, [internalData]);

  if (!internalData) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl ${
          isDark
            ? 'border-slate-800 bg-slate-950/50 text-slate-400'
            : 'border-gray-300 bg-gray-50 text-gray-500'
        } ${className}`}
      >
        <Lock size={48} className="mb-4 opacity-50" />
        <h2 className="text-xl font-black tracking-widest uppercase mb-2">Integrity Passport</h2>
        <p className="text-sm font-mono">No Data Signal Detected</p>
      </div>
    );
  }

  const statusColor = shieldStatus.isValid
    ? 'text-emerald-500'
    : shieldStatus.tampered
      ? 'text-red-500'
      : 'text-amber-500';
  const statusBg = shieldStatus.isValid
    ? 'bg-emerald-500/10'
    : shieldStatus.tampered
      ? 'bg-red-500/10'
      : 'bg-amber-500/10';
  const statusBorder = shieldStatus.isValid
    ? 'border-emerald-500/20'
    : shieldStatus.tampered
      ? 'border-red-500/20'
      : 'border-amber-500/20';

  return (
    <div
      className={`p-6 rounded-2xl border ${statusBorder} ${statusBg} ${
        isDark ? 'bg-slate-900/90' : 'bg-white'
      } backdrop-blur-xl shadow-2xl overflow-hidden relative ${className}`}
    >
      {/* Background Circuit Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Header Section */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={20} className={statusColor} />
            <h2
              className={`text-lg font-bold tracking-wider ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              INTEGRITY PASSPORT
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono opacity-70">
            <span>ID: {internalData.uuid.slice(0, ID_SLICE_LENGTH)}...</span>
            <span>•</span>
            <span>v{internalData.version || '1.0.0'}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBorder} ${statusColor}`}
          >
            {internalData.status.toUpperCase()}
          </div>
          {(internalData as any).sovereignSeal && (
            <div
              className={`px-3 py-1 rounded-full text-[9px] font-black bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-1 shadow-sm`}
            >
              <Crown size={10} /> SOVEREIGN_SEAL
            </div>
          )}
        </div>
      </div>

      {/* 5T Pillars Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
        <PillarCard
          icon={<Activity size={16} />}
          label="Traceable"
          active={shieldStatus.dimensions.traceable}
          isDark={isDark}
        />
        <PillarCard
          icon={<Layers size={16} />}
          label="Trackable"
          active={shieldStatus.dimensions.trackable}
          isDark={isDark}
        />
        <PillarCard
          icon={<FileText size={16} />}
          label="Transparent"
          active={shieldStatus.dimensions.transparent}
          isDark={isDark}
        />
        <PillarCard
          icon={<Hash size={16} />}
          label="Tangible"
          active={shieldStatus.dimensions.tangible}
          isDark={isDark}
        />
      </div>

      {/* Trust Score */}
      <div className="mb-6 relative z-10">
        <div className="flex justify-between items-end mb-2">
          <span
            className={`text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-gray-500'}`}
          >
            Trust Score
          </span>
          <span className={`text-2xl font-black ${statusColor}`}>
            {Math.round(shieldStatus.score)}%
          </span>
        </div>
        <div
          className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${shieldStatus.score}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full ${shieldStatus.isValid ? 'bg-emerald-500' : 'bg-amber-500'}`}
          />
        </div>
      </div>

      {/* Evidence Log */}
      <div className="relative z-10">
        <h3
          className={`text-xs font-bold uppercase mb-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}
        >
          Evidence Chain
        </h3>
        <div className={`space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar`}>
          {evidenceList.length > 0 ? (
            evidenceList.map(item => (
              <div
                key={item.id}
                className={`p-2 rounded text-xs border ${
                  isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between mb-1">
                  <span className="font-bold opacity-80">{item.id}</span>
                  <span className="font-mono opacity-50">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="opacity-70 truncate px-1 border-l-2 border-emerald-500/50">
                  Origin: {item.sourceOrigin}
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs opacity-50 text-center py-4 italic">
              No evidence records found in this block.
            </div>
          )}
        </div>
      </div>

      {/* AI Audit Report Section */}
      {auditResult && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`mt-6 p-4 rounded-xl border ${isDark ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Activity size={16} className="text-indigo-500" />
            <h4
              className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}
            >
              Sentient Audit Report
            </h4>
            <div
              className={`ml-auto px-2 py-0.5 rounded text-[10px] font-bold ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-500 text-white'}`}
            >
              Score: {auditResult.overallScore}%
            </div>
          </div>

          <p
            className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
          >
            {auditResult.critique}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold opacity-50 uppercase block mb-1">
                Vulnerabilities
              </span>
              <ul className="space-y-1">
                {auditResult.vulnerabilities.map((v: string, i: number) => (
                  <li key={i} className="text-[10px] flex items-start gap-1 text-red-400">
                    <span className="mt-0.5">•</span> {v}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-[10px] font-bold opacity-50 uppercase block mb-1">
                Recommendations
              </span>
              <ul className="space-y-1">
                {auditResult.recommendations.map((r: string, i: number) => (
                  <li key={i} className="text-[10px] flex items-start gap-1 text-emerald-400">
                    <span className="mt-0.5">→</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sovereign Disclosure Section (Tier 5 Alignment) */}
      <SovereignDisclosureSection
        jurisdiction={internalData.data?.jurisdiction || 'Taiwan (Global)'}
        residency={internalData.data?.residency || 'Sovereign Node Alpha'}
        isDark={isDark}
      />

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-white/5 flex gap-2 relative z-10">
        <button
          onClick={handleAiAudit}
          disabled={isAuditing}
          className={`flex-1 group relative flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all overflow-hidden ${
            isAuditing
              ? 'bg-slate-800 text-slate-500 italic'
              : 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950'
          }`}
        >
          {isAuditing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Activity size={16} />
              </motion.div>
              Auditing...
            </>
          ) : (
            <>
              <Layers size={16} className="group-hover:rotate-12 transition-transform" />
              Initiate AI Integrity Audit
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const PillarCard = ({
  icon,
  label,
  active,
  isDark,
}: {
  icon: any;
  label: string;
  active: boolean;
  isDark: boolean;
}) => (
  <div
    className={`flex items-center gap-2 p-2 rounded border ${
      active
        ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500'
        : isDark
          ? 'border-slate-800 text-slate-600'
          : 'border-gray-200 text-gray-400'
    }`}
  >
    <div className={active ? 'opacity-100' : 'opacity-50'}>{icon}</div>
    <span className="text-xs font-bold">{label}</span>
  </div>
);

export default IntegrityPassportUI;
