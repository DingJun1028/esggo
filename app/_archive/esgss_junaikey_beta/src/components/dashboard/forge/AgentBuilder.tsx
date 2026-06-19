import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { agentService } from '@/services/agentService';
import type { AgentRole, AgentDNA, AgentEquipment, EquipmentType, Language } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import { AttributeHexagon } from './AttributeHexagon';
import { EquipmentSlot } from './EquipmentSlot';
import { Button, Input, Badge } from '@/components/ui';
import { ArrowRight, ArrowLeft, Save, Loader2, Brain, Shield, RefreshCw, Dna } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGeneticInheritance } from '../../../hooks/useGeneticInheritance';
import { omniLogger, LogCategory } from '@/services/omniLogger';

// ==================== CONSTANTS ====================
const ROLES: readonly {
  readonly id: AgentRole;
  readonly label: { 'zh-TW': string; 'en-US': string };
  readonly description: { 'zh-TW': string; 'en-US': string };
  readonly baseStats: AgentDNA;
}[] = [
  {
    id: 'STRATEGIST',
    label: { 'zh-TW': '策略家', 'en-US': 'Strategist' },
    description: {
      'zh-TW': '長期規劃與遠見大師。',
      'en-US': 'Master of long-term planning and foresight.',
    },
    baseStats: {
      intelligence: 80,
      creativity: 70,
      empathy: 50,
      resilience: 60,
      precision: 60,
      speed: 40,
    },
  },
  {
    id: 'EXECUTOR',
    label: { 'zh-TW': '執行者', 'en-US': 'Executor' },
    description: {
      'zh-TW': '高速執行與行動力。',
      'en-US': 'High-speed implementation and action.',
    },
    baseStats: {
      intelligence: 50,
      creativity: 30,
      empathy: 20,
      resilience: 60,
      precision: 80,
      speed: 90,
    },
  },
  {
    id: 'ANALYST',
    label: { 'zh-TW': '分析師', 'en-US': 'Analyst' },
    description: {
      'zh-TW': '深度數據處理與模式識別。',
      'en-US': 'Deep data processing and pattern recognition.',
    },
    baseStats: {
      intelligence: 90,
      creativity: 40,
      empathy: 30,
      resilience: 50,
      precision: 95,
      speed: 60,
    },
  },
  {
    id: 'AUDITOR',
    label: { 'zh-TW': '審計師', 'en-US': 'Auditor' },
    description: {
      'zh-TW': '風險評估與合規驗證。',
      'en-US': 'Risk assessment and compliance verification.',
    },
    baseStats: {
      intelligence: 70,
      creativity: 20,
      empathy: 40,
      resilience: 80,
      precision: 90,
      speed: 50,
    },
  },
] as const;

const STEPS_CONTENT = {
  'zh-TW': ['身分', '屬性', '裝備', '覺醒'],
  'en-US': ['Identity', 'Attributes', 'Equipment', 'Awakening'],
} as const;

const INITIAL_POINTS = 10;
const MAX_STAT_VALUE = 100;
const MIN_STAT_VALUE = 0;

// ==================== TYPE DEFINITIONS ====================
interface AgentBuilderProps {
  readonly onCancel: () => void;
  readonly onComplete: () => void;
  readonly language?: Language;
}

type StepIndex = 0 | 1 | 2 | 3;

// ==================== UTILITY FUNCTIONS ====================
const calculatePowerRating = (dna: AgentDNA): number => {
  return Object.values(dna).reduce((sum, value) => sum + value, 0);
};

const getRoleByIdSafe = (roleId: AgentRole) => {
  return ROLES.find(r => r.id === roleId) ?? ROLES[0]!;
};

// ==================== SUB-COMPONENTS ====================
interface StepIndicatorProps {
  readonly step: StepIndex;
  readonly language: Language;
}

const StepSidebar = memo<StepIndicatorProps>(({ step, language }) => {
  const isZh = language === 'zh-TW';
  const steps = STEPS_CONTENT[isZh ? 'zh-TW' : 'en-US'];

  return (
    <aside className="w-64 bg-[#0E0E0E]/50 border border-gray-800 rounded-xl p-6 hidden lg:block">
      <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-6">
        {isZh ? '構建階段' : 'Construction Phase'}
      </h3>
      <nav className="space-y-6" role="navigation" aria-label="Agent construction steps">
        {steps.map((stepName, idx) => {
          const isActive = idx === step;
          const isComplete = idx < step;
          const statusClass = isActive
            ? 'text-cyan-400'
            : isComplete
              ? 'text-emerald-500'
              : 'text-gray-600';

          return (
            <div
              key={stepName}
              className={`flex items-center gap-3 ${statusClass}`}
              role="listitem"
            >
              <div
                className={`
                              w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border
                              ${
                                isActive
                                  ? 'border-cyan-400 bg-cyan-400/10'
                                  : isComplete
                                    ? 'border-emerald-500 bg-emerald-500/10'
                                    : 'border-gray-700 bg-gray-800'
                              }
                          `}
              >
                {idx + 1}
              </div>
              <span className="font-bold text-sm tracking-wide">{stepName}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
});

StepSidebar.displayName = 'StepSidebar';

interface RoleCardProps {
  readonly role: (typeof ROLES)[number];
  readonly isSelected: boolean;
  readonly onSelect: () => void;
  readonly language: Language;
}

const RoleCard = memo<RoleCardProps>(({ role, isSelected, onSelect, language }) => {
  const isZh = language === 'zh-TW';
  return (
    <button
      onClick={onSelect}
      className={`
              p-4 rounded-xl border text-left transition-all duration-300 relative overflow-hidden group
              ${isSelected ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-800 bg-[#0E0E0E] hover:border-gray-600'}
          `}
      role="radio"
      aria-checked={isSelected}
    >
      <div className="relative z-10">
        <h4 className={`font-bold text-lg mb-1 ${isSelected ? 'text-cyan-400' : 'text-gray-300'}`}>
          {isZh ? role.label['zh-TW'] : role.label['en-US']}
        </h4>
        <p className="text-xs text-gray-500">
          {isZh ? role.description['zh-TW'] : role.description['en-US']}
        </p>
      </div>
      {isSelected && <div className="absolute inset-0 bg-cyan-500/5 blur-xl" aria-hidden="true" />}
    </button>
  );
});

RoleCard.displayName = 'RoleCard';

interface StatControlProps {
  readonly stat: keyof AgentDNA;
  readonly value: number;
  readonly canIncrease: boolean;
  readonly onIncrement: () => void;
  readonly onDecrement: () => void;
  readonly language: Language;
}

const StatControl = memo<StatControlProps>(
  ({ stat, value, canIncrease, onIncrement, onDecrement, language }) => {
    const isZh = language === 'zh-TW';
    return (
      <div className="bg-[#0E0E0E] p-3 rounded-lg border border-gray-800 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-300 capitalize">{stat}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={onDecrement}
            className="w-8 h-8 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label={isZh ? `降低 ${stat}` : `Decrease ${stat}`}
          >
            -
          </button>
          <span
            className="w-8 text-center font-mono font-bold"
            aria-label={`${stat} value: ${value}`}
          >
            {value}
          </span>
          <button
            onClick={onIncrement}
            disabled={!canIncrease}
            className="w-8 h-8 rounded bg-gray-800 hover:bg-cyan-900 text-cyan-400 flex items-center justify-center disabled:opacity-30 disabled:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label={isZh ? `增加 ${stat}` : `Increase ${stat}`}
          >
            +
          </button>
        </div>
      </div>
    );
  }
);

StatControl.displayName = 'StatControl';

const BlueprintCard = memo<{
  blueprint: {
    id: string;
    parentName: string;
    attributes: { computePower: number; empathyLevel: number; governanceScore: number };
  };
  isSelected: boolean;
  onSelect: () => void;
  language: Language;
}>(({ blueprint, isSelected, onSelect, language }) => {
  const isZh = language === 'zh-TW';
  return (
    <button
      onClick={onSelect}
      className={`p-4 rounded-xl border text-left transition-all ${isSelected ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-800 bg-black/40 hover:border-gray-600'}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-mono text-emerald-400">{blueprint.id}</span>
        <Dna size={12} className={isSelected ? 'text-emerald-500' : 'text-gray-600'} />
      </div>
      <h4 className="text-xs font-black text-white uppercase">{blueprint.parentName}</h4>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div className="text-[9px] text-emerald-500/80">C:+{blueprint.attributes.computePower}</div>
        <div className="text-[9px] text-emerald-500/80">E:+{blueprint.attributes.empathyLevel}</div>
        <div className="text-[9px] text-emerald-500/80">
          G:+{blueprint.attributes.governanceScore}
        </div>
      </div>
    </button>
  );
});

BlueprintCard.displayName = 'BlueprintCard';

// ==================== MAIN COMPONENT ====================
export const AgentBuilder = memo<AgentBuilderProps>(
  ({ onCancel, onComplete, language = 'zh-TW' }) => {
    const isZh = language === 'zh-TW';
    const steps = STEPS_CONTENT[isZh ? 'zh-TW' : 'en-US'];

    const [step, setStep] = useState<StepIndex>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [role, setRole] = useState<AgentRole>('STRATEGIST');
    const [dna, setDna] = useState<AgentDNA>(ROLES[0]!.baseStats);
    const [points, setPoints] = useState(INITIAL_POINTS);
    const [selectedEquip, setSelectedEquip] = useState<{ [key in EquipmentType]?: AgentEquipment }>(
      {}
    );
    const [selectedBlueprintId, setSelectedBlueprintId] = useState<string | null>(null);

    const { blueprints } = useGeneticInheritance();

    const { addToast } = useToast();

    // Update base stats when role changes
    useEffect(() => {
      const selectedRole = getRoleByIdSafe(role) ?? ROLES[0]!;
      setDna(selectedRole.baseStats);
      setPoints(INITIAL_POINTS);
    }, [role]);

    const handleStatChange = useCallback(
      (stat: keyof AgentDNA, delta: number) => {
        if (delta > 0 && points <= 0) return;
        if (delta > 0 && dna[stat] >= MAX_STAT_VALUE) return;
        if (delta < 0 && dna[stat] <= MIN_STAT_VALUE) return;

        setDna(prev => ({ ...prev, [stat]: prev[stat] + delta }));
        setPoints(prev => prev - delta);
      },
      [points, dna]
    );

    const applyBlueprint = useCallback(
      (bpId: string) => {
        const bp = blueprints.find(b => b.id === bpId);
        if (!bp) return;

        setSelectedBlueprintId(bpId);
        // Apply bonuses (Additive)
        setDna(prev => ({
          ...prev,
          intelligence: prev.intelligence + bp.attributes.computePower,
          empathy: prev.empathy + bp.attributes.empathyLevel,
          resilience: prev.resilience + bp.attributes.governanceScore,
          precision: prev.precision + Math.floor(bp.attributes.computePower / 2),
          creativity: prev.creativity + Math.floor(bp.attributes.empathyLevel / 2),
        }));
      },
      [blueprints]
    );

    const handleReset = useCallback(() => {
      const selectedRole = getRoleByIdSafe(role);
      if (!selectedRole) return;
      setDna(selectedRole.baseStats);
      setPoints(INITIAL_POINTS);
    }, [role]);

    const handleCreate = useCallback(async () => {
      setIsLoading(true);
      try {
        await agentService.createAgent({
          name: name || (isZh ? '未命名單位' : 'Unnamed Unit'),
          role,
          description: isZh
            ? `透過創世紀引擎創建的自定義 ${role.toLowerCase()} 代理。`
            : `Custom ${role.toLowerCase()} agent created via Genesis Engine.`,
          status: 'TRAINING',
          dna,
          skills: [],
          equipment: {
            weapon: selectedEquip.WEAPON,
            armor: selectedEquip.ARMOR,
            accessory: selectedEquip.ACCESSORY,
            artifact: selectedEquip.ARTIFACT,
          },
          titles: [],
          avatarColor: agentService.getRoleColor(role),
          avatarHistory: [],
          isAwakened: false,
        });
        onComplete();
        addToast({
          type: 'success',
          message: isZh
            ? `單位 ${name || '未命名'} 已成功鍛造。`
            : `Unit ${name || 'Unnamed'} has been successfully forged.`,
        });
      } catch (error) {
        omniLogger.error(LogCategory.AGENT, 'Failed to create agent', { error });
        addToast({
          type: 'error',
          message: isZh
            ? '鍛造新代理單位失敗。請重試。'
            : 'Failed to forge new agent unit. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    }, [name, role, dna, selectedEquip, onComplete, addToast, isZh]);

    const nextStep = useCallback(() => {
      setStep(prev => Math.min(prev + 1, steps.length - 1) as StepIndex);
    }, [steps.length]);

    const prevStep = useCallback(() => {
      setStep(prev => Math.max(prev - 1, 0) as StepIndex);
    }, []);

    const powerRating = useMemo(() => calculatePowerRating(dna), [dna]);
    const canProceed = useMemo(() => step !== 0 || name.trim().length > 0, [step, name]);

    return (
      <div className="h-full flex gap-6" role="dialog" aria-labelledby="agent-builder-title">
        <StepSidebar step={step} language={language} />

        <div className="flex-1 bg-[#1A1A1A] border border-gray-800 rounded-xl flex flex-col overflow-hidden">
          {/* Header */}
          <header className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0E0E0E]">
            <div>
              <h2 id="agent-builder-title" className="text-2xl font-bold text-white tracking-tight">
                {isZh ? '代理構建' : 'Agent Construction'}
              </h2>
              <p className="text-gray-500 text-sm" aria-live="polite">
                {isZh ? '階段' : 'Step'} {step + 1}: {steps[step]}
              </p>
            </div>
            <AttributeHexagon dna={dna} size={60} showLabels={false} className="opacity-50" />
          </header>

          {/* Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            {step === 0 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <label htmlFor="agent-name" className="text-xs uppercase font-bold text-gray-500">
                    {isZh ? '代號 (名稱)' : 'Designation (Name)'}
                  </label>
                  <Input
                    id="agent-name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={isZh ? '例如：奧米加核心' : 'e.g. Omega Prime'}
                    className="bg-[#0E0E0E] border-gray-700 text-xl font-mono text-cyan-400 h-14"
                    aria-required="true"
                  />
                </div>

                <div
                  role="radiogroup"
                  aria-label="Agent role selection"
                  className="grid grid-cols-2 gap-4"
                >
                  {ROLES.map(r => (
                    <RoleCard
                      key={r.id}
                      role={r}
                      isSelected={role === r.id}
                      onSelect={() => setRole(r.id)}
                      language={language}
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black text-gray-500 flex items-center gap-2">
                    <Dna size={14} className="text-emerald-500" />
                    {isZh ? '基因繼承 (可選)' : 'Genetic Inheritance (Optional)'}
                  </label>
                  {blueprints.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-gray-800 text-center text-gray-600 text-[10px] uppercase font-bold">
                      {isZh
                        ? '無可用藍圖。請先從 10 級代理中提取。'
                        : 'No blueprints available. Extract from Lv10 agents first.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 max-h-[150px] overflow-y-auto pr-2 scrollbar-thin">
                      {blueprints.map(bp => (
                        <BlueprintCard
                          key={bp.id}
                          blueprint={bp}
                          isSelected={selectedBlueprintId === bp.id}
                          onSelect={() => applyBlueprint(bp.id)}
                          language={language}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0E0E0E] rounded-xl border border-gray-800">
                  <AttributeHexagon dna={dna} size={300} />
                  <div className="mt-6 text-center">
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">
                      {isZh ? '可用點數' : 'Available Points'}
                    </p>
                    <span className="text-4xl font-bold text-cyan-400" aria-live="polite">
                      {points}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  {(Object.keys(dna) as Array<keyof AgentDNA>).map(stat => (
                    <StatControl
                      key={stat}
                      stat={stat}
                      value={dna[stat]}
                      canIncrease={points > 0}
                      onIncrement={() => handleStatChange(stat, 1)}
                      onDecrement={() => handleStatChange(stat, -1)}
                      language={language}
                    />
                  ))}
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full mt-4 border-gray-700 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <RefreshCw size={14} className="mr-2" />{' '}
                    {isZh ? '重設屬性' : 'Reset Attributes'}
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center py-10">
                <div
                  className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700"
                  aria-hidden="true"
                >
                  <Shield size={32} className="text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-300 mb-2">
                  {isZh ? '裝備負載' : 'Equipment Loadout'}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  {isZh
                    ? '新代理的初始裝備目前僅限於標準化裝備。高級神器資產稍後可在符文熔爐鍛造。'
                    : 'Initial equipment is currently locked to standard issue gear for new agents. Advanced artifacts can be forged later in the Rune Forge.'}
                </p>

                <div className="flex justify-center gap-4" role="list">
                  <EquipmentSlot type="WEAPON" />
                  <EquipmentSlot type="ARMOR" />
                  <EquipmentSlot type="ACCESSORY" />
                  <EquipmentSlot type="ARTIFACT" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center justify-center h-full animate-in zoom-in-95 duration-500">
                <div className="w-32 h-32 rounded-full flex items-center justify-center relative mb-8">
                  <div
                    className="absolute inset-0 bg-cyan-500/20 blur-2xl animate-pulse"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite]"
                    aria-hidden="true"
                  />
                  <Brain size={64} className="text-cyan-400 relative z-10" />
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">
                  {name || (isZh ? '未命名代理' : 'Unnamed Agent')}
                </h2>
                <Badge className="bg-gray-800 text-gray-300 border-gray-600 mb-8 text-lg px-4 py-1">
                  {role}
                </Badge>

                <div className="grid grid-cols-2 gap-8 text-center max-w-lg w-full">
                  <div className="bg-[#0E0E0E] p-4 rounded-xl border border-gray-800">
                    <div className="text-gray-500 text-xs uppercase mb-1">
                      {isZh ? '戰力指數' : 'Power Rating'}
                    </div>
                    <div
                      className="text-2xl font-bold text-emerald-400"
                      aria-label={`Power rating: ${powerRating}`}
                    >
                      {powerRating}
                    </div>
                  </div>
                  <div className="bg-[#0E0E0E] p-4 rounded-xl border border-gray-800">
                    <div className="text-gray-500 text-xs uppercase mb-1">
                      {isZh ? '潛能' : 'Potential'}
                    </div>
                    <div className="text-2xl font-bold text-purple-400">S-Class</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <footer className="p-6 border-t border-gray-800 bg-[#0E0E0E] flex justify-between">
            {step === 0 ? (
              <Button
                variant="ghost"
                onClick={onCancel}
                className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {isZh ? '取消' : 'Cancel'}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={prevStep}
                className="border-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <ArrowLeft size={16} className="mr-2" /> {isZh ? '返回' : 'Back'}
              </Button>
            )}

            {step < steps.length - 1 ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed}
                className="bg-cyan-600 hover:bg-cyan-500 text-white min-w-[120px] focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {isZh ? '下一步' : 'Next'} <ArrowRight size={16} className="ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white min-w-[150px] shadow-[0_0_20px_rgba(16,185,129,0.3)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    {isZh ? '覺醒中...' : 'Awakening...'}
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    {isZh ? '覺醒代理' : 'Awaken Agent'}
                  </>
                )}
              </Button>
            )}
          </footer>
        </div>
      </div>
    );
  }
);

AgentBuilder.displayName = 'AgentBuilder';
