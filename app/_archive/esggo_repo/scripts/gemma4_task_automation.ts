import { getOmniTableServerClient } from '../lib/omni-table/client';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const DATASHEET_ID = process.env.OMNITABLE_TASKS_DATASHEET_ID || 'dst_demo_123';
const GEMMA_SERVER = 'http://localhost:9379';

async function extractTasksWithGemma4(note: string) {
  console.log('🤖 Gemma 4 正在分析筆記內容...');
  
  const url = `${GEMMA_SERVER}/v1beta/models/google/gemma-4-E4B-it:generateContent`;
  
  const prompt = `你是一位高效的專案經理助手。
請從以下「ESG 會議筆記」中提取具體的「待辦任務」。
筆記內容：
"""
${note}
"""

請以 JSON 陣列格式輸出，每個物件包含：
- title: 任務簡述
- status: 預設為 "Todo"

範例：[{"title": "撰寫範例報告", "status": "Todo"}]
請僅輸出 JSON，不要有其他文字。`;

  try {
    const response = await axios.post(url, {
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const content = response.data.candidates[0].content.parts[0].text;
    // 移除 markdown 區塊
    const jsonStr = content.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('❌ Gemma 4 提取任務失敗，切換至模擬數據...');
    return [
      { title: '啟動 Gemma 4 核心進行 ESG 數據分析', status: 'Todo' },
      { title: '完成 OmniTable 任務表單對接', status: 'In Progress' }
    ];
  }
}

async function main() {
  const sampleNote = `
  ESG 委員會會議紀錄：
  1. 需要在下週五前完成 2025 年碳足跡初步核算。 (負責人: 小明)
  2. 供應商合規審查進度落後，請採購部門於三日內更新進度。
  3. 官網需要新增「永續專區」展示 5T 治理成果。
  `;

  const tasks = await extractTasksWithGemma4(sampleNote);
  console.log(`✅ 成功提取 ${tasks.length} 個任務。`);

  const client = getOmniTableServerClient();

  try {
    console.log(`🚀 正在將任務同步至 OmniTable [${DATASHEET_ID}]...`);
    
    const records = tasks.map((t: any) => ({
      fields: {
        'Task Title': t.title,
        'Status': t.status
      }
    }));

    await client.createRecords(DATASHEET_ID, records);
    console.log('🎉 任務同步成功！');
  } catch (error) {
    console.error('❌ 同步失敗:', error);
  }
}

main();
