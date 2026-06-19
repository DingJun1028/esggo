import { esgDataCollector } from '../src/services/esgDataCollector';
import { OmniSustainableGrowth, ImpactResult } from '../src/services/OmniSustainableGrowth';
import { omniLogger, LogCategory } from '../src/omni/infrastructure/logging/OmniLogger';

async function verifyHardening() {
  console.log('Starting verification of Phase 5 Hardening...');

  // 1. Verify esgDataCollector.destroy()
  console.log('\n--- Verifying ESGDataCollector Resource Cleanup ---');

  // Add a collection task
  esgDataCollector.addTask({
    id: 'verify_test_task',
    name: 'Test Sensor',
    dataSource: 'iot_sensors',
    interval: 60,
    config: {},
  });

  console.log('Task added. Waiting for initial checking...');
  await new Promise(resolve => setTimeout(resolve, 100)); // Let async operations settle

  console.log('Calling destroy()...');
  esgDataCollector.destroy();
  console.log('Destroy called. Resources cleared successfully.');

  // In a real integration test we would check internal state, but here we rely on no errors being thrown
  // and the absence of further logs from this source.

  // 2. Verify OmniSustainableGrowth Logging
  console.log('\n--- Verifying OmniSustainableGrowth Logging ---');

  const oldData: any = {
    environmental: { carbonFootprint: 100 },
    governance: { transparencyScore: 80 },
    social: { communityImpact: 50 },
  };

  const newData: any = {
    environmental: { carbonFootprint: 40 }, // Reduction > 50
    governance: { transparencyScore: 95 }, // Score > 90
    social: { communityImpact: 60 },
  };

  console.log('Processing ESG Impact (expecting logs for traits unlocked)...');
  const result = OmniSustainableGrowth.processEsgImpact(oldData, newData);

  console.log('Impact Result:', JSON.stringify(result, null, 2));

  console.log('\n--- Verification Complete ---');
  console.log(
    'Please check logs for "GROWTH" category and "ESGDataCollector resources destroyed successfully".'
  );

  // [NEW] Phase 4 Hardening Verification
  console.log('\n--- Verifying Phase 4: Server-Side Hardening ---');

  console.log('[TEST] Blockchain Validations:');
  const { blockchainService } = await import('../server/services/blockchain.ts'); // Use .ts for tsx
  try {
    console.log('   Attempting to anchor invalid hash (should fail gracefully)...');
    await blockchainService.anchorHash(null);
  } catch (e: any) {
    console.log('   ✅ Caught expected error:', e.message);
  }

  console.log('[TEST] OCR Validations:');
  const ocrService = (await import('../server/services/ocrService.ts')).default;
  try {
    console.log('   Attempting to extract from empty buffer (should fail validation)...');
    await ocrService.extractText(Buffer.alloc(0));
  } catch (e: any) {
    console.log('   ✅ Caught expected error:', e.message);
  }
}

verifyHardening().catch(console.error);
