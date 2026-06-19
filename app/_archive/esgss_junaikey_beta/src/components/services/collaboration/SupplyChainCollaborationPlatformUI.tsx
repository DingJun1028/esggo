import React, { useState, useEffect, useMemo } from 'react';
import {
  Truck,
  Globe,
  Activity,
  ShieldCheck,
  AlertCircle,
  RefreshCcw,
  ExternalLink,
  Search,
  Filter,
  BarChart3,
  Link2,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supplyChainManager, Supplier } from '../../../services/SupplyChainManager';
import { IntegrityPassportUI } from '../governance/IntegrityPassportUI';

const SYNC_DELAY = 2000;
const LOW_INTEGRITY_THRESHOLD = 80;

export const SupplyChainCollaborationPlatformUI: React.FC<{ language: any; theme: string }> = ({
  language,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => supplyChainManager.getSuppliers());
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [isSyncingGlobal, setIsSyncingGlobal] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Update on refresh only if needed, otherwise lazy init is enough for start
  useEffect(() => {
    // Keep internal state in sync with manager if needed
  }, []);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(
      s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [suppliers, searchQuery]);

  const stats = useMemo(() => {
    const scope3 = supplyChainManager.calculateScope3Emissions();
    const atRisk = supplyChainManager.getAtRiskPartners().length;
    return {
      totalEmissions: scope3.total,
      atRiskCount: atRisk,
      complianceRate: Math.round(((suppliers.length - atRisk) / (suppliers.length || 1)) * 100),
    };
  }, [suppliers]);

  const handleGlobalSync = async () => {
    setIsSyncingGlobal(true);
    // Simulate multi-bridge sync
    await new Promise(resolve => setTimeout(resolve, SYNC_DELAY));
    setSuppliers(supplyChainManager.getSuppliers());
    setIsSyncingGlobal(false);
  };

  const handleSupplierSync = async (id: string) => {
    await supplyChainManager.syncPartnerData(id);
    setSuppliers(supplyChainManager.getSuppliers());
  };

  const handleDiscover = async (category: string) => {
    setIsDiscovering(true);
    setShowDiscoveryModal(false);
    try {
      const discovered = await supplyChainManager.discoverSuppliers(category);
      if (discovered.length > 0) {
        supplyChainManager.addSuppliers(discovered);
        setSuppliers(supplyChainManager.getSuppliers());
      }
    } finally {
      setIsDiscovering(false);
    }
  };

  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId);

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${isDark ? 'text-white' : 'text-slate-900'}`}
    >
      {/* Top Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={<BarChart3 size={20} />}
          label="Scope 3 Total Intensity"
          value={`${stats.totalEmissions} tCO2e`}
          subValue="Integrated Supply Chain"
          color="text-indigo-400"
          isDark={isDark}
        />
        <StatCard
          icon={<AlertCircle size={20} />}
          label="At-Risk Partners"
          value={stats.atRiskCount.toString()}
          subValue="Failing 5T Audits"
          color="text-amber-400"
          isDark={isDark}
        />
        <StatCard
          icon={<ShieldCheck size={20} />}
          label="Sovereign Compliance"
          value={`${stats.complianceRate}%`}
          subValue="Verified Evidence Chain"
          color="text-emerald-400"
          isDark={isDark}
        />
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left Panel: Supplier List */}
        <div
          className={`flex-[1.5] flex flex-col rounded-2xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} p-4 overflow-hidden`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest opacity-70">
              Unity Bridge Registry
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDiscoveryModal(true)}
                disabled={isDiscovering}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  isDiscovering
                    ? 'opacity-50 cursor-not-allowed'
                    : isDark
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                      : 'bg-amber-100 text-amber-600 border border-amber-200 hover:bg-amber-200'
                }`}
              >
                <Sparkles size={12} className={isDiscovering ? 'animate-pulse' : ''} />
                {isDiscovering ? 'Discovering...' : 'Discover Partners'}
              </button>
              <button
                onClick={handleGlobalSync}
                disabled={isSyncingGlobal}
                className={`p-2 rounded-lg transition-all ${isSyncingGlobal ? 'animate-spin opacity-50' : 'hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'}`}
              >
                <RefreshCcw size={18} />
              </button>
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
            <input
              type="text"
              placeholder="Search Partners..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-mono outline-none border transition-all ${
                isDark
                  ? 'bg-slate-950 border-white/5 focus:border-indigo-500/50'
                  : 'bg-slate-50 border-slate-200 focus:border-indigo-400'
              }`}
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
            {filteredSuppliers.map(supplier => (
              <SupplierListItem
                key={supplier.id}
                supplier={supplier}
                selected={selectedSupplierId === supplier.id}
                onClick={() => setSelectedSupplierId(supplier.id)}
                isDark={isDark}
              />
            ))}
          </div>
        </div>

        {/* Right Panel: Deep Dive / Passport */}
        <div className="flex-[2] flex flex-col gap-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedSupplier ? (
              <motion.div
                key={selectedSupplier.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col overflow-hidden"
              >
                <div
                  className={`p-4 rounded-2xl border mb-4 ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-xl ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}
                      >
                        <Truck size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{selectedSupplier.name}</h2>
                        <div className="flex items-center gap-2 text-xs opacity-50 font-mono">
                          <Globe size={12} /> {selectedSupplier.location} • Tier{' '}
                          {selectedSupplier.tier} • {selectedSupplier.category}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSupplierSync(selectedSupplier.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-all ${isDark ? 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10' : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'}`}
                      >
                        <RefreshCcw size={14} /> Bridge Sync
                      </button>
                      <button
                        className={`p-2 rounded-lg border transition-all ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'}`}
                      >
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <span className="text-[10px] font-bold opacity-50 uppercase block mb-1">
                        Integrity Score
                      </span>
                      <div className="text-xl font-black text-emerald-400">
                        {selectedSupplier.integrityScore}%
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <span className="text-[10px] font-bold opacity-50 uppercase block mb-1">
                        Carbon Intensity
                      </span>
                      <div className="text-xl font-black text-indigo-400">
                        {selectedSupplier.carbonIntensity}{' '}
                        <span className="text-[10px] font-normal opacity-50">tCO2e</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {/* Reuse IntegrityPassportUI for the supplier's actual data model */}
                  <IntegrityPassportUI
                    data={selectedSupplier.dataModel}
                    className="shadow-none border-none bg-transparent"
                    theme={isDark ? 'dark' : 'light'}
                  />
                </div>
              </motion.div>
            ) : (
              <div
                className={`h-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl ${isDark ? 'border-white/5 bg-slate-950/30 text-slate-500' : 'border-slate-200 bg-slate-50 text-slate-400'}`}
              >
                <Link2 size={48} className="mb-4 opacity-30" />
                <p className="text-sm font-mono uppercase tracking-widest">
                  Select a partner to bridge data
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Discovery Modal */}
      <AnimatePresence>
        {showDiscoveryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDiscoveryModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden ${
                isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'
              } p-6`}
            >
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="text-amber-400" size={24} />
                AI Partner Discovery
              </h3>
              <p className="text-sm opacity-60 mb-6 font-mono uppercase tracking-widest text-[10px]">
                Bridge the gap with Sentient Supply Chain Intelligence
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {['Logistics', 'Manufacturing', 'Energy', 'Software'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleDiscover(cat)}
                    className={`p-4 rounded-2xl border text-sm font-bold transition-all hover:scale-[1.02] ${
                      isDark
                        ? 'bg-slate-950 border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/10'
                        : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowDiscoveryModal(false)}
                className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-all`}
              >
                Cancel Ritual
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ icon, label, value, subValue, color, isDark }: any) => (
  <div
    className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} shadow-xl`}
  >
    <div className={`flex items-center gap-2 mb-2 ${color}`}>
      {icon}
      <span className="text-[10px] font-black uppercase tracking-wider opacity-70">{label}</span>
    </div>
    <div className="text-2xl font-black mb-1">{value}</div>
    <div className="text-[10px] font-mono opacity-50">{subValue}</div>
  </div>
);

const SupplierListItem = ({ supplier, selected, onClick, isDark }: any) => {
  const statusColors = {
    stable: 'bg-emerald-500',
    warning: 'bg-amber-500',
    disconnected: 'bg-red-500',
  } as any;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${
        selected
          ? isDark
            ? 'bg-indigo-500/10 border-indigo-500/30'
            : 'bg-indigo-50 border-indigo-200'
          : isDark
            ? 'bg-slate-950 border-transparent hover:border-white/10'
            : 'bg-white border-transparent hover:border-slate-200'
      }`}
    >
      <div className={`relative p-2 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
        <Truck size={18} className={selected ? 'text-indigo-400' : 'opacity-50'} />
        <div
          className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 ${isDark ? 'border-slate-950' : 'border-white'} ${statusColors[supplier.syncStatus]}`}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="text-xs font-bold truncate">{supplier.name}</div>
        <div className="text-[10px] opacity-50 font-mono truncate">
          {supplier.category} • Tier {supplier.tier}
        </div>
      </div>
      <div className="text-right">
        <div
          className={`text-xs font-black ${supplier.integrityScore > LOW_INTEGRITY_THRESHOLD ? 'text-emerald-400' : 'text-amber-400'}`}
        >
          {supplier.integrityScore}%
        </div>
        <div className="text-[9px] font-mono opacity-30 mt-0.5">SCORE</div>
      </div>
    </button>
  );
};

export default SupplyChainCollaborationPlatformUI;
