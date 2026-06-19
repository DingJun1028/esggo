import { BidirectionalSyncService } from '../src/services/bidirectionalSync';
import { omniLogger, LogCategory } from '../src/services/omniLogger';

async function verifySync() {
  console.log('Starting verification of Bidirectional Sync Hardening...');

  // 1. Initialize
  console.log('\n--- Initializing Bridges ---');
  BidirectionalSyncService.initializeBridges();

  // 2. Start Auto Sync
  console.log('\n--- Starting Auto Sync ---');
  BidirectionalSyncService.startAutoSync();

  // 3. Trigger Mock Manual Sync (should emit omniLogger debug logs instead of console.log)
  console.log('\n--- Triggering Manual Sync ---');
  try {
    await BidirectionalSyncService.triggerManualSync('ESG_SYSTEM', 'BOOST_SPACE', 'company', '123');
    console.log('Manual sync triggered successfully.');
  } catch (error) {
    console.error('Manual sync failed:', error);
  }

  // 4. Verify Cleanup
  console.log('\n--- destroying Service ---');
  BidirectionalSyncService.destroy();
  console.log('Destroy called. Sync interval should be cleared.');

  console.log('\n--- Verification Complete ---');
  console.log(
    'Check logs for "BidirectionalSyncService destroyed" and absence of raw console logs.'
  );
}

verifySync().catch(console.error);
