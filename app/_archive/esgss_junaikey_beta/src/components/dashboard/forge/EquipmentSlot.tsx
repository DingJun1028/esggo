import React, { memo, useMemo } from 'react';
import { Sword, Shield, Gem, Zap } from 'lucide-react';
import { AgentEquipment, EquipmentType, Rarity } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui';

// ==================== CONSTANTS ====================
const RARITY_COLORS: Readonly<Record<Rarity, string>> = {
  COMMON: '#9CA3AF',
  UNCOMMON: '#10B981',
  RARE: '#3B82F6',
  EPIC: '#A855F7',
  LEGENDARY: '#F59E0B',
  MYTHIC: '#EF4444',
} as const;

const RARITY_BG: Readonly<Record<Rarity, string>> = {
  COMMON: 'bg-gray-500/10',
  UNCOMMON: 'bg-emerald-500/10',
  RARE: 'bg-blue-500/10',
  EPIC: 'bg-purple-500/10',
  LEGENDARY: 'bg-orange-500/10',
  MYTHIC: 'bg-red-500/10',
} as const;

const TYPE_ICONS: Readonly<Record<EquipmentType, React.ReactElement>> = {
  WEAPON: <Sword size={18} />,
  ARMOR: <Shield size={18} />,
  ACCESSORY: <Gem size={18} />,
  ARTIFACT: <Zap size={18} />,
} as const;

// ==================== TYPE DEFINITIONS ====================
interface EquipmentSlotProps {
  readonly type: EquipmentType;
  readonly equipment?: AgentEquipment;
  readonly onClick?: () => void;
  readonly className?: string;
  readonly isActive?: boolean;
}

interface SlotStyles {
  readonly rarityColor: string;
  readonly bgColor: string;
  readonly borderColor: string;
}

// ==================== SUB-COMPONENTS ====================
interface EquipmentTooltipProps {
  readonly equipment: AgentEquipment;
}

const EquipmentTooltip = memo<EquipmentTooltipProps>(({ equipment }) => {
  const rarityColor = RARITY_COLORS[equipment.rarity];

  return (
    <TooltipContent className="bg-[#0E0E0E] border-gray-800 p-0 overflow-hidden w-64 shadow-xl">
      <header
        className="p-3 border-b border-white/10"
        style={{ backgroundColor: `${rarityColor}1A` }}
      >
        <h4 className="font-bold text-sm" style={{ color: rarityColor }}>
          {equipment.name}
        </h4>
        <span className="text-[10px] uppercase tracking-wider text-gray-400">
          {equipment.rarity} {equipment.type}
        </span>
      </header>

      <div className="p-3 space-y-2">
        <p className="text-xs text-gray-300 italic">"{equipment.description}"</p>

        <div className="space-y-1 pt-2 border-t border-white/5">
          {Object.entries(equipment.stats).map(([stat, val]) => (
            <div key={stat} className="flex justify-between text-xs">
              <span className="text-gray-500 capitalize">{stat}</span>
              <span className="text-cyan-400 font-mono">+{val}</span>
            </div>
          ))}
        </div>

        {equipment.specialEffect && (
          <div className="mt-2 pt-2 border-t border-white/10 text-xs text-yellow-500">
            <span className="font-bold">✨ Effect:</span> {equipment.specialEffect}
          </div>
        )}
      </div>
    </TooltipContent>
  );
});

EquipmentTooltip.displayName = 'EquipmentTooltip';

const EmptyTooltip = memo<{ type: EquipmentType }>(({ type }) => (
  <TooltipContent>
    <p className="text-xs">Empty {type.toLowerCase()} slot</p>
  </TooltipContent>
));

EmptyTooltip.displayName = 'EmptyTooltip';

// ==================== MAIN COMPONENT ====================
export const EquipmentSlot = memo<EquipmentSlotProps>(
  ({ type, equipment, onClick, className = '', isActive = false }) => {
    const isEmpty = !equipment;

    const styles = useMemo<SlotStyles>(() => {
      if (!equipment) {
        return {
          rarityColor: '#374151',
          bgColor: 'bg-[#1A1A1A]',
          borderColor: isActive ? '#06B6D4' : '#1F2937',
        };
      }

      return {
        rarityColor: RARITY_COLORS[equipment.rarity],
        bgColor: RARITY_BG[equipment.rarity],
        borderColor: isActive ? '#06B6D4' : RARITY_COLORS[equipment.rarity],
      };
    }, [equipment, isActive]);

    const icon = useMemo(() => TYPE_ICONS[type], [type]);

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            onClick={onClick}
            className={`
                        relative w-16 h-16 rounded-xl border-2 flex items-center justify-center transition-all duration-300
                        ${styles.bgColor} ${className}
                        hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black
                    `}
            style={{ borderColor: styles.borderColor }}
            aria-label={`${type} slot${equipment ? `: ${equipment.name}` : ' (empty)'}`}
          >
            <div
              className={`transition-colors duration-300 ${isEmpty ? 'text-gray-700' : 'text-white'}`}
              aria-hidden="true"
            >
              {icon}
            </div>

            {!isEmpty && (
              <div
                className="absolute inset-0 rounded-xl blur-md opacity-20"
                style={{ backgroundColor: styles.rarityColor }}
                aria-hidden="true"
              />
            )}

            <div className="absolute -bottom-2 bg-black px-1.5 rounded text-[8px] font-bold text-gray-500 uppercase tracking-wider">
              {type}
            </div>
          </TooltipTrigger>

          {equipment ? <EquipmentTooltip equipment={equipment} /> : <EmptyTooltip type={type} />}
        </Tooltip>
      </TooltipProvider>
    );
  }
);

EquipmentSlot.displayName = 'EquipmentSlot';
