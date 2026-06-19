import React from 'react';
import { useAgentRpg } from '../../hooks/useAgentRpg';
import { RpgItem, ItemType } from '../../types/rpg';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '../../components/ui';

export const InventoryGrid: React.FC = () => {
  const { inventoryItems, equipItem, profile } = useAgentRpg();

  const renderItem = (item: RpgItem) => {
    const isEquipped = Object.values(profile.equipment).includes(item.id);

    return (
      <div
        key={item.id}
        onClick={() => equipItem(item.type.toLowerCase() as any, item.id)}
        className={`
                    group relative flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all
                    ${
                      isEquipped
                        ? 'bg-emerald-900/30 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                        : 'bg-slate-900 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                    }
                `}
      >
        {isEquipped && (
          <Badge className="absolute top-1 right-1 h-4 bg-emerald-600 text-[9px] px-1 pointer-events-none">
            E
          </Badge>
        )}

        <div
          className={`
                    text-2xl mb-2 filter drop-shadow-md
                    ${item.rarity === 'Legendary' ? 'text-amber-300' : ''}
                    ${item.rarity === 'Epic' ? 'text-purple-400' : ''}
                    ${item.rarity === 'Rare' ? 'text-blue-400' : ''}
                `}
        >
          {/* Placeholder Icons based on text, in real app use item.icon image url */}
          {item.type === 'Weapon' ? '⚔️' : item.type === 'Armor' ? '🛡️' : '💍'}
        </div>

        <div className="text-xs font-bold text-slate-200 text-center w-full truncate">
          {item.name}
        </div>
        <div className="text-[10px] text-slate-500 mt-1 uppercase">{item.type}</div>

        {/* Hover Stats */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 rounded-lg text-center z-10 pointer-events-none">
          <p className="text-xs text-slate-300 mb-1">{item.description}</p>
          {item.modifiers &&
            Object.entries(item.modifiers).map(([k, v]) => (
              <span key={k} className="text-[10px] text-emerald-400 flex gap-1">
                +{v} {k.slice(0, 3)}
              </span>
            ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full bg-slate-950 border-slate-800">
      <CardHeader className="py-3">
        <CardTitle className="text-sm uppercase text-slate-400 tracking-wider">
          Inventory Storage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {inventoryItems.map(renderItem)}
          {/* Empty Slots */}
          {Array.from({ length: 8 - inventoryItems.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="aspect-square bg-slate-900/50 rounded-lg border border-slate-800 border-dashed flex items-center justify-center opacity-30"
            >
              <span className="text-2xl text-slate-700">+</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
