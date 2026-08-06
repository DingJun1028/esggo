# 🌐 萬能即時翻譯 — 快速開始 (Quick Start)

> OA-Team 雙蜂隊即時翻譯服務。LibreTranslate → MyMemory → 原文兜底，零付費 key 即可跑。

## 前置

- Node.js 18+
- （選用）自建 LibreTranslate 實例

## 1. 安裝

```bash
cd apps/universal-translator
npm install
cp .env.example .env      # 可留空，自動用 MyMemory 免費引擎
```

## 2. 本機啟動

```bash
npm start
# 或 node server.mjs
```

## 3. 驗證

```bash
curl http://localhost:8788/health
# {"status":"ok","version":"1.0.0",...}

curl -X POST http://localhost:8788/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, world","from":"en","to":"zh"}'
# {"text":"你好世界","engine":"mymemory","cached":false,...}
```

多語平行翻譯（即時轉播場景）：

```bash
curl -X POST http://localhost:8788/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Thank you","from":"en","targets":["zh","es","fr"]}'
```

## 4. WebSocket 即時流

```js
const ws = new WebSocket('ws://localhost:8788/ws');
ws.onmessage = (e) => console.log(JSON.parse(e.data));
ws.send(JSON.stringify({ text: 'Live caption', from: 'en', to: 'zh' }));
```

## 5. 生產部署 (VPS)

```bash
bash deploy.sh
```

經 Cloudflare Tunnel 暴露於 `translate.esggo.co`（參考 M1 的 `memory.esggo.co` 模式）。

## API 一覽

| 端點 | 方法 | 用途 |
|------|------|------|
| `/health` | GET | 健康檢查 + stats |
| `/translate` | POST | 單語/多語翻譯 |
| `/ws` | WS | 即時流翻譯 |

回應含 5T 溯源標頭：`X-OA-Engine`、`X-OA-Cached`、`X-OA-Trace`。

---
*源自 omni-blueprint-hub translate.mjs v2 引擎，封裝為獨立 OA-Team 服務。*
