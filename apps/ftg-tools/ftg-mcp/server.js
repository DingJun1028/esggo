#!/usr/bin/env node
/**
 * ftg-mcp — 墾趣旅遊 FTG 網頁生成 MCP server (stdio)
 * 暴露工具:
 *   generate_ftg_page {version, theme, lang} -> 產出 apps/ftg-{version}/
 *   deploy_ftg_page   {version}              -> SCP 到 VPS /var/www/ftg-tours/{version}/
 * 依賴: 本檔同目錄 ftg-gen.js (CLI)
 * 啟動: node server.js   (stdio JSON-RPC 2.0)
 */
const cp = require('child_process');
const path = require('path');
const readline = require('readline');

const ROOT = path.resolve(__dirname, '..', '..', '..'); // ftg-tools/ftg-mcp -> esggo
const GEN = path.join(__dirname, '..', 'ftg-gen.js');

function run(cmd, args, cwd) {
  return new Promise((res, rej) => {
    cp.execFile('node', [cmd].concat(args), { cwd: cwd || ROOT, maxBuffer: 1024 * 1024 * 16 },
      (e, so, se) => e ? rej(e.message + '\n' + se) : res(so));
  });
}

const TOOLS = [
  {
    name: 'generate_ftg_page',
    description: '參數化生成墾趣旅遊 FTG 靜態網頁 (index.html/styles.css/app.js + 攝影圖)',
    inputSchema: {
      type: 'object',
      properties: {
        version: { type: 'string', description: '版本號, 如 2.7', default: '2.7' },
        theme: { type: 'string', enum: ['stitch-dark', 'light'], default: 'stitch-dark' },
        lang: { type: 'string', enum: ['zh', 'en'], default: 'zh' }
      },
      required: ['version']
    }
  },
  {
    name: 'deploy_ftg_page',
    description: '將已生成的 FTG 版本 SCP 部署到 VPS (需 SSH key 與 ftg-tours 目錄)',
    inputSchema: {
      type: 'object',
      properties: {
        version: { type: 'string', description: '要部署的版本號, 如 2.7', default: '2.7' },
        host: { type: 'string', description: 'VPS host', default: '161.118.248.180' },
        user: { type: 'string', default: 'ubuntu' }
      },
      required: ['version']
    }
  }
];

function handle(req) {
  const { id, method, params } = req;
  if (method === 'initialize') {
    return { jsonrpc: '2.0', id, result: { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'ftg-mcp', version: '1.0.0' } } };
  }
  if (method === 'tools/list') {
    return { jsonrpc: '2.0', id, result: { tools: TOOLS } };
  }
  if (method === 'tools/call') {
    const n = params.name, a = params.arguments || {};
    if (n === 'generate_ftg_page') {
      return run(GEN, ['--version', a.version || '2.7', '--theme', a.theme || 'stitch-dark', '--lang', a.lang || 'zh'])
        .then(out => ({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: out }] } }))
        .catch(e => ({ jsonrpc: '2.0', id, error: { code: -32000, message: String(e) } }));
    }
    if (n === 'deploy_ftg_page') {
      const ver = a.version || '2.7';
      const local = path.join(ROOT, 'apps', 'ftg-' + ver);
      const remote = `/var/www/ftg-tours/${ver}`;
      const scp = `scp -i ~/.ssh/esggo_original -o StrictHostKeyChecking=accept-new ${local}/index.html ${local}/styles.css ${local}/app.js ${a.user || 'ubuntu'}@${a.host || '161.118.248.180'}:${remote}/ && scp -i ~/.ssh/esggo_original -o StrictHostKeyChecking=accept-new ${local}/assets/*.jpg ${a.user || 'ubuntu'}@${a.host || '161.118.248.180'}:${remote}/assets/`;
      return new Promise((res) => {
        cp.exec(`ssh -i ~/.ssh/esggo_original -o StrictHostKeyChecking=accept-new ${a.user || 'ubuntu'}@${a.host || '161.118.248.180'} "sudo mkdir -p ${remote}/assets && sudo chown -R ubuntu:ubuntu ${remote}" && ${scp}`,
          { maxBuffer: 1024 * 1024 * 16 }, (e, so, se) => {
            if (e) res({ jsonrpc: '2.0', id, error: { code: -32000, message: e.message + '\n' + se } });
            else res({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: 'deployed ' + ver + '\n' + so }] } });
          });
      });
    }
    return { jsonrpc: '2.0', id, error: { code: -32601, message: 'unknown tool ' + n } };
  }
  return { jsonrpc: '2.0', id, error: { code: -32601, message: 'method not found: ' + method } };
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let buf = '';
rl.on('line', line => {
  if (!line.trim()) return;
  try {
    const r = handle(JSON.parse(line));
    Promise.resolve(r).then(res => process.stdout.write(JSON.stringify(res) + '\n'));
  } catch (e) { /* ignore malformed */ }
});
process.stderr.write('[ftg-mcp] stdio server ready\n');
