import { useState, useCallback } from 'react';
import { RpgAttributes } from '../types/rpg';
import { useOmniMemory } from '../omni/infrastructure/memory/OmniMemory';
import { OmniKnowledge } from '../omni/infrastructure/knowledge/OmniKnowledge';

export interface GeneticBlueprint {
  id: string;
  sourceAgentId: string;
  sourceAgentName: string;
  sourceTitle: string;
  timestamp: string;
  geneBonus: Partial<RpgAttributes>;
  dominantTrait: keyof RpgAttributes;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export const useGeneticEngine = () => {
  const [blueprints, setBlueprints] = useState<GeneticBlueprint[]>(() => {
    const saved = localStorage.getItem('omni_genetic_blueprints');
    // Migration: ensure loaded blueprints have rarity
    const loaded = saved ? JSON.parse(saved) : [];
    return loaded.map((bp: any) => ({
      ...bp,
      rarity: bp.rarity || 'Common',
    }));
  });

  const extractBlueprint = useCallback(
    (profile: any) => {
      if (profile.level < 10)
        return { success: false, error: 'Level 10 required for genetic extraction.' };

      // Determine dominant trait (highest attribute)
      const attrs = profile.attributes as RpgAttributes;
      const dominantTrait = Object.entries(attrs).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0] as keyof RpgAttributes;

      // Phase 3: Omni-Knowledge Integration
      // Use accumulated wisdom to enhance genetic outcome
      const memory = useOmniMemory.getState();
      const wisdom = memory.evolutionState.wisdomMetrics;
      const vault = memory.palace.theVault;

      // 1. Wisdom Bonus (Pattern Recognition increases efficiency)
      const wisdomBonus = (wisdom.patternRecognition || 0) * 0.1; // Max +10%

      // 2. Concept Resonance Bonus
      let resonanceBonus = 0;
      const traitMap: Record<string, string[]> = {
        ecoAwareness: ['Environmental', 'E'],
        ethicalBias: ['Social', 'S', 'Ethics'],
        computePower: ['Governance', 'G', 'Order'],
        intelligence: ['Logic', 'Algorithm'],
        creativity: ['Innovation', 'Design'],
        empathy: ['Human', 'Community'],
        resilience: ['Stability', 'Safety'],
        precision: ['Accuracy', 'Metric'],
        speed: ['Latency', 'Real-time'],
      };

      const relatedConcepts = traitMap[dominantTrait] || [];

      // Check OmniMemory Vault
      relatedConcepts.forEach(concept => {
        const weight = vault.conceptWeights[concept] || 0;
        if (weight > 5) resonanceBonus += 0.05; // Significant mastery gives +5%
        if (weight > 10) resonanceBonus += 0.05; // Mastery+ gives another +5%
      });

      // Check OmniKnowledge Graph for contextual reinforcement
      const graph = OmniKnowledge.getKnowledgeGraph();
      let knowledgeBonus = 0;

      // Scan nodes for keywords related to the dominant trait
      const knowledgeKeywords: Record<string, string[]> = {
        ecoAwareness: ['sustainable', 'carbon', 'green', 'nature'],
        ethicalBias: ['ethics', 'social', 'community', 'fairness'],
        computePower: ['algorithm', 'data', 'optimization', 'logic'],
        intelligence: ['ai', 'learning', 'cognitive'],
        creativity: ['vision', 'dream', 'art'],
        empathy: ['people', 'care', 'support'],
        resilience: ['durability', 'backup', 'secure'],
        precision: ['exact', 'quant', 'verified'],
        speed: ['fast', 'agile', 'streamline'],
      };

      const targetKeywords = knowledgeKeywords[dominantTrait] || [];

      if (targetKeywords.length > 0) {
        let matchCount = 0;
        for (const node of graph.nodes.values()) {
          if (
            node.confidence > 0.7 &&
            targetKeywords.some(k => node.label.toLowerCase().includes(k))
          ) {
            matchCount++;
          }
        }
        // Cap knowledge bonus at 10%
        knowledgeBonus = Math.min(0.1, matchCount * 0.01);
      }

      const totalMultiplier = 0.2 + wisdomBonus + resonanceBonus + knowledgeBonus;

      // Calculate Rarity based on Multiplier
      let rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' = 'Common';
      if (totalMultiplier >= 0.45) rarity = 'Legendary';
      else if (totalMultiplier >= 0.35) rarity = 'Epic';
      else if (totalMultiplier >= 0.25) rarity = 'Rare';

      const blueprint: GeneticBlueprint = {
        id: `DNA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        sourceAgentId: profile.avatarId || 'unknown',
        sourceAgentName: profile.title.split(' ')[0] || 'Unknown Agent',
        sourceTitle: profile.title,
        timestamp: new Date().toISOString(),
        dominantTrait,
        rarity,
        geneBonus: {
          [dominantTrait]: Math.floor((attrs[dominantTrait] || 0) * totalMultiplier),
        },
      };

      const newBlueprints = [blueprint, ...blueprints];
      setBlueprints(newBlueprints);
      localStorage.setItem('omni_genetic_blueprints', JSON.stringify(newBlueprints));

      return { success: true, blueprint, multiplier: totalMultiplier };
    },
    [blueprints, blueprints]
  ); // Corrected dependency list if needed, or just follow dev

  const deleteBlueprint = useCallback(
    (id: string) => {
      const newBlueprints = blueprints.filter(b => b.id !== id);
      setBlueprints(newBlueprints);
      localStorage.setItem('omni_genetic_blueprints', JSON.stringify(newBlueprints));
    },
    [blueprints]
  );

  return {
    blueprints,
    extractBlueprint,
    deleteBlueprint,
  };
};
