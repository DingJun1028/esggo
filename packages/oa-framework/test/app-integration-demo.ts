/**
 * App 整合示範 — 模擬一個外部 app 經 OA 元框架消費 oneringai 路由
 * 真實實跑: 走本地 Ollama (免費算立), 經 OneRingAI Agent.run() 取得模型輸出,
 * 再由 OAOrchestrator 統一鑄造 5T.
 *
 * 用法: npx tsx test/app-integration-demo.ts
 * 此檔證明「app 層」可無痛接入 oneringai adapter, 無需改寫 app 既有架構.
 */
import { createOAFrame, verify5T } from '../src/index.js';
import type { OATask } from '../src/core/types.js';

async function main() {
  // 1) app 構造一個 OA 任務 (模擬 universal-translator / omni-blueprint-hub 呼叫)
  const task: OATask = {
    id: 'app-demo-1',
    title: 'App 整合示範：ESG 永續短句生成',
    prompt: '用一句話說明：為什麼公共交通有助於企業 ESG 碳減量？',
    source: 'external-app://demo',
    routeTo: ['oneringai'], // ← app 指定走 oneringai 路由
    requiredDimensions: ['traceable', 'trackable', 'tangible', 'transparent', 'trustworthy'],
  };

  // 2) app 呼叫 OA 框架 (與 adapter 解耦, app 不知底層是 OneRingAI 還是 CrewAI)
  const orch = createOAFrame({
    llmBaseUrl: 'http://localhost:11434/v1',
    llmApiKey: 'ollama',
    llmModel: 'qwen2.5:3b-instruct-q4_K_M',
  });
  console.log('[app] OA 框架已構造, 任務:', task.title);
  console.log('[app] 路由目標:', task.routeTo.join(', '));

  const results = await orch.run(task);

  // 3) app 取得 5T 鑄造後的 artifact
  const artifact = results[0];
  console.log('\n[app] oneringai 真實產出:');
  console.log('  ', artifact.output.slice(0, 200));
  console.log('[app] 5T 欄位:', JSON.stringify(artifact.t5));
  console.log('[app] Hash Lock:', artifact.hashLock);

  // 4) app 端獨立驗證 5T (雙層閘門不漏)
  const v = verify5T(artifact);
  console.log('[app] 5T 驗證:', v.pass ? 'PASS ✅' : 'FAIL ❌');

  if (!v.pass) {
    console.error('[app] 5T 閘門拒絕, 依 §19 不可寫入');
    process.exit(1);
  }
  console.log('\n[app] 整合成功: app 經 OA 框架消費 oneringai 路由, 真實輸出 + 5T 鑄造通過');
}

main().catch((e) => {
  console.error('[app] 整合失敗:', e);
  process.exit(1);
});
