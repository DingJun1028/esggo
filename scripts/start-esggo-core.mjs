// esggo-core 啟動包裝 — 讀 .env 後 spawn next start (確保 OMNI_* env 注入 Next.js)
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// 手動解析 .env (Next.js 會讀，但 pm2 啟動時環境不含，故顯式注入)
try {
  const envRaw = readFileSync(resolve(root, '.env'), 'utf8');
  for (const line of envRaw.split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    // .env 強制覆寫 (避免 pm2 父環境殘留舊 key 導致 .env 失效, 見 GEMINI_API_KEY Vertex/AIza 切換問題)
    if (m) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
} catch {}

const child = spawn(process.execPath, [
  resolve(root, 'node_modules/next/dist/bin/next'),
  'start', '-p', '3000', '-H', '127.0.0.1',
], { cwd: root, stdio: 'inherit', env: process.env });

child.on('exit', (code) => process.exit(code ?? 0));
