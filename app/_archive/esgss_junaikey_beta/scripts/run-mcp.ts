#!/usr/bin/env node
// scripts/run-mcp.ts
// Launch script for the Omni Awakening MCP Server
// Refactored for robust process management and environment isolation

import { parseArgs } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Manual Environment Loading
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = value;
      }
    }
  });
}

// 2. Parse CLI Arguments
const { values: args } = parseArgs({
  args: process.argv.slice(2),
  options: {
    transport: { type: 'string', default: 'stdio' },
    port: { type: 'string', default: '3005' },
  },
});

// 3. Set Environment Variables for Server
process.env.MCP_TRANSPORT = args.transport as string;
process.env.MCP_PORT = args.port as string;

// 4. Log Startup Info (stderr to avoid polluting stdio transport)
console.error(`[MCP] 🚀 Starting OmniAwakeningServer via spawn...`);
console.error(`[MCP] Transport: ${args.transport}`);
if (args.transport === 'http') {
  console.error(`[MCP] Port: ${args.port}`);
}

// 5. Spawn Server Process
async function main() {
  const serverPath = path.resolve(__dirname, '../server/mcp/OmniAwakeningServer.ts');

  const serverProcess = spawn('npx', [
    'tsx',
    serverPath,
    '--transport', args.transport as string,
    '--port', args.port as string
  ], {
    shell: process.platform === 'win32',
    stdio: ['inherit', 'inherit', 'inherit'], // inherit stdio for proper transport handling
    env: process.env
  });

  serverProcess.on('error', (err) => {
    console.error('[MCP] ❌ Failed to start server process:', err);
    process.exit(1);
  });

  serverProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[MCP] ❌ Server process exited with code ${code}`);
      process.exit(code);
    }
    process.exit(0);
  });

  process.on('SIGINT', () => serverProcess.kill('SIGINT'));
  process.on('SIGTERM', () => serverProcess.kill('SIGTERM'));
}

main();
