// ============================================================
// Akkadu-RTC 整合模組 — 即時語音口譯串流 (receiver / broadcaster)
// 對照 Akkadu API README: https://github.com/akkadu/akkadu-api
//
// 設計原則 (5T + 優化缺口補齊):
//  1. 懶載入 SDK — 只有設定了 AKKADU_TOKEN 才 import @akkadu/akkadu-rtc,
//     否則服務降級為「文字翻譯可用、口譯功能未啟用」, 不中斷主服務。
//  2. dev / prod 雙模式 — isDevMode 決定連 devapi.akkadu.cn 或 api.akkadu.cn
//     (dev 限 localhost, 避免 CORS)。
//  3. 連線狀態機 — connection-active/online/offline 全部透出, 前端可監聽。
//  4. 單房間單實例 — broadcaster 同一房間只允許一個連線 (Akkadu 限制)。
// ============================================================

const AKKADU_DEV = process.env.AKKADU_DEV_MODE === 'true' || process.env.AKKADU_DEV_MODE === '1';
const AKKADU_TOKEN = process.env.AKKADU_TOKEN || '';
const AKKADU_DEFAULT_ROOM = process.env.AKKADU_DEFAULT_ROOM || 'ejrd';

let Akkadu = null;          // SDK class (懶載入)
let loadError = null;       // SDK 載入失敗原因

async function ensureSdk() {
  if (Akkadu !== null || loadError) return { Akkadu, loadError };
  if (!AKKADU_TOKEN) {
    loadError = 'AKKADU_TOKEN 未設定 — 口譯功能未啟用 (文字翻譯仍可用)';
    return { Akkadu: null, loadError };
  }
  try {
    // private npm: 需先 `npm config set @akkadu:registry ...` + token 才能安裝
    const mod = await import('@akkadu/akkadu-rtc');
    Akkadu = mod.default || mod.Akkadu || mod;
    if (!Akkadu) throw new Error('SDK 匯出結構非預期');
  } catch (e) {
    loadError = `Akkadu SDK 載入失敗: ${e.message} (需安裝 @akkadu/akkadu-rtc 並設 AKKADU_TOKEN)`;
  }
  return { Akkadu, loadError };
}

/**
 * 建立一個 Akkadu 聽眾 (Receiver) 串流控制項
 * @param {object} opts { roomName, onStatus }
 * @returns {Promise<{streamer, status, error}>}
 */
export async function createReceiver({ roomName = AKKADU_DEFAULT_ROOM, onStatus } = {}) {
  const { Akkadu: Sdk, loadError } = await ensureSdk();
  if (!Sdk) return { streamer: null, status: 'disabled', error: loadError };

  const config = { roomName, isDevMode: AKKADU_DEV };
  const rtc = new Sdk(config);

  const streamer = await rtc.init(); // 或 initReceiver()
  wireStatus(streamer, onStatus);

  return { streamer, status: 'ready', error: null };
}

/**
 * 建立一個 Akkadu 口譯員 (Broadcaster) 串流控制項
 * @param {object} opts { roomName, username, password, onStatus }
 */
export async function createBroadcaster({ roomName = AKKADU_DEFAULT_ROOM, username, password, onStatus } = {}) {
  const { Akkadu: Sdk, loadError } = await ensureSdk();
  if (!Sdk) return { streamer: null, status: 'disabled', error: loadError };

  const config = { roomName, isDevMode: AKKADU_DEV };
  const rtc = new Sdk(config);

  const streamer = await rtc.initBroadcaster(username, password);
  wireStatus(streamer, onStatus);

  return { streamer, status: 'ready', error: null };
}

function wireStatus(streamer, onStatus) {
  if (!streamer || !onStatus) return;
  streamer.on('connection-status', (msg) => {
    const { id } = msg || {};
    onStatus(id); // 'connection-active' | 'connection-online' | 'connection-offline'
  });
}

// 服務健康探針用
export function akkaduStatus() {
  if (loadError) return { enabled: false, reason: loadError };
  if (Akkadu) return { enabled: true, mode: AKKADU_DEV ? 'dev' : 'prod' };
  return { enabled: false, reason: AKKADU_TOKEN ? 'SDK 載入中' : '未設定 AKKADU_TOKEN' };
}
