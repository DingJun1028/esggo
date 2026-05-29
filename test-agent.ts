import { esgResearchAgent } from './lib/ai/agentz0.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    const res = await esgResearchAgent.runTask('幫我結合最新的 CBAM 規範，審查目前範疇二電費帳單的文件金庫審核進度。');
    console.log(res);
  } catch(e) {
    console.error("Caught error:", e);
  }
}
run();
