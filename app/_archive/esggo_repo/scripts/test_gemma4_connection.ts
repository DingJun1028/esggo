import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * 測試本地 Gemma 4 (E4B) 伺服器連線 (Gemini 模式)
 */
async function testLocalGemma4Gemini() {
  const host = 'http://localhost:9379';
  const model = 'gemma-4-E4B-it'; // The folder name is gemma-4-E4B-it.litertlm
  const url = `${host}/v1beta/models/${model}:generateContent`;
  
  console.log(`🚀 開始測試本地 Gemma 4 連線 (Gemini 模式)@${url}...`);

  try {
    const response = await axios.post(url, {
      contents: [
        {
          role: 'user',
          parts: [{ text: '你現在是 Gemma 4 (E4B)。請用繁體中文回答：1+1等於多少？' }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
      }
    });

    console.log('✅ 連線成功！回應內容：');
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error: any) {
    if (error.response) {
      console.error(`❌ 伺服器回應錯誤 [${error.response.status}]:`, error.response.data);
    } else {
      console.error('❌ 無法連線至本地模型伺服器:', error.message);
    }
  }
}

testLocalGemma4Gemini();
