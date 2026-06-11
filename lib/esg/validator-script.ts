import { CarbonCalculator } from './carbon-calculator';

async function test() {
  console.log('🧪 Starting CarbonCalculator validation...');

  // Test 1: Electricity
  const res1 = CarbonCalculator.calculate({
    factorId: 'electricity_tw_2023',
    activityAmount: 1000,
    sourceOrigin: 'Test Bill'
  });
  console.log('✅ Test 1 (Electricity):', res1.impact_metric === '495.0000 kgCO2e' ? 'PASSED' : 'FAILED');
  console.log('   Value:', res1.impact_metric);

  // Test 2: Diesel
  const res2 = CarbonCalculator.calculate({
    factorId: 'diesel_stationary',
    activityAmount: 50,
    sourceOrigin: 'Fuel Receipt'
  });
  console.log('✅ Test 2 (Diesel):', res2.impact_metric === '130.1000 kgCO2e' ? 'PASSED' : 'FAILED');
  console.log('   Value:', res2.impact_metric);

  console.log('\n🌟 Component Core Example (5T Protocol):');
  console.log(JSON.stringify(res2, null, 2));
}

test().catch(console.error);
