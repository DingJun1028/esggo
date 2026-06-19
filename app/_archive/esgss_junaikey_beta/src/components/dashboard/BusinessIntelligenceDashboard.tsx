import React, { useState } from 'react';
import { omniLogger } from '@/omni/infrastructure/logging/OmniLogger';

import {
  Search,
  ShieldAlert,
  TrendingUp,
  Building2,
  FileText,
  AlertTriangle,
  CheckCircle,
  Bookmark,
  PlusCircle,
  Star,
} from 'lucide-react';
import { businessIntelligenceService, CompanyReport } from '@/services/BusinessIntelligenceService';
import { motion, AnimatePresence } from 'framer-motion';
import { omniLogger, LogCategory } from '@/services/omniLogger';
import { useFavorites } from '@/hooks/useFavorites';

export const BusinessIntelligenceDashboard: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanningPhase, setScanningPhase] = useState<string | null>(null);
  const [report, setReport] = useState<CompanyReport | null>(null);

  const { toggleFavorite, isFavorite } = useFavorites();
  const isReportFavorite = report ? isFavorite(report.taxId as any) : false;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setReport(null);
    setScanningPhase('Initializing Quantum Probe...');

    try {
      // Simulated scanning phases
      await new Promise(r => setTimeout(r, 800));
      setScanningPhase('Accessing Deep Web Nodes...');
      await new Promise(r => setTimeout(r, 800));
      setScanningPhase('Analyzing 5T Integrity...');
      await new Promise(r => setTimeout(r, 1000));
      setScanningPhase('Synthesizing Risk Matrix...');
      await new Promise(r => setTimeout(r, 600));

      const result = await businessIntelligenceService.analyzeCompany(query);
      setReport(result);
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[BusinessIntelligenceDashboard] Error', { error });
    } finally {
      setLoading(false);
      setScanningPhase(null);
    }
  };

  return (
    <div className="p-8 h-full bg-slate-950 text-slate-200 overflow-y-auto custom-scrollbar">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
          Business Intelligence & ESG Risk Radar
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Deep-dive investigations into corporate entities. Uncover financial health, ESG
          performance, and hidden scandal risks using the 5T Sentinel Protocol.
        </p>
      </header>

      {/* Search Section */}
      <div className="max-w-3xl mx-auto mb-16">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-50 transition-opacity" />
          <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-full p-2 shadow-2xl">
            <Search className="ml-4 w-6 h-6 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter Company Name, Tax ID, or Website URL..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 text-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {loading && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20"
                  animate={{ left: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
              )}
              {loading ? 'Quantum Scanning...' : 'Analyze'}
            </button>
          </div>
          {scanningPhase && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-4 text-cyan-400 font-mono text-sm animate-pulse"
            >
              {scanningPhase}
            </motion.p>
          )}
        </form>
      </div>

      {/* Report Display */}
      <AnimatePresence>
        {report && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            {/* Company Header */}
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-8 h-8 text-blue-400" />
                  <h2 className="text-3xl font-bold text-white">{report.name}</h2>
                </div>
                <div className="flex gap-4 text-sm text-slate-400 font-mono">
                  <span>Tax ID: {report.taxId}</span>
                  <span>|</span>
                  <span>{report.industry}</span>
                  <span>|</span>
                  <a
                    href={`https://${report.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {report.website}
                  </a>
                </div>
              </div>
              <div className="flex gap-6 text-center">
                {/* Action Buttons */}
                <div className="flex flex-col gap-2 justify-center">
                  <button
                    onClick={() => {
                      toggleFavorite(report.taxId as any);
                      omniLogger.info(
                        LogCategory.USER_ACTION,
                        `${isReportFavorite ? 'Removed' : 'Added'} ${report.name} to Favorites`
                      );
                    }}
                    className={`p-3 rounded-xl transition-all ${isReportFavorite ? 'bg-yellow-500/20 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'}`}
                    title={isReportFavorite ? 'Remove from Favorites' : 'Save to Favorites'}
                  >
                    <Bookmark className={`w-5 h-5 ${isReportFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() =>
                      omniLogger.info(
                        LogCategory.USER_ACTION,
                        `Added ${report.name} report to OmniNote`
                      )
                    }
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl transition-colors"
                    title="Add to OmniNote"
                  >
                    <PlusCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 bg-slate-800 rounded-xl min-w-[120px]">
                  <div className="text-xs text-slate-400 mb-1">Overview Score</div>
                  <div
                    className={`text-3xl font-bold ${report.esg.overallScore >= 80 ? 'text-emerald-400' : report.esg.overallScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}
                  >
                    {report.esg.overallScore} / 100
                  </div>
                </div>
                <div className="p-4 bg-slate-800 rounded-xl min-w-[120px]">
                  <div className="text-xs text-slate-400 mb-1">News Sentiment</div>
                  <div
                    className={`text-3xl font-bold ${report.newsSentiment >= 70 ? 'text-blue-400' : 'text-slate-200'}`}
                  >
                    {report.newsSentiment}%
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Financials */}
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Financial Health
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-slate-400">Annual Revenue</span>
                    <span className="text-white font-mono">{report.financials.revenue}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-slate-400">YoY Growth</span>
                    <span
                      className={`${report.financials.growth.startsWith('+') ? 'text-emerald-400' : 'text-red-400'} font-mono`}
                    >
                      {report.financials.growth}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-slate-400">Profit Margin</span>
                    <span className="text-white font-mono">{report.financials.profitMargin}</span>
                  </div>
                </div>
              </div>

              {/* ESG Performance */}
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                  <FileText className="w-5 h-5 text-blue-400" />
                  ESG Disclosure
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Environment</span>
                      <span>{report.esg.environmentScore}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${report.esg.environmentScore}%` }}
                        className="h-full bg-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Social</span>
                      <span>{report.esg.socialScore}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${report.esg.socialScore}%` }}
                        className="h-full bg-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Governance</span>
                      <span>{report.esg.governanceScore}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${report.esg.governanceScore}%` }}
                        className="h-full bg-purple-500"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {report.esg.commitments.map((c: string) => (
                      <span
                        key={c}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30 flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" /> {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Risk Radar & Scandal Timeline */}
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 relative overflow-hidden lg:col-span-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl rounded-full" />
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  Risk Radar
                </h3>

                <div className="space-y-6">
                  {report.risks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-emerald-400">
                      <CheckCircle className="w-12 h-12 mb-2 opacity-50" />
                      <p>No critical risks detected</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                      {/* Scandal Timeline Visualization */}
                      <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-800">
                        {report.risks.map((risk: any, idx: number) => (
                          <div key={risk.id} className="relative">
                            <div
                              className={`absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 border-slate-900 ${risk.severity === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`}
                            />
                            <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4 hover:border-red-500/30 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${risk.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}
                                >
                                  {risk.severity}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {risk.date}
                                </span>
                              </div>
                              <h4 className="text-white font-bold text-sm mb-1">{risk.title}</h4>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                {risk.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quantum Depth Section (Placeholder for future expansion) */}
            <div className="bg-gradient-to-br from-blue-600/5 to-cyan-600/5 border border-white/5 rounded-3xl p-12 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Deep Intelligence Scanning</h3>
              <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                Analyzing multi-dimensional datasets to uncover hidden patterns. Our AI monitors
                global supply chains, legal filings, and real-time sentiment to provide a
                Sovereign-grade view of corporate character.
              </p>
              <div className="flex justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                {/* Grid of scanning indicators */}
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
                    <span className="text-[10px] font-mono text-cyan-500">Node {i}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
