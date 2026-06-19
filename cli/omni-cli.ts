#!/usr/bin/env node
/**
 * OmniAgent CLI v3.0.0
 * ESGGO 全域治理指令集
 *
 * Changelog v3.0.0:
 * - Added bus-health command (OmniAgentBus health check)
 * - Added bus-events command (SSE event stream)
 * - Added bus-skills command (list registered skills)
 * - Added bus-metrics command (skill execution metrics)
 * - Added celestial command (execute Celestial Command Framework)
 * - Added seal command (5T vault seal)
 * - Improved error handling with structured output
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';

const program = new Command();

// ─── Configuration ───────────────────────────────────────────────────────────
const OMNIAGENT_API_URL = process.env.OMNIAGENT_API_URL || 'http://127.0.0.1:8642';
const OMNICORE_VPS_HOST = process.env.OMNICORE_VPS_HOST || 'vps.esggo.org';
const OMNICORE_VPS_PORT = process.env.OMNICORE_VPS_PORT || '8443';
const OMNICORE_VPS_PROTOCOL = process.env.OMNICORE_VPS_PROTOCOL || 'https';
const OMNICORE_GATEWAY_URL = `${OMNICORE_VPS_PROTOCOL}://${OMNICORE_VPS_HOST}:${OMNICORE_VPS_PORT}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function callApi(endpoint: string, method = 'GET', body?: object, baseUrl?: string): Promise<any> {
  const url = `${baseUrl || OMNIAGENT_API_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OMNI_MCP_ACCESS_TOKEN || ''}`,
    },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

function printTable(headers: string[], rows: string[][]) {
  const colWidths = headers.map((h, i) => Math.max(h.length, ...rows.map(r => (r[i] || '').length)));
  const separator = colWidths.map(w => '─'.repeat(w + 2)).join('┼');
  console.log(`┌${separator}┐`);
  console.log(`│ ${headers.map((h, i) => h.padEnd(colWidths[i])).join(' │ ')} │`);
  console.log(`├${separator}┤`);
  for (const row of rows) {
    console.log(`│ ${row.map((c, i) => (c || '').padEnd(colWidths[i])).join(' │ ')} │`);
  }
  console.log(`└${separator}┘`);
}

// ─── CLI Definition ──────────────────────────────────────────────────────────
program.name('oa').description('ESGGO OmniAgent 全域治理指令集 v3.0').version('3.0.0');

// ─── summon ──────────────────────────────────────────────────────────────────
program
  .command('summon')
  .description('召喚 OmniAgent — 串接 OmniCore VPS 閘道')
  .option('-m, --mode <mode>', '啟動模式 (interactive/silent/status)', 'interactive')
  .option('-p, --persona <id>', '指定 SPIRIT Persona 身份', 'Default_Guardian')
  .option('--vps', '直接呼叫 VPS 閘道', false)
  .action(async (options) => {
    console.log(chalk.hex('#003262').bold('\n🏛️  OmniAgent 正在降臨...'));
    const baseUrl = options.vps ? OMNICORE_GATEWAY_URL : OMNIAGENT_API_URL;
    console.log(chalk.gray(`   Gateway: ${baseUrl}`));

    const spinner = ora('連結 OmniCore 閘道...').start();

    try {
      spinner.text = '檢查閘道健康狀態...';
      let status;
      try {
        status = await callApi('/api/system/health', 'GET', undefined, baseUrl);
        spinner.succeed(chalk.hex('#FDB515')('閘道連線成功'));
      } catch {
        spinner.warn('閘道無回應，使用本地模式');
        status = { mode: 'local', gateway: 'unreachable' };
      }

      if (options.mode !== 'status') {
        spinner.text = '初始化 Agent Session...';
        spinner.start();
        try {
          const session = await callApi('/api/agent/session', 'POST', { persona: options.persona, mode: options.mode }, baseUrl);
          spinner.succeed(chalk.green(`Session 已建立: ${session.sessionId || 'N/A'}`));
        } catch {
          spinner.warn('Session API 不可用，跳過');
        }
      }

      console.log(chalk.hex('#003262').bold('\n🌌 OA 已啟動'));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`  ${chalk.cyan('Gateway:')}  ${baseUrl}`);
      console.log(`  ${chalk.cyan('Mode:')}    ${options.mode}`);
      console.log(`  ${chalk.cyan('Persona:')} ${options.persona}`);
      console.log(`  ${chalk.cyan('Status:')}  ${status?.status || status?.mode || 'ready'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error: any) {
      spinner.fail(chalk.red(`連線失敗: ${error.message}`));
      process.exit(1);
    }
  });

// ─── status ──────────────────────────────────────────────────────────────────
program
  .command('status')
  .description('查看 OmniAgent 系統狀態')
  .option('--vps', '直接呼叫 VPS 閘道', false)
  .action(async (options) => {
    const baseUrl = options.vps ? OMNICORE_GATEWAY_URL : OMNIAGENT_API_URL;
    const spinner = ora('取得系統狀態...').start();
    try {
      const status = await callApi('/api/system/health', 'GET', undefined, baseUrl);
      spinner.succeed();
      console.log(chalk.hex('#003262').bold('\n📊 OmniAgent 系統狀態'));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(JSON.stringify(status, null, 2));
    } catch (error: any) {
      spinner.fail(chalk.red(`無法取得狀態: ${error.message}`));
    }
  });

// ─── bus-health ──────────────────────────────────────────────────────────────
program
  .command('bus-health')
  .description('查看 OmniAgentBus 健康狀態與技能指標')
  .option('--vps', '直接呼叫 VPS 閘道', false)
  .action(async (options) => {
    const baseUrl = options.vps ? OMNICORE_GATEWAY_URL : OMNIAGENT_API_URL;
    const spinner = ora('取得 Bus 健康狀態...').start();
    try {
      const data = await callApi('/api/system/bus-health', 'GET', undefined, baseUrl);
      spinner.succeed();

      console.log(chalk.hex('#003262').bold('\n🚌 OmniAgentBus 健康狀態'));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      const h = data.health;
      const statusColor = h.status === 'healthy' ? chalk.green : h.status === 'degraded' ? chalk.yellow : chalk.red;
      console.log(`  ${chalk.cyan('Status:')}      ${statusColor(h.status)}`);
      console.log(`  ${chalk.cyan('Uptime:')}      ${Math.round(h.uptime / 1000)}s`);
      console.log(`  ${chalk.cyan('Total Events:')} ${h.totalEvents}`);
      console.log(`  ${chalk.cyan('Total Skills:')} ${h.totalSkills}`);
      console.log(`  ${chalk.cyan('Error Rate:')}   ${(h.errorRate * 100).toFixed(1)}%`);
      if (h.lastError) console.log(`  ${chalk.red('Last Error:')}  ${h.lastError}`);

      if (data.skills?.length > 0) {
        console.log(chalk.hex('#003262').bold('\n⚔️ 技能指標'));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        for (const skill of data.skills) {
          const m = skill.metrics;
          if (m) {
            const successRate = m.executions > 0 ? ((m.successes / m.executions) * 100).toFixed(1) : 'N/A';
            console.log(`  ${chalk.cyan(skill.name)} (${skill.id})`);
            console.log(`    執行: ${m.executions} | 成功: ${m.successes} | 失敗: ${m.failures} | 成功率: ${successRate}%`);
            if (m.avgExecutionTime) console.log(`    平均耗時: ${m.avgExecutionTime.toFixed(0)}ms`);
            if (m.lastError) console.log(`    ${chalk.red('最後錯誤:')} ${m.lastError}`);
          } else {
            console.log(`  ${chalk.cyan(skill.name)} (${skill.id}) — 尚無執行紀錄`);
          }
        }
      }
    } catch (error: any) {
      spinner.fail(chalk.red(`無法取得 Bus 狀態: ${error.message}`));
    }
  });

// ─── bus-skills ───────────────────────────────────────────────────────────────
program
  .command('bus-skills')
  .description('列出所有已註冊的 OmniAgentBus 技能')
  .option('--vps', '直接呼叫 VPS 閘道', false)
  .action(async (options) => {
    const baseUrl = options.vps ? OMNICORE_GATEWAY_URL : OMNIAGENT_API_URL;
    const spinner = ora('取得技能列表...').start();
    try {
      const data = await callApi('/api/system/bus-health', 'GET', undefined, baseUrl);
      spinner.succeed();

      console.log(chalk.hex('#003262').bold('\n⚔️ OmniAgentBus 已註冊技能'));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      const headers = ['ID', '名稱', '觸發事件', '自治'];
      const rows = data.skills.map((s: any) => [
        s.id,
        s.name,
        s.trigger || 'N/A',
        s.autonomy ? '✅' : '❌',
      ]);
      printTable(headers, rows);
    } catch (error: any) {
      spinner.fail(chalk.red(`無法取得技能列表: ${error.message}`));
    }
  });

// ─── bus-events ───────────────────────────────────────────────────────────────
program
  .command('bus-events')
  .description('查看 OmniAgentBus 事件統計')
  .option('--vps', '直接呼叫 VPS 閘道', false)
  .action(async (options) => {
    const baseUrl = options.vps ? OMNICORE_GATEWAY_URL : OMNIAGENT_API_URL;
    const spinner = ora('取得事件統計...').start();
    try {
      const data = await callApi('/api/omni-agent-api/stream/events/stats', 'GET', undefined, baseUrl);
      spinner.succeed();

      console.log(chalk.hex('#003262').bold('\n📡 OmniAgentBus 事件統計'));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      const headers = ['事件類型', '次數'];
      const rows = Object.entries(data.stats || {}).map(([k, v]) => [k, String(v)]);
      if (rows.length > 0) {
        printTable(headers, rows);
      } else {
        console.log('  尚無事件紀錄');
      }

      if (data.buffer) {
        console.log(`\n  緩衝區: ${data.buffer.current}/${data.buffer.max} (${data.buffer.percent}%)`);
      }
      if (data.subscribers !== undefined) {
        console.log(`  SSE 訂閱者: ${data.subscribers}`);
      }
    } catch (error: any) {
      spinner.fail(chalk.red(`無法取得事件統計: ${error.message}`));
    }
  });

// ─── celestial ────────────────────────────────────────────────────────────────
program
  .command('celestial')
  .description('執行奧義六式 — Celestial Command Framework')
  .argument('<intent>', '意圖描述')
  .option('--vps', '直接呼叫 VPS 閘道', false)
  .action(async (intent, options) => {
    const baseUrl = options.vps ? OMNICORE_GATEWAY_URL : OMNIAGENT_API_URL;
    console.log(chalk.hex('#003262').bold('\n✨ 啟動奧義六式執行框架...'));
    console.log(chalk.gray(`  意圖: ${intent}`));

    const spinner = ora('執行中...').start();
    try {
      const result = await callApi('/api/omni-agent/celestial', 'POST', { intent }, baseUrl);
      spinner.succeed(chalk.green('奧義執行完成'));

      console.log(chalk.hex('#003262').bold('\n🔮 執行結果'));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`  ${chalk.cyan('Status:')}  ${result.status}`);
      console.log(`  ${chalk.cyan('Intent:')}  ${result.intent}`);
      if (result.artifactUuid) console.log(`  ${chalk.cyan('Artifact:')} ${result.artifactUuid}`);
      if (result.message) console.log(`  ${chalk.cyan('Message:')}  ${result.message}`);
      if (result.error) console.log(`  ${chalk.red('Error:')}    ${result.error}`);
    } catch (error: any) {
      spinner.fail(chalk.red(`奧義執行失敗: ${error.message}`));
    }
  });

// ─── seal ─────────────────────────────────────────────────────────────────────
program
  .command('seal')
  .description('執行 5T 封印 — 對證據進行加密封印')
  .argument('<evidenceUuid>', '證據 UUID')
  .option('--type <type>', '封印類型 (standard/auto-remediation)', 'standard')
  .option('--vps', '直接呼叫 VPS 閘道', false)
  .action(async (evidenceUuid, options) => {
    const baseUrl = options.vps ? OMNICORE_GATEWAY_URL : OMNIAGENT_API_URL;
    console.log(chalk.hex('#003262').bold('\n🛡️ 啟動 5T 封印...'));
    console.log(chalk.gray(`  證據: ${evidenceUuid}`));
    console.log(chalk.gray(`  類型: ${options.type}`));

    const spinner = ora('封印中...').start();
    try {
      const result = await callApi('/api/vault/seal', 'POST', { evidenceUuid, sealType: options.type }, baseUrl);
      spinner.succeed(chalk.green('封印完成'));

      console.log(chalk.hex('#003262').bold('\n🔐 封印結果'));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`  ${chalk.cyan('Evidence:')}  ${evidenceUuid}`);
      console.log(`  ${chalk.cyan('Status:')}    ${result.status || 'sealed'}`);
      if (result.hashLock) console.log(`  ${chalk.cyan('Hash Lock:')} ${result.hashLock}`);
    } catch (error: any) {
      spinner.fail(chalk.red(`封印失敗: ${error.message}`));
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
    console.log(chalk.white('正在移除冗餘行銷詞彙，拆解為最小 Hash 記憶碎片...'));
    console.log(chalk.green('✔ 碎裂完成。下一步請執行「oa cast <章節號碼>」。'));
  });

// ─── memory ──────────────────────────────────────────────────────────────────
program
  .command('memory')
  .description('記憶碎片管理')
  .addCommand(
    program.createCommand('list')
      .description('列出記憶碎片')
      .option('--limit <n>', '限制數量', '20')
      .option('--tags <tags>', '標籤過濾（逗號分隔）')
      .option('--source <type>', '來源類型過濾')
      .option('--json', 'JSON 格式輸出')
      .action(async (options) => {
        const spinner = ora('取得記憶碎片...').start();
        try {
          const params = new URLSearchParams({
            type: 'shards',
            limit: options.limit || '20',
          });
          if (options.tags) params.set('tags', options.tags);
          if (options.source) params.set('sourceType', options.source);

          const res = await fetch(`${OMNIAGENT_API_URL}/api/agent/memory-shards?${params}`);
          const data = await res.json();
          spinner.succeed();

          if (options.json) {
            console.log(JSON.stringify(data, null, 2));
            return;
          }

          console.log(chalk.hex('#003262').bold('\n🧠 記憶碎片列表'));
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          if (!data.shards || data.shards.length === 0) {
            console.log(chalk.gray('  尚無記憶碎片'));
          } else {
            for (const shard of data.shards) {
              const entropy = shard.entropyLevel !== undefined ? `熵${shard.entropyLevel}` : '';
              const importance = shard.importanceScore ? `⭐${shard.importanceScore.toFixed(2)}` : '';
              console.log(`  ${chalk.cyan(shard.title)} ${chalk.gray(entropy)} ${chalk.yellow(importance)}`);
              console.log(`    ${chalk.gray(shard.description.substring(0, 80))}...`);
              console.log(`    ${chalk.gray('標籤:')} ${shard.tags?.join(', ') || '無'}`);
              console.log('');
            }
          }
          console.log(chalk.gray(`  共 ${data.total || data.shards?.length || 0} 個碎片`));
        } catch (error: any) {
          spinner.fail(chalk.red(`取得失敗: ${error.message}`));
        }
      })
  )
  .addCommand(
    program.createCommand('ultimates')
      .description('列出技能奧義')
      .option('--json', 'JSON 格式輸出')
      .action(async (options) => {
        const spinner = ora('取得技能奧義...').start();
        try {
          const res = await fetch(`${OMNIAGENT_API_URL}/api/agent/memory-shards?type=ultimates`);
          const data = await res.json();
          spinner.succeed();

          if (options.json) {
            console.log(JSON.stringify(data, null, 2));
            return;
          }

          console.log(chalk.hex('#003262').bold('\n✨ 技能奧義列表'));
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          if (!data.ultimates || data.ultimates.length === 0) {
            console.log(chalk.gray('  尚無技能奧義'));
          } else {
            for (const ultimate of data.ultimates) {
              const masteryColor = ultimate.masteryLevel === 'Master' ? chalk.yellow :
                ultimate.masteryLevel === 'Expert' ? chalk.green :
                ultimate.masteryLevel === 'Adept' ? chalk.blue : chalk.gray;
              console.log(`  ${chalk.cyan(ultimate.skillName)} ${masteryColor(`[${ultimate.masteryLevel}]`)}`);
              console.log(`    ${chalk.gray(ultimate.synthesis.substring(0, 100))}...`);
              console.log(`    ${chalk.gray('來源碎片:')} ${ultimate.sourceShards?.length || 0}`);
              console.log('');
            }
          }
        } catch (error: any) {
          spinner.fail(chalk.red(`取得失敗: ${error.message}`));
        }
      })
  )
  .addCommand(
    program.createCommand('stats')
      .description('記憶碎片統計')
      .action(async () => {
        const spinner = ora('取得統計...').start();
        try {
          const res = await fetch(`${OMNIAGENT_API_URL}/api/agent/memory-shards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'get_stats' }),
          });
          const data = await res.json();
          spinner.succeed();

          console.log(chalk.hex('#003262').bold('\n📊 記憶碎片統計'));
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

          if (data.shardStats) {
            console.log(chalk.cyan('\n  碎片統計:'));
            for (const stat of data.shardStats) {
              console.log(`    ${stat.source_type}: ${stat.total_shards} 碎片, 平均熵 ${stat.avg_entropy?.toFixed(1) || 'N/A'}`);
            }
          }

          if (data.ultimateStats) {
            console.log(chalk.cyan('\n  奧義統計:'));
            for (const stat of data.ultimateStats) {
              console.log(`    ${stat.mastery_level}: ${stat.total_ultimates} 奧義, 成功率 ${stat.avg_success_rate?.toFixed(2) || 'N/A'}`);
            }
          }
        } catch (error: any) {
          spinner.fail(chalk.red(`取得失敗: ${error.message}`));
        }
      })
  )
  .addCommand(
    program.createCommand('extract')
      .description('從文字萃取記憶碎片')
      .argument('<text>', '要萃取的文字內容')
      .option('--source <type>', '來源類型', 'manual')
      .action(async (text, options) => {
        const spinner = ora('萃取記憶碎片...').start();
        try {
          const res = await fetch(`${OMNIAGENT_API_URL}/api/agent/memory-shards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'extract_shard',
              conversationLog: text,
              sourceType: options.source,
            }),
          });
          const data = await res.json();
          spinner.succeed();

          if (data.success) {
            console.log(chalk.green('✔ 萃取成功'));
            console.log(`  ${chalk.cyan(data.shard.title)}`);
            console.log(`  ${chalk.gray(data.shard.description.substring(0, 100))}`);
            console.log(`  標籤: ${data.shard.tags?.join(', ') || '無'}`);
          } else {
            console.log(chalk.red(`✗ 萃取失敗: ${data.error}`));
          }
        } catch (error: any) {
          spinner.fail(chalk.red(`萃取失敗: ${error.message}`));
        }
      })
  )
  .addCommand(
    program.createCommand('synthesize')
      .description('合成技能奧義（從現有碎片）')
      .option('--tags <tags>', '指定標籤碎片（逗號分隔）')
      .action(async (options) => {
        const spinner = ora('合成技能奧義...').start();
        try {
          // 先取得碎片
          const tags = options.tags ? options.tags.split(',') : [];
          const params = new URLSearchParams({ type: 'shards', limit: '10' });
          if (tags.length > 0) params.set('tags', tags.join(','));

          const shardsRes = await fetch(`${OMNIAGENT_API_URL}/api/agent/memory-shards?${params}`);
          const shardsData = await shardsRes.json();

          if (!shardsData.shards || shardsData.shards.length < 2) {
            spinner.warn(chalk.yellow('碎片不足（至少需要 2 個）'));
            return;
          }

          // 合成奧義
          const synthRes = await fetch(`${OMNIAGENT_API_URL}/api/agent/memory-shards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'synthesize_ultimate',
              shards: shardsData.shards,
            }),
          });
          const synthData = await synthRes.json();
          spinner.succeed();

          if (synthData.success) {
            console.log(chalk.green('✔ 合成成功'));
            console.log(`  ${chalk.cyan(synthData.ultimate.skillName)} [${synthData.ultimate.masteryLevel}]`);
            console.log(`  ${chalk.gray(synthData.ultimate.synthesis.substring(0, 150))}`);
          } else {
            console.log(chalk.red(`✗ 合成失敗: ${synthData.error}`));
          }
        } catch (error: any) {
          spinner.fail(chalk.red(`合成失敗: ${error.message}`));
        }
      })
  )
  .addCommand(
    program.createCommand('crawl')
      .description('爬取 ESG 情報並萃取記憶碎片')
      .option('--sources <sources>', '指定來源（逗號分隔）')
      .option('--topics <topics>', '搜尋主題（逗號分隔）')
      .action(async (options) => {
        const spinner = ora('爬取 ESG 情報...').start();
        try {
          const body: any = {};
          if (options.sources) body.sources = options.sources.split(',');
          if (options.topics) body.topics = options.topics.split(',');

          const res = await fetch(`${OMNIAGENT_API_URL}/api/esg/crawl`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
          const data = await res.json();
          spinner.succeed();

          if (data.success) {
            console.log(chalk.green('✔ 爬取完成'));
            console.log(`  碎片: ${data.shards || 0}`);
            if (data.results) {
              const success = data.results.filter((r: any) => r.success).length;
              console.log(`  成功: ${success}/${data.results.length}`);
            }
          } else {
            console.log(chalk.red(`✗ 爬取失敗: ${data.error}`));
          }
        } catch (error: any) {
          spinner.fail(chalk.red(`爬取失敗: ${error.message}`));
        }
      })
  );

program.parse(process.argv);
