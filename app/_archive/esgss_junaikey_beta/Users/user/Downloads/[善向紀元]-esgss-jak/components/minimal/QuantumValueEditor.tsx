
import React, { useState } from 'react';
import { Edit3, Check } from 'lucide-react';

export const QuantumValueEditor: React.FC<{ 
  value: string | number; 
  theme?: any; 
  onEditStart?: () => void;
  onUpdate?: (newValue: string | number) => void;
}> = ({ value, theme, onEditStart, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleStart = (e: any) => {
    e.stopPropagation();
    setIsEditing(true);
    onEditStart?.();
  };

  const handleSave = (e?: any) => {
    e?.stopPropagation();
    setIsEditing(false);
    if (tempValue !== value) {
      onUpdate?.(tempValue);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 animate-fade-in z-20 relative" onClick={e => e.stopPropagation()}>
        <input 
          autoFocus
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          className="w-24 bg-black/40 border border-white/20 rounded px-2 py-0.5 text-lg font-bold text-white outline-none focus:border-celestial-emerald"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') setIsEditing(false);
          }}
          aria-label="Edit Value"
        />
        <button onClick={handleSave} className="p-1 hover:text-emerald-400"><Check className="w-4 h-4"/></button>
      </div>
    );
  }

  return (
    <div 
        className="relative flex items-center gap-2 group/value cursor-pointer z-10" 
        onClick={handleStart}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleStart(e); }}
        aria-label={`Edit value: ${tempValue}`}
    >
      <span className={`text-2xl lg:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover/value:to-white transition-all`}>
        {tempValue}
      </span>
      <Edit3 className="w-3 h-3 text-gray-600 opacity-0 group-hover/value:opacity-100 transition-opacity" />
    </div>
  );
};
