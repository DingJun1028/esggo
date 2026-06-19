import React, { useState, useMemo, useCallback } from 'react';
import { omniLogger } from '@/omni/infrastructure/logging/OmniLogger';

import { motion } from 'framer-motion';
import { Users, Target, Shield, Zap, Play, Activity } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOmniLegion } from '../../store/useOmniLegion';
import { omniLogger, LogCategory } from '../../services/omniLogger';
import { omniLegionCoordinator } from '../../services/OmniLegionCoordinator';
import { avatarOrchestrator } from '../../services/OmniAvatarOrchestrator';
import {
  LegionFormation,
  FORMATION_CONFIGS,
  MissionType,
  MissionPriority,
  Agent,
} from '../../types';

// ==================== BILINGUAL TEXT MAPPING ====================
const TEXT = {
  TITLE: { zh: 'Omni 智慧軍團總部', en: 'Omni Intelligence Legion H.Q.' },
  SUBTITLE: {
    zh: '指揮您的 AI 代理人，管理覺醒牌組，進行深度研究',
    en: 'Command your AI agents, manage Awakening Decks, and conduct deep research.',
  },
  SECTIONS: {
    FORM: { zh: '組建軍團', en: 'Form Legion' },
    ACTIVE: { zh: '現有軍團', en: 'Active Legions' },
    MISSION: { zh: '任務控制', en: 'Mission Control' },
  },
  LABELS: {
    NAME_INPUT: { zh: '輸入軍團名稱...', en: 'Enter Legion Name...' },
    MISSION_INPUT: { zh: '輸入任務目標...', en: 'Enter Mission Objective...' },
    FORMATION: { zh: '選擇陣型', en: 'Select Formation' },
    AGENTS: { zh: '選擇代理人', en: 'Select Agents' },
    NO_AGENTS: { zh: '尚未覺醒', en: 'Not Awakened' },
    READY: { zh: '待命', en: 'READY' },
    BUSY: { zh: '任務中', en: 'BUSY' },
  },
  ACTIONS: {
    CREATE: { zh: '組建軍團', en: 'Form Legion' },
    DISPATCH: { zh: '派遣任務', en: 'Dispatch Mission' },
    EXECUTE: { zh: '執行戰術', en: 'Execute Tactic' },
    FORMING: { zh: '組建中...', en: 'Forming...' },
  },
};

const FORMATION_NAMES: Record<string, { zh: string; en: string }> = {
  [LegionFormation.VANGUARD]: { zh: '先鋒突擊陣', en: 'Vanguard Assault' },
  [LegionFormation.IRONCLAD]: { zh: '鐵壁防禦陣', en: 'Ironclad Defense' },
  [LegionFormation.BALANCED]: { zh: '均衡標準陣', en: 'Balanced Standard' },
  [LegionFormation.NETWORK]: { zh: '神經網絡陣', en: 'Neural Network' },
  [LegionFormation.SHADOW]: { zh: '暗影潛伏陣', en: 'Shadow Stealth' },
};

// ==================== SUB-COMPONENTS ====================

const AgentCard = ({
  agent,
  selected,
  onClick,
  isZh,
}: {
  agent: Agent;
  selected: boolean;
  onClick: () => void;
  isZh: boolean;
}) => (
  <div
    onClick={agent.isAwakened ? onClick : undefined}
    className={`
            p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 relative overflow-hidden group
            ${selected ? 'bg-purple-500/20 border-purple-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}
            ${!agent.isAwakened ? 'opacity-50 grayscale cursor-not-allowed' : ''}
        `}
  >
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
            ${selected ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400'}
        `}
    >
      {agent.name.charAt(0)}
    </div>
    <div className="flex-1">
      <div className="font-bold text-white text-sm">{agent.name}</div>
      <div className="text-[10px] text-slate-400 font-mono">
        Lv.{agent.level} | {agent.role}
      </div>
    </div>
    {selected && (
      <div className="absolute right-2 top-2 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_#a855f7]" />
    )}
  </div>
);

// ==================== MAIN MODULE ====================

export const LegionModule: React.FC<{ availableAgents?: Agent[] }> = ({ availableAgents = [] }) => {
  const { language } = useLanguage();
  const isZh = language === 'zh-TW';

  // Logic from OmniLegionCommand
  const { legions, activeLegionId, addLegion, setActiveLegion, updateLegion } = useOmniLegion();
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([]);
  const [selectedFormation, setSelectedFormation] = useState<LegionFormation>(
    LegionFormation.BALANCED
  );
  const [legionName, setLegionName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mission State
  const [missionName, setMissionName] = useState('');
  const [missionType, setMissionType] = useState<MissionType>(MissionType.ANALYSIS);

  const activeLegion = useMemo(
    () => (activeLegionId ? legions.get(activeLegionId) : null),
    [activeLegionId, legions]
  );
  const allLegions = useMemo(() => Array.from(legions.values()), [legions]);

  const handleToggleAgent = (agent: Agent) => {
    if (selectedAgents.find(a => a.id === agent.id)) {
      setSelectedAgents(prev => prev.filter(a => a.id !== agent.id));
    } else {
      setSelectedAgents(prev => [...prev, agent]);
    }
  };

  const handleFormLegion = async () => {
    if (!legionName || selectedAgents.length === 0) return;
    setIsProcessing(true);
    try {
      // Mock map for demo
      const avatarMap = new Map();
      const legion = await omniLegionCoordinator.formLegion(
        legionName,
        selectedAgents,
        avatarMap,
        selectedFormation
      );
      addLegion(legion);
      setActiveLegion(legion.legionId);
      setLegionName('');
      setSelectedAgents([]);
    } catch (e) {
      omniLogger.error(LogCategory.SYSTEM, '[LegionModule] Error', { error: e });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full h-full p-6 flex flex-col gap-6 text-white overflow-hidden relative">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
            <Users className="text-purple-400" />
            {isZh ? TEXT.TITLE.zh : TEXT.TITLE.en}
          </h2>
          <p className="text-slate-400 text-sm mt-1 ml-1">
            {isZh ? TEXT.SUBTITLE.zh : TEXT.SUBTITLE.en}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-mono">
          <Activity size={12} /> SYSTEM ONLINE
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Left Panel: Formation */}
        <div className="col-span-4 bg-slate-900/50 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          <h3 className="font-bold text-purple-300 flex items-center gap-2">
            <Shield size={16} /> {isZh ? TEXT.SECTIONS.FORM.zh : TEXT.SECTIONS.FORM.en}
          </h3>

          <div className="space-y-4">
            <input
              type="text"
              placeholder={isZh ? TEXT.LABELS.NAME_INPUT.zh : TEXT.LABELS.NAME_INPUT.en}
              value={legionName}
              onChange={e => setLegionName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 outline-none"
            />

            <div>
              <label className="text-xs text-slate-500 mb-2 block">
                {isZh ? TEXT.LABELS.FORMATION.zh : TEXT.LABELS.FORMATION.en}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(LegionFormation).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormation(fmt)}
                    className={`p-2 rounded-lg text-xs border transition-all truncate
                                            ${selectedFormation === fmt ? 'bg-purple-600 border-purple-400 text-white' : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-400'}
                                        `}
                  >
                    {isZh ? FORMATION_NAMES[fmt]?.zh || fmt : FORMATION_NAMES[fmt]?.en || fmt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-2 block">
                {isZh ? TEXT.LABELS.AGENTS.zh : TEXT.LABELS.AGENTS.en}
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2">
                {availableAgents.map(agent => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    isZh={isZh}
                    selected={selectedAgents.some(a => a.id === agent.id)}
                    onClick={() => handleToggleAgent(agent)}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleFormLegion}
              disabled={isProcessing || !legionName || selectedAgents.length === 0}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]"
            >
              {isProcessing
                ? isZh
                  ? TEXT.ACTIONS.FORMING.zh
                  : TEXT.ACTIONS.FORMING.en
                : isZh
                  ? TEXT.ACTIONS.CREATE.zh
                  : TEXT.ACTIONS.CREATE.en}
            </button>
          </div>
        </div>

        {/* Middle Panel: Active Legions */}
        <div className="col-span-4 bg-slate-900/50 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          <h3 className="font-bold text-blue-300 flex items-center gap-2">
            <Users size={16} /> {isZh ? TEXT.SECTIONS.ACTIVE.zh : TEXT.SECTIONS.ACTIVE.en}
          </h3>

          {allLegions.map(legion => (
            <div
              key={legion.legionId}
              onClick={() => setActiveLegion(legion.legionId)}
              className={`p-4 rounded-xl border cursor-pointer transition-all
                                ${activeLegionId === legion.legionId ? 'bg-blue-900/20 border-blue-400' : 'bg-white/5 border-white/10 hover:border-white/20'}
                            `}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-white">{legion.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded border ${legion.state === 'ready' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-900' : 'bg-orange-900/30 text-orange-400 border-orange-900'}`}
                >
                  {legion.state === 'ready'
                    ? isZh
                      ? TEXT.LABELS.READY.zh
                      : TEXT.LABELS.READY.en
                    : isZh
                      ? TEXT.LABELS.BUSY.zh
                      : TEXT.LABELS.BUSY.en}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex justify-between">
                <span>{legion.members.length} Agents</span>
                <span>Lv.{legion.level}</span>
              </div>
            </div>
          ))}

          {allLegions.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-slate-600 text-sm italic border-2 border-dashed border-white/5 rounded-xl">
              {isZh ? '暫無活躍軍團' : 'No Active Legions'}
            </div>
          )}
        </div>

        {/* Right Panel: Command Details */}
        <div className="col-span-4 bg-slate-900/50 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
          <h3 className="font-bold text-pink-300 flex items-center gap-2">
            <Target size={16} /> {isZh ? TEXT.SECTIONS.MISSION.zh : TEXT.SECTIONS.MISSION.en}
          </h3>

          {activeLegion ? (
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10 rounded-xl">
                <div className="text-xs text-slate-400 mb-1">COMMANDING</div>
                <div className="text-xl font-bold text-white">{activeLegion.name}</div>
                <div className="flex gap-4 mt-4 text-center">
                  <div>
                    <div className="text-xs text-slate-500">Reputation</div>
                    <div className="text-lg font-mono text-yellow-400">
                      {activeLegion.reputation}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Success</div>
                    <div className="text-lg font-mono text-emerald-400">
                      {(activeLegion.stats.averageSuccessRate * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder={isZh ? TEXT.LABELS.MISSION_INPUT.zh : TEXT.LABELS.MISSION_INPUT.en}
                  value={missionName}
                  onChange={e => setMissionName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-pink-500 outline-none"
                />

                <div className="flex flex-wrap gap-2">
                  {Object.values(MissionType)
                    .slice(0, 3)
                    .map(t => (
                      <button
                        key={t}
                        onClick={() => setMissionType(t)}
                        className={`px-3 py-1 text-[10px] rounded border transition-all ${missionType === t ? 'bg-pink-600 border-pink-400 text-white' : 'bg-white/5 border-slate-700 text-slate-400'}`}
                      >
                        {t}
                      </button>
                    ))}
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-pink-500/20 transition-all flex items-center justify-center gap-2">
                  <Zap size={18} />
                  {isZh ? TEXT.ACTIONS.DISPATCH.zh : TEXT.ACTIONS.DISPATCH.en}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <Users size={48} className="opacity-20 mb-4" />
              <p className="text-center text-sm max-w-[200px]">
                {isZh
                  ? '請先選擇或組建一個軍團以發布命令'
                  : 'Select or form a Legion to issue commands'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
