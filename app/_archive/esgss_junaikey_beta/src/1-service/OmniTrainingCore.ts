/**
 * Omni Agent Training Protocol (Algorithm)
 *
 * Defines the logic for training custom Agents through dialogue and data feeding.
 * This simulates the "Entropy Reduction" process where chaos (raw data/inputs)
 * is transformed into ordered personality traits and capabilities.
 */

import { Agent } from '@/types/agency';
import { OMNI_AGENTS, OmniAgentProfile } from '../data/omni-agents';
import { WorldEvent } from './EventEngine';

export type InteractionType = 'DIALOGUE' | 'DATA_FEED' | 'MISSION_RESULT' | 'CHAOS';

export interface TrainingInput {
  type: InteractionType;
  content: string; // Text or JSON data ID
  sentiment?: number; // -1 to 1
  complexity?: number; // 0 to 1
  category?: string; // ESG Category from intelligence source
}

export interface TrainingResult {
  success: boolean;
  xpGained: number;
  drift: {
    e: number; // Environment drift
    s: number; // Social drift
    g: number; // Governance drift
  };
  newTraits?: string[];
  feedback: string;
  nexusSynergy?: boolean; // Indicates alignment with world pulse
}

// The "3+1" Protocol Logic Gate for Training
const CONST_TRACEABLE = 0.8;
const CONST_TRACKABLE = 0.8;
const CONST_CALCULABLE = 0.8;

export class OmniTrainingCore {
  /**
   * Calculates the impact of a training session on an agent.
   */
  static processTraining(
    agent: Agent,
    input: TrainingInput,
    activeEvents: WorldEvent[] = []
  ): TrainingResult {
    // Base XP
    let xp = 10;
    const drift = { e: 0, s: 0, g: 0 };
    let feedback = 'Training complete.';

    // 1. Complexity Multiplier
    if (input.complexity && input.complexity > 0.5) {
      xp *= 1 + input.complexity;
      feedback = 'High complexity intelligence processed. Neural pathways expanded.';
    }

    // 2. Specialized Drift Logic (Phase 22 Extension)
    const cat = (input.category || '').toLowerCase();

    // 2.a Nexus Multiplier (Phase 38 Synergy)
    const activeNexusThemes = activeEvents.map(e => e.category.toLowerCase());
    const isNexusAligned = activeNexusThemes.some(
      theme => cat.includes(theme.substring(0, 3)) || theme.includes(cat.substring(0, 3))
    );

    const nexusMultiplier = isNexusAligned ? 1.5 : 1.0;
    const driftEfficiency = 0.5 * nexusMultiplier; // Base drift influence

    if (cat.includes('env') || cat.includes('carbon') || cat.includes('climate')) {
      drift.e += 1.5 * (input.complexity || 1) * nexusMultiplier;
      drift.s += 0.2;
      drift.g += 0.3;
      feedback = isNexusAligned
        ? 'ENVIRONMENTAL PULSE RESONANCE DETECTED. Logic gain maximized.'
        : 'Environmental logic synthesized. Core alignment shifted towards E-Sustainability.';
    } else if (cat.includes('social') || cat.includes('human') || cat.includes('labor')) {
      drift.s += 1.5 * (input.complexity || 1) * nexusMultiplier;
      drift.e += 0.2;
      drift.g += 0.3;
      feedback = isNexusAligned
        ? 'SOCIAL PULSE RESONANCE DETECTED. Logic gain maximized.'
        : 'Social dynamic patterns integrated. Core alignment shifted towards S-Equity.';
    } else if (cat.includes('gov') || cat.includes('policy') || cat.includes('report')) {
      drift.g += 1.5 * (input.complexity || 1) * nexusMultiplier;
      drift.e += 0.3;
      drift.s += 0.2;
      feedback = isNexusAligned
        ? 'GOVERNANCE PULSE RESONANCE DETECTED. Logic gain maximized.'
        : 'Governance framework ingested. Core alignment shifted towards G-Integrity.';
    } else {
      // General drift for unmapped categories
      drift.e += 0.1;
      drift.s += 0.1;
      drift.g += 0.1;
    }

    // 3. Type Specific Logic
    switch (input.type) {
      case 'DIALOGUE':
        drift.s += (input.sentiment || 0) * 0.5;
        xp += 5;
        break;

      case 'DATA_FEED':
        // Data Feeds influence logic/knowledge
        drift.g += 0.2;
        if (input.content.length > 100) xp += 20;
        break;

      case 'MISSION_RESULT':
        drift.e += 0.8;
        xp += 50;
        break;

      case 'CHAOS':
        // High risk, high reward
        drift.e += (Math.random() - 0.5) * 5;
        drift.s += (Math.random() - 0.5) * 5;
        drift.g += (Math.random() - 0.5) * 5;
        xp += 100 + (input.complexity || 0) * 100;
        feedback =
          'Black Swan intelligence ingested. Neural synchronization fluctuating violently.';
        break;
    }

    // 4. "3+1" Entropy Check (Simulated)
    if (input.type === 'DIALOGUE' && (input.sentiment || 0) < -0.5) {
      feedback = 'WARNING: Emotional instability detected in training data. Entropy increased.';
      xp *= 0.5;
    }

    return {
      success: true,
      xpGained: Math.floor(xp * nexusMultiplier),
      drift,
      feedback,
      nexusSynergy: isNexusAligned,
    };
  }

  /**
   * Evolves an agent if they meet the criteria for a new Archetype.
   */
  static checkEvolution(agent: Agent, currentProfileId: string): OmniAgentProfile | null {
    // Simple logic: If XP > 1000, unlock next tier (Mock)
    // In real system, this would compare vector embeddings of the agent's memory
    // against the OMNI_AGENTS centroids.

    return null; // No evolution yet
  }
}
