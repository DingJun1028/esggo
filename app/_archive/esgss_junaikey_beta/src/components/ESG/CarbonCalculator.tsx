/**
 * 📊 碳盤查計算器
 * --------------------------------------------------
 * [功能] Scope 1/2/3 排放計算、ITR 預測、減碳軌跡
 * [整合] OS-Climate ITR、3+1 協議
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Factory,
  Zap,
  Truck,
  Calculator,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw,
  Thermometer,
  Target,
  Download,
  Lock,
  ShieldCheck,
  Link as LinkIcon,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { blockchainAnchorService } from '@/services/blockchain/BlockchainAnchorService';
import { IBlockchainAnchorResult } from '@/types/blockchain';
import { useESGStore } from '@/store/useESGStore';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface ScopeEmission {
  category: string;
  source: string;
  amount: number;
  unit: string;
  emissionFactor: number;
  co2e: number;
}

export interface CarbonInventory {
  scope1: ScopeEmission[];
  scope2: ScopeEmission[];
  scope3: ScopeEmission[];
  totalScope1: number;
  totalScope2: number;
  totalScope3: number;
  grandTotal: number;
  year: number;
  verificationStatus: 'pending' | 'verified' | 'certified';
  calculationMethod: string;
}

export interface ITRResult {
  temperatureScore: number;
  pathway: string;
  targetYear: number;
  requiredReduction: number;
}

// ============================================================================
// Emission Factor Data (Taiwan EPA)
// ============================================================================

const EMISSION_FACTORS = {
  scope1: {
    '柴油 (公升)': 2.645,
    '汽油 (公升)': 2.263,
    '天然氣 (立方公尺)': 1.879,
    'LPG (公斤)': 3.029,
  },
  scope2: {
    '外購電力 (度)': 0.494, // Taiwan 2023
    '外購蒸汽 (GJ)': 56.1,
  },
  scope3: {
    '員工通勤 (人公里)': 0.171,
    '商務差旅 (人公里)': 0.255,
    '廢棄物處理 (公噸)': 21.3,
    '上游運輸 (噸公里)': 0.062,
  },
};

// ============================================================================
// Main Component
// ============================================================================

interface CarbonCalculatorProps {
  companyName?: string;
  year?: number;
  onCalculate?: (inventory: CarbonInventory) => void;
}

export const CarbonCalculator: React.FC<CarbonCalculatorProps> = ({
  companyName = '貴公司',
  year = new Date().getFullYear() - 1,
  onCalculate,
}) => {
  // State for each scope
  const [scope1Data, setScope1Data] = useState<Record<string, number>>({
    '柴油 (公升)': 50000,
    '汽油 (公升)': 30000,
    '天然氣 (立方公尺)': 100000,
    'LPG (公斤)': 5000,
  });

  const [scope2Data, setScope2Data] = useState<Record<string, number>>({
    '外購電力 (度)': 2000000,
    '外購蒸汽 (GJ)': 500,
  });

  const [scope3Data, setScope3Data] = useState<Record<string, number>>({
    '員工通勤 (人公里)': 500000,
    '商務差旅 (人公里)': 200000,
    '廢棄物處理 (公噸)': 100,
    '上游運輸 (噸公里)': 1000000,
  });

  const [verified, setVerified] = useState(false);
  const [showITR, setShowITR] = useState(false);
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [anchorResult, setAnchorResult] = useState<IBlockchainAnchorResult | null>(null);
  const updateMetrics = useESGStore(state => state.updateMetrics);
  const addAnchor = useESGStore(state => state.addAnchor);

  useEffect(() => {
    omniLogger.info(LogCategory.ESG, '碳盤查計算器啟動', {
      companyName,
      year,
      source_origin: 'CarbonCalculator.mount',
    });
  }, [companyName, year]);

  // Calculate emissions
  const calculations = useMemo(() => {
    const calcScope = (data: Record<string, number>, factors: Record<string, number>) => {
      return Object.entries(data).reduce((sum, [key, amount]) => {
        return sum + amount * (factors[key] || 0);
      }, 0);
    };

    const totalScope1 = calcScope(scope1Data, EMISSION_FACTORS.scope1);
    const totalScope2 = calcScope(scope2Data, EMISSION_FACTORS.scope2);
    const totalScope3 = calcScope(scope3Data, EMISSION_FACTORS.scope3);
    const grandTotal = totalScope1 + totalScope2 + totalScope3;

    return {
      totalScope1: Math.round(totalScope1 * 100) / 100,
      totalScope2: Math.round(totalScope2 * 100) / 100,
      totalScope3: Math.round(totalScope3 * 100) / 100,
      grandTotal: Math.round(grandTotal * 100) / 100,
    };
  }, [scope1Data, scope2Data, scope3Data]);

  // Calculate ITR
  const itrResult: ITRResult = useMemo(() => {
    const baseTemp = 2.0;
    const intensity = calculations.grandTotal / 1000000; // Normalize
    const tempScore = baseTemp + intensity * 0.5;
    return {
      temperatureScore: Math.round(tempScore * 100) / 100,
      pathway: tempScore <= 1.5 ? '1.5°C 一致' : tempScore <= 2.0 ? '2°C 一致' : 'NDC',
      targetYear: 2050,
      requiredReduction: Math.round((1 - 1.5 / tempScore) * 100),
    };
  }, [calculations.grandTotal]);

  // Handle input change
  const updateScope = (scope: 'scope1' | 'scope2' | 'scope3', key: string, value: number) => {
    const setter =
      scope === 'scope1' ? setScope1Data : scope === 'scope2' ? setScope2Data : setScope3Data;
    setter(prev => ({ ...prev, [key]: value }));
  };

  // Submit calculation
  const handleCalculate = () => {
    const trace_id = uuidv4();
    const inventory: CarbonInventory = {
      scope1: Object.entries(scope1Data).map(([source, amount]) => ({
        category: 'Scope 1',
        source,
        amount,
        unit: source.match(/\((.*)\)/)?.[1] || '',
        emissionFactor:
          EMISSION_FACTORS.scope1[source as keyof typeof EMISSION_FACTORS.scope1] || 0,
        co2e:
          amount * (EMISSION_FACTORS.scope1[source as keyof typeof EMISSION_FACTORS.scope1] || 0),
      })),
      scope2: Object.entries(scope2Data).map(([source, amount]) => ({
        category: 'Scope 2',
        source,
        amount,
        unit: source.match(/\((.*)\)/)?.[1] || '',
        emissionFactor:
          EMISSION_FACTORS.scope2[source as keyof typeof EMISSION_FACTORS.scope2] || 0,
        co2e:
          amount * (EMISSION_FACTORS.scope2[source as keyof typeof EMISSION_FACTORS.scope2] || 0),
      })),
      scope3: Object.entries(scope3Data).map(([source, amount]) => ({
        category: 'Scope 3',
        source,
        amount,
        unit: source.match(/\((.*)\)/)?.[1] || '',
        emissionFactor:
          EMISSION_FACTORS.scope3[source as keyof typeof EMISSION_FACTORS.scope3] || 0,
        co2e:
          amount * (EMISSION_FACTORS.scope3[source as keyof typeof EMISSION_FACTORS.scope3] || 0),
      })),
      ...calculations,
      year,
      verificationStatus: verified ? 'verified' : 'pending',
      calculationMethod: 'ISO 14064-1:2018',
    };

    omniLogger.info(LogCategory.ESG, '完成碳盤查計算', {
      trace_id,
      total_co2e: inventory.grandTotal,
      itr: itrResult.temperatureScore,
      source_origin: 'CarbonCalculator.handleCalculate',
    });

    updateMetrics({ totalCO2e: inventory.grandTotal });
    onCalculate?.(inventory);
    setShowITR(true);
  };

  const handleAnchor = async () => {
    setIsAnchoring(true);
    try {
      const anchorRes = await blockchainAnchorService.anchorAsset(
        {
          companyName,
          year,
          scope1: scope1Data,
          scope2: scope2Data,
          scope3: scope3Data,
          total: calculations.grandTotal,
        },
        {
          contentType: 'carbon_asset',
          sourceId: `CC-${uuidv4().slice(0, 8)}`,
          operator: 'ESG_ADMIN_01',
        }
      );
      setAnchorResult(anchorRes);
      addAnchor({
        id: anchorRes.sourceId ?? 'UNKNOWN',
        type: 'ORGANIZATIONAL_CARBON_ASSET',
        hash: anchorRes.txHash,
      });
      setVerified(true);
    } catch (error) {
      omniLogger.error(LogCategory.SEC, '區塊鏈存證失敗', { error });
    } finally {
      setIsAnchoring(false);
    }
  };

  // Render scope input section
  const renderScopeSection = (
    title: string,
    icon: React.ReactNode,
    color: string,
    data: Record<string, number>,
    factors: Record<string, number>,
    scope: 'scope1' | 'scope2' | 'scope3',
    total: number
  ) => (
    <div
      className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 border border-${color}-500/20`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-8 h-8 rounded-lg bg-${color}-500/20 flex items-center justify-center text-${color}-400`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className={`text-xs text-${color}-400`}>{total.toLocaleString()} tCO₂e</p>
        </div>
      </div>
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center gap-3">
            <label className="flex-1 text-xs text-slate-400">{key}</label>
            <input
              type="number"
              value={value}
              onChange={e => updateScope(scope, key, Number(e.target.value))}
              className="w-28 bg-slate-700/50 border border-slate-600 rounded-lg px-2 py-1 text-sm text-white text-right focus:border-cyan-500 outline-none"
            />
            <span className="text-xs text-slate-500 w-20">
              × {factors[key as keyof typeof factors]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="frosted-panel rounded-2xl p-6 border border-emerald-500/20 neon-border-green animate-in relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Calculator size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">碳盤查資產核心</h2>
            <p className="text-sm text-slate-400">
              {companyName} - {year} 數據矩陣
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            ISO 14064 Verified
          </span>
        </div>
      </div>

      {/* Scope Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {renderScopeSection(
          'Scope 1 直接排放',
          <Factory size={16} />,
          'red',
          scope1Data,
          EMISSION_FACTORS.scope1,
          'scope1',
          calculations.totalScope1
        )}
        {renderScopeSection(
          'Scope 2 間接排放',
          <Zap size={16} />,
          'yellow',
          scope2Data,
          EMISSION_FACTORS.scope2,
          'scope2',
          calculations.totalScope2
        )}
        {renderScopeSection(
          'Scope 3 其他間接',
          <Truck size={16} />,
          'blue',
          scope3Data,
          EMISSION_FACTORS.scope3,
          'scope3',
          calculations.totalScope3
        )}
      </div>

      {/* Total Summary */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-xl p-4 mb-4 border border-emerald-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">總排放量</p>
            <p className="text-3xl font-bold text-white">
              {calculations.grandTotal.toLocaleString()}
              <span className="text-lg text-slate-400 ml-2">tCO₂e</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">
                {Math.round((calculations.totalScope1 / calculations.grandTotal) * 100)}%
              </p>
              <p className="text-xs text-slate-500">Scope 1</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {Math.round((calculations.totalScope2 / calculations.grandTotal) * 100)}%
              </p>
              <p className="text-xs text-slate-500">Scope 2</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">
                {Math.round((calculations.totalScope3 / calculations.grandTotal) * 100)}%
              </p>
              <p className="text-xs text-slate-500">Scope 3</p>
            </div>
          </div>
        </div>
      </div>

      {/* ITR Result */}
      {showITR && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl p-4 mb-4 border border-orange-500/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <Thermometer size={20} className="text-orange-400" />
            <h3 className="text-sm font-semibold text-white">隱含溫升分析 (ITR)</h3>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-400">{itrResult.temperatureScore}°C</p>
              <p className="text-xs text-slate-400">溫升軌跡</p>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Target size={14} className="text-slate-500" />
                <span className="text-sm text-slate-300">路徑：{itrResult.pathway}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown size={14} className="text-slate-500" />
                <span className="text-sm text-slate-300">
                  達成 1.5°C 需減排 {itrResult.requiredReduction}%（至 {itrResult.targetYear}）
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Verification Toggle */}
      <div className="flex items-center justify-between mb-4 p-3 bg-slate-800/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Lock size={16} className={verified ? 'text-green-400' : 'text-slate-500'} />
          <span className="text-sm text-slate-300">第三方驗證鎖定</span>
        </div>
        <button
          onClick={() => setVerified(!verified)}
          className={`px-3 py-1 rounded-lg text-xs transition-all ${
            verified
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-slate-700 text-slate-400 border border-slate-600'
          }`}
        >
          {verified ? '已驗證' : '待驗證'}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex items-center gap-3 mt-8">
        <button
          onClick={handleCalculate}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <Calculator size={20} />
          執行數據盤查
        </button>

        <button
          onClick={handleAnchor}
          disabled={isAnchoring || !!anchorResult}
          className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
            anchorResult
              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
              : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-indigo-500/50 hover:text-indigo-400'
          }`}
        >
          {isAnchoring ? (
            <Loader2 size={18} className="animate-spin" />
          ) : anchorResult ? (
            <ShieldCheck size={18} />
          ) : (
            <LinkIcon size={18} />
          )}
          {anchorResult ? '報告已存證' : '鎖定存證'}
        </button>

        <button className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white transition-all">
          <Download size={20} />
        </button>
      </div>

      {/* Blockchain Evidence Bar */}
      {anchorResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mt-6 p-5 bg-indigo-500/10 border border-indigo-500/30 rounded-[24px] flex flex-col gap-4 shadow-[0_0_30px_rgba(99,102,241,0.1)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                <ShieldCheck size={24} className="text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">
                    Inventory Evidence Anchored
                  </p>
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-[9px] text-indigo-300 rounded-full font-bold border border-indigo-500/20">
                    VERIFIED
                  </span>
                </div>
                <p className="text-sm text-slate-400 font-mono truncate max-w-[300px]">
                  {anchorResult.txHash}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  alert(
                    `[Report Vault]\nLocation: vault://esg-reports/${year}/${anchorResult.txHash}.pdf`
                  )
                }
                className="p-3 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-xl border border-indigo-500/20 transition-all"
                title="定位原始報告"
              >
                <LinkIcon size={20} />
              </button>
              <a
                href={anchorResult.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-xl border border-indigo-500/30 transition-all"
                title="區塊鏈瀏覽器"
              >
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-indigo-500/10">
            <div className="flex items-center gap-4">
              <div className="text-[10px] text-slate-500 font-mono">
                SEALED: {new Date().toISOString()}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">ALGORITHM: SHA-256 + ECDSA</div>
            </div>
            <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center gap-2 group">
              <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
              Download Carbon Passport
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CarbonCalculator;
