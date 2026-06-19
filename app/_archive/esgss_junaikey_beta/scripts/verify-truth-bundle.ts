import { TruthBundleService } from '../src/services/integration/TruthBundleService';
import { useESGStore } from '../src/store/useESGStore';
import { omniLogger, LogCategory } from '../src/omni/infrastructure/logging/OmniLogger';

// Mock store for testing
useESGStore.setState({
  totalCO2e: 1000,
  itEnergyKWh: 500,
  anchoredCount: 5,
  recentAnchors: [
    { id: 'test-anchor', type: 'block', hash: '0x123', timestamp: new Date().toISOString() },
  ],
  updateMetrics: () => {},
  addAnchor: () => {},
});

async function verify() {
  console.log('🧪 Starting Truth Bundle Verification...');

  // 1. Generate Bundle
  const bundle = TruthBundleService.generateBundle();
  console.log(`\n📦 Generated Bundle ID: ${bundle.bundleId}`);
  console.log(`🔑 Signature: ${bundle.signature}`);

  // 2. Verify Valid Bundle
  const isValid = TruthBundleService.verifyBundle(bundle);
  console.log(`\n✅ Verification Result (Should be TRUE): ${isValid}`);

  if (!isValid) {
    console.error('❌ Verification Failed on fresh bundle!');
    process.exit(1);
  }

  // 3. Verify Tampered Bundle
  const tamperedBundle = { ...bundle, metrics: { ...bundle.metrics, totalCO2e: 9999 } };
  const isTamperedValid = TruthBundleService.verifyBundle(tamperedBundle);
  console.log(`\n🕵️ Tamper Check (Should be FALSE): ${isTamperedValid}`);

  if (isTamperedValid) {
    console.error('❌ Tamper Check Failed! Invalid bundle was verified as true.');
    process.exit(1);
  }

  console.log('\n🎉 Integrity Layer Verified Successfully!');
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
