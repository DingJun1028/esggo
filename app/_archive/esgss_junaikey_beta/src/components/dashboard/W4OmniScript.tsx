/**
 * @esgss/jun-ai-ceremony
 * W4OmniScript（W4 全知腳本）
 * 
 * 展示四大支柱匯聚與執行最終 Hash Lock
 * 遵循 W4 聖典執行手冊規範
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IW4CeremonyResult,
  FourPillarsData,
  CeremonyPhase,
  W4CeremonyService,
  createW4CeremonyService,
  T5TValidator,
  createT5TValidator,
  ComponentCoreFactory,
  IComponentCore
} from '@/services/ceremony';
import '../../styles/liquid-glass.css';

/**
 * 支柱數據
 */
interface PillarData {
  id: string;
  name: string;
  nameZh: string;
  symbol: string;
  color: string;
  rsScore: number;
  description: string;
}

/**
 * W4OmniScript 配置
 */
export interface W4OmniScriptConfig {
  /** 聖典名稱 */
  ceremonyName: string;
  /** 聯盟成員 */
  allianceMembers?: string[];
  /** 自動執行 */
  autoExecute?: boolean;
  /** 顯示證書 */
  showCertificate?: boolean;
}

/**
 * W4OmniScript Props
 */
export interface W4OmniScriptProps {
  /** 配置 */
  config: W4OmniScriptConfig;
  /** 執行完成回調 */
  onComplete?: (result: IW4CeremonyResult) => void;
  /** 執行失敗回調 */
  onError?: (error: Error) => void;
  /** 階段變化回調 */
  onPhaseChange?: (phase: CeremonyPhase) => void;
  /** 類別名稱 */
  className?: string;
}

/**
 * 四大支柱初始數據
 */
const INITIAL_PILLARS: PillarData[] = [
  {
    id: 'tangible',
    name: 'Tangible',
    nameZh: '可觸知',
    symbol: '◆',
    color: '#63a6b0',
    rsScore: 0,
    description: 'UI 可觸及性驗證'
  },
  {
    id: 'traceable',
    name: 'Traceable',
    nameZh: '可追溯',
    symbol: '◆',
    color: '#4ade80',
    rsScore: 0,
    description: '數據來源追蹤'
  },
  {
    id: 'trackable',
    name: 'Trackable',
    nameZh: '可追蹤',
    symbol: '◆',
    color: '#d4af37',
    rsScore: 0,
    description: '操作路徑記錄'
  },
  {
    id: 'trustworthy',
    name: 'Trustworthy',
    nameZh: '可信賴',
    symbol: '◆',
    color: '#8b5cf6',
    rsScore: 0,
    description: 'Hash Lock 驗證'
  }
];

/**
 * 創建 W4OmniScript 組件
 */
export function createW4OmniScript(defaultConfig?: Partial<W4OmniScriptConfig>) {
  const W4OmniScriptComponent: React.FC<W4OmniScriptProps> = ({
    config,
    onComplete,
    onError,
    onPhaseChange,
    className = ''
  }) => {
    const {
      ceremonyName,
      allianceMembers = [],
      autoExecute = false,
      showCertificate = true
    } = { ...defaultConfig, ...config };

    const [pillars, setPillars] = useState<PillarData[]>(INITIAL_PILLARS);
    const [phase, setPhase] = useState<CeremonyPhase>(CeremonyPhase.PREPARING);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<IW4CeremonyResult | null>(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    // IComponentCore 元數據
    const [core] = useState<IComponentCore>(() =>
      ComponentCoreFactory.create(
        'dashboard/W4OmniScript.tsx',
        '2.0.0',
        ['W4', 'OmniScript', 'Ceremony']
      )
    );

    const serviceRef = useRef<W4CeremonyService | null>(null);
    const validatorRef = useRef<T5TValidator | null>(null);

    // 初始化服務
    useEffect(() => {
      serviceRef.current = createW4CeremonyService({
        name: ceremonyName,
        allianceMembers
      });
      validatorRef.current = createT5TValidator();

      // 模擬支柱 Rs 分數計算
      calculatePillarScores();
    }, [ceremonyName, allianceMembers]);

    // 計算支柱 Rs 分數
    const calculatePillarScores = useCallback(() => {
      setPillars(prev => prev.map((pillar, index) => ({
        ...pillar,
        rsScore: Math.round(60 + Math.random() * 35 + index * 5)
      })));
    }, []);

    // 執行 W4 刻印儀式
    const executeCeremony = useCallback(async () => {
      if (isExecuting) return;

      setIsExecuting(true);
      setProgress(0);
      setResult(null);

      try {
        // 構建四大支柱數據
        const pillarsData: FourPillarsData = {
          tangible: { rsScore: pillars[0].rsScore, verified: true },
          traceable: { rsScore: pillars[1].rsScore, history: [] },
          trackable: { rsScore: pillars[2].rsScore, metrics: {} },
          trustworthy: { rsScore: pillars[3].rsScore, trustLevel: 'high' }
        };

        const service = serviceRef.current!;

        // 監控進度
        const unwatch = (p: CeremonyPhase, prog: number, msg: string) => {
          setPhase(p);
          setProgress(prog);
          onPhaseChange?.(p);
        };

        // 執行儀式
        const ceremonyResult = await service.executeCeremony(pillarsData, unwatch);

        setResult(ceremonyResult);
        setPhase(CeremonyPhase.COMPLETED);
        setProgress(100);
        onComplete?.(ceremonyResult);
      } catch (error) {
        setPhase(CeremonyPhase.FAILED);
        onError?.(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setIsExecuting(false);
      }
    }, [pillars, ceremonyName, allianceMembers, onComplete, onError, onPhaseChange]);

    // 自動執行
    useEffect(() => {
      if (autoExecute && !isExecuting && phase === CeremonyPhase.PREPARING) {
        executeCeremony();
      }
    }, [autoExecute, isExecuting, phase, executeCeremony]);

    // 獲取階段描述
    const getPhaseDescription = () => {
      switch (phase) {
        case CeremonyPhase.PREPARING:
          return '準備四大支柱...';
        case CeremonyPhase.RESONANCE_VERIFICATION:
          return '計算 Rs 共鳴值...';
        case CeremonyPhase.T5T_EVALUATION:
          return '執行 5T 協議評估...';
        case CeremonyPhase.SEALING:
          return '執行 Hash Lock 刻印...';
        case CeremonyPhase.COMPLETED:
          return '刻印儀式完成！';
        case CeremonyPhase.FAILED:
          return '刻印失敗';
        default:
          return '';
      }
    };

    // 獲取按鈕文字
    const getButtonText = () => {
      if (isExecuting) return '執行中...';
      if (phase === CeremonyPhase.COMPLETED) return '重新執行刻印';
      if (phase === CeremonyPhase.FAILED) return '重試';
      return '執行 W4 刻印';
    };

    return (
      <motion.div
        className={`relative ${className}`}
        data-uuid={core.uuid}
        data-timestamp={core.timestamp}
        data-5t-protocol="active"
      >
        {/* 液態玻璃容器 */}
        <motion.div
          className="liquid-glass rounded-2xl p-6 overflow-hidden"
          animate={{
            boxShadow: phase === CeremonyPhase.COMPLETED
              ? '0 0 60px 0 rgba(16, 185, 129, 0.3)'
              : '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
          }}
        >
          {/* 標題區域 */}
          <div className="text-center mb-6">
            <motion.h2
              className="text-2xl font-bold text-gray-100 mb-2"
              animate={{
                color: phase === CeremonyPhase.COMPLETED
                  ? '#10b981'
                  : phase === CeremonyPhase.FAILED
                    ? '#ef4444'
                    : '#e0e0e0'
              }}
            >
              {ceremonyName}
            </motion.h2>
            <p className="text-sm text-gray-400">
              {phase === CeremonyPhase.COMPLETED
                ? 'W4 聖典已成功刻印'
                : '四大支柱匯聚，執行 Hash Lock'}
            </p>
          </div>

          {/* 進度指示器 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">{getPhaseDescription()}</span>
              <span className="text-xs font-mono text-[#d4af37]">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: phase === CeremonyPhase.COMPLETED
                    ? 'linear-gradient(90deg, #10b981, #4ade80)'
                    : phase === CeremonyPhase.FAILED
                      ? 'linear-gradient(90deg, #ef4444, #f87171)'
                      : 'linear-gradient(90deg, #63a6b0, #8b5cf6, #d4af37, #4ade80)'
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* 四大支柱展示 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.id}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* 支柱 */}
                <motion.div
                  className="relative p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 overflow-hidden"
                  animate={{
                    borderColor: pillar.rsScore >= 80
                      ? `${pillar.color}80`
                      : `${pillar.color}40`
                  }}
                >
                  {/* 量子流光 */}
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `linear-gradient(180deg, transparent, ${pillar.color}, transparent)`
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '0% 100%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />

                  {/* 符號 */}
                  <motion.div
                    className="text-2xl mb-2 text-center"
                    style={{ color: pillar.color }}
                    animate={{
                      scale: pillar.rsScore >= 80 ? [1, 1.2, 1] : 1
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  >
                    {pillar.symbol}
                  </motion.div>

                  {/* 名稱 */}
                  <div className="text-center mb-2">
                    <div className="text-xs font-bold text-gray-200">
                      {pillar.nameZh}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {pillar.name}
                    </div>
                  </div>

                  {/* Rs 分數 */}
                  <div className="text-center">
                    <motion.div
                      className="text-xl font-mono font-bold"
                      style={{ color: pillar.color }}
                      animate={{
                        textShadow: pillar.rsScore >= 80
                          ? `0 0 10px ${pillar.color}`
                          : 'none'
                      }}
                    >
                      {pillar.rsScore}
                    </motion.div>
                    <div className="text-[10px] text-gray-500">Rs</div>
                  </div>

                  {/* 等級指示 */}
                  <motion.div
                    className="absolute top-2 right-2"
                    animate={{
                      opacity: pillar.rsScore >= 80 ? 1 : 0
                    }}
                  >
                    <span className="text-xs" style={{ color: pillar.color }}>
                      ✦
                    </span>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* 總 Rs 分數 */}
          <div className="text-center mb-6">
            <motion.div
              className="inline-flex items-center gap-4 px-6 py-3 rounded-xl bg-gray-800/70 border border-gray-700/50"
              animate={{
                boxShadow: result && result.total_rs >= 80
                  ? '0 0 30px rgba(16, 185, 129, 0.2)'
                  : 'none'
              }}
            >
              <span className="text-sm text-gray-400">總 Rs 共鳴</span>
              <motion.span
                className="text-3xl font-mono font-bold text-[#d4af37]"
                animate={{
                  color: result && result.total_rs >= 80
                    ? '#10b981'
                    : '#d4af37'
                }}
              >
                {result?.total_rs ?? Math.round(pillars.reduce((sum, p) => sum + p.rsScore, 0) / 4)}
              </motion.span>
              {result && result.total_rs >= 80 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-lg"
                >
                  ✨
                </motion.span>
              )}
            </motion.div>
          </div>

          {/* 執行按鈕 */}
          {!autoExecute && (
            <div className="text-center">
              <motion.button
                className={`
                  px-8 py-3 rounded-xl font-bold text-sm
                  ${isExecuting
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : phase === CeremonyPhase.COMPLETED
                      ? 'bg-gradient-to-r from-[#10b981] to-[#4ade80] text-white'
                      : phase === CeremonyPhase.FAILED
                        ? 'bg-gradient-to-r from-[#ef4444] to-[#f87171] text-white'
                        : 'bg-gradient-to-r from-[#63a6b0] to-[#8b5cf6] text-white'
                  }
                `}
                onClick={executeCeremony}
                disabled={isExecuting}
                whileHover={!isExecuting ? { scale: 1.02 } : {}}
                whileTap={!isExecuting ? { scale: 0.98 } : {}}
              >
                {getButtonText()}
              </motion.button>
            </div>
          )}

          {/* 證書展示 */}
          <AnimatePresence>
            {showCertificate && result && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 overflow-hidden"
              >
                <div className="border-t border-gray-700/50 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-300">
                      刻印證書
                    </h3>
                    <motion.button
                      className="text-xs text-gray-400 hover:text-gray-200"
                      onClick={() => setShowDetails(!showDetails)}
                      whileHover={{ scale: 1.05 }}
                    >
                      {showDetails ? '收起' : '展開'}
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2 text-xs"
                      >
                        <div className="flex justify-between">
                          <span className="text-gray-500">聖典 UUID</span>
                          <span className="font-mono text-gray-300 truncate max-w-[200px]">
                            {result.scripture_uuid.substring(0, 16)}...
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Hash Lock</span>
                          <span className="font-mono text-gray-300 truncate max-w-[200px]">
                            {result.hash_lock.substring(0, 16)}...
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">刻印時間</span>
                          <span className="text-gray-300">
                            {new Date(result.sealed_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">合規狀態</span>
                          <span className={`
                            ${result.t5t_compliance.compliance_status === 'compliant' ? 'text-[#10b981]' : ''}
                            ${result.t5t_compliance.compliance_status === 'partial' ? 'text-[#f59e0b]' : ''}
                            ${result.t5t_compliance.compliance_status === 'non_compliant' ? 'text-[#ef4444]' : ''}
                          `}>
                            {result.t5t_compliance.compliance_status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">合規分數</span>
                          <span className="text-gray-300">
                            {result.t5t_compliance.overall_score}/100
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hash Lock 完成動畫 */}
          <AnimatePresence>
            {phase === CeremonyPhase.COMPLETED && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* 光暈效果 */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)'
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 反重力浮動效果 */}
        <motion.div
          className="absolute -top-4 -right-4 w-8 h-8 rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, #8b5cf6, transparent)',
            filter: 'blur(8px)'
          }}
          animate={{
            y: [0, -8, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    );
  };

  W4OmniScriptComponent.displayName = 'W4OmniScript';

  return W4OmniScriptComponent;
}

/**
 * 預設 W4OmniScript 組件
 */
export const W4OmniScript: React.FC<W4OmniScriptProps> = createW4OmniScript();

/**
 * W4 快速刻印組件
 */
export const W4QuickSeal: React.FC<{
  name: string;
  allianceMembers?: string[];
  onComplete?: (result: IW4CeremonyResult) => void;
}> = ({ name, allianceMembers, onComplete }) => {
  return (
    <W4OmniScript
      config={{
        ceremonyName: name,
        allianceMembers,
        autoExecute: true,
        showCertificate: true
      }}
      onComplete={onComplete}
    />
  );
};

export default W4OmniScript;
