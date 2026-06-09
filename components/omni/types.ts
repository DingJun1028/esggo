import { RecordLifecycleStatus, AttentionStatus, SemanticVersion } from '@/shared-types/status';

export interface FnnsData {
  id: string;
  affiliation: string;
  type: string;
  entity: string;
  action: string;
  protocol: string;
}

export interface IEvidenceLibrary {
  source_origin: string;
  timestamp: number;
  hash?: string;
  flow_path: string[];
  nodeNameData?: FnnsData; // Step 4 integration
}

export interface IComponentCore {
  readonly uuid: string;
  readonly componentVersion: SemanticVersion; // 主動版本對接器
  readonly timestamp: number;
  evidence: IEvidenceLibrary;
  isLocked?: boolean;
}

export interface OmniCardProps extends IComponentCore {
  title: string;
  status: RecordLifecycleStatus;
  attention?: AttentionStatus;
  children: React.ReactNode;
  className?: string;
  nodeName?: string; // FNNS v2: e.g. ENV-001_Btn__CarbonScope1__Submit--Trustworthy
}

export interface IOmniComponent extends IComponentCore {
  id: string; // FNNS ID
  type: 'Atom' | 'Molecule' | 'Organism' | 'Template'; // MECE category
  name: string; // Component Name
  lifecycleStatus: RecordLifecycleStatus; // Record Lifecycle Status
  attribution: '萬能元件'; // Component Attribution
  
  // 5T Dimensions
  tangible: boolean; 
  traceable: boolean; 
  trackable: boolean; 
  transparent: boolean; 
  trustworthy: boolean;
}
