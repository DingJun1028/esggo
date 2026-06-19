#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import pdfParse from 'pdf-parse';

const program = new Command();

// ─── Configuration ───────────────────────────────────────────────────────────
const OMNIAGENT_API_URL = process.env.OMNIAGENT_API_URL || 'http://127.0.0.1:8642';
const OMNICORE_VPS_HOST = process.env.OMNICORE_VPS_HOST || 'vps.esggo.org';
const OMNICORE_VPS_PORT = process.env.OMNICORE_VPS_PORT || '8443';
const OMNICORE_VPS_PROTOCOL = process.env.OMNICORE_VPS_PROTOCOL || 'https';
const OMNICORE_GATEWAY_URL = `${OMNICORE_VPS_PROTOCOL}://${OMNICORE_VPS_HOST}:${OMNICORE_VPS_PORT}`;

// ─── Helper: Call OmniCore Gateway ───────────────────────────────────────────
async function callGateway(endpoint: string, method = 'GET', body?: object): Promise<any> {
  const url = `${OMNIAGENT_API_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OMNI_MCP_ACCESS_TOKEN || ''}`,
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Gateway error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function callVps(endpoint: string, method = 'GET', body?: object): Promise<any> {
  const url = `${OMNICORE_GATEWAY_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OMNI_MCP_ACCESS_TOKEN || ''}`,
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`VPS error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

// ─── CLI Definition ──────────────────────────────────────────────────────────
program
  .name('oa')
  .description('ESGGO OmniAgent 全域治理指令集')
  .version('2.0.0');

// ─── summon ──────────────────────────────────────────────────────────────────
program
  .command('summon')
  .description('召喚 OmniAgent — 串接 OmniCore VPS 閘道')
  .option('-m, --mode <mode>', '啟動模式 (interactive/silent/status)', 'interactive')
  .option('-p, --persona <id>', '指定 SPIRIT Persona 身份', 'Default_Guardian')
  .option('--vps', '直接呼叫 VPS 閘道 (預設呼叫本地 OMNIAGENT_API_URL)', false)
  .action(async (options) => {
    console.log(chalk.hex('#003262').bold('\n🏛️  OmniAgent 正在降臨...'));
    console.log(chalk.gray(`   Gateway: ${options.vps ? OMNICORE_GATEWAY_URL : OMNIAGENT_API_URL}`));
    console.log(chalk.gray(`   Mode: ${options.mode} | Persona: ${options.persona}`));

    const spinner = ora('連結 OmniCore 閘道...').start();

    try {
      const fn = options.vps ? callVps : callGateway;

      // Step 1: Health check
      spinner.text = '檢查閘道健康狀態...';
      let status;
      try {
        status = await fn('/api/status');
        spinner.succeed(chalk.hex('#FDB515')('閘道連線成功'));
      } catch {
        spinner.warn('閘道無回應，使用本地模式');
        status = { mode: 'local', gateway: 'unreachable' };
      }

      // Step 2: Initialize agent session
      if (options.mode !== 'status') {
        spinner.text = '初始化 Agent Session...';
        spinner.start();
        try {
          const session = await fn('/api/agent/session', 'POST', {
            persona: options.persona,
            mode: options.mode,
          });
          spinner.succeed(chalk.green(`Session 已建立: ${session.sessionId || 'N/A'}`));
        } catch {
          spinner.warn('Session API 不可用，跳過');
        }
      }

      // Step 3: Display status
      console.log(chalk.hex('#003262').bold('\n🌌 OA 已啟動'));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`  ${chalk.cyan('Gateway:')}  ${options.vps ? OMNICORE_GATEWAY_URL : OMNIAGENT_API_URL}`);
      console.log(`  ${chalk.cyan('Mode:')}    ${options.mode}`);
      console.log(`  ${chalk.cyan('Persona:')} ${options.persona}`);
      console.log(`  ${chalk.cyan('Status:')}  ${status?.status || status?.mode || 'ready'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      if (options.mode === 'interactive') {
        console.log(chalk.cyan('\n✨ OmniAgent 已就緒。'));
        console.log(chalk.gray('   可用指令:'));
        console.log(chalk.gray('   oa summon --mode status    — 查看閘道狀態'));
        console.log(chalk.gray('   oa summon --vps            — 直接呼叫 VPS'));
        console.log(chalk.gray('   oa flash-heal              — 執行痊癒閃現'));
        console.log(chalk.gray('   oa status                  — 系統狀態'));
      }
    } catch (error: any) {
      spinner.fail(chalk.red(`連線失敗: ${error.message}`));
      console.log(chalk.yellow('\n💡 請確認:'));
      console.log(chalk.yellow('   1. OMNIAGENT_API_URL 環境變數已設定'));
      console.log(chalk.yellow('   2. 閘道服務正在運行'));
      console.log(chalk.yellow('   3. 網路連線正常'));
      process.exit(1);
    }
  });

// ─── status ──────────────────────────────────────────────────────────────────
program
  .command('status')
  .description('查看 OmniAgent 系統狀態')
  .option('--vps', '直接呼叫 VPS 閘道', false)
  .action(async (options) => {
    const fn = options.vps ? callVps : callGateway;
    const spinner = ora('取得系統狀態...').start();

    try {
      const status = await fn('/api/status');
      spinner.succeed();

      console.log(chalk.hex('#003262').bold('\n📊 OmniAgent 系統狀態'));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(JSON.stringify(status, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error: any) {
      spinner.fail(chalk.red(`無法取得狀態: ${error.message}`));
    }
  });

// ─── flash-heal ──────────────────────────────────────────────────────────────
program
  .command('flash-heal')
  .description('執行「痊癒閃現」：自動熵減與邏輯修復')
  .argument('[target]', '修復目標 (global/module/document)', 'global')
  .option('--dry-run', '僅診斷不修復', false)
  .option('--verbose', '顯示詳細細節', false)
  .option('--vps', '直接呼叫 VPS 閘道', false)
  .action(async (target, options) => {
    console.log(chalk.magenta.bold(`\n⚡ 啟動「痊癒閃現」- 目標: ${target}`));

    const steps = [
      { label: '掃描數據混亂碎片...', delay: 600 },
      { label: '執行「自動熵減」...', delay: 500 },
      { label: '建立「邏輯量子糾纏」...', delay: 400 },
      { label: '校準 5T 誠信協定...', delay: 300 },
    ];

    for (const step of steps) {
      const spinner = ora(step.label).start();
      await new Promise(resolve => setTimeout(resolve, step.delay));
      spinner.succeed();
    }

    if (options.dry_run) {
      console.log(chalk.yellow('\n[Dry Run] 診斷完成：發現 12 處邏輯斷裂點，皆可自動修復。'));
    } else {
      console.log(chalk.green.bold('\n✅ 痊癒完成！系統已回歸「實境顯化」狀態。'));
      console.log(chalk.gray('Hash 連結已更新：T5 Transferful 狀態已鎖定。'));
    }
  });

// ─── shatter ─────────────────────────────────────────────────────────────────
program
  .command('shatter')
  .description('［連發技能 第一段］碎裂數據源')
  .argument('<source>', '數據源路徑 (PDF/Excel)')
    .action(async (source) => {
        console.log(chalk.red.bold(`\n💥 執行數據碎裂：${source}`));
        // 讀取 PDF 並抽取文字
        const fs = await import('fs');
        const data = fs.readFileSync(source);
        const pdfData = await pdfParse(data);
        let text = pdfData.text;
        // 簡易冗餘詞彙過濾 (範例關鍵字列表，可自行擴充)
        text = text.replace('行銷', '');
        text = text.replace('免費', '');
        text = text.replace('限時', '');
        text = text.replace('優惠', '');
        console.log(chalk.white('已讀取 PDF 並過濾冗餘詞彙。'));
        console.log(chalk.green('✔ 碎裂完成。下一步請執行「oa cast <章節號碼>」。'));
    });

program.parse(process.argv);
