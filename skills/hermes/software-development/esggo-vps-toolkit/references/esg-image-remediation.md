# ESG Impact Note 圖片資產補全 — 缺口診斷與影像生成實戰

## 適用場景
子網頁 `ftg.esggo.co` ESG Impact Note 需要補全缺失的圖片資產，特別是：
- 員工回饋與感受 (Employee Feedback)
- 後續改善與行動建議 (Next Steps)
- 活動基本資訊與行程摘要 (Activity Info)

## 1. 缺口診斷方法

### 1.1 圖片品質檢查清單
```bash
# 檢查圖片是否為佔位圖/空白模板
for f in apps/ftg-3.0/public/images/esg-impact-note/*.png; do
  echo "=== $f ==="
  # 檢查檔案大小 (過小 = 可能空白)
  ls -lh "$f" | awk '{print $5}'
done

# 使用 image_analyze 驗證內容
# 或使用 vision_analyze 檢查是否有文字/數據/人物
```

### 1.2 AI 生成前內容驗證
```typescript
// 在 generate-esg-images.html 中加入驗證區塊
const TEMPLATE_SPECS = {
  "employee-feedback": {
    requiredElements: ["testimonial-card", "rating-stars", "quote"],
    minTextDensity: 50,  // 最小字元數
    minPeople: 1           // 至少1人
  },
  "next-steps": {
    requiredElements: ["action-item", "priority-badge", "timeline"],
    minTextDensity: 100,
    minActionItems: 3      // 至少3個行動項目
  },
  "activity-info": {
    requiredElements: ["itinerary", "metrics", "schedule"],
    minTextDensity: 100,
    minMetrics: 2          // 至少2項指標
  }
};
```

## 2. 影像生成工作流程

### 2.1 準備生成提示 (Prompt Engineering)
使用 `image_generate` 時，必須包含以下要素：

1. **明確的視覺元素清單** (not "some charts")
2. **確切的數據** (not "some numbers")
3. **FTG 品牌顏色** (#3c6e47, #c9a24b, #f3ede1, #10243f)
4. **RWD尺寸要求** (1024x768 for desktop)
5. **禁止的元素** (no placeholders, no "lorem ipsum", no empty fields)

### 2.2 生成驗證流程
```bash
# Step 1: Generate prompt with explicit content
image_generate --prompt "ESG Impact Note Employee Feedback. Three employee testimonial cards..."

# Step 2: Download PNG immediately
curl -L -o apps/ftg-3.0/public/images/esg-impact-note/employee-feedback-replacement-desktop.png <fal_url>

# Step 3: Verify size > 100KB (empty template usually < 50KB)
ls -lh apps/ftg-3.0/public/images/esg-impact-note/employee-feedback-replacement-desktop.png

# Step 4: Use vision_analyze 確認內容
# (Upload and verify there's actual content)
```

## 3. RWD 斷點管理

| 斷點 | 尺寸 | 用途 | 生成方式 |
|------|------|------|----------|
| Desktop | 1024×768 | 主要展示 | image_generate 首次生成 |
| Tablet | 768×1024 | 平板佈局 | 需要重新生成 (目前為 spec.json) |
| Mobile | 480×800 | 手機佈局 | 需要重新生成 (目前為 spec.json) |
| Compact | 360×640 | 小螢幕 | 需要重新生成 (目前為 spec.json) |

## 4. 常見陷阱 (Pitfalls)

1. **圖片生成後未下載**: AI 生成的 URL 在 24 小時內失效 → **必須立即 curl 下載**
2. **path 問題**: `cd /c/Project/esggo` 必須在 esggo 目錄下執行，不能用 C:\Users\dingj
3. **TypeScript 執行**: `node script.ts` 失敗 → 使用 `npx tsx script.ts`
4. **Puppeteer 缺失**: 全域安裝不會影響本地項目 → 使用 `generate-esg-images-fallback.js` (Node.js 原生)
5. **影像內容模糊**: AI 生成的人物圖可能文字無法辨識 → 在 prompt 中明確指定文字內容

## 5. 驗證指令

```bash
# 驗證所有圖片存在且非空
cd /c/Project/esggo
find apps/ftg-3.0/public/images/esg-impact-note/ -name "*.png" -size +50k | wc -l
# Expected: 3 (desktop sizes)

# 驗證 spec 文件完整
ls apps/ftg-3.0/public/images/esg-impact-note/*.spec.json | wc -l
# Expected: 15 (3 images x 4 breakpoints + 3 full-size + 3 combined)
```
