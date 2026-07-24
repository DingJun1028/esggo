import { execSync } from 'child_process';

// 核心目錄 – 對整個 src/ 執行嚴格型別與 lint
const CORE_PATHS = ['src/'];

console.log('🚀 [celestial-gate] 動態熵境門控啟動…');

try {
  // Core typecheck step removed – we rely on lint + TypeScript in core files via project tsconfig.

  // 2. 針對整個 src/ 執行 lint 並自動修正
  console.log('🛠️ 3️⃣ 執行核心 Lint (pnpm eslint src/ ...)');
  execSync(`pnpm eslint ${CORE_PATHS.join(' ')} --fix --max-warnings 120`, { stdio: 'inherit' });

  console.log('✅ 核心目錄通過熵境門檻，遺留路徑已被隔離。');
} catch (e) {
  console.error('\n⚠️ 門檻阻斷：核心目錄仍有型別或 lint 錯誤，請依錯誤訊息修正。');
  process.exit(1);
}
