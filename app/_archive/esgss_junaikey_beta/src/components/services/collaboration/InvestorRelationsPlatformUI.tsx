import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Users,
  FileCheck,
  DollarSign,
  PieChart,
  ExternalLink,
  ChevronRight,
  Target,
  ShieldCheck,
  RefreshCw,
  MessageSquare,
  Activity,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  investorRelationsManager,
  Investor,
  DisclosureRequest,
  EsgAlphaRecord,
} from '../../../services/InvestorRelationsManager';

export const InvestorRelationsPlatformUI: React.FC<{ language: any; theme: string }> = ({
  language,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [investors] = useState<Investor[]>(() => investorRelationsManager.getInvestors());
  const [requests, setRequests] = useState<DisclosureRequest[]>(() =>
    investorRelationsManager.getDisclosureRequests()
  );
  const [alphaLedger] = useState<EsgAlphaRecord[]>(() => investorRelationsManager.getAlphaLedger());
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      averageSentiment: investorRelationsManager.calculateOverallSentiment(),
      totalAlpha: investorRelationsManager.calculateTotalAlpha(),
      pendingRequests: requests.filter(r => r.status !== 'SUBMITTED').length,
    }),
    [requests]
  );

  const handleSubmit = async (id: string) => {
    const response = await investorRelationsManager.submitDisclosure(id);
    if (response.success) {
      setRequests(investorRelationsManager.getDisclosureRequests());
    } else {
      alert(`Submission Error: ${response.error}`);
    }
  };

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${isDark ? 'text-white' : 'text-slate-900'}`}
    >
      {/* Top Value Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={<Activity size={20} />}
          label="Stakeholder Sentiment"
          value={`${stats.averageSentiment}%`}
          subValue="Institutional Trust Score"
          color="text-emerald-400"
          isDark={isDark}
        />
        <MetricCard
          icon={<DollarSign size={20} />}
          label="Total ESG Alpha"
          value={`$${(stats.totalAlpha / 1000).toFixed(1)}K`}
          subValue="Net Sustainability ROI"
          color="text-indigo-400"
          isDark={isDark}
        />
        <MetricCard
          icon={<FileCheck size={20} />}
          label="Disclosure Status"
          value={stats.pendingRequests.toString()}
          subValue="Active Pipeline Tasks"
          color="text-amber-400"
          isDark={isDark}
        />
        <MetricCard
          icon={<Users size={20} />}
          label="Asset Under Mgmt"
          value="$90M"
          subValue="Linked Institutional Capital"
          color="text-cyan-400"
          isDark={isDark}
        />
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left: Investor Registry & Alpha Ledger */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* Investor List */}
          <section
            className={`flex-1 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} p-4 flex flex-col overflow-hidden`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest opacity-60">
                Strategic Investors
              </h3>
              <Users size={16} className="opacity-30" />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {investors.map(investor => (
                <div
                  key={investor.id}
                  className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-xs font-bold">{investor.name}</div>
                      <div className="text-[10px] opacity-50 font-mono">{investor.type}</div>
                    </div>
                    <div
                      className={`text-xs font-black ${investor.sentiment > 80 ? 'text-emerald-400' : 'text-amber-400'}`}
                    >
                      {investor.sentiment}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500"
                        style={{ width: `${investor.sentiment}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-mono opacity-30">TRUST</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Alpha Ledger */}
          <section
            className={`h-48 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} p-4 flex flex-col`}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-black uppercase tracking-widest opacity-60">
                ESG Alpha Ledger
              </h3>
              <TrendingUp size={16} className="text-indigo-400" />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <table className="w-full text-[10px] font-mono">
                <thead className="opacity-40">
                  <tr>
                    <th className="text-left py-1">INITIATIVE</th>
                    <th className="text-right py-1">ALPHA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {alphaLedger.map((rec, i) => (
                    <tr key={i} className="group hover:bg-white/5 transition-colors">
                      <td className="py-2 opacity-70">{rec.initiative}</td>
                      <td className="py-2 text-right text-emerald-400">
                        +${(rec.totalAlpha / 1000).toFixed(0)}K
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right: Disclosure Pipeline */}
        <div
          className={`flex-[1.2] rounded-2xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} p-5 flex flex-col overflow-hidden`}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}
              >
                <FileCheck size={20} />
              </div>
              <h3 className="text-lg font-bold">Disclosure Engine</h3>
            </div>
            <RefreshCw
              size={18}
              className="opacity-30 cursor-pointer hover:rotate-180 transition-transform duration-500"
            />
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {requests.map(req => (
              <div
                key={req.id}
                onClick={() => setSelectedRequestId(req.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedRequestId === req.id
                    ? isDark
                      ? 'bg-indigo-500/10 border-indigo-500/30'
                      : 'bg-indigo-50 border-indigo-200'
                    : isDark
                      ? 'bg-slate-950 border-white/5 hover:border-white/10'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest">
                      {req.standard} Disclosure
                    </div>
                    <div className="text-[10px] opacity-50">Requestor: {req.requestor}</div>
                  </div>
                  <div
                    className={`px-2 py-0.5 rounded text-[9px] font-black ${
                      req.status === 'SUBMITTED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {req.status}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="opacity-50">COMPLETION</span>
                    <span>{req.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${req.progress}%` }}
                      className={`h-full ${req.status === 'SUBMITTED' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {selectedRequestId === req.id && req.status !== 'SUBMITTED' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleSubmit(req.id);
                        }}
                        className="w-full mt-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-black transition-all flex items-center justify-center gap-2"
                      >
                        <ShieldCheck size={14} /> Finalize 5T Submission
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div
            className={`mt-6 p-4 rounded-xl border ${isDark ? 'bg-slate-950/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}
          >
            <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">
              <Target size={12} /> Live Compliance Guard
            </div>
            <p className="text-[10px] opacity-50 leading-relaxed">
              All disclosures are automatically cross-referenced with the **Evidence Vault** to
              ensure 100% data integrity before external release.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value, subValue, color, isDark }: any) => (
  <div
    className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} shadow-xl`}
  >
    <div className={`flex items-center gap-2 mb-2 ${color}`}>
      {icon}
      <span className="text-[10px] font-black uppercase tracking-wider opacity-60">{label}</span>
    </div>
    <div className="text-2xl font-black mb-1">{value}</div>
    <div className="text-[9px] font-mono opacity-40">{subValue}</div>
  </div>
);

export default InvestorRelationsPlatformUI;
