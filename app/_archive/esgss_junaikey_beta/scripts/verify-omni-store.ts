import { OmniStore, OmniNamespace } from '../src/services/OmniStore';
import { omniLogger, LogCategory } from '../src/services/omniLogger';

async function verifyOmniStore() {
  console.log('--- OmniStore Verification ---');
  let errors = 0;

  // 1. Test Key CRUD
  console.log('[1/4] Testing Basic CRUD...');
  const testKey = 'test_item';
  const testValue = { foo: 'bar', timestamp: Date.now() };

  OmniStore.setItem(OmniNamespace.SYSTEM, testKey, testValue);
  const retrieved = OmniStore.getItem<any>(OmniNamespace.SYSTEM, testKey);

  if (retrieved.success && retrieved.data.foo === 'bar') {
    console.log('  ✅ Set/Get Item success');
  } else {
    console.error('  ❌ Set/Get Item failed', retrieved);
    errors++;
  }

  // 2. Test Namespace Isolation
  console.log('[2/4] Testing Namespace Isolation...');
  const agentKey = 'agent_007';
  OmniStore.setItem(OmniNamespace.AGENT, agentKey, { name: 'Bond' });
  const systemLeak = OmniStore.getItem(OmniNamespace.SYSTEM, agentKey);

  if (!systemLeak.success) {
    console.log('  ✅ Namespace isolation verified (System cannot see Agent keys)');
  } else {
    console.error('  ❌ Namespace isolation failed');
    errors++;
  }

  // 3. Test List Keys & Clear
  console.log('[3/4] Testing List & Clear...');
  const keys = OmniStore.listKeys(OmniNamespace.AGENT);
  if (keys.includes(agentKey)) {
    console.log(`  ✅ List Keys success (Found ${keys.length} keys)`);
  } else {
    console.error('  ❌ List Keys failed');
    errors++;
  }

  OmniStore.clearNamespace(OmniNamespace.AGENT);
  const clearedKeys = OmniStore.listKeys(OmniNamespace.AGENT);
  if (clearedKeys.length === 0) {
    console.log('  ✅ Clear Namespace success');
  } else {
    console.error('  ❌ Clear Namespace failed');
    errors++;
  }

  // 4. Test Backup/Restore
  console.log('[4/4] Testing Backup/Restore...');
  OmniStore.setItem(OmniNamespace.RUNE, 'rune_test', { power: 9000 });
  const backupJson = OmniStore.createBackup();

  OmniStore.clearNamespace(OmniNamespace.RUNE);
  const emptyCheck = OmniStore.getItem(OmniNamespace.RUNE, 'rune_test');

  if (!emptyCheck.success) {
    OmniStore.restoreBackup(backupJson);
    const restored = OmniStore.getItem<any>(OmniNamespace.RUNE, 'rune_test');
    if (restored.success && restored.data.power === 9000) {
      console.log('  ✅ Backup/Restore success');
    } else {
      console.error('  ❌ Restore failed');
      errors++;
    }
  } else {
    console.error('  ❌ Clear before restore failed');
    errors++;
  }

  if (errors === 0) {
    console.log('\n🎉 OmniStore Information Architecture Verified!');
    process.exit(0);
  } else {
    console.error(`\n❌ Validation failed with ${errors} errors.`);
    process.exit(1);
  }
}

verifyOmniStore().catch(console.error);
