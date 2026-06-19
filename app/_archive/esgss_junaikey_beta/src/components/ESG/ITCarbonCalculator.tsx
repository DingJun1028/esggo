/**
 * 💻 IT 碳排放計算器 (Green Algorithms 方法論)
 * --------------------------------------------------
 * [功能] AI/雲端運算碳足跡估算
 * [來源] Lannelongue et al. 2021, Adv. Sci.
 * [參考] https://www.green-algorithms.org/
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Server,
  Zap,
  Cloud,
  Calculator,
  Leaf,
  Car,
  Plane,
  TreeDeciduous,
  Info,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Link as LinkIcon,
  Loader2,
  Download,
} from 'lucide-react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { blockchainAnchorService } from '@/services/blockchain/BlockchainAnchorService';
import { IBlockchainAnchorResult } from '@/types/blockchain';
import { useESGStore } from '@/store/useESGStore';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';

// ============================================================================
// Types & Constants (Based on Green Algorithms)
// ============================================================================

export interface ComputeConfig {
  cpuModel: string;
  cpuCores: number;
  cpuTdp: number; // Watts
  gpuModel: string;
  gpuCount: number;
  gpuTdp: number; // Watts
  memoryGB: number;
  runtime: number; // hours
  usageFactor: number; // 0-1
  pue: number; // Power Usage Effectiveness (data center)
  region: string;
  carbonIntensity: number; // gCO2e/kWh
}

export interface CarbonResult {
  energyKWh: number;
  carbonGrams: number;
  carbonKg: number;
  equivalentKmDriven: number;
  equivalentFlightHours: number;
  treeDaysToOffset: number;
}

// TDP values from Green Algorithms database (sample)
const CPU_TDP_DATABASE: Record<string, number> = {
  'Intel Xeon E5-2680 v4': 120,
  'Intel Core i9-13900K': 253,
  'Intel Core i7-12700K': 190,
  'AMD EPYC 7763': 280,
  'AMD Ryzen 9 7950X': 170,
  'Apple M2 Pro': 30,
  'Apple M3 Max': 40,
  'Other (Manual)': 100,
};

const GPU_TDP_DATABASE: Record<string, number> = {
  'NVIDIA A100 (80GB)': 400,
  'NVIDIA A100 (40GB)': 300,
  'NVIDIA H100': 700,
  'NVIDIA RTX 4090': 450,
  'NVIDIA RTX 3090': 350,
  'NVIDIA V100': 300,
  'NVIDIA T4': 70,
  'AMD MI250X': 500,
  None: 0,
  'Other (Manual)': 200,
};

// Carbon intensity by region (gCO2e/kWh) - 2023 data
const REGION_CARBON_INTENSITY: Record<string, { name: string; intensity: number }> = {
  tw: { name: '台灣', intensity: 494 },
  jp: { name: '日本', intensity: 471 },
  cn: { name: '中國', intensity: 555 },
  us: { name: '美國', intensity: 379 },
  'us-ca': { name: '美國 (加州)', intensity: 210 },
  eu: { name: '歐盟平均', intensity: 231 },
  de: { name: '德國', intensity: 350 },
  fr: { name: '法國', intensity: 56 },
  uk: { name: '英國', intensity: 207 },
  world: { name: '全球平均', intensity: 436 },
};

// Memory power consumption (Watts per GB)
const MEMORY_POWER_PER_GB = 0.3725; // W/GB (from Green Algorithms)

// ============================================================================
// Main Component
// ============================================================================

interface ITCarbonCalculatorProps {
  onCalculate?: (result: CarbonResult) => void;
}

export const ITCarbonCalculator: React.FC<ITCarbonCalculatorProps> = ({ onCalculate }) => {
  // Form state
  const [cpuModel, setCpuModel] = useState('Intel Xeon E5-2680 v4');
  const [cpuCores, setCpuCores] = useState(16);
  const [gpuModel, setGpuModel] = useState('NVIDIA A100 (40GB)');
  const [gpuCount, setGpuCount] = useState(1);
  const [memoryGB, setMemoryGB] = useState(64);
  const [runtime, setRuntime] = useState(24);
  const [usageFactor, setUsageFactor] = useState(0.8);
  const [pue, setPue] = useState(1.2);
  const [region, setRegion] = useState('tw');
  const [customTdp, setCustomTdp] = useState({ cpu: 100, gpu: 200 });
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [anchorResult, setAnchorResult] = useState<IBlockchainAnchorResult | null>(null);
  const updateMetrics = useESGStore(state => state.updateMetrics);
  const addAnchor = useESGStore(state => state.addAnchor);

  useEffect(() => {
    omniLogger.info(LogCategory.ESG, 'IT 碳排放計算器已啟動', {
      source_origin: 'ITCarbonCalculator.mount',
    });
  }, []);

  // Calculate carbon footprint
  const result = useMemo<CarbonResult>(() => {
    const cpuTdp = CPU_TDP_DATABASE[cpuModel] || customTdp.cpu;
    const gpuTdp = GPU_TDP_DATABASE[gpuModel] || customTdp.gpu;
    const carbonIntensity = REGION_CARBON_INTENSITY[region]?.intensity || 436;

    // Power consumption (W)
    const cpuPower = cpuTdp * usageFactor;
    const gpuPower = gpuTdp * gpuCount * usageFactor;
    const memoryPower = memoryGB * MEMORY_POWER_PER_GB;
    const totalPower = (cpuPower + gpuPower + memoryPower) * pue;

    // Energy (kWh)
    const energyKWh = (totalPower / 1000) * runtime;

    // Carbon emissions
    const carbonGrams = energyKWh * carbonIntensity;
    const carbonKg = carbonGrams / 1000;

    // Equivalents (from Green Algorithms)
    const equivalentKmDriven = carbonKg / 0.21; // ~210 gCO2/km average car
    const equivalentFlightHours = carbonKg / 90; // ~90 kgCO2/hour flight
    const treeDaysToOffset = carbonKg / 0.06; // ~22 kgCO2/year/tree = 60g/day

    return {
      energyKWh: Math.round(energyKWh * 100) / 100,
      carbonGrams: Math.round(carbonGrams),
      carbonKg: Math.round(carbonKg * 100) / 100,
      equivalentKmDriven: Math.round(equivalentKmDriven),
      equivalentFlightHours: Math.round(equivalentFlightHours * 10) / 10,
      treeDaysToOffset: Math.round(treeDaysToOffset),
    };
  }, [cpuModel, gpuModel, gpuCount, memoryGB, runtime, usageFactor, pue, region, customTdp]);

  // Handle blockchain anchoring
  const handleAnchor = async () => {
    setIsAnchoring(true);
    try {
      const anchorRes = await blockchainAnchorService.anchorAsset(
        {
          computation: { cpuModel, gpuModel, runtime },
          result,
        },
        {
          contentType: 'carbon_asset',
          sourceId: `ITCC-${uuidv4().slice(0, 8)}`,
          operator: 'ESG_ADMIN_01',
        }
      );
      setAnchorResult(anchorRes);
      addAnchor({
        id: anchorRes.sourceId ?? 'UNKNOWN',
        type: 'IT_CARBON_ASSET',
        hash: anchorRes.txHash,
      });
    } catch (error) {
      omniLogger.error(LogCategory.SEC, '區塊鏈存證失敗', { error });
    } finally {
      setIsAnchoring(false);
    }
  };

  return (
    <div className="frosted-panel rounded-2xl p-6 border border-green-500/20 neon-border-green animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
            <Cpu size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">IT 碳排放計算器</h2>
            <p className="text-sm text-slate-400">基於 Green Algorithms 方法論的深度分析</p>
          </div>
        </div>
        <a
          href="https://www.green-algorithms.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors"
        >
          <ExternalLink size={12} />
          參考來源
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="space-y-4">
          {/* CPU */}
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-2 mb-3 text-slate-300">
              <Cpu size={16} />
              <span className="font-medium">CPU 配置</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">處理器型號</label>
                <select
                  value={cpuModel}
                  onChange={e => setCpuModel(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                >
                  {Object.keys(CPU_TDP_DATABASE).map(cpu => (
                    <option key={cpu} value={cpu}>
                      {cpu}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">核心數</label>
                <input
                  type="number"
                  value={cpuCores}
                  onChange={e => setCpuCores(Number(e.target.value))}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                />
              </div>
            </div>
            {cpuModel === 'Other (Manual)' && (
              <div className="mt-2">
                <label className="text-xs text-slate-500 mb-1 block">TDP (Watts)</label>
                <input
                  type="number"
                  value={customTdp.cpu}
                  onChange={e => setCustomTdp(prev => ({ ...prev, cpu: Number(e.target.value) }))}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                />
              </div>
            )}
          </div>

          {/* GPU */}
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-2 mb-3 text-slate-300">
              <Server size={16} />
              <span className="font-medium">GPU 配置</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">GPU 型號</label>
                <select
                  value={gpuModel}
                  onChange={e => setGpuModel(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                >
                  {Object.keys(GPU_TDP_DATABASE).map(gpu => (
                    <option key={gpu} value={gpu}>
                      {gpu}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">GPU 數量</label>
                <input
                  type="number"
                  value={gpuCount}
                  onChange={e => setGpuCount(Number(e.target.value))}
                  min={0}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Memory & Runtime */}
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">記憶體 (GB)</label>
                <input
                  type="number"
                  value={memoryGB}
                  onChange={e => setMemoryGB(Number(e.target.value))}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">運行時間 (小時)</label>
                <input
                  type="number"
                  value={runtime}
                  onChange={e => setRuntime(Number(e.target.value))}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">使用率</label>
                <input
                  type="number"
                  value={usageFactor}
                  onChange={e => setUsageFactor(Number(e.target.value))}
                  step={0.1}
                  min={0}
                  max={1}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">PUE</label>
                <input
                  type="number"
                  value={pue}
                  onChange={e => setPue(Number(e.target.value))}
                  step={0.1}
                  min={1}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">地區</label>
                <select
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                >
                  {Object.entries(REGION_CARBON_INTENSITY).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.name} ({val.intensity} g)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Main Result */}
          <div className="p-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl border border-green-500/30">
            <div className="flex items-center gap-2 mb-4 text-green-400">
              <Leaf size={20} />
              <span className="font-medium">碳排放估算</span>
            </div>
            <div className="text-center mb-4">
              <p className="text-5xl font-bold text-white">
                {result.carbonKg < 1 ? `${result.carbonGrams} g` : `${result.carbonKg} kg`}
              </p>
              <p className="text-sm text-slate-400 mt-1">CO₂e</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-lg font-bold text-emerald-400">{result.energyKWh}</p>
                <p className="text-xs text-slate-500">kWh 能源</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-lg font-bold text-blue-400">
                  {REGION_CARBON_INTENSITY[region]?.intensity || 436}
                </p>
                <p className="text-xs text-slate-500">gCO₂/kWh</p>
              </div>
            </div>
          </div>

          {/* Equivalents */}
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <h4 className="text-sm font-medium text-slate-300 mb-3">相當於...</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <Car size={16} />
                  <span className="text-sm">汽車行駛</span>
                </div>
                <span className="text-white font-medium">{result.equivalentKmDriven} km</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <Plane size={16} />
                  <span className="text-sm">飛行時間</span>
                </div>
                <span className="text-white font-medium">{result.equivalentFlightHours} 小時</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <TreeDeciduous size={16} />
                  <span className="text-sm">樹木吸收天數</span>
                </div>
                <span className="text-white font-medium">{result.treeDaysToOffset} 天</span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-blue-400 mt-0.5" />
              <div className="text-xs text-slate-400">
                <p className="mb-1">
                  <strong className="text-blue-400">方法論來源：</strong>
                </p>
                <p>
                  Lannelongue, L., Grealey, J., Inouye, M. (2021). Green Algorithms: Quantifying the
                  Carbon Footprint of Computation.
                  <em>Adv. Sci.</em> 2100707.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                const trace_id = uuidv4();
                omniLogger.info(LogCategory.ESG, 'IT 碳排放計算完成', {
                  trace_id,
                  result,
                  source_origin: 'ITCarbonCalculator.onCalculate',
                });
                updateMetrics({ itEnergyKWh: result.energyKWh });
                onCalculate?.(result);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <Calculator size={18} />
              加入年度碳盤查
            </button>

            <button
              onClick={handleAnchor}
              disabled={isAnchoring || !!anchorResult}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
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
              {anchorResult ? '已存證' : '鎖定存證'}
            </button>
          </div>

          {/* Blockchain Evidence Bar */}
          {anchorResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex flex-col gap-4 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 rounded-xl">
                    <ShieldCheck size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-1">
                      Immutable Evidence Anchored
                    </p>
                    <p className="text-xs text-slate-400 font-mono truncate max-w-[200px]">
                      {anchorResult.txHash}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      alert(
                        `[Evidence Path]\nfile:///C:/Project/ESGss_JunAiKey_Beta/storage/anchors/${anchorResult.txHash}.json`
                      )
                    }
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg border border-indigo-500/20 transition-all"
                    title="定位證物檔案"
                  >
                    <LinkIcon size={16} />
                  </button>
                  <a
                    href={anchorResult.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg border border-indigo-500/30 transition-all"
                    title="區塊鏈瀏覽器"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-indigo-500/10">
                <div className="text-[10px] text-slate-500 font-mono flex-1">
                  STATUS: SEVER-SIDE SEALED & GLOBALLY NOTARIZED
                </div>
                <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center gap-1">
                  <Download size={10} /> Download Certificate
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ITCarbonCalculator;
