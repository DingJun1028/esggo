import { program } from 'commander';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

program
  .name('omni')
  .description('OmniGateway / Omni 生態系統命令控制介面')
  .version(pkg.version, '-v, --version', '顯示版本號')
  .hook('preAction', (thisCommand) => {
    console.log(`[5T:Traceable] source_origin=omnicli command=${thisCommand.name()}`);
  });

program
  .command('gateway status')
  .description('查詢 OmniGateway 狀態（埠號/延遲/健康）')
  .option('--dry-run', '預演模式：不實際查詢，僅回報將執行動作')
  .action(async (opts) => {
    if (opts.dryRun) {
      console.log('[DRY-RUN] omni gateway status → 將查詢：8420, latency, health');
      console.log('[5T:Trustworthy] dry-run 無副作用，Hash Lock 預留');
      return;
    }
    console.log('[INFO] 實查模式：需 Gateway 8420 通線');
    console.log('[BLOCKER] 需 Gateway 通線 + Bearer 鑑權');
  });

program
  .command('route list')
  .description('列出 Gateway 路由規則')
  .option('--dry-run', '預演模式')
  .action(async (opts) => {
    if (opts.dryRun) {
      console.log('[DRY-RUN] omni route list → 將回傳路由表');
      console.log('[5T:Trackable] 路由變化可追蹤');
      return;
    }
    console.log('[BLOCKER] 需 Gateway 通線 + Bearer 鑑權');
  });

program
  .command('auth check')
  .description('驗證 TDAI Bearer 鑑權有效性')
  .option('--dry-run', '預演模式')
  .action(async (opts) => {
    if (opts.dryRun) {
      console.log('[DRY-RUN] omni auth check → 將呼叫 Gateway /auth/verify');
      console.log('[5T:Trustworthy] Bearer token 不落地日誌');
      return;
    }
    console.log('[BLOCKER] 需 Gateway 通線 + 有效 Bearer');
  });

program.parseAsync(process.argv).catch((err) => {
  console.error('[ERROR]', err.message);
  process.exit(1);
});