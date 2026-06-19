import React, { useState } from 'react';
import { ITalentAsset } from '../types/esgss_schema';
import { TruthBundleService } from '../services/integration/TruthBundleService';
import { ShieldCheck, Download, Award, TrendingUp, Users, Activity, Lock } from 'lucide-react';

// Mock Data for GTX
const MOCK_TALENT_ASSETS: ITalentAsset[] = [
  {
    id: '#JUN-001',
    name: 'Lead Architect',
    tags: ['ESG Expert', 'Lead Architect'],
    tvi: 98.2,
    carbonReduction: 1250.5,
    verificationStatus: 'VERIFIED',
    hash: '0xabc123...',
  },
  {
    id: '#ENG-402',
    name: 'Python Developer',
    tags: ['LCA Analyst', 'Python'],
    tvi: 85.7,
    carbonReduction: 420.2,
    verificationStatus: 'VERIFIED',
    hash: '0xdef456...',
  },
  {
    id: '#CONS-11',
    name: 'Supply Chain Optimizer',
    tags: ['Supply Chain', 'Optimization'],
    tvi: 79.4,
    carbonReduction: 15.0,
    verificationStatus: 'PENDING',
  },
];

export const GTXDashboard: React.FC = () => {
  const [assets] = useState<ITalentAsset[]>(MOCK_TALENT_ASSETS);

  const [anchoring, setAnchoring] = useState(false);

  const handleExport = () => {
    const csv = TruthBundleService.generateTalentCSV(assets);
    const fileName = `GTX_Talent_Assets_${new Date().toISOString().split('T')[0]}.csv`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const handleAnchor = async () => {
    try {
      setAnchoring(true);
      const bundle = TruthBundleService.generateBundle(assets);
      const result = await TruthBundleService.anchorBundle(bundle);
      alert(`✅ Anchored on Polygon!\nTxHash: ${result.txHash}`);
    } catch (error) {
      alert(`❌ Anchoring Failed: ${error}`);
    } finally {
      setAnchoring(false);
    }
  };

  const totalTVI = assets.reduce((acc, curr) => acc + curr.tvi, 0);
  const totalCarbon = assets.reduce((acc, curr) => acc + curr.carbonReduction, 0);

  return (
    <div className="min-h-screen bg-void text-titanium p-8 font-sans transition-colors duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">
            Global Green Talent Exchange (GTX)
          </h1>
          <p className="text-titanium-dim mt-2 text-sm tracking-wide">
            M3: Talent Asset Liability Sheet (TALS)
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAnchor}
            disabled={anchoring}
            className="flex items-center gap-2 px-6 py-3 bg-brand-accent/10 border border-brand-accent/50 rounded-xl hover:bg-brand-accent/20 transition-all text-brand-accent font-medium disabled:opacity-50"
          >
            {anchoring ? (
              <Activity className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            {anchoring ? 'Anchoring...' : 'Anchor to Chain'}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-brand-primary/10 border border-brand-primary/50 rounded-xl hover:bg-brand-primary/20 transition-all text-brand-primary font-medium"
          >
            <Download className="w-4 h-4" />
            Export Asset Sheet
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-void-light backdrop-blur-md border border-brand-border p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="w-24 h-24 text-brand-secondary" />
          </div>
          <div className="text-titanium-dim text-xs uppercase tracking-wider mb-2">
            Total Talent Assets
          </div>
          <div className="text-4xl font-bold text-titanium">{assets.length}</div>
          <div className="text-brand-primary text-xs mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% vs last quarter
          </div>
        </div>

        <div className="bg-void-light backdrop-blur-md border border-brand-border p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Award className="w-24 h-24 text-brand-accent" />
          </div>
          <div className="text-titanium-dim text-xs uppercase tracking-wider mb-2">
            Avg. Wang Dao Score (TVI)
          </div>
          <div className="text-4xl font-bold text-titanium">
            {(totalTVI / assets.length).toFixed(1)}
          </div>
          <div className="text-brand-accent text-xs mt-2 flex items-center gap-1">
            <Activity className="w-3 h-3" /> High Performance
          </div>
        </div>

        <div className="bg-void-light backdrop-blur-md border border-brand-border p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck className="w-24 h-24 text-brand-primary" />
          </div>
          <div className="text-titanium-dim text-xs uppercase tracking-wider mb-2">
            Cum. Carbon Reduction
          </div>
          <div className="text-4xl font-bold text-titanium">
            {totalCarbon.toLocaleString()}{' '}
            <span className="text-base font-normal text-titanium-dim">tCO2e</span>
          </div>
          <div className="text-brand-primary text-xs mt-2 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Chain-Verified
          </div>
        </div>
      </div>

      {/* Talent Asset Table */}
      <div className="bg-void-light backdrop-blur-md border border-brand-border rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-secondary/5 text-xs text-titanium-dim uppercase tracking-wider border-b border-brand-border">
              <th className="p-4 font-medium">Talent ID</th>
              <th className="p-4 font-medium">Core Tags</th>
              <th className="p-4 font-medium text-right">Wang Dao Score (TVI)</th>
              <th className="p-4 font-medium text-right">Carbon Delta (tCO2e)</th>
              <th className="p-4 font-medium text-center">Verification Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {assets.map(asset => (
              <tr key={asset.id} className="hover:bg-brand-primary/5 transition-colors group">
                <td className="p-4">
                  <div className="font-mono text-brand-secondary font-medium">{asset.id}</div>
                  <div className="text-xs text-titanium-dim">{asset.name}</div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2 flex-wrap">
                    {asset.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded text-[10px] bg-brand-primary/10 border border-brand-primary/20 text-brand-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="font-bold text-titanium">{asset.tvi.toFixed(1)}</div>
                </td>
                <td className="p-4 text-right">
                  <div className="font-mono text-brand-primary font-medium">
                    {asset.carbonReduction.toFixed(1)}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
                      asset.verificationStatus === 'VERIFIED'
                        ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary'
                        : asset.verificationStatus === 'PENDING'
                          ? 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent'
                          : 'bg-brand-danger/10 border-brand-danger/30 text-brand-danger'
                    }`}
                  >
                    {asset.verificationStatus === 'VERIFIED' && <ShieldCheck className="w-3 h-3" />}
                    {asset.verificationStatus === 'VERIFIED'
                      ? 'Verified On-Chain'
                      : asset.verificationStatus === 'PENDING'
                        ? 'Auditing'
                        : 'Rejected'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
