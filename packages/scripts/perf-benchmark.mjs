import { execSync } from 'child_process';
import { writeFileSync, statSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

function execCmd(command) {
  const start = process.hrtime.bigint();
  const stdout = execSync(command, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
  const end = process.hrtime.bigint();
  const durationMs = Number(end - start) / 1e6;
  return { stdout, durationMs };
}

function getDirectorySize(dir) {
  let total = 0;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      total += getDirectorySize(fullPath);
    } else if (entry.isFile()) {
      total += statSync(fullPath).size;
    }
  }
  return total;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

console.log('🚀 Starting performance benchmark...');

// 1. Build
const buildResult = execCmd('pnpm exec cross-env NEXT_TELEMETRY_DISABLED=1 next build');
console.log(`✅ Build completed in ${buildResult.durationMs.toFixed(2)} ms`);

// 2. Test
const testResult = execCmd('pnpm test');
console.log(`✅ Tests completed in ${testResult.durationMs.toFixed(2)} ms`);

// 3. Bundle size (dist folder)
const distPath = resolve('dist');
let bundleSize = 0;
try {
  bundleSize = getDirectorySize(distPath);
  console.log(`📦 Bundle size: ${formatSize(bundleSize)}`);
} catch (e) {
  console.warn('⚠️ Could not calculate bundle size – dist folder missing');
}

const report = {
  timestamp: new Date().toISOString(),
  buildTimeMs: buildResult.durationMs,
  testTimeMs: testResult.durationMs,
  bundleSizeBytes: bundleSize,
  bundleSizeHuman: formatSize(bundleSize),
};

const reportPath = resolve('perf-report.json');
writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`📊 Performance report written to ${reportPath}`);
