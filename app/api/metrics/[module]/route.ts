import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function getAdminClient() {
  const { createClient } = await import('@supabase/supabase-js');
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase credentials not configured');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });
}

function getTableName(module: string) {
  if (module === 'env') return 'environmental_data';
  if (module === 'social') return 'social_metrics';
  if (module === 'gov') return 'governance_metrics';
  return null;
}

const MOCK_DATA_BY_MODULE: Record<string, any[]> = {
  'api-setup': [
    { id: 1, date: '2026-06-01', metric_name: 'Google Gemini Pro API Integration', metric_value: 99.9, unit: '% Uptime', hash_lock: '0x8f03a21', source_origin: 'Auto-Agent' },
    { id: 2, date: '2026-06-02', metric_name: 'Supabase Data Gateway Sync', metric_value: 45, unit: 'ms Latency', hash_lock: '0x2b89ac4', source_origin: 'System' },
    { id: 3, date: '2026-06-03', metric_name: 'Firebase Cloud Messaging Hub', metric_value: 100, unit: '% Delivery', hash_lock: '0x1c9d4f6', source_origin: 'System' },
    { id: 4, date: '2026-06-04', metric_name: 'Nocodebackend Backup Pipeline', metric_value: 0, unit: 'Errors', hash_lock: null, source_origin: 'Manual' },
  ],
  'materiality': [
    { id: 1, date: '2026-06-01', metric_name: 'GRI 302: Energy Efficiency Program', metric_value: 92.4, unit: 'Impact Score', hash_lock: '0x9d4e5f1', source_origin: 'Auto-Agent' },
    { id: 2, date: '2026-06-02', metric_name: 'GRI 305: Scope 1 & 2 Emissions', metric_value: 98.1, unit: 'Priority %', hash_lock: '0xbc3e21a', source_origin: 'System' },
    { id: 3, date: '2026-06-03', metric_name: 'GRI 401: Talent Retention & Rights', metric_value: 75.0, unit: 'Priority %', hash_lock: '0x4f12ac7', source_origin: 'Manual' },
    { id: 4, date: '2026-06-04', metric_name: 'GRI 405: Gender Equality & Diversity', metric_value: 88.5, unit: 'Priority %', hash_lock: null, source_origin: 'System' },
  ],
  'roadmap': [
    { id: 1, date: '2026-06-01', metric_name: 'Phase 1: Baseline Carbon Inventory', metric_value: 100, unit: '% Complete', hash_lock: '0xef8c21b', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Phase 2: Scope 2 Solar Replacement', metric_value: 65.4, unit: '% Progress', hash_lock: '0x3ac912d', source_origin: 'Auto-Agent' },
    { id: 3, date: '2026-06-03', metric_name: 'Phase 3: Scope 3 Supplier Engagement', metric_value: 20.0, unit: '% Enrolled', hash_lock: null, source_origin: 'Manual' },
  ],
  'cbam-calculator': [
    { id: 1, date: '2026-06-01', metric_name: 'Imported Steel Rebar CBAM Intensity', metric_value: 1.82, unit: 'tCO2/t', hash_lock: '0x7a2d4f9', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Imported Aluminum Sheet CBAM Intensity', metric_value: 2.45, unit: 'tCO2/t', hash_lock: '0x9c3f1e8', source_origin: 'Auto-Agent' },
    { id: 3, date: '2026-06-03', metric_name: 'Portland Cement CBAM Carbon Duty', metric_value: 3450, unit: 'EUR Estimate', hash_lock: null, source_origin: 'Manual' },
  ],
  'tasks': [
    { id: 1, date: '2026-06-01', metric_name: 'Collect Scope 1 Diesel Fuel Invoices', metric_value: 8, unit: 'Invoices', hash_lock: '0xbc3f1e9', source_origin: 'Manual' },
    { id: 2, date: '2026-06-02', metric_name: 'Complete Gender Pay Gap Internal Audit', metric_value: 100, unit: '% Done', hash_lock: '0x4e9c8f2', source_origin: 'Auto-Agent' },
    { id: 3, date: '2026-06-03', metric_name: 'Upload ZKP Privacy Sealing Keys to Vault', metric_value: 15, unit: 'Keys Sealed', hash_lock: '0x9a8b7c6', source_origin: 'System' },
  ],
  'document-checklist': [
    { id: 1, date: '2026-06-01', metric_name: 'Electricity Bills Q1-Q4 (Verified)', metric_value: 24, unit: 'Files Checked', hash_lock: '0x2c3d4e5', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Waste Disposal Certificate 2024', metric_value: 1, unit: 'Audit Match', hash_lock: '0x8f7e6d5', source_origin: 'Manual' },
    { id: 3, date: '2026-06-03', metric_name: 'Corporate Code of Conduct Signed PDF', metric_value: 98, unit: '% Verified', hash_lock: null, source_origin: 'Auto-Agent' },
  ],
  'health-check': [
    { id: 1, date: '2026-06-01', metric_name: 'Data Integrity Audit Score', metric_value: 99.4, unit: '% Health', hash_lock: '0x1a2b3c4', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: '5T Integrity Compliance Ratio', metric_value: 100, unit: '% Compliant', hash_lock: '0x5e6f7a8', source_origin: 'Auto-Agent' },
    { id: 3, date: '2026-06-03', metric_name: 'System Vulnerability Scans Passed', metric_value: 0, unit: 'Threats', hash_lock: '0x9c8b7a6', source_origin: 'System' },
  ],
  'environmental': [
    { id: 1, date: '2026-06-01', metric_name: 'Scope 1 Direct Diesel Emissions', metric_value: 345.2, unit: 'tCO2e', hash_lock: '0xaf8e9d3', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Scope 2 Indirect Electricity Emissions', metric_value: 812.5, unit: 'tCO2e', hash_lock: '0xcd7b6e2', source_origin: 'Auto-Agent' },
    { id: 3, date: '2026-06-03', metric_name: 'Total Water Withdrawal volume', metric_value: 12500, unit: 'm³', hash_lock: null, source_origin: 'Manual' },
  ],
  'social': [
    { id: 1, date: '2026-06-01', metric_name: 'Employee Training Hours Average', metric_value: 42.5, unit: 'Hours/Yr', hash_lock: '0x3f4e5d6', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Gender Representation Ratio (Female)', metric_value: 41.2, unit: '% workforce', hash_lock: '0x7e8d9c0', source_origin: 'Auto-Agent' },
    { id: 3, date: '2026-06-03', metric_name: 'Workplace Injury Incident Rate', metric_value: 0.0, unit: 'Incidents', hash_lock: '0x9a8b7c6', source_origin: 'System' },
  ],
  'governance': [
    { id: 1, date: '2026-06-01', metric_name: 'Board Diversity ratio (Independent)', metric_value: 45.5, unit: '% Board', hash_lock: '0x9d8c7b6', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Anti-Corruption Policy Training Complete', metric_value: 100, unit: '% Staff', hash_lock: '0x5a6b7c8', source_origin: 'Auto-Agent' },
    { id: 3, date: '2026-06-03', metric_name: 'Regulatory Compliance Penalties incurred', metric_value: 0, unit: 'USD', hash_lock: '0x3d4e5f6', source_origin: 'System' },
  ],
  'supply-chain': [
    { id: 1, date: '2026-06-01', metric_name: 'Supplier ESG Self-Assessment Rate', metric_value: 87.5, unit: '% Audited', hash_lock: '0x1a2b3d4', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'High-Risk Supplier Mitigation Actions', metric_value: 12, unit: 'Actions Taken', hash_lock: null, source_origin: 'Manual' },
  ],
  'stakeholders': [
    { id: 1, date: '2026-06-01', metric_name: 'Stakeholder Survey Participation count', metric_value: 1240, unit: 'Responses', hash_lock: '0x8b9c7d2', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'CSO Engagement Satisfaction Rating', metric_value: 4.6, unit: '/ 5.0 Rating', hash_lock: '0x3a4b5c6', source_origin: 'Auto-Agent' },
  ],
  'advisory': [
    { id: 1, date: '2026-06-01', metric_name: 'AI Advisor Consultation Sessions', metric_value: 42, unit: 'Sessions', hash_lock: '0x1f2e3d4', source_origin: 'Auto-Agent' },
    { id: 2, date: '2026-06-02', metric_name: 'Expert Peer Review Drafts Approved', metric_value: 3, unit: 'Drafts', hash_lock: null, source_origin: 'Manual' },
  ],
  'intelligence': [
    { id: 1, date: '2026-06-01', metric_name: 'Global ESG Policy Updates Scanned', metric_value: 124, unit: 'Articles', hash_lock: '0x9a8b7c5', source_origin: 'Auto-Agent' },
    { id: 2, date: '2026-06-02', metric_name: 'Market Competitor Carbon Benchmarks', metric_value: 18, unit: 'Firms Tracked', hash_lock: '0x3d4e5f2', source_origin: 'System' },
  ],
  'compliance-check': [
    { id: 1, date: '2026-06-01', metric_name: 'GRI Standards Compliance Gap Rating', metric_value: 0, unit: 'Gaps Found', hash_lock: '0x5c6d7e8', source_origin: 'Auto-Agent' },
    { id: 2, date: '2026-06-02', metric_name: 'EU CSRD Readiness Score card', metric_value: 94.2, unit: '% Readiness', hash_lock: '0x1b2c3d4', source_origin: 'System' },
  ],
  'vault': [
    { id: 1, date: '2026-06-01', metric_name: 'Total Data Atoms Sealed (ZKP)', metric_value: 450, unit: 'Atoms', hash_lock: '0x4d5e6f7', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Pedersen Commitments Generated', metric_value: 1520, unit: 'Proofs', hash_lock: '0x8a9b0c1', source_origin: 'Auto-Agent' },
  ],
  'audit-log': [
    { id: 1, date: '2026-06-01', metric_name: 'Admin Settings Access Attempts', metric_value: 142, unit: 'Audit Entries', hash_lock: '0xbc3d4e5', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Data Modification Events Logged', metric_value: 23, unit: 'Events', hash_lock: '0x7a8b9c0', source_origin: 'System' },
  ],
  'proof-center': [
    { id: 1, date: '2026-06-01', metric_name: 'Active Trust Certificates Issued', metric_value: 5, unit: 'Certificates', hash_lock: '0x3a4b5c8', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'External Audit Verification Rate', metric_value: 100, unit: '% Validated', hash_lock: '0x9d8e7c6', source_origin: 'Auto-Agent' },
  ],
  'audit-verify': [
    { id: 1, date: '2026-06-01', metric_name: 'VerifyLink™ Active Scans', metric_value: 345, unit: 'Scans', hash_lock: '0x1a2b3c7', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Cryptographic Integrity Pass rate', metric_value: 100, unit: '% Pass', hash_lock: '0x5c6d7e9', source_origin: 'Auto-Agent' },
  ],
  'publish': [
    { id: 1, date: '2026-06-01', metric_name: 'GRI Report Generation Cycles Completed', metric_value: 14, unit: 'Runs', hash_lock: '0x9a8b7c1', source_origin: 'Auto-Agent' },
    { id: 2, date: '2026-06-02', metric_name: 'Public Report Distribution Channels', metric_value: 5, unit: 'Platforms', hash_lock: '0x3d4e5f8', source_origin: 'System' },
  ],
  'library': [
    { id: 1, date: '2026-06-01', metric_name: 'ESG Reference Standards Cataloged', metric_value: 154, unit: 'Documents', hash_lock: '0x5c6d7e1', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Internal Best Practice Guides Published', metric_value: 12, unit: 'Guides', hash_lock: '0x1b2c3d9', source_origin: 'Manual' },
  ],
  'reading-room': [
    { id: 1, date: '2026-06-01', metric_name: 'ESG Training Video Materials Watched', metric_value: 48, unit: 'Views', hash_lock: '0x8b9c7d1', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Sustainable Policy Manual Downloads', metric_value: 85, unit: 'Downloads', hash_lock: '0x3a4b5c1', source_origin: 'Manual' },
  ],
  'finance': [
    { id: 1, date: '2026-06-01', metric_name: 'Green Bond Allocation Efficiency', metric_value: 94.5, unit: '% Allocated', hash_lock: '0x1f2e3d9', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'ESG CapEx Investment returns', metric_value: 18.4, unit: '% ROI', hash_lock: '0x3d4e5f9', source_origin: 'Auto-Agent' },
  ],
  'academy': [
    { id: 1, date: '2026-06-01', metric_name: 'Staff ESG Academy Enrollments', metric_value: 340, unit: 'Users', hash_lock: '0x9a8b7c2', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'ESG Specialist Certification Rate', metric_value: 85.0, unit: '% Cert', hash_lock: '0x3d4e5f7', source_origin: 'Auto-Agent' },
  ],
  'advisors': [
    { id: 1, date: '2026-06-01', metric_name: 'Registered External ESG Auditors', metric_value: 4, unit: 'Auditors', hash_lock: '0x5c6d7e2', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Third-Party Advisory Cases Solved', metric_value: 15, unit: 'Cases', hash_lock: '0x1b2c3d2', source_origin: 'Manual' },
  ],
  'soul': [
    { id: 1, date: '2026-06-01', metric_name: 'Supreme Will Resonance Multiplier', metric_value: 8.5, unit: 'x Power', hash_lock: '0x8b9c7d9', source_origin: 'Auto-Agent' },
    { id: 2, date: '2026-06-02', metric_name: 'Trinity Cognitive Consensus level', metric_value: 100, unit: '% Consensus', hash_lock: '0x3a4b5c9', source_origin: 'System' },
  ],
  'omnispace': [
    { id: 1, date: '2026-06-01', metric_name: 'Active Co-Resonance Nodes Online', metric_value: 8, unit: 'Nodes', hash_lock: '0x1f2e3d2', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Data Swarm Harmony Frequency', metric_value: 432, unit: 'Hz Resonance', hash_lock: '0x3d4e5f1', source_origin: 'Auto-Agent' },
  ],
  'agents': [
    { id: 1, date: '2026-06-01', metric_name: 'Total Registered Swarm Agents', metric_value: 15, unit: 'Agents', hash_lock: '0x9a8b7c9', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Average Agent Collaboration Latency', metric_value: 120, unit: 'ms', hash_lock: '0x3d4e5f3', source_origin: 'Auto-Agent' },
  ],
  'digital-twin': [
    { id: 1, date: '2026-06-01', metric_name: 'Digital Twin Simulation Accuracy', metric_value: 98.7, unit: '% Accuracy', hash_lock: '0x5c6d7e9', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Scenarios Run in Virtual Twin Sandbox', metric_value: 240, unit: 'Runs', hash_lock: '0x1b2c3d5', source_origin: 'Auto-Agent' },
  ],
  'data-sources': [
    { id: 1, date: '2026-06-01', metric_name: 'Active Database Connection Pools', metric_value: 4, unit: 'Pools', hash_lock: '0x2c3d4e6', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'S3 Ingestion Bucket Sync Rate', metric_value: 100, unit: '% Success', hash_lock: '0x8f7e6d6', source_origin: 'Auto-Agent' },
  ],
  'templates': [
    { id: 1, date: '2026-06-01', metric_name: 'GRI Compliance Templates Loaded', metric_value: 12, unit: 'Templates', hash_lock: '0x3a4b5c7', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'User Custom Report Templates Created', metric_value: 5, unit: 'Templates', hash_lock: null, source_origin: 'Manual' },
  ],
  'ai-platform': [
    { id: 1, date: '2026-06-01', metric_name: 'Genkit Model Inference Cost', metric_value: 0.045, unit: 'USD / 1k Token', hash_lock: '0x4d5e6f8', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Model Fallback Recovery Success Rate', metric_value: 100, unit: '% Recovered', hash_lock: '0x8a9b0c2', source_origin: 'Auto-Agent' },
  ],
  'swarm': [
    { id: 1, date: '2026-06-01', metric_name: 'Swarm Consensus Quorum Achieved', metric_value: 100, unit: '% Quorum', hash_lock: '0xbc3d4e6', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Autonomous Task Solving Rate', metric_value: 145, unit: 'Tasks/Hr', hash_lock: '0x7a8b9c1', source_origin: 'Auto-Agent' },
  ],
  'system-status': [
    { id: 1, date: '2026-06-01', metric_name: 'Global Server Node CPU Load', metric_value: 14.5, unit: '% Load', hash_lock: '0x3a4b5c2', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Memory Sanctuary Shards Allocation', metric_value: 128, unit: 'MB / 512MB', hash_lock: '0x9d8e7c2', source_origin: 'System' },
  ],
  'system-test': [
    { id: 1, date: '2026-06-01', metric_name: 'End-to-End Vitest Coverage Rate', metric_value: 84.6, unit: '% Coverage', hash_lock: '0x1a2b3c2', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'System Stress Test Requests Handle rate', metric_value: 4500, unit: 'Req/Sec', hash_lock: '0x5c6d7e2', source_origin: 'System' },
  ],
  'terminal': [
    { id: 1, date: '2026-06-01', metric_name: 'CLI Command Execution Rate', metric_value: 1420, unit: 'Cmds/Day', hash_lock: '0x9a8b7c2', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Terminal Sessions active', metric_value: 2, unit: 'Sessions', hash_lock: '0x3d4e5f2', source_origin: 'Manual' },
  ],
  'design-library': [
    { id: 1, date: '2026-06-01', metric_name: 'Atomic Components Registered', metric_value: 25, unit: 'Components', hash_lock: '0x5c6d7e2', source_origin: 'System' },
    { id: 2, date: '2026-06-02', metric_name: 'Liquid Glass Tokens Registered', metric_value: 142, unit: 'Tokens', hash_lock: '0x1b2c3d2', source_origin: 'System' },
  ],
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ module: string }> }) {
  try {
    const { module } = await params;
    const tableName = getTableName(module);
    
    if (!tableName) {
      const mockData = MOCK_DATA_BY_MODULE[module] || [
        { id: 1, date: '2026-06-01', metric_name: `${module.toUpperCase()} Default Metric`, metric_value: 100, unit: 'pts', hash_lock: '0xabc123', source_origin: 'System' }
      ];
      return NextResponse.json({ success: true, data: mockData });
    }

    const supabase = await getAdminClient();
    const { data, error } = await supabase.from(tableName).select('*').order('year', { ascending: false });
    if (error) throw error;
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    // If Supabase fails, fall back to mock data corresponding to the module (or default mock data)
    const { module } = await params;
    const mockData = MOCK_DATA_BY_MODULE[module] || [
      { id: 1, date: '2026-06-01', metric_name: `${module.toUpperCase()} Fallback Metric`, metric_value: 100, unit: 'pts', hash_lock: '0xabc123', source_origin: 'System' }
    ];
    return NextResponse.json({ success: true, data: mockData });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ module: string }> }) {
  try {
    const { module } = await params;
    const tableName = getTableName(module);
    if (!tableName) {
      return NextResponse.json({ success: true, message: 'Mock update success' });
    }

    const body = await request.json();
    const supabase = await getAdminClient();
    const { data, error } = await supabase.from(tableName).insert([body]).select();
    if (error) throw error;
    
    return NextResponse.json({ success: true, data: data[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
