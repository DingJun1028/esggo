
import React from 'react';
import { QuantumAiTrigger } from './QuantumAiTrigger';

interface QuantumSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  color?: 'emerald' | 'purple' | 'gold' | 'blue';
  onAiPrediction?: () => void;
}

export const QuantumSlider: React.FC<QuantumSliderProps> = ({
  label, value, min, max, step = 1, unit = '', onChange, color = 'emerald', onAiPrediction
}) => {
  
  const percentage = ((value - min) / (max - min)) * 100;

  const colors = {
    emerald: 'accent-emerald-500 from-emerald-500 to-emerald-300',
    purple: 'accent-purple-500 from-purple-500 to-purple-300',
    gold: 'accent-amber-500 from-amber-500 to-amber-300',
    blue: 'accent-blue-500 from-blue-500 to-blue-300',
  };

  return (
    <div className="space-y-3 group">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-300 font-medium group-hover:text-white transition-colors">{label}</span>
        <div className="flex items-center gap-2">
          {onAiPrediction && <QuantumAiTrigger onClick={onAiPrediction} />}
          <span className="font-mono text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">
            {value} {unit}
          </span>
        </div>
      </div>
      <div className="relative h-2 w-full bg-slate-800 rounded-full border border-white/10">
        <div 
          className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${colors[color]} opacity-80`} 
          style={{ width: `${percentage}%` }}
        />
        <div 
          className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] cursor-grab active:cursor-grabbing hover:scale-125 transition-transform z-10`}
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={value} 
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
      </div>
    </div>
  );
};
