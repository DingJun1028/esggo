# Universal Translator：影音語音翻譯播放平台參考設計

配套 `esggo-best-practice-execution`，用於 `translate.esggo.co` 升級為影音語音翻譯播放平台的實作指引。

## 1. 產品需求（must-have）
- 英文語音 → 繁體中文字幕
- 飄浮式視窗（Picture-in-Picture）
- QR Code + 分享連結（含時間軸錨點）
- 精準度控制：back-translation + Glossary + 信心分數 + 人工覆核

## 2. 精準度門控管線
```
原始音訊 → Whisper STT → 原文逐字稿
    ↓
GPT-4o 翻譯（繁體中文） → 譯文逐字稿
    ↓
Back-Translation 驗證（譯文翻回原文，對比語意相似度）
    ↓
精準度評分：≥95% 自動通過，<95% 進入人工覆核
```
- 術語一致性：每段譯文強制對照 Glossary
- 信心分數：每段字幕標註 0-100%
- 低信心段落高亮，支援即時修正

## 3. 建議目錄
```
apps/universal-translator/
├── src/app/
│   ├── page.tsx                     # 主頁（影音播放器）
│   ├── floating/FloatingPlayer.tsx  # 飄浮視窗元件
│   ├── qr/QRShare.tsx               # QR Code + 分享連結
│   └── api/
│       ├── transcribe/route.ts      # Whisper STT
│       ├── translate/route.ts       # GPT-4o 翻譯
│       ├── verify/route.ts          # Back-translation 驗證
│       └── tts/route.ts             # 語音合成
├── src/lib/
│   ├── accuracy.ts                  # 精準度評分算法
│   ├── alignment.ts                 # 時間軸對齊
│   └── qrcode.ts                    # QR Code 生成
└── src/types/transcript.ts          # 逐字稿型別
```

## 4. 路由約定（5T）
- Traceable：每筆翻譯/字幕記錄 `source_origin` + Whisper segment id
- Trackable：字幕時間軸對齊使用 `alignment.ts`，可追溯 source_audio → transcript → translation
- Tangible：UI 提供字幕/播放/QR/分享可視互動
- Transparent：back-translation 差異比對公開可查
- Trustworthy：字幕段落寫入後 hash lock + 凍結

## 5. 關鍵檢查點
- `pnpm run typecheck` → exit 0
- `pnpm run check` → exit 0
- `pnpm test -- apps/universal-translator` → exit 0
- `pnpm run build` → exit 0
