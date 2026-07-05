/**
 * Carbon Footprint Calculator Example
 * Demonstrates Smart AI Router integration with ESG carbon accounting
 */

import { createSmartAIRouter } from './index';

async function calculateCarbonFootprint() {
  const router = await createSmartAIRouter({
    gateway: {
      enabled: true,
      defaultComplianceTags: ['ISO-14064-1']
    }
  });

  // Scope 1: Direct emissions
  const scope1Result = await router.routeAndExecute(
    'carbon_calculation',
    `Calculate Scope 1 CO2 emissions for:
    - Diesel generator: 50,000 liters/year
    - Natural gas: 10,000 m3/year
    - Company vehicles: 25,000 km/year`,
    { useGateway: true }
  );

  // Scope 2: Indirect emissions from purchased energy
  const scope2Result = await router.routeAndExecute(
    'carbon_calculation',
    `Calculate Scope 2 CO2 emissions for:
    - Electricity: 500,000 kWh/year
    - Purchased steam: 1,000 tons/year`,
    { useGateway: true }
  );

  // Scope 3: Value chain emissions
  const scope3Result = await router.routeAndExecute(
    'carbon_calculation',
    `Calculate Scope 3 CO2 emissions for:
    - Business travel: 100,000 km
    - Employee commuting: 500,000 km
    - Purchased goods and services: $2M`,
    { useGateway: true }
  );

  return {
    scope1: scope1Result.result,
    scope2: scope2Result.result,
    scope3: scope3Result.result,
    total: {
      traceId: scope1Result.traceId,
      timestamp: new Date().toISOString()
    }
  };
}

export { calculateCarbonFootprint };