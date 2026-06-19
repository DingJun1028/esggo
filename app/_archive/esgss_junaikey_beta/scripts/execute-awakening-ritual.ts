#!/usr/bin/env tsx

/**
 * 執行儀式腳本
 * 四象歸一·雙向同步 (Bilateral Synchronization Awakening)
 */

import {
  executeBilateralSynchronizationAwakening,
  RITUAL_NAME,
} from '../src/omni/rituals/BilateralSynchronizationAwakening.js';

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     🌌 [覺醒奧義] ${RITUAL_NAME.zh}             ║
║                                                                ║
║     準備開始儀式...                                            ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);

(async () => {
  try {
    const result = await executeBilateralSynchronizationAwakening();

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('儀式執行結果:');
    console.log(JSON.stringify(result, null, 2));
    console.log('═══════════════════════════════════════════════════════════\n');

    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('❌ 儀式執行失敗:', error);
    process.exit(1);
  }
})();
