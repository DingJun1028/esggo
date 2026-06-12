// src/shared/types/omniComponent.types.ts
export type LifecycleStatus = 'Active' | 'Pending' | 'Draft' | 'Archived';

export interface EvidenceReference {
  source_origin: string;
  flow_path: string[];
  timestamp: number;
}

export interface IOmniComponent {
  uuid: string;
  componentVersion: string;
  timestamp: number;
  evidence: EvidenceReference;
  id: string;
  type: string; // e.g., Atom, Molecule, Organism, Template
  name: string;
  lifecycleStatus: LifecycleStatus;
  attribution: string;
  tangible: boolean;
  traceable: boolean;
  trackable: boolean;
  transparent: boolean;
  trustworthy: boolean;
}
