import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  Globe,
  Activity,
  Search,
  RefreshCw,
  Scale,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { governanceManager, ComplianceRisk } from '../../../services/GovernanceManager';
import { OmniNexus } from '../../../services/OmniNexus';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

export const ComplianceRiskMonitoringUI: React.FC<{ language: any; theme: string }> = ({
  language,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [risks, setRisks] = useState<ComplianceRisk[]>(() =>
    governanceManager.getComplianceRisks()
  );
  const [isAuditingAll, setIsAuditingAll] = useState(false);

  /* --- Real-Time Nexus Integration --- */
  const AUDIT_DELAY_MS = 2000;

  const handleAuditAll = async () => {
    setIsAuditingAll(true);
    await new Promise(r => setTimeout(r, AUDIT_DELAY_MS));
    setRisks(governanceManager.getComplianceRisks());
    setIsAuditingAll(false);

    // Broadcast Live Audit Event
    OmniNexus.emit({
      id: `audit-${Date.now()}`,
      source: 'governance',
      priority: 'high',
      message: 'Live System Audit Triggered',
      timestamp: Date.now(),
    });
  };

  React.useEffect(() => {
    // Audit on mount
    handleAuditAll();

    // Subscribe to Nexus events (Risk Signals)
    const unsubscribe = OmniNexus.subscribe('RISK_SIGNAL', (payload: any) => {
      omniLogger.info(LogCategory.GOVERNANCE, `🛡️ Risk Signal Received: ${payload.message}`, {
        payload,
      });

      // Dynamic Risk Update Simulation
      setRisks(prev =>
        prev.map(r => {
          if (r.id === payload.metadata?.riskId) {
            return { ...r, alignment: payload.metadata.newAlignment, lastAudit: 'Just Now' };
          }
          return r;
        })
      );
    });

    return () => unsubscribe();
  }, []);

  const ALIGNMENT_THRESHOLD_HIGH = 90;
  const ALIGNMENT_THRESHOLD_MEDIUM = 75;

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${isDark ? 'text-white' : 'text-slate-900'}`}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'} border border-red-500/30`}
          >
            <Scale size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Compliance Risk Matrix</h2>
            <div className="text-[10px] font-mono opacity-50 uppercase tracking-widest">
              Global Regulatory Alignment Monitor
            </div>
          </div>
        </div>
        <button
          onClick={handleAuditAll}
          disabled={isAuditingAll}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
            isAuditingAll
              ? 'bg-slate-800 text-slate-500'
              : 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
          }`}
        >
          {isAuditingAll ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <ShieldCheck size={14} />
          )}
          Full System Audit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Left: Risk Feed */}
        <div
          className={`lg:col-span-2 flex flex-col rounded-2xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} p-4 overflow-hidden`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest opacity-60">
              Regional Risk Inventory
            </h3>
            <Globe size={16} className="opacity-30" />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 border-t border-white/5 pt-4">
            {risks.map(risk => (
              <div
                key={risk.id}
                className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950 border-white/5 hover:border-white/10' : 'bg-slate-50 border-slate-100 hover:border-slate-200'} transition-all group`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-xs font-bold">
                      {risk.region} - {risk.regulation}
                    </div>
                    <div className="text-[10px] opacity-40 font-mono mt-0.5">{risk.id}</div>
                  </div>
                  <div
                    className={`px-2 py-0.5 rounded text-[9px] font-black ${
                      risk.riskLevel === 'LOW'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : risk.riskLevel === 'HIGH'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {risk.riskLevel} RISK
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-[10px] font-mono opacity-50 uppercase tracking-tighter">
                      <span>Compliance Alignment</span>
                      <span>{risk.alignment}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${risk.alignment}%` }}
                        className={`h-full ${risk.alignment > ALIGNMENT_THRESHOLD_HIGH ? 'bg-emerald-500' : risk.alignment > ALIGNMENT_THRESHOLD_MEDIUM ? 'bg-amber-500' : 'bg-red-500'}`}
                      />
                    </div>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <div className="text-[9px] font-mono opacity-30 uppercase">Last Audit</div>
                    <div className="text-xs font-bold">{risk.lastAudit}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Insight Panel */}
        <div className="flex flex-col gap-6 overflow-hidden">
          <section
            className={`rounded-2xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} p-5`}
          >
            <div className="flex items-center gap-2 mb-4 text-red-400">
              <AlertTriangle size={18} />
              <h3 className="text-xs font-black uppercase tracking-widest">Urgent Watchlist</h3>
            </div>
            <p className="text-xs opacity-60 leading-relaxed mb-4">
              The **SEC Climate Disclosure** alignment dropped by 3% following the Tier-2 supply
              chain update. Immediate verification required.
            </p>
            <button
              className={`w-full py-2.5 rounded-xl border ${isDark ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-red-300 text-red-600 hover:bg-red-50'} text-[10px] font-black uppercase tracking-widest transition-all`}
            >
              Deploy Compliance Agent
            </button>
          </section>

          <section
            className={`flex-1 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} p-5 flex flex-col`}
          >
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <ShieldCheck size={18} />
              <h3 className="text-xs font-black uppercase tracking-widest">Guard Status</h3>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <StatLine label="Identity Verification" status="Verified" isDark={isDark} />
                <StatLine label="Tamper Detection" status="Active" isDark={isDark} />
                <StatLine label="Cross-Border Bridge" status="Stable" isDark={isDark} />
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 leading-relaxed">
                &quot;System and regulatory alignment is within safe operational parameters.&quot;
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const StatLine = ({ label, status, isDark }: any) => (
  <div className="flex justify-between items-center text-xs">
    <span className="opacity-50">{label}</span>
    <span
      className={`font-black uppercase tracking-widest text-[10px] ${status === 'Active' || status === 'Verified' || status === 'Stable' ? 'text-emerald-400' : 'text-amber-400'}`}
    >
      {status}
    </span>
  </div>
);

export default ComplianceRiskMonitoringUI;
