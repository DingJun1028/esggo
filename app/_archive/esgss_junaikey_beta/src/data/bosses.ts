export interface BossEnemy {
  id: string;
  name: string;
  title: string;
  description: string;
  hp: number;
  maxHp: number;
  shield: number; // Corporate Resilience / Legal Defense
  entropy: number; // Damage output
  weakness: ('Environment' | 'Social' | 'Governance')[]; // Weak against specific card types
  image?: string; // Placeholder for visual
  phases: {
    triggerHp: number; // HP threshold to trigger phase
    dialogue: string;
    ability: string; // Special attack name
  }[];
}

export const BOSS_GREENWASHING: BossEnemy = {
  id: 'boss_greenwash_01',
  name: 'The Gilded Facade',
  title: 'Avatar of Greenwashing',
  description:
    'A deceptive entity that hides pollution behind glossy marketing campaigns. Its shield is made of empty promises.',
  hp: 1000,
  maxHp: 1000,
  shield: 500,
  entropy: 50,
  weakness: ['Governance'], // Governance (Audit) pierces lies
  phases: [
    {
      triggerHp: 700,
      dialogue: "You cannot prove anything! Our report is compliant with 'internal standards'!",
      ability: 'Obfuscation Cloud',
    },
    {
      triggerHp: 300,
      dialogue: 'We will sue for defamation! Release the Legal Eagles!',
      ability: 'Litigation Storm',
    },
  ],
};

export const BOSS_LIST: Record<string, BossEnemy> = {
  greenwashing: BOSS_GREENWASHING,
};
