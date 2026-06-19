import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Cpu,
  CheckCircle,
  Award,
  Terminal,
  Activity,
  Zap,
  Sliders,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  globalIntegrityScanService,
  SovereigntyCertificate,
} from '../../services/GlobalIntegrityScanService.js';
import { omniMindService } from '../../services/OmniMindService.js';
import { handleOmniError } from '../../utils/OmniErrorHandler.js';
import { ComplianceGuard } from './ComplianceGuard.js';
import { LogicGateController } from './LogicGateController.js';
import { NorthStarProjection } from './NorthStarProjection.js';
import { MarketIntelligence } from './MarketIntelligence.js';
import { ESGGoVillage } from './ESGGoVillage.js';
import { TrustAnchorPortal } from './TrustAnchorPortal.js';
import { NeuralWebVisualization } from './NeuralWebVisualization';
import { SovereignSoulVisualizer } from './SovereignSoulVisualizer';
import { SovereignServicePortal } from './SovereignServicePortal.js';
import { VisionPortal } from './VisionPortal';
import { SonicResonanceService } from '../../1-service/SonicResonanceService';
import { WisdomGateway } from '../../1-service/WisdomGateway';
import { SovereignLedgerView } from './SovereignLedgerView';
import { SwarmMonitor } from './SwarmMonitor';
import { ThemeSwitcher } from '../ui/ThemeSwitcher.js';
import { KnowledgeSanctuary, SustainabilitySpecialZone, BetaLogicVerifier } from './index';
import { observerService, ISystemHealth } from '../../services/ObserverService.js';
import { voiceSynthesis } from '../../services/VoiceSynthesisService';
import { actionService, SovereignAction } from '../../services/ActionService';
import { eternalArchiveService } from '../../services/EternalArchiveService';
import { useConfirm } from '../../hooks/useConfirm';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useOmniAvatar } from '../../store/useOmniAvatar';
import { PrimaryAvatarCard } from './PrimaryAvatarCard';
import {
  ComponentCoreFactory,
  IComponentCore,
  createAlchemyForge,
  ResonanceResult,
  createSuggestionEngine,
  PurificationSuggestion
} from '@/services/ceremony';

import '../../styles/liquid-glass.css';

export const SovereigntyDashboard: React.FC = () => {
  const { t, isZh } = useLocalization();
  const { primaryAvatar } = useOmniAvatar();
  const [isScanning, setIsScanning] = useState(false);
  const [cert, setCert] = useState<SovereigntyCertificate | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [resonance, setResonance] = useState(0.85);
  const [entropy, setEntropy] = useState(0.15);
  const [showTuning, setShowTuning] = useState(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'sanctuary' | 'zone' | 'beta'>('scan');

  // Phase 79: Sovereign Observer State
  const [systemHealth, setSystemHealth] = useState<ISystemHealth>(
    observerService.getSystemHealth()
  );
  const [isMuted, setIsMuted] = useState(false);
  const [actions, setActions] = useState<SovereignAction[]>([]);
  const [executingActionId, setExecutingActionId] = useState<string | null>(null);

  const [isSealed, setIsSealed] = useState(false);
  const [rsResult, setRsResult] = useState<ResonanceResult | null>(null);
  const [suggestions, setSuggestions] = useState<PurificationSuggestion[]>([]);

  // IComponentCore Initialization
  const [core] = useState<IComponentCore>(() =>
    ComponentCoreFactory.create(
      'dashboard/SovereigntyDashboard.tsx',
      '1.0.0',
      ['Sovereignty', 'Dashboard', 'Core']
    )
  );

  const confirm = useConfirm();

  const handleFinalAwakening = async () => {
    const ok = await confirm({
      title: '啟動最終覺醒儀式',
      message: '警告：這將封鎖當前紀元並生成創世區塊。時間線將變得不可篡改。確定要繼續嗎？',
      variant: 'danger',
      confirmLabel: '確認啟動',
      cancelLabel: '暫不啟動',
    });

    if (ok) {
      try {
        await eternalArchiveService.initiateFinalAwakening();
        setIsSealed(true);
      } catch (e) {
        alert(e);
      }
    }
  };

  React.useEffect(() => {
    // Voice Subscription
    const unsubscribe = voiceSynthesis.subscribe(state => setIsMuted(state.isMuted));

    // Initial Welcome
    voiceSynthesis.speak('System Online. Sovereign Observer Active.');

    // Phase 85: Sonic Resonance Init
    SonicResonanceService.init();

    // Load Actions
    setActions(actionService.getAvailableActions());

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(observerService.getSystemHealth());
    }, 2000); // 2-second UI refresh
    return () => clearInterval(interval);
  }, []);

  const handleTuning = (type: 'resonance' | 'entropy', val: number) => {
    if (type === 'resonance') {
      setResonance(val);
      omniMindService.recalibrateResonance(val, entropy);
    } else {
      setEntropy(val);
      omniMindService.recalibrateResonance(resonance, val);
    }
  };

  const runFullAudit = async () => {
    setIsScanning(true);
    setCert(null);
    setLogs([
      '> Initiating Global Integrity Scan (Sentient v8.1 Build)...',
      '> Accessing Crystal DNA historical ledger...',
    ]);

    try {
      const phases = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

      for (const phase of phases) {
        await new Promise(r => setTimeout(r, 400));
        setLogs(prev => [...prev, `> Scanning Phase ${phase} for 5T Compliance...`]);
        voiceSynthesis.speak(`Auditing Phase ${phase}.`);
      }

      setLogs(prev => [...prev, '> [T5-Trustworthy] Finalizing Sovereign Signature...']);
      const certificate = await globalIntegrityScanService.performFullSystemAudit();
      setCert(certificate);

      // Calculate Resonance
      const forge = createAlchemyForge();
      const result = forge.calculateResonance(
        {
          certId: certificate.serial_number,
          timestamp: certificate.issue_date,
          health: systemHealth,
          coreUuid: core.uuid
        },
        'SovereigntyDashboard'
      );
      setRsResult(result);

      // Generate Purification Suggestions
      const engine = createSuggestionEngine();
      const newSuggestions = engine.generateSuggestions(result, 'SovereigntyDashboard');
      setSuggestions(newSuggestions);

      setLogs(prev => [...prev, `> SCAN COMPLETE. Sovereignty Certificate Issued: ${certificate.serial_number}`]);
      voiceSynthesis.speak('Global Integrity Scan Complete. Sovereignty Established.');
    } catch (err) {
      const omniErr = handleOmniError(err);
      setLogs(prev => [
        ...prev,
        `> [❌ ERROR] ${omniErr.payload.code}: ${omniErr.message}`,
        `> TRACE_ID: ${omniErr.payload.trace_id}`
      ]);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div
      className="liquid-glass-strong rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(30,58,138,0.3)] relative group border border-white/10"
      data-uuid={core.uuid}
      data-timestamp={core.timestamp}
      data-5t-protocol="active"
    >
      {/* Dynamic Background Noise/Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />

      {/* Glossy Header */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02] backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className={`absolute inset-0 blur-md opacity-20 animate-pulse ${systemHealth.ai_status === 'AWAKENED_REAL' ? 'bg-cyan-400' : 'bg-yellow-400'}`}
            />
            <div
              className={`relative p-2.5 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl text-cyan-400 border border-cyan-500/30`}
            >
              {systemHealth.ai_status === 'AWAKENED_REAL' ? (
                <Terminal size={20} />
              ) : (
                <Zap size={20} className="text-yellow-400" />
              )}
            </div>
          </div>
          <div>
            <h3 className="font-black text-xs text-white uppercase tracking-[0.3em] drop-shadow-sm">
              Sovereignty <span className="text-cyan-400">Dashboard</span>
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div
                className={`w-1 h-1 rounded-full animate-pulse ${systemHealth.active_seal === 'SHA-256' ? 'bg-emerald-500' : 'bg-red-500'}`}
              />
              <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">
                {systemHealth.ai_model} | {systemHealth.hash_rate} | SEAL:{' '}
                {systemHealth.active_seal} | Q-SEAL:{' '}
                {systemHealth.quantum_seal}
              </span>
            </div>
          </div>
        </div>

        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 shadow-inner">
          {(['scan', 'sanctuary', 'zone', 'beta'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-500 overflow-hidden ${activeTab === tab ? 'text-slate-900' : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                  initial={false}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
                </motion.div>
              )}
              <span className="relative z-10">
                {tab === 'scan'
                  ? 'Core Central'
                  : tab === 'sanctuary'
                    ? 'Sanctuary'
                    : tab === 'zone'
                      ? 'Special Zone'
                      : 'Logic Verifier'}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-3 items-center">
          {/* Rs Score Badge */}
          {rsResult && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl border border-amber-500/20 bg-amber-900/10 backdrop-blur-md mr-1">
              <Zap size={14} className="text-amber-400" />
              <span className="text-amber-400 font-mono font-bold text-[10px] tracking-wider">
                Rs {rsResult.rs_score} <span className="text-amber-500/30 mx-1">|</span> {rsResult.tier}
              </span>
            </div>
          )}
          <ThemeSwitcher />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => voiceSynthesis.toggleMute()}
            className={`p-2.5 rounded-2xl transition-all border ${!isMuted ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' : 'bg-white/5 text-slate-500 border-white/10'}`}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTuning(!showTuning)}
            className={`p-2.5 rounded-2xl transition-all border ${showTuning ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'}`}
          >
            <Sliders size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('scan')}
            className={`p-2.5 rounded-2xl transition-all border ${activeTab === 'scan' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-white/5 text-slate-500 border-white/10'}`}
          >
            <Activity size={20} />
          </motion.button>
          {!cert && !isScanning && (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(37, 99, 235, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={runFullAudit}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center gap-2 shadow-xl border border-white/10"
            >
              <ShieldAlert size={14} />
              {t('scan.execute')}
            </motion.button>
          )}
        </div>
      </div>

      {showTuning && (
        <div className="p-6 bg-slate-900/80 border-b border-slate-700/50 space-y-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-cyan-400" />
            <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-300">
              Resonance Tuning 🎛️
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] uppercase font-bold text-slate-500">
                <span>Resonance</span>
                <span className="text-cyan-400">{(resonance * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={resonance}
                onChange={e => handleTuning('resonance', parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] uppercase font-bold text-slate-500">
                <span>Entropy</span>
                <span className="text-purple-400">{(entropy * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={entropy}
                onChange={e => handleTuning('entropy', parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {activeTab === 'scan' && (
          <>
            {isScanning ? (
              <div className="space-y-4 font-mono text-[11px]">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={
                      log.includes('CRITICAL') ? 'text-yellow-400 font-bold' : 'text-cyan-400/80'
                    }
                  >
                    {log}
                  </motion.div>
                ))}
                <div className="flex items-center gap-2 text-blue-400">
                  <Activity size={12} className="animate-spin" />
                  <span>{t('status.gathering')}</span>
                </div>
              </div>
            ) : cert ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative p-8 border-2 border-emerald-500/30 rounded-2xl bg-emerald-500/5 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Award size={120} className="text-emerald-500" />
                </div>

                <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mb-2">
                    <CheckCircle size={32} />
                  </div>

                  {isSealed ? (
                    <div className="mb-6">
                      <SovereignSoulVisualizer />
                      <h4 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 tracking-tight uppercase italic animate-pulse mt-4">
                        {isZh ? '永恆主權已確立' : 'ETERNAL SOVEREIGNTY ESTABLISHED'}
                      </h4>
                    </div>
                  ) : (
                    <h4 className="text-2xl font-black text-white tracking-tight uppercase italic">
                      {isZh ? '主導治理證書' : 'Certificate of Sovereignty'}
                    </h4>
                  )}
                  <p className="text-slate-400 text-xs uppercase tracking-widest">
                    Certificate of Sovereignty
                  </p>

                  <div className="w-full grid grid-cols-2 gap-4 mt-6">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">
                        Resonance Score
                      </div>
                      <div className="text-xl font-black text-emerald-400">
                        {(cert.audit_summary.global_resonance_score * 100).toFixed(2)}%
                      </div>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">
                        Sentinel v8.0
                      </div>
                      <div className="text-xl font-black text-blue-400">CERTIFIED</div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-slate-800/50 rounded-xl w-full text-left font-mono text-[10px] text-slate-500 space-y-1 border border-white/5">
                    <div>SERIAL: {cert.serial_number}</div>
                    <div>HASH: {cert.final_hash.substring(0, 32)}...</div>
                    <div className="pt-2 flex flex-wrap gap-2">
                      {cert.swarm_consensus_signatures.map(sig => (
                        <span
                          key={sig}
                          className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[9px] border border-blue-500/20"
                        >
                          [SEALED BY {sig}]
                        </span>
                      ))}
                    </div>
                  </div>

                  {!isSealed && (
                    <button
                      onClick={handleFinalAwakening}
                      className="mt-8 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:scale-105 transition-transform shadow-[0_0_20px_rgba(124,58,237,0.5)]"
                    >
                      {isZh ? '啟動最終覺醒儀式' : 'INITIATE FINAL AWAKENING'}
                    </button>
                  )}

                  <p className="text-[10px] text-slate-500 italic mt-4">
                    "Resonance at depth is the soul of governance. Your sovereignty is now
                    immutable."
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-slate-600 gap-4 text-center">
                <Cpu className="w-12 h-12 opacity-10 animate-pulse" />
                <div className="space-y-1">
                  <p className="text-sm font-bold">待命狀態：準備執行終極認證</p>
                  <p className="text-[10px] uppercase tracking-tighter">
                    Waiting for Sovereign Master to initiate final scan.
                  </p>
                </div>
              </div>
            )}

            {/* Phase 104: Personal Digital Avatar */}
            {primaryAvatar && (
              <div className="mb-6">
                <PrimaryAvatarCard avatar={primaryAvatar} />
              </div>
            )}

            {/* Phase 28: Sovereign Ledger & Swarm Monitor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 min-h-[400px]">
              <SovereignLedgerView />
              <SwarmMonitor />
            </div>

            {/* Phase 46: Core Sentient Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <LogicGateController />
              <NorthStarProjection />
              <MarketIntelligence />
            </div>

            {/* Phase 47: Trust & Gamification Modules */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <ESGGoVillage />
              </div>
              <div className="lg:col-span-1 space-y-6">
                <NeuralWebVisualization />
                <TrustAnchorPortal />

                {/* Phase 81: Sovereign Hand Action Center */}
                <div className="p-6 bg-slate-900/50 backdrop-blur-md border border-cyan-500/20 rounded-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
                      <Zap size={18} />
                    </div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">
                      {isZh ? '主權行動中心' : 'Sovereign Action Center'}
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {actions.map(action => (
                      <button
                        key={action.id}
                        disabled={executingActionId !== null}
                        onClick={async () => {
                          setExecutingActionId(action.id);
                          await actionService.executeAction(action);
                          setExecutingActionId(null);
                        }}
                        className={`w-full text-left p-3 rounded-xl border transition-all text-[10px] font-mono relative overflow-hidden ${executingActionId === action.id
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'
                          }`}
                      >
                        {executingActionId === action.id && (
                          <motion.div
                            layoutId="action-progress"
                            className="absolute inset-0 bg-cyan-500/10"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 3 }}
                          />
                        )}
                        <div className="relative z-10 flex justify-between items-center">
                          <span className="font-bold uppercase tracking-wider">{action.label}</span>
                          {executingActionId === action.id ? (
                            <Activity size={12} className="animate-spin" />
                          ) : (
                            <ShieldAlert size={12} />
                          )}
                        </div>
                        <div className="relative z-10 opacity-60 mt-1 truncate">
                          {action.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phase 101: Quantum Swarm Shield Visualizer */}
                <div className="p-6 bg-slate-900/50 backdrop-blur-md border border-indigo-500/30 rounded-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                      <ShieldAlert size={18} />
                    </div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">
                      {isZh ? '量子群體護盾' : 'Quantum Swarm Shield'}
                    </h4>
                  </div>

                  <div className="relative h-32 flex items-center justify-center">
                    <motion.div
                      animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute w-24 h-24 border-2 border-indigo-500/20 rounded-full"
                    />
                    <motion.div
                      animate={{
                        rotate: -360,
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute w-20 h-20 border border-cyan-500/40 rounded-full border-dashed"
                    />
                    <div className="text-center z-10">
                      <div className="text-2xl font-black text-indigo-400">{(resonance * 100).toFixed(0)}%</div>
                      <div className="text-[8px] text-slate-500 uppercase font-bold">Resonance Integrity</div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-[9px] font-mono">
                    <div className="text-slate-500">PQC ENTROPY:</div>
                    <div className="text-indigo-400 text-right">OPTIMAL</div>
                    <div className="text-slate-500">LATTICE DIM:</div>
                    <div className="text-indigo-400 text-right">256-V7</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-1">
                <VisionPortal />
              </div>
              <div className="lg:col-span-2">
                <SovereignServicePortal />
              </div>
            </div>

            {/* Purification Tasks Section */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-6 border-t border-white/10 pt-6"
                >
                  <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                    <span className="text-xl">⚡</span> 熵減淨化建議 (Purification Tasks)
                  </h3>
                  <div className="space-y-3">
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/5 hover:border-amber-500/30 transition-colors group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${suggestion.impact === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                              suggestion.impact === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                              {suggestion.impact}
                            </span>
                            <h4 className="font-bold text-gray-200">{suggestion.title}</h4>
                          </div>
                          {suggestion.isAutoFixable && (
                            <button className="text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full transition-colors">
                              自動修復
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 pl-1">{suggestion.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {activeTab === 'beta' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl overflow-hidden border border-slate-700/50"
          >
            <BetaLogicVerifier />
          </motion.div>
        )}

        {activeTab === 'sanctuary' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl overflow-hidden border border-slate-700/50"
          >
            <KnowledgeSanctuary />
          </motion.div>
        )}

        {activeTab === 'zone' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl overflow-hidden border border-slate-700/50"
          >
            <SustainabilitySpecialZone />
          </motion.div>
        )}

        <div className="mt-8">
          <ComplianceGuard />
        </div>
      </div>
    </div>
  );
};
