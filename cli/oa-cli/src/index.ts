import { program } from 'commander';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

program
  .name('oa')
  .description('OA-Team 30 萬能代理小隊命令控制介面')
  .version(pkg.version, '-v, --version', '顯示版本號')
  .hook('preAction', (thisCommand) => {
    console.log(`[5T:Traceable] source_origin=oa-cli command=${thisCommand.name()}`);
  });

program
  .command('status')
  .description('查詢 OA-Team 30 代理陣列狀態（MECE 分工/負載/健康）')
  .option('--dry-run', '預演模式：不實際查詢，僅回報將執行動作')
  .action(async (opts) => {
    if (opts.dryRun) {
      console.log('[DRY-RUN] oa status → 將查詢：swarm_matrix, array_health, task_queue');
      console.log('[5T:Trustworthy] dry-run 無副作用，Hash Lock 預留');
      return;
    }
    console.log('[INFO] 實查模式：需 Gateway 8420 + Hermes Agent 授權');
    console.log('[BLOCKER] 需 Gateway 通線 + Bearer 鑑權');
  });

program
  .command('agents list')
  .description('列出 30 位代理（01-30）與所屬陣列')
  .option('--array <id>', '篩選陣列 1-5')
  .option('--dry-run', '預演模式')
  .action(async (opts) => {
    if (opts.dryRun) {
      console.log(`[DRY-RUN] oa agents list --array=${opts.array || 'all'} → 將回傳代理矩陣`);
      console.log('[5T:Traceable] source_origin=oa-cli agents list');
      return;
    }
    console.log('[BLOCKER] 需 Gateway 通線 + Hermes Agent 授權');
  });

program
  .command('task dispatch <prompt>')
  .description('派發任務到指定陣列（經 Hermes 路由）')
  .option('--array <id>', '目標陣列 1-5，預設由蜂王路由')
  .option('--dry-run', '預演模式')
  .action(async (prompt, opts) => {
    if (opts.dryRun) {
      console.log(`[DRY-RUN] oa task dispatch "${prompt}" → array=${opts.array || 'auto'}`);
      console.log('[5T:Trustworthy] 派發經 Key-Ω 簽印，不可篡改');
      return;
    }
    console.log('[BLOCKER] 需 Gateway 通線 + Key-Ω 簽印授權');
  });

program.parseAsync(process.argv).catch((err) => {
  console.error('[ERROR]', err.message);
  process.exit(1);
});