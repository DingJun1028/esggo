/**
 * 🎯 Sustainability War Room - Supply Chain Radar (v3.0 Enhanced)
 * --------------------------------------------------
 * [Function] B2 - Supply Chain Partner Sustainability Performance & Business Alert
 * [Style] High-end Futuristic
 * [Language] Traditional Chinese (UI), English (Code)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, AlertTriangle, CheckCircle, XCircle, Search, Filter } from 'lucide-react';

export interface Supplier {
  id: string;
  name: string;
  esgScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  alerts: Alert[];
  lastUpdate: number;
}

export interface Alert {
  type: 'Environment' | 'Social' | 'Governance' | 'Business';
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: number;
}

// --- Tech Badge Component ---
const TechBadge: React.FC<{ icon: React.ReactNode; label: string; color: string }> = ({
  icon,
  label,
  color,
}) => (
  <div
    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border ${color}`}
  >
    {icon}
    {label}
  </div>
);

// --- Main Component ---
export const SupplyChainRadar: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [filter, setFilter] = useState<'all' | 'high_risk' | 'watch_list'>('all');

  useEffect(() => {
    // Simulate Data Loading
    setSuppliers([
      {
        id: 'SUP-001',
        name: 'Green Energy Tech Ltd.',
        esgScore: 92,
        riskLevel: 'low',
        alerts: [],
        lastUpdate: Date.now(),
      },
      {
        id: 'SUP-002',
        name: 'Global Manufacturing Co.',
        esgScore: 65,
        riskLevel: 'medium',
        alerts: [
          {
            type: 'Environment',
            severity: 'medium',
            description: '第三季碳排放強度增加 5%',
            timestamp: Date.now() - 86400000,
          },
        ],
        lastUpdate: Date.now() - 3600000,
      },
      {
        id: 'SUP-003',
        name: 'Raw Material Corp.',
        esgScore: 45,
        riskLevel: 'high',
        alerts: [
          {
            type: 'Social',
            severity: 'high',
            description: '區域工廠通報潛在勞工權益違規',
            timestamp: Date.now() - 172800000,
          },
          {
            type: 'Governance',
            severity: 'medium',
            description: '財務揭露延遲',
            timestamp: Date.now() - 432000000,
          },
        ],
        lastUpdate: Date.now() - 86400000,
      },
    ]);
  }, []);

  const filteredSuppliers = suppliers.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'high_risk') return s.riskLevel === 'high';
    return true;
  });

  return (
    <div className="bg-slate-900 min-h-screen p-6 text-slate-100 flex gap-6">
      {/* List Panel */}
      <div className="w-1/3 flex flex-col gap-4">
        <header className="mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-blue-400">
            <Radar className="animate-spin-slow" /> 供應鏈雷達
          </h1>
          <p className="text-slate-500 text-sm">即時風險監控系統</p>
        </header>

        {/* Filter */}
        <div className="flex bg-slate-800 rounded-lg p-1">
          {(['all', 'high_risk', 'watch_list'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 text-xs font-bold uppercase rounded transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f === 'all' ? '全部' : f === 'high_risk' ? '高風險' : '觀察名單'}
            </button>
          ))}
        </div>

        {/* Supplier List */}
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
          {filteredSuppliers.map(supplier => (
            <motion.div
              layout
              key={supplier.id}
              onClick={() => setSelectedSupplier(supplier)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedSupplier?.id === supplier.id
                  ? 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sm tracking-wide">{supplier.name}</span>
                <RiskBadge level={supplier.riskLevel} />
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>ID: {supplier.id}</span>
                <span className="font-mono text-blue-300">ESG: {supplier.esgScore}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
        {selectedSupplier ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSupplier.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full flex flex-col"
            >
              <div className="flex justify-between items-start mb-8 border-b border-slate-800 pb-6">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">{selectedSupplier.name}</h2>
                  <div className="flex gap-3">
                    <TechBadge
                      icon={<Search size={10} />}
                      label="已稽核"
                      color="bg-emerald-900/30 text-emerald-400 border-emerald-700/50"
                    />
                    <TechBadge
                      icon={<Filter size={10} />}
                      label="一級供應商"
                      color="bg-blue-900/30 text-blue-400 border-blue-700/50"
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-blue-500 font-mono tracking-tighter">
                    {selectedSupplier.esgScore}
                  </div>
                  <div className="text-xs text-slate-500 uppercase">ESG 總評分</div>
                </div>
              </div>

              {/* Alerts Section */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-yellow-500" /> 風險警示
                </h3>
                {selectedSupplier.alerts.length > 0 ? (
                  <div className="space-y-3">
                    {selectedSupplier.alerts.map((alert, index) => (
                      <div
                        key={index}
                        className="bg-red-950/20 border border-red-900/30 rounded-lg p-4 flex gap-4 items-start"
                      >
                        <div
                          className={`mt-1 w-2 h-2 rounded-full ${alert.severity === 'high' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-red-300 uppercase bg-red-900/30 px-2 rounded">
                              {alert.type}
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(alert.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300">{alert.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-slate-600 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                    <CheckCircle size={32} className="text-emerald-500/50 mb-2" />
                    <p>目前無活躍風險警示</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600">
            <Radar size={64} className="opacity-20 animate-spin-slow mb-4" />
            <p>請選擇供應商以查看詳細分析</p>
          </div>
        )}
      </div>
    </div>
  );
};

const RiskBadge: React.FC<{ level: Supplier['riskLevel'] }> = ({ level }) => {
  const styles = {
    low: 'bg-emerald-950 text-emerald-400 border-emerald-800',
    medium: 'bg-yellow-950 text-yellow-400 border-yellow-800',
    high: 'bg-red-950 text-red-400 border-red-800 shadow-[0_0_10px_rgba(239,68,68,0.3)]',
  };

  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${styles[level]}`}>
      {level} RISK
    </span>
  );
};
