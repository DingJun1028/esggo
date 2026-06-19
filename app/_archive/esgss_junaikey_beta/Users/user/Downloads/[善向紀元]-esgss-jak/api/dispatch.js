// api/dispatch.js

export default async function handler(req, res) {
  // 1. CORS 配置 (允許前端跨域調用)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // 生產環境建議改為您的域名
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 處理預檢請求 (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 僅允許 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { provider, payload } = req.body;

    // 2. 根據 Provider 選擇 Webhook URL
    // 這些變數是在 Vercel 後台配置的，前端無法看見
    let targetUrl = '';

    if (provider === 'make') {
      targetUrl = process.env.MAKE_WEBHOOK_URL;
    } else if (provider === 'boost.space') {
      targetUrl = process.env.BOOST_SPACE_WEBHOOK_URL;
    }

    if (!targetUrl) {
      console.error(`Missing URL for provider: ${provider}`);
      return res.status(500).json({ error: 'Server Configuration Error: Missing Webhook URL' });
    }

    // 3. 安全發射：將數據轉發給自動化平台
    const externalResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        verifiedAt: new Date().toISOString(), // 添加伺服器時間戳作為驗證
        securitySign: 'JunAiKey-Secure-Proxy' // 內部標記
      }),
    });

    if (!externalResponse.ok) {
      throw new Error(`Automation Provider responded with ${externalResponse.status}`);
    }

    const data = await externalResponse.text(); // 有些 Webhook 不返回 JSON

    // 4. 返回成功確認給前端
    return res.status(200).json({
      status: 'success',
      message: 'Signal securely dispatched',
      providerResponse: data
    });

  } catch (error) {
    console.error('Dispatch Error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}