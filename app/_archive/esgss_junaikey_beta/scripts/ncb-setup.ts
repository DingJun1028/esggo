/**
 * NCB Database Setup Script - Updated for correct schema
 */

import { ncb } from '../src/lib/ncb/client.js';

const metrics = [
  {
    code: 'ENV_RISK_SCORE',
    name: 'Environmental Risk Score',
    category: 'Environmental',
    unit: 'score',
    description: 'Overall environmental risk assessment',
  },
  {
    code: 'CARBON_EMISSIONS',
    name: 'Carbon Emissions',
    category: 'Environmental',
    unit: 'tCO2e',
    description: 'Total carbon emissions',
  },
  {
    code: 'ENERGY_EFFICIENCY',
    name: 'Energy Efficiency',
    category: 'Environmental',
    unit: 'kWh',
    description: 'Energy consumption efficiency',
  },
  {
    code: 'WATER_USAGE',
    name: 'Water Usage',
    category: 'Environmental',
    unit: 'm3',
    description: 'Water consumption',
  },
  {
    code: 'WASTE_MANAGEMENT',
    name: 'Waste Management',
    category: 'Environmental',
    unit: 'tonnes',
    description: 'Waste generated and managed',
  },
  {
    code: 'BIODIVERSITY',
    name: 'Biodiversity Index',
    category: 'Environmental',
    unit: 'index',
    description: 'Biodiversity impact score',
  },
  {
    code: 'AIR_QUALITY',
    name: 'Air Quality Index',
    category: 'Environmental',
    unit: 'AQI',
    description: 'Air quality measurement',
  },
  {
    code: 'CLIMATE_RISK',
    name: 'Climate Risk Score',
    category: 'Environmental',
    unit: 'score',
    description: 'Climate-related risk assessment',
  },
];

const readings = [
  {
    metric_id: 'ENV_RISK_SCORE',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 75,
    calculated_value: 82.5,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'CARBON_EMISSIONS',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 1200,
    calculated_value: 1150.5,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'ENERGY_EFFICIENCY',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 85,
    calculated_value: 88.2,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'WATER_USAGE',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 5000,
    calculated_value: 4800,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'WASTE_MANAGEMENT',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 150,
    calculated_value: 145,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'BIODIVERSITY',
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
    metric_id: 'AIR_QUALITY',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 45,
    calculated_value: 42,
    status: 'approved',
    created_by: 'system',
  },
  {
    metric_id: 'CLIMATE_RISK',
    org_unit_id: 'ORG_001',
    period_type: 'monthly',
    period_start: '2026-01-01',
    period_end: '2026-01-31',
    value: 65,
    calculated_value: 68,
    status: 'approved',
    created_by: 'system',
  },
];

async function setupDatabase() {
  console.log('🔧 Setting up NCB Database...\n');

  // Create metric definitions
  console.log('📊 Creating metric definitions...');
  for (const m of metrics) {
    const result = await ncb.from('metric_definitions').insert(m);
    console.log(
      `  ${result.error ? '⚠️' : '✅'} ${m.code}: ${result.error ? result.error.message : 'OK'}`
    );
  }

  // Create readings
  console.log('\n📈 Creating sample readings...');
  for (const r of readings) {
    const result = await ncb.from('esg_readings').insert(r);
    console.log(
      `  ${result.error ? '⚠️' : '✅'} ${r.metric_id}: ${result.error ? result.error.message : 'OK'}`
    );
  }

  // Verify
  console.log('\n📋 Verification...');
  const mResult = await ncb.from('metric_definitions').select('*');
  const rResult = await ncb.from('esg_readings').select('*');
  console.log(`   Metrics: ${mResult.data?.length || 0}`);
  console.log(`   Readings: ${rResult.data?.length || 0}`);
  console.log('\n✨ Done!');
}

setupDatabase().catch(console.error);
