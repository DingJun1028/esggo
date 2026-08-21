import { logger } from '../utils/logger.js';
import { CodexCompiler } from '../core/codex-compiler.js';
import type { SummonOptions } from '../types/index.js';

export async function summonCommand(options: SummonOptions) {
  try {
    logger.info('🌟 Summoning Autonomous Agent...');

    const compiler = new CodexCompiler({
      coreOnly: options.core ?? false,
      verbose: options.verbose ?? false
    });

    const result = await compiler.compile();

    logger.success(`✅ Compilation complete: ${result.artifactCount} artifacts processed`);
    logger.info(`📦 Output: ${result.outputPath}`);

    if (options.verbose) {
      logger.debug(JSON.stringify(result.metadata, null, 2));
    }
  } catch (error) {
    logger.error(`❌ Summoning failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
