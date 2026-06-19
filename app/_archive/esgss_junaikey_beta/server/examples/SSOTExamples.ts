/**
 * 🏛️ Single Source of Truth (SSOT) & 3+1 Protocol Examples
 *
 * Demonstrates how to create immutable, verifiable, and transparent data components
 * using the Universal Component Core and the 3+1 Protocol.
 *
 * Core Principles:
 * - Zero Hallucination (No made-up data)
 * - Traceable, Trackable, Calculable, Immutable (3+1)
 */

import {
  UniversalComponentCoreFactory,
  ThreePlusOneProtocolExecutor,
  calculateEntropyReduction,
  type IComponentCore,
  type ThreePlusOneProtocol,
} from '../services/UniversalComponentCore';
import crypto from 'crypto';

// ============================================================================
// Example 1: Data Collection & Sealing (SSOT Creation)
// ============================================================================

/**
 * Scenario: Collecting HR Training Data
 * --------------------------------------------------
 * [Source] HR Management System v3.2
 * [Raw Data] /vault/raw/hr-training-2026-q1.json
 * [Verification] API Response + Database Cross-Check
 */
async function example1_DataCollectionAndSealing() {
  console.log('\n=======================================================================');
  console.log('🏛️ Example 1: Creating an SSOT Component');
  console.log('=======================================================================');

  // Step 1: Initialize Universal Component Core
  const core = UniversalComponentCoreFactory.create({
    sourceOrigin: 'HR Management System v3.2 API',
    rawDataPath: '/vault/raw/hr-training-2026-q1.json',
    verificationMethod: 'API Response Validation + Database Cross-Check',
  });

  console.log('✅ Component Core Initialized:');
  console.log(`   UUID: ${core.uuid}`);
  console.log(`   Version: ${core.version}`);
  console.log(`   Timestamp: ${new Date(core.timestamp).toISOString()}`);
  console.log(`   Hash Lock: ${core.evidence[core.uuid]?.hashLock?.substring(0, 32)}...`);

  // Step 2: Prepare Business Data
  const trainingData = {
    totalEmployees: 1000,
    totalHours: 12500,
    breakdown: {
      technical: 5000,
      management: 4500,
      esg: 3000,
    },
  };

  // Step 3: Define 3+1 Protocol
  const protocol: ThreePlusOneProtocol = {
    // 🟢 Traceable
    traceable: {
      sourceOrigin: 'HR Management System v3.2 | Database ID: HR-2026-Q1',
      rawDataRetention: '/vault/raw/hr-training-2026-q1.json',
    },

    // 🔵 Trackable
    trackable: {
      lifecycleHooks: [
        {
          eventId: crypto.randomUUID(),
          eventType: 'CREATED',
          timestamp: Date.now(),
          actor: 'hr-data-collector@company.com',
          details: {
            source: 'API',
            recordCount: 1000,
            dataIntegrityCheck: 'passed',
          },
        },
      ],
      dataFlowPath: ['HR API', 'Data Validation', 'SSOT Core Creation', 'Evidence Vault'],
    },

    // 🟠 Transparent (Calculable)
    transparent: {
      algorithmFormula: 'Average Hours = Total Hours / Total Employees',
      formulaSource: '[ISO-30414] Section 3.2.1 - Training Metrics',
      calculationSteps: [
        '1. Fetch total hours from HR system',
        '2. Filter by category: Technical, Management, ESG',
        '3. Sum total hours',
        '4. Calculate Average = Sum / Headcount',
        '5. Exclude employees with <30 days tenure',
      ],
    },

    // 🔴 Trustworthy (Immutable)
    trustworthy: {
      hashLock: crypto.createHash('sha256').update(JSON.stringify(trainingData)).digest('hex'),
      frozen: true,
      verificationCode: crypto
        .createHash('sha256')
        .update(String(trainingData.totalHours))
        .digest('hex'),
    },
  };

  // Step 4: Execute Protocol
  const validated = ThreePlusOneProtocolExecutor.execute(trainingData, protocol);

  console.log('\n✅ 3+1 Protocol Execution Result:');
  console.log(`   SSOT ID: ${validated.ssot_id}`);
  console.log(`   Status: ${validated.status}`);
  console.log(`   Verified: ${validated.verified ? 'Yes' : 'No'}`);
  console.log(`   Evidence Link: ${validated.evidence_link}`);

  return { core, validated };
}

// ============================================================================
// Example 2: Entropy Reduction (Calculation)
// ============================================================================

/**
 * Scenario: Calculating Carbon Emissions
 * --------------------------------------------------
 * [Source] IoT Smart Meter + Taiwan EPA 2023 Factor
 * [Formula] IPCC-AR6 Equation 2.1
 */
async function example2_CarbonEmissionCalculation() {
  console.log('\n=======================================================================');
  console.log('🏛️ Example 2: Entropy Reduction (Calculation)');
  console.log('=======================================================================');

  // Raw Input
  const rawInput = {
    uuid: crypto.randomUUID(),
    origin: 'IoT Smart Meter #A123456 | Taiwan Power Company',
    values: [50000], // kWh
    emissionFactor: 0.509, // kg CO2e/kWh (Taiwan EPA 2023)
  };

  console.log('📥 Input Data:');
  console.log(`   Usage: ${rawInput.values[0]} kWh`);
  console.log(`   Factor: ${rawInput.emissionFactor} kg CO2e/kWh`);
  console.log(`   Origin: ${rawInput.origin}`);

  // Calculate using Entropy Reduction service
  const result = calculateEntropyReduction(rawInput);

  console.log('\n📤 Calculation Result:');
  console.log(`   Total Emissions: ${result.result} kg CO2e`);
  console.log(`   = ${(result.result / 1000).toFixed(2)} tCO2e`);

  console.log('\n🔍 Transparency Check:');
  console.log(`   Formula: E = AD * EF`);
  console.log(`   Calculation: ${rawInput.values[0]} * ${rawInput.emissionFactor}`);
  console.log(`   Source: [IPCC-AR6] Equation 2.1`);

  console.log('\n🛡️ SSOT Verification:');
  console.log(`   SSOT ID: ${result.ssot_id}`);
  console.log(`   Status: ${result.status}`);
  console.log(`   Verified: ${result.verified ? 'Yes' : 'No'}`);

  return result;
}

// ============================================================================
// Example 3: Verification Failure Test
// ============================================================================

/**
 * Demonstrates immutability. Attempting to modify frozen data should fail.
 */
async function example3_ThreePlusOneVerification() {
  console.log('\n=======================================================================');
  console.log('🏛️ Example 3: Immutability Test');
  console.log('=======================================================================');

  const data = {
    scope2Emissions: 25450, // kg CO2e
    electricityUsage: 50000, // kWh
    emissionFactor: 0.509,
  };

  console.log('🔒 Locking Data...');
  const frozenData = Object.freeze({ ...data });

  console.log('🧪 Attempting to tamper with frozen data...');
  try {
    // Force type casting to 'any' to bypass TypeScript compile check
    // and test runtime behavior (Strict Mode should throw error)
    (frozenData as any).scope2Emissions = 99999;
    console.log('   ❌ Tampering Succeeded (Unexpected!)');
  } catch (error) {
    console.log('   ✅ Tampering Failed (Expected: Data is Immutable)');
    // console.log(error);
  }
}

// ============================================================================
// Example 4: End-to-End Workflow
// ============================================================================

async function example4_EndToEndWorkflow() {
  console.log('\n\n=======================================================================');
  console.log('🏛️ SSOT End-to-End Workflow Demo');
  console.log('=======================================================================');

  console.log('\nStep 1: Data Collection & Sealing');
  await example1_DataCollectionAndSealing();

  console.log('\nStep 2: Transparent Calculation');
  await example2_CarbonEmissionCalculation();

  console.log('\nStep 3: Security Verification');
  await example3_ThreePlusOneVerification();

  console.log('\n✅ Workflow Complete.');
  console.log('   - Documentation: SSOT_契約.md');
  console.log('   - Implementation: server/services/UniversalComponentCore.ts');
}

// ============================================================================
// Example 5: Evidence Vault Query
// ============================================================================

function example5_EvidenceVaultQuery() {
  console.log('\n=======================================================================');
  console.log('🏛️ Example 5: Evidence Vault Query');
  console.log('=======================================================================');

  const core = UniversalComponentCoreFactory.create({
    sourceOrigin: 'Multi-Source ESG Data Aggregator',
    rawDataPath: '/vault/raw/esg-data-2026.json',
    verificationMethod: 'Multi-Layer Validation',
  });

  const evidenceKeys = ['electricity-data', 'water-usage-data', 'waste-data'];

  // Simulate adding evidence asynchronously
  evidenceKeys.forEach((key, index) => {
    UniversalComponentCoreFactory.addEvidence(core, key, {
      sourceOrigin: `Data Source ${index + 1}`,
      rawDataPath: `/vault/raw/${key}.json`,
      verificationMethod: 'Automated Validation',
    });
  });

  // Wait a bit for "async" operations (simulation) then print
  setTimeout(() => {
    console.log('🔍 Current Vault State:\n');
    Object.entries(core.evidence).forEach(([key, evidence]) => {
      console.log(`   Key: ${key}`);
      console.log(`   Source: ${evidence.sourceOrigin}`);
      console.log(`   Path: ${evidence.rawDataPath}`);
      console.log(`   Time: ${new Date(evidence.timestamp).toISOString()}`);
      console.log(`   Hash: ${evidence.hashLock.substring(0, 32)}...\n`);
    });
  }, 100);
}

// ============================================================================
// Execution
// ============================================================================

if (require.main === module) {
  example4_EndToEndWorkflow()
    .then(() => {
      setTimeout(example5_EvidenceVaultQuery, 500);
    })
    .catch(error => {
      console.error('\n❌ Error:', error);
    });
}

export {
  example1_DataCollectionAndSealing,
  example2_CarbonEmissionCalculation,
  example3_ThreePlusOneVerification,
  example4_EndToEndWorkflow,
  example5_EvidenceVaultQuery,
};
