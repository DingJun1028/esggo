#!/usr/bin/env node

import { Command } from 'commander';
import { summonCommand } from './commands/summon.js';
import { auditCommand } from './commands/audit.js';
import { syncVaultCommand } from './commands/sync-vault.js';
import { tagCommand } from './commands/tag.js';

const program = new Command();

program
  .name('unagent')
  .description('🤖 Autonomous Agent Codex - Self-directed knowledge compilation')
  .version('1.0.0');

program
  .command('summon')
  .description('Summon the autonomous agent to compile and process codex')
  .option('--core', 'Process core protocols only')
  .option('--verbose', 'Enable verbose logging')
  .action(summonCommand);

program
  .command('sync')
  .description('Synchronize compiled artifacts to Omni-Sanctuary vault')
  .option('--force', 'Force synchronization despite conflicts')
  .option('--dry-run', 'Preview sync operations without executing')
  .action(syncVaultCommand);

program
  .command('audit')
  .description('Audit codex integrity and compliance')
  .option('--strict', 'Enable strict mode validation')
  .option('--repair', 'Auto-repair detected issues')
  .action(auditCommand);

program
  .command('tag')
  .description('Tag artifacts with OmniTag contracts')
  .option('--init', 'Initialize missing tags')
  .option('--write', 'Write changes to disk')
  .option('--dir <directories>', 'Target directories (comma-separated)')
  .action(tagCommand);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

export default program;
