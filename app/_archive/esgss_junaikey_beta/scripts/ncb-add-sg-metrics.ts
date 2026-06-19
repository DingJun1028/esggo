/**
 * NCB Database - Add Social & Governance Metrics
 * Phase 15 Extension: Complete ESG Metrics Setup
 */

import { ncb } from '../src/lib/ncb/client.js';

// Social Metrics (S)
const socialMetrics = [
  {
    code: 'EMPLOYEE_WELLBEING',
    name: 'Employee Wellbeing Index',
    category: 'Social',
    unit: 'score',
    description: 'Overall employee health and satisfaction',
  },
  {
    code: 'DIVERSITY_INCLUSION',
    name: 'Diversity & Inclusion Score',
    category: 'Social',
    unit: 'score',
    description: 'Workforce diversity and inclusion metrics',
  },
  {
    code: 'LABOR_RIGHTS',
    name: 'Labor Rights Compliance',
    category: 'Social',
    unit: 'score',
    description: 'Compliance with labor standards',
  },
  {
    code: 'COMMUNITY_ENGAGEMENT',
    name: 'Community Engagement',
    category: 'Social',
    unit: 'hours',
    description: 'Community involvement hours',
  },
  {
    code: 'SUPPLY_CHAIN',
    name: 'Supply Chain Ethics',
    category: 'Social',
    unit: 'score',
    description: 'Supply chain sustainability score',
  },
  {
    code: 'DATA_PRIVACY',
    name: 'Data Privacy Protection',
    category: 'Social',
    unit: 'score',
    description: 'Data protection compliance',
  },
  {
    code: 'HEALTH_SAFETY',
    name: 'Health & Safety',
    category: 'Social',
    unit: 'score',
    description: 'Workplace health and safety metrics',
  },
  {
    code: 'STAKEHOLDER_GOV',
    name: 'Stakeholder Governance',
    category: 'Social',
    unit: 'score',
    description: 'Stakeholder engagement quality',
  },
];

// Governance Metrics (G)
const govMetrics = [
  {
    code: 'BOARD_DIVERSITY',
    name: 'Board Diversity',
    category: 'Governance',
    unit: 'percentage',
    description: 'Board member diversity composition',
  },
  {
    code: 'EXECUTIVE_PAY',
    name: 'Executive Compensation',
    category: 'Governance',
    unit: 'ratio',
    description: 'CEO to median worker pay ratio',
  },
  {
    code: 'AUDIT_QUALITY',
    name: 'Audit Quality',
    category: 'Governance',
    unit: 'score',
    description: 'External audit effectiveness',
  },
  {
    code: 'ETHICS_POLICY',
    name: 'Ethics & Integrity',
    category: 'Governance',
    unit: 'score',
    description: 'Ethics policy coverage',
  },
  {
    code: 'ANTI_CORRUPTION',
    name: 'Anti-Corruption',
    category: 'Governance',
    unit: 'score',
    description: 'Anti-corruption measures',
  },
  {
    code: 'RISK_MANAGEMENT',
    name: 'Risk Management',
    category: 'Governance',
    unit: 'score',
    description: 'Enterprise risk management',
  },
  {
    code: 'COMPLIANCE',
    name: 'Regulatory Compliance',
    category: 'Governance',
    unit: 'score',
    description: 'Compliance with regulations',
  },
  {
    code: 'TRANSPARENCY',
    name: 'Disclosure Transparency',
    category: 'Governance',
    unit: 'score',
    description: 'Financial disclosure quality',
  },
];

const socialReadings = [
  {
    metric_id: 'EMPLOYEE_WELLBEING',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 82,
    calculated_value: 85,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'DIVERSITY_INCLUSION',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 78,
    calculated_value: 80,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'LABOR_RIGHTS',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 95,
    calculated_value: 96,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'COMMUNITY_ENGAGEMENT',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 450,
    calculated_value: 480,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'SUPPLY_CHAIN',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 72,
    calculated_value: 75,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'DATA_PRIVACY',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 88,
    calculated_value: 90,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'HEALTH_SAFETY',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 91,
    calculated_value: 93,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'STAKEHOLDER_GOV',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 80,
    calculated_value: 82,
    status: 'approved',
    created_by: 'system',
  },
];

const govReadings = [
  {
    metric_id: 'BOARD_DIVERSITY',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 40,
    calculated_value: 45,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'EXECUTIVE_PAY',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 25,
    calculated_value: 22,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'AUDIT_QUALITY',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 92,
    calculated_value: 94,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'ETHICS_POLICY',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 88,
    calculated_value: 90,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'ANTI_CORRUPTION',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 95,
    calculated_value: 97,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'RISK_MANAGEMENT',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 85,
    calculated_value: 87,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'COMPLIANCE',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 98,
    calculated_value: 99,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'TRANSPARENCY',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 82,
    calculated_value: 85,
    status: 'approved',
    created_by: 'system',
  },
];

async function setupESGMetrics() {
  console.log('🔧 Adding Social & Governance Metrics...\n');

  // Social Metrics
  console.log('📊 Creating Social Metrics...');
  for (const m of socialMetrics) {
    const result = await ncb.from('metric_definitions').insert(m);
    console.log(
      `  ${result.error ? '⚠️' : '✅'} ${m.code}: ${result.error ? result.error.message : 'OK'}`
    );
  }

  console.log('\n📈 Creating Social Readings...');
  for (const r of socialReadings) {
    const result = await ncb.from('esg_readings').insert(r);
    console.log(
      `  ${result.error ? '⚠️' : '✅'} ${r.metric_id}: ${result.error ? result.error.message : 'OK'}`
    );
  }

  // Governance Metrics
  console.log('\n📊 Creating Governance Metrics...');
  for (const m of govMetrics) {
    const result = await ncb.from('metric_definitions').insert(m);
    console.log(
      `  ${result.error ? '⚠️' : '✅'} ${m.code}: ${result.error ? result.error.message : 'OK'}`
    );
  }

  console.log('\n📈 Creating Governance Readings...');
  for (const r of govReadings) {
    const result = await ncb.from('esg_readings').insert(r);
    console.log(
      `  ${result.error ? '⚠️' : '✅'} ${r.metric_id}: ${result.error ? result.error.message : 'OK'}`
    );
  }

  // Final verification
  console.log('\n📋 Final Verification...');
  const mResult = await ncb.from('metric_definitions').select('*');
  const rResult = await ncb.from('esg_readings').select('*');

  const envCount = mResult.data?.filter((m: any) => m.category === 'Environmental').length || 0;
  const sCount = mResult.data?.filter((m: any) => m.category === 'Social').length || 0;
  const gCount = mResult.data?.filter((m: any) => m.category === 'Governance').length || 0;

  console.log(`\n   📊 Total Metrics: ${mResult.data?.length || 0}`);
  console.log(`      Environmental: ${envCount}`);
  console.log(`      Social: ${sCount}`);
  console.log(`      Governance: ${gCount}`);
  console.log(`   📈 Total Readings: ${rResult.data?.length || 0}`);

  console.log('\n✨ ESG Metrics Setup Complete!');
}

setupESGMetrics().catch(console.error);
