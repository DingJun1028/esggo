import React, { useMemo } from 'react';

import { OMNI_PERSONA_DECK, OMNI_SKILL_DECK } from '../../data/omni-awakening-deck';
import LAYOUT_MATRIX from '../../data/layout-matrix.json';
import { FeatureGuide } from './FeatureGuide';
import { OmniCard } from '../cards/OmniCard';

/**
 * 🎭 OmniAwakeningDeck
 * --------------------------------------------------
 * Visualizes the 15 Personas (Thousand Faces) and Skill Cards.
 */
export const OmniAwakeningDeck: React.FC = () => {
  // Layout Protocol
  const gridSystem = LAYOUT_MATRIX.layout_protocol.grid_system;

  const [viewMode, setViewMode] = React.useState<'PERSONA' | 'SKILL'>('PERSONA');

  const activeDeck = viewMode === 'PERSONA' ? OMNI_PERSONA_DECK : OMNI_SKILL_DECK;

  const gridClassName = useMemo(() => {
    if (gridSystem === '4x2-Density-Grid') {
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';
    }
    return 'grid grid-cols-1 gap-4';
  }, [gridSystem]);

  return (
    <div className="w-full p-8 animate-in bg-slate-950 min-h-screen">
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 blur-xl opacity-50 absolute" />
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent mb-2 relative z-10">
          Project Thousand Faces
        </h2>
        <div className="flex items-center gap-2 mb-8">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
            AWAKENING PROTOCOL
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
            {activeDeck.length} ENTITIES DETECTED
          </span>
          <FeatureGuide
            title="Project Thousand Faces (Awakening)"
            description="The evolution system for your Omni Agents. Here you can view and manage the distinct Personas (Archetypes) and Skills that agents can unlock."
            benefits={[
              "Specialized Expertise: Personas unlock deep domain knowledge (e.g., 'Carbon Auditor', 'Crisis Navigator').",
              'Skill Synergies: Combining specific skills creates powerful passive effects.',
              'Visual Progression: Track the growth of your digital workforce visually.',
            ]}
            howToUse={[
              "Toggle Views: Switch between 'Personas' and 'Skills' using the top buttons.",
              'Inspect Cards: Click on any card to view detailed stats and lore.',
              'Plan Evolution: Use this deck to plan which agents should target which awakening paths.',
            ]}
          />
        </div>

        {/* View Toggles */}
        <div className="flex gap-4 p-1 bg-slate-900/80 rounded-full border border-slate-800 backdrop-blur-md">
          <button
            onClick={() => setViewMode('PERSONA')}
            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all ${
              viewMode === 'PERSONA'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/50'
                : 'text-slate-500 hover:text-white'
            }`}
          >
            PERSONAS ({OMNI_PERSONA_DECK.length})
          </button>
          <button
            onClick={() => setViewMode('SKILL')}
            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all ${
              viewMode === 'SKILL'
                ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-lg shadow-amber-900/50'
                : 'text-slate-500 hover:text-white'
            }`}
          >
            SKILLS ({OMNI_SKILL_DECK.length})
          </button>
        </div>
      </div>

      <div className={gridClassName}>
        {activeDeck.map(card => (
          <OmniCard
            key={card.uuid}
            data={card}
            className="h-[400px] border-purple-500/20 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
          />
        ))}
      </div>
    </div>
  );
};
