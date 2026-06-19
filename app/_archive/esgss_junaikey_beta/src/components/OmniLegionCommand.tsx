/**
 * 奧秘軍團指揮中心 (Omni Legion Command)
 *
 * Best Practice Refactoring:
 * 1.  **Component Decomposition**: Broke down the monolithic component into smaller, focused sub-components
 *     (e.g., `LegionFormationPanel`, `LegionListPanel`, `MissionControl`) for better readability and maintainability.
 * 2.  **State & Prop Management**: Centralized state in the main `OmniLegionCommand` and passed down only necessary props and callbacks.
 *     This clarifies data flow.
 * 3.  **User Feedback**: Replaced disruptive `alert()` calls with a non-blocking `Notification` component for a smoother user experience.
 * 4.  **Robust ID Generation**: Switched from `Date.now()` to `crypto.randomUUID()` for creating unique, collision-resistant IDs for missions and strategies.
 * 5.  **Code Readability**:
 *     -   **CSS Class Helpers**: Created functions like `getFormationButtonClass` to manage complex conditional styling, improving JSX clarity without adding dependencies.
 *     -   **Constants**: Defined a `UI_TEXT` object for UI strings, making the code easier to maintain and preparing it for future localization.
 * 6.  **Type Safety**: Ensured all props and state are strongly typed.
 * 7.  **Memoization**: Kept `React.memo` on components like `LegionCard` where performance is a consideration.
 */
import React, { useState, useMemo, useCallback, FC, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Target,
  Shield,
  Zap,
  Play,
  X,
  Info,
  CheckCircle,
  TrendingUp,
  Pause,
} from 'lucide-react';
import {
  LegionFormation,
  FORMATION_CONFIGS,
  MissionObjective,
  MissionType,
  MissionPriority,
  BattleStrategy,
  StrategyType,
  Legion,
} from '../types';
import { omniLegionCoordinator } from '../services/OmniLegionCoordinator';
import { avatarOrchestrator } from '../services/OmniAvatarOrchestrator';
import { useOmniLegion } from '../store/useOmniLegion';
import type { Agent } from '../types';
import { DateTime, ActiveAvatar } from '../types';
import { omniLogger, LogCategory } from '../services/omniLogger';
import { FeatureGuide } from './dashboard/FeatureGuide';
import { LegionDebate } from './dashboard/LegionDebate';

// ==================== CONSTANTS & MAPPINGS ====================

const NOTIFICATION_TIMEOUT_MS = 5000;

const MISSION_TYPE_MAP: Record<MissionType, string> = {
  [MissionType.ANALYSIS]: '數據分析',
  [MissionType.DEVELOPMENT]: '系統開發',
  [MissionType.DEBUGGING]: '調試修復',
  [MissionType.OPTIMIZATION]: '性能優化',
  [MissionType.MONITORING]: '系統監控',
  [MissionType.RESEARCH]: '深度研究',
  [MissionType.RECOVERY]: '災難恢復',
};

const PRIMARY_MISSION_TYPES: MissionType[] = [
  MissionType.ANALYSIS,
  MissionType.DEVELOPMENT,
  MissionType.DEBUGGING,
  MissionType.OPTIMIZATION,
  MissionType.MONITORING,
];

const MISSION_PRIORITY_MAP: Record<MissionPriority, string> = {
  [MissionPriority.LOW]: '低',
  [MissionPriority.MEDIUM]: '中',
  [MissionPriority.HIGH]: '高',
  [MissionPriority.CRITICAL]: '緊急',
  [MissionPriority.EMERGENCY]: '危急',
};

const UI_TEXT = {
  mainTitle: '⚔️ 奧秘軍團指揮中心',
  mainDescription: '組建您的精英軍團，執行戰略任務',
  formLegionTitle: '組建新軍團',
  legionNameLabel: '軍團名稱',
  legionNamePlaceholder: '輸入軍團名稱...',
  formationLabel: '選擇陣型',
  agentLabel: '選擇代理成員',
  formLegionButton: '⚔️ 組建軍團',
  formingLegionButton: '組建中...',
  existingLegionsTitle: '現有軍團',
  noLegions: '尚未組建任何軍團',
  activeLegionDetails: '活躍軍團詳情',
  missionControlTitle: '任務控制台',
  newMissionNameLabel: '新任務名稱',
  newMissionNamePlaceholder: '輸入任務目標...',
  missionTypeLabel: '任務類型',
  dispatchButton: '派遣軍團',
  dispatchingButton: '派遣中...',
  executeStrategyButton: '執行戰術行動',
  executingStrategyButton: '執行中...',
};

const DEFAULT_AGGRESSIVE_STRATEGY_TEMPLATE: Omit<BattleStrategy, 'strategyId'> = {
  name: '快速突擊協議',
  type: StrategyType.AGGRESSIVE,
  description: '最大化速度與效率',
  parameters: { riskTolerance: 80, parallelism: 5, communicationFreq: 60, decisionSpeed: 90 },
  suitableFor: ['assault', 'blitz'],
  successCriteria: { minSuccessRate: 0.8 },
};

// ==================== TYPES ====================

interface OmniLegionCommandProps {
  availableAgents: Agent[];
}

type NotificationType = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
};

// ==================== CSS CLASS HELPERS ====================

const getFormationButtonClass = (formation: LegionFormation, selected: LegionFormation) =>
  `p-3 rounded border-2 transition-all text-left ${selected === formation
    ? 'border-purple-500 bg-purple-900/30'
    : 'border-gray-700 bg-gray-900 hover:border-gray-600'
  }`;

const getAgentButtonClass = (isSelected: boolean, isAwakened: boolean) =>
  `p-3 rounded border-2 transition-all text-left ${isSelected
    ? 'border-green-500 bg-green-900/30'
    : isAwakened
      ? 'border-gray-700 bg-gray-900 hover:border-gray-600'
      : 'border-gray-800 bg-gray-900/50 opacity-50 cursor-not-allowed'
  }`;

// ==================== SUB-COMPONENTS ====================

const Notification: FC<{ notification: NotificationType | null; onDismiss: () => void }> = ({
  notification,
  onDismiss,
}) => (
  <AnimatePresence>
    {notification && (
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] p-4 rounded-lg shadow-2xl flex items-center gap-4 text-white"
        style={{
          background:
            notification.type === 'success'
              ? 'linear-gradient(135deg, #10B981, #059669)'
              : notification.type === 'error'
                ? 'linear-gradient(135deg, #EF4444, #DC2626)'
                : 'linear-gradient(135deg, #3B82F6, #2563EB)',
        }}
      >
        {notification.type === 'success' && <CheckCircle className="w-6 h-6" />}
        {notification.type === 'error' && <X className="w-6 h-6" />}
        {notification.type === 'info' && <Info className="w-6 h-6" />}
        <span className="font-semibold">{notification.message}</span>
        <button
          onClick={onDismiss}
          className="ml-4 opacity-80 hover:opacity-100"
          aria-label="Dismiss notification"
        >
          <X className="w-5 h-5" />
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

const LegionCard: FC<{ legion: Legion; isActive: boolean; onClick: (id: string) => void }> =
  React.memo(({ legion, isActive, onClick }) => (
    <motion.div
      layout
      className={`p-4 rounded border-2 cursor-pointer transition-all ${isActive
          ? 'border-yellow-500 bg-yellow-900/20'
          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
        }`}
      onClick={() => onClick(legion.legionId)}
      whileHover={{ scale: 1.02 }}
    >
      <div className="font-bold text-white mb-1">{legion.name}</div>
      <div className="text-xs text-gray-400 mb-2">{legion.motto}</div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">
          {legion.members.length} 成員 | {FORMATION_CONFIGS[legion.formation].displayName}
        </span>
        <span
          className={`px-2 py-1 rounded font-semibold ${legion.legion_status === 'ready'
              ? 'bg-green-900/30 text-green-400'
              : 'bg-blue-900/30 text-blue-400'
            }`}
        >
          {legion.legion_status.toUpperCase()}
        </span>
      </div>
    </motion.div>
  ));
LegionCard.displayName = 'LegionCard';

const LegionFormationPanel: FC<{
  legionName: string;
  setLegionName: (name: string) => void;
  selectedFormation: LegionFormation;
  setSelectedFormation: (formation: LegionFormation) => void;
  selectedAgents: Agent[];
  availableAgents: Agent[];
  handleAgentToggle: (agent: Agent) => void;
  handleFormLegion: () => void;
  isFormingLegion: boolean;
}> = ({
  legionName,
  setLegionName,
  selectedFormation,
  setSelectedFormation,
  selectedAgents,
  availableAgents,
  handleAgentToggle,
  handleFormLegion,
  isFormingLegion,
}) => (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Users className="w-5 h-5" />
        {UI_TEXT.formLegionTitle}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            {UI_TEXT.legionNameLabel}
          </label>
          <input
            type="text"
            value={legionName}
            onChange={e => setLegionName(e.target.value)}
            placeholder={UI_TEXT.legionNamePlaceholder}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            {UI_TEXT.formationLabel}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.values(LegionFormation).map(formation => {
              const config = FORMATION_CONFIGS[formation];
              return (
                <button
                  key={formation}
                  onClick={() => setSelectedFormation(formation)}
                  className={getFormationButtonClass(formation, selectedFormation)}
                >
                  <div className="font-semibold text-sm text-white">{config.displayName}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {config.minAgents}-{config.maxAgents} 人
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            {UI_TEXT.agentLabel} ({selectedAgents.length} / {availableAgents.length})
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto p-1">
            {availableAgents.map(agent => (
              <motion.button
                key={agent.id}
                onClick={() => handleAgentToggle(agent)}
                className={getAgentButtonClass(
                  selectedAgents.some(a => a.id === agent.id),
                  agent.isAwakened
                )}
                whileHover={agent.isAwakened ? { scale: 1.02 } : {}}
                whileTap={agent.isAwakened ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-white">{agent.name}</div>
                    <div className="text-xs text-gray-400">
                      Lv.{agent.level} {agent.role}
                    </div>
                  </div>
                  {selectedAgents.some(a => a.id === agent.id) ? (
                    <Zap className="w-4 h-4 text-green-400" />
                  ) : (
                    !agent.isAwakened && <Shield className="w-4 h-4 text-gray-600" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
        <button
          onClick={handleFormLegion}
          disabled={isFormingLegion || selectedAgents.length === 0 || !legionName.trim()}
          className="w-full py-3 rounded font-bold text-white transition-all bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed"
        >
          {isFormingLegion ? UI_TEXT.formingLegionButton : UI_TEXT.formLegionButton}
        </button>
      </div>
    </div>
  );

const FormationDetails: FC<{ formation: LegionFormation }> = ({ formation }) => {
  const config = FORMATION_CONFIGS[formation];
  return (
    <motion.div
      key={formation}
      className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h4 className="text-lg font-bold text-white mb-3">{config.displayName} - 陣型詳情</h4>
      <p className="text-gray-400 mb-4 text-sm">{config.description}</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {Object.entries(config.bonuses).map(([key, value]) => (
          <div key={key}>
            <div className="text-sm text-gray-500 capitalize">{key.replace('Bonus', '')} 加成</div>
            <div className="text-lg font-bold text-cyan-400">+{value}%</div>
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-400">
        <span className="text-red-400 font-semibold">弱點:</span> {config.weaknesses.join('、')}
      </div>
    </motion.div>
  );
};

const LegionListPanel: FC<{
  legions: Legion[];
  activeLegionId: string | null;
  setActiveLegion: (id: string) => void;
}> = ({ legions, activeLegionId, setActiveLegion }) => (
  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <Shield className="w-5 h-5" />
      {UI_TEXT.existingLegionsTitle} ({legions.length})
    </h3>
    {legions.length === 0 ? (
      <p className="text-gray-500 text-center py-8">{UI_TEXT.noLegions}</p>
    ) : (
      <div className="space-y-2">
        {legions.map(legion => (
          <LegionCard
            key={legion.legionId}
            legion={legion}
            isActive={activeLegionId === legion.legionId}
            onClick={setActiveLegion}
          />
        ))}
      </div>
    )}
  </div>
);

const ActiveLegionPanel: FC<{ legion: Legion }> = ({ legion }) => (
  <motion.div
    layout
    className="bg-gradient-to-br from-yellow-900/20 to-red-900/20 rounded-lg p-6 border border-yellow-500/30"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <h4 className="text-lg font-bold text-yellow-300 mb-3">{UI_TEXT.activeLegionDetails}</h4>
    <div className="space-y-2 text-sm">
      <div>
        <span className="text-gray-400">等級:</span>{' '}
        <span className="text-white font-bold">Lv.{legion.level}</span>
      </div>
      <div>
        <span className="text-gray-400">聲望:</span>{' '}
        <span className="text-yellow-400 font-bold">{legion.reputation}/100</span>
      </div>
      <div>
        <span className="text-gray-400">成功率:</span>{' '}
        <span className="text-green-400 font-bold">
          {(legion.stats.averageSuccessRate * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  </motion.div>
);

const MissionControl: FC<{
  activeLegion: Legion;
  isProcessing: boolean;
  missionName: string;
  setMissionName: (name: string) => void;
  missionType: MissionType;
  setMissionType: (type: MissionType) => void;
  handleAssignMission: () => void;
  handleExecuteStrategy: () => void;
}> = ({
  activeLegion,
  isProcessing,
  missionName,
  setMissionName,
  missionType,
  setMissionType,
  handleAssignMission,
  handleExecuteStrategy,
}) => (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Target className="w-5 h-5" />
        {UI_TEXT.missionControlTitle}
      </h3>
      {activeLegion.legion_status !== 'in_mission' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              {UI_TEXT.newMissionNameLabel}
            </label>
            <input
              type="text"
              value={missionName}
              onChange={e => setMissionName(e.target.value)}
              placeholder={UI_TEXT.newMissionNamePlaceholder}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              {UI_TEXT.missionTypeLabel}
            </label>
            <div className="flex flex-wrap gap-2">
              {PRIMARY_MISSION_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setMissionType(type)}
                  className={`px-3 py-1 rounded text-xs transition-colors ${missionType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                >
                  {MISSION_TYPE_MAP[type]}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleAssignMission}
            disabled={isProcessing || !missionName}
            className="w-full py-2 rounded font-bold text-white transition-all bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            {isProcessing ? UI_TEXT.dispatchingButton : UI_TEXT.dispatchButton}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded text-center">
            <div className="text-blue-400 font-bold mb-1">
              正在執行: {activeLegion.activeMissions[0]?.name}
            </div>
            <div className="text-xs text-gray-400">
              優先級:{' '}
              {activeLegion.activeMissions[0]?.priority
                ? MISSION_PRIORITY_MAP[activeLegion.activeMissions[0].priority]
                : '未知'}
            </div>
          </div>
          <button
            onClick={handleExecuteStrategy}
            disabled={isProcessing}
            className="w-full py-3 rounded font-bold text-white transition-all flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-yellow-700"
          >
            <Play className="w-4 h-4" />
            {isProcessing ? UI_TEXT.executingStrategyButton : UI_TEXT.executeStrategyButton}
          </button>
        </div>
      )}
    </div>
  );

// ==================== MAIN COMPONENT ====================

export const OmniLegionCommand: FC<OmniLegionCommandProps> = ({ availableAgents }) => {
  const { legions, activeLegionId, addLegion, setActiveLegion, updateLegion } = useOmniLegion();

  // Local UI State
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([]);
  const [selectedFormation, setSelectedFormation] = useState<LegionFormation>(
    LegionFormation.BALANCED
  );
  const [legionName, setLegionName] = useState<string>('');
  const [missionName, setMissionName] = useState<string>('');
  const [missionType, setMissionType] = useState<MissionType>(MissionType.ANALYSIS);
  const [notification, setNotification] = useState<NotificationType | null>(null);

  // Process State
  const [isFormingLegion, setIsFormingLegion] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Modal State
  const [showDebate, setShowDebate] = useState<boolean>(false);

  // Derived State
  const activeLegion = useMemo(
    () => (activeLegionId ? legions.get(activeLegionId) : null),
    [activeLegionId, legions]
  );
  const allLegions = useMemo(() => Array.from(legions.values()), [legions]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = crypto.randomUUID();
    setNotification({ id, message, type });
    setTimeout(
      () => setNotification(prev => (prev?.id === id ? null : prev)),
      NOTIFICATION_TIMEOUT_MS
    );
  };

  const handleAgentToggle = useCallback((agent: Agent) => {
    if (!agent.isAwakened) {
      showNotification(`${agent.name} 尚未覺醒，無法加入軍團`, 'info');
      return;
    }
    setSelectedAgents(prev =>
      prev.find(a => a.id === agent.id) ? prev.filter(a => a.id !== agent.id) : [...prev, agent]
    );
  }, []);

  const handleFormLegion = useCallback(async () => {
    const formationConfig = FORMATION_CONFIGS[selectedFormation];
    if (selectedAgents.length === 0) return showNotification('請至少選擇一名代理', 'error');
    if (selectedAgents.length < formationConfig.minAgents)
      return showNotification(
        `${formationConfig.displayName} 陣型至少需要 ${formationConfig.minAgents} 名代理`,
        'error'
      );
    if (!legionName.trim()) return showNotification('請輸入軍團名稱', 'error');

    setIsFormingLegion(true);
    try {
      const avatarMap = new Map<string, ActiveAvatar>();
      for (const agent of selectedAgents) {
        const avatar = await avatarOrchestrator.getActiveAvatar(agent.id);
        if (avatar) avatarMap.set(agent.id, avatar);
      }

      const legion = await omniLegionCoordinator.formLegion(
        legionName,
        selectedAgents,
        avatarMap,
        selectedFormation
      );
      addLegion(legion);
      setActiveLegion(legion.legionId);

      setSelectedAgents([]);
      setLegionName('');

      showNotification(`軍團 "${legion.name}" 組建成功！`, 'success');
      omniLogger.info(LogCategory.LEGION, `軍團 "${legion.name}" 組建成功！`, {
        legionId: legion.legionId,
      });
    } catch (error) {
      omniLogger.error(LogCategory.LEGION, '組建軍團失敗', { error });
      showNotification('組建軍團失敗', 'error');
    } finally {
      setIsFormingLegion(false);
    }
  }, [legionName, selectedAgents, selectedFormation, addLegion, setActiveLegion]);

  const handleAssignMission = useCallback(() => {
    if (!activeLegion || !missionName.trim()) return;
    setShowDebate(true);
  }, [activeLegion, missionName]);

  const handleDebateComplete = useCallback(
    async (coherence: number) => {
      if (!activeLegion) return;

      setIsProcessing(true);
      try {
        const mission: MissionObjective = {
          missionId: `mission-${crypto.randomUUID()}`,
          name: missionName,
          type: missionType,
          priority: MissionPriority.HIGH,
          description: `由指揮官分配的 ${missionType} 任務`,
          requirements: { minAgents: 1, estimatedDuration: 5000, complexity: 5 },
          parameters: { coherenceBonus: coherence / 100 },
          successCriteria: { completionRate: 100, qualityScore: 80 },
          createdAt: new DateTime(),
        };

        await omniLegionCoordinator.assignMission(activeLegion.legionId, mission);
        const updatedLegion = omniLegionCoordinator.getLegion(activeLegion.legionId);
        if (updatedLegion) updateLegion(activeLegion.legionId, updatedLegion);

        setMissionName('');
        showNotification(`任務 "${mission.name}" 已成功派遣！`, 'success');
        omniLogger.info(LogCategory.LEGION, `任務分配成功: ${mission.name}`, {
          missionId: mission.missionId,
        });
        setTimeout(() => setShowDebate(false), 1500);
      } catch (error) {
        omniLogger.error(LogCategory.LEGION, '分配任務失敗', { error });
        showNotification('分配任務失敗', 'error');
      } finally {
        setIsProcessing(false);
      }
    },
    [activeLegion, missionName, missionType, updateLegion]
  );

  const handleExecuteStrategy = useCallback(async () => {
    if (!activeLegion) return;

    setIsProcessing(true);
    try {
      const strategy: BattleStrategy = {
        ...DEFAULT_AGGRESSIVE_STRATEGY_TEMPLATE,
        strategyId: `strat-${crypto.randomUUID()}`,
      };

      const result = await omniLegionCoordinator.executeStrategy(activeLegion.legionId, strategy);
      const updatedLegion = omniLegionCoordinator.getLegion(activeLegion.legionId);
      if (updatedLegion) updateLegion(activeLegion.legionId, updatedLegion);

      showNotification(`策略執行完成: ${result.metrics.efficiency.toFixed(1)}% 效率`, 'success');
      omniLogger.info(LogCategory.LEGION, `策略執行完成: ${result.metrics.efficiency}% 效率`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      omniLogger.error(LogCategory.LEGION, '執行策略失敗', { error });
      showNotification(`執行策略失敗: ${errorMessage}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [activeLegion, updateLegion]);

  return (
    <div className="omni-legion-command p-6 relative">
      <Notification notification={notification} onDismiss={() => setNotification(null)} />

      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
            {UI_TEXT.mainTitle}
          </h2>
          <p className="text-gray-400 mt-2">{UI_TEXT.mainDescription}</p>
        </div>
        <FeatureGuide
          title="Omni Legion Command"
          description="The central command hub for assembling elite agent squads (Legions) and dispatching them on high-impact missions."
          benefits={[
            'Collective Intelligence: Solves problems faster than single agents.',
            'Strategic Formations: Optimize squads for speed, defense, or efficiency.',
            'Automated Execution: Dispatch legions on background missions.',
          ]}
          howToUse={[
            'Select Agents: Choose awakened agents for your roster.',
            'Choose Formation: Select a formation that matches your mission goal.',
            "Form Legion: Name your legion and click 'Form Legion'.",
            'Assign Mission: Use the Mission Control panel to assign tasks to the active legion.',
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LegionFormationPanel
            legionName={legionName}
            setLegionName={setLegionName}
            selectedFormation={selectedFormation}
            setSelectedFormation={setSelectedFormation}
            selectedAgents={selectedAgents}
            availableAgents={availableAgents}
            handleAgentToggle={handleAgentToggle}
            handleFormLegion={handleFormLegion}
            isFormingLegion={isFormingLegion}
          />
          <FormationDetails formation={selectedFormation} />
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {showDebate && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
              >
                <div className="w-full max-w-2xl">
                  <LegionDebate
                    agents={
                      activeLegion?.members.map(m => ({ id: m.agent.id, name: m.agent.name })) || []
                    }
                    missionName={missionName}
                    onConsensusReached={handleDebateComplete}
                  />
                  {isProcessing && (
                    <div className="mt-4 w-full py-3 bg-white/10 text-white rounded-xl font-bold text-center">
                      部署中...
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <LegionListPanel
            legions={allLegions}
            activeLegionId={activeLegionId}
            setActiveLegion={setActiveLegion}
          />

          {activeLegion && <ActiveLegionPanel legion={activeLegion} />}

          {activeLegion && (
            <MissionControl
              activeLegion={activeLegion}
              isProcessing={isProcessing}
              missionName={missionName}
              setMissionName={setMissionName}
              missionType={missionType}
              setMissionType={setMissionType}
              handleAssignMission={handleAssignMission}
              handleExecuteStrategy={handleExecuteStrategy}
            />
          )}
        </div>
      </div>
    </div>
  );
};
