/**
 * 🌍 Impact Project (IPMS)
 * Inherits from Omni Component Core, ensuring every project is a "Truth Unit" within the system.
 */
import { IComponentCore } from '../0-domain/contracts/IComponentCore';
import { LogicState } from './core/index';

export interface IImpactProject extends IComponentCore {
  // Project Fundamentals
  title: string;
  owner_id: string; // Linked to Talent Passport
  project_status: 'PLANNING' | 'EXECUTION' | 'REVIEW' | 'CERTIFIED';

  // 3-Can, 1-Cannot State Mapping
  // The lifecycle of a project is itself a verification process
  lifecycle_state: LogicState;

  // Resource Dimension (Inputs)
  resources: {
    budget_allocated: number;
    man_hours_estimated: number;
    team_members: string[]; // UUID array
  };

  // Impact Dimension (Impact Targets)
  // This is the core of "Project as an Asset"
  impact_goals: {
    target_metric: string; // e.g., "kgCO2e Reduced" or "People Trained"
    target_value: number;
    current_value: number;
    formula_ref: string; // Linked to algorithm library
  };

  /** 🟢 Entropy Reduction Progress (Computed via EntropyEngine) */
  progress?: number;
}
