# 萬能即時翻譯 v2.2 本機獨立單檔架構與 1:1 極簡毛玻璃膠囊美學規範

## 一、 核心優勢與架構原理 (Architecture & Core Advantages)

在遠端 VPS / Cloudflare 邊緣路由面臨快取延遲、502 Bad Gateway 或跨域轉發問題時，**本機獨立單檔架構 (`萬能即時翻譯.html`)** 提供 100% 穩定秒開、零雲端依賴的最高可靠度。

### 1. 零雲端依賴本機執行鏈 (Zero-Cloud-Dependency Client Pipeline)
- **語音辨識**：直接調用 Chrome 核心 `webkitSpeechRecognition`，支援連續收音與中英動態自動識別。
- **極速免金鑰翻譯**：瀏覽器直連 Google GTX Single API (`translate.googleapis.com`) + MyMemory 備用通道，延遲 < 100ms。
- **全域跨視窗置頂**：原生支援 `documentPictureInPicture` 與 `Canvas PiP`，懸浮置頂於 Zoom 會議、YouTube 或任何桌面視窗上方。
- **同源 QR Code**：內嵌純演算法生成專屬房間 QR Code，零外鏈 CDN 依賴。

---

## 二、 1:1 像素級極簡半透明毛玻璃膠囊美學 (UI/UX Specification)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  [⚙️] [🔴 即時共享] [▶/⏸]     [ 🌐 英語 (原音) ⇆ 繁體中文 (翻譯) ]     [🔊] [📌] [⛶] [—] [✕] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  [上段：原音擷取字幕 (純白加粗 17px 700)]                                              │
│  for the customers without support that I think produced as I go to his family friends... │
│                                                                                        │
│  [下段：即時高精翻譯 (繁中清晰 19px 600)]                                              │
│  在我去他家朋友、也能接客製需求的過程中逐步製作出來的；他們也能讓客戶在不了解的情況下購買。 │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

- **膠囊容器**：`rgba(22, 27, 34, 0.94)`、`backdrop-filter: blur(28px) saturate(180%)`、`border-radius: 20px`、`border: 1px solid rgba(255, 255, 255, 0.14)`。
- **文字排版**：
  - **上段（英文原音）**：`#ffffff`、`font-size: 17px`、`font-weight: 700`、`line-height: 1.45`、Sans-serif。
  - **下段（繁中翻譯）**：`#f0f6fc`、`font-size: 19px`、`font-weight: 600`、`line-height: 1.5`、PingFang TC / 微軟正黑體。

---

## 三、 v2.2 雙階漸進式高精翻譯與術語校準 (High-Precision Pipeline)

1. **第一階（零延遲字流預覽）**：講者發言時以 100ms 毫秒級快速輸出預覽。
2. **第二階（整句語意 AI 上下文潤飾）**：當一句話停頓超過 400ms 時，自動觸發整句語意校準，將生硬直譯轉為符合台灣繁中語境的高級商務文法。
3. **商務 / 科技 / ESG 術語自動對齊**：
   - `ecosystem` ➔ `生態系`
   - `stakeholders` ➔ `利害關係人`
   - `initiatives` ➔ `專案倡議 / 策略行動`
   - `customized / custom` ➔ `客製化`
   - `sustainability` ➔ `永續發展`

---

## 四、 預設最佳化配置 (Optimal Defaults Checklist)

- [x] **`☑️ 系統音 (Zoom/YouTube)` 預設打勾**
- [x] **`☑️ 自動偵測語言` 預設打勾**
- [x] **預設語向**：`英語 (擷取) ➔ 繁中 (翻譯)`
- [x] **預設調用 Google Chrome 啟動**
- [x] **觀眾端純淨無按鈕 (`viewer.html`)**
