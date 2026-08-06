# 萬能藍圖中心 (Omni-Blueprint Hub)

> 「於熵增之混沌中，以神聖架構劃定秩序；萬物皆有藍圖，一筆定乾坤。」

**萬能藍圖中心**是將抽象「萬能藍圖」概念實現為真實可執行程式的核心架構中樞。
本包同時提供：

- **引擎層** `OmniBlueprintHub.ts` — Node 原生 TypeScript 實作（5T + IComponentCore + 單一資料表）。
- **UI 層** — 響應式 (RWD) 控制中樞儀表板與指定轉播共享頁（便當盒佈局 / 單頁 / 單行原則）。

---

## 核心公約

| 公約 | 說明 |
| --- | --- |
| **5T 協議** | Traceable 可溯源 · Trackable 可追蹤 · Transparent 可透明 · Tangible 可感知 · Trustworthy 不可篡改 |
| **4 可 1 不可** | 狀態機嚴格控管：可自理 / 可協作 / 可演化 / 可溯源 / **不可篡改** |
| **IComponentCore** | 萬能元件心核：`uuid` · `version` · `timestamp` · `evidence[]` |
| **單一資料表** | 所有實體收斂於同一張表（BLUEPRINT + PRODUCT + BROADCAST_LOG） |
| **Hash Lock** | 資料寫入後即刻 `sha256` 固化 + `Object.freeze()` |

---

## 專案結構

```
omni-blueprint-hub/
├── OmniBlueprintHub.ts   # 引擎 (Node 24 原生 TS，實機可跑)
├── index.html            # 控制中樞儀表板 (RWD)
├── live-sync.html        # 指定轉播共享頁 (RWD, 一台翻譯全員共享)
├── styles.css            # RWD 響應式樣式 (便當盒 + 移動優先, 斷點 480/768/1024/1440)
├── data.js               # 前端共用資料模型 (對齊 IComponentCore)
├── app.js                # 控制中樞邏輯 + 即時流模擬
└── sync.js               # 共享頁邏輯 + 5T 即時翻譯流
```

---

## 快速開始

### 1. 引擎實跑 (Node 24+)

```bash
node OmniBlueprintHub.ts
```

預期輸出：鑄造「即時轉播」「指定轉播」兩大藍圖，具現為產品並推播廣播，最後列印單一資料表彙整。

### 2. UI 本地預覽

```bash
cd omni-blueprint-hub
python3 -m http.server 8765
# 控制中樞：  http://localhost:8765/index.html
# 指定轉播頁：http://localhost:8765/live-sync.html?host=lecturer-a@esggo.app&token=5T-AKKADU-A89F
```

RWD 自適應：手機（單欄）→ 平板（2 欄）→ 桌機（3/4 欄便當盒）。

---

## 兩大藍圖

1. **即時轉播 (LIVE_BROADCAST)** — 連入外部資料流，多國語系即時翻譯引擎，UI 高密度資訊卡。
2. **指定轉播 (DESIGNATED_URL_BROADCAST)** — 「一台翻譯，全員共享」：主帳號翻譯後生成唯一校驗網址，團隊經 WebSocket/SSE 即時接收，附 Hash Lock 信任鏈。

---

## 5T 信任鏈範例

```
[ 原始起點 ] > Traceable > Trackable > Transparent > Tangible > Trustworthy (Hash Lock 固化)
```

每筆 BROADCAST_LOG 皆帶 `sourceOrigin`（可溯源）、`hash`（不可篡改）、`timestamp`（可追蹤）。

---

## 併入 esggo monorepo

已規劃掛載於 `esggo/apps/omni-blueprint-hub/`，共用 monorepo 的 `@lib/*` 與 `@/lib/*` alias 與 vitest 測試基礎設施。
