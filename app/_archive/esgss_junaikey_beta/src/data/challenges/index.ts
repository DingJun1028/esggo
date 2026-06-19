import { ScenarioStage, ILAN_FOREST_CHALLENGE } from './ilan-forest';
import { CARBON_PARADOX_CHALLENGE } from './carbon-paradox';

export const SCENARIO_MAP: Record<string, Record<string, ScenarioStage>> = {
  ilan_forest: ILAN_FOREST_CHALLENGE,
  carbon_paradox: CARBON_PARADOX_CHALLENGE,
};

export type { ScenarioStage };
