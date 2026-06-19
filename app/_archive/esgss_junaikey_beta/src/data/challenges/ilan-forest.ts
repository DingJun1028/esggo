export interface ScenarioStage {
  id: string;
  speaker: string; // The character speaking (e.g., 'Dr. Sushi', 'Developer')
  text: string;
  background?: string; // Optional image/color
  options: {
    text: string;
    nextStageId: string;
    impact?: {
      e?: number;
      s?: number;
      g?: number;
    };
    requiredSkill?: string; // e.g., 'SROI_CALCULATOR'
  }[];
}

export const ILAN_FOREST_CHALLENGE: Record<string, ScenarioStage> = {
  start: {
    id: 'start',
    speaker: 'System Narrator',
    text: 'ALERT: Anomaly detected in the Ilan Deep Forest sector. A "Sustainable Resort" project has requested a permit. Local sensors indicate high biodiversity risk, but the economic projection is massive.',
    options: [
      {
        text: 'Consult the Stakeholder Balancer (Dr. Sushi)',
        nextStageId: 'sushi_consult',
        impact: { g: 10 },
      },
      {
        text: 'Review the construction plans immediately (Speed)',
        nextStageId: 'ceo_rush',
        impact: { e: -10, s: 5 },
      },
    ],
  },
  sushi_consult: {
    id: 'sushi_consult',
    speaker: 'Dr. Sushi',
    text: '"Pioneer, we cannot simply say `No`. We must find the `Third Way`. The villagers need jobs, but the owls need silence. Have you performed a Double Materiality check?"',
    options: [
      {
        text: 'Yes, I have the Matrix ready. (Use Skill: Double Materiality)',
        nextStageId: 'solution_triad',
        requiredSkill: 'DOUBLE_MATERIALITY',
        impact: { s: 20, g: 20 },
      },
      {
        text: "I need more time. Let's just block the permit for now.",
        nextStageId: 'block_permit',
        impact: { e: 20, s: -30 }, // High Environment, but Villagers angry
      },
    ],
  },
  ceo_rush: {
    id: 'ceo_rush',
    speaker: 'The Catalyst CEO',
    text: '"Time is money! We can build around the owl nests. Just sign the permit and I will have the foundation laid by tomorrow."',
    options: [
      {
        text: 'Sign the permit. Speed is key.',
        nextStageId: 'bad_ending_greenwash',
        impact: { e: -50, s: 10, g: -20 },
      },
      {
        text: "Wait! This data isn't Traceable. Stop.",
        nextStageId: 'start', // Loop back or handled better
        impact: { g: 5 },
      },
    ],
  },
  solution_triad: {
    id: 'solution_triad',
    speaker: 'The Core Architect (JunAiKey)',
    text: 'Resonance Active. You have identified specific zones where tourism enhances conservation funding. This is the "Forest-Healing" model.',
    options: [
      {
        text: "Mint the 'Mutual Benefit Contract' (4+1 Protocol)",
        nextStageId: 'victory_sovereign',
        impact: { e: 50, s: 50, g: 50 },
      },
    ],
  },
  victory_sovereign: {
    id: 'victory_sovereign',
    speaker: 'System',
    text: 'CHALLENGE COMPLETE. The "Forest-Healing Resort" is now a registered Asset. SROI: 4.5. Entropy Reduced.',
    options: [
      {
        text: 'Collect Rewards',
        nextStageId: 'COMPLETE',
      },
    ],
  },
  bad_ending_greenwash: {
    id: 'bad_ending_greenwash',
    speaker: 'System',
    text: 'MISSION FAILED. The resort was built, but the owls vanished. The "Sustainable" label was exposed as Greenwashing. Entropy Increased.',
    options: [
      {
        text: 'Retry Simulation',
        nextStageId: 'start',
      },
    ],
  },
  block_permit: {
    id: 'block_permit',
    speaker: 'System',
    text: 'MISSION END. The forest is safe, but the village economy collapses. Protests erupt. You protected the `E` but failed the `S`.',
    options: [
      {
        text: 'Retry with better balance',
        nextStageId: 'start',
      },
    ],
  },
};
