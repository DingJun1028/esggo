import { program } from 'commander';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { gatewayRequest, loadGatewayConfig } from './gateway.js';

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
  .option('--live', '實查模式：發出真實 Gateway 請求')
  .action(async (opts) => {
    if (!opts.live || opts.dryRun) {
      console.log('[DRY-RUN] oa status → 將查詢：swarm_matrix, array_health, task_queue');
      console.log('[5T:Trustworthy] dry-run 無副作用，Hash Lock 預留');
      return;
    }
    try {
      const data = await gatewayRequest('/oa/status');
      console.log('[LIVE]', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('[BLOCKER] Gateway 查詢失敗:', (e as Error).message);
    }
  });

const agents = program.command('agents').description('30 位代理管理');

agents
  .command('list')
  .description('列出 30 位代理（01-30）與所屬陣列')
  .option('--array <id>', '篩選陣列 1-5')
  .option('--dry-run', '預演模式')
  .option('--live', '實查模式')
  .action(async (opts) => {
    if (!opts.live || opts.dryRun) {
      console.log(`[DRY-RUN] oa agents list --array=${opts.array || 'all'} → 將回傳代理矩陣`);
      console.log('[5T:Traceable] source_origin=oa-cli agents list');
      return;
    }
    try {
      const data = await gatewayRequest(`/oa/agents?array=${opts.array || 'all'}`);
      console.log('[LIVE]', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('[BLOCKER] Gateway 查詢失敗:', (e as Error).message);
    }
  });

const task = program.command('task').description('任務派發與管理');

task
  .command('dispatch <prompt>')
  .description('派發任務到指定陣列（經 Hermes 路由）')
  .option('--array <id>', '目標陣列 1-5，預設由蜂王路由')
  .option('--dry-run', '預演模式')
  .option('--live', '實查模式')
  .action(async (prompt, opts) => {
    if (!opts.live || opts.dryRun) {
      console.log(`[DRY-RUN] oa task dispatch "${prompt}" → array=${opts.array || 'auto'}`);
      console.log('[5T:Trustworthy] 派發經 Key-Ω 簽印，不可篡改');
      return;
    }
    try {
      const data = await gatewayRequest('/oa/task/dispatch', undefined, { prompt, array: opts.array });
      console.log('[LIVE]', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('[BLOCKER] Gateway 派發失敗:', (e as Error).message);
    }
  });

// §23-24: Weekly swarm report (n8n cron bridge → KPI + 5T audit + entropy)
program
  .command('weekly-report')
  .description('生成 OA-Team 週報 (KPI + 5T 稽核 + 熵減) — n8n cron 與手動皆可呼叫')
  .option('--dry-run', '預演模式：僅輸出 markdown，不寄送')
  .option('--channels <list>', '逗號分隔: telegram,slack,email')
  .option('--pairing <pct>', '跨組配對率 (real measured)')
  .option('--entropy <val>', '當前熵值')
  .option('--security <n>', '安全事件數')
  .option('--satisfaction <val>', '用戶滿意度 /5')
  .action(async (opts) => {
    if (opts.dryRun) {
      console.log('[DRY-RUN] oa weekly-report → 將呼叫 aistation scripts/weekly_report.py --dry-run');
      console.log('[5T:Traceable] source_origin=oa-cli weekly-report');
      return;
    }
    try {
      const { spawnSync } = await import('node:child_process');
      const projectAistation = join(process.cwd(), 'aistation');
      const { existsSync } = await import('node:fs');
      if (!existsSync(join(projectAistation, 'src', 'kpi.py'))) {
        console.log('[BLOCKER] aistation 目錄不存在 — 請確認 aistation 專案位於 esggo 根目錄下');
        return;
      }
      const args = [join(projectAistation, 'scripts', 'weekly_report.py'), '--dry-run'];
      if (opts.channels) args.push('--channels', opts.channels);
      if (opts.pairing) args.push('--pairing', opts.pairing);
      if (opts.entropy) args.push('--entropy', opts.entropy);
      if (opts.security) args.push('--security', opts.security);
      if (opts.satisfaction) args.push('--satisfaction', opts.satisfaction);
      const result = spawnSync('python3', args, {
        encoding: 'utf-8',
        shell: process.platform === 'win32',
        cwd: projectAistation,
      });
      if (result.error) {
        console.log('[BLOCKER] python3 執行失敗:', result.error.message);
      } else {
        console.log(result.stdout);
        if (result.stderr) console.error(result.stderr);
      }
    } catch (e) {
      console.log('[BLOCKER] weekly-report 失敗:', (e as Error).message);
    }
  });

program.parseAsync(process.argv).catch((err) => {
  console.error('[ERROR]', err.message);
  process.exit(1);
});
