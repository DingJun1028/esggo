// File: jun-ai-key/src/api.js
import axios from 'axios';
import dotenv from 'dotenv';
import chalk from 'chalk';
// 讀取 CLI 目錄下的 .env (如果有)
dotenv.config();
// 設定 API URL
// 如果您在本地跑 Docker，預設是 http://localhost:3000/api
// 如果是 Cloudflare Tunnel，則是 https://your-domain.com/api
const BASE_URL = process.env.JAK_API_URL || 'http://localhost:3000/api';
const ADMIN_SECRET = process.env.JAK_ADMIN_SECRET || 'my_secret_token'; // 需與後端 .env 一致
const client = axios.create({
baseURL: BASE_URL,
timeout: 60000, // 60秒超時 (生成代碼需要時間)
headers: {
'Content-Type': 'application/json',
'x-celestial-token': ADMIN_SECRET
}
});
// 錯誤攔截器
client.interceptors.response.use(
r => r,
error => {
const msg = error.response?.data?.error || error.message;
return Promise.reject(new Error(`[API Error]: ${msg}`));
}
);
// --- Methods ---
export const checkSystemHealth = async () => {
try {
// 呼叫 manifest 測試連線
await client.post('/manifest');
return true;
} catch (error) {
return false;
}
};
/**
* 建立共鳴串流
* @param {string} message - 用戶輸入
* @returns {Promise<AxiosResponse>} - 回傳包含 stream 的 response
*/
export const createResonanceStream = async (message) => {
return client.get('/interact', {
params: {
sessionId: 'cli-session-' + new Date().getDate(), // 簡單的 Session ID
message
},
responseType: 'stream' // ★ 關鍵
});
};
export default client;