import { NextResponse } from 'next/server';
import { IOmniComponent } from '@/components/omni/types';
import { RecordLifecycleStatus } from '@/shared-types/status';

export async function GET() {
  // Simulate DB fetch and network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const components: IOmniComponent[] = [
    { 
      uuid: 'uuid-001', componentVersion: '8.5.0-Alpha', timestamp: Date.now(), evidence: { source_origin: 'database', flow_path: [], timestamp: Date.now() },
      id: 'OMNI-001', type: 'Molecule', name: 'BrandKpiCard', lifecycleStatus: RecordLifecycleStatus.Active, attribution: '萬能元件', tangible: true, traceable: true, trackable: true, transparent: true, trustworthy: true 
    },
    { 
      uuid: 'uuid-002', componentVersion: '8.5.0-Alpha', timestamp: Date.now(), evidence: { source_origin: 'database', flow_path: [], timestamp: Date.now() },
      id: 'OMNI-002', type: 'Organism', name: 'GenesisConsole', lifecycleStatus: RecordLifecycleStatus.Active, attribution: '萬能元件', tangible: true, traceable: true, trackable: true, transparent: true, trustworthy: true 
    },
    { 
      uuid: 'uuid-003', componentVersion: '8.5.0-Alpha', timestamp: Date.now(), evidence: { source_origin: 'database', flow_path: [], timestamp: Date.now() },
      id: 'OMNI-003', type: 'Atom', name: 'AtomicButton', lifecycleStatus: RecordLifecycleStatus.Pending, attribution: '萬能元件', tangible: true, traceable: true, trackable: false, transparent: false, trustworthy: true 
    },
    { 
      uuid: 'uuid-004', componentVersion: '8.5.0-Alpha', timestamp: Date.now(), evidence: { source_origin: 'database', flow_path: [], timestamp: Date.now() },
      id: 'OMNI-004', type: 'Template', name: 'OmniCoreShell', lifecycleStatus: RecordLifecycleStatus.Active, attribution: '萬能元件', tangible: true, traceable: true, trackable: true, transparent: true, trustworthy: true 
    },
    { 
      uuid: 'uuid-005', componentVersion: '8.5.0-Alpha', timestamp: Date.now(), evidence: { source_origin: 'database', flow_path: [], timestamp: Date.now() },
      id: 'OMNI-005', type: 'Molecule', name: 'OmniBookCaseRegistry', lifecycleStatus: RecordLifecycleStatus.Draft, attribution: '萬能元件', tangible: true, traceable: true, trackable: true, transparent: true, trustworthy: true 
    },
    { 
      uuid: 'uuid-006', componentVersion: '1.0.0', timestamp: Date.now(), evidence: { source_origin: 'database', flow_path: ['migration'], timestamp: Date.now() },
      id: 'OMNI-006', type: 'Molecule', name: 'CarbonTrendChart', lifecycleStatus: RecordLifecycleStatus.Active, attribution: '萬能元件', tangible: true, traceable: true, trackable: true, transparent: false, trustworthy: false 
    },
    { 
      uuid: 'uuid-007', componentVersion: '1.0.0', timestamp: Date.now(), evidence: { source_origin: 'database', flow_path: ['migration'], timestamp: Date.now() },
      id: 'OMNI-007', type: 'Organism', name: 'DailyIntelligenceForm', lifecycleStatus: RecordLifecycleStatus.Pending, attribution: '萬能元件', tangible: true, traceable: true, trackable: true, transparent: true, trustworthy: false 
    },
    { 
      uuid: 'uuid-008', componentVersion: '1.0.0', timestamp: Date.now(), evidence: { source_origin: 'database', flow_path: ['migration'], timestamp: Date.now() },
      id: 'OMNI-008', type: 'Organism', name: 'ReportBuilder', lifecycleStatus: RecordLifecycleStatus.Draft, attribution: '萬能元件', tangible: true, traceable: true, trackable: false, transparent: true, trustworthy: false 
    },
    { 
      uuid: 'uuid-009', componentVersion: '1.0.0', timestamp: Date.now(), evidence: { source_origin: 'database', flow_path: ['migration'], timestamp: Date.now() },
      id: 'OMNI-009', type: 'Atom', name: 'SyncStatusIndicator', lifecycleStatus: RecordLifecycleStatus.Active, attribution: '萬能元件', tangible: true, traceable: true, trackable: true, transparent: true, trustworthy: true 
    },
  ];
  
  return NextResponse.json({ components });
}
