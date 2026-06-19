import { socialEconomyService } from '../src/services/socialEconomyService';
import { OmniStore, OmniNamespace } from '../src/services/OmniStore';
import { SubscriptionTier } from '../src/types/core';
import { omniLogger, LogCategory } from '../src/services/omniLogger';

async function verifyEconomyUnlock() {
  console.log('--- Social Economy Unlock Verification ---');
  let errors = 0;
  const userId = 'user_test_economy';

  // 1. Initial State
  console.log('[1/3] Checking Initial State...');
  const initialSlots = OmniStore.getItem<number>(
    OmniNamespace.ECONOMY,
    `${userId}_warehouse_slots`
  );
  if (!initialSlots.success) {
    console.log('  ✅ Initial state empty as expected');
  } else {
    console.warn('  ⚠️ Initial state not empty:', initialSlots.data);
  }

  // 2. Upgrade to PRO
  console.log('[2/3] Upgrading Subscription to PRO...');
  await socialEconomyService.upgradeSubscription(userId, SubscriptionTier.PRO);

  // Verify OmniStore persistence
  const proSlots = OmniStore.getItem<number>(OmniNamespace.ECONOMY, `${userId}_warehouse_slots`);
  const proPartners = OmniStore.getItem<number>(OmniNamespace.ECONOMY, `${userId}_partner_slots`);

  if (proSlots.data === 500 && proPartners.data === 3) {
    console.log('  ✅ PRO Upgrade triggered correct unlocks (500 slots, 3 partners)');
  } else {
    console.error('  ❌ PRO Upgrade failed', { slots: proSlots.data, partners: proPartners.data });
    errors++;
  }

  // 3. Downgrade/Change Logic (Optional test, verify overwrite)
  console.log('[3/3] Changing Subscription to PLUS...');
  await socialEconomyService.upgradeSubscription(userId, SubscriptionTier.PLUS);

  // Verify OmniStore persistence update
  const plusSlots = OmniStore.getItem<number>(OmniNamespace.ECONOMY, `${userId}_warehouse_slots`);

  if (plusSlots.data === 200) {
    console.log('  ✅ PLUS Change triggered correct updates (200 slots)');
  } else {
    console.error('  ❌ PLUS Change failed', { slots: plusSlots.data });
    errors++;
  }

  if (errors === 0) {
    console.log('\n🎉 Economy Unlock Logic Verified!');
    process.exit(0);
  } else {
    console.error(`\n❌ Validation failed with ${errors} errors.`);
    process.exit(1);
  }
}

verifyEconomyUnlock().catch(console.error);
