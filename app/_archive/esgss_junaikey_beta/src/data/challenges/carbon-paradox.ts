import { ScenarioStage } from './ilan-forest';

export const CARBON_PARADOX_CHALLENGE: Record<string, ScenarioStage> = {
  start: {
    id: 'start',
    speaker: 'System Alert',
    text: 'CRITICAL WARNING: Duplicate Carbon Credits detected in the supply chain ledger. Supplier A and Supplier B are claiming the same forest patch for offsets.',
    background: 'bg-slate-900',
    options: [
      {
        text: 'Investigate the Blockchain Ledger (Use Omni-ID)',
        nextStageId: 'investigate_ledger',
        requiredSkill: 'OMNI_ID',
        impact: { g: 10 },
      },
      {
        text: 'Invalidate both claims immediately (Purge)',
        nextStageId: 'purge_all',
        impact: { e: -5, s: -10, g: 20 },
      },
    ],
  },
  investigate_ledger: {
    id: 'investigate_ledger',
    speaker: 'Sam Wells (Tech Vanguard)',
    text: '"Good catch. The hash signatures match perfectly—it\'s a replay attack. Supplier A is the originator, Supplier B copied the data."',
    options: [
      {
        text: 'Publicly expose Supplier B (Transparency)',
        nextStageId: 'public_shame',
        impact: { s: 10, g: 30 },
      },
      {
        text: "Quietly revoke B's credits and warn them (Mercy)",
        nextStageId: 'quiet_revoke',
        impact: { s: 20, g: -5 },
      },
    ],
  },
  public_shame: {
    id: 'public_shame',
    speaker: 'System',
    text: 'MISSION COMPLETE. Supplier B is blacklisted. Trust in the network increases significantly. The "Carbon Paradox" is resolved.',
    options: [
      {
        text: 'Collect Rewards',
        nextStageId: 'COMPLETE',
      },
    ],
  },
  quiet_revoke: {
    id: 'quiet_revoke',
    speaker: 'System',
    text: 'MISSION COMPLETE. The issue is resolved, but the lack of transparency leaves a small backdoor for future fraud. Entropy reduction is suboptimal.',
    options: [
      {
        text: 'Collect (Reduced) Rewards',
        nextStageId: 'COMPLETE',
      },
    ],
  },
  purge_all: {
    id: 'purge_all',
    speaker: 'System',
    text: 'MISSION FAILED. You erased legitimate credits from Supplier A along with the fraud. They are suing for damages.',
    options: [
      {
        text: 'Retry Simulation',
        nextStageId: 'start',
      },
    ],
  },
};
