import { logger } from '../utils/logger.js';
import { VaultSynchronizer } from '../core/vault-sync.js';
import type { SyncOptions } from '../types/index.js';

export async function syncVaultCommand(options: SyncOptions) {
  try {
    logger.info('🔄 Initiating Vault Synchronization...');

    const sync = new VaultSynchronizer({
      force: options.force ?? false,
      dryRun: options.dryRun ?? false
    });

    const result = await sync.execute();

    logger.success(`✅ Sync complete: ${result.filesSync} files synchronized`);
    logger.info(`📍 Target: ${result.vaultPath}`);

    if (result.conflicts && result.conflicts.length > 0) {
      logger.warn(`⚠️ Conflicts detected: ${result.conflicts.length}`);
      result.conflicts.forEach(c => logger.debug(`  - ${c}`));
    }
  } catch (error) {
    logger.error(`❌ Sync failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
