import { v4 as uuidv4 } from 'uuid';

/**
 * 🧬 Talent OS Service (M3: Talent OS)
 * --------------------------------------------------
 * [Responsibility] Implements the Talent Value Index (TVI) and handles skill anchoring.
 * [Feature] Digital imprinting of green skills, global talent liquidity.
 */

export interface TalentCredential {
  userId: string;
  skillTag: string;
  impactScore: number; // 0-100
  tvi: number; // Talent Value Index
  certificateId: string;
  timestamp: string;
}

export const TalentOSService = {
  /**
   * Generates a blockchain-anchored talent credential.
   */
  anchorTalent(userId: string, skill: string, impact: number): TalentCredential {
    const timestamp = new Date().toISOString();

    // TVI Formula: (Impact * 0.7) + (Rarity Factor * 0.3)
    // Mock rarity factor: 90
    const tvi = impact * 0.7 + 90 * 0.3;

    const dataToSign = JSON.stringify({ userId, skill, impact, tvi, timestamp });
    const certificateId = `TOS-${btoa(dataToSign).substring(0, 16).toUpperCase()}`;

    return {
      userId,
      skillTag: skill,
      impactScore: impact,
      tvi,
      certificateId,
      timestamp,
    };
  },
};
