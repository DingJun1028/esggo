export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export type AttributeType =
  | 'Intelligence'
  | 'Creativity'
  | 'Empathy'
  | 'Resilience'
  | 'Precision'
  | 'Speed'
  | 'Eco-Awareness'
  | 'Ethical Bias'
  | 'Compute Power';

export interface RpgAttributes {
  intelligence: number;
  creativity: number;
  empathy: number;
  resilience: number;
  precision: number;
  speed: number;
  ecoAwareness: number;
  ethicalBias: number;
  computePower: number;
}

export type ItemType = 'Weapon' | 'Armor' | 'Accessory' | 'Artifact';

export interface RpgItem {
  id: string;
  name: string;
  type: ItemType;
  rarity: Rarity;
  description: string;
  modifiers: Partial<RpgAttributes>;
  effects?: string[]; // Special effect descriptions
  icon: string; // Icon name or URL
}

export interface SkillNode {
  id: string;
  name: string;
  branch:
    | 'Analysis'
    | 'Wisdom'
    | 'Empathy'
    | 'Adaptation'
    | 'Omni'
    | 'Efficiency'
    | 'Precision'
    | 'Eco-Awareness'
    | 'Ethical Bias'
    | 'Compute Power';
  tier: number; // 1-5?
  description: string;
  cost: number; // Skill points cost
  requirements?: string[]; // IDs of prerequisite skills
  modifiers?: Partial<RpgAttributes>; // Passive stat boost
  rarity: Rarity;
  position: { x: number; y: number }; // For visual tree rendering
}

export interface SkillTreeData {
  nodes: SkillNode[];
  edges: { source: string; target: string }[];
}

export interface AgentRpgProfile {
  id: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  attributes: RpgAttributes;
  availableSkillPoints: number;
  unlockedSkills: string[]; // List of skill IDs
  equipment: {
    weapon?: string; // Item ID
    armor?: string;
    accessory?: string;
    artifact?: string;
  };
  inventory: string[]; // List of Item IDs
  title: string;
  avatarId: string; // ID of the visual representation
  archetypeId: string; // ID from OMNI_AGENTS
  evolutionTier: number; // 0: Genesis, 1: Awakened, 2: Ascended, 3: Transcendent
  resonanceScore: number; // 0-100 alignment score
  xp: number; // Total accumulated XP
  drift: {
    e: number;
    s: number;
    g: number;
  };
  badges: {
    id: string;
    name: string;
    date: string;
    lockedHash: string;
  }[];
}
