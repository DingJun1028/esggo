/**
 * 🌟 Truth-Goodness-Beauty 4T Protocol - Usage Examples
 *
 * Demonstrates the 4T (Traceable, Trackable, Trustworthy, Transparent) Protocol
 * in action within the ESG Sunshine system.
 *
 * Scenarios:
 * 1. ESG Training Data Collection -> Sealed to Evidence Vault
 * 2. Carbon Emission Calculation -> Transparent Formula & Source
 * 3. Supply Chain Tracking -> Trackable Lifecycle
 */

import {
  create4TDataChain,
  verify4TIntegrity,
  TruthGoodBeautySealer,
  type IComponentCore,
} from '../services/TruthGoodBeauty4TProtocol.js';
import * as crypto from 'crypto';

// ============================================================================
// Scenario 1: ESG Training Data Collection (Evidence Vault)
// ============================================================================

/**
 * Demonstrates collecting HR training data and sealing it into the Evidence Vault
 * for immutability.
 */
async function example1_TrainingDataCollection(): Promise<IComponentCore> {
  console.log('\n=======================================================================');
  console.log('🌟 Scenario 1: HR Training Data Collection');
  console.log('=======================================================================');

  // Create initial 4T Data Chain
  const trainingData = create4TDataChain({
    componentId: 'training-2026-q1',
    componentName: 'Q1 Employee Training Data',

    // Truth - Source Origin
    sourceOrigin: 'HR Management System v3.2',
    creator: 'hr-admin@company.com',

    // Goodness - Transparency
    calculation: `
      Average Training Hours Calculation:
      1. Extract total training hours from HR system.
      2. Count active employees during Q1.
      3. Formula: Avg = Total Hours / Total Employees
      4. Verification: Cross-referenced with Learning Management System (LMS).
    `,
    formula: 'Avg Hours = Total Hours / Total Employees',
    parameters: {
      totalEmployees: 1000,
      totalHours: 12500,
      avgHours: 12.5,
      breakdown: {
        technical: 5000,
        management: 4500,
        esg: 3000,
      },
    },
    methodology: 'ISO 30414 Human Capital Reporting',
  });

  // Add Trackability Events
  if (trainingData.trackable && trainingData.trackable.eventLog) {
    trainingData.trackable.eventLog.push({
      eventId: crypto.randomUUID(),
      eventType: 'DATA_COLLECTED',
      timestamp: new Date(),
      actor: 'hr-admin@company.com',
      details: {
        records: 1000,
        source: 'HR System',
        validationPassed: true,
      },
    });
  }

  // Seal with 4T Protocol
  const sealer = new TruthGoodBeautySealer();
  await sealer.sealToVault(trainingData);

  // Verify Integrity
  const verification = verify4TIntegrity(trainingData);
  console.log('\n🔍 Verification Results:');
  console.log(`   - Valid: ${verification.valid ? '✅ Yes' : '❌ No'}`);
  console.log(`   - Score: ${verification.score}/100`);
  console.log(`   - Trace ID: ${trainingData.traceable.traceId.substring(0, 16)}...`);
  console.log(`   - Data Hash: ${trainingData.trustworthy.dataHash?.substring(0, 16)}...`);

  return trainingData;
}

// ============================================================================
// Scenario 2: Carbon Emission Calculation (Transparency)
// ============================================================================

/**
 * Demonstrates transparent carbon calculation with referenced formulas and factors.
 */
async function example2_CarbonEmissionCalculation(): Promise<IComponentCore> {
  console.log('\n=======================================================================');
  console.log('🌟 Scenario 2: Carbon Emission Calculation');
  console.log('=======================================================================');

  // Raw Data
  const electricityUsage = 50000; // kWh
  const emissionFactor = 0.509; // kg CO2e/kWh (Taiwan EPA 2023)
  const carbonEmission = electricityUsage * emissionFactor; // 25,450 kg CO2e

  // Create 4T Chain
  const emissionData = create4TDataChain({
    componentId: 'carbon-2026-01',
    componentName: 'January 2026 Electricity Emissions',

    // Truth
    sourceOrigin: 'IoT Smart Meter #A123456',
    creator: 'carbon-tracker@company.com',

    // Goodness - Calculation Logic
    calculation: `
      Emission Calculation based on IPCC 2006 Guidelines:
      
      Steps:
      1. Read electricity usage (kWh) from Smart Meter.
      2. Apply emission factor (kg CO2e/kWh).
      3. Formula: Emissions = Usage * Factor.
      4. Convert to tCO2e (tonnes).
      
      Sources:
      - Usage: Real-time IoT Meter Data
      - Factor: Taiwan EPA 2023 Grid Emission Factor
    `,
    formula: 'CO2e (kg) = Electricity (kWh) * Emission Factor (kg/kWh)',
    parameters: {
      electricityUsage,
      emissionFactor,
      emissionFactorSource: 'Taiwan EPA 2023',
      region: 'Taiwan',
      carbonEmission,
      carbonEmissionTonnes: carbonEmission / 1000,
      unit: 'kg CO2e',
      month: '2026-01',
      meterReading: {
        start: 125000,
        end: 175000,
        consumption: 50000,
      },
    },
    methodology: 'IPCC 2006 + GHG Protocol Scope 2 Guidance',
  });

  // Add Audit Trail
  if (emissionData.trackable && emissionData.trackable.auditTrail) {
    emissionData.trackable.auditTrail.push({
      auditId: crypto.randomUUID(),
      action: 'EMISSION_CALCULATED',
      performedBy: 'carbon-tracker@company.com',
      timestamp: new Date(),
      before: null,
      after: carbonEmission,
      reason: 'Monthly carbon inventory calculation',
    });
  }

  // Seal
  const sealer = new TruthGoodBeautySealer();
  await sealer.sealToVault(emissionData);

  console.log('\n📊 Calculation Summary:');
  console.log(`   - Usage: ${electricityUsage} kWh`);
  console.log(`   - Factor: ${emissionFactor} kg CO2e/kWh`);
  console.log(
    `   - Result: ${carbonEmission} kg CO2e (${(carbonEmission / 1000).toFixed(2)} tCO2e)`
  );
  console.log(`\n🔍 Transparency Check:`);
  console.log(`   - Formula: ${emissionData.transparent.formula}`);
  console.log(`   - Methodology: ${emissionData.transparent.methodology}`);
  console.log(`   - Open Source: ${emissionData.transparent.openSource ? '✅ Yes' : '❌ No'}`);

  return emissionData;
}

// ============================================================================
// Scenario 3: Supply Chain Tracking (Trackability)
// ============================================================================

async function example3_SupplierDataTracking(): Promise<IComponentCore> {
  console.log('\n=======================================================================');
  console.log('🌟 Scenario 3: Supply Chain Data Tracking');
  console.log('=======================================================================');

  const supplierData = create4TDataChain({
    componentId: 'supplier-xyz-2026-q1',
    componentName: 'Supplier XYZ Corp Q1 Emissions Report',

    // Truth
    sourceOrigin: 'Supplier Portal API v2.1 | XYZ Corp (ID: SUP-12345)',
    creator: 'procurement@company.com',

    // Goodness
    calculation: `
      Scope 3 Allocation Method:
      1. Receive supplier total emissions.
      2. Calculate revenue share (Purchase / Revenue).
      3. Allocate emissions based on share.
    `,
    formula: 'Allocated Emissions = Supplier Total * (Purchase Amount / Revenue)',
    parameters: {
      supplierId: 'SUP-12345',
      supplierName: 'XYZ Corp',
      supplierTotalEmissions: 100000, // tCO2e
      supplierRevenue: 50000000, // USD
      purchaseAmount: 5000000, // USD
      allocatedEmissions: 10000, // tCO2e
      auditCertificate: 'ISO 14064-1:2018 Verified',
      reportingPeriod: '2026-Q1',
    },
    methodology: 'GHG Protocol Scope 3 Category 1: Purchased Goods',
  });

  // Trackability Events
  const trackingChain = [
    {
      eventId: crypto.randomUUID(),
      eventType: 'DATA_SUBMITTED',
      timestamp: new Date('2026-04-01'),
      actor: 'supplier-xyz@example.com',
      details: { method: 'Supplier Portal', status: 'submitted' },
    },
    {
      eventId: crypto.randomUUID(),
      eventType: 'THIRD_PARTY_AUDIT',
      timestamp: new Date('2026-04-05'),
      actor: 'audit-firm@example.com',
      details: { auditor: 'ABC Audit LLP', status: 'verified' },
    },
    {
      eventId: crypto.randomUUID(),
      eventType: 'DATA_APPROVED',
      timestamp: new Date('2026-04-10'),
      actor: 'procurement@company.com',
      details: { approver: 'John Doe', status: 'approved' },
    },
  ];

  if (supplierData.trackable && supplierData.trackable.eventLog) {
    // Use spread operator to push all events
    supplierData.trackable.eventLog.push(...trackingChain);
  }

  // Seal
  const sealer = new TruthGoodBeautySealer();
  await sealer.sealToVault(supplierData);

  console.log('\n📦 Supply Chain Data:');
  console.log(`   - Supplier: ${supplierData.transparent.parameters.supplierName}`);
  console.log(`   - Allocated: ${supplierData.transparent.parameters.allocatedEmissions} tCO2e`);
  console.log(`\n👣 Tracking Log:`);
  trackingChain.forEach((event, index) => {
    console.log(`   ${index + 1}. ${event.eventType}`);
    console.log(`      Time: ${event.timestamp.toISOString().substring(0, 10)}`);
    console.log(`      Actor: ${event.actor}`);
  });

  return supplierData;
}

// ============================================================================
// Scenario 4: End-to-End Workflow
// ============================================================================

async function example4_EndToEnd4TWorkflow() {
  console.log('\n=======================================================================');
  console.log('🌟 Scenario 4: End-to-End 4T Workflow');
  console.log('=======================================================================');

  console.log('Step 1: Training Data...');
  const training = await example1_TrainingDataCollection();

  console.log('\nStep 2: Carbon Calculation...');
  const emission = await example2_CarbonEmissionCalculation();

  console.log('\nStep 3: Supplier Tracking...');
  const supplier = await example3_SupplierDataTracking();

  console.log('\n=======================================================================');
  console.log('🌟 Overall 4T Integrity Summary');
  console.log('=======================================================================');

  const allData = [training, emission, supplier];
  const avgScore =
    allData.reduce((sum, d) => {
      const v = verify4TIntegrity(d);
      return sum + v.score;
    }, 0) / allData.length;

  console.log(`Total Data Points: ${allData.length}`);
  console.log(`Average Integrity Score: ${avgScore.toFixed(1)}/100`);
  console.log(`All Sealed: ${allData.every(d => d.trustworthy.sealed) ? '✅ Yes' : '❌ No'}`);
  console.log(`All Traceable: ${allData.every(d => d.traceable.traceId) ? '✅ Yes' : '❌ No'}`);
}

// ============================================================================
// Main Execution
// ============================================================================

async function runAllExamples() {
  console.log('\n');
  console.log('==============================================================================');
  console.log('🌟 Truth-Goodness-Beauty 4T Protocol Usage Examples');
  console.log('   Demonstrating the power of the 4T Protocol for ESG data integrity.');
  console.log('==============================================================================');

  try {
    await example4_EndToEnd4TWorkflow();
    console.log('\n\n✨ Examples Completed Successfully.\n');
  } catch (error) {
    console.error('\n❌ Error executing examples:', error);
  }
}

// Check if running directly
if (require.main === module) {
  runAllExamples();
}

export {
  example1_TrainingDataCollection,
  example2_CarbonEmissionCalculation,
  example3_SupplierDataTracking,
  example4_EndToEnd4TWorkflow,
  type IComponentCore,
};
