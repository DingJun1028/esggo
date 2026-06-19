import React, { useState, useEffect } from 'react';
import { socialEconomyService } from '../services/socialEconomyService';
import { PartnerVisual } from '../../shared/types';

export const PartnerEvolution: React.FC = () => {
  const [visual, setVisual] = useState<PartnerVisual | null>(null);
  const [isEvolving, setIsEvolving] = useState(false);

  useEffect(() => {
    loadVisual();
  }, []);

  const loadVisual = async () => {
    const data = await socialEconomyService.getPartnerVisual('partner_1');
    setVisual(data);
  };

  const handleEvolve = async () => {
    setIsEvolving(true);
    setTimeout(async () => {
      const newVisual = await socialEconomyService.evolvePartner('partner_1');
      setVisual(newVisual);
      setIsEvolving(false);
    }, 3000); // 3 seconds animation
  };

  if (!visual) return <div className="text-white p-8">Loading DNA...</div>;

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#050510] relative overflow-hidden text-white p-8">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-[#0B0E14] to-[#0B0E14]"></div>

      <div className="z-10 text-center mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500 mb-2">
          夥伴進化 (Partner Evolution)
        </h1>
        <p className="text-slate-400">隨著您的職涯成長，您的夥伴也將獲得新的型態</p>
      </div>

      <div className="relative z-10 w-full max-w-md aspect-[3/4] bg-slate-900/50 border border-slate-700 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl">
        {/* Aura */}
        <div
          className="absolute inset-0 blur-3xl opacity-30 transition-colors duration-1000"
          style={{ backgroundColor: visual.auraColor }}
        ></div>

        {/* Character Visualization */}
        <div
          className={`relative transition-all duration-1000 ${isEvolving ? 'scale-0 opacity-0 blur-xl' : 'scale-100 opacity-100'}`}
        >
          <div className="text-9xl animate-bounce-slow">
            {visual.variant.includes('forest')
              ? '🌿'
              : visual.variant.includes('tech')
                ? '🤖'
                : visual.variant.includes('gaia')
                  ? '🧚'
                  : '👻'}
          </div>
          {visual.accessoryId && (
            <div className="absolute -top-4 -right-4 text-4xl animate-pulse">
              {visual.accessoryId.includes('drone')
                ? '🛸'
                : visual.accessoryId.includes('stag')
                  ? '🦌'
                  : '⭐'}
            </div>
          )}
        </div>

        {/* Evolution Effect Overlay */}
        {isEvolving && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-white animate-ping opacity-20"></div>
            <div className="text-4xl font-bold text-cyan-400 animate-pulse">EVOLVING...</div>
          </div>
        )}

        <div className="absolute bottom-6 left-0 w-full text-center">
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Current Form</div>
          <div className="text-2xl font-bold text-white shadow-black drop-shadow-lg">
            {visual.variant.replace('_', ' ').toUpperCase()}
          </div>
          <div className="text-xs text-emerald-400 mt-1">{visual.stage}</div>
        </div>
      </div>

      <button
        onClick={handleEvolve}
        disabled={isEvolving || visual.stage === 'FORM_3'}
        className="mt-8 px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-full font-bold shadow-lg shadow-emerald-500/30 hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
      >
        {isEvolving
          ? '進化中...'
          : visual.stage === 'FORM_3'
            ? '已達最終型態'
            : '注入能量進化 (Mock)'}
      </button>
    </div>
  );
};
