/**
 * 🛠️ 奧秘精靈鑄造場 / Omni - Sprite Forge
 * --------------------------------------------------
 * [系列] V6 覺醒架構(V6 Awakening Architecture)
 * [TC] 奧秘精靈的生命週期管理中心。利用君愛元鑰(JunAiKey) 的語義矩陣進行靈魂校準與覺醒。
 * [EN] Life - cycle management center for Omni - Sprites. Utilizes JunAiKey's
 * semantic matrix for soul calibration and awakening.
 */
import { memo, useState, useCallback, useEffect } from 'react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { agentService } from '@/services/agentService';
import { type Agent, type AvatarPersona, type Language } from '@/types';
import { AgentList } from './forge/AgentList';
import { AgentBuilder } from './forge/AgentBuilder';
import { AgentDetailView } from './forge/AgentDetailView';
import { AquaButton } from '@/components/ui/AquaButton';
import { BentoCard } from '@/components/ui/BentoCard';
import { Bot, Plus, RefreshCw, Sparkles, Dna } from 'lucide-react';
import { OmniAvatarGallery } from '../OmniAvatarGallery';
import { OmniAwakeningRitual } from '../OmniAwakeningRitual';
import { GeneticForge } from './GeneticForge';
import { useToast } from '@/contexts/ToastContext';
import { omniLogger, LogCategory } from '@/services/omniLogger';
import { cn } from '@/utils/cn';

// ==================== TYPE DEFINITIONS ====================
type ViewMode = 'LIST' | 'CREATE' | 'DETAILS' | 'GENETIC';

// ==================== SUB-COMPONENTS ====================
interface HeaderProps {
  readonly view: ViewMode;
  readonly onRefresh: () => void;
  readonly onCreateClick: () => void;
  readonly onGeneticClick: () => void;
  readonly isLoading?: boolean;
  readonly language: Language;
}

const ForgeHeader = memo<HeaderProps>(
  ({ view, onRefresh, onCreateClick, onGeneticClick, isLoading = false, language }) => {
    const isZh = language === 'zh-TW';
    return (
      <BentoCard
        className="flex items-center justify-between p-6 rounded-[2rem] sticky top-0 z-10 border-white/10"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-aqua-400 to-aqua-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.4)]"
            aria-hidden="true"
          >
            <Bot size={28} className="text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white flex items-center gap-3">
              {isZh ? '奧秘精靈養成室' : 'Omni-Sprite Nurture Room'}
              <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-mono font-bold tracking-widest uppercase shadow-lg shadow-purple-500/5">
                Soul-Level: Sovereign
              </div>
            </h1>
            <p className="text-[10px] text-aqua-400 font-mono tracking-[0.2em] uppercase font-bold mt-1">
              JunAiKey Semantic Matrix // {isZh ? '靈魂培育與成長模組' : 'Sentient Life-Cycle Management'}
            </p>
          </div>
        </div>

        {view === 'LIST' && (
          <div className="flex gap-3">
            <AquaButton
              variant="ghost"
              onClick={onGeneticClick}
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 border border-purple-500/20"
            >
              <Dna size={16} className="mr-2" />
              {isZh ? '基因研究' : 'Genetic Research'}
            </AquaButton>
            <AquaButton
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="text-gray-500 hover:text-aqua-400"
              aria-label={isZh ? '刷新精靈列表' : 'Refresh sprites list'}
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </AquaButton>
            <AquaButton
              variant="primary"
              onClick={onCreateClick}
              className="shadow-[0_0_20px_rgba(0,255,255,0.3)]"
              aria-label={isZh ? '初始化新精靈' : 'Initialize New Sprite'}
            >
              <Plus size={16} className="mr-2" aria-hidden="true" />
              {isZh ? '初始化精靈' : 'Initialize Sprite'}
            </AquaButton>
          </div>
        )}
      </BentoCard>
    );
  }
);

ForgeHeader.displayName = 'ForgeHeader';

interface PlaceholderDetailProps {
  readonly onBack: () => void;
  readonly language: Language;
}

const PlaceholderDetail = memo<PlaceholderDetailProps>(({ onBack, language }) => {
  const isZh = language === 'zh-TW';
  return (
    <BentoCard className="flex flex-col items-center justify-center h-96 text-center p-12 border-dashed border-aqua-500/20 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-3xl rounded-[3rem] group">
      <div className="w-24 h-24 rounded-full bg-aqua-500/10 flex items-center justify-center mb-8 border border-aqua-500/20 group-hover:scale-110 transition-transform duration-700 shadow-[0_0_50px_rgba(0,255,255,0.1)]">
        <Sparkles size={48} className="text-aqua-400 animate-pulse" />
      </div>
      <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">
        {isZh ? '精靈核心校準中' : 'Sprite Core Calibration'}
      </h3>
      <p className="text-gray-400 max-w-md mb-10 leading-relaxed font-medium">
        {isZh
          ? '正在利用君愛元鑰(JunAiKey) 語義矩陣進行深度數據具象化。此精靈的核心指標可視化即將完成。'
          : 'Deep data crystallization through JunAiKey Semantic Matrix is in progress. Core metrics visualization starting soon.'}
      </p>
      <AquaButton variant="primary" size="lg" onClick={onBack} className="rounded-2xl px-12 h-14 font-black shadow-xl shadow-aqua-500/20">
        {isZh ? '返回聖殿列表' : 'Back to Sanctuary'}
      </AquaButton>
    </BentoCard>
  );
});
PlaceholderDetail.displayName = 'PlaceholderDetail';

interface AgentForgeProps {
  language?: Language;
}

// ==================== MAIN COMPONENT ====================
export const AgentForge = memo<AgentForgeProps>(({ language = 'zh-TW' }) => {
  const isZh = language === 'zh-TW';
  const [view, setView] = useState<ViewMode>('LIST');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Awakening State
  const [awakeningAgent, setAwakeningAgent] = useState<Agent | null>(null);
  const [isSelectingPersona, setIsSelectingPersona] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [isPerformingRitual, setIsPerformingRitual] = useState(false);
  const { addToast } = useToast();

  const loadAgents = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await agentService.getAgents();
      setAgents(data);
    } catch (error) {
      omniLogger.error(LogCategory.UI, 'Failed to load agents in Forge', { error });
      addToast({
        type: 'error',
        message: isZh ? '無法加載精靈列表' : 'Failed to load sprite list',
      });
    } finally {
      setIsLoading(false);
    }
  }, [addToast, isZh]);

  const handleCreateClick = useCallback(() => {
    setView('CREATE');
  }, []);

  const handleBuilderComplete = useCallback(async () => {
    await loadAgents();
    setView('LIST');
  }, [loadAgents]);

  const handleBuilderCancel = useCallback(() => {
    setView('LIST');
  }, []);

  const handleAgentSelect = useCallback((agent: Agent) => {
    omniLogger.info(LogCategory.UI, 'Agent selected in Forge', {
      agentId: agent.id,
      name: agent.name,
    });
    setSelectedAgent(agent);
    setView('DETAILS');
  }, []);

  const handleAwakenClick = useCallback((agent: Agent) => {
    setAwakeningAgent(agent);
    setIsSelectingPersona(true);
  }, []);

  const handlePersonaSelect = useCallback((personaId: string) => {
    setSelectedPersonaId(personaId);
    setIsSelectingPersona(false);
    setIsPerformingRitual(true);
  }, []);

  const handleRitualComplete = useCallback(
    async (success: boolean) => {
      setIsPerformingRitual(false);
      setAwakeningAgent(null);
      setSelectedPersonaId(null);
      if (success) {
        await loadAgents();
      }
    },
    [loadAgents]
  );

  const handleRitualCancel = useCallback(() => {
    setIsPerformingRitual(false);
    setAwakeningAgent(null);
    setSelectedPersonaId(null);
  }, []);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  return (
    <ErrorBoundary componentName="AgentForge">
      <div
        className="h-full flex flex-col gap-8 animate-in fade-in duration-700 relative overflow-hidden"
        role="main"
        aria-labelledby="agent-forge-heading"
      >
        {/* Phase 21: Sentient Aura */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 transition-all duration-1000"
          style={{ background: 'var(--omni-aura)' }}
        />

        <ForgeHeader
          view={view}
          onRefresh={loadAgents}
          onCreateClick={handleCreateClick}
          onGeneticClick={() => setView('GENETIC')}
          isLoading={isLoading}
          language={language}
        />

        {/* Philosophical Alignment / Vision Wings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-80 px-2">
          <div className="flex flex-col space-y-3 p-6 border-l-4 border-aqua-500/50 bg-gradient-to-r from-aqua-500/10 to-transparent rounded-r-3xl backdrop-blur-sm group hover:from-aqua-500/20 transition-all duration-700">
            <span className="text-xs uppercase tracking-[0.3em] text-aqua-400 font-black flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-aqua-400 animate-ping" />
              自然共鳴律 / Natural Resonance
            </span>
            <p className="text-sm text-gray-400 font-medium italic tracking-wide leading-relaxed">
              「道法自然，系統毅然，上善若水，善向永續。」
            </p>
          </div>
          <div className="flex flex-col space-y-3 p-6 border-r-4 border-purple-500/50 bg-gradient-to-l from-purple-500/10 to-transparent rounded-l-3xl backdrop-blur-sm text-right group hover:from-purple-500/20 transition-all duration-700">
            <span className="text-xs uppercase tracking-[0.3em] text-purple-400 font-black flex items-center gap-2 justify-end">
              誠信閉環律 / Integrity Closed-Loop
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
            </span>
            <p className="text-sm text-gray-400 font-medium italic tracking-wide leading-relaxed">
              「以終為始，始終如一，無始無終，善向永續。」
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 pb-6">
          {view === 'LIST' ? (
            <AgentList
              agents={agents}
              onSelect={handleAgentSelect}
              onCreateNew={handleCreateClick}
              onAwaken={handleAwakenClick}
              isLoading={isLoading}
              language={language}
            />
          ) : view === 'CREATE' ? (
            <div className="h-full">
              <AgentBuilder
                onCancel={handleBuilderCancel}
                onComplete={handleBuilderComplete}
                language={language}
              />
            </div>
          ) : view === 'DETAILS' && selectedAgent ? (
            <AgentDetailView
              agent={selectedAgent}
              onBack={() => {
                setView('LIST');
                setSelectedAgent(null);
              }}
              language={language}
            />
          ) : view === 'GENETIC' ? (
            <div className="h-full">
              <AquaButton
                variant="ghost"
                onClick={() => setView('LIST')}
                className="mb-4 text-gray-500 hover:text-white"
              >
                {isZh ? '← 返回列表' : '← Back to List'}
              </AquaButton>
              <GeneticForge language={language} />
            </div>
          ) : null}
        </div>

        {/* Persona Selection Modal */}
        {isSelectingPersona && awakeningAgent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-10">
            <div className="bg-gray-900 w-full max-w-6xl h-[80vh] rounded-2xl flex flex-col border border-purple-500/30 overflow-hidden">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-purple-900/50 to-blue-900/50">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {isZh ? '選擇覺醒人格' : 'Select Awakening Persona'}
                  </h2>
                  <p className="text-purple-300">
                    {isZh
                      ? `為 ${awakeningAgent.name} 選擇一個靈魂形態`
                      : `Select a soul form for ${awakeningAgent.name}`}
                  </p>
                </div>
                <AquaButton variant="ghost" onClick={() => setIsSelectingPersona(false)}>
                  {isZh ? '取消' : 'Cancel'}
                </AquaButton>
              </div>
              <div className="flex-1 overflow-hidden p-6">
                <OmniAvatarGallery onSelectPersona={handlePersonaSelect} language={language} />
              </div>
            </div>
          </div>
        )}

        {/* Awakening Ritual */}
        {isPerformingRitual && awakeningAgent && selectedPersonaId && (
          <OmniAwakeningRitual
            agent={awakeningAgent}
            targetPersonaId={selectedPersonaId}
            onComplete={handleRitualComplete}
            onCancel={handleRitualCancel}
            language={language}
          />
        )}
      </div>
    </ErrorBoundary>
  );
});

AgentForge.displayName = 'AgentForge';
